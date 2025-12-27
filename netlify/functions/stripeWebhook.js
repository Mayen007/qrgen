/* eslint-env node */
import Stripe from "stripe";
import { initializeApp, cert } from "firebase-admin/app";
import { getFirestore, FieldValue, Timestamp } from "firebase-admin/firestore";

// Initialize Firebase Admin (only once)
try {
  initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    }),
  });
} catch {
  // App already initialized
}

const db = getFirestore();

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2023-10-16",
});

export const handler = async (event) => {
  // Only allow POST
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Method not allowed" }),
    };
  }

  const sig = event.headers["stripe-signature"];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let stripeEvent;

  try {
    stripeEvent = stripe.webhooks.constructEvent(event.body, sig, webhookSecret);
  } catch (err) {
    console.error("Webhook signature verification failed:", err.message);
    return {
      statusCode: 400,
      body: JSON.stringify({ error: `Webhook Error: ${err.message}` }),
    };
  }

  // Handle the event
  try {
    switch (stripeEvent.type) {
      case "checkout.session.completed": {
        const session = stripeEvent.data.object;
        const userId = session.metadata.userId;
        const subscriptionId = session.subscription;

        await db.collection("users").doc(userId).update({
          subscriptionId: subscriptionId,
          subscriptionStatus: "active",
          tier: session.metadata.planType || "pro",
          updatedAt: FieldValue.serverTimestamp(),
        });

        console.log(`Subscription activated for user: ${userId}`);
        break;
      }

      case "customer.subscription.updated": {
        const subscription = stripeEvent.data.object;
        const customerId = subscription.customer;

        // Find user by customerId
        const userSnapshot = await db
          .collection("users")
          .where("customerId", "==", customerId)
          .limit(1)
          .get();

        if (!userSnapshot.empty) {
          const userDoc = userSnapshot.docs[0];
          await userDoc.ref.update({
            subscriptionStatus: subscription.status,
            currentPeriodStart: Timestamp.fromDate(
              new Date(subscription.current_period_start * 1000)
            ),
            currentPeriodEnd: Timestamp.fromDate(
              new Date(subscription.current_period_end * 1000)
            ),
            updatedAt: FieldValue.serverTimestamp(),
          });

          console.log(`Subscription updated for user: ${userDoc.id}`);
        }
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = stripeEvent.data.object;
        const customerId = subscription.customer;

        // Find user by customerId
        const userSnapshot = await db
          .collection("users")
          .where("customerId", "==", customerId)
          .limit(1)
          .get();

        if (!userSnapshot.empty) {
          const userDoc = userSnapshot.docs[0];
          await userDoc.ref.update({
            tier: "free",
            subscriptionStatus: "canceled",
            updatedAt: FieldValue.serverTimestamp(),
          });

          console.log(`Subscription canceled for user: ${userDoc.id}`);
        }
        break;
      }

      default:
        console.log(`Unhandled event type: ${stripeEvent.type}`);
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ received: true }),
    };
  } catch (error) {
    console.error("Error processing webhook:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
