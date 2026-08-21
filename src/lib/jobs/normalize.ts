import type { ApprovedJobSource, NormalizedJobLevel, NormalizedJobRecord, NormalizedJobType, RawJobRecord } from "@/lib/jobs/types";

function cleanText(value: string) {
  return value.replace(/\s+/g, " ").trim();
}

function normalizeLevel(level: string | undefined, title: string): NormalizedJobLevel {
  const value = `${level ?? ""} ${title}`.toLowerCase();
  if (/\b(intern|internship|trainee)\b/.test(value)) return "INTERN";
  if (/\b(junior|entry[- ]level|graduate)\b/.test(value)) return "JUNIOR";
  return null;
}

function normalizeJobType(jobType: string | undefined, title: string): NormalizedJobType {
  const value = `${jobType ?? ""} ${title}`.toLowerCase();
  if (/\b(intern|internship|trainee)\b/.test(value)) return "INTERNSHIP";
  if (/\bpart[- ]time\b/.test(value)) return "PART_TIME";
  if (/\b(contract|freelance|temporary)\b/.test(value)) return "CONTRACT";
  return "FULL_TIME";
}

export function normalizeJob(raw: RawJobRecord, source: ApprovedJobSource): NormalizedJobRecord {
  const title = cleanText(raw.title);
  const description = cleanText(raw.description);
  const postedAt = raw.postedAt ? new Date(raw.postedAt) : null;

  if (!title || !cleanText(raw.companyName) || description.length < 40) {
    throw new Error("A title, company, and meaningful description are required.");
  }
  if (postedAt && Number.isNaN(postedAt.getTime())) throw new Error("Posted date is invalid.");

  const url = new URL(raw.sourceUrl);
  url.hash = "";
  ["utm_source", "utm_medium", "utm_campaign", "utm_content"].forEach((key) => url.searchParams.delete(key));

  return {
    sourceId: source.id,
    sourceName: source.name,
    sourceUrl: url.toString(),
    title,
    companyName: cleanText(raw.companyName),
    companyWebsite: raw.companyWebsite?.trim() || null,
    location: raw.location ? cleanText(raw.location) : null,
    jobType: normalizeJobType(raw.jobType, title),
    level: normalizeLevel(raw.level, title),
    rawDescription: raw.description.trim(),
    normalizedDescription: description,
    postedAt,
  };
}
