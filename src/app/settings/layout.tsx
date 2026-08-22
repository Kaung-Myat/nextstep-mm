import type { ReactNode } from "react";

import { ByokProvider } from "@/components/settings/byok-provider";

export default function SettingsLayout({ children }: { children: ReactNode }) {
  return <ByokProvider>{children}</ByokProvider>;
}
