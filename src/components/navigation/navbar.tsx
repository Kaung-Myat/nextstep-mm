"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

import { usePreferences } from "@/components/preferences/preferences-provider";
import { useVirtualKeyboardOpen } from "@/hooks/use-virtual-keyboard";
import { cn } from "@/lib/utils";

const mobileItems = [
  {
    href: "/",
    labelKey: "home",
    icon: <path d="M3 10.8 12 3l9 7.8v9.7a.5.5 0 0 1-.5.5h-5.2v-6.5H8.7V21H3.5a.5.5 0 0 1-.5-.5v-9.7Z" />,
  },
  {
    href: "/roadmaps",
    labelKey: "roadmaps",
    icon: (
      <>
        <path d="M5 4.5h11.5A2.5 2.5 0 0 1 19 7v13H7.5A2.5 2.5 0 0 1 5 17.5v-13Z" />
        <path d="M8 8h7M8 12h7" />
      </>
    ),
  },
  {
    href: "/advisor",
    labelKey: "advisor",
    icon: (
      <>
        <path d="M12 3a8.5 8.5 0 0 0-7.2 13L4 21l4.7-1.3A8.5 8.5 0 1 0 12 3Z" />
        <path d="M9 11.5h.01M12 11.5h.01M15 11.5h.01" />
      </>
    ),
  },
  {
    href: "/trends",
    labelKey: "trends",
    icon: (
      <>
        <path d="M4 19V9m5 10V5m5 14v-7m5 7V3" />
        <path d="m3 7 5-4 6 6 7-7" />
      </>
    ),
  },
  {
    href: "/settings",
    labelKey: "settings",
    icon: (
      <>
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1Z" />
      </>
    ),
  },
] satisfies Array<{ href: string; labelKey: "home" | "roadmaps" | "advisor" | "trends" | "settings"; icon: ReactNode }>;

function isCurrent(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  if (href === "/trends") return pathname === "/trends" || pathname === "/jobs" || pathname.startsWith("/jobs/");
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function Navbar() {
  const pathname = usePathname();
  const { copy, locale } = usePreferences();
  const isMy = locale === "my";
  const keyboardOpen = useVirtualKeyboardOpen();
  if (pathname === "/onboarding") return null;

  return (
    <nav
      aria-label={copy.common.primaryNav}
      aria-hidden={keyboardOpen || undefined}
      data-keyboard={keyboardOpen ? "open" : undefined}
      className={cn(
        "safe-bottom fixed inset-x-0 bottom-0 z-50 border-t border-[color:var(--color-line)] bg-[color:var(--color-surface)]/95 backdrop-blur-md lg:static lg:z-auto lg:border-b lg:border-t-0 lg:bg-[color:var(--color-surface)]",
        keyboardOpen && "max-lg:pointer-events-none max-lg:invisible max-lg:h-0 max-lg:overflow-hidden max-lg:border-0 max-lg:opacity-0",
      )}
    >
      <div className="mx-auto grid h-[var(--tab-height)] w-full max-w-none grid-cols-5 px-1 sm:h-[var(--tab-height-lg)] sm:px-3 lg:h-14 lg:gap-1 lg:px-6 xl:px-8">
        {mobileItems.map((item) => {
          const active = isCurrent(pathname, item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? "page" : undefined}
              data-active={active ? "true" : "false"}
              className={cn(
                "nav-tab pressable flex min-w-0 flex-col items-center justify-center gap-1.5 px-0.5 text-[10px] font-semibold tracking-tight sm:gap-2 sm:text-[11px] lg:flex-row lg:justify-center lg:gap-2.5 lg:px-3 lg:text-[13px]",
                isMy && "text-[11px] sm:text-[12px] lg:text-[14px]",
              )}
            >
              <div className="nav-tab-icon-wrap" aria-hidden="true">
                <svg
                  viewBox="0 0 24 24"
                  className="nav-tab-icon size-[22px] shrink-0 fill-none sm:size-6 lg:size-5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  {item.icon}
                </svg>
              </div>
              <span className="nav-tab-label max-w-full truncate text-center leading-none">{copy.nav[item.labelKey]}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
