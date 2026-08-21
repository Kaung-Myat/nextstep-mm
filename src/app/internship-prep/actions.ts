"use server";

import { revalidatePath } from "next/cache";

import { allInternshipItemKeys, getInternshipChecklistDefinitions } from "@/lib/internship-prep";
import { requireCurrentUser } from "@/lib/current-user";
import { getPrisma } from "@/lib/db";

export async function setInternshipPrepItemCompletion(itemKey: string, completed: boolean) {
  const definitions = await getInternshipChecklistDefinitions();
  const allowedKeys = new Set(allInternshipItemKeys(definitions));
  if (!allowedKeys.has(itemKey)) throw new Error("Unknown internship prep item.");

  const user = await requireCurrentUser();
  const prisma = getPrisma();

  if (completed) {
    await prisma.internshipPrepProgress.upsert({
      where: { userId_itemKey: { userId: user.id, itemKey } },
      create: { userId: user.id, itemKey, completedAt: new Date() },
      update: { completedAt: new Date() },
    });
  } else {
    await prisma.internshipPrepProgress.deleteMany({ where: { userId: user.id, itemKey } });
  }

  revalidatePath("/internship-prep");
  revalidatePath("/");
}

export async function resetInternshipPrepProgress() {
  const user = await requireCurrentUser();
  await getPrisma().internshipPrepProgress.deleteMany({ where: { userId: user.id } });
  revalidatePath("/internship-prep");
  revalidatePath("/");
}
