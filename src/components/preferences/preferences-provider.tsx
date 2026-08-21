"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

import { messages, type AppMessages } from "@/i18n/messages";

export type ThemePreference = "light" | "dark" | "system";
export type AppLocale = "en" | "my";

export const FONT_SCALE_MIN = 0.85;
export const FONT_SCALE_MAX = 1.3;
export const FONT_SCALE_STEP = 0.05;
export const FONT_SCALE_DEFAULT = 1;
export const FONT_SCALE_STORAGE_KEY = "nextstep-font-scale";

type PreferencesContextValue = {
  theme: ThemePreference;
  locale: AppLocale;
  fontScale: number;
  copy: AppMessages;
  setTheme: (theme: ThemePreference) => void;
  setLocale: (locale: AppLocale) => void;
  setFontScale: (scale: number, anchor?: HTMLElement | null) => void;
};

const PreferencesContext = createContext<PreferencesContextValue | null>(null);

function resolveTheme(preference: ThemePreference) {
  return preference === "system" ? (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light") : preference;
}

export function clampFontScale(value: number) {
  const stepped = Math.round(value / FONT_SCALE_STEP) * FONT_SCALE_STEP;
  return Math.min(FONT_SCALE_MAX, Math.max(FONT_SCALE_MIN, Number(stepped.toFixed(2))));
}

export function applyFontScale(scale: number, anchor?: HTMLElement | null) {
  const next = clampFontScale(scale);
  const anchorTop = anchor?.getBoundingClientRect().top;
  document.documentElement.style.setProperty("--app-font-scale", String(next));
  document.documentElement.dataset.fontScale = String(next);

  if (!anchor || anchorTop === undefined) return;

  const restore = () => {
    const nextTop = anchor.getBoundingClientRect().top;
    const delta = nextTop - anchorTop;
    if (Math.abs(delta) > 0.5) window.scrollBy(0, delta);
  };

  restore();
  requestAnimationFrame(() => {
    restore();
    requestAnimationFrame(restore);
  });
}

export function PreferencesProvider({ children }: { children: ReactNode }) {
  const [theme, updateTheme] = useState<ThemePreference>("system");
  const [locale, updateLocale] = useState<AppLocale>("en");
  const [fontScale, updateFontScale] = useState(FONT_SCALE_DEFAULT);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const savedTheme = localStorage.getItem("nextstep-theme") as ThemePreference | null;
      const savedLocale = localStorage.getItem("nextstep-locale") as AppLocale | null;
      const savedScale = localStorage.getItem(FONT_SCALE_STORAGE_KEY);
      if (savedTheme && ["light", "dark", "system"].includes(savedTheme)) updateTheme(savedTheme);
      if (savedLocale && ["en", "my"].includes(savedLocale)) updateLocale(savedLocale);
      if (savedScale) {
        const parsed = Number.parseFloat(savedScale);
        if (Number.isFinite(parsed)) {
          const next = clampFontScale(parsed);
          updateFontScale(next);
          applyFontScale(next);
        }
      }
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const apply = () => {
      document.documentElement.dataset.theme = resolveTheme(theme);
    };
    apply();
    media.addEventListener("change", apply);
    return () => media.removeEventListener("change", apply);
  }, [theme]);

  useEffect(() => {
    document.documentElement.lang = locale === "my" ? "my" : "en";
    document.documentElement.dataset.locale = locale;
  }, [locale]);

  function setTheme(value: ThemePreference) {
    updateTheme(value);
    localStorage.setItem("nextstep-theme", value);
  }

  function setLocale(value: AppLocale) {
    updateLocale(value);
    localStorage.setItem("nextstep-locale", value);
  }

  function setFontScale(value: number, anchor?: HTMLElement | null) {
    const next = clampFontScale(value);
    updateFontScale(next);
    localStorage.setItem(FONT_SCALE_STORAGE_KEY, String(next));
    applyFontScale(next, anchor);
  }

  return (
    <PreferencesContext.Provider value={{ theme, locale, fontScale, copy: messages[locale], setTheme, setLocale, setFontScale }}>
      {children}
    </PreferencesContext.Provider>
  );
}

export function usePreferences() {
  const value = useContext(PreferencesContext);
  // Fast Refresh can briefly remount children outside the provider; fall back instead of crashing.
  if (!value) {
    return {
      theme: "system" as ThemePreference,
      locale: "en" as AppLocale,
      fontScale: FONT_SCALE_DEFAULT,
      copy: messages.en,
      setTheme: () => undefined,
      setLocale: () => undefined,
      setFontScale: () => undefined,
    };
  }
  return value;
}
