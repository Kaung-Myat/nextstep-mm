import type { AdvisorMessage } from "@/components/advisor/advisor-data";

const STORAGE_KEY = "nextstep-advisor-chats-v1";
const MAX_CHATS = 24;
const MAX_MESSAGES_PER_CHAT = 40;

export type CachedAdvisorChat = {
  id: string;
  title: string;
  updatedAt: number;
  messages: AdvisorMessage[];
};

export type AdvisorChatCache = {
  version: 1;
  activeId: string | null;
  chats: CachedAdvisorChat[];
};

function emptyCache(): AdvisorChatCache {
  return { version: 1, activeId: null, chats: [] };
}

function trimChat(chat: CachedAdvisorChat): CachedAdvisorChat {
  if (chat.messages.length <= MAX_MESSAGES_PER_CHAT) return chat;
  return { ...chat, messages: chat.messages.slice(-MAX_MESSAGES_PER_CHAT) };
}

export function createChatId() {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return `chat-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

export function createMessageId() {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return `msg-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

export function titleFromMessages(messages: AdvisorMessage[]) {
  const firstUser = messages.find((message) => message.role === "user");
  if (!firstUser) return "New chat";
  const compact = firstUser.content.replace(/\s+/g, " ").trim();
  return compact.length > 48 ? `${compact.slice(0, 45)}…` : compact;
}

export function readAdvisorChatCache(): AdvisorChatCache {
  if (typeof window === "undefined") return emptyCache();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return emptyCache();
    const parsed = JSON.parse(raw) as AdvisorChatCache;
    if (parsed?.version !== 1 || !Array.isArray(parsed.chats)) return emptyCache();
    return {
      version: 1,
      activeId: typeof parsed.activeId === "string" ? parsed.activeId : null,
      chats: parsed.chats
        .filter((chat) => chat && typeof chat.id === "string" && Array.isArray(chat.messages))
        .map(trimChat)
        .slice(0, MAX_CHATS),
    };
  } catch {
    return emptyCache();
  }
}

export function writeAdvisorChatCache(cache: AdvisorChatCache) {
  if (typeof window === "undefined") return;
  try {
    const next: AdvisorChatCache = {
      version: 1,
      activeId: cache.activeId,
      chats: [...cache.chats]
        .map(trimChat)
        .sort((a, b) => b.updatedAt - a.updatedAt)
        .slice(0, MAX_CHATS),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // Ignore quota / private mode failures.
  }
}

export function upsertCachedChat(
  cache: AdvisorChatCache,
  chat: CachedAdvisorChat,
  makeActive = true,
): AdvisorChatCache {
  const without = cache.chats.filter((item) => item.id !== chat.id);
  return {
    version: 1,
    activeId: makeActive ? chat.id : cache.activeId,
    chats: [trimChat(chat), ...without].slice(0, MAX_CHATS),
  };
}

export function deleteCachedChat(cache: AdvisorChatCache, chatId: string): AdvisorChatCache {
  const chats = cache.chats.filter((chat) => chat.id !== chatId);
  const activeId = cache.activeId === chatId ? (chats[0]?.id ?? null) : cache.activeId;
  return { version: 1, activeId, chats };
}

/** Persist chat messages without React setState (safe after route unmount). */
export function persistAdvisorChatMessages(
  chatId: string,
  messages: AdvisorMessage[],
  fallbackTitle: string,
  makeActive = true,
): AdvisorChatCache {
  const cache = readAdvisorChatCache();
  const existing = cache.chats.find((chat) => chat.id === chatId);
  const chat: CachedAdvisorChat = {
    id: chatId,
    title: titleFromMessages(messages) || existing?.title || fallbackTitle,
    updatedAt: Date.now(),
    messages,
  };
  const next = upsertCachedChat(cache, chat, makeActive);
  writeAdvisorChatCache(next);
  return next;
}
