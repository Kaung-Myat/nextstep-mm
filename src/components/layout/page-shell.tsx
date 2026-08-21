import type { ReactNode } from "react";

import { PageSection } from "@/components/layout/page-section";

type PageShellProps = {
  eyebrow: string;
  title: string;
  description: string;
  highlights?: readonly string[];
  children?: ReactNode;
};

export function PageShell({
  title,
  description,
  children,
}: PageShellProps) {
  return (
    <PageSection containerClassName="flex w-full min-w-0 flex-col gap-4">
      <header className="min-w-0 pt-1">
        <h1 className="break-words text-[20px] font-bold leading-tight tracking-tight text-[color:var(--color-text)] sm:text-[22px]">
          {title}
        </h1>
        <p className="mt-1.5 break-words text-[13px] leading-5 text-[color:var(--color-text-muted)]">{description}</p>
      </header>
      {children}
    </PageSection>
  );
}
