import type { ReactNode } from "react";

import { AdvisorChromeProvider } from "@/components/advisor/advisor-chrome-context";
import { AdvisorModelPickerSheet } from "@/components/advisor/advisor-model-picker-sheet";
import { AdvisorSiteHeader } from "@/components/advisor/advisor-site-header";
import { ByokProvider } from "@/components/settings/byok-provider";

export default function AdvisorLayout({ children }: { children: ReactNode }) {
  return (
    <ByokProvider>
      <AdvisorChromeProvider>
        <AdvisorSiteHeader />
        {children}
        <AdvisorModelPickerSheet />
      </AdvisorChromeProvider>
    </ByokProvider>
  );
}
