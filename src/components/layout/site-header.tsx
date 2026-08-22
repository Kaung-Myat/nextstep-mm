"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { usePreferences } from "@/components/preferences/preferences-provider";
import { siteConfig } from "@/lib/site";

export function SiteHeader() {
  const { copy } = usePreferences();
  const pathname = usePathname();

  const isHome = pathname === "/";
  const isJobsChild = pathname === "/jobs";
  const isAdvisor = pathname === "/advisor";
  const hideHeader =
    isAdvisor ||
    pathname === "/onboarding" ||
    (pathname.startsWith("/roadmaps/") && pathname !== "/roadmaps");

  if (hideHeader) return null;

  const titleByPath: Record<string, string | undefined> = {
    "/": undefined,
    "/roadmaps": copy.nav.roadmaps,
    "/internship-prep": copy.home.internship,
    "/jobs": copy.home.jobs,
    "/trends": copy.nav.trends,
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
    <header className="safe-top sticky top-0 z-40 border-b border-[color:var(--color-line)] bg-[color:var(--color-surface)]/95 backdrop-blur-md lg:z-30">
      <div className="mx-auto flex h-[var(--header-height)] w-full max-w-none items-center gap-2 px-4 sm:px-6 lg:h-16 lg:px-8 xl:px-10">
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
