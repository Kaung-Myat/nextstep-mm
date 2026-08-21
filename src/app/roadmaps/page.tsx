import { LocalizedPageShell } from "@/components/layout/localized-page-shell";
import { RoadmapsCatalog } from "@/components/roadmap/roadmaps-catalog";
import { getCompletedItemSlugsByRoadmap } from "@/lib/roadmap-progress";
import { listRoadmaps } from "@/lib/roadmaps";

export default async function RoadmapsPage() {
  const [roadmaps, progressByRoadmap] = await Promise.all([listRoadmaps(), getCompletedItemSlugsByRoadmap()]);

  return (
    <LocalizedPageShell page="roadmaps">
      <RoadmapsCatalog roadmaps={roadmaps} progressByRoadmap={progressByRoadmap} />
    </LocalizedPageShell>
  );
}
