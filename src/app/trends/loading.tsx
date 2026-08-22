export default function TrendsLoading() {
  return (
    <div className="space-y-4" aria-busy="true" aria-live="polite">
      <div className="animate-pulse rounded-2xl border border-[color:var(--color-line)] bg-[color:var(--color-card)] p-4">
        <div className="h-3 w-28 rounded-full bg-[color:var(--color-panel-strong)]" />
        <div className="mt-3 grid gap-2">
          <div className="h-10 rounded-xl bg-[color:var(--color-panel-strong)]" />
          <div className="h-10 rounded-xl bg-[color:var(--color-panel-strong)]" />
          <div className="h-10 rounded-xl bg-[color:var(--color-panel-strong)]" />
        </div>
      </div>
      {[0, 1].map((item) => (
        <div
          key={item}
          className="animate-pulse rounded-2xl border border-[color:var(--color-line)] bg-[color:var(--color-card)] p-4"
        >
          <div className="h-3 w-24 rounded-full bg-[color:var(--color-panel-strong)]" />
          <div className="mt-3 h-6 w-40 rounded-lg bg-[color:var(--color-panel-strong)]" />
          <div className="mt-4 space-y-3">
            <div className="h-8 rounded-lg bg-[color:var(--color-panel-strong)]" />
            <div className="h-8 rounded-lg bg-[color:var(--color-panel-strong)]" />
            <div className="h-8 rounded-lg bg-[color:var(--color-panel-strong)]" />
          </div>
        </div>
      ))}
    </div>
  );
}
