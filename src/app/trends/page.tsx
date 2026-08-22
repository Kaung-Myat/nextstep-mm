import type { Metadata } from "next";

import { LocalizedPageShell } from "@/components/layout/localized-page-shell";
import { TrendsDashboard } from "@/components/trends/trends-dashboard";

export const metadata: Metadata = {
  title: "Myanmar Developer Job Trends",
  description: "Explore skill, stack, and role demand for internships and junior developer roles.",
};

export default function TrendsPage() {
  return (
    <LocalizedPageShell page="trends">
      <TrendsDashboard />
    </LocalizedPageShell>
  );
}
