import type { DedupCandidate, NormalizedJobRecord } from "@/lib/jobs/types";

function keyPart(value: string | null) {
  return (value ?? "").toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}

export function createJobFingerprint(job: Pick<NormalizedJobRecord, "title" | "companyName" | "location" | "postedAt">) {
  const date = job.postedAt?.toISOString().slice(0, 10) ?? "unknown-date";
  return [keyPart(job.companyName), keyPart(job.title), keyPart(job.location), date].join("|");
}

export function findDuplicate(job: NormalizedJobRecord, candidates: DedupCandidate[]) {
  const urlMatch = candidates.find((candidate) => candidate.sourceUrl === job.sourceUrl);
  if (urlMatch) return { jobId: urlMatch.id, reason: "source-url" as const };

  const fingerprint = createJobFingerprint(job);
  const fingerprintMatch = candidates.find((candidate) => createJobFingerprint(candidate) === fingerprint);
  return fingerprintMatch ? { jobId: fingerprintMatch.id, reason: "fingerprint" as const } : null;
}
