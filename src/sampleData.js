import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "./firebase";

/**
 * Creates sample QR codes and analytics data for testing
 * This function should only be used in development for testing purposes
 * @param {string} userId - The user ID to create sample data for
 */
export const createSampleData = async (userId) => {
  try {
    console.log("Creating sample QR codes and analytics data...");

    // Sample QR codes
    const sampleQRCodes = [
      {
        userId,
        type: "url",
        content: "https://example.com",
        title: "Company Website",
        settings: { color: "#000000", bgColor: "#ffffff", size: 256 },
        createdAt: serverTimestamp(),
        scanCount: 0,
      },
      {
        userId,
        type: "wifi",
        content: "WIFI:T:WPA;S:MyWiFi;P:password123;;",
        title: "WiFi: MyWiFi",
        settings: { color: "#000000", bgColor: "#ffffff", size: 256 },
        createdAt: serverTimestamp(),
        scanCount: 0,
      },
      {
        userId,
        type: "contact",
        content: "BEGIN:VCARD\nVERSION:3.0\nFN:John Doe\nORG:Company\nTEL:+1234567890\nEMAIL:john@example.com\nEND:VCARD",
        title: "Contact: John Doe",
        settings: { color: "#000000", bgColor: "#ffffff", size: 256 },
        createdAt: serverTimestamp(),
        scanCount: 0,
      },
      {
        userId,
        type: "text",
        content: "Welcome to our event! Visit booth 42 for special discounts.",
        title: "Welcome to our event! Visit booth 42 for sp...",
        settings: { color: "#000000", bgColor: "#ffffff", size: 256 },
        createdAt: serverTimestamp(),
        scanCount: 0,
      },
    ];

    // Create QR codes and collect their IDs
    const qrCodeIds = [];
    for (const qrCode of sampleQRCodes) {
      const docRef = await addDoc(collection(db, "qrcodes"), qrCode);
      qrCodeIds.push(docRef.id);
      console.log(`Created QR code: ${qrCode.title}`);
    }

    // Generate sample analytics data for the past 30 days
    const now = new Date();
    const analyticsData = [];

    for (let i = 0; i < 30; i++) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);

      // Random number of scans per day (0-15)
      const scansPerDay = Math.floor(Math.random() * 16);

      for (let j = 0; j < scansPerDay; j++) {
        // Random time during the day
        const scanTime = new Date(date);
        scanTime.setHours(Math.floor(Math.random() * 24));
        scanTime.setMinutes(Math.floor(Math.random() * 60));

        // Random QR code
        const qrCodeId = qrCodeIds[Math.floor(Math.random() * qrCodeIds.length)];

        // Random device/browser data
        const userAgents = [
          "Mozilla/5.0 (iPhone; CPU iPhone OS 14_7_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1.2 Mobile/15E148 Safari/604.1",
          "Mozilla/5.0 (Android 11; Mobile; rv:92.0) Gecko/92.0 Firefox/92.0",
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/93.0.4577.63 Safari/537.36",
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1.2 Safari/605.1.15",
          "Mozilla/5.0 (iPad; CPU OS 14_7_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1.2 Mobile/15E148 Safari/604.1",
        ];

        const languages = ["en-US", "es-ES", "fr-FR", "de-DE", "pt-BR"];
        const timezones = ["America/New_York", "Europe/London", "Asia/Tokyo", "America/Los_Angeles", "Europe/Paris"];

        const analytics = {
          qrCodeId,
          userId,
          timestamp: serverTimestamp(),
          userAgent: userAgents[Math.floor(Math.random() * userAgents.length)],
          language: languages[Math.floor(Math.random() * languages.length)],
          platform: Math.random() > 0.5 ? "MacIntel" : "Win32",
          timezone: timezones[Math.floor(Math.random() * timezones.length)],
          sessionId: Math.random().toString(36).substring(2, 15),
          referrer: Math.random() > 0.7 ? "https://google.com" : null,
          screenResolution: Math.random() > 0.5 ? "1920x1080" : "375x667",
          source: "test_data",
        };

        analyticsData.push(analytics);
      }
    }

    // Batch create analytics data
    for (const analytics of analyticsData) {
      await addDoc(collection(db, "analytics"), analytics);
    }

    console.log(`Created ${analyticsData.length} sample analytics records`);
    console.log("Sample data creation complete!");

  } catch (error) {
    console.error("Error creating sample data:", error);
  }
};

/**
 * Utility to clear all test data (use with caution)
 * @param {string} userId - The user ID to clear data for
 */
export const clearSampleData = async (userId) => {
  console.warn("clearSampleData function would need to be implemented with proper Firestore delete operations");
  console.warn("For safety, this is not implemented in this demo version");
  console.warn(`Would clear data for user: ${userId}`);
};

// Export for browser console access during development
window.createSampleData = createSampleData;
window.clearSampleData = clearSampleData;

export default {
  createSampleData,
  clearSampleData,
};