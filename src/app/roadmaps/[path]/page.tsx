import { notFound } from "next/navigation";
import type { Metadata } from "next";

import { RoadmapScreen } from "@/components/roadmap/roadmap-screen";
import { getCompletedItemSlugs } from "@/lib/roadmap-progress";
import { getRoadmapDemand } from "@/lib/roadmaps/demand";
import { getRoadmapByPath, listRoadmaps, roadmapPaths, type RoadmapPath } from "@/lib/roadmaps";

type RoadmapDetailPageProps = {
  params: Promise<{
    path: string;
  }>;
};

export function generateStaticParams() {
  return roadmapPaths.map((path) => ({ path }));
}

export async function generateMetadata({
  params,
}: RoadmapDetailPageProps): Promise<Metadata> {
  const { path } = await params;

  if (!roadmapPaths.includes(path as RoadmapPath)) {
    return {};
  }

  const roadmap = await getRoadmapByPath(path as RoadmapPath);
  if (!roadmap) return {};

  return {
    title: roadmap.title,
    description: roadmap.summary,
  };
}

export default async function RoadmapDetailPage({
  params,
}: RoadmapDetailPageProps) {
  const { path } = await params;

  if (!roadmapPaths.includes(path as RoadmapPath)) {
    notFound();
  }

  const roadmap = await getRoadmapByPath(path as RoadmapPath);
  if (!roadmap) {
    notFound();
  }

  const [completedItemSlugs, allRoadmaps, demand] = await Promise.all([
    getCompletedItemSlugs(roadmap.slug),
    listRoadmaps(),
    getRoadmapDemand(roadmap),
  ]);

  return (
    <RoadmapScreen
      roadmap={roadmap}
      initialCompletedItemSlugs={completedItemSlugs}
      paths={allRoadmaps.map((entry) => ({ path: entry.path, title: entry.title }))}
      demand={demand}
    />
  );
}
