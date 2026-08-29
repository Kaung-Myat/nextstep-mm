import { SkeletonList } from "@/components/ui/skeleton";

export default function SettingsLoading() {
  return (
    <div className="page-enter">
      <SkeletonList rows={3} />
    </div>
  );
}
