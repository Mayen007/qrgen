import { useEffect, useRef } from "react";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase";

// Default inactivity timeout: 15 minutes (in ms)
const DEFAULT_TIMEOUT = 15 * 60 * 1000;

export default function useInactivityLogout(timeout = DEFAULT_TIMEOUT) {
  const navigate = useNavigate();
  const timerRef = useRef();

  useEffect(() => {
    const resetTimer = () => {
      clearTimeout(timerRef.current);
      timerRef.current = setTimeout(async () => {
        await signOut(auth);
        navigate("/login");
      }, timeout);
    };

    // List of events that indicate user activity
    const events = [
      "mousemove",
      "keydown",
      "mousedown",
      "touchstart",
      "scroll",
    ];

    events.forEach((event) => {
      window.addEventListener(event, resetTimer);
    });

    resetTimer(); // Start timer on mount

    return () => {
      clearTimeout(timerRef.current);
      events.forEach((event) => {
        window.removeEventListener(event, resetTimer);
      });
    };
  }, [timeout, navigate]);
}
