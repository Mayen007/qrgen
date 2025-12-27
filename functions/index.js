/* eslint-env node */
import { config } from "dotenv";
import { onSchedule } from "firebase-functions/v2/scheduler";
import { onRequest } from "firebase-functions/v2/https";
import * as admin from "firebase-admin";
import Stripe from "stripe";

// Load environment variables from .env file (for local development)
config();

// Initialize Firebase Admin
admin.initializeApp();
const db = admin.firestore();

// Initialize Stripe with test key (replace with environment variable in production)
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "sk_test_YOUR_TEST_KEY_HERE", {
  apiVersion: "2023-10-16",
});

/**
 * Scheduled function to reset monthly QR code usage
 * Runs on the 1st day of each month at midnight UTC
 */
export const resetMonthlyUsage = onSchedule(
  {
    schedule: "0 0 1 * *", // Runs at 00:00 on the 1st day of each month
    timeZone: "UTC",
  },
  async () => {
    console.log("Starting monthly usage reset...");

    try {
      const usersSnapshot = await db.collection("users").get();
      const batch = db.batch();
      let count = 0;

      usersSnapshot.forEach((doc) => {
        const userRef = db.collection("users").doc(doc.id);

        // Calculate next month's reset date
        const nextResetDate = new Date();
        nextResetDate.setMonth(nextResetDate.getMonth() + 1);
        nextResetDate.setDate(1);
        nextResetDate.setHours(0, 0, 0, 0);

        batch.update(userRef, {
          qrCodesThisMonth: 0,
          monthlyResetDate: admin.firestore.Timestamp.fromDate(nextResetDate),
          updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        });

        count++;
      });

      await batch.commit();
      console.log(`Successfully reset usage for ${count} users`);

      return { success: true, usersReset: count };
    } catch (error) {
      console.error("Error resetting monthly usage:", error);
      throw error;
    }
  }
);

/**
 * Scheduled function to check and expire trials
 * Runs daily at midnight UTC
 */
export const checkTrialExpiration = onSchedule(
  {
    schedule: "0 0 * * *", // Runs daily at midnight UTC
    timeZone: "UTC",
  },
  async () => {
    console.log("Checking for expired trials...");

    try {
      const now = new Date();
      const usersSnapshot = await db
        .collection("users")
        .where("subscriptionStatus", "==", "trialing")
        .get();

      const batch = db.batch();
      let expiredCount = 0;

      usersSnapshot.forEach((doc) => {
        const userData = doc.data();
        const trialEndsAt = userData.trialEndsAt?.toDate();

        if (trialEndsAt && trialEndsAt < now) {
          const userRef = db.collection("users").doc(doc.id);
          batch.update(userRef, {
            subscriptionStatus: "inactive",
            tier: "free",
            updatedAt: admin.firestore.FieldValue.serverTimestamp(),
          });
          expiredCount++;
          console.log(`Expired trial for user: ${doc.id}`);
        }
      });

      await batch.commit();
      console.log(`Expired ${expiredCount} trials`);

      return { success: true, trialsExpired: expiredCount };
    } catch (error) {
      console.error("Error checking trial expiration:", error);
      throw error;
    }
  }
);

/**
 * HTTP function to create Stripe checkout session
 * Called from the Pricing page
 */
export const createCheckoutSession = onRequest(
  {
    cors: true,
    secrets: ["STRIPE_SECRET_KEY"],
  },
  async (request, response) => {
    // Verify user is authenticated
    const authHeader = request.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      response.status(401).send({ error: "Unauthorized" });
      return;
    }

    try {
      const idToken = authHeader.split("Bearer ")[1];
      const decodedToken = await admin.auth().verifyIdToken(idToken);
      const userId = decodedToken.uid;

      const { priceId, planType } = request.body;

      if (!priceId || !planType) {
        response.status(400).send({ error: "Missing required parameters" });
        return;
      }

      // Get or create Stripe customer
      const userDoc = await db.collection("users").doc(userId).get();
      const userData = userDoc.data();
      let customerId = userData?.customerId;

      if (!customerId) {
        const customer = await stripe.customers.create({
          email: userData?.email || decodedToken.email,
          metadata: {
            firebaseUID: userId,
          },
        });
        customerId = customer.id;

        // Save customer ID to Firestore
        await db.collection("users").doc(userId).update({
          customerId: customerId,
        });
      }

      // Create checkout session
      const session = await stripe.checkout.sessions.create({
        customer: customerId,
        mode: "subscription",
        payment_method_types: ["card"],
        line_items: [
          {
            price: priceId,
            quantity: 1,
          },
        ],
        success_url: `${request.headers.origin}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${request.headers.origin}/pricing`,
        metadata: {
          userId: userId,
          planType: planType,
        },
      });

      response.status(200).send({ sessionId: session.id, url: session.url });
    } catch (error) {
      console.error("Error creating checkout session:", error);
      response.status(500).send({ error: error.message });
    }
  }
);

/**
 * HTTP function to handle Stripe webhooks
 * Processes subscription events from Stripe
 */
export const stripeWebhook = onRequest(
  {
    cors: false,
    secrets: ["STRIPE_SECRET_KEY", "STRIPE_WEBHOOK_SECRET"],
  },
  async (request, response) => {
    const sig = request.headers["stripe-signature"];
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    let event;

    try {
      event = stripe.webhooks.constructEvent(
        request.rawBody,
        sig,
        webhookSecret
      );
    } catch (err) {
      console.error("Webhook signature verification failed:", err.message);
      response.status(400).send(`Webhook Error: ${err.message}`);
      return;
    }

    // Handle the event
    try {
      switch (event.type) {
        case "checkout.session.completed": {
          const session = event.data.object;
          const userId = session.metadata.userId;
          const subscriptionId = session.subscription;

          await db.collection("users").doc(userId).update({
            subscriptionId: subscriptionId,
            subscriptionStatus: "active",
            tier: session.metadata.planType || "pro",
            updatedAt: admin.firestore.FieldValue.serverTimestamp(),
          });

          console.log(`Subscription activated for user: ${userId}`);
          break;
        }

        case "customer.subscription.updated": {
          const subscription = event.data.object;
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
              currentPeriodStart: admin.firestore.Timestamp.fromDate(
                new Date(subscription.current_period_start * 1000)
              ),
              currentPeriodEnd: admin.firestore.Timestamp.fromDate(
                new Date(subscription.current_period_end * 1000)
              ),
              updatedAt: admin.firestore.FieldValue.serverTimestamp(),
            });

            console.log(`Subscription updated for user: ${userDoc.id}`);
          }
          break;
        }

        case "customer.subscription.deleted": {
          const subscription = event.data.object;
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
              updatedAt: admin.firestore.FieldValue.serverTimestamp(),
            });

            console.log(`Subscription canceled for user: ${userDoc.id}`);
          }
          break;
        }

        default:
          console.log(`Unhandled event type: ${event.type}`);
      }

      response.status(200).send({ received: true });
    } catch (error) {
      console.error("Error processing webhook:", error);
      response.status(500).send({ error: error.message });
    }
  }
);

/**
 * HTTP function to create customer portal session
 * Allows users to manage their subscription
 */
export const createPortalSession = onRequest(
  {
    cors: true,
    secrets: ["STRIPE_SECRET_KEY"],
  },
  async (request, response) => {
    const authHeader = request.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      response.status(401).send({ error: "Unauthorized" });
      return;
    }

    try {
      const idToken = authHeader.split("Bearer ")[1];
      const decodedToken = await admin.auth().verifyIdToken(idToken);
      const userId = decodedToken.uid;

      const userDoc = await db.collection("users").doc(userId).get();
      const customerId = userDoc.data()?.customerId;

      if (!customerId) {
        response.status(400).send({ error: "No customer ID found" });
        return;
      }

      const session = await stripe.billingPortal.sessions.create({
        customer: customerId,
        return_url: `${request.headers.origin}/dashboard`,
      });

      response.status(200).send({ url: session.url });
    } catch (error) {
      console.error("Error creating portal session:", error);
      response.status(500).send({ error: error.message });
    }
  }
);
