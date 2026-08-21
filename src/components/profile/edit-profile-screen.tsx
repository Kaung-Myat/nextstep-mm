"use client";

import Link from "next/link";

import { ProfileForm } from "@/components/profile/profile-form";
import { usePreferences } from "@/components/preferences/preferences-provider";

type Defaults = { targetRole: string; currentLevel: string; universityYear: string; internshipGoalAt: string };

export function EditProfileScreen({ defaults }: { defaults: Defaults }) {
  const { copy } = usePreferences();
  return (
    <div className="w-full">
      <header className="mb-4 flex items-start gap-3">
        <Link
          href="/settings"
          aria-label={copy.common.back}
          className="pressable grid size-9 shrink-0 place-items-center rounded-full bg-[color:var(--color-panel-strong)] text-[color:var(--color-text)]"
        >
          <svg aria-hidden="true" viewBox="0 0 24 24" className="size-5 fill-none stroke-current stroke-2">
            <path d="m15 18-6-6 6-6" />
          </svg>
        </Link>
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[color:var(--color-accent)]">{copy.profile.editProfile}</p>
          <h1 className="mt-0.5 text-[22px] font-bold">{copy.profile.updateTitle}</h1>
          <p className="mt-1 text-[13px] leading-5 text-[color:var(--color-text-muted)]">{copy.profile.updateDescription}</p>
        </div>
      </header>
      <ProfileForm defaults={defaults} redirectTo="/settings" />
    </div>
  );
}
