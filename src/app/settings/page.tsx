import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { LocalizedPageShell } from "@/components/layout/localized-page-shell";
import { ProfileDetailsSummary } from "@/components/profile/profile-details-summary";
import { ProfilePreferences } from "@/components/profile/profile-preferences";
import { ByokSection } from "@/components/settings/byok-section";
import { CrawlSection } from "@/components/settings/crawl-section";
import { getCurrentProfile } from "@/lib/profile";

export const metadata: Metadata = { title: "Settings" };

export default async function SettingsPage() {
  const profile = await getCurrentProfile();
  if (!profile) redirect("/onboarding");

  return (
    <LocalizedPageShell page="settings">
      <ProfileDetailsSummary
        targetRole={profile.targetRole}
        currentLevel={profile.currentLevel}
        universityYear={profile.universityYear}
        internshipGoalAt={profile.internshipGoalAt?.toISOString() ?? null}
      />
      <ByokSection />
      <CrawlSection />
      <ProfilePreferences />
    </LocalizedPageShell>
  );
}
