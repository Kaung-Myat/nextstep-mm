"use client";

import Link from "next/link";

import { usePreferences } from "@/components/preferences/preferences-provider";
import { ProgressBar } from "@/components/roadmap/progress-bar";
import { formatMessage } from "@/i18n/messages";
import type { RoadmapSummary } from "@/lib/roadmaps";
import { cn } from "@/lib/utils";

export function RoadmapsCatalog({
  roadmaps,
  progressByRoadmap,
}: {
  roadmaps: RoadmapSummary[];
  progressByRoadmap: Record<string, string[]>;
}) {
  const { copy } = usePreferences();
  const ui = copy.pages.roadmaps;

  if (roadmaps.length === 0) {
    return (
      <p className="rounded-2xl border border-[color:var(--color-line)] bg-[color:var(--color-panel)] px-4 py-5 text-[13px] leading-5 text-[color:var(--color-text-muted)]">
        {ui.empty}
      </p>
    );
  }

  return (
    <div className="flex w-full flex-col gap-3">
      {roadmaps.map((roadmap) => {
        const totalItems = roadmap.itemCount;
        const completedItems = (progressByRoadmap[roadmap.slug] ?? []).length;
        const percentage = totalItems === 0 ? 0 : Math.round((completedItems / totalItems) * 100);

        return (
          <Link
            key={roadmap.slug}
            href={`/roadmaps/${roadmap.path}`}
            prefetch={false}
            className={cn(
              "pressable block w-full rounded-2xl border border-[color:var(--color-line)] bg-[color:var(--color-card)] p-4",
              roadmap.path === "fullstack" && "border-[color:var(--color-accent-soft)]",
            )}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[color:var(--color-accent)]">
                  {formatMessage(ui.stagesItems, { stages: roadmap.sectionCount, items: totalItems })}
                </p>
                <h2 className="mt-1 text-[17px] font-bold leading-snug text-[color:var(--color-text)]">{roadmap.title}</h2>
                <p className="mt-1.5 text-[13px] leading-5 text-[color:var(--color-text-muted)]">{roadmap.summary}</p>
              </div>
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                className="mt-1 size-5 shrink-0 fill-none stroke-[color:var(--color-text-muted)] stroke-2"
              >
                <path d="m9 6 6 6-6 6" />
              </svg>
            </div>
            <div className="mt-4 space-y-2">
              <div className="flex items-center justify-between text-[12px]">
                <span className="font-medium text-[color:var(--color-text-soft)]">
                  {formatMessage(ui.complete, { done: completedItems, total: totalItems })}
                </span>
                <span className="font-bold text-[color:var(--color-accent)]">{percentage}%</span>
              </div>
              <ProgressBar value={percentage} />
            </div>
          </Link>
        );
      })}
    </div>
  );
}
