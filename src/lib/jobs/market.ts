import "server-only";

import { JobLevel } from "@/generated/prisma/enums";
import { getPrisma } from "@/lib/db";
import type { MarketJob, MarketRole } from "@/lib/jobs/market-types";

export type { MarketJob, MarketLevel, MarketRole } from "@/lib/jobs/market-types";
export { getStackDescription, rankSkills, rankStacks } from "@/lib/jobs/market-types";

function daysAgo(date: Date | null, fallback: Date) {
  const source = date ?? fallback;
  return Math.max(0, Math.floor((Date.now() - source.getTime()) / (1000 * 60 * 60 * 24)));
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

export async function listApprovedMarketJobs(): Promise<MarketJob[]> {
  if (!process.env.DATABASE_URL) return [];

  try {
    const jobs = await getPrisma().job.findMany({
      where: { status: "APPROVED" },
      include: {
        company: { select: { name: true } },
        skills: { include: { skill: { select: { name: true } } }, orderBy: { skill: { name: "asc" } } },
      },
      orderBy: [{ postedAt: "desc" }, { createdAt: "desc" }],
    });

    return jobs.map((job) => {
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
    });
  } catch (error) {
    console.error("listApprovedMarketJobs failed:", error);
    return [];
  }
}
