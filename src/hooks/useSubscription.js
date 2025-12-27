import { useContext } from "react";
import { createContext } from "react";

// Create context (must be imported from SubscriptionContext.jsx)
export const SubscriptionContext = createContext();

// Tier limits configuration
export const TIER_LIMITS = {
  free: {
    qrCodesPerMonth: 5,
    maxSize: 256,
    features: {
      basicCustomization: true,
      advancedCustomization: false,
      highResolution: false,
      analytics: false,
      dynamicQR: false,
      logoIntegration: false,
      passwordProtection: false,
    },
  },
  pro: {
    qrCodesPerMonth: Infinity,
    maxSize: 512,
    features: {
      basicCustomization: true,
      advancedCustomization: true,
      highResolution: true,
      analytics: true,
      dynamicQR: true,
      logoIntegration: true,
      passwordProtection: true,
    },
  },
  enterprise: {
    qrCodesPerMonth: Infinity,
    maxSize: 1024,
    features: {
      basicCustomization: true,
      advancedCustomization: true,
      highResolution: true,
      analytics: true,
      dynamicQR: true,
      logoIntegration: true,
      passwordProtection: true,
      teamCollaboration: true,
      bulkOperations: true,
      apiAccess: true,
      customBranding: true,
    },
  },
};

// Custom hook to use subscription context
export function useSubscription() {
  const context = useContext(SubscriptionContext);
  if (context === undefined) {
    throw new Error(
      "useSubscription must be used within a SubscriptionProvider"
    );
  }
  return context;
}
