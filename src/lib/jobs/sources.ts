import type { ApprovedJobSource } from "@/lib/jobs/types";

// Deliberately small. Add a source only after reviewing its terms and access rules.
export const approvedJobSources = [
  {
    id: "manual-listing",
    name: "Manually added public listing",
    mode: "manual",
    allowedHosts: [],
    enabled: true,
    notes: "A public listing copied into the database after confirming it may be included.",
  },
  {
    id: "jobnet",
    name: "JobNet Myanmar",
    mode: "approved-page",
    allowedHosts: ["www.jobnet.com.mm", "jobnet.com.mm"],
    enabled: true,
    notes:
      "Public JobPosting pages linked from sitemap. Respect robots.txt (no CV upload/download paths), rate-limit, and attribute sourceUrl.",
  },
  {
    id: "techcareer",
    name: "Tech Career MM",
    mode: "approved-feed",
    allowedHosts: ["techcareerweb.com", "www.techcareerweb.com"],
    enabled: true,
    notes:
      "Public Onesite article-list/detail API for techcareerweb.com. Canonical job URLs use /article-details/{id}. Rate-limit requests.",
  },
] as const satisfies readonly ApprovedJobSource[];

export type ApprovedJobSourceId = (typeof approvedJobSources)[number]["id"];

export function getApprovedSource(sourceId: string): ApprovedJobSource | null {
  return approvedJobSources.find((source) => source.id === sourceId && source.enabled) ?? null;
}

export function assertSourceUrlAllowed(source: ApprovedJobSource, sourceUrl: string) {
  let url: URL;
  try {
    url = new URL(sourceUrl);
  } catch {
    throw new Error("Source URL must be a valid absolute URL.");
  }

  if (url.protocol !== "https:") throw new Error("Only HTTPS job sources are accepted.");
  if (source.mode !== "manual" && !source.allowedHosts.includes(url.hostname)) {
    throw new Error(`Host ${url.hostname} is not approved for ${source.name}.`);
  }
}
