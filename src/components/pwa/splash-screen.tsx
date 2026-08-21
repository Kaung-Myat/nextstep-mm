"use client";

import { cn } from "@/lib/utils";

type SplashScreenProps = {
  visible: boolean;
  title: string;
  subtitle: string;
};

export function SplashScreen({ visible, title, subtitle }: SplashScreenProps) {
  return (
    <div
      aria-hidden={!visible}
      className={cn(
        "splash-screen fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden transition-opacity duration-500",
        visible ? "opacity-100" : "pointer-events-none opacity-0",
      )}
    >
      <div className="splash-screen-pattern pointer-events-none absolute inset-0" />

      <div className="relative flex flex-col items-center px-6 text-center">
        <div className="splash-mark grid size-20 place-items-center rounded-[1.6rem] bg-[color:var(--color-accent)] text-3xl font-bold tracking-tight text-[color:var(--color-accent-foreground)] shadow-[0_20px_50px_rgba(10,122,111,0.45)]">
          N
        </div>
        <h1 className="splash-title mt-6 text-[2rem] font-bold tracking-tight text-white sm:text-[2.35rem]">
          {title}
        </h1>
        <p className="splash-sub mt-2 max-w-xs text-[14px] leading-5 text-white/70">{subtitle}</p>
        <div className="splash-bar mt-8 h-1 w-28 overflow-hidden rounded-full bg-white/15">
          <div className="splash-bar-fill h-full w-1/2 rounded-full bg-[color:var(--color-accent)]" />
        </div>
      </div>
    </div>
  );
}
