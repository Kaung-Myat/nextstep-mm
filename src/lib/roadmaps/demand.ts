import "server-only";

import { getApprovedJobsCached } from "@/lib/jobs/approved-jobs-query";
import type { MarketRole } from "@/lib/jobs/market-types";
import { skillDictionary } from "@/lib/jobs/skill-extractor";
import type { ItemDemand, RoadmapDemandSnapshot } from "@/lib/roadmaps/demand-types";
import { skillSlugsForItem } from "@/lib/roadmaps/item-skills";
import type { RoadmapDefinition, RoadmapPath } from "@/lib/roadmaps/types";

export type { DemandTier, ItemDemand, RoadmapDemandSnapshot } from "@/lib/roadmaps/demand-types";

const nameBySlug = new Map<string, string>(skillDictionary.map(([slug, name]) => [slug, name]));

function inferRole(title: string, skillNames: string[]): MarketRole {
  const haystack = `${title} ${skillNames.join(" ")}`.toLowerCase();
  const frontendHits = ["frontend", "front-end", "react", "next.js", "css", "ui"].filter((token) =>
    haystack.includes(token),
  ).length;
  const backendHits = ["backend", "back-end", "node", "api", "postgresql", "sql", "docker"].filter((token) =>
    haystack.includes(token),
  ).length;
  if (haystack.includes("fullstack") || haystack.includes("full-stack") || haystack.includes("full stack")) {
    return "fullstack";
  }
  if (frontendHits > 0 && backendHits > 0) return "fullstack";
  if (backendHits > frontendHits) return "backend";
  return "frontend";
}

function tierForShare(share: number): ItemDemand["tier"] {
  if (share >= 35) return "hot";
  if (share >= 18) return "rising";
  return "noted";
}

export async function getRoadmapDemand(roadmap: RoadmapDefinition): Promise<RoadmapDemandSnapshot> {
  const role = roadmap.path as MarketRole;
  const empty: RoadmapDemandSnapshot = { role, jobCount: 0, byItemSlug: {} };

  if (!process.env.DATABASE_URL) return empty;

  try {
    const jobs = await getApprovedJobsCached();

    const roleJobs = jobs.filter((job) => {
      const skillNames = job.skills.map((link) => link.skill.name);
      return inferRole(job.title, skillNames) === role;
    });

    if (roleJobs.length === 0) return empty;

    const skillCounts = new Map<string, number>();
    for (const job of roleJobs) {
      const seen = new Set(job.skills.map((link) => link.skill.slug));
      for (const slug of seen) {
        skillCounts.set(slug, (skillCounts.get(slug) ?? 0) + 1);
      }
    }

    const byItemSlug: Record<string, ItemDemand> = {};
    const itemSlugs = roadmap.sections.flatMap((section) => section.items.map((item) => item.slug));

    for (const itemSlug of itemSlugs) {
      const skillSlugs = skillSlugsForItem(itemSlug);
      if (skillSlugs.length === 0) continue;

      let bestSlug = skillSlugs[0];
      let bestCount = 0;
      for (const slug of skillSlugs) {
        const count = skillCounts.get(slug) ?? 0;
        if (count > bestCount) {
          bestCount = count;
          bestSlug = slug;
        }
      }

      if (bestCount === 0) continue;

      const share = Math.round((bestCount / roleJobs.length) * 100);
      byItemSlug[itemSlug] = {
        itemSlug,
        share,
        count: bestCount,
        topSkill: nameBySlug.get(bestSlug) ?? bestSlug,
        skillSlugs,
        tier: tierForShare(share),
      };
    }

    return { role, jobCount: roleJobs.length, byItemSlug };
  } catch (error) {
    console.error("getRoadmapDemand failed:", error);
    return empty;
  }
}

export function pathToMarketRole(path: RoadmapPath): MarketRole {
  return path;
}
