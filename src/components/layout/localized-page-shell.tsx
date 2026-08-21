"use client";

import type { ReactNode } from "react";

import { PageShell } from "@/components/layout/page-shell";
import { usePreferences } from "@/components/preferences/preferences-provider";
import type { AppMessages } from "@/i18n/messages";

type PageKey = keyof AppMessages["pages"];

export function LocalizedPageShell({ page, children }: { page: PageKey; children?: ReactNode }) {
  const { copy } = usePreferences();
  const summary = copy.pages[page];
  return (
    <PageShell eyebrow={summary.eyebrow} title={summary.title} description={summary.description} highlights={summary.highlights}>
      {children}
    </PageShell>
  );
}
