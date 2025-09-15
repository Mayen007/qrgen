import { collection, addDoc, serverTimestamp, doc, updateDoc, increment } from "firebase/firestore";
import { db } from "./firebase";

/**
 * Tracks a QR code scan event in analytics
 * @param {string} qrCodeId - The ID of the QR code being scanned
 * @param {string} userId - The ID of the user who owns the QR code
 * @param {Object} scanData - Additional data about the scan
 */
export const trackQRScan = async (qrCodeId, userId, scanData = {}) => {
  try {
    // Get browser/device information
    const userAgent = navigator.userAgent;
    const language = navigator.language;
    const platform = navigator.platform;

    // Get approximate location (country/timezone) if available
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    // Generate a session ID (simple approach)
    const sessionId = sessionStorage.getItem('qr_session_id') ||
      Math.random().toString(36).substring(2, 15);
    sessionStorage.setItem('qr_session_id', sessionId);

    // Create analytics record
    const analyticsData = {
      qrCodeId,
      userId, // Add userId for security rules
      timestamp: serverTimestamp(),
      userAgent,
      language,
      platform,
      timezone,
      sessionId,
      referrer: document.referrer || null,
      screenResolution: `${screen.width}x${screen.height}`,
      ...scanData, // Include any additional scan data
    };

    // Add to analytics collection
    await addDoc(collection(db, "analytics"), analyticsData);

    // Update scan count on the QR code document
    const qrCodeRef = doc(db, "qrcodes", qrCodeId);
    await updateDoc(qrCodeRef, {
      scanCount: increment(1),
      lastScannedAt: serverTimestamp(),
    });

    console.log("QR scan tracked successfully");
  } catch (error) {
    console.error("Error tracking QR scan:", error);
  }
};

/**
 * Simulates a QR code scan for testing purposes
 * This can be called from browser console or integrated into test flows
 * @param {string} qrCodeId - The ID of the QR code to simulate a scan for
 * @param {string} userId - The ID of the user who owns the QR code
 */
export const simulateQRScan = async (qrCodeId, userId) => {
  const scanData = {
    source: "simulation",
    testScan: true,
  };

  await trackQRScan(qrCodeId, userId, scanData);
  console.log(`Simulated scan for QR code: ${qrCodeId}`);
};/**
 * Tracks when a QR code is generated (different from scanned)
 * This is already handled in Dashboard.jsx but can be used elsewhere
 * @param {Object} qrData - QR code generation data
 */
export const trackQRGeneration = async (qrData) => {
  try {
    const generationData = {
      ...qrData,
      generatedAt: serverTimestamp(),
      userAgent: navigator.userAgent,
    };

    await addDoc(collection(db, "qrcodes"), generationData);
    console.log("QR generation tracked successfully");
  } catch (error) {
    console.error("Error tracking QR generation:", error);
  }
};

/**
 * Helper function to get device type from user agent
 * @param {string} userAgent - The user agent string
 * @returns {string} Device type (mobile, tablet, desktop)
 */
export const getDeviceType = (userAgent) => {
  if (/tablet|iPad/i.test(userAgent)) {
    return "tablet";
  } else if (/mobile|iPhone|iPod|Android|BlackBerry|Opera Mini|IEMobile/i.test(userAgent)) {
    return "mobile";
  } else {
    return "desktop";
  }
};

/**
 * Helper function to get browser name from user agent
 * @param {string} userAgent - The user agent string
 * @returns {string} Browser name
 */
export const getBrowserName = (userAgent) => {
  if (userAgent.includes("Chrome")) return "Chrome";
  if (userAgent.includes("Firefox")) return "Firefox";
  if (userAgent.includes("Safari")) return "Safari";
  if (userAgent.includes("Edge")) return "Edge";
  if (userAgent.includes("Opera")) return "Opera";
  return "Other";
};

export default {
  trackQRScan,
  simulateQRScan,
  trackQRGeneration,
  getDeviceType,
  getBrowserName,
};