import type { Metadata } from "next";

import { LocalizedPageShell } from "@/components/layout/localized-page-shell";
import { TrendsDashboard } from "@/components/trends/trends-dashboard";
import { listApprovedMarketJobs } from "@/lib/jobs/market";

export const metadata: Metadata = {
  title: "Myanmar Developer Job Trends",
  description: "Explore skill, stack, and role demand for internships and junior developer roles.",
};

export default async function TrendsPage() {
  const jobs = await listApprovedMarketJobs();
  return (
    <LocalizedPageShell page="trends">
      <TrendsDashboard jobs={jobs} />
    </LocalizedPageShell>
  );
}
