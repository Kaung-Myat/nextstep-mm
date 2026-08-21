import type { RoadmapStage } from "@/lib/roadmaps/types";

import { cn } from "@/lib/utils";

type StageBadgeProps = {
  stage: RoadmapStage;
};

const stageClasses: Record<RoadmapStage, string> = {
  beginner: "bg-[color:var(--color-panel)] text-[color:var(--color-text-soft)] border-[color:var(--color-line-strong)]",
  intermediate: "bg-white text-[color:var(--color-accent)] border-[color:var(--color-accent-soft)]",
  "job-ready": "bg-[color:var(--color-accent)] text-[color:var(--color-accent-foreground)] border-[color:var(--color-accent)]",
};

export function StageBadge({ stage }: StageBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em]",
        stageClasses[stage],
      )}
    >
      {stage}
    </span>
  );
}
