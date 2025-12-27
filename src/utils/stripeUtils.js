import { loadStripe } from "@stripe/stripe-js";
import { auth } from "../firebase";

// Initialize Stripe with test publishable key
// Replace with your actual Stripe test key
const stripePromise = loadStripe("pk_test_YOUR_PUBLISHABLE_KEY_HERE");

/**
 * Creates a Stripe checkout session and redirects to checkout
 * @param {string} priceId - Stripe Price ID for the plan
 * @param {string} planType - Plan type (pro or enterprise)
 */
export async function createCheckoutSession(priceId, planType) {
  try {
    const user = auth.currentUser;
    if (!user) {
      throw new Error("User must be authenticated");
    }

    // Get ID token for authentication
    const idToken = await user.getIdToken();

    // Call Netlify Function to create checkout session
    const functionUrl = import.meta.env.DEV
      ? "http://localhost:8888/.netlify/functions/createCheckoutSession"
      : "/.netlify/functions/createCheckoutSession";

    const response = await fetch(functionUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${idToken}`,
      },
      body: JSON.stringify({
        priceId,
        planType,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to create checkout session");
    }

    const { sessionId } = await response.json();

    // Redirect to Stripe Checkout
    const stripe = await stripePromise;
    const { error } = await stripe.redirectToCheckout({ sessionId });

    if (error) {
      throw error;
    }
  } catch (error) {
    console.error("Error creating checkout session:", error);
    throw error;
  }
}

/**
 * Creates a customer portal session for subscription management
 */
export async function createPortalSession() {
  try {
    const user = auth.currentUser;
    if (!user) {
      throw new Error("User must be authenticated");
    }

    const idToken = await user.getIdToken();

    const functionUrl = import.meta.env.DEV
      ? "http://localhost:8888/.netlify/functions/createPortalSession"
      : "/.netlify/functions/createPortalSession";

    const response = await fetch(functionUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${idToken}`,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to create portal session");
    }

    const { url } = await response.json();

    // Redirect to customer portal
    window.location.href = url;
  } catch (error) {
    console.error("Error creating portal session:", error);
    throw error;
  }
}

// Stripe Price IDs (Test mode - replace with your actual IDs)
export const STRIPE_PRICES = {
  pro_monthly: "price_1SZwprFhxY41rhOi8PTD05y0",
  pro_annual: "price_1SZwrNFhxY41rhOihQ0wDLjG",
  enterprise_monthly: "price_test_enterprise_monthly_id",
  enterprise_annual: "price_test_enterprise_annual_id",
};
