"use client";

import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { usePreferences } from "@/components/preferences/preferences-provider";
import type { MarketJob } from "@/lib/jobs/market-types";

export function JobsListing({ jobs }: { jobs: MarketJob[] }) {
  const { copy } = usePreferences();
  const ui = copy.jobs;

  if (jobs.length === 0) {
    return (
      <Card className="py-10 text-center">
        <CardTitle>{ui.emptyTitle}</CardTitle>
        <CardDescription className="mt-2">{ui.emptyDescription}</CardDescription>
        <Button className="mt-4" href="/trends" variant="secondary" size="sm">{ui.viewTrends}</Button>
      </Card>
    );
  }

  return (
    <div className="overflow-hidden rounded-[var(--radius-app)] border border-[color:var(--color-line)] bg-[color:var(--color-card)]">
      {jobs.map((job) => (
        <div key={job.id} className="border-b border-[color:var(--color-line)] px-3.5 py-3.5 last:border-b-0">
          <div className="flex items-start gap-3">
            <span className="mt-0.5 grid size-10 shrink-0 place-items-center rounded-[0.85rem] bg-[color:var(--color-accent-soft)] text-[color:var(--color-accent)]">
              <svg aria-hidden="true" viewBox="0 0 24 24" className="size-5 fill-none stroke-current stroke-[1.8]">
                <rect x="3" y="7" width="18" height="13" rx="2" />
                <path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m-13 5h18" />
              </svg>
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex items-start justify-between gap-2">
                <p className="text-[15px] font-semibold leading-snug text-[color:var(--color-text)]">{job.title}</p>
                <span className="shrink-0 rounded-md bg-[color:var(--color-panel-strong)] px-2 py-0.5 text-[10px] font-bold uppercase text-[color:var(--color-text-soft)]">
                  {job.level === "junior" ? ui.levelJunior : ui.levelIntern}
                </span>
              </div>
              <p className="mt-1 text-[12px] text-[color:var(--color-text-muted)]">
                {job.company} · {job.location}
              </p>
              <p className="mt-1.5 truncate text-[12px] text-[color:var(--color-text-soft)]">{job.skills.slice(0, 4).join(" · ")}</p>
              <a
                href={job.sourceUrl}
                target="_blank"
                rel="noreferrer"
                className="pressable mt-2.5 inline-flex min-h-9 items-center rounded-full bg-[color:var(--color-panel-strong)] px-3 text-[12px] font-semibold text-[color:var(--color-text)]"
              >
                {copy.common.openSource}
              </a>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
