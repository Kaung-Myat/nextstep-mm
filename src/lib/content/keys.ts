/** Stable AppContent keys and content file layout. */

export const CONTENT_KEYS = {
  internshipPrep: "internship-prep",
  advisorTemplates: "advisor-templates",
} as const;

export type ContentKey = (typeof CONTENT_KEYS)[keyof typeof CONTENT_KEYS];

/** Relative to repo root. Authoritative source for curated content. */
export const CONTENT_PATHS = {
  internshipPrep: "content/internship-prep.json",
  advisorTemplates: "content/advisor-templates.json",
  roadmapsDir: "content/roadmaps",
} as const;
