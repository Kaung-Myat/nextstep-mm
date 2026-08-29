import { cn } from "@/lib/utils";

export function Skeleton({ className }: { className?: string }) {
  return <div className={cn("skeleton", className)} aria-hidden />;
}

export function SkeletonText({ className }: { className?: string }) {
  return <Skeleton className={cn("h-3.5 rounded-full", className)} />;
}

export function SkeletonBlock({ className }: { className?: string }) {
  return <Skeleton className={cn("rounded-2xl", className)} />;
}

/** Native-style list row placeholders for jobs / prep / catalog. */
export function SkeletonList({ rows = 4 }: { rows?: number }) {
  return (
    <div className="flex w-full flex-col gap-3" aria-busy="true" aria-live="polite">
      {Array.from({ length: rows }, (_, index) => (
        <div
          key={index}
          className="rounded-2xl border border-[color:var(--color-line)] bg-[color:var(--color-card)] p-4"
        >
          <SkeletonText className="h-5 w-[72%] max-w-md" />
          <SkeletonText className="mt-2.5 h-3.5 w-28" />
          <SkeletonText className="mt-3 h-3.5 w-full max-w-sm" />
        </div>
      ))}
    </div>
  );
}

export function SkeletonHome() {
  return (
    <div className="space-y-4" aria-busy="true" aria-live="polite">
      <div className="rounded-2xl border border-[color:var(--color-line)] bg-[color:var(--color-card)] p-4">
        <SkeletonText className="h-3 w-24" />
        <SkeletonText className="mt-3 h-6 w-[70%] max-w-xs" />
        <SkeletonBlock className="mt-4 h-2.5 w-full rounded-full" />
        <div className="mt-4 flex gap-2">
          <SkeletonBlock className="h-16 flex-1 rounded-xl" />
          <SkeletonBlock className="h-16 flex-1 rounded-xl" />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2">
        {[0, 1, 2, 3].map((item) => (
          <SkeletonBlock key={item} className="h-24 rounded-2xl border border-[color:var(--color-line)]" />
        ))}
      </div>
      <SkeletonBlock className="h-36 rounded-2xl border border-[color:var(--color-line)]" />
    </div>
  );
}

export function SkeletonTrends() {
  return (
    <div className="space-y-4" aria-busy="true" aria-live="polite">
      <SkeletonBlock className="h-40 rounded-2xl border border-[color:var(--color-line)]" />
      <SkeletonBlock className="h-52 rounded-2xl border border-[color:var(--color-line)]" />
      <div className="grid grid-cols-2 gap-2">
        <SkeletonBlock className="h-28 rounded-2xl border border-[color:var(--color-line)]" />
        <SkeletonBlock className="h-28 rounded-2xl border border-[color:var(--color-line)]" />
      </div>
    </div>
  );
}
