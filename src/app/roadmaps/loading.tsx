export default function RoadmapsLoading() {
  return (
    <div className="flex w-full flex-col gap-3" aria-busy="true" aria-live="polite">
      {[0, 1, 2].map((item) => (
        <div
          key={item}
          className="animate-pulse rounded-2xl border border-[color:var(--color-line)] bg-[color:var(--color-card)] p-4"
        >
          <div className="h-3 w-24 rounded-full bg-[color:var(--color-panel-strong)]" />
          <div className="mt-3 h-6 w-[80%] max-w-sm rounded-lg bg-[color:var(--color-panel-strong)]" />
          <div className="mt-2 h-12 w-full rounded-lg bg-[color:var(--color-panel-strong)]" />
          <div className="mt-4 h-2 w-full rounded-full bg-[color:var(--color-panel-strong)]" />
        </div>
      ))}
    </div>
  );
}
