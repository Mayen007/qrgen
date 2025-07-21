// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCEDrRTVZJtenu06wMiU5OBNelmqHHgazI",
  authDomain: "qrgen-f0568.firebaseapp.com",
  projectId: "qrgen-f0568",
  storageBucket: "qrgen-f0568.firebasestorage.app",
  messagingSenderId: "476923104832",
  appId: "1:476923104832:web:4ae9f69544d5341be799a5",
  measurementId: "G-N7Q42VVTE6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
// const analytics = getAnalytics(app);

export { app, auth };