"use client";

import Link from "next/link";

import { ProgressBar } from "@/components/roadmap/progress-bar";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { usePreferences } from "@/components/preferences/preferences-provider";
import { Container } from "@/components/layout/container";
import { formatMessage } from "@/i18n/messages";
import type { InternshipChecklistId } from "@/lib/internship-prep/types";

type HomeDashboardProps = {
  path: string;
  percentage: number;
  completedCount: number;
  remainingCount: number;
  nextItemTitle: string;
  nextItemDescription: string;
  goalDate: string | null;
  prepCounts: Record<InternshipChecklistId, { done: number; total: number }>;
  marketSkills: Array<{ name: string; share: number }>;
  hasRoadmap: boolean;
};

export function HomeDashboard({
  path,
  percentage,
  completedCount,
  remainingCount,
  nextItemTitle,
  nextItemDescription,
  goalDate,
  prepCounts,
  marketSkills,
  hasRoadmap,
}: HomeDashboardProps) {
  const { copy } = usePreferences();
  const home = copy.home;

  const quickActions = [
    { href: "/roadmaps", label: home.roadmaps, color: "bg-[color:var(--color-accent-soft)] text-[color:var(--color-accent)]", icon: <path d="M5 4.5h11.5A2.5 2.5 0 0 1 19 7v13H7.5A2.5 2.5 0 0 1 5 17.5v-13ZM8 8h7M8 12h7" /> },
    { href: "/internship-prep", label: home.internship, color: "bg-[color:var(--color-panel-strong)] text-[color:var(--color-text-soft)]", icon: <path d="M7 7V5a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v2m-13 4h16m-9 0v2h2v-2M4 7h16a1 1 0 0 1 1 1v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a1 1 0 0 1 1-1Z" /> },
    { href: "/trends", label: home.trends, color: "bg-[color:var(--color-panel-strong)] text-[color:var(--color-text-soft)]", icon: <><path d="M4 19V9m5 10V5m5 14v-7m5 7V3" /><path d="m3 7 5-4 6 6 7-7" /></> },
    { href: "/jobs", label: home.jobs, color: "bg-[color:var(--color-panel-strong)] text-[color:var(--color-text-soft)]", icon: <><rect x="3" y="7" width="18" height="13" rx="2" /><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m-13 5h18" /></> },
  ] as const;

  const recommendedActions = [
    { title: formatMessage(home.continueTopic, { title: nextItemTitle }), detail: home.continueTopicDetail, href: `/roadmaps/${path}` },
    { title: home.reviewInternship, detail: home.reviewInternshipDetail, href: "/internship-prep" },
    { title: home.askPlan, detail: home.askPlanDetail, href: "/advisor" },
  ];

  const prepCards: Array<[string, InternshipChecklistId]> = [
    [home.resume, "resume"],
    [home.portfolio, "portfolio"],
    [home.github, "github"],
  ];

  return (
    <Container className="space-y-6 py-3 sm:py-5 lg:space-y-7 lg:py-6">
      {/* First viewport: brand path + progress + next + CTA */}
      <section className="space-y-4">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[color:var(--color-accent)]">
            {formatMessage(home.yourPath, { path })}
          </p>
          <h1 className="mt-1 text-[28px] font-bold leading-tight tracking-tight text-[color:var(--color-text)] lg:text-4xl">
            {home.headline}
          </h1>
        </div>

        <div className="rounded-[var(--radius-app)] border border-[color:var(--color-line)] bg-[color:var(--color-card)] p-4 sm:p-5">
          {hasRoadmap ? (
            <>
              <div className="flex items-end justify-between gap-3">
                <p className="text-[15px] font-semibold text-[color:var(--color-text)]">{home.keepMomentum}</p>
                <span className="shrink-0 text-[13px] font-bold text-[color:var(--color-accent)]">
                  {formatMessage(home.percentComplete, { value: percentage })}
                </span>
              </div>
              <div className="mt-3">
                <ProgressBar value={percentage} />
                <div className="mt-2 flex justify-between text-[11px] text-[color:var(--color-text-muted)]">
                  <span>{formatMessage(home.topicsCompleted, { count: completedCount })}</span>
                  <span>{formatMessage(home.remaining, { count: remainingCount })}</span>
                </div>
              </div>
              <div className="mt-4 border-t border-[color:var(--color-line)] pt-4">
                <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[color:var(--color-text-muted)]">
                  {home.upNext}
                </p>
                <p className="mt-1 text-[16px] font-semibold leading-snug text-[color:var(--color-text)]">{nextItemTitle}</p>
                <p className="mt-1 line-clamp-2 text-[13px] leading-5 text-[color:var(--color-text-muted)]">
                  {nextItemDescription}
                </p>
              </div>
              <Button href={`/roadmaps/${path}`} className="mt-4 w-full sm:w-auto">
                {copy.common.continueLearning}
              </Button>
            </>
          ) : (
            <div>
              <p className="text-[15px] font-semibold text-[color:var(--color-text)]">{home.roadmapEmptyTitle}</p>
              <p className="mt-1.5 text-[13px] leading-5 text-[color:var(--color-text-muted)]">{home.roadmapEmptyDescription}</p>
              <Button href="/roadmaps" variant="secondary" className="mt-4 w-full sm:w-auto">
                {home.roadmaps}
              </Button>
            </div>
          )}
        </div>
      </section>

      <section aria-labelledby="quick-actions">
        <h2 id="quick-actions" className="mb-2 px-0.5 text-[13px] font-semibold uppercase tracking-[0.08em] text-[color:var(--color-text-muted)]">
          {home.quickActions}
        </h2>
        <div className="grid grid-cols-4 gap-2 lg:grid-cols-4 lg:gap-3">
          {quickActions.map((action) => (
            <Link
              key={action.href}
              href={action.href}
              className="pressable flex flex-col items-center gap-1.5 rounded-[var(--radius-app)] border border-[color:var(--color-line)] bg-[color:var(--color-card)] px-1 py-3"
            >
              <span className={`grid size-10 place-items-center rounded-[0.85rem] ${action.color}`}>
                <svg aria-hidden="true" viewBox="0 0 24 24" className="size-[18px] fill-none stroke-current stroke-[1.8]" strokeLinecap="round" strokeLinejoin="round">
                  {action.icon}
                </svg>
              </span>
              <span className="max-w-full truncate text-[11px] font-semibold text-[color:var(--color-text)]">{action.label}</span>
            </Link>
          ))}
        </div>
      </section>

      <section aria-labelledby="recommended-actions">
        <div className="mb-2 flex items-center justify-between px-0.5">
          <h2 id="recommended-actions" className="text-[13px] font-semibold uppercase tracking-[0.08em] text-[color:var(--color-text-muted)]">
            {home.recommended}
          </h2>
          <span className="text-[11px] font-semibold text-[color:var(--color-accent)]">{copy.common.forYou}</span>
        </div>
        <div className="overflow-hidden rounded-[var(--radius-app)] border border-[color:var(--color-line)] bg-[color:var(--color-card)]">
          {recommendedActions.map((action, index) => (
            <Link
              key={action.title}
              href={action.href}
              className="pressable flex items-center gap-3 border-b border-[color:var(--color-line)] px-3.5 py-3.5 last:border-b-0"
            >
              <span className="grid size-7 shrink-0 place-items-center rounded-full bg-[color:var(--color-accent-soft)] text-[12px] font-bold text-[color:var(--color-accent)]">
                {index + 1}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-[14px] font-semibold text-[color:var(--color-text)]">{action.title}</span>
                <span className="mt-0.5 block truncate text-[12px] text-[color:var(--color-text-muted)]">{action.detail}</span>
              </span>
              <svg aria-hidden="true" viewBox="0 0 24 24" className="size-4 shrink-0 fill-none stroke-[color:var(--color-text-muted)] stroke-2">
                <path d="m9 6 6 6-6 6" />
              </svg>
            </Link>
          ))}
        </div>
      </section>

      <section aria-labelledby="internship-status" className="grid gap-3 lg:grid-cols-2 lg:gap-5">
        <Card>
          <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[color:var(--color-accent)]">{home.internshipPrep}</p>
          <CardTitle id="internship-status" className="mt-1">{home.buildApplication}</CardTitle>
          <CardDescription className="mt-1.5">{home.internshipDescription}</CardDescription>
          <div className="mt-4 grid grid-cols-3 gap-2">
            {prepCards.map(([label, key]) => (
              <div key={key} className="rounded-[var(--radius-control)] bg-[color:var(--color-panel)] p-2.5 text-center">
                <p className="text-[12px] font-bold text-[color:var(--color-text)]">{label}</p>
                <p className="mt-0.5 text-[10px] text-[color:var(--color-text-muted)]">
                  {formatMessage(home.steps, { done: prepCounts[key].done, total: prepCounts[key].total })}
                </p>
              </div>
            ))}
          </div>
          <div className="mt-4 flex items-center justify-between gap-3">
            <p className="text-[12px] text-[color:var(--color-text-muted)]">
              {goalDate ? `${home.goalPrefix} ${goalDate}` : home.addGoal}
            </p>
            <Button href="/internship-prep" variant="secondary" size="sm">
              {home.openPrepHub}
            </Button>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[color:var(--color-accent)]">{home.marketSnapshot}</p>
              <CardTitle id="market-snapshot" className="mt-1">{home.skillsInDemand}</CardTitle>
            </div>
            <Link href="/trends" className="shrink-0 text-[12px] font-bold text-[color:var(--color-accent)]">
              {copy.common.seeAll}
            </Link>
          </div>
          {marketSkills.length === 0 ? (
            <div className="mt-4 rounded-[var(--radius-control)] bg-[color:var(--color-panel)] px-3.5 py-3">
              <p className="text-[13px] font-semibold text-[color:var(--color-text)]">{home.marketEmptyTitle}</p>
              <p className="mt-1 text-[12px] leading-5 text-[color:var(--color-text-muted)]">{home.marketEmpty}</p>
              <Link href="/settings" className="mt-2 inline-block text-[12px] font-bold text-[color:var(--color-accent)]">
                {home.marketRetry}
              </Link>
            </div>
          ) : (
            <div className="mt-4 space-y-3">
              {marketSkills.map((skill) => (
                <div key={skill.name} className="grid grid-cols-[4.5rem_1fr_2.25rem] items-center gap-2">
                  <span className="truncate text-[13px] font-semibold">{skill.name}</span>
                  <div className="h-1.5 overflow-hidden rounded-full bg-[color:var(--color-panel-strong)]">
                    <div className="h-full rounded-full bg-[color:var(--color-accent)]" style={{ width: `${skill.share}%` }} />
                  </div>
                  <span className="text-right text-[11px] font-bold text-[color:var(--color-text-muted)]">{skill.share}%</span>
                </div>
              ))}
            </div>
          )}
          <p className="mt-4 text-[11px] leading-4 text-[color:var(--color-text-muted)]">{home.marketSource}</p>
        </Card>
      </section>

      <Link
        href="/advisor"
        className="pressable block rounded-[var(--radius-app)] bg-[color:var(--color-accent)] p-4 text-[color:var(--color-accent-foreground)] lg:flex lg:items-center lg:justify-between lg:gap-6 lg:p-6"
      >
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-white/75">{home.advisorEyebrow}</p>
          <p className="mt-1 text-[17px] font-bold leading-snug lg:text-xl">{home.advisorTitle}</p>
          <p className="mt-1 text-[13px] leading-5 text-white/75 lg:max-w-2xl">{home.advisorDescription}</p>
        </div>
        <span className="mt-3 inline-flex min-h-9 items-center rounded-full bg-white/15 px-3.5 text-[13px] font-semibold lg:mt-0 lg:shrink-0">
          {home.askAdvisor}
        </span>
      </Link>
    </Container>
  );
}
