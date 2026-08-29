"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type FormEvent } from "react";

import { AnimatedAdvisorReply } from "@/components/advisor/animated-advisor-reply";
import { useAdvisorChrome } from "@/components/advisor/advisor-chrome-context";
import type { AdvisorMessage } from "@/components/advisor/advisor-data";
import { useByok } from "@/components/settings/byok-provider";
import { usePreferences } from "@/components/preferences/preferences-provider";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type AdvisorChatProps = {
  messages: AdvisorMessage[];
  loading: boolean;
  error: string;
  animateMessageId: string | null;
  onSend: (prompt: string) => void;
  onAnimationComplete: () => void;
};

function CloseMenuIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="size-5 fill-none stroke-current stroke-2">
      <path d="M6 6l12 12M18 6 6 18" strokeLinecap="round" />
    </svg>
  );
}

export function AdvisorChat({
  messages,
  loading,
  error,
  animateMessageId,
  onSend,
  onAnimationComplete,
}: AdvisorChatProps) {
  const { copy } = usePreferences();
  const { menuOpen, closeMenu, session } = useAdvisorChrome();
  const { availableProviders, selectedModel } = useByok();
  const [draft, setDraft] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesPaneRef = useRef<HTMLDivElement>(null);
  const ready = availableProviders.length > 0 && Boolean(selectedModel);
  const chats = session?.chats ?? [];
  const activeId = session?.activeId ?? null;

  useEffect(() => {
    const pane = messagesPaneRef.current;
    if (!pane) return;
    pane.scrollTo({ top: pane.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  useEffect(() => {
    if (!menuOpen) return;
    const previousHtml = document.documentElement.style.overflow;
    const previousBody = document.body.style.overflow;
    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeMenu();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.documentElement.style.overflow = previousHtml;
      document.body.style.overflow = previousBody;
      window.removeEventListener("keydown", onKey);
    };
  }, [menuOpen, closeMenu]);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const prompt = draft.trim();
    if (!prompt || loading || !ready) return;
    setDraft("");
    onSend(prompt);
  }

  const prompts = [copy.advisor.promptNext, copy.advisor.promptReady, copy.advisor.promptProject];

  return (
    <div data-advisor-shell className="advisor-shell">
      {menuOpen && session ? (
        <div className="fixed inset-0 z-[60] flex" role="dialog" aria-modal="true" aria-label={copy.advisor.openMenu}>
          <button
            type="button"
            className="absolute inset-0 bg-slate-950/40 backdrop-blur-[1px]"
            aria-label={copy.common.close}
            onClick={closeMenu}
          />
          <aside className="safe-top safe-bottom relative z-10 flex h-full w-[min(100%,20rem)] flex-col border-r border-[color:var(--color-line)] bg-[color:var(--color-background-elevated)] shadow-[12px_0_40px_rgba(8,20,28,0.18)]">
            <div className="flex items-center gap-1 px-2 py-2">
              <button
                type="button"
                aria-label={copy.common.close}
                onClick={closeMenu}
                className="pressable grid size-10 place-items-center rounded-full hover:bg-[color:var(--color-panel)]"
              >
                <CloseMenuIcon />
              </button>
              <p className="text-[14px] font-semibold text-[color:var(--color-text)]">{copy.advisor.title}</p>
            </div>

            <div className="px-3 pb-2">
              <button
                type="button"
                onClick={() => {
                  session.onNewChat();
                  closeMenu();
                }}
                className="pressable flex w-full items-center gap-3 rounded-full bg-[color:var(--color-panel)] px-4 py-3 text-left text-[14px] font-semibold text-[color:var(--color-text)]"
              >
                <svg aria-hidden="true" viewBox="0 0 24 24" className="size-5 fill-none stroke-current stroke-2">
                  <path d="M12 5v14M5 12h14" strokeLinecap="round" />
                </svg>
                {copy.advisor.newChat}
              </button>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto px-2 pb-4">
              <p className="px-3 pb-2 pt-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-[color:var(--color-text-muted)]">
                {copy.advisor.recentChats}
              </p>
              {chats.length === 0 ? (
                <p className="px-3 py-4 text-[13px] text-[color:var(--color-text-muted)]">{copy.advisor.noRecent}</p>
              ) : (
                <ul className="space-y-0.5">
                  {chats.map((chat) => {
                    const active = chat.id === activeId;
                    return (
                      <li key={chat.id} className="relative">
                        <button
                          type="button"
                          onClick={() => {
                            session.onOpenChat(chat.id);
                            closeMenu();
                          }}
                          className={cn(
                            "flex w-full items-center rounded-2xl px-3 py-2.5 pr-10 text-left text-[13px] leading-5",
                            active
                              ? "bg-[color:var(--color-accent-soft)] font-semibold text-[color:var(--color-accent)]"
                              : "text-[color:var(--color-text-soft)] hover:bg-[color:var(--color-panel)]",
                          )}
                        >
                          <span className="line-clamp-2">{chat.title}</span>
                        </button>
                        <button
                          type="button"
                          aria-label={copy.advisor.deleteChat}
                          onClick={() => session.onDeleteChat(chat.id)}
                          className="pressable absolute right-1 top-1/2 grid size-8 -translate-y-1/2 place-items-center rounded-full text-[color:var(--color-text-muted)] opacity-70 hover:bg-[color:var(--color-panel-strong)] hover:opacity-100"
                        >
                          <svg aria-hidden="true" viewBox="0 0 24 24" className="size-4 fill-none stroke-current stroke-2">
                            <path
                              d="M5 7h14M10 11v6M14 11v6M9 7V5h6v2M7 7l1 12h8l1-12"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          </aside>
        </div>
      ) : null}

      <div ref={messagesPaneRef} className="advisor-messages no-scrollbar mx-auto w-full max-w-2xl px-4 py-3" aria-live="polite">
        {!ready ? (
          <div className="mx-auto max-w-lg px-2 py-16 text-center">
            <h3 className="text-[1.75rem] font-semibold tracking-tight text-[color:var(--color-text)]">{copy.settings.noKeyTitle}</h3>
            <p className="mx-auto mt-2 max-w-sm text-[14px] leading-6 text-[color:var(--color-text-muted)]">
              {copy.settings.noKeyDescription}
            </p>
            <Link
              href="/settings"
              className="pressable mt-5 inline-flex min-h-11 items-center justify-center rounded-full bg-[color:var(--color-accent)] px-6 text-[13px] font-semibold text-[color:var(--color-accent-foreground)]"
            >
              {copy.settings.openSettings}
            </Link>
          </div>
        ) : messages.length === 0 ? (
          <div className="mx-auto max-w-xl py-10">
            <div className="text-center">
              <p className="bg-[linear-gradient(120deg,var(--color-accent),#3d9b8f,#1a6b62)] bg-clip-text text-[2rem] font-semibold tracking-tight text-transparent sm:text-[2.35rem]">
                {copy.advisor.greeting}
              </p>
              <h3 className="mt-2 text-[1.35rem] font-semibold tracking-tight text-[color:var(--color-text)] sm:text-[1.5rem]">
                {copy.advisor.emptyTitle}
              </h3>
              <p className="mx-auto mt-2 max-w-md text-[14px] leading-6 text-[color:var(--color-text-muted)]">
                {copy.advisor.emptyDescription}
              </p>
            </div>
            <div className="mt-8 grid gap-2 sm:grid-cols-3">
              {prompts.map((prompt) => (
                <button
                  key={prompt}
                  type="button"
                  onClick={() => onSend(prompt)}
                  className="pressable rounded-[1.25rem] border border-[color:var(--color-line)] bg-[color:var(--color-card)] px-3.5 py-3.5 text-left text-[13px] font-medium leading-5 text-[color:var(--color-text-soft)] transition hover:border-[color:var(--color-accent-soft)] hover:bg-[color:var(--color-panel)]"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-6 pb-2 pt-1">
            {messages.map((message) =>
              message.role === "user" ? (
                <div key={message.id} className="flex justify-end">
                  <div className="max-w-[85%] whitespace-pre-wrap rounded-[1.35rem] rounded-br-md bg-[color:var(--color-panel-strong)] px-4 py-2.5 text-[14px] leading-6 text-[color:var(--color-text)]">
                    {message.content}
                  </div>
                </div>
              ) : (
                <div key={message.id}>
                  <AnimatedAdvisorReply
                    content={message.content}
                    animate={message.id === animateMessageId}
                    onComplete={message.id === animateMessageId ? onAnimationComplete : undefined}
                  />
                </div>
              ),
            )}
            {loading ? (
              <div className="flex items-center gap-2 text-[13px] text-[color:var(--color-text-muted)]" role="status">
                <span className="inline-flex gap-1">
                  <span className="size-1.5 animate-pulse rounded-full bg-[color:var(--color-accent)]" />
                  <span className="size-1.5 animate-pulse rounded-full bg-[color:var(--color-accent)] [animation-delay:120ms]" />
                  <span className="size-1.5 animate-pulse rounded-full bg-[color:var(--color-accent)] [animation-delay:240ms]" />
                </span>
                {copy.settings.sending}
              </div>
            ) : null}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      <div className="advisor-composer border-t border-[color:var(--color-line)] bg-[color:var(--color-background)]/95 px-3 py-2 backdrop-blur-md sm:px-4">
        {error ? (
          <p role="alert" className="alert-error mx-auto mb-1.5 max-w-2xl rounded-2xl px-3 py-2 text-[12px]">
            {error}
          </p>
        ) : null}
        <form
          onSubmit={submit}
          id="advisor-input"
          className="mx-auto flex max-w-2xl items-end gap-2 rounded-[1.75rem] border border-[color:var(--color-line)] bg-[color:var(--color-card)] px-2 py-1.5 shadow-[0_8px_28px_rgba(10,35,45,0.08)]"
        >
          <label className="sr-only" htmlFor="advisor-message">
            {copy.advisor.askLabel}
          </label>
          <textarea
            id="advisor-message"
            value={draft}
            onChange={(event) => setDraft(event.target.value.slice(0, 4000))}
            onKeyDown={(event) => {
              if (event.key === "Enter" && !event.shiftKey) {
                event.preventDefault();
                event.currentTarget.form?.requestSubmit();
              }
            }}
            rows={1}
            maxLength={4000}
            disabled={!ready || loading}
            placeholder={copy.settings.askPlaceholder}
            className="max-h-32 min-h-11 flex-1 resize-none bg-transparent px-3 py-2.5 text-[15px] leading-5 outline-none disabled:opacity-60"
          />
          <Button
            type="submit"
            disabled={!ready || loading || !draft.trim()}
            size="sm"
            className="mb-0.5 size-10 shrink-0 rounded-full px-0"
            aria-label={copy.advisor.sendMessage}
          >
            <svg aria-hidden="true" viewBox="0 0 24 24" className="size-6 fill-none stroke-current stroke-[2.25]">
              <path d="M12 19V5m0 0 5 5m-5-5-5 5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Button>
        </form>
      </div>
    </div>
  );
}
