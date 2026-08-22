import type { Metadata } from "next";

import { InternshipPrepHub } from "@/components/internship-prep/internship-prep-hub";
import { LocalizedPageShell } from "@/components/layout/localized-page-shell";
import { getInternshipPrepPayload } from "@/lib/internship-prep";
import { getCompletedInternshipItemKeys } from "@/lib/internship-prep-progress";
import { getApprovedJobCount, getMarketSkillHighlights } from "@/lib/jobs/market";

export const metadata: Metadata = {
  title: "Internship Prep",
  description: "Practical resume, portfolio, GitHub, and interview preparation for junior developers.",
};

export default async function InternshipPrepPage() {
  const [completedKeys, payload, marketSkills, marketJobCount] = await Promise.all([
    getCompletedInternshipItemKeys(),
    getInternshipPrepPayload(),
    getMarketSkillHighlights(5),
    getApprovedJobCount(),
  ]);

  const marketSkillCards = marketSkills.map((skill) => ({
    name: skill.name,
    share: skill.share,
  }));

  return (
    <LocalizedPageShell page="internshipPrep">
      <InternshipPrepHub
        initialCompletedKeys={completedKeys}
        copyByLocale={payload.copy}
        marketSkills={marketSkillCards}
        marketJobCount={marketJobCount}
      />
    </LocalizedPageShell>
  );
}
