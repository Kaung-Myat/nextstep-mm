"use server";

import { revalidatePath } from "next/cache";

import { LearningPath } from "@/generated/prisma/enums";
import { requireCurrentUser } from "@/lib/current-user";
import { getPrisma } from "@/lib/db";
import { roadmapPaths, type RoadmapPath } from "@/lib/roadmaps/types";

const pathEnum: Record<RoadmapPath, LearningPath> = {
  frontend: LearningPath.FRONTEND,
  backend: LearningPath.BACKEND,
  fullstack: LearningPath.FULLSTACK,
};

export async function setRoadmapItemCompletion(path: RoadmapPath, itemSlug: string, completed: boolean) {
  if (!roadmapPaths.includes(path)) throw new Error("Unknown roadmap.");

  const user = await requireCurrentUser();
  const prisma = getPrisma();
  const roadmapItem = await prisma.roadmapItem.findFirst({
    where: {
      slug: itemSlug,
      section: { roadmap: { path: pathEnum[path] } },
    },
    select: { id: true },
  });
  if (!roadmapItem) throw new Error("Unknown roadmap item.");

  if (completed) {
    await prisma.roadmapProgress.upsert({
      where: { userId_roadmapItemId: { userId: user.id, roadmapItemId: roadmapItem.id } },
      create: { userId: user.id, roadmapItemId: roadmapItem.id, completedAt: new Date() },
      update: { completedAt: new Date() },
    });
  } else {
    await prisma.roadmapProgress.deleteMany({ where: { userId: user.id, roadmapItemId: roadmapItem.id } });
  }
  revalidatePath(`/roadmaps/${path}`);
}
