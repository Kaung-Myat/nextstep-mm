"use server";

import { LearningPath, UserLevel } from "@/generated/prisma/enums";
import { requireCurrentUser } from "@/lib/current-user";
import { getPrisma } from "@/lib/db";

export type ProfileActionState = { status: "idle" | "success" | "error"; message: string };

const roles = new Set(Object.values(LearningPath));
const levels = new Set(Object.values(UserLevel));

export async function saveProfile(
  _previousState: ProfileActionState,
  formData: FormData,
): Promise<ProfileActionState> {
  const targetRole = String(formData.get("targetRole") ?? "") as LearningPath;
  const currentLevel = String(formData.get("currentLevel") ?? "") as UserLevel;
  const universityYearValue = String(formData.get("universityYear") ?? "");
  const internshipGoalValue = String(formData.get("internshipGoalAt") ?? "");
  const universityYear = universityYearValue ? Number(universityYearValue) : null;

  if (!roles.has(targetRole) || !levels.has(currentLevel)) {
    return { status: "error", message: "Choose a target role and current level." };
  }
  if (universityYear !== null && (!Number.isInteger(universityYear) || universityYear < 1 || universityYear > 6)) {
    return { status: "error", message: "University year must be between 1 and 6." };
  }

  const internshipGoalAt = internshipGoalValue
    ? new Date(`${internshipGoalValue}T00:00:00.000Z`)
    : null;
  if (internshipGoalAt && Number.isNaN(internshipGoalAt.getTime())) {
    return { status: "error", message: "Enter a valid internship goal date." };
  }

  try {
    const user = await requireCurrentUser();
    await getPrisma().userProfile.upsert({
      where: { userId: user.id },
      create: { userId: user.id, targetRole, currentLevel, universityYear, internshipGoalAt },
      update: { targetRole, currentLevel, universityYear, internshipGoalAt },
    });
    return { status: "success", message: "Profile saved." };
  } catch {
    return { status: "error", message: "Profile could not be saved. Check the database connection and try again." };
  }
}
