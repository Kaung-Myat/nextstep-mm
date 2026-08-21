"use client";

import { useCallback, useState } from "react";

import { usePreferences } from "@/components/preferences/preferences-provider";
import {
  isStandaloneDisplay,
  startInstallCapture,
  useDeferredInstall,
} from "@/components/pwa/use-deferred-install";
import { Button } from "@/components/ui/button";

const DISMISS_KEY = "nextstep-install-dismissed";

type InstallPromptDialogProps = {
  open: boolean;
  onClose: () => void;
};

export function InstallPromptDialog({ open, onClose }: InstallPromptDialogProps) {
  const { copy } = usePreferences();
  const ui = copy.pwa;
  const { canPrompt, ios, promptInstall } = useDeferredInstall();
  const [installing, setInstalling] = useState(false);
  const [hint, setHint] = useState("");

  const dismiss = useCallback(() => {
    try {
      localStorage.setItem(DISMISS_KEY, "1");
    } catch {
      // ignore
    }
    setHint("");
    onClose();
  }, [onClose]);

  async function install() {
    if (ios) return;
    setHint("");
    setInstalling(true);
    try {
      const result = await promptInstall();
      if (result.outcome === "accepted") {
        dismiss();
        return;
      }
      if (result.outcome === "unavailable") {
        setHint(ui.installUnavailable);
      }
    } catch {
      setHint(ui.installUnavailable);
    } finally {
      setInstalling(false);
    }
  }

  if (!open) return null;

  const iosSteps = [
    {
      label: ui.iosStepShare,
      icon: (
        <svg aria-hidden="true" viewBox="0 0 24 24" className="size-5 fill-none stroke-current stroke-2">
          <path d="M12 16V4m0 0 4 4m-4-4-4 4" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M5 12v6a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-6" strokeLinecap="round" />
        </svg>
      ),
    },
    {
      label: ui.iosStepAdd,
      icon: (
        <svg aria-hidden="true" viewBox="0 0 24 24" className="size-5 fill-none stroke-current stroke-2">
          <rect x="5" y="4" width="14" height="16" rx="2" />
          <path d="M12 10v4m-2-2h4" strokeLinecap="round" />
        </svg>
      ),
    },
    {
      label: ui.iosStepConfirm,
      icon: (
        <svg aria-hidden="true" viewBox="0 0 24 24" className="size-5 fill-none stroke-current stroke-2">
          <path d="m5 12 4.5 4.5L19 7" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ),
    },
  ];

  return (
    <div
      className="fixed inset-0 z-[90] flex items-end justify-center sm:items-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="install-title"
    >
      <button type="button" aria-label={ui.notNow} className="absolute inset-0 bg-slate-950/45 backdrop-blur-[2px]" onClick={dismiss} />
      <div className="safe-bottom relative z-10 w-full max-w-md overflow-hidden rounded-t-[1.75rem] border border-[color:var(--color-line)] bg-[color:var(--color-background-elevated)] shadow-[0_-24px_60px_rgba(8,20,28,0.35)] sm:mb-0 sm:rounded-[1.75rem]">
        <div className="h-1.5 w-full bg-[linear-gradient(90deg,transparent,#2bb3a3,transparent)]" />
        <div className="px-5 pb-5 pt-4">
          <div className="mx-auto mb-3 h-1.5 w-10 rounded-full bg-[color:var(--color-line-strong)] sm:hidden" />

          <div className="text-center sm:text-left">
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[color:var(--color-accent)]">
              {ui.installBadge}
            </p>
            <h2 id="install-title" className="mt-1 text-[20px] font-bold text-[color:var(--color-text)]">
              {ui.installTitle}
            </h2>
            <p className="mt-1.5 text-[13px] leading-5 text-[color:var(--color-text-muted)]">{ui.installDescription}</p>
          </div>

          {ios ? (
            <ol className="mt-4 space-y-2.5 rounded-2xl bg-[color:var(--color-panel)] px-3 py-3">
              {iosSteps.map((step, index) => (
                <li key={step.label} className="flex items-start gap-3 text-[13px] leading-5 text-[color:var(--color-text-soft)]">
                  <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-[color:var(--color-card)] text-[color:var(--color-accent)]">
                    {step.icon}
                  </span>
                  <span className="min-w-0 pt-1.5">
                    <span className="font-semibold text-[color:var(--color-text)]">{index + 1}. </span>
                    {step.label}
                  </span>
                </li>
              ))}
              <li className="rounded-xl border border-dashed border-[color:var(--color-line-strong)] bg-[color:var(--color-card)] px-3 py-2.5 text-center text-[11px] font-semibold text-[color:var(--color-text-muted)]">
                Safari → {ui.iosShareLabel} → Add to Home Screen
              </li>
            </ol>
          ) : (
            <div className="mt-4 rounded-2xl bg-[color:var(--color-panel)] px-3.5 py-3 text-[12px] leading-5 text-[color:var(--color-text-soft)]">
              {canPrompt ? ui.installReadyHint : ui.installBrowserHint}
            </div>
          )}

          {hint ? (
            <p role="status" className="mt-3 rounded-xl bg-[color:var(--color-panel)] px-3 py-2 text-[12px] text-[color:var(--color-warm)]">
              {hint}
            </p>
          ) : null}

          <div className="mt-5 flex flex-col gap-2 sm:flex-row-reverse sm:items-center">
            {ios ? (
              <Button type="button" className="w-full sm:flex-1" onClick={dismiss}>
                {ui.gotIt}
              </Button>
            ) : (
              <Button type="button" className="w-full sm:flex-1" onClick={() => void install()} disabled={installing}>
                {installing ? ui.installing : ui.installAction}
              </Button>
            )}
            <button
              type="button"
              onClick={dismiss}
              className="min-h-11 w-full rounded-full text-[13px] font-semibold text-[color:var(--color-text-soft)] sm:flex-1"
            >
              {ui.notNow}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export function wasInstallDismissed() {
  try {
    return localStorage.getItem(DISMISS_KEY) === "1";
  } catch {
    return false;
  }
}

export function shouldOfferInstall() {
  if (typeof window === "undefined") return false;
  startInstallCapture();
  if (isStandaloneDisplay()) return false;
  if (wasInstallDismissed()) return false;
  return true;
}
