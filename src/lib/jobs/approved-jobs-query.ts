import "server-only";

import { unstable_cache } from "next/cache";

import type { JobLevel } from "@/generated/prisma/enums";
import { getPrisma } from "@/lib/db";

export type ApprovedJobRow = {
  id: string;
  title: string;
  level: JobLevel | null;
  location: string | null;
  postedAt: Date | null;
  createdAt: Date;
  sourceUrl: string;
  sourceName: string;
  company: { name: string };
  skills: Array<{ skill: { slug: string; name: string } }>;
};

async function queryApprovedJobs(): Promise<ApprovedJobRow[]> {
  if (!process.env.DATABASE_URL) return [];

  try {
    return await getPrisma().job.findMany({
      where: { status: "APPROVED" },
      include: {
        company: { select: { name: true } },
        skills: { include: { skill: { select: { slug: true, name: true } } }, orderBy: { skill: { name: "asc" } } },
      },
      orderBy: [{ postedAt: "desc" }, { createdAt: "desc" }],
    });
  } catch (error) {
    console.error("queryApprovedJobs failed:", error);
    return [];
  }
}

/** Shared cached job rows for market trends, home, and roadmap demand. */
export const getApprovedJobsCached = unstable_cache(queryApprovedJobs, ["approved-market-jobs"], {
  revalidate: 120,
  tags: ["market-jobs"],
});
