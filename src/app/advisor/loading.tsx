export default function AdvisorLoading() {
  return (
    <div className="flex min-h-[50vh] flex-col gap-3 px-1" aria-busy="true" aria-live="polite">
      {[0, 1, 2].map((item) => (
        <div
          key={item}
          className={cnSkeleton(item % 2 === 0 ? "self-start max-w-[85%]" : "self-end max-w-[75%]")}
        />
      ))}
    </div>
  );
}

function cnSkeleton(alignment: string) {
  return `animate-pulse rounded-2xl border border-[color:var(--color-line)] bg-[color:var(--color-card)] p-4 ${alignment}`;
}
