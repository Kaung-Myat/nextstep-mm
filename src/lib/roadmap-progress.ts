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

/** Completed item slugs per roadmap, limited to items that still exist in the catalog. */
export async function getCompletedItemSlugsByRoadmap() {
  const userId = await getCurrentUserId();
  if (!userId || !process.env.DATABASE_URL) return {} as Record<string, string[]>;

  try {
    const [progress, liveItems] = await Promise.all([
      getPrisma().roadmapProgress.findMany({
        where: { userId, completedAt: { not: null } },
        select: {
          roadmapItem: {
            select: { slug: true, section: { select: { roadmap: { select: { slug: true } } } } },
          },
        },
      }),
      getPrisma().roadmapItem.findMany({
        select: {
          slug: true,
          section: { select: { roadmap: { select: { slug: true } } } },
        },
      }),
    ]);

    const liveByRoadmap = new Map<string, Set<string>>();
    for (const item of liveItems) {
      const roadmapSlug = item.section.roadmap.slug;
      const set = liveByRoadmap.get(roadmapSlug) ?? new Set<string>();
      set.add(item.slug);
      liveByRoadmap.set(roadmapSlug, set);
    }

    return progress.reduce<Record<string, string[]>>((grouped, entry) => {
      const roadmapSlug = entry.roadmapItem.section.roadmap.slug;
      const live = liveByRoadmap.get(roadmapSlug);
      if (!live?.has(entry.roadmapItem.slug)) return grouped;
      (grouped[roadmapSlug] ??= []).push(entry.roadmapItem.slug);
      return grouped;
    }, {});
  } catch (error) {
    console.error("getCompletedItemSlugsByRoadmap failed:", error);
    return {};
  }
}
