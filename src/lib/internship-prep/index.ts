import "server-only";

import { CONTENT_KEYS } from "@/lib/content/keys";
import { safeParseInternshipPrepPayload } from "@/lib/content/schemas";
import { getPrisma } from "@/lib/db";
import type { InternshipPrepLocaleCopy, InternshipPrepPayload } from "@/lib/internship-prep/types";

export type {
  InternshipChecklistDefinition,
  InternshipChecklistId,
  InternshipPrepLocaleCopy,
  InternshipPrepPayload,
  LocalizedChecklist,
  LocalizedInterviewTopic,
  LocalizedWeeklyPlan,
} from "@/lib/internship-prep/types";
export {
  allInternshipItemKeys,
  internshipCategoryCounts,
  internshipItemKey,
} from "@/lib/internship-prep/types";

const emptyCopy: InternshipPrepLocaleCopy = {
  checklists: [],
  interviewTopics: [],
  interviewQuestions: [],
  weeklyPlan: [],
};

const emptyPayload: InternshipPrepPayload = {
  version: 1,
  checklists: [],
  copy: { en: emptyCopy, my: emptyCopy },
};

export async function getInternshipPrepPayload(): Promise<InternshipPrepPayload> {
  if (!process.env.DATABASE_URL) return emptyPayload;
  try {
    const row = await getPrisma().appContent.findUnique({ where: { key: CONTENT_KEYS.internshipPrep } });
    const parsed = safeParseInternshipPrepPayload(row?.payload);
    if (!parsed.success) {
      console.error("Invalid internship-prep payload:", parsed.error.flatten());
      return emptyPayload;
    }
    return parsed.data;
  } catch (error) {
    console.error("getInternshipPrepPayload failed:", error);
    return emptyPayload;
  }
}

export async function getInternshipPrepCopy(locale: "en" | "my") {
  const payload = await getInternshipPrepPayload();
  return payload.copy[locale] ?? payload.copy.en ?? emptyCopy;
}

export async function getInternshipChecklistDefinitions() {
  const payload = await getInternshipPrepPayload();
  return payload.checklists;
}
