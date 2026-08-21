"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { usePreferences } from "@/components/preferences/preferences-provider";
import { ProfileForm } from "@/components/profile/profile-form";
import { InstallPromptDialog, shouldOfferInstall } from "@/components/pwa/install-prompt";

export function OnboardingScreen() {
  const { copy } = usePreferences();
  const router = useRouter();
  const [installOpen, setInstallOpen] = useState(false);

  function goHome() {
    try {
      sessionStorage.setItem("nextstep-install-offered", "1");
    } catch {
      // ignore
    }
    router.replace("/");
    router.refresh();
  }

  return (
    <div className="relative mx-auto w-full max-w-lg overflow-hidden rounded-[1.75rem] border border-[color:var(--color-line)] bg-[color:var(--color-background-elevated)] shadow-[var(--shadow-card)]">
      <div
        className="relative overflow-hidden px-5 pb-6 pt-8 text-center sm:px-7"
        style={{
          background:
            "radial-gradient(ellipse 80% 70% at 50% 0%, rgba(43, 179, 163, 0.22), transparent 60%), linear-gradient(180deg, color-mix(in oklab, var(--color-panel) 80%, transparent), transparent)",
        }}
      >
        <h1 className="text-[1.65rem] font-bold leading-tight tracking-tight text-[color:var(--color-text)] sm:text-[1.85rem]">
          {copy.profile.onboardingTitle}
        </h1>
        <p className="mx-auto mt-2 max-w-sm text-[13px] leading-5 text-[color:var(--color-text-muted)]">
          {copy.profile.onboardingDescription}
        </p>
      </div>

      <div className="border-t border-[color:var(--color-line)] px-4 py-5 sm:px-6">
        <ProfileForm
          defaults={{ targetRole: "", currentLevel: "", universityYear: "", internshipGoalAt: "" }}
          onboarding
          onSuccess={() => {
            if (shouldOfferInstall()) setInstallOpen(true);
            else goHome();
          }}
        />
        <p className="mt-4 text-center text-[11px] leading-5 text-[color:var(--color-text-muted)]">
          {copy.profile.onboardingHint}
        </p>
      </div>

      <InstallPromptDialog open={installOpen} onClose={goHome} />
    </div>
  );
}
