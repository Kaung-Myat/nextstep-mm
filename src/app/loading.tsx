"use client";

import { Container } from "@/components/layout/container";
import { usePreferences } from "@/components/preferences/preferences-provider";

export default function Loading() {
  const { copy } = usePreferences();
  return (
    <Container className="py-12 sm:py-16" aria-busy="true" aria-label={copy.common.loadingPage}>
      <div className="animate-pulse space-y-8">
        <div className="grid gap-6 lg:grid-cols-[1.5fr_0.88fr]">
          <div className="space-y-4">
            <div className="h-7 w-36 rounded-full bg-[color:var(--color-panel-strong)]" />
            <div className="h-14 max-w-2xl rounded-2xl bg-[color:var(--color-panel-strong)]" />
            <div className="h-20 max-w-xl rounded-2xl bg-[color:var(--color-panel-strong)]" />
          </div>
          <div className="h-48 rounded-[1.75rem] bg-[color:var(--color-panel-strong)]" />
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {[0, 1, 2].map((item) => (
            <div key={item} className="h-56 rounded-[1.75rem] bg-[color:var(--color-panel-strong)]" />
          ))}
        </div>
      </div>
    </Container>
  );
}
