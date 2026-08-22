export default function RoadmapDetailLoading() {
  return (
    <div className="w-full max-w-full safe-top" aria-busy="true" aria-live="polite">
      <div className="border-b border-[color:var(--color-line)] bg-[color:var(--color-surface)] px-4 pb-4 pt-3 sm:px-6 lg:px-8">
        <div className="flex items-start gap-3">
          <div className="mt-0.5 size-9 shrink-0 animate-pulse rounded-full bg-[color:var(--color-panel-strong)]" />
          <div className="min-w-0 flex-1 space-y-2">
            <div className="h-3 w-20 animate-pulse rounded-full bg-[color:var(--color-panel-strong)]" />
            <div className="h-7 w-[80%] max-w-md animate-pulse rounded-xl bg-[color:var(--color-panel-strong)]" />
            <div className="h-10 w-full max-w-lg animate-pulse rounded-xl bg-[color:var(--color-panel-strong)]" />
          </div>
        </div>
        <div className="mt-4 space-y-2">
          <div className="h-3 w-28 animate-pulse rounded-full bg-[color:var(--color-panel-strong)]" />
          <div className="h-2 w-full animate-pulse rounded-full bg-[color:var(--color-panel-strong)]" />
        </div>
        <div className="mt-3 flex gap-2">
          {[0, 1, 2].map((item) => (
            <div key={item} className="h-9 w-28 shrink-0 animate-pulse rounded-full bg-[color:var(--color-panel-strong)]" />
          ))}
        </div>
      </div>

      <div className="space-y-2.5 border-b border-[color:var(--color-line)] px-4 py-2.5 sm:px-6 lg:px-8">
        <div className="h-9 w-52 animate-pulse rounded-full bg-[color:var(--color-panel-strong)]" />
        <div className="flex gap-2">
          {[0, 1, 2].map((item) => (
            <div key={item} className="h-12 w-32 shrink-0 animate-pulse rounded-full bg-[color:var(--color-panel-strong)]" />
          ))}
        </div>
      </div>

      <section className="space-y-2 px-4 py-4 sm:px-6 lg:px-8">
        <div className="h-5 w-40 animate-pulse rounded-lg bg-[color:var(--color-panel-strong)]" />
        <div className="h-4 w-full max-w-md animate-pulse rounded-lg bg-[color:var(--color-panel-strong)]" />
        <div className="mt-3 overflow-hidden rounded-2xl border border-[color:var(--color-line)]">
          {[0, 1, 2, 4, 5].map((item) => (
            <div key={item} className="flex gap-3 border-b border-[color:var(--color-line)] px-4 py-4 last:border-b-0">
              <div className="size-7 shrink-0 animate-pulse rounded-full bg-[color:var(--color-panel-strong)]" />
              <div className="flex-1 space-y-2">
                <div className="h-4 w-3/4 animate-pulse rounded bg-[color:var(--color-panel-strong)]" />
                <div className="h-3 w-1/3 animate-pulse rounded bg-[color:var(--color-panel-strong)]" />
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
