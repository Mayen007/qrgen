import { useState, useEffect } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db, auth } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";
import { SubscriptionContext, TIER_LIMITS } from "../hooks/useSubscription";

export function SubscriptionProvider({ children }) {
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);

      if (currentUser) {
        // Subscribe to user profile document for real-time updates
        const userDocRef = doc(db, "users", currentUser.uid);

        const unsubscribeProfile = onSnapshot(
          userDocRef,
          (docSnapshot) => {
            if (docSnapshot.exists()) {
              setUserProfile(docSnapshot.data());
            } else {
              // User document doesn't exist yet (will be created on signup)
              setUserProfile(null);
            }
            setLoading(false);
          },
          (error) => {
            console.error("Error fetching user profile:", error);
            setLoading(false);
          }
        );

        // Return cleanup function for profile listener
        return () => unsubscribeProfile();
      } else {
        setUserProfile(null);
        setLoading(false);
      }
    });

    return () => unsubscribeAuth();
  }, []);

  // Calculate trial status
  const isTrialActive = () => {
    if (!userProfile || userProfile.subscriptionStatus !== "trialing") {
      return false;
    }

    const trialEndsAt = userProfile.trialEndsAt?.toDate() || new Date(0);
    return new Date() < trialEndsAt;
  };

  // Calculate days remaining in trial
  const getTrialDaysRemaining = () => {
    if (!isTrialActive()) return 0;

    const trialEndsAt = userProfile.trialEndsAt?.toDate() || new Date(0);
    const now = new Date();
    const diffTime = trialEndsAt - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return Math.max(0, diffDays);
  };

  // Get effective tier (Pro during trial, then actual tier)
  const getEffectiveTier = () => {
    if (!userProfile) return "free";

    if (isTrialActive()) {
      return "pro";
    }

    return userProfile.tier || "free";
  };

  // Get tier limits for current effective tier
  const getTierLimits = () => {
    const effectiveTier = getEffectiveTier();
    return TIER_LIMITS[effectiveTier] || TIER_LIMITS.free;
  };

  // Calculate QR codes remaining this month
  const getQRCodesRemaining = () => {
    const limits = getTierLimits();
    const used = userProfile?.qrCodesThisMonth || 0;

    if (limits.qrCodesPerMonth === Infinity) {
      return Infinity;
    }

    return Math.max(0, limits.qrCodesPerMonth - used);
  };

  // Check if user can generate a QR code
  const canGenerateQR = () => {
    const remaining = getQRCodesRemaining();
    return remaining > 0 || remaining === Infinity;
  };

  // Check if a specific feature is available
  const hasFeature = (featureName) => {
    const limits = getTierLimits();
    return limits.features[featureName] === true;
  };

  // Get max allowed QR size
  const getMaxQRSize = () => {
    const limits = getTierLimits();
    return limits.maxSize;
  };

  const value = {
    user,
    userProfile,
    loading,
    tier: userProfile?.tier || "free",
    effectiveTier: getEffectiveTier(),
    subscriptionStatus: userProfile?.subscriptionStatus || null,
    isTrialActive: isTrialActive(),
    trialDaysRemaining: getTrialDaysRemaining(),
    trialEndsAt: userProfile?.trialEndsAt?.toDate() || null,
    qrCodesThisMonth: userProfile?.qrCodesThisMonth || 0,
    qrCodesRemaining: getQRCodesRemaining(),
    canGenerateQR: canGenerateQR(),
    hasFeature,
    getMaxQRSize: getMaxQRSize(),
    tierLimits: getTierLimits(),
  };

  return (
    <SubscriptionContext.Provider value={value}>
      {children}
    </SubscriptionContext.Provider>
  );
}
