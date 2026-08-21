"use client";

import { useEffect } from "react";

export function ServiceWorkerRegister() {
  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;

    const register = async () => {
      try {
        await navigator.serviceWorker.register("/sw.js", { scope: "/" });
      } catch {
        // Ignore registration failures (unsupported browser / private mode).
      }
    };

    // Avoid racing Next.js HMR in development.
    if (process.env.NODE_ENV === "production") {
      void register();
      return;
    }

    const timer = window.setTimeout(() => {
      void register();
    }, 1500);
    return () => window.clearTimeout(timer);
  }, []);

  return null;
}
