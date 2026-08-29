import { stripHtml } from "@/lib/jobs/html";
import { fetchText, sleep } from "@/lib/jobs/fetchers/http";
import type { RawJobRecord } from "@/lib/jobs/types";

const SITEMAP_URL = "https://www.jobnet.com.mm/sitemap_2.xml";
const JOB_URL_RE = /https:\/\/www\.jobnet\.com\.mm\/job\/[a-z0-9-]+\/\d+/gi;

/** Prefer tech / junior / internship listings for NextStep MM. */
const TECH_SLUG_RE =
  /(^|-)(software|developer|programmer|frontend|backend|fullstack|full-stack|devops|react|nodejs|node-js|typescript|python-developer|java-developer|mobile-app|web-developer|data-engineer|data-analyst|qa-engineer|sdet|cyber-security|cloud-engineer|ui-ux|ux-designer|it-support|it-executive|it-assistant|it-engineer|it-officer|network-engineer|system-admin|sysadmin|internship|junior-developer|junior-software|junior-engineer|intern-developer|intern-software|noc-engineer|payment-solution|software-service)(-|$)/i;

type JobNetFetchOptions = {
  limit?: number;
  delayMs?: number;
  onProgress?: (message: string) => void;
};

function uniquePreserveOrder(urls: string[]) {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const url of urls) {
    const normalized = url.split("?")[0]?.replace(/\/$/, "") ?? url;
    if (seen.has(normalized)) continue;
    seen.add(normalized);
    out.push(normalized);
  }
  return out;
}

function pickString(value: unknown) {
  return typeof value === "string" ? value : null;
}

function parseJobPosting(html: string) {
  const block = html.match(/<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/i)?.[1];
  if (!block) return null;

  const sanitized = block.replace(/[\u0000-\u001f]+/g, " ");
  try {
    const parsed = JSON.parse(sanitized) as Record<string, unknown>;
    return parsed;
  } catch {
    const title = block.match(/"Title"\s*:\s*"((?:\\.|[^"\\])*)"/i)?.[1] ?? block.match(/"title"\s*:\s*"((?:\\.|[^"\\])*)"/i)?.[1];
    const description =
      block.match(/"Description"\s*:\s*"((?:\\.|[^"\\])*)"/i)?.[1] ?? block.match(/"description"\s*:\s*"((?:\\.|[^"\\])*)"/i)?.[1];
    if (!title || !description) return null;
    return { Title: title.replace(/\\"/g, '"'), Description: description.replace(/\\"/g, '"') };
  }
}

function companyFromPage(html: string, posting: Record<string, unknown> | null, sourceUrl: string) {
  const hiring = posting?.hiringOrganization;
  if (hiring && typeof hiring === "object") {
    const name = pickString((hiring as { name?: unknown }).name);
    if (name) return name;
  }

  const titleTag = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1];
  if (titleTag?.includes("|")) {
    const company = stripHtml(titleTag.split("|").slice(1).join("|"));
    if (company) return company;
  }

  const slug = new URL(sourceUrl).pathname.split("/")[2] ?? "";
  const parts = slug.split("-").filter(Boolean);
  if (parts.length > 3) {
    return parts
      .slice(Math.floor(parts.length / 2))
      .join(" ")
      .replace(/\b\w/g, (char) => char.toUpperCase());
  }

  return "JobNet employer";
}

function locationFromPosting(posting: Record<string, unknown> | null) {
  const location = posting?.jobLocation;
  if (!location) return null;
  if (typeof location === "string") return location;
  if (typeof location === "object") {
    const address = (location as { address?: unknown }).address;
    if (typeof address === "string") return address;
    if (address && typeof address === "object") {
      const locality = pickString((address as { addressLocality?: unknown }).addressLocality);
      const region = pickString((address as { addressRegion?: unknown }).addressRegion);
      return [locality, region].filter(Boolean).join(", ") || null;
    }
  }
  return null;
}

export async function listJobNetTechJobUrls(limit = 40): Promise<string[]> {
  const xml = await fetchText(SITEMAP_URL, {
    headers: { Accept: "application/xml,text/xml,*/*" },
  });
  const matches = xml.match(JOB_URL_RE) ?? [];
  return uniquePreserveOrder(matches).filter((url) => TECH_SLUG_RE.test(url)).slice(0, limit);
}

export async function fetchJobNetJob(sourceUrl: string): Promise<RawJobRecord | null> {
  const html = await fetchText(sourceUrl);
  const posting = parseJobPosting(html);
  const title =
    pickString(posting?.Title) ??
    pickString(posting?.title) ??
    stripHtml(html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1]?.split("|")[0] ?? "");
  const rawDescription = pickString(posting?.Description) ?? pickString(posting?.description) ?? "";
  const description = stripHtml(rawDescription);

  if (!title || description.length < 40) return null;

  return {
    sourceId: "jobnet",
    sourceUrl,
    title: title.trim(),
    companyName: companyFromPage(html, posting, sourceUrl),
    location: locationFromPosting(posting) ?? undefined,
    jobType: pickString(posting?.employmentType) ?? undefined,
    level: undefined,
    description,
    postedAt: pickString(posting?.datePosted) ?? undefined,
  };
}

export async function fetchJobNetJobs(options: JobNetFetchOptions = {}): Promise<RawJobRecord[]> {
  const limit = options.limit ?? 20;
  const delayMs = options.delayMs ?? 600;
  const urls = await listJobNetTechJobUrls(limit);
  options.onProgress?.(`Found ${urls.length} listings to fetch.`);

  const records: RawJobRecord[] = [];
  for (const [index, url] of urls.entries()) {
    try {
      const record = await fetchJobNetJob(url);
      if (record) records.push(record);
      options.onProgress?.(`Fetched ${index + 1}/${urls.length}`);
    } catch (error) {
      options.onProgress?.(
        `Skipped listing ${index + 1}/${urls.length} (${error instanceof Error ? error.message : "error"})`,
      );
    }
    if (index < urls.length - 1) await sleep(delayMs);
  }
  return records;
}
