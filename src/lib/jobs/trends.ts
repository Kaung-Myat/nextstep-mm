import type { TrendRow } from "@/lib/jobs/types";

function count(values: string[]) {
  const totals = new Map<string, number>();
  values.forEach((value) => totals.set(value, (totals.get(value) ?? 0) + 1));
  return [...totals.entries()].map(([key, total]) => ({ key, total })).sort((a, b) => b.total - a.total || a.key.localeCompare(b.key));
}

export function aggregateJobTrends(rows: TrendRow[]) {
  return {
    totalJobs: rows.length,
    skills: count(rows.flatMap((row) => [...new Set(row.skillSlugs)])),
    levels: count(rows.map((row) => row.level ?? "UNCLASSIFIED")),
    jobTypes: count(rows.map((row) => row.jobType)),
  };
}
