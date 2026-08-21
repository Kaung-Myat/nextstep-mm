import type { Metadata } from "next";

import { AdvisorWorkspace } from "@/components/advisor/advisor-workspace";

export const metadata: Metadata = {
  title: "AI Career Advisor",
  description: "Get practical next-step guidance grounded in your learning path and internship goals.",
};

export default function AdvisorPage() {
  return <AdvisorWorkspace />;
}
