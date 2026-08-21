import type {
  InternshipChecklistDefinition,
  InternshipChecklistId,
  InternshipPrepLocaleCopy,
  InternshipPrepPayload,
} from "@/lib/content/schemas";

export type {
  InternshipChecklistDefinition,
  InternshipChecklistId,
  InternshipPrepLocaleCopy,
  InternshipPrepPayload,
};

export type LocalizedChecklist = InternshipPrepLocaleCopy["checklists"][number];
export type LocalizedInterviewTopic = InternshipPrepLocaleCopy["interviewTopics"][number];
export type LocalizedWeeklyPlan = InternshipPrepLocaleCopy["weeklyPlan"][number];

export function internshipItemKey(checklistId: InternshipChecklistId, index: number) {
  return `${checklistId}-${index}`;
}

export function allInternshipItemKeys(definitions: readonly InternshipChecklistDefinition[]) {
  return definitions.flatMap((checklist) =>
    Array.from({ length: checklist.itemCount }, (_, index) => internshipItemKey(checklist.id, index)),
  );
}

export function internshipCategoryCounts(
  definitions: readonly InternshipChecklistDefinition[],
  completedKeys: readonly string[],
) {
  const completed = new Set(completedKeys);
  return Object.fromEntries(
    definitions.map((checklist) => {
      const done = Array.from({ length: checklist.itemCount }, (_, index) =>
        internshipItemKey(checklist.id, index),
      ).filter((key) => completed.has(key)).length;
      return [checklist.id, { done, total: checklist.itemCount }];
    }),
  ) as Record<InternshipChecklistId, { done: number; total: number }>;
}
