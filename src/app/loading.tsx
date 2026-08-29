import { SkeletonHome } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="page-enter w-full px-4 py-4 sm:px-6 lg:px-8" aria-busy="true">
      <SkeletonHome />
    </div>
  );
}
