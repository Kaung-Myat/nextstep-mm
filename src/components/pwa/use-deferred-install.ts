"use client";

import { useCallback, useEffect, useState } from "react";

export type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

type InstallListener = () => void;

let deferredPrompt: BeforeInstallPromptEvent | null = null;
let captureStarted = false;
const listeners = new Set<InstallListener>();

function notify() {
  listeners.forEach((listener) => listener());
}

/** Call once on the client so the browser install event is never missed. */
export function startInstallCapture() {
  if (typeof window === "undefined" || captureStarted) return;
  captureStarted = true;

  window.addEventListener("beforeinstallprompt", (event) => {
    event.preventDefault();
    deferredPrompt = event as BeforeInstallPromptEvent;
    notify();
  });

  window.addEventListener("appinstalled", () => {
    deferredPrompt = null;
    notify();
  });
}

export function getDeferredInstallPrompt() {
  return deferredPrompt;
}

export function clearDeferredInstallPrompt() {
  deferredPrompt = null;
  notify();
}

export function isStandaloneDisplay() {
  if (typeof window === "undefined") return false;
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    ("standalone" in window.navigator &&
      Boolean((window.navigator as Navigator & { standalone?: boolean }).standalone))
  );
}

export function isIosDevice() {
  if (typeof window === "undefined") return false;
  return /iphone|ipad|ipod/i.test(window.navigator.userAgent);
}

export function useDeferredInstall() {
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(null);
  const [standalone, setStandalone] = useState(false);
  const [ios, setIos] = useState(false);

  useEffect(() => {
    startInstallCapture();
    setDeferred(getDeferredInstallPrompt());
    setStandalone(isStandaloneDisplay());
    setIos(isIosDevice());

    const sync = () => setDeferred(getDeferredInstallPrompt());
    listeners.add(sync);
    return () => {
      listeners.delete(sync);
    };
  }, []);

  const promptInstall = useCallback(async () => {
    const event = getDeferredInstallPrompt();
    if (!event) return { outcome: "unavailable" as const };

    await event.prompt();
    const choice = await event.userChoice;
    clearDeferredInstallPrompt();
    return { outcome: choice.outcome };
  }, []);

  return {
    deferred,
    canPrompt: Boolean(deferred) && !standalone,
    standalone,
    ios,
    promptInstall,
  };
}
