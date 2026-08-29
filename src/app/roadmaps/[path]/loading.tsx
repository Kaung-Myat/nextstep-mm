import { SkeletonList } from "@/components/ui/skeleton";

export default function RoadmapPathLoading() {
  return (
    <div className="page-enter space-y-3 px-1" aria-busy="true" aria-live="polite">
      <div className="flex gap-2 overflow-hidden">
        {[0, 1, 2].map((item) => (
          <div key={item} className="skeleton h-9 w-24 shrink-0 rounded-full" />
        ))}
      </div>
      <SkeletonList rows={5} />
    </div>
  );
}
