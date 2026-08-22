import "server-only";

import { cache } from "react";

import { LearningPath, UserLevel } from "@/generated/prisma/enums";
import { getPrisma } from "@/lib/db";
import {
  countRoadmapItems,
  roadmapPaths,
  type RoadmapCommonMistake,
  type RoadmapDefinition,
  type RoadmapDifficulty,
  type RoadmapItem,
  type RoadmapMiniProject,
  type RoadmapPath,
  type RoadmapResource,
  type RoadmapStage,
} from "@/lib/roadmaps/types";

export type {
  RoadmapCommonMistake,
  RoadmapDefinition,
  RoadmapDifficulty,
  RoadmapItem,
  RoadmapMiniProject,
  RoadmapPath,
  RoadmapResource,
  RoadmapSection,
  RoadmapStage,
} from "@/lib/roadmaps/types";
export { countRoadmapItems, roadmapDifficulties, roadmapPaths, roadmapStages } from "@/lib/roadmaps/types";

const pathFromEnum: Record<LearningPath, RoadmapPath> = {
  FRONTEND: "frontend",
  BACKEND: "backend",
  FULLSTACK: "fullstack",
};

const stageFromEnum: Record<UserLevel, RoadmapStage> = {
  BEGINNER: "beginner",
  INTERMEDIATE: "intermediate",
  JOB_READY: "job-ready",
};

function asArray<T>(value: unknown): T[] {
  return Array.isArray(value) ? (value as T[]) : [];
}

function mapItem(item: {
  slug: string;
  title: string;
  description: string;
  difficulty: string;
  whyItMatters: string | null;
  expectedOutcome: string | null;
  miniProjects: unknown;
  commonMistakes: unknown;
  nextTopic: string | null;
  resourceLinks: unknown;
}): RoadmapItem {
  const difficulty = (["beginner", "intermediate", "advanced"].includes(item.difficulty)
    ? item.difficulty
    : "beginner") as RoadmapDifficulty;

  return {
    slug: item.slug,
    title: item.title,
    description: item.description,
    difficulty,
    whyItMatters: item.whyItMatters ?? "",
    expectedOutcome: item.expectedOutcome ?? "",
    miniProjects: asArray<RoadmapMiniProject>(item.miniProjects),
    commonMistakes: asArray<RoadmapCommonMistake>(item.commonMistakes),
    recommendedResources: asArray<RoadmapResource>(item.resourceLinks),
    nextTopic: item.nextTopic ?? undefined,
  };
}

function mapRoadmap(row: {
  slug: string;
  title: string;
  description: string;
  audience: string;
  path: LearningPath;
  sections: Array<{
    slug: string;
    title: string;
    description: string;
    stage: UserLevel;
    sortOrder: number;
    items: Array<{
      slug: string;
      title: string;
      description: string;
      difficulty: string;
      whyItMatters: string | null;
      expectedOutcome: string | null;
      miniProjects: unknown;
      commonMistakes: unknown;
      nextTopic: string | null;
      resourceLinks: unknown;
      sortOrder: number;
    }>;
  }>;
}): RoadmapDefinition {
  return {
    path: pathFromEnum[row.path],
    slug: row.slug,
    title: row.title,
    summary: row.description,
    audience: row.audience,
    sections: [...row.sections]
      .sort((a, b) => a.sortOrder - b.sortOrder)
      .map((section) => ({
        slug: section.slug,
        title: section.title,
        description: section.description,
        stage: stageFromEnum[section.stage],
        order: section.sortOrder,
        items: [...section.items].sort((a, b) => a.sortOrder - b.sortOrder).map(mapItem),
      })),
  };
}

const roadmapInclude = {
  sections: {
    include: { items: true },
    orderBy: { sortOrder: "asc" as const },
  },
};

export type RoadmapSummary = {
  path: RoadmapPath;
  slug: string;
  title: string;
  summary: string;
  sectionCount: number;
  itemCount: number;
};

export async function listRoadmapSummaries(): Promise<RoadmapSummary[]> {
  if (!process.env.DATABASE_URL) return [];
  try {
    const rows = await getPrisma().roadmap.findMany({
      select: {
        slug: true,
        title: true,
        description: true,
        path: true,
        sections: {
          select: {
            _count: { select: { items: true } },
          },
        },
      },
      orderBy: { path: "asc" },
    });
    return rows.map((row) => ({
      path: pathFromEnum[row.path],
      slug: row.slug,
      title: row.title,
      summary: row.description,
      sectionCount: row.sections.length,
      itemCount: row.sections.reduce((total, section) => total + section._count.items, 0),
    }));
  } catch (error) {
    console.error("listRoadmapSummaries failed:", error);
    return [];
  }
}

export async function listRoadmaps(): Promise<RoadmapDefinition[]> {
  if (!process.env.DATABASE_URL) return [];
  try {
    const rows = await getPrisma().roadmap.findMany({
      include: roadmapInclude,
      orderBy: { path: "asc" },
    });
    return rows.map(mapRoadmap);
  } catch (error) {
    console.error("listRoadmaps failed:", error);
    return [];
  }
}

/** Lightweight titles for roadmap path tabs (no sections/items). */
export const listRoadmapPathOptions = cache(async (): Promise<Array<{ path: RoadmapPath; title: string }>> => {
  if (!process.env.DATABASE_URL) return [];
  try {
    const rows = await getPrisma().roadmap.findMany({
      select: { path: true, title: true },
      orderBy: { path: "asc" },
    });
    return rows.map((row) => ({ path: pathFromEnum[row.path], title: row.title }));
  } catch (error) {
    console.error("listRoadmapPathOptions failed:", error);
    return [];
  }
});

async function fetchRoadmapByPath(path: RoadmapPath): Promise<RoadmapDefinition | null> {
  if (!roadmapPaths.includes(path) || !process.env.DATABASE_URL) return null;
  const pathEnum = path === "frontend" ? LearningPath.FRONTEND : path === "backend" ? LearningPath.BACKEND : LearningPath.FULLSTACK;
  try {
    const row = await getPrisma().roadmap.findUnique({
      where: { path: pathEnum },
      include: roadmapInclude,
    });
    return row ? mapRoadmap(row) : null;
  } catch (error) {
    console.error("getRoadmapByPath failed:", error);
    return null;
  }
}

/** Dedupes metadata + page fetches within the same request. */
export const getRoadmapByPath = cache(fetchRoadmapByPath);

export async function getRoadmapBySlug(slug: string): Promise<RoadmapDefinition | null> {
  if (!process.env.DATABASE_URL) return null;
  try {
    const row = await getPrisma().roadmap.findUnique({
      where: { slug },
      include: roadmapInclude,
    });
    return row ? mapRoadmap(row) : null;
  } catch (error) {
    console.error("getRoadmapBySlug failed:", error);
    return null;
  }
}
