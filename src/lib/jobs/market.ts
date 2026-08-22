import "server-only";

import { JobLevel } from "@/generated/prisma/enums";
import { getApprovedJobsCached, type ApprovedJobRow } from "@/lib/jobs/approved-jobs-query";
import { decodeJobsPageCursor, encodeJobsPageCursor, jobsPageCursorWhere } from "@/lib/jobs/job-page-cursor";
import { getPrisma } from "@/lib/db";
import type { MarketJob, MarketLevel, MarketRole } from "@/lib/jobs/market-types";
import { rankSkills } from "@/lib/jobs/market-types";

export type { MarketJob, MarketLevel, MarketRole } from "@/lib/jobs/market-types";
export { getStackDescription, rankSkills, rankStacks } from "@/lib/jobs/market-types";

const jobInclude = {
  company: { select: { name: true } },
  skills: { include: { skill: { select: { slug: true, name: true } } }, orderBy: { skill: { name: "asc" as const } } },
};

/** unstable_cache returns ISO strings instead of Date objects. */
function toEpochMs(value: Date | string | null | undefined, fallback: Date | string) {
  const ms = new Date(value ?? fallback).getTime();
  return Number.isFinite(ms) ? ms : Date.now();
}

function daysAgo(postedAt: Date | string | null, createdAt: Date | string) {
  return Math.max(0, Math.floor((Date.now() - toEpochMs(postedAt, createdAt)) / (1000 * 60 * 60 * 24)));
}

function inferRole(title: string, skills: string[]): MarketRole {
  const haystack = `${title} ${skills.join(" ")}`.toLowerCase();
  const frontendHits = ["frontend", "front-end", "react", "next.js", "css", "ui"].filter((token) => haystack.includes(token)).length;
  const backendHits = ["backend", "back-end", "node", "api", "postgresql", "sql", "docker"].filter((token) => haystack.includes(token)).length;
  if (haystack.includes("fullstack") || haystack.includes("full-stack") || haystack.includes("full stack")) return "fullstack";
  if (frontendHits > 0 && backendHits > 0) return "fullstack";
  if (backendHits > frontendHits) return "backend";
  return "frontend";
}

function inferStack(skills: string[]) {
  const preferredPairs = [
    ["Next.js", "PostgreSQL"],
    ["React", "TypeScript"],
    ["React", "Node.js"],
    ["Node.js", "PostgreSQL"],
  ] as const;
  for (const [left, right] of preferredPairs) {
    if (skills.includes(left) && skills.includes(right)) return `${left} + ${right}`;
  }
  if (skills.length >= 2) return `${skills[0]} + ${skills[1]}`;
  return skills[0] ?? "General web";
}

export function mapApprovedJobRow(job: ApprovedJobRow): MarketJob {
  const skills = job.skills.map((link) => link.skill.name);
  return {
    id: job.id,
    title: job.title,
    company: job.company.name,
    role: inferRole(job.title, skills),
    level: job.level === JobLevel.JUNIOR ? "junior" : "intern",
    location: job.location ?? "Myanmar",
    postedDaysAgo: daysAgo(job.postedAt, job.createdAt),
    skills,
    stack: inferStack(skills),
    sourceUrl: job.sourceUrl,
    sourceName: job.sourceName,
  };
}

export type MarketJobsPage = {
  jobs: MarketJob[];
  nextCursor: string | null;
  hasMore: boolean;
};

export async function listApprovedMarketJobsPage(options?: {
  cursor?: string;
  limit?: number;
}): Promise<MarketJobsPage> {
  if (!process.env.DATABASE_URL) return { jobs: [], nextCursor: null, hasMore: false };

  const limit = Math.min(Math.max(options?.limit ?? 20, 1), 50);
  const cursor = options?.cursor?.trim();

  try {
    const decodedCursor = cursor ? decodeJobsPageCursor(cursor) : null;
    if (cursor && !decodedCursor) {
      return { jobs: [], nextCursor: null, hasMore: false };
    }

    const rows = await getPrisma().job.findMany({
      where: {
        status: "APPROVED",
        ...(decodedCursor ? jobsPageCursorWhere(decodedCursor) : {}),
      },
      take: limit + 1,
      orderBy: [{ postedAt: { sort: "desc", nulls: "last" } }, { createdAt: "desc" }, { id: "desc" }],
      include: jobInclude,
    });

    const hasMore = rows.length > limit;
    const page = hasMore ? rows.slice(0, limit) : rows;
    const jobs = page.map(mapApprovedJobRow);
    const lastRow = page[page.length - 1];

    return {
      jobs,
      nextCursor: hasMore && lastRow ? encodeJobsPageCursor(lastRow) : null,
      hasMore,
    };
  } catch (error) {
    console.error("listApprovedMarketJobsPage failed:", error);
    return { jobs: [], nextCursor: null, hasMore: false };
  }
}

/** Used by roadmap demand and other server-side aggregates (cached). */
export async function listApprovedMarketJobs(): Promise<MarketJob[]> {
  const jobs = await getApprovedJobsCached();
  return jobs.map(mapApprovedJobRow);
}

export async function getApprovedJobCount() {
  if (!process.env.DATABASE_URL) return 0;
  try {
    return await getPrisma().job.count({ where: { status: "APPROVED" } });
  } catch (error) {
    console.error("getApprovedJobCount failed:", error);
    return 0;
  }
}

export async function getMarketSkillHighlights(limit = 4) {
  const jobs = await listApprovedMarketJobs();
  return rankSkills(jobs, limit);
}

export type MarketTrendsFilters = {
  role?: "all" | MarketRole;
  level?: "all" | MarketLevel;
  range?: 30 | 90 | 999;
};

export type MarketTrendsLevelStats = {
  count: number;
  topSkill: string;
  avgSkills: number;
};

export type MarketTrendsSnapshot = {
  matchingCount: number;
  skills: Array<{ name: string; count: number }>;
  stacks: Array<{ name: string; count: number }>;
  internStats: MarketTrendsLevelStats;
  juniorStats: MarketTrendsLevelStats;
  recentJobs: MarketJob[];
};

function summarizeLevel(jobs: MarketJob[]): MarketTrendsLevelStats {
  if (jobs.length === 0) {
    return { count: 0, topSkill: "—", avgSkills: 0 };
  }

  const totals = new Map<string, number>();
  let skillCount = 0;
  for (const job of jobs) {
    skillCount += job.skills.length;
    for (const skill of job.skills) {
      totals.set(skill, (totals.get(skill) ?? 0) + 1);
    }
  }

  const topSkill =
    [...totals.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))[0]?.[0] ?? "—";

  return {
    count: jobs.length,
    topSkill,
    avgSkills: Number((skillCount / jobs.length).toFixed(1)),
  };
}

function rankNames(values: string[]) {
  const totals = new Map<string, number>();
  values.forEach((value) => totals.set(value, (totals.get(value) ?? 0) + 1));
  return [...totals.entries()]
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
}

export async function getMarketTrends(filters: MarketTrendsFilters = {}): Promise<MarketTrendsSnapshot> {
  const role = filters.role ?? "all";
  const level = filters.level ?? "all";
  const range = filters.range ?? 90;

  const jobs = await listApprovedMarketJobs();
  const filtered = jobs.filter(
    (job) =>
      (role === "all" || job.role === role) &&
      (level === "all" || job.level === level) &&
      job.postedDaysAgo <= range,
  );

  const interns = filtered.filter((job) => job.level === "intern");
  const juniors = filtered.filter((job) => job.level === "junior");

  return {
    matchingCount: filtered.length,
    skills: rankNames(filtered.flatMap((job) => job.skills)).slice(0, 8),
    stacks: rankNames(filtered.map((job) => job.stack)).slice(0, 4),
    internStats: summarizeLevel(interns),
    juniorStats: summarizeLevel(juniors),
    recentJobs: [...filtered].sort((a, b) => a.postedDaysAgo - b.postedDaysAgo).slice(0, 4),
  };
}
