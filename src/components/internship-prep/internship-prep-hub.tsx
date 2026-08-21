"use client";

import { useState, useTransition } from "react";

import { resetInternshipPrepProgress, setInternshipPrepItemCompletion } from "@/app/internship-prep/actions";
import { PrepMarketFocus, type PrepMarketSkill } from "@/components/internship-prep/prep-market-focus";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { usePreferences } from "@/components/preferences/preferences-provider";
import { internshipItemKey, type InternshipPrepLocaleCopy } from "@/lib/internship-prep/types";
import { formatMessage } from "@/i18n/messages";

export function InternshipPrepHub({
  initialCompletedKeys,
  copyByLocale,
  marketSkills,
  marketJobCount,
}: {
  initialCompletedKeys: string[];
  copyByLocale: { en: InternshipPrepLocaleCopy; my: InternshipPrepLocaleCopy };
  marketSkills: PrepMarketSkill[];
  marketJobCount: number;
}) {
  const { copy, locale } = usePreferences();
  const content = copyByLocale[locale] ?? copyByLocale.en;
  const ui = copy.internshipPrep;
  const [completed, setCompleted] = useState(() => new Set(initialCompletedKeys));
  const [error, setError] = useState("");
  const [pending, startTransition] = useTransition();
  const total = content.checklists.reduce((sum, checklist) => sum + checklist.items.length, 0);
  const progress = total ? Math.round((completed.size / total) * 100) : 0;

  function toggleItem(id: string) {
    const wasCompleted = completed.has(id);
    setCompleted((current) => {
      const next = new Set(current);
      if (wasCompleted) next.delete(id);
      else next.add(id);
      return next;
    });
    setError("");
    startTransition(async () => {
      try {
        await setInternshipPrepItemCompletion(id, !wasCompleted);
      } catch {
        setCompleted((current) => {
          const next = new Set(current);
          if (wasCompleted) next.add(id);
          else next.delete(id);
          return next;
        });
        setError(ui.saveError);
      }
    });
  }

  function resetChecklist() {
    setCompleted(new Set());
    setError("");
    startTransition(async () => {
      try {
        await resetInternshipPrepProgress();
      } catch {
        setCompleted(new Set(initialCompletedKeys));
        setError(ui.saveError);
      }
    });
  }

  return (
    <div className={`space-y-10 ${pending ? "cursor-wait" : ""}`}>
      <Card tone="accent" className="grid gap-6 p-5 sm:p-6 lg:grid-cols-[1fr_auto] lg:items-center">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[color:var(--color-accent)]">{ui.progressLabel}</p>
          <div className="mt-2 flex items-end gap-3">
            <p className="font-display text-3xl font-semibold text-[color:var(--color-text)]">{progress}%</p>
            <p className="pb-1 text-sm text-[color:var(--color-text-muted)]">{formatMessage(ui.essentialsComplete, { done: completed.size, total })}</p>
          </div>
          <div className="mt-4 h-2.5 overflow-hidden rounded-full bg-white/90" aria-label={`${progress}% complete`}>
            <div className="h-full rounded-full bg-[color:var(--color-accent)] transition-[width] duration-300" style={{ width: `${progress}%` }} />
          </div>
        </div>
        {completed.size > 0 ? <Button variant="secondary" size="sm" disabled={pending} onClick={resetChecklist}>{ui.resetChecklist}</Button> : null}
      </Card>

      {error ? <p role="alert" className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p> : null}

      <PrepMarketFocus skills={marketSkills} jobCount={marketJobCount} />

      <section aria-labelledby="application-materials">
        <div className="mb-6 max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[color:var(--color-accent)]">{ui.applicationEssentials}</p>
          <h2 id="application-materials" className="mt-1.5 text-2xl font-semibold text-[color:var(--color-text)] sm:text-3xl">{ui.essentialsTitle}</h2>
          <p className="mt-3 text-sm leading-7 text-[color:var(--color-text-muted)]">{ui.essentialsDescription}</p>
        </div>
        <div className="grid gap-6 lg:grid-cols-3">
          {content.checklists.map((checklist, cardIndex) => (
            <Card key={checklist.id} tone={cardIndex === 1 ? "accent" : "default"} className="flex flex-col p-5 sm:p-6">
              <CardHeader>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--color-accent)]">{checklist.label}</p>
                <CardTitle>{checklist.title}</CardTitle>
                <CardDescription>{checklist.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-1 flex-col">
                <div className="space-y-2">
                  {checklist.items.map((item, index) => {
                    const id = internshipItemKey(checklist.id, index);
                    const checked = completed.has(id);
                    return (
                      <label key={id} className="group flex cursor-pointer gap-3 rounded-2xl border border-transparent p-2.5 transition-colors hover:border-[color:var(--color-line)] hover:bg-white/70">
                        <input className="sr-only" type="checkbox" checked={checked} disabled={pending} onChange={() => toggleItem(id)} />
                        <span
                          aria-hidden="true"
                          className={`mt-0.5 grid size-5 shrink-0 place-items-center rounded-md border text-xs font-bold transition-colors ${
                            checked
                              ? "border-[color:var(--color-accent)] bg-[color:var(--color-accent)] text-[color:var(--color-accent-foreground)]"
                              : "border-[color:var(--color-line-strong)] bg-[color:var(--color-panel)] text-transparent"
                          }`}
                        >
                          {checked ? "✓" : null}
                        </span>
                        <span className={`text-sm leading-6 transition-colors ${checked ? "text-[color:var(--color-text-muted)] line-through" : "text-[color:var(--color-text)]"}`}>{item}</span>
                      </label>
                    );
                  })}
                </div>
                <div className="mt-5 rounded-2xl bg-[color:var(--color-panel)] p-4 text-sm leading-6 text-[color:var(--color-text-soft)]">
                  <span className="font-semibold text-[color:var(--color-text)]">{ui.quickTip} </span>{checklist.tip}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section aria-labelledby="interview-prep" className="grid gap-6 lg:grid-cols-[1.25fr_0.75fr]">
        <Card tone="muted">
          <CardHeader>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[color:var(--color-accent)]">{ui.interviewPrep}</p>
            <CardTitle id="interview-prep">{ui.interviewTitle}</CardTitle>
            <CardDescription className="text-base">{ui.interviewDescription}</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3 sm:grid-cols-2">
            {content.interviewTopics.map((topic) => (
              <div key={topic.title} className="rounded-[1.4rem] border border-[color:var(--color-line)] bg-white/80 p-5">
                <div className="flex items-center gap-3">
                  <span className="grid size-8 place-items-center rounded-full bg-[color:var(--color-accent-soft)] text-xs font-bold text-[color:var(--color-accent)]">{topic.number}</span>
                  <h3 className="text-lg">{topic.title}</h3>
                </div>
                <p className="mt-3 text-sm leading-6 text-[color:var(--color-text-muted)]">{topic.detail}</p>
                <p className="mt-3 text-sm font-semibold leading-6 text-[color:var(--color-accent)]">{ui.doThis} {topic.action}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card tone="accent">
          <CardHeader>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[color:var(--color-accent)]">{ui.practiceOutLoud}</p>
            <CardTitle>{ui.fiveQuestions}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {content.interviewQuestions.map((question, index) => (
              <div key={question} className="flex gap-3 rounded-2xl border border-[color:var(--color-accent-soft)] bg-white/80 p-4">
                <span className="font-display text-lg text-[color:var(--color-warm)]">{index + 1}.</span>
                <p className="text-sm font-medium leading-6 text-[color:var(--color-text)]">{question}</p>
              </div>
            ))}
            <p className="pt-2 text-sm leading-6 text-[color:var(--color-text-muted)]">{ui.practiceTip}</p>
          </CardContent>
        </Card>
      </section>

      <section aria-labelledby="eight-week-plan">
        <div className="mb-6 max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[color:var(--color-accent)]">{ui.timeline}</p>
          <h2 id="eight-week-plan" className="mt-1.5 text-2xl font-semibold text-[color:var(--color-text)] sm:text-3xl">{ui.timelineTitle}</h2>
          <p className="mt-3 text-sm leading-7 text-[color:var(--color-text-muted)]">{ui.timelineDescription}</p>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {content.weeklyPlan.map((plan) => (
            <Card key={plan.week} className="grid gap-4 p-5 sm:grid-cols-[auto_1fr] sm:p-6">
              <div className="grid size-12 place-items-center rounded-2xl bg-[color:var(--color-accent)] text-white">
                <span className="text-[10px] font-semibold uppercase leading-none tracking-wider">{ui.week}</span>
                <span className="font-display text-xl leading-none">{plan.week}</span>
              </div>
              <div>
                <CardTitle className="text-xl">{plan.title}</CardTitle>
                <p className="mt-2 text-sm leading-6 text-[color:var(--color-text-muted)]">{plan.task}</p>
                <div className="mt-4 inline-flex rounded-full bg-[color:var(--color-panel-strong)] px-3 py-1.5 text-xs font-semibold text-[color:var(--color-text-soft)]">{ui.finishWith} {plan.outcome}</div>
              </div>
            </Card>
          ))}
        </div>
      </section>

      <Card tone="accent" className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <CardTitle className="text-2xl">{ui.nextStepTitle}</CardTitle>
          <CardDescription className="mt-2">{ui.nextStepDescription}</CardDescription>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button href="/roadmaps">{ui.chooseRoadmap}</Button>
          <Button href="/advisor" variant="secondary">{ui.askAdvisor}</Button>
        </div>
      </Card>
    </div>
  );
}
