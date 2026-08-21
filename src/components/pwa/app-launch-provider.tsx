"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { usePathname } from "next/navigation";

import { InstallPromptDialog, shouldOfferInstall } from "@/components/pwa/install-prompt";
import { ServiceWorkerRegister } from "@/components/pwa/service-worker-register";
import { SplashScreen } from "@/components/pwa/splash-screen";
import { startInstallCapture } from "@/components/pwa/use-deferred-install";
import { usePreferences } from "@/components/preferences/preferences-provider";

const SPLASH_SESSION_KEY = "nextstep-splash-shown";
const SPLASH_MS = 1800;

type AppLaunchContextValue = {
  splashVisible: boolean;
  ready: boolean;
  requestInstallPrompt: () => void;
};

const AppLaunchContext = createContext<AppLaunchContextValue | null>(null);

export function useAppLaunch() {
  const value = useContext(AppLaunchContext);
  if (!value) throw new Error("useAppLaunch must be used within AppLaunchProvider");
  return value;
}

export function AppLaunchProvider({ children }: { children: ReactNode }) {
  const { copy } = usePreferences();
  const pathname = usePathname();
  const [splashVisible, setSplashVisible] = useState(true);
  const [ready, setReady] = useState(false);
  const [installOpen, setInstallOpen] = useState(false);

  useEffect(() => {
    startInstallCapture();
  }, []);

  useEffect(() => {
    try {
      if (sessionStorage.getItem(SPLASH_SESSION_KEY) === "1") {
        setSplashVisible(false);
        setReady(true);
        return;
      }
    } catch {
      // ignore
    }

    const timer = window.setTimeout(() => {
      try {
        sessionStorage.setItem(SPLASH_SESSION_KEY, "1");
      } catch {
        // ignore
      }
      setSplashVisible(false);
      window.setTimeout(() => setReady(true), 320);
    }, SPLASH_MS);

    return () => window.clearTimeout(timer);
  }, []);

  const requestInstallPrompt = useCallback(() => {
    if (!shouldOfferInstall()) return;
    setInstallOpen(true);
  }, []);

  useEffect(() => {
    if (!ready || splashVisible) return;
    if (pathname === "/onboarding") return;
    if (!shouldOfferInstall()) return;

    try {
      if (sessionStorage.getItem("nextstep-install-offered") === "1") return;
      sessionStorage.setItem("nextstep-install-offered", "1");
    } catch {
      // ignore
    }

    const timer = window.setTimeout(() => setInstallOpen(true), 700);
    return () => window.clearTimeout(timer);
  }, [pathname, ready, splashVisible]);

  const value = useMemo(
    () => ({ splashVisible, ready, requestInstallPrompt }),
    [splashVisible, ready, requestInstallPrompt],
  );

  return (
    <AppLaunchContext.Provider value={value}>
      <ServiceWorkerRegister />
      <SplashScreen visible={splashVisible} title={copy.pwa.splashTitle} subtitle={copy.pwa.splashSubtitle} />
      <div
        className={splashVisible ? "pointer-events-none opacity-0" : "opacity-100 transition-opacity duration-500"}
        aria-hidden={splashVisible}
      >
        {children}
      </div>
      <InstallPromptDialog open={installOpen && ready && !splashVisible} onClose={() => setInstallOpen(false)} />
    </AppLaunchContext.Provider>
  );
}
