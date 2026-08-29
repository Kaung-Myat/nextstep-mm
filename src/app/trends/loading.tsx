import { SkeletonTrends } from "@/components/ui/skeleton";

export default function TrendsLoading() {
  return (
    <div className="page-enter">
      <SkeletonTrends />
    </div>
  );
}
