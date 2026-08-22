import type { Metadata } from "next";

import { JobsListing } from "@/components/jobs/jobs-listing";
import { LocalizedPageShell } from "@/components/layout/localized-page-shell";

export const metadata: Metadata = {
  title: "Jobs",
  description: "Approved internship and junior developer openings for Myanmar.",
};

export default function JobsPage() {
  return (
    <LocalizedPageShell page="jobs">
      <JobsListing />
    </LocalizedPageShell>
  );
}
