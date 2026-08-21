import { cn } from "@/lib/utils";

type ProgressBarProps = {
  value: number;
  className?: string;
};

export function ProgressBar({ value, className }: ProgressBarProps) {
  const clampedValue = Math.max(0, Math.min(100, value));

  return (
    <div className={cn("h-1.5 w-full overflow-hidden rounded-full bg-[color:var(--color-panel-strong)]", className)}>
      <div
        className="h-full rounded-full bg-[color:var(--color-accent)] transition-[width] duration-300"
        style={{ width: `${clampedValue}%` }}
      />
    </div>
  );
}
