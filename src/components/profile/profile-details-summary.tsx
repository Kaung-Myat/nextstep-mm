"use client";

import Link from "next/link";

import { usePreferences } from "@/components/preferences/preferences-provider";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";

type ProfileDetailsSummaryProps = {
  targetRole: string | null;
  currentLevel: string | null;
  universityYear: number | null;
  internshipGoalAt: string | null;
};

export function ProfileDetailsSummary({ targetRole, currentLevel, universityYear, internshipGoalAt }: ProfileDetailsSummaryProps) {
  const { copy, locale } = usePreferences();
  const roleLabels: Record<string, string> = {
    FRONTEND: copy.profile.frontend,
    BACKEND: copy.profile.backend,
    FULLSTACK: copy.profile.fullstack,
  };
  const levelLabels: Record<string, string> = {
    BEGINNER: copy.profile.beginner,
    INTERMEDIATE: copy.profile.intermediate,
    JOB_READY: copy.profile.jobReady,
  };
  const date = internshipGoalAt
    ? new Intl.DateTimeFormat(locale === "my" ? "my-MM" : "en-GB", { day: "numeric", month: "long", year: "numeric" }).format(new Date(internshipGoalAt))
    : copy.profile.notSet;
  const rows = [
    [copy.profile.targetRole, targetRole ? roleLabels[targetRole] : copy.profile.notSet],
    [copy.profile.currentLevel, currentLevel ? levelLabels[currentLevel] : copy.profile.notSet],
    [copy.profile.universityYear, universityYear ? String(universityYear) : copy.profile.notSet],
    [copy.profile.internshipGoalDate, date],
  ];

  return (
    <Card className="overflow-hidden p-0">
      <div className="flex items-start gap-3 border-b border-[color:var(--color-line)] px-4 py-3.5">
        <span className="grid size-9 shrink-0 place-items-center rounded-[0.85rem] bg-emerald-100 text-emerald-700">
          <svg aria-hidden="true" viewBox="0 0 24 24" className="size-5 fill-none stroke-current stroke-[1.8]">
            <circle cx="12" cy="8" r="4" />
            <path d="M4.5 21a7.5 7.5 0 0 1 15 0" />
          </svg>
        </span>
        <div className="min-w-0 flex-1">
          <CardTitle className="text-[15px]">{copy.profile.details}</CardTitle>
          <CardDescription className="mt-0.5">{copy.profile.detailsDescription}</CardDescription>
        </div>
        <Link
          href="/settings/edit"
          aria-label={copy.profile.editProfile}
          title={copy.profile.editProfile}
          className="pressable grid size-9 shrink-0 place-items-center rounded-full bg-[color:var(--color-panel-strong)] text-[color:var(--color-accent)]"
        >
          <svg aria-hidden="true" viewBox="0 0 24 24" className="size-[16px] fill-none stroke-current stroke-[1.8]">
            <path d="m4 20 4.2-1 10.6-10.6a2.1 2.1 0 0 0-3-3L5.2 16 4 20Z" />
            <path d="m14.5 6.5 3 3" />
          </svg>
        </Link>
      </div>
      <div className="divide-y divide-[color:var(--color-line)]">
        {rows.map(([label, value]) => (
          <div key={label} className="flex min-h-12 items-center justify-between gap-4 px-4">
            <span className="text-[12px] font-medium text-[color:var(--color-text-muted)]">{label}</span>
            <span className="max-w-[58%] text-right text-[13px] font-semibold text-[color:var(--color-text)]">{value}</span>
          </div>
        ))}
      </div>
    </Card>
  );
}
