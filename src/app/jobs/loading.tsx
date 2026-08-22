export default function JobsLoading() {
  return (
    <div className="flex w-full flex-col gap-3" aria-busy="true" aria-live="polite">
      {[0, 1, 2, 3].map((item) => (
        <div
          key={item}
          className="animate-pulse rounded-2xl border border-[color:var(--color-line)] bg-[color:var(--color-card)] p-4"
        >
          <div className="h-5 w-[70%] max-w-md rounded-lg bg-[color:var(--color-panel-strong)]" />
          <div className="mt-2 h-4 w-32 rounded-full bg-[color:var(--color-panel-strong)]" />
          <div className="mt-3 h-4 w-full max-w-sm rounded-lg bg-[color:var(--color-panel-strong)]" />
        </div>
      ))}
    </div>
  );
}
