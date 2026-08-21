export const roadmapPaths = ["frontend", "backend", "fullstack"] as const;
export type RoadmapPath = (typeof roadmapPaths)[number];

export const roadmapStages = ["beginner", "intermediate", "job-ready"] as const;
export type RoadmapStage = (typeof roadmapStages)[number];

export const roadmapDifficulties = ["beginner", "intermediate", "advanced"] as const;
export type RoadmapDifficulty = (typeof roadmapDifficulties)[number];

export const roadmapResourceKinds = [
  "documentation",
  "course",
  "article",
  "video",
  "practice",
  "tool",
] as const;
export type RoadmapResourceKind = (typeof roadmapResourceKinds)[number];

export type RoadmapResource = {
  slug: string;
  title: string;
  kind: RoadmapResourceKind;
  url?: string;
  note?: string;
};

export type RoadmapCommonMistake = {
  slug: string;
  title: string;
  explanation: string;
};

export type RoadmapMiniProject = {
  slug: string;
  title: string;
  summary: string;
  deliverables: string[];
  stretchGoals?: string[];
};

export type RoadmapItem = {
  slug: string;
  title: string;
  description: string;
  difficulty: RoadmapDifficulty;
  whyItMatters: string;
  expectedOutcome: string;
  miniProjects: RoadmapMiniProject[];
  commonMistakes: RoadmapCommonMistake[];
  recommendedResources: RoadmapResource[];
  nextTopic?: string;
};

export type RoadmapSection = {
  slug: string;
  title: string;
  description: string;
  stage: RoadmapStage;
  order: number;
  items: RoadmapItem[];
};

export type RoadmapDefinition = {
  path: RoadmapPath;
  slug: string;
  title: string;
  summary: string;
  audience: string;
  sections: RoadmapSection[];
};

export function countRoadmapItems(roadmap: RoadmapDefinition) {
  return roadmap.sections.reduce((total, section) => total + section.items.length, 0);
}
