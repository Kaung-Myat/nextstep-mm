"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

import { saveProfile, type ProfileActionState } from "@/app/profile/actions";
import { Button } from "@/components/ui/button";
import { usePreferences } from "@/components/preferences/preferences-provider";
import { useToast } from "@/components/ui/toast";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { IOSDatePickerField, OptionSheetField } from "@/components/profile/native-pickers";
import { cn } from "@/lib/utils";

type ProfileFormProps = {
  defaults: {
    targetRole: string;
    currentLevel: string;
    universityYear: string;
    internshipGoalAt: string;
  };
  redirectTo?: string;
  onboarding?: boolean;
  onSuccess?: () => void;
};

const initialState: ProfileActionState = { status: "idle", message: "" };
const inputClasses =
  "min-h-12 w-full rounded-2xl border border-[color:var(--color-line-strong)] bg-[color:var(--color-panel)] px-4 text-sm text-[color:var(--color-text)] outline-none transition focus:border-[color:var(--color-accent)] focus:ring-2 focus:ring-[color:var(--color-accent-soft)]";

export function ProfileForm({ defaults, redirectTo, onboarding = false, onSuccess }: ProfileFormProps) {
  const [state, formAction, pending] = useActionState(saveProfile, initialState);
  const router = useRouter();
  const { copy } = usePreferences();
  const { showToast } = useToast();
  const [targetRole, setTargetRole] = useState(defaults.targetRole);
  const [currentLevel, setCurrentLevel] = useState(defaults.currentLevel);
  const [goalDate, setGoalDate] = useState(defaults.internshipGoalAt);
  const lastToastKey = useRef("");
  const onSuccessRef = useRef(onSuccess);
  const didSucceed = useRef(false);
  onSuccessRef.current = onSuccess;

  useEffect(() => {
    if (state.status !== "success" || didSucceed.current) return;
    didSucceed.current = true;
    onSuccessRef.current?.();
    if (redirectTo) {
      router.replace(redirectTo);
      router.refresh();
    }
  }, [redirectTo, router, state.status]);

  useEffect(() => {
    if (state.status === "idle" || !state.message) return;
    const key = `${state.status}:${state.message}`;
    if (lastToastKey.current === key) return;
    lastToastKey.current = key;
    showToast({
      tone: state.status === "success" ? "success" : "error",
      title: state.status === "success" ? copy.settings.toastProfileSaved : copy.settings.toastProfileError,
      description: state.message,
    });
  }, [copy.settings.toastProfileError, copy.settings.toastProfileSaved, showToast, state.message, state.status]);

  return (
    <Card className={onboarding ? "border-0 bg-transparent p-0 shadow-none" : undefined}>
      {onboarding ? null : (
        <>
          <CardTitle className="text-xl">{copy.profile.details}</CardTitle>
          <CardDescription className="mt-1">{copy.profile.detailsDescription}</CardDescription>
        </>
      )}
      <form action={formAction} className={onboarding ? "grid gap-4" : "mt-5 grid gap-6 md:grid-cols-2"}>
        <OptionSheetField
          name="targetRole"
          label={copy.profile.targetRole}
          value={targetRole}
          onChange={setTargetRole}
          placeholder={copy.profile.selectPath}
          options={[
            { value: "FRONTEND", label: copy.profile.frontend },
            { value: "BACKEND", label: copy.profile.backend },
            { value: "FULLSTACK", label: copy.profile.fullstack },
          ]}
        />
        <OptionSheetField
          name="currentLevel"
          label={copy.profile.currentLevel}
          value={currentLevel}
          onChange={setCurrentLevel}
          placeholder={copy.profile.selectLevel}
          options={[
            { value: "BEGINNER", label: copy.profile.beginner },
            { value: "INTERMEDIATE", label: copy.profile.intermediate },
            { value: "JOB_READY", label: copy.profile.jobReady },
          ]}
        />
        <label className="space-y-2">
          <span className="text-sm font-semibold text-[color:var(--color-text)]">{copy.profile.universityYear}</span>
          <input
            name="universityYear"
            type="number"
            min="1"
            max="6"
            inputMode="numeric"
            defaultValue={defaults.universityYear}
            placeholder={copy.profile.optional}
            className={inputClasses}
          />
        </label>
        <IOSDatePickerField
          name="internshipGoalAt"
          label={copy.profile.internshipGoalDate}
          value={goalDate}
          onChange={setGoalDate}
        />
        <div className={cn("flex flex-wrap items-center gap-4", onboarding ? "" : "md:col-span-2")}>
          <Button type="submit" disabled={pending} className={onboarding ? "w-full" : undefined}>
            {pending ? copy.profile.saving : onboarding ? copy.profile.continue : copy.profile.saveProfile}
          </Button>
        </div>
      </form>
    </Card>
  );
}
