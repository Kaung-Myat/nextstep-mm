"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { usePathname } from "next/navigation";

import type { AdvisorMessage } from "@/components/advisor/advisor-data";
import {
  createMessageId,
  persistAdvisorChatMessages,
  readAdvisorChatCache,
} from "@/components/advisor/advisor-chat-cache";
import { usePreferences } from "@/components/preferences/preferences-provider";
import { useToast } from "@/components/ui/toast";

export type AdvisorSendInput = {
  chatId: string;
  messages: AdvisorMessage[];
  provider: string;
  modelId: string;
  apiKey: string;
  fallbackTitle: string;
};

export type AdvisorCompletedEvent = {
  chatId: string;
  replyId: string;
  messages: AdvisorMessage[];
  at: number;
};

type AdvisorRequestContextValue = {
  busy: boolean;
  pendingChatId: string | null;
  lastError: string | null;
  lastErrorChatId: string | null;
  lastCompleted: AdvisorCompletedEvent | null;
  clearError: () => void;
  send: (input: AdvisorSendInput) => void;
};

const AdvisorRequestContext = createContext<AdvisorRequestContextValue | null>(null);

export function AdvisorProvider({ children }: { children: ReactNode }) {
  const { copy } = usePreferences();
  const { showToast } = useToast();
  const pathname = usePathname();
  const pathnameRef = useRef(pathname);
  pathnameRef.current = pathname;
  const runningRef = useRef(false);

  const [busy, setBusy] = useState(false);
  const [pendingChatId, setPendingChatId] = useState<string | null>(null);
  const [lastError, setLastError] = useState<string | null>(null);
  const [lastErrorChatId, setLastErrorChatId] = useState<string | null>(null);
  const [lastCompleted, setLastCompleted] = useState<AdvisorCompletedEvent | null>(null);

  const clearError = useCallback(() => {
    setLastError(null);
    setLastErrorChatId(null);
  }, []);

  const send = useCallback(
    (input: AdvisorSendInput) => {
      if (runningRef.current) return;
      runningRef.current = true;
      setBusy(true);
      setPendingChatId(input.chatId);
      setLastError(null);
      setLastErrorChatId(null);

      void (async () => {
        try {
          const response = await fetch("/api/advisor/chat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              provider: input.provider,
              modelId: input.modelId,
              apiKey: input.apiKey,
              messages: input.messages.map((message) => ({
                role: message.role,
                content: message.content,
              })),
            }),
          });
          const payload = (await response.json()) as { reply?: string; error?: string };
          if (!response.ok || !payload.reply) {
            throw new Error(payload.error ?? copy.advisor.requestFailed);
          }

          // Drop reply if the chat was deleted while the request was in flight.
          const cache = readAdvisorChatCache();
          if (!cache.chats.some((chat) => chat.id === input.chatId)) {
            return;
          }

          const replyId = createMessageId();
          const withReply: AdvisorMessage[] = [
            ...input.messages,
            { id: replyId, role: "assistant", content: payload.reply },
          ];
          // Persist outside React setState so unmount cannot drop the reply.
          persistAdvisorChatMessages(input.chatId, withReply, input.fallbackTitle, true);

          setLastCompleted({
            chatId: input.chatId,
            replyId,
            messages: withReply,
            at: Date.now(),
          });

          if (!pathnameRef.current.startsWith("/advisor")) {
            showToast({
              tone: "success",
              title: copy.advisor.replyReadyTitle,
              description: copy.advisor.replyReadyDescription,
            });
          }
        } catch (err) {
          const message = err instanceof Error ? err.message : copy.advisor.requestFailed;
          setLastError(message);
          setLastErrorChatId(input.chatId);
          if (!pathnameRef.current.startsWith("/advisor")) {
            showToast({
              tone: "error",
              title: copy.advisor.requestFailed,
              description: message,
            });
          }
        } finally {
          runningRef.current = false;
          setBusy(false);
          setPendingChatId(null);
        }
      })();
    },
    [copy.advisor.replyReadyDescription, copy.advisor.replyReadyTitle, copy.advisor.requestFailed, showToast],
  );

  const value = useMemo(
    () => ({
      busy,
      pendingChatId,
      lastError,
      lastErrorChatId,
      lastCompleted,
      clearError,
      send,
    }),
    [busy, pendingChatId, lastError, lastErrorChatId, lastCompleted, clearError, send],
  );

  return <AdvisorRequestContext.Provider value={value}>{children}</AdvisorRequestContext.Provider>;
}

export function useAdvisorRequest() {
  const value = useContext(AdvisorRequestContext);
  if (!value) throw new Error("useAdvisorRequest must be used within AdvisorProvider");
  return value;
}
