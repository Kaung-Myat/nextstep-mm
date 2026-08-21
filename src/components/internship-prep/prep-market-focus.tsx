"use client";

import Link from "next/link";

import { usePreferences } from "@/components/preferences/preferences-provider";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { formatMessage } from "@/i18n/messages";

export type PrepMarketSkill = {
  name: string;
  share: number;
};

export function PrepMarketFocus({
  skills,
  jobCount,
}: {
  skills: PrepMarketSkill[];
  jobCount: number;
}) {
  const { copy } = usePreferences();
  const ui = copy.internshipPrep;
  const top = skills.slice(0, 5);
  const primary = top[0]?.name ?? "";
  const secondary = top[1]?.name ?? top[0]?.name ?? "";
  const tertiary = top[2]?.name ?? secondary;

  if (top.length === 0 || jobCount === 0) {
    return (
      <Card tone="muted" className="p-5 sm:p-6">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[color:var(--color-accent)]">{ui.marketFocusLabel}</p>
        <CardTitle className="mt-1.5 text-xl">{ui.marketFocusEmptyTitle}</CardTitle>
        <CardDescription className="mt-2">{ui.marketFocusEmptyDescription}</CardDescription>
        <Link
          href="/trends"
          className="mt-4 inline-flex text-sm font-semibold text-[color:var(--color-accent)] underline-offset-2 hover:underline"
        >
          {ui.viewTrends}
        </Link>
      </Card>
    );
  }

  const tips = [
    formatMessage(ui.marketTipResume, { skill: primary, skillB: secondary }),
    formatMessage(ui.marketTipPortfolio, { skill: primary, skillB: secondary }),
    formatMessage(ui.marketTipInterview, { skill: primary, skillB: tertiary }),
  ];

  return (
    <Card tone="accent" className="overflow-hidden p-0">
      <div className="border-b border-[color:var(--color-line)] px-5 py-4 sm:px-6">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[color:var(--color-accent)]">{ui.marketFocusLabel}</p>
        <CardTitle className="mt-1.5 text-xl sm:text-2xl">{ui.marketFocusTitle}</CardTitle>
        <CardDescription className="mt-2">
          {formatMessage(ui.marketFocusDescription, { count: jobCount })}
        </CardDescription>
      </div>

      <div className="space-y-5 px-5 py-5 sm:px-6">
        <div>
          <p className="text-[12px] font-semibold text-[color:var(--color-text-muted)]">{ui.marketSkillsHeading}</p>
          <div className="mt-2.5 flex flex-wrap gap-2">
            {top.map((skill) => (
              <span
                key={skill.name}
                className="inline-flex items-center gap-1.5 rounded-full bg-[color:var(--color-panel-strong)] px-3 py-1.5 text-[12px] font-semibold text-[color:var(--color-text)]"
              >
                {skill.name}
                <span className="tabular-nums text-[color:var(--color-accent)]">{skill.share}%</span>
              </span>
            ))}
          </div>
        </div>

        <div>
          <p className="text-[12px] font-semibold text-[color:var(--color-text-muted)]">{ui.marketExtrasHeading}</p>
          <ul className="mt-2.5 space-y-2">
            {tips.map((tip) => (
              <li
                key={tip}
                className="rounded-2xl bg-[color:var(--color-panel)] px-3.5 py-3 text-sm leading-6 text-[color:var(--color-text-soft)]"
              >
                {tip}
              </li>
            ))}
          </ul>
        </div>

        <Link
          href="/trends"
          className="inline-flex text-sm font-semibold text-[color:var(--color-accent)] underline-offset-2 hover:underline"
        >
          {ui.viewTrends}
        </Link>
      </div>
    </Card>
  );
}
