"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { useAdvisorChrome } from "@/components/advisor/advisor-chrome-context";
import { usePreferences } from "@/components/preferences/preferences-provider";
import { useByok } from "@/components/settings/byok-provider";
import { siteConfig } from "@/lib/site";
import { cn } from "@/lib/utils";

function MenuIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="size-5 fill-none stroke-current stroke-2">
      <path d="M4 7h16" strokeLinecap="round" />
      <path d="M4 12h16" strokeLinecap="round" />
      <path d="M4 17h16" strokeLinecap="round" />
    </svg>
  );
}

export function SiteHeader() {
  const { copy } = usePreferences();
  const pathname = usePathname();
  const { openMenu, openModelPicker } = useAdvisorChrome();
  const { availableProviders, selectedModel, selectedModelLabel } = useByok();

  const isHome = pathname === "/";
  const isJobsChild = pathname === "/jobs";
  const isAdvisor = pathname === "/advisor";
  const hideHeader = pathname === "/onboarding" || (pathname.startsWith("/roadmaps/") && pathname !== "/roadmaps");
  const ready = availableProviders.length > 0 && Boolean(selectedModel);

  if (hideHeader) return null;

  const titleByPath: Record<string, string | undefined> = {
    "/": undefined,
    "/roadmaps": copy.nav.roadmaps,
    "/internship-prep": copy.home.internship,
    "/jobs": copy.home.jobs,
    "/trends": copy.nav.trends,
    "/advisor": copy.advisor.title,
    "/settings": copy.nav.settings,
    "/profile": copy.nav.settings,
    "/profile/edit": copy.profile.editProfile,
    "/settings/edit": copy.profile.editProfile,
    "/onboarding": undefined,
  };

  const title =
    titleByPath[pathname] ??
    (pathname.startsWith("/roadmaps/") ? copy.nav.roadmaps : siteConfig.name);

  return (
    <header
      className={cn(
        "z-40 border-b border-[color:var(--color-line)] bg-[color:var(--color-surface)]/95 backdrop-blur-md lg:z-30",
        // Fixed on advisor so sheet/scroll lock cannot collapse the app bar.
        isAdvisor ? "advisor-app-bar fixed inset-x-0 top-0" : "safe-top sticky top-0",
      )}
    >
      <div
        className={cn(
          "mx-auto flex w-full max-w-none items-center gap-2 px-4 sm:px-6 lg:px-8 xl:px-10",
          isAdvisor
            ? "h-full items-center pt-[max(0.35rem,env(safe-area-inset-top,0px))] pb-1.5"
            : "h-[var(--header-height)] lg:h-16",
        )}
      >
        {isHome ? (
          <Link href="/" className="pressable flex min-w-0 items-center gap-2.5 lg:gap-3">
            <span className="grid size-8 shrink-0 place-items-center rounded-[0.7rem] bg-[color:var(--color-accent)] text-sm font-bold text-[color:var(--color-accent-foreground)] lg:size-9 lg:text-base">
              N
            </span>
            <span className="min-w-0">
              <span className="block truncate text-[15px] font-bold leading-tight text-[color:var(--color-text)] lg:text-lg">
                {siteConfig.name}
              </span>
              <span className="block truncate text-[10px] font-medium leading-tight text-[color:var(--color-text-muted)] sm:text-[11px] lg:text-xs">
                {copy.header.tagline}
              </span>
            </span>
          </Link>
        ) : isAdvisor ? (
          <>
            <button
              type="button"
              aria-label={copy.advisor.openMenu}
              onClick={openMenu}
              className="pressable grid size-9 shrink-0 place-items-center self-start rounded-full bg-[color:var(--color-panel-strong)] text-[color:var(--color-text)]"
            >
              <MenuIcon />
            </button>
            <div className="min-w-0 flex-1">
              <p className="truncate text-[17px] font-bold tracking-tight text-[color:var(--color-text)] lg:text-xl">{title}</p>
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
          </>
        ) : isJobsChild ? (
          <>
            <Link
              href="/trends"
              aria-label={copy.common.backToTrends}
              className="pressable grid size-9 shrink-0 place-items-center rounded-full bg-[color:var(--color-panel-strong)] text-[color:var(--color-text)]"
            >
              <svg aria-hidden="true" viewBox="0 0 24 24" className="size-5 fill-none stroke-current stroke-2">
                <path d="M15 6 9 12l6 6" />
              </svg>
            </Link>
            <div className="min-w-0 flex-1">
              <p className="truncate text-[17px] font-bold tracking-tight text-[color:var(--color-text)] lg:text-xl">{title}</p>
            </div>
          </>
        ) : (
          <div className="min-w-0">
            <p className="truncate text-[17px] font-bold tracking-tight text-[color:var(--color-text)] lg:text-xl">{title}</p>
          </div>
        )}
      </div>
    </header>
  );
}
