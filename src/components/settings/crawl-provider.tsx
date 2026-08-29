"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { usePreferences } from "@/components/preferences/preferences-provider";
import { useToast } from "@/components/ui/toast";
import { readByokKey, BYOK_STORAGE } from "@/lib/byok/storage";
import { DEFAULT_INGEST_AI_MODEL, DEFAULT_INGEST_AI_PROVIDER } from "@/lib/jobs/ingest-ai";
import type { CrawlPhaseId, CrawlProgressEvent } from "@/lib/jobs/run-ingest";
import { cn } from "@/lib/utils";

export type CrawlDonePayload = {
  fetched?: number;
  imported?: number;
  duplicate?: number;
  needsReview?: number;
  approved?: number;
  provider?: string;
  model?: string;
  aiUsed?: boolean;
  aiSuccessCount?: number;
};

type CrawlContextValue = {
  busy: boolean;
  phase: CrawlPhaseId | null;
  itemProgress: { current: number; total: number; title?: string } | null;
  logLine: string | null;
  message: string | null;
  error: string | null;
  result: CrawlDonePayload | null;
  startedAt: number | null;
  startCrawl: () => void;
};

const CrawlContext = createContext<CrawlContextValue | null>(null);

function parseSseChunk(buffer: string) {
  const events: Array<{ event: string; data: string }> = [];
  const parts = buffer.split("\n\n");
  const rest = parts.pop() ?? "";

  for (const part of parts) {
    let event = "message";
    const dataLines: string[] = [];
    for (const line of part.split("\n")) {
      if (line.startsWith("event:")) event = line.slice(6).trim();
      if (line.startsWith("data:")) dataLines.push(line.slice(5).trim());
    }
    if (dataLines.length > 0) events.push({ event, data: dataLines.join("\n") });
  }

  return { events, rest };
}

export function CrawlProvider({ children }: { children: ReactNode }) {
  const { copy } = usePreferences();
  const { showToast } = useToast();
  const runningRef = useRef(false);

  const [busy, setBusy] = useState(false);
  const [phase, setPhase] = useState<CrawlPhaseId | null>(null);
  const [itemProgress, setItemProgress] = useState<{ current: number; total: number; title?: string } | null>(null);
  const [logLine, setLogLine] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<CrawlDonePayload | null>(null);
  const [startedAt, setStartedAt] = useState<number | null>(null);

  const startCrawl = useCallback(() => {
    if (runningRef.current) {
      showToast({
        tone: "info",
        title: copy.settings.crawlAlreadyRunning,
      });
      return;
    }

    const openrouterKey = readByokKey(BYOK_STORAGE.openrouter);
    const provider = DEFAULT_INGEST_AI_PROVIDER;
    const apiKey = openrouterKey || undefined;

    runningRef.current = true;
    setBusy(true);
    setStartedAt(Date.now());
    setMessage(null);
    setError(null);
    setResult(null);
    setPhase("prepare");
    setItemProgress(null);
    setLogLine(copy.settings.crawlLogStarting);

    void (async () => {
      try {
        const response = await fetch("/api/jobs/crawl", {
          method: "POST",
          headers: { "Content-Type": "application/json", Accept: "text/event-stream" },
          body: JSON.stringify({
            provider,
            model: DEFAULT_INGEST_AI_MODEL,
            apiKey,
            autoApprove: true,
            limit: 8,
          }),
        });

        if (!response.ok || !response.body) {
          const fallback = (await response.json().catch(() => null)) as { error?: string } | null;
          throw new Error(fallback?.error ?? copy.settings.crawlFailed);
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let buffer = "";
        let donePayload: CrawlDonePayload | null = null;

        while (true) {
          const { value, done } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });
          const parsed = parseSseChunk(buffer);
          buffer = parsed.rest;

          for (const event of parsed.events) {
            if (event.event === "progress") {
              const progress = JSON.parse(event.data) as CrawlProgressEvent;
              if (progress.type === "phase") {
                setPhase(progress.phase);
              }
              if (progress.type === "log") {
                setLogLine(progress.message);
              }
              if (progress.type === "item") {
                setItemProgress({
                  current: progress.current,
                  total: progress.total,
                  title: progress.title,
                });
                if (progress.title) {
                  setLogLine(
                    copy.settings.crawlLogItem
                      .replace("{current}", String(progress.current))
                      .replace("{total}", String(progress.total))
                      .replace("{title}", progress.title),
                  );
                }
              }
            }

            if (event.event === "done") {
              donePayload = JSON.parse(event.data) as CrawlDonePayload;
              setPhase("done");
              setResult(donePayload);
              const successMessage =
                copy.settings.crawlSuccess
                  .replace("{imported}", String(donePayload.imported ?? 0))
                  .replace("{approved}", String(donePayload.approved ?? 0))
                  .replace("{duplicate}", String(donePayload.duplicate ?? 0)) +
                (donePayload.aiUsed
                  ? copy.settings.crawlSkillsAi.replace("{count}", String(donePayload.aiSuccessCount ?? 0))
                  : copy.settings.crawlSkillsDictionary);
              setMessage(successMessage);
              showToast({
                tone: "success",
                title: copy.settings.toastCrawlSuccess,
                description: successMessage,
                durationMs: 4800,
              });
            }

            if (event.event === "error") {
              const payload = JSON.parse(event.data) as { message?: string };
              throw new Error(payload.message ?? copy.settings.crawlFailed);
            }
          }
        }

        if (!donePayload) throw new Error(copy.settings.crawlFailed);
      } catch (err) {
        const text = err instanceof Error ? err.message : copy.settings.crawlFailed;
        setError(text);
        setPhase((current) => current ?? "prepare");
        showToast({
          tone: "error",
          title: copy.settings.toastCrawlError,
          description: text,
          durationMs: 4800,
        });
      } finally {
        runningRef.current = false;
        setBusy(false);
        setItemProgress(null);
      }
    })();
  }, [copy.settings, showToast]);

  const value = useMemo(
    () => ({
      busy,
      phase,
      itemProgress,
      logLine,
      message,
      error,
      result,
      startedAt,
      startCrawl,
    }),
    [busy, phase, itemProgress, logLine, message, error, result, startedAt, startCrawl],
  );

  return (
    <CrawlContext.Provider value={value}>
      {children}
      <CrawlFloatingBadge />
    </CrawlContext.Provider>
  );
}

function CrawlFloatingBadge() {
  const crawl = useContext(CrawlContext);
  const { copy } = usePreferences();
  const pathname = usePathname();
  const [elapsedSec, setElapsedSec] = useState(0);

  useEffect(() => {
    if (!crawl?.busy || !crawl.startedAt) return;
    const tick = () => setElapsedSec(Math.max(0, Math.floor((Date.now() - crawl.startedAt!) / 1000)));
    tick();
    const timer = window.setInterval(tick, 1000);
    return () => window.clearInterval(timer);
  }, [crawl?.busy, crawl?.startedAt]);

  if (!crawl?.busy || pathname.startsWith("/settings")) return null;

  return (
    <Link
      href="/settings"
      className={cn(
        "pressable fixed right-3 z-[70] flex max-w-[14rem] items-center gap-2 rounded-full border border-[color:var(--color-accent)]/30 bg-[color:var(--color-card)] px-3 py-2 shadow-[0_8px_24px_rgba(12,20,24,0.14)]",
      )}
      style={{ bottom: "calc(var(--tab-height) + env(safe-area-inset-bottom, 0px) + 0.75rem)" }}
    >
      <span className="crawl-step-pulse size-2.5 shrink-0 rounded-full bg-[color:var(--color-accent)]" aria-hidden />
      <span className="min-w-0">
        <span className="block truncate text-[11px] font-bold text-[color:var(--color-text)]">
          {copy.settings.crawlRunning}
        </span>
        <span className="block truncate text-[10px] text-[color:var(--color-text-soft)]">
          {copy.settings.crawlElapsed.replace("{seconds}", String(elapsedSec))}
          {crawl.logLine ? ` · ${crawl.logLine}` : ""}
        </span>
      </span>
    </Link>
  );
}

export function useCrawl() {
  const value = useContext(CrawlContext);
  if (!value) throw new Error("useCrawl must be used inside CrawlProvider.");
  return value;
}
