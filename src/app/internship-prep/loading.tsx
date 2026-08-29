import { SkeletonList } from "@/components/ui/skeleton";

export default function InternshipPrepLoading() {
  return (
    <div className="page-enter">
      <SkeletonList rows={4} />
    </div>
  );
}
