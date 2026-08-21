import { getCurrentUserId } from "@/lib/current-user";
import { getPrisma } from "@/lib/db";

export async function getCompletedItemSlugs(roadmapSlug: string) {
  const userId = await getCurrentUserId();
  if (!userId || !process.env.DATABASE_URL) return [];

  try {
    const progress = await getPrisma().roadmapProgress.findMany({
      where: {
        userId,
        completedAt: { not: null },
        roadmapItem: { section: { roadmap: { slug: roadmapSlug } } },
      },
      select: { roadmapItem: { select: { slug: true } } },
    });
    return progress.map((entry) => entry.roadmapItem.slug);
  } catch (error) {
    console.error("getCompletedItemSlugs failed:", error);
    return [];
  }
}

export async function getCompletedItemSlugsByRoadmap() {
  const userId = await getCurrentUserId();
  if (!userId || !process.env.DATABASE_URL) return {} as Record<string, string[]>;

  try {
    const progress = await getPrisma().roadmapProgress.findMany({
      where: { userId, completedAt: { not: null } },
      select: {
        roadmapItem: {
          select: { slug: true, section: { select: { roadmap: { select: { slug: true } } } } },
        },
      },
    });
    return progress.reduce<Record<string, string[]>>((grouped, entry) => {
      const roadmapSlug = entry.roadmapItem.section.roadmap.slug;
      (grouped[roadmapSlug] ??= []).push(entry.roadmapItem.slug);
      return grouped;
    }, {});
  } catch (error) {
    console.error("getCompletedItemSlugsByRoadmap failed:", error);
    return {};
  }
}
