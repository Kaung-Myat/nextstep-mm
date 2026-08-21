import "server-only";

import { CONTENT_KEYS } from "@/lib/content/keys";
import {
  safeParseAdvisorTemplates,
  type AdvisorTemplates,
  type RecommendedAction,
} from "@/lib/content/schemas";
import { getPrisma } from "@/lib/db";

export type { AdvisorTemplates, RecommendedAction };

export type AdvisorMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

const emptyTemplates: AdvisorTemplates = {
  version: 1,
  quickPrompts: [],
  defaultActions: [],
  responseSets: [],
  fallback: {
    response: "Advisor content is not published yet. Run the database seed to load guidance templates.",
    actions: [],
  },
};

export async function getAdvisorTemplates(): Promise<AdvisorTemplates> {
  if (!process.env.DATABASE_URL) return emptyTemplates;
  try {
    const row = await getPrisma().appContent.findUnique({ where: { key: CONTENT_KEYS.advisorTemplates } });
    const parsed = safeParseAdvisorTemplates(row?.payload);
    if (!parsed.success) {
      console.error("Invalid advisor-templates payload:", parsed.error.flatten());
      return emptyTemplates;
    }
    return parsed.data;
  } catch (error) {
    console.error("getAdvisorTemplates failed:", error);
    return emptyTemplates;
  }
}

export function matchAdvisorAdvice(templates: AdvisorTemplates, prompt: string) {
  const normalized = prompt.toLowerCase();
  const matched =
    templates.responseSets.find((set) => set.keywords.some((keyword) => normalized.includes(keyword))) ??
    null;
  return {
    response: matched?.response ?? templates.fallback.response,
    actions: matched?.actions ?? templates.fallback.actions ?? templates.defaultActions,
  };
}
