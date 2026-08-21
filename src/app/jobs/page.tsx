import type { Metadata } from "next";

import { JobsListing } from "@/components/jobs/jobs-listing";
import { LocalizedPageShell } from "@/components/layout/localized-page-shell";
import { listApprovedMarketJobs } from "@/lib/jobs/market";

export const metadata: Metadata = {
  title: "Jobs",
  description: "Approved internship and junior developer openings for Myanmar.",
};

export default async function JobsPage() {
  const jobs = await listApprovedMarketJobs();
  return (
    <LocalizedPageShell page="jobs">
      <JobsListing jobs={jobs} />
    </LocalizedPageShell>
  );
}
