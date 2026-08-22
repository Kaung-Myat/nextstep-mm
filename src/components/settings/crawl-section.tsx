"use client";

import { useEffect, useMemo, useState } from "react";

import { usePreferences } from "@/components/preferences/preferences-provider";
import { useCrawl } from "@/components/settings/crawl-provider";
import { Button } from "@/components/ui/button";
import { formatMessage } from "@/i18n/messages";
import { DEFAULT_INGEST_AI_MODEL } from "@/lib/jobs/ingest-ai";
import type { CrawlPhaseId } from "@/lib/jobs/run-ingest";
import { cn } from "@/lib/utils";

type StepState = "pending" | "active" | "done" | "error";

const PHASE_ORDER: CrawlPhaseId[] = ["prepare", "fetch", "extract", "publish", "done"];

function phaseIndex(phase: CrawlPhaseId) {
  return PHASE_ORDER.indexOf(phase);
}

export function CrawlSection() {
  const { copy } = usePreferences();
  const {
    busy,
    phase,
    itemProgress,
    logLine,
    message,
    error,
    result,
    startedAt,
    startCrawl,
  } = useCrawl();
  const [elapsedSec, setElapsedSec] = useState(0);

  useEffect(() => {
    if (!busy || !startedAt) return;
    const tick = () => setElapsedSec(Math.max(0, Math.floor((Date.now() - startedAt) / 1000)));
    tick();
    const timer = window.setInterval(tick, 1000);
    return () => window.clearInterval(timer);
  }, [busy, startedAt]);

  const steps = useMemo(
    () =>
      [
        { id: "prepare" as const, label: copy.settings.crawlStepPrepare },
        { id: "fetch" as const, label: copy.settings.crawlStepFetch },
        { id: "extract" as const, label: copy.settings.crawlStepExtract },
        { id: "publish" as const, label: copy.settings.crawlStepPublish },
        { id: "done" as const, label: copy.settings.crawlStepDone },
      ] as const,
    [copy.settings],
  );

  function stepState(stepId: CrawlPhaseId): StepState {
    if (error && phase === stepId) return "error";
    if (!phase) return "pending";
    const current = phaseIndex(phase);
    const target = phaseIndex(stepId);
    if (target < current) return "done";
    if (target === current) return phase === "done" ? "done" : "active";
    return "pending";
  }

  const progressPercent = useMemo(() => {
    if (!busy && result) return 100;
    if (!phase) return 0;
    const base = (phaseIndex(phase) / (PHASE_ORDER.length - 1)) * 100;
    if (phase === "extract" && itemProgress && itemProgress.total > 0) {
      const slice = 100 / (PHASE_ORDER.length - 1);
      return Math.min(99, base + (itemProgress.current / itemProgress.total) * slice);
    }
    return phase === "done" ? 100 : Math.min(95, base);
  }, [busy, phase, itemProgress, result]);

  return (
    <section className="space-y-3">
      <div className="px-0.5">
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[color:var(--color-accent)]">
          {copy.settings.crawlEyebrow}
        </p>
        <h2 className="mt-1 text-[17px] font-bold text-[color:var(--color-text)]">{copy.settings.crawlTitle}</h2>
        <p className="mt-1 text-[13px] leading-5 text-[color:var(--color-text-muted)]">
          {copy.settings.crawlDescription}
        </p>
      </div>

      <div className="overflow-hidden rounded-2xl border border-[color:var(--color-line)] bg-[color:var(--color-card)]">
        <div className="space-y-4 p-4">
          <p className="text-[12px] leading-5 text-[color:var(--color-text-soft)]">
            {formatMessage(copy.settings.crawlModelHint, { model: DEFAULT_INGEST_AI_MODEL })}
          </p>
          <p className="text-[12px] leading-5 text-[color:var(--color-text-muted)]">
            {copy.settings.crawlNavHint}
          </p>

          {(busy || result || error) && (
            <div className="space-y-3 rounded-xl bg-[color:var(--color-panel)] p-3">
              <div className="flex items-center justify-between gap-3">
                <p className="text-[12px] font-semibold text-[color:var(--color-text)]">
                  {busy ? copy.settings.crawlRunning : error ? copy.settings.crawlFailed : copy.settings.crawlStepDone}
                </p>
                <p className="tabular-nums text-[11px] text-[color:var(--color-text-soft)]">
                  {busy || result
                    ? copy.settings.crawlElapsed.replace("{seconds}", String(elapsedSec))
                    : null}
                </p>
              </div>

              <div className="h-2 overflow-hidden rounded-full bg-[color:var(--color-line)]">
                <div
                  className={cn(
                    "h-full rounded-full transition-[width] duration-500 ease-out",
                    error ? "bg-red-500" : "bg-[color:var(--color-accent)]",
                    busy && "crawl-progress-bar",
                  )}
                  style={{ width: `${Math.max(error ? 100 : progressPercent, busy ? 6 : 0)}%` }}
                />
              </div>

              <ol className="space-y-2">
                {steps.map((step) => {
                  const state = stepState(step.id);
                  return (
                    <li key={step.id} className="flex items-center gap-2.5">
                      <span
                        className={cn(
                          "grid size-5 shrink-0 place-items-center rounded-full text-[10px] font-bold",
                          state === "done" && "bg-[color:var(--color-accent)] text-[color:var(--color-accent-foreground)]",
                          state === "active" && "crawl-step-pulse bg-[color:var(--color-accent-soft)] text-[color:var(--color-accent)]",
                          state === "pending" && "bg-[color:var(--color-line)] text-[color:var(--color-text-soft)]",
                          state === "error" && "bg-red-500 text-white",
                        )}
                        aria-hidden
                      >
                        {state === "done" ? "✓" : state === "error" ? "!" : state === "active" ? "•" : ""}
                      </span>
                      <span
                        className={cn(
                          "text-[13px]",
                          state === "active" && "font-semibold text-[color:var(--color-text)]",
                          state === "done" && "text-[color:var(--color-text-muted)]",
                          state === "pending" && "text-[color:var(--color-text-soft)]",
                          state === "error" && "font-semibold text-red-600",
                        )}
                      >
                        {step.label}
                      </span>
                    </li>
                  );
                })}
              </ol>

              {logLine ? (
                <p className="truncate rounded-lg bg-[color:var(--color-card)] px-2.5 py-2 text-[12px] text-[color:var(--color-text-muted)]">
                  {logLine}
                </p>
              ) : null}

              {result && !busy ? (
                <div className="grid grid-cols-3 gap-2">
                  <div className="rounded-lg bg-[color:var(--color-card)] px-2.5 py-2 text-center">
                    <p className="text-[15px] font-bold tabular-nums text-[color:var(--color-text)]">{result.imported ?? 0}</p>
                    <p className="text-[10px] text-[color:var(--color-text-soft)]">{copy.settings.crawlStatImported}</p>
                  </div>
                  <div className="rounded-lg bg-[color:var(--color-card)] px-2.5 py-2 text-center">
                    <p className="text-[15px] font-bold tabular-nums text-[color:var(--color-text)]">{result.approved ?? 0}</p>
                    <p className="text-[10px] text-[color:var(--color-text-soft)]">{copy.settings.crawlStatApproved}</p>
                  </div>
                  <div className="rounded-lg bg-[color:var(--color-card)] px-2.5 py-2 text-center">
                    <p className="text-[15px] font-bold tabular-nums text-[color:var(--color-text)]">{result.duplicate ?? 0}</p>
                    <p className="text-[10px] text-[color:var(--color-text-soft)]">{copy.settings.crawlStatDuplicate}</p>
                  </div>
                </div>
              ) : null}
            </div>
          )}

          <Button className="w-full" size="md" disabled={busy} onClick={() => startCrawl()}>
            {busy ? copy.settings.crawlRunning : copy.settings.crawlButton}
          </Button>

          {message && !busy ? (
            <p className="text-[13px] leading-5 text-[color:var(--color-accent)]">{message}</p>
          ) : null}
          {error ? <p className="text-[13px] leading-5 text-red-600">{error}</p> : null}
        </div>
      </div>
    </section>
  );
}
