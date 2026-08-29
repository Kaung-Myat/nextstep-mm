import { SkeletonBlock, SkeletonText } from "@/components/ui/skeleton";

export default function AdvisorLoading() {
  return (
    <div className="page-enter flex min-h-[50vh] flex-col gap-3 px-3 pt-4" aria-busy="true" aria-live="polite">
      <div className="max-w-[85%] self-start rounded-2xl border border-[color:var(--color-line)] bg-[color:var(--color-card)] p-3.5">
        <SkeletonText className="h-3.5 w-40" />
        <SkeletonText className="mt-2 h-3.5 w-56" />
      </div>
      <div className="max-w-[75%] self-end rounded-2xl border border-[color:var(--color-line)] bg-[color:var(--color-card)] p-3.5">
        <SkeletonText className="h-3.5 w-36" />
      </div>
      <SkeletonBlock className="mt-auto h-12 w-full rounded-2xl" />
    </div>
  );
}
