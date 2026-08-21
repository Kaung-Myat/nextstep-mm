import { redirect } from "next/navigation";

import { Container } from "@/components/layout/container";
import { EditProfileScreen } from "@/components/profile/edit-profile-screen";
import { getCurrentProfile } from "@/lib/profile";

export default async function EditSettingsProfilePage() {
  const profile = await getCurrentProfile();
  if (!profile) redirect("/onboarding");
  return (
    <Container className="max-w-6xl py-5 sm:py-8">
      <EditProfileScreen
        defaults={{
          targetRole: profile.targetRole ?? "",
          currentLevel: profile.currentLevel ?? "",
          universityYear: profile.universityYear?.toString() ?? "",
          internshipGoalAt: profile.internshipGoalAt?.toISOString().slice(0, 10) ?? "",
        }}
      />
    </Container>
  );
}
