import type { Metadata } from "next";

import { InternshipPrepHub } from "@/components/internship-prep/internship-prep-hub";
import { LocalizedPageShell } from "@/components/layout/localized-page-shell";
import { getInternshipPrepPayload } from "@/lib/internship-prep";
import { getCompletedInternshipItemKeys } from "@/lib/internship-prep-progress";
import { listApprovedMarketJobs } from "@/lib/jobs/market";
import { rankSkills } from "@/lib/jobs/market-types";

export const metadata: Metadata = {
  title: "Internship Prep",
  description: "Practical resume, portfolio, GitHub, and interview preparation for junior developers.",
};

export default async function InternshipPrepPage() {
  const [completedKeys, payload, marketJobs] = await Promise.all([
    getCompletedInternshipItemKeys(),
    getInternshipPrepPayload(),
    listApprovedMarketJobs(),
  ]);

  const marketSkills = rankSkills(marketJobs, 5).map((skill) => ({
    name: skill.name,
    share: skill.share,
  }));

  return (
    <LocalizedPageShell page="internshipPrep">
      <InternshipPrepHub
        initialCompletedKeys={completedKeys}
        copyByLocale={payload.copy}
        marketSkills={marketSkills}
        marketJobCount={marketJobs.length}
      />
    </LocalizedPageShell>
  );
}
