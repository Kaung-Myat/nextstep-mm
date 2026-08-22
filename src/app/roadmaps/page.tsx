import { LocalizedPageShell } from "@/components/layout/localized-page-shell";
import { RoadmapsCatalog } from "@/components/roadmap/roadmaps-catalog";
import { getCompletedItemSlugsByRoadmap } from "@/lib/roadmap-progress";
import { listRoadmapSummaries } from "@/lib/roadmaps";

export default async function RoadmapsPage() {
  const [roadmaps, progressByRoadmap] = await Promise.all([listRoadmapSummaries(), getCompletedItemSlugsByRoadmap()]);

  return (
    <LocalizedPageShell page="roadmaps">
      <RoadmapsCatalog roadmaps={roadmaps} progressByRoadmap={progressByRoadmap} />
    </LocalizedPageShell>
  );
}
