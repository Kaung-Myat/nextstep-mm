"use client";

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";

import type { CachedAdvisorChat } from "@/components/advisor/advisor-chat-cache";

export type AdvisorSessionApi = {
  chats: CachedAdvisorChat[];
  activeId: string | null;
  onNewChat: () => void;
  onOpenChat: (chatId: string) => void;
  onDeleteChat: (chatId: string) => void;
};

type AdvisorChromeContextValue = {
  menuOpen: boolean;
  openMenu: () => void;
  closeMenu: () => void;
  modelPickerOpen: boolean;
  openModelPicker: () => void;
  closeModelPicker: () => void;
  session: AdvisorSessionApi | null;
  bindSession: (api: AdvisorSessionApi | null) => void;
};

const AdvisorChromeContext = createContext<AdvisorChromeContextValue | null>(null);

export function AdvisorChromeProvider({ children }: { children: ReactNode }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [modelPickerOpen, setModelPickerOpen] = useState(false);
  const [session, setSession] = useState<AdvisorSessionApi | null>(null);

  const bindSession = useCallback((api: AdvisorSessionApi | null) => {
    setSession(api);
    if (!api) {
      setMenuOpen(false);
      setModelPickerOpen(false);
    }
  }, []);

  const value = useMemo(
    () => ({
      menuOpen,
      openMenu: () => {
        setModelPickerOpen(false);
        setMenuOpen(true);
      },
      closeMenu: () => setMenuOpen(false),
      modelPickerOpen,
      openModelPicker: () => {
        setMenuOpen(false);
        setModelPickerOpen(true);
      },
      closeModelPicker: () => setModelPickerOpen(false),
      session,
      bindSession,
    }),
    [menuOpen, modelPickerOpen, session, bindSession],
  );

  return <AdvisorChromeContext.Provider value={value}>{children}</AdvisorChromeContext.Provider>;
}

export function useAdvisorChrome() {
  const value = useContext(AdvisorChromeContext);
  if (!value) throw new Error("useAdvisorChrome must be used within AdvisorChromeProvider");
  return value;
}
