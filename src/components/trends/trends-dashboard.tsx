"use client";

import { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { OptionSheetField } from "@/components/profile/native-pickers";
import { usePreferences } from "@/components/preferences/preferences-provider";
import { formatMessage } from "@/i18n/messages";
import { getStackDescription, type MarketJob, type MarketLevel, type MarketRole } from "@/lib/jobs/market-types";

type RoleFilter = "all" | MarketRole;
type LevelFilter = "all" | MarketLevel;
type RangeFilter = 30 | 90 | 999;

function rank(values: string[]) {
  const totals = new Map<string, number>();
  values.forEach((value) => totals.set(value, (totals.get(value) ?? 0) + 1));
  return [...totals.entries()].map(([name, count]) => ({ name, count })).sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
}

function topSkill(jobs: MarketJob[]) {
  return rank(jobs.flatMap((job) => job.skills))[0]?.name ?? "—";
}

export function TrendsDashboard({ jobs }: { jobs: MarketJob[] }) {
  const { copy } = usePreferences();
  const ui = copy.trends;
  const [role, setRole] = useState<RoleFilter>("all");
  const [level, setLevel] = useState<LevelFilter>("all");
  const [range, setRange] = useState<RangeFilter>(90);

  const filteredJobs = useMemo(
    () => jobs.filter((job) => (role === "all" || job.role === role) && (level === "all" || job.level === level) && job.postedDaysAgo <= range),
    [jobs, role, level, range],
  );
  const skills = rank(filteredJobs.flatMap((job) => job.skills)).slice(0, 8);
  const stacks = rank(filteredJobs.map((job) => job.stack)).slice(0, 4);
  const maxSkillCount = skills[0]?.count ?? 1;
  const interns = filteredJobs.filter((job) => job.level === "intern");
  const juniors = filteredJobs.filter((job) => job.level === "junior");

  function resetFilters() {
    setRole("all");
    setLevel("all");
    setRange(90);
  }

  if (jobs.length === 0) {
    return (
      <Card className="py-14 text-center">
        <CardTitle>{ui.emptyTitle}</CardTitle>
        <CardDescription className="mt-3">{ui.emptyDescription}</CardDescription>
        <Button className="mt-5" href="/jobs">{ui.viewAllJobs}</Button>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <Card className="p-3.5">
        <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[color:var(--color-accent)]">{ui.filterLabel}</p>
        <p className="mt-1 text-[12px] text-[color:var(--color-text-muted)]">{ui.dataSource}</p>
        <div className="mt-3 grid gap-2">
          <OptionSheetField
            label={ui.role}
            value={role}
            placeholder={ui.allRoles}
            size="compact"
            sheetTitle={ui.role}
            onChange={(value) => setRole(value as RoleFilter)}
            options={[
              { value: "all", label: ui.allRoles },
              { value: "frontend", label: ui.frontend },
              { value: "backend", label: ui.backend },
              { value: "fullstack", label: ui.fullstack },
            ]}
          />
          <OptionSheetField
            label={ui.level}
            value={level}
            placeholder={ui.internJunior}
            size="compact"
            sheetTitle={ui.level}
            onChange={(value) => setLevel(value as LevelFilter)}
            options={[
              { value: "all", label: ui.internJunior },
              { value: "intern", label: ui.internships },
              { value: "junior", label: ui.juniorRoles },
            ]}
          />
          <OptionSheetField
            label={ui.timeRange}
            value={String(range)}
            placeholder={ui.last90}
            size="compact"
            sheetTitle={ui.timeRange}
            onChange={(value) => setRange(Number(value) as RangeFilter)}
            options={[
              { value: "30", label: ui.last30 },
              { value: "90", label: ui.last90 },
              { value: "999", label: ui.allData },
            ]}
          />
        </div>
        <div className="mt-3 flex items-center justify-between border-t border-[color:var(--color-line)] pt-3">
          <p className="text-[12px] text-[color:var(--color-text-muted)]">
            <span className="font-bold text-[color:var(--color-text)]">{filteredJobs.length}</span> {ui.matchingListings}
          </p>
          <button type="button" onClick={resetFilters} className="text-[12px] font-semibold text-[color:var(--color-accent)]">
            {ui.resetFilters}
          </button>
        </div>
      </Card>

      {filteredJobs.length === 0 ? (
        <Card className="py-10 text-center">
          <CardTitle>{ui.noMatchTitle}</CardTitle>
          <CardDescription className="mt-2">{ui.noMatchDescription}</CardDescription>
          <Button className="mt-4" onClick={resetFilters} size="sm">{ui.resetFilters}</Button>
        </Card>
      ) : (
        <>
          <Card>
            <CardHeader>
              <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[color:var(--color-accent)]">{ui.demandSignals}</p>
              <CardTitle className="mt-1">{ui.topSkills}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {skills.map((skill, index) => {
                const share = Math.round((skill.count / filteredJobs.length) * 100);
                return (
                  <div key={skill.name} className="grid grid-cols-[1.1rem_minmax(0,1fr)_2.5rem] items-center gap-2">
                    <span className="text-[11px] font-bold text-[color:var(--color-text-muted)]">{index + 1}</span>
                    <div>
                      <div className="flex items-center justify-between gap-2">
                        <p className="truncate text-[13px] font-semibold text-[color:var(--color-text)]">{skill.name}</p>
                        <span className="text-[12px] font-bold text-[color:var(--color-text)]">{share}%</span>
                      </div>
                      <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-[color:var(--color-panel-strong)]">
                        <div className="h-full rounded-full bg-[color:var(--color-accent)]" style={{ width: `${(skill.count / maxSkillCount) * 100}%` }} />
                      </div>
                    </div>
                    <span className="sr-only">{ui.shareOfListings}</span>
                  </div>
                );
              })}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[color:var(--color-accent)]">{ui.roleComparison}</p>
              <CardTitle className="mt-1">{ui.internVsJunior}</CardTitle>
            </CardHeader>
            <CardContent className="mt-3 overflow-hidden rounded-[var(--radius-control)] border border-[color:var(--color-line)] p-0">
              <div className="grid grid-cols-[1fr_0.7fr_0.7fr] border-b border-[color:var(--color-line)] bg-[color:var(--color-panel)] px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-[color:var(--color-text-muted)]">
                <span>{ui.measure}</span>
                <span>{ui.intern}</span>
                <span>{ui.junior}</span>
              </div>
              {[
                [ui.listings, String(interns.length), String(juniors.length)],
                [ui.topSkill, topSkill(interns), topSkill(juniors)],
                [
                  ui.avgSkills,
                  interns.length ? (interns.reduce((sum, job) => sum + job.skills.length, 0) / interns.length).toFixed(1) : "—",
                  juniors.length ? (juniors.reduce((sum, job) => sum + job.skills.length, 0) / juniors.length).toFixed(1) : "—",
                ],
              ].map(([label, intern, junior]) => (
                <div key={label} className="grid grid-cols-[1fr_0.7fr_0.7fr] border-b border-[color:var(--color-line)] px-3 py-3 text-[13px] last:border-0">
                  <span className="text-[color:var(--color-text-muted)]">{label}</span>
                  <span className="font-semibold">{intern}</span>
                  <span className="font-semibold">{junior}</span>
                </div>
              ))}
            </CardContent>
            <p className="mt-3 text-[12px] leading-5 text-[color:var(--color-text-muted)]">
              <span className="font-semibold text-[color:var(--color-text)]">{ui.readCarefully}</span> {ui.disclaimer}
            </p>
          </Card>

          <section aria-labelledby="stack-trends">
            <h2 id="stack-trends" className="mb-2 px-0.5 text-[13px] font-semibold uppercase tracking-[0.08em] text-[color:var(--color-text-muted)]">
              {ui.stackCards}
            </h2>
            <div className="grid grid-cols-2 gap-2">
              {stacks.map((stack, index) => (
                <Card key={stack.name} className="p-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="grid size-7 place-items-center rounded-lg bg-[color:var(--color-panel-strong)] text-[11px] font-bold text-[color:var(--color-accent)]">{index + 1}</span>
                    <span className="text-[12px] font-bold">{Math.round((stack.count / filteredJobs.length) * 100)}%</span>
                  </div>
                  <CardTitle className="mt-2 text-[14px]">{stack.name}</CardTitle>
                  <CardDescription className="mt-1 line-clamp-2 text-[11px] leading-4">{getStackDescription(stack.name)}</CardDescription>
                </Card>
              ))}
            </div>
          </section>

          <Card className="overflow-hidden p-0">
            <div className="flex items-center justify-between gap-3 border-b border-[color:var(--color-line)] px-3.5 py-3">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[color:var(--color-accent)]">{ui.recentlyAdded}</p>
                <CardTitle className="mt-0.5 text-[15px]">{ui.latestPreview}</CardTitle>
              </div>
              <Button href="/jobs" variant="secondary" size="sm">{ui.viewAllJobs}</Button>
            </div>
            <div className="divide-y divide-[color:var(--color-line)]">
              {[...filteredJobs]
                .sort((a, b) => a.postedDaysAgo - b.postedDaysAgo)
                .slice(0, 4)
                .map((job) => (
                  <div key={job.id} className="px-3.5 py-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="truncate text-[14px] font-semibold text-[color:var(--color-text)]">{job.title}</p>
                        <p className="mt-0.5 text-[12px] text-[color:var(--color-text-muted)]">{job.company}</p>
                      </div>
                      <span className="shrink-0 text-[11px] text-[color:var(--color-text-muted)]">{formatMessage(ui.daysAgo, { days: job.postedDaysAgo })}</span>
                    </div>
                    <p className="mt-1 truncate text-[11px] text-[color:var(--color-text-soft)]">{job.skills.slice(0, 3).join(" · ")}</p>
                  </div>
                ))}
            </div>
          </Card>
        </>
      )}
    </div>
  );
}
