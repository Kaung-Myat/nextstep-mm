"use client";

import Link from "next/link";
import { useMemo, useState, useTransition } from "react";

import { setRoadmapItemCompletion } from "@/app/roadmaps/actions";
import { usePreferences } from "@/components/preferences/preferences-provider";
import { ProgressBar } from "@/components/roadmap/progress-bar";
import { formatMessage } from "@/i18n/messages";
import type { ItemDemand, RoadmapDemandSnapshot } from "@/lib/roadmaps/demand-types";
import type { RoadmapDefinition, RoadmapItem } from "@/lib/roadmaps/types";
import { cn } from "@/lib/utils";

type SortMode = "learning" | "demand";

type RankedItem = {
  item: RoadmapItem;
  sectionTitle: string;
  sectionSlug: string;
  learningIndex: number;
};

type RoadmapScreenProps = {
  roadmap: RoadmapDefinition;
  initialCompletedItemSlugs: string[];
  paths: Array<{ path: string; title: string }>;
  demand: RoadmapDemandSnapshot;
};

export function RoadmapScreen({
  roadmap,
  initialCompletedItemSlugs,
  paths,
  demand,
}: RoadmapScreenProps) {
  const { copy } = usePreferences();
  const ui = copy.roadmapDetail;
  const [completed, setCompleted] = useState(initialCompletedItemSlugs);
  const [openItem, setOpenItem] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState(roadmap.sections[0]?.slug ?? "");
  const [sortMode, setSortMode] = useState<SortMode>("learning");
  const [error, setError] = useState("");
  const [pending, startTransition] = useTransition();

  const totalItems = useMemo(
    () => roadmap.sections.reduce((count, section) => count + section.items.length, 0),
    [roadmap.sections],
  );
  const completedCount = completed.length;
  const percentage = totalItems === 0 ? 0 : Math.round((completedCount / totalItems) * 100);
  const hasDemand = Object.keys(demand.byItemSlug).length > 0;

  const section =
    roadmap.sections.find((entry) => entry.slug === activeSection) ?? roadmap.sections[0];

  const allRankedItems = useMemo((): RankedItem[] => {
    let learningIndex = 0;
    const flat = roadmap.sections.flatMap((entry) =>
      entry.items.map((item) => {
        learningIndex += 1;
        return {
          item,
          sectionTitle: entry.title,
          sectionSlug: entry.slug,
          learningIndex,
        };
      }),
    );

    if (sortMode !== "demand") {
      return flat.filter((entry) => entry.sectionSlug === section?.slug);
    }

    return [...flat].sort((left, right) => {
      const leftShare = demand.byItemSlug[left.item.slug]?.share ?? -1;
      const rightShare = demand.byItemSlug[right.item.slug]?.share ?? -1;
      if (rightShare !== leftShare) return rightShare - leftShare;
      return left.learningIndex - right.learningIndex;
    });
  }, [demand.byItemSlug, roadmap.sections, section?.slug, sortMode]);

  function setMode(next: SortMode) {
    setSortMode(next);
    setOpenItem(null);
  }

  function toggleComplete(itemSlug: string) {
    const wasCompleted = completed.includes(itemSlug);
    setCompleted((current) =>
      wasCompleted ? current.filter((slug) => slug !== itemSlug) : [...current, itemSlug],
    );
    setError("");
    startTransition(async () => {
      try {
        await setRoadmapItemCompletion(roadmap.path, itemSlug, !wasCompleted);
      } catch {
        setCompleted((current) =>
          wasCompleted ? [...current, itemSlug] : current.filter((slug) => slug !== itemSlug),
        );
        setError(copy.internshipPrep.saveError);
      }
    });
  }

  return (
    <div className="w-full max-w-full safe-top">
      <div className="border-b border-[color:var(--color-line)] bg-[color:var(--color-surface)] px-4 pb-4 pt-3 sm:px-6 lg:px-8">
        <div className="flex items-start gap-3">
          <Link
            href="/roadmaps"
            aria-label={copy.roadmapDetail.backToRoadmaps}
            className="pressable mt-0.5 grid size-9 shrink-0 place-items-center rounded-full bg-[color:var(--color-panel-strong)] text-[color:var(--color-text)]"
          >
            <svg aria-hidden="true" viewBox="0 0 24 24" className="size-5 fill-none stroke-current stroke-2">
              <path d="M15 6 9 12l6 6" />
            </svg>
          </Link>
          <div className="min-w-0 flex-1">
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[color:var(--color-accent)]">
              {roadmap.path}
            </p>
            <h1 className="mt-0.5 text-[22px] font-bold leading-tight tracking-tight text-[color:var(--color-text)]">
              {roadmap.title}
            </h1>
            <p className="mt-1.5 text-[13px] leading-5 text-[color:var(--color-text-muted)]">{roadmap.summary}</p>
          </div>
        </div>

        <div className="mt-4 space-y-2">
          <div className="flex items-center justify-between text-[12px]">
            <span className="font-semibold text-[color:var(--color-text)]">
              {completedCount}/{totalItems} complete
            </span>
            <span className="font-bold text-[color:var(--color-accent)]">{percentage}%</span>
          </div>
          <ProgressBar value={percentage} />
        </div>

        {paths.length > 1 ? (
          <div className="mt-3 flex gap-2 overflow-x-auto no-scrollbar">
            {paths.map((entry) => {
              const selected = entry.path === roadmap.path;
              return (
                <Link
                  key={entry.path}
                  href={`/roadmaps/${entry.path}`}
                  aria-current={selected ? "page" : undefined}
                  className={cn(
                    "pressable shrink-0 rounded-full px-3.5 py-2 text-[12px] font-semibold transition-colors",
                    selected
                      ? "bg-[color:var(--color-accent)] text-[color:var(--color-accent-foreground)]"
                      : "bg-[color:var(--color-panel)] text-[color:var(--color-text-soft)]",
                  )}
                >
                  {entry.title}
                </Link>
              );
            })}
          </div>
        ) : null}
      </div>

      <div className="sticky top-0 z-20 space-y-2.5 border-b border-[color:var(--color-line)] bg-[color:var(--color-background)]/95 px-4 py-2.5 backdrop-blur-md sm:px-6 lg:px-8">
        <div className="flex gap-1.5 self-start rounded-full bg-[color:var(--color-panel)] p-1">
          <button
            type="button"
            onClick={() => setMode("learning")}
            className={cn(
              "flex-1 rounded-full px-3 py-1.5 text-[11px] font-semibold transition-colors sm:flex-none",
              sortMode === "learning"
                ? "bg-[color:var(--color-accent)] text-[color:var(--color-accent-foreground)]"
                : "text-[color:var(--color-text-soft)]",
            )}
          >
            {ui.sortLearning}
          </button>
          <button
            type="button"
            onClick={() => hasDemand && setMode("demand")}
            disabled={!hasDemand}
            className={cn(
              "flex-1 rounded-full px-3 py-1.5 text-[11px] font-semibold transition-colors disabled:opacity-40 sm:flex-none",
              sortMode === "demand"
                ? "bg-[color:var(--color-accent)] text-[color:var(--color-accent-foreground)]"
                : "text-[color:var(--color-text-soft)]",
            )}
          >
            {ui.sortDemand}
          </button>
        </div>

        {sortMode === "learning" ? (
          <div className="flex gap-2 overflow-x-auto no-scrollbar">
            {roadmap.sections.map((entry) => {
              const done = entry.items.filter((item) => completed.includes(item.slug)).length;
              const selected = entry.slug === section?.slug;
              return (
                <button
                  key={entry.slug}
                  type="button"
                  onClick={() => {
                    setActiveSection(entry.slug);
                    setOpenItem(null);
                  }}
                  className={cn(
                    "shrink-0 rounded-full px-3.5 py-2 text-left text-[12px] font-semibold transition-colors",
                    selected
                      ? "bg-[color:var(--color-accent)] text-[color:var(--color-accent-foreground)]"
                      : "bg-[color:var(--color-panel)] text-[color:var(--color-text-soft)]",
                  )}
                >
                  <span className="block leading-tight">{entry.title}</span>
                  <span className={cn("mt-0.5 block text-[10px]", selected ? "text-white/80" : "text-[color:var(--color-text-muted)]")}>
                    {done}/{entry.items.length} · {entry.stage}
                  </span>
                </button>
              );
            })}
          </div>
        ) : null}
      </div>

      {error ? (
        <p role="alert" className="mx-4 mt-3 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-[13px] text-red-700 sm:mx-6">
          {error}
        </p>
      ) : null}

      <section className="px-4 py-4 sm:px-6 lg:px-8">
        <div className="mb-3">
          {sortMode === "demand" ? (
            <>
              <h2 className="text-[16px] font-bold text-[color:var(--color-text)]">{ui.demandTitle}</h2>
              <p className="mt-1 text-[13px] leading-5 text-[color:var(--color-text-muted)]">
                {formatMessage(ui.demandDescription, { role: demand.role })}
              </p>
            </>
          ) : section ? (
            <>
              <h2 className="text-[16px] font-bold text-[color:var(--color-text)]">{section.title}</h2>
              <p className="mt-1 text-[13px] leading-5 text-[color:var(--color-text-muted)]">{section.description}</p>
            </>
          ) : null}
          <p className="mt-1.5 text-[11px] leading-4 text-[color:var(--color-text-soft)]">
            {hasDemand
              ? formatMessage(ui.demandHint, { role: demand.role })
              : ui.demandEmpty}
            {hasDemand ? ` · ${formatMessage(ui.listingsCount, { count: demand.jobCount })}` : null}
          </p>
        </div>

        <div className={cn("divide-y divide-[color:var(--color-line)] overflow-hidden rounded-2xl border border-[color:var(--color-line)] bg-[color:var(--color-card)]", pending && "opacity-80")}>
          {allRankedItems.map((entry, index) => (
            <RoadmapAccordionRow
              key={entry.item.slug}
              item={entry.item}
              index={index + 1}
              completed={completed.includes(entry.item.slug)}
              open={openItem === entry.item.slug}
              demand={demand.byItemSlug[entry.item.slug]}
              sectionLabel={sortMode === "demand" ? formatMessage(ui.fromSection, { section: entry.sectionTitle }) : undefined}
              tierLabels={{
                hot: ui.tierHot,
                rising: ui.tierRising,
                noted: ui.tierNoted,
              }}
                demandShareLabel={ui.demandShare}
                demandWhyLabel={ui.demandWhy}
                demandRole={demand.role}
                linkedSkillLabel={ui.linkedSkill}
                whyItMattersLabel={ui.whyItMatters}
                expectedOutcomeLabel={ui.expectedOutcome}
                nextTopicLabel={ui.nextTopic}
                miniProjectsLabel={ui.miniProjects}
                commonMistakesLabel={ui.commonMistakes}
                resourcesLabel={ui.resources}
                onToggleOpen={() => setOpenItem((current) => (current === entry.item.slug ? null : entry.item.slug))}
                onToggleComplete={() => toggleComplete(entry.item.slug)}
                pending={pending}
              />
            ))}
          </div>
        </section>
    </div>
  );
}

function RoadmapAccordionRow({
  item,
  index,
  completed,
  open,
  demand,
  sectionLabel,
  tierLabels,
  demandShareLabel,
  demandWhyLabel,
  demandRole,
  linkedSkillLabel,
  whyItMattersLabel,
  expectedOutcomeLabel,
  nextTopicLabel,
  miniProjectsLabel,
  commonMistakesLabel,
  resourcesLabel,
  onToggleOpen,
  onToggleComplete,
  pending,
}: {
  item: RoadmapItem;
  index: number;
  completed: boolean;
  open: boolean;
  demand?: ItemDemand;
  sectionLabel?: string;
  tierLabels: Record<ItemDemand["tier"], string>;
  demandShareLabel: string;
  demandWhyLabel: string;
  demandRole: string;
  linkedSkillLabel: string;
  whyItMattersLabel: string;
  expectedOutcomeLabel: string;
  nextTopicLabel: string;
  miniProjectsLabel: string;
  commonMistakesLabel: string;
  resourcesLabel: string;
  onToggleOpen: () => void;
  onToggleComplete: () => void;
  pending: boolean;
}) {
  return (
    <div className="w-full">
      <button
        type="button"
        onClick={onToggleOpen}
        className="flex w-full items-start gap-3 px-3.5 py-3.5 text-left sm:px-4"
        aria-expanded={open}
      >
        <span
          className={cn(
            "mt-0.5 grid size-7 shrink-0 place-items-center rounded-full text-[11px] font-bold",
            completed
              ? "bg-[color:var(--color-accent)] text-[color:var(--color-accent-foreground)]"
              : "bg-[color:var(--color-panel-strong)] text-[color:var(--color-text-soft)]",
          )}
        >
          {completed ? "✓" : index}
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-[14px] font-semibold leading-snug text-[color:var(--color-text)]">
            {item.title}
          </span>
          <span className="mt-1 flex flex-wrap items-center gap-1.5">
            {sectionLabel ? (
              <span className="text-[11px] font-medium text-[color:var(--color-text-soft)]">{sectionLabel}</span>
            ) : (
              <span className="text-[11px] font-medium uppercase tracking-[0.08em] text-[color:var(--color-text-muted)]">
                {item.difficulty}
              </span>
            )}
            {demand ? (
              <span
                className={cn(
                  "rounded-md px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.06em]",
                  demand.tier === "hot" && "bg-[color:var(--color-accent)] text-[color:var(--color-accent-foreground)]",
                  demand.tier === "rising" && "bg-[color:var(--color-panel-strong)] text-[color:var(--color-accent)]",
                  demand.tier === "noted" && "bg-[color:var(--color-panel)] text-[color:var(--color-text-soft)]",
                )}
                title={formatMessage(demandWhyLabel, {
                  share: demand.share,
                  role: demandRole,
                  skill: demand.topSkill,
                })}
              >
                {tierLabels[demand.tier]} · {formatMessage(demandShareLabel, { share: demand.share })}
              </span>
            ) : null}
          </span>
        </span>
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          className={cn(
            "mt-1 size-4 shrink-0 fill-none stroke-[color:var(--color-text-muted)] stroke-2 transition-transform",
            open && "rotate-180",
          )}
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>

      {open ? (
        <div className="space-y-4 border-t border-[color:var(--color-line)] bg-[color:var(--color-panel)] px-3.5 py-4 sm:px-4">
          <p className="text-[13px] leading-5 text-[color:var(--color-text-soft)]">{item.description}</p>

          {demand ? (
            <Detail
              label={formatMessage(linkedSkillLabel, { skill: demand.topSkill })}
              body={formatMessage(demandWhyLabel, {
                share: demand.share,
                role: demandRole,
                skill: demand.topSkill,
              })}
            />
          ) : null}

          <Detail label={whyItMattersLabel} body={item.whyItMatters} />
          <Detail label={expectedOutcomeLabel} body={item.expectedOutcome} />
          {item.nextTopic ? <Detail label={nextTopicLabel} body={item.nextTopic} /> : null}

          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[color:var(--color-text-muted)]">
              {miniProjectsLabel}
            </p>
            <ul className="mt-2 space-y-2">
              {item.miniProjects.map((project) => (
                <li
                  key={project.slug}
                  className="rounded-xl border border-[color:var(--color-line)] bg-[color:var(--color-card)] px-3 py-2.5"
                >
                  <p className="text-[13px] font-semibold text-[color:var(--color-text)]">{project.title}</p>
                  <p className="mt-1 text-[12px] leading-5 text-[color:var(--color-text-muted)]">{project.summary}</p>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[color:var(--color-text-muted)]">
              {commonMistakesLabel}
            </p>
            <ul className="mt-2 space-y-2 text-[12px] leading-5 text-[color:var(--color-text-muted)]">
              {item.commonMistakes.map((mistake) => (
                <li key={mistake.slug}>
                  <span className="font-semibold text-[color:var(--color-text)]">{mistake.title}:</span>{" "}
                  {mistake.explanation}
                </li>
              ))}
            </ul>
          </div>

          {item.recommendedResources.length > 0 ? (
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[color:var(--color-text-muted)]">
                {resourcesLabel}
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                {item.recommendedResources.map((resource) =>
                  resource.url ? (
                    <a
                      key={resource.slug}
                      href={resource.url}
                      target="_blank"
                      rel="noreferrer"
                      className="rounded-full border border-[color:var(--color-line-strong)] bg-[color:var(--color-card)] px-2.5 py-1 text-[11px] font-medium text-[color:var(--color-accent)]"
                    >
                      {resource.title}
                    </a>
                  ) : (
                    <span
                      key={resource.slug}
                      className="rounded-full border border-[color:var(--color-line-strong)] bg-[color:var(--color-card)] px-2.5 py-1 text-[11px] font-medium text-[color:var(--color-text-soft)]"
                    >
                      {resource.title}
                    </span>
                  ),
                )}
              </div>
            </div>
          ) : null}

          <button
            type="button"
            disabled={pending}
            onClick={onToggleComplete}
            className={cn(
              "flex min-h-11 w-full items-center justify-center rounded-xl text-[13px] font-semibold transition disabled:opacity-60",
              completed
                ? "bg-[color:var(--color-panel-strong)] text-[color:var(--color-text)]"
                : "bg-[color:var(--color-accent)] text-[color:var(--color-accent-foreground)]",
            )}
          >
            {completed ? "Mark incomplete" : "Mark complete"}
          </button>
        </div>
      ) : null}
    </div>
  );
}

function Detail({ label, body }: { label: string; body: string }) {
  return (
    <div>
      <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[color:var(--color-text-muted)]">{label}</p>
      <p className="mt-1 text-[13px] leading-5 text-[color:var(--color-text-soft)]">{body}</p>
    </div>
  );
}
