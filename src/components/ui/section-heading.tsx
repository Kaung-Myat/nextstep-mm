import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type SectionHeadingProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  actions?: ReactNode;
  align?: "left" | "center";
  className?: string;
};

export function SectionHeading({
  eyebrow,
  title,
  description,
  actions,
  align = "left",
  className,
}: SectionHeadingProps) {
  return (
    <div className={cn("space-y-4", align === "center" && "mx-auto max-w-3xl text-center", className)}>
      {eyebrow ? (
        <div
          className={cn(
            "inline-flex w-fit rounded-full border border-[color:var(--color-line-strong)] bg-white/80 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.24em] text-[color:var(--color-text-soft)]",
            align === "center" && "mx-auto",
          )}
        >
          {eyebrow}
        </div>
      ) : null}
      <div className="space-y-3">
        <h2 className="font-display text-2xl font-semibold leading-tight tracking-tight text-balance text-[color:var(--color-text)] sm:text-3xl">
          {title}
        </h2>
        {description ? (
          <p className="max-w-2xl text-base leading-8 text-[color:var(--color-text-muted)] sm:text-lg">
            {description}
          </p>
        ) : null}
      </div>
      {actions ? (
        <div className={cn("flex flex-wrap gap-3", align === "center" && "justify-center")}>{actions}</div>
      ) : null}
    </div>
  );
}
