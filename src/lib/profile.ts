import { getCurrentUserId } from "@/lib/current-user";
import { getPrisma } from "@/lib/db";

export async function getCurrentProfile() {
  const userId = await getCurrentUserId();
  if (!userId || !process.env.DATABASE_URL) return null;

  try {
    return await getPrisma().userProfile.findUnique({ where: { userId } });
  } catch (error) {
    // One quick retry helps Neon cold-start timeouts without sending users to onboarding.
    console.error("getCurrentProfile failed, retrying once:", error);
    try {
      return await getPrisma().userProfile.findUnique({ where: { userId } });
    } catch (retryError) {
      console.error("getCurrentProfile retry failed:", retryError);
      throw retryError;
    }
  }
}
