import { z } from "zod";

const checklistIdSchema = z.enum(["resume", "portfolio", "github"]);

const localizedChecklistSchema = z.object({
  id: checklistIdSchema,
  label: z.string().min(1),
  title: z.string().min(1),
  description: z.string().min(1),
  tip: z.string().min(1),
  items: z.array(z.string().min(1)).min(1),
});

const localizedInterviewTopicSchema = z.object({
  number: z.string().min(1),
  title: z.string().min(1),
  detail: z.string().min(1),
  action: z.string().min(1),
});

const localizedWeeklyPlanSchema = z.object({
  week: z.string().min(1),
  title: z.string().min(1),
  task: z.string().min(1),
  outcome: z.string().min(1),
});

const internshipPrepLocaleSchema = z.object({
  checklists: z.array(localizedChecklistSchema),
  interviewTopics: z.array(localizedInterviewTopicSchema),
  interviewQuestions: z.array(z.string().min(1)),
  weeklyPlan: z.array(localizedWeeklyPlanSchema),
});

export const internshipPrepPayloadSchema = z.object({
  version: z.number().int().positive().default(1),
  checklists: z.array(
    z.object({
      id: checklistIdSchema,
      itemCount: z.number().int().positive(),
    }),
  ),
  copy: z.object({
    en: internshipPrepLocaleSchema,
    my: internshipPrepLocaleSchema,
  }),
});

export type InternshipPrepPayload = z.infer<typeof internshipPrepPayloadSchema>;
export type InternshipPrepLocaleCopy = z.infer<typeof internshipPrepLocaleSchema>;
export type InternshipChecklistId = z.infer<typeof checklistIdSchema>;
export type InternshipChecklistDefinition = InternshipPrepPayload["checklists"][number];

const recommendedActionSchema = z.object({
  title: z.string().min(1),
  detail: z.string().min(1),
  href: z.string().min(1),
  linkLabel: z.string().min(1),
});

export const advisorTemplatesSchema = z.object({
  version: z.number().int().positive().default(1),
  quickPrompts: z.array(z.string().min(1)),
  defaultActions: z.array(recommendedActionSchema),
  responseSets: z.array(
    z.object({
      keywords: z.array(z.string().min(1)).min(1),
      response: z.string().min(1),
      actions: z.array(recommendedActionSchema),
    }),
  ),
  fallback: z.object({
    response: z.string().min(1),
    actions: z.array(recommendedActionSchema).optional(),
  }),
});

export type AdvisorTemplates = z.infer<typeof advisorTemplatesSchema>;
export type RecommendedAction = z.infer<typeof recommendedActionSchema>;

const roadmapResourceSchema = z.object({
  slug: z.string().min(1),
  title: z.string().min(1),
  kind: z.enum(["documentation", "course", "article", "video", "practice", "tool"]),
  url: z.string().optional(),
  note: z.string().optional(),
});

const roadmapItemSchema = z.object({
  slug: z.string().min(1),
  title: z.string().min(1),
  description: z.string().min(1),
  difficulty: z.enum(["beginner", "intermediate", "advanced"]),
  whyItMatters: z.string().min(1),
  expectedOutcome: z.string().min(1),
  miniProjects: z.array(
    z.object({
      slug: z.string().min(1),
      title: z.string().min(1),
      summary: z.string().min(1),
      deliverables: z.array(z.string().min(1)),
      stretchGoals: z.array(z.string().min(1)).optional(),
    }),
  ),
  commonMistakes: z.array(
    z.object({
      slug: z.string().min(1),
      title: z.string().min(1),
      explanation: z.string().min(1),
    }),
  ),
  recommendedResources: z.array(roadmapResourceSchema),
  nextTopic: z.string().optional(),
});

const roadmapSectionSchema = z.object({
  slug: z.string().min(1),
  title: z.string().min(1),
  description: z.string().min(1),
  stage: z.enum(["beginner", "intermediate", "job-ready"]),
  order: z.number().int().positive(),
  items: z.array(roadmapItemSchema).min(1),
});

export const roadmapDefinitionSchema = z.object({
  version: z.number().int().positive().default(1),
  path: z.enum(["frontend", "backend", "fullstack"]),
  slug: z.enum(["frontend", "backend", "fullstack"]),
  title: z.string().min(1),
  summary: z.string().min(1),
  audience: z.string().min(1),
  sections: z.array(roadmapSectionSchema).min(1),
});

export type RoadmapContentDefinition = z.infer<typeof roadmapDefinitionSchema>;

export function parseInternshipPrepPayload(data: unknown): InternshipPrepPayload {
  return internshipPrepPayloadSchema.parse(data);
}

export function safeParseInternshipPrepPayload(data: unknown) {
  return internshipPrepPayloadSchema.safeParse(data);
}

export function parseAdvisorTemplates(data: unknown): AdvisorTemplates {
  return advisorTemplatesSchema.parse(data);
}

export function safeParseAdvisorTemplates(data: unknown) {
  return advisorTemplatesSchema.safeParse(data);
}

export function parseRoadmapDefinition(data: unknown): RoadmapContentDefinition {
  return roadmapDefinitionSchema.parse(data);
}

export function safeParseRoadmapDefinition(data: unknown) {
  return roadmapDefinitionSchema.safeParse(data);
}
