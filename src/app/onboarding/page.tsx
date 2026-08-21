import { redirect } from "next/navigation";

import { OnboardingScreen } from "@/components/profile/onboarding-screen";
import { getCurrentProfile } from "@/lib/profile";

export default async function OnboardingPage() {
  if (await getCurrentProfile()) redirect("/");

  return (
    <div className="relative flex min-h-[calc(100svh-var(--header-height))] items-center justify-center px-4 py-8 sm:px-6">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(ellipse 70% 45% at 50% 0%, rgba(10, 122, 111, 0.16), transparent 60%), var(--color-background)",
        }}
      />
      <OnboardingScreen />
    </div>
  );
}
