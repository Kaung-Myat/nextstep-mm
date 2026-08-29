"use client";

import { useCallback, useEffect, useState } from "react";

import { AdvisorChat } from "@/components/advisor/advisor-chat";
import { useAdvisorChrome } from "@/components/advisor/advisor-chrome-context";
import type { AdvisorMessage } from "@/components/advisor/advisor-data";
import {
  createChatId,
  createMessageId,
  deleteCachedChat,
  persistAdvisorChatMessages,
  readAdvisorChatCache,
  writeAdvisorChatCache,
  type CachedAdvisorChat,
} from "@/components/advisor/advisor-chat-cache";
import { useAdvisorRequest } from "@/components/advisor/advisor-provider";
import { usePreferences } from "@/components/preferences/preferences-provider";
import { useByok } from "@/components/settings/byok-provider";

export function AdvisorWorkspace() {
  const { copy } = usePreferences();
  const { selectedModel, getKeyForProvider } = useByok();
  const { bindSession } = useAdvisorChrome();
  const { busy, pendingChatId, lastError, lastErrorChatId, lastCompleted, clearError, send } =
    useAdvisorRequest();
  const [hydrated, setHydrated] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [chats, setChats] = useState<CachedAdvisorChat[]>([]);
  const [messages, setMessages] = useState<AdvisorMessage[]>([]);
  const [localError, setLocalError] = useState("");
  const [animateMessageId, setAnimateMessageId] = useState<string | null>(null);

  const loading = busy && pendingChatId !== null && pendingChatId === activeId;
  const error =
    localError ||
    (lastError && lastErrorChatId === activeId ? lastError : "") ||
    "";

  useEffect(() => {
    const cache = readAdvisorChatCache();
    setChats(cache.chats);
    setActiveId(cache.activeId);
    const active = cache.chats.find((chat) => chat.id === cache.activeId) ?? null;
    setMessages(active?.messages ?? []);
    setHydrated(true);
  }, []);

  // Sync when a background request finishes (including remount after tab change).
  useEffect(() => {
    if (!lastCompleted) return;
    const cache = readAdvisorChatCache();
    setChats(cache.chats);
    if (lastCompleted.chatId !== activeId) return;
    setMessages(lastCompleted.messages);
    setAnimateMessageId(lastCompleted.replyId);
    setLocalError("");
  }, [lastCompleted, activeId]);

  const startNewChat = useCallback(() => {
    if (busy) return;
    setMessages([]);
    setActiveId(null);
    setLocalError("");
    clearError();
    setAnimateMessageId(null);
    setChats((current) => {
      writeAdvisorChatCache({ version: 1, activeId: null, chats: current });
      return current;
    });
  }, [busy, clearError]);

  const openChat = useCallback(
    (chatId: string) => {
      if (busy) return;
      const chat = chats.find((item) => item.id === chatId);
      if (!chat) return;
      setActiveId(chatId);
      setMessages(chat.messages);
      setLocalError("");
      clearError();
      setAnimateMessageId(null);
      writeAdvisorChatCache({ version: 1, activeId: chatId, chats });
    },
    [busy, chats, clearError],
  );

  const removeChat = useCallback(
    (chatId: string) => {
      if (busy && pendingChatId === chatId) return;
      setChats((current) => {
        const next = deleteCachedChat({ version: 1, activeId, chats: current }, chatId);
        writeAdvisorChatCache(next);
        if (activeId === chatId) {
          const nextActive = next.chats.find((chat) => chat.id === next.activeId) ?? null;
          setActiveId(next.activeId);
          setMessages(nextActive?.messages ?? []);
        }
        return next.chats;
      });
    },
    [activeId, busy, pendingChatId],
  );

  useEffect(() => {
    if (!hydrated) return;
    bindSession({
      chats,
      activeId,
      onNewChat: startNewChat,
      onOpenChat: openChat,
      onDeleteChat: removeChat,
    });
    return () => bindSession(null);
  }, [hydrated, chats, activeId, startNewChat, openChat, removeChat, bindSession]);

  function sendPrompt(prompt: string) {
    if (busy || !selectedModel) return;
    const apiKey = getKeyForProvider(selectedModel.provider);
    if (!apiKey) {
      setLocalError(copy.advisor.needApiKey);
      return;
    }

    const chatId = activeId ?? createChatId();
    const userMessage: AdvisorMessage = { id: createMessageId(), role: "user", content: prompt };
    const nextMessages = [...messages, userMessage];
    setMessages(nextMessages);
    setActiveId(chatId);
    setLocalError("");
    clearError();
    setAnimateMessageId(null);

    const nextCache = persistAdvisorChatMessages(chatId, nextMessages, copy.advisor.newChat, true);
    setChats(nextCache.chats);

    send({
      chatId,
      messages: nextMessages,
      provider: selectedModel.provider,
      modelId: selectedModel.modelId,
      apiKey,
      fallbackTitle: copy.advisor.newChat,
    });
  }

  if (!hydrated) {
    return <div data-advisor-shell className="advisor-shell" />;
  }

  return (
    <AdvisorChat
      messages={messages}
      loading={loading}
      error={error}
      animateMessageId={animateMessageId}
      onSend={sendPrompt}
      onAnimationComplete={() => setAnimateMessageId(null)}
    />
  );
}
