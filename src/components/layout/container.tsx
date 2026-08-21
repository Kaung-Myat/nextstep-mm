import type { ElementType, ReactNode } from "react";

import { cn } from "@/lib/utils";

type ContainerProps<T extends ElementType = "div"> = {
  as?: T;
  children: ReactNode;
  className?: string;
};

export function Container<T extends ElementType = "div">({
  as,
  children,
  className,
}: ContainerProps<T>) {
  const Component = as ?? "div";
  return (
    <Component className={cn("mx-auto w-full min-w-0 max-w-none px-3 sm:px-6 lg:px-8 xl:px-10", className)}>
      {children}
    </Component>
  );
}
