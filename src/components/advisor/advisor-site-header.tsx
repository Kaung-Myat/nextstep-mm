"use client";

import Link from "next/link";

import { useAdvisorChrome } from "@/components/advisor/advisor-chrome-context";
import { usePreferences } from "@/components/preferences/preferences-provider";
import { useByok } from "@/components/settings/byok-provider";

function MenuIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="size-5 fill-none stroke-current stroke-2">
      <path d="M4 7h16" strokeLinecap="round" />
      <path d="M4 12h16" strokeLinecap="round" />
      <path d="M4 17h16" strokeLinecap="round" />
    </svg>
  );
}

export function AdvisorSiteHeader() {
  const { copy } = usePreferences();
  const { openMenu, openModelPicker } = useAdvisorChrome();
  const { availableProviders, selectedModel, selectedModelLabel } = useByok();
  const ready = availableProviders.length > 0 && Boolean(selectedModel);

  return (
    <header className="advisor-app-bar fixed inset-x-0 top-0 z-40 border-b border-[color:var(--color-line)] bg-[color:var(--color-surface)]/95 backdrop-blur-md">
      <div className="mx-auto flex h-full w-full max-w-none items-center gap-2 px-4 pt-[max(0.35rem,env(safe-area-inset-top,0px))] pb-1.5 sm:px-6 lg:px-8 xl:px-10">
        <button
          type="button"
          aria-label={copy.advisor.openMenu}
          onClick={openMenu}
          className="pressable grid size-9 shrink-0 place-items-center self-start rounded-full bg-[color:var(--color-panel-strong)] text-[color:var(--color-text)]"
        >
          <MenuIcon />
        </button>
        <div className="min-w-0 flex-1">
          <p className="truncate text-[17px] font-bold tracking-tight text-[color:var(--color-text)] lg:text-xl">
            {copy.advisor.title}
          </p>
          {ready ? (
            <button
              type="button"
              onClick={openModelPicker}
              className="pressable mt-0.5 inline-flex max-w-full items-center gap-1 rounded-full py-0.5 text-left text-[11px] font-semibold text-[color:var(--color-text-muted)]"
            >
              <span className="truncate">{selectedModelLabel}</span>
              <svg aria-hidden="true" viewBox="0 0 24 24" className="size-3.5 shrink-0 fill-none stroke-current stroke-2">
                <path d="m6 9 6 6 6-6" />
              </svg>
            </button>
          ) : (
            <Link href="/settings" className="mt-0.5 inline-block text-[11px] font-semibold text-[color:var(--color-accent)]">
              {copy.settings.noKeyTitle}
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
