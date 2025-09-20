import {
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  GoogleAuthProvider
} from "firebase/auth";
import { auth, googleProvider } from "../firebase";

/**
 * Attempt Google authentication with popup, fallback to redirect if blocked
 * @param {function} onSuccess - Callback for successful authentication
 * @param {function} onError - Callback for handling errors
 * @returns {Promise<void>}
 */
export const handleGoogleAuth = async (onSuccess, onError) => {
  try {
    // First try popup authentication
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;

    console.log("Google authentication successful (popup):", user.displayName);
    onSuccess(user);

  } catch (error) {
    console.error("Popup authentication failed:", error);

    // Handle specific popup-related errors by falling back to redirect
    if (
      error.code === "auth/popup-blocked" ||
      error.code === "auth/popup-closed-by-user" ||
      error.code === "auth/cancelled-popup-request" ||
      error.message.includes("Cross-Origin-Opener-Policy") ||
      error.message.includes("window.closed") ||
      error.message.includes("popup") ||
      error.name === "TypeError"
    ) {
      console.log("Falling back to redirect authentication...");
      console.log("Error details:", error.message);

      try {
        // Use redirect as fallback
        await signInWithRedirect(auth, googleProvider);
        // Note: The redirect will reload the page, so we won't reach this point
        // The result will be handled by getRedirectResult in the app initialization
      } catch (redirectError) {
        console.error("Redirect authentication also failed:", redirectError);
        onError(redirectError);
      }
    } else {
      // Handle other authentication errors
      onError(error);
    }
  }
};

/**
 * Check for redirect result on app initialization
 * @param {function} onSuccess - Callback for successful authentication
 * @param {function} onError - Callback for handling errors
 * @returns {Promise<void>}
 */
export const checkRedirectResult = async (onSuccess, onError) => {
  try {
    const result = await getRedirectResult(auth);

    if (result) {
      const user = result.user;
      console.log("Google authentication successful (redirect):", user.displayName);
      onSuccess(user);
    }
  } catch (error) {
    console.error("Redirect result error:", error);
    onError(error);
  }
};

/**
 * Get user-friendly error message for authentication errors
 * @param {Error} error - Firebase auth error
 * @returns {string} User-friendly error message
 */
export const getAuthErrorMessage = (error) => {
  switch (error.code) {
    case "auth/popup-closed-by-user":
      return "Sign-in was cancelled. Please try again.";
    case "auth/popup-blocked":
      return "Pop-up was blocked by your browser. Redirecting to sign-in page...";
    case "auth/network-request-failed":
      return "Network error. Please check your connection and try again.";
    case "auth/too-many-requests":
      return "Too many failed attempts. Please try again later.";
    case "auth/cancelled-popup-request":
      return "Another sign-in process is in progress. Please wait.";
    case "auth/operation-not-allowed":
      return "Google sign-in is not enabled. Please contact support.";
    case "auth/user-disabled":
      return "This account has been disabled. Please contact support.";
    case "auth/account-exists-with-different-credential":
      return "An account already exists with the same email but different sign-in method.";
    case "auth/web-storage-unsupported":
      return "Your browser doesn't support web storage. Please enable cookies and try again.";
    default:
      if (error.message.includes("Cross-Origin-Opener-Policy") ||
        error.message.includes("window.closed") ||
        error.message.includes("popup")) {
        return "Browser security blocked the sign-in popup. Redirecting to sign-in page...";
      }
      if (error.name === "TypeError" && error.message.includes("window")) {
        return "Sign-in popup was blocked. Using redirect method instead...";
      }
      return "Failed to sign in with Google. Please try again.";
  }
};