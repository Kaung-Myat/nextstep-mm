"use client";

import { useCallback, useEffect, useState } from "react";

import { AdvisorChat } from "@/components/advisor/advisor-chat";
import { useAdvisorChrome } from "@/components/advisor/advisor-chrome-context";
import type { AdvisorMessage } from "@/components/advisor/advisor-data";
import {
  createChatId,
  createMessageId,
  deleteCachedChat,
  readAdvisorChatCache,
  titleFromMessages,
  upsertCachedChat,
  writeAdvisorChatCache,
  type CachedAdvisorChat,
} from "@/components/advisor/advisor-chat-cache";
import { usePreferences } from "@/components/preferences/preferences-provider";
import { useByok } from "@/components/settings/byok-provider";

export function AdvisorWorkspace() {
  const { copy } = usePreferences();
  const { selectedModel, getKeyForProvider } = useByok();
  const { bindSession } = useAdvisorChrome();
  const [hydrated, setHydrated] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [chats, setChats] = useState<CachedAdvisorChat[]>([]);
  const [messages, setMessages] = useState<AdvisorMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [animateMessageId, setAnimateMessageId] = useState<string | null>(null);

  useEffect(() => {
    const cache = readAdvisorChatCache();
    setChats(cache.chats);
    setActiveId(cache.activeId);
    const active = cache.chats.find((chat) => chat.id === cache.activeId) ?? null;
    setMessages(active?.messages ?? []);
    setHydrated(true);
  }, []);

  const saveMessages = useCallback(
    (chatId: string, nextMessages: AdvisorMessage[]) => {
      setChats((current) => {
        const existing = current.find((chat) => chat.id === chatId);
        const chat: CachedAdvisorChat = {
          id: chatId,
          title: titleFromMessages(nextMessages) || existing?.title || copy.advisor.newChat,
          updatedAt: Date.now(),
          messages: nextMessages,
        };
        const next = upsertCachedChat({ version: 1, activeId: chatId, chats: current }, chat, true);
        writeAdvisorChatCache(next);
        return next.chats;
      });
      setActiveId(chatId);
    },
    [copy.advisor.newChat],
  );

  const startNewChat = useCallback(() => {
    if (loading) return;
    setMessages([]);
    setActiveId(null);
    setError("");
    setAnimateMessageId(null);
    setChats((current) => {
      writeAdvisorChatCache({ version: 1, activeId: null, chats: current });
      return current;
    });
  }, [loading]);

  const openChat = useCallback(
    (chatId: string) => {
      if (loading) return;
      const chat = chats.find((item) => item.id === chatId);
      if (!chat) return;
      setActiveId(chatId);
      setMessages(chat.messages);
      setError("");
      setAnimateMessageId(null);
      writeAdvisorChatCache({ version: 1, activeId: chatId, chats });
    },
    [chats, loading],
  );

  const removeChat = useCallback(
    (chatId: string) => {
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
    [activeId],
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

  async function sendPrompt(prompt: string) {
    if (loading || !selectedModel) return;
    const apiKey = getKeyForProvider(selectedModel.provider);
    if (!apiKey) {
      setError(copy.advisor.needApiKey);
      return;
    }

    const chatId = activeId ?? createChatId();
    const userMessage: AdvisorMessage = { id: createMessageId(), role: "user", content: prompt };
    const nextMessages = [...messages, userMessage];
    setMessages(nextMessages);
    saveMessages(chatId, nextMessages);
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/advisor/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          provider: selectedModel.provider,
          modelId: selectedModel.modelId,
          apiKey,
          messages: nextMessages.map((message) => ({ role: message.role, content: message.content })),
        }),
      });
      const payload = (await response.json()) as { reply?: string; error?: string };
      if (!response.ok || !payload.reply) {
        throw new Error(payload.error ?? copy.advisor.requestFailed);
      }
      const replyId = createMessageId();
      const withReply: AdvisorMessage[] = [
        ...nextMessages,
        { id: replyId, role: "assistant", content: payload.reply },
      ];
      setMessages(withReply);
      setAnimateMessageId(replyId);
      saveMessages(chatId, withReply);
    } catch (err) {
      setError(err instanceof Error ? err.message : copy.advisor.requestFailed);
    } finally {
      setLoading(false);
    }
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
