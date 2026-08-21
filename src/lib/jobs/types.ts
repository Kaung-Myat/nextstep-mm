export type IngestionMode = "manual" | "approved-feed" | "approved-page";

export type ApprovedJobSource = {
  id: string;
  name: string;
  mode: IngestionMode;
  allowedHosts: readonly string[];
  enabled: boolean;
  notes: string;
};

export type RawJobRecord = {
  sourceId: string;
  sourceUrl: string;
  title: string;
  companyName: string;
  companyWebsite?: string;
  location?: string;
  jobType?: string;
  level?: string;
  description: string;
  postedAt?: string;
};

export type NormalizedJobType = "INTERNSHIP" | "FULL_TIME" | "PART_TIME" | "CONTRACT";
export type NormalizedJobLevel = "INTERN" | "JUNIOR" | null;

export type NormalizedJobRecord = {
  sourceId: string;
  sourceName: string;
  sourceUrl: string;
  title: string;
  companyName: string;
  companyWebsite: string | null;
  location: string | null;
  jobType: NormalizedJobType;
  level: NormalizedJobLevel;
  rawDescription: string;
  normalizedDescription: string;
  postedAt: Date | null;
};

export type ExtractedSkill = {
  slug: string;
  name: string;
  category: "language" | "framework" | "database" | "tool" | "fundamental" | "soft-skill";
  evidence: string;
};

export type DedupCandidate = Pick<NormalizedJobRecord, "sourceUrl" | "title" | "companyName" | "location" | "postedAt"> & {
  id: string;
};

export type IngestionResult =
  | { status: "imported"; jobId: string; skills: ExtractedSkill[] }
  | { status: "duplicate"; duplicateJobId: string; reason: "source-url" | "fingerprint" }
  | { status: "needs-review"; reason: string };

export type TrendRow = {
  jobId: string;
  title: string;
  level: NormalizedJobLevel;
  jobType: NormalizedJobType;
  skillSlugs: string[];
};
