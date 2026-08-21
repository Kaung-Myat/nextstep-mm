import type { ReactNode } from "react";

import { Container } from "@/components/layout/container";
import { cn } from "@/lib/utils";

type PageSectionProps = {
  children: ReactNode;
  className?: string;
  containerClassName?: string;
  tone?: "default" | "soft";
};

export function PageSection({
  children,
  className,
  containerClassName,
  tone = "default",
}: PageSectionProps) {
  return (
    <section className={cn("py-3", tone === "soft" && "relative", className)}>
      <Container className={containerClassName}>{children}</Container>
    </section>
  );
}
