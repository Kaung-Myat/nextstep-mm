import { redirect } from "next/navigation";

import { HomeDashboard } from "@/components/home/home-dashboard";
import {
  getInternshipChecklistDefinitions,
  internshipCategoryCounts,
} from "@/lib/internship-prep";
import { getCompletedInternshipItemKeys } from "@/lib/internship-prep-progress";
import { listApprovedMarketJobs } from "@/lib/jobs/market";
import { rankSkills } from "@/lib/jobs/market-types";
import { getCurrentProfile } from "@/lib/profile";
import { getCompletedItemSlugs } from "@/lib/roadmap-progress";
import { getRoadmapByPath, type RoadmapPath } from "@/lib/roadmaps";

const rolePaths = { FRONTEND: "frontend", BACKEND: "backend", FULLSTACK: "fullstack" } as const;

export default async function HomePage() {
  const profile = await getCurrentProfile();
  if (!profile) redirect("/onboarding");

  const path: RoadmapPath = profile?.targetRole ? rolePaths[profile.targetRole] : "frontend";
  const [roadmap, completed, prepKeys, marketJobs, checklistDefinitions] = await Promise.all([
    getRoadmapByPath(path),
    getCompletedItemSlugs(path),
    getCompletedInternshipItemKeys(),
    listApprovedMarketJobs(),
    getInternshipChecklistDefinitions(),
  ]);

  const items = roadmap?.sections.flatMap((section) => section.items) ?? [];
  const completedCount = items.filter((item) => completed.includes(item.slug)).length;
  const percentage = items.length ? Math.round((completedCount / items.length) * 100) : 0;
  const nextItem = items.find((item) => !completed.includes(item.slug)) ?? items[0];
  const goalDate =
    profile?.internshipGoalAt?.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }) ?? null;
  const prepCounts = internshipCategoryCounts(checklistDefinitions, prepKeys);
  const marketSkills = rankSkills(marketJobs, 4).map((skill) => ({ name: skill.name, share: skill.share }));

  return (
    <HomeDashboard
      path={path}
      percentage={percentage}
      completedCount={completedCount}
      remainingCount={Math.max(items.length - completedCount, 0)}
      nextItemTitle={nextItem?.title ?? "Explore your roadmap"}
      nextItemDescription={
        nextItem?.description ?? "Publish roadmap content with the database seed to unlock guided topics."
      }
      goalDate={goalDate}
      prepCounts={prepCounts}
      marketSkills={marketSkills}
      hasRoadmap={Boolean(roadmap && items.length > 0)}
    />
  );
}
