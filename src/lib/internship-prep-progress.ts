import { allInternshipItemKeys, getInternshipChecklistDefinitions } from "@/lib/internship-prep";
import { getCurrentUserId } from "@/lib/current-user";
import { getPrisma } from "@/lib/db";

export async function getCompletedInternshipItemKeys() {
  const userId = await getCurrentUserId();
  if (!userId || !process.env.DATABASE_URL) return [] as string[];

  try {
    const progress = await getPrisma().internshipPrepProgress.findMany({
      where: { userId, completedAt: { not: null } },
      select: { itemKey: true },
    });
    return progress.map((entry) => entry.itemKey);
  } catch (error) {
    console.error("getCompletedInternshipItemKeys failed:", error);
    return [];
  }
}

export async function getInternshipPrepSummary() {
  const [completedKeys, definitions] = await Promise.all([
    getCompletedInternshipItemKeys(),
    getInternshipChecklistDefinitions(),
  ]);
  const total = allInternshipItemKeys(definitions).length;
  return {
    completedKeys,
    completedCount: completedKeys.length,
    total,
    percentage: total ? Math.round((completedKeys.length / total) * 100) : 0,
  };
}
