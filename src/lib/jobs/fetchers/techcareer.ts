import { stripHtml } from "@/lib/jobs/html";
import { fetchJson, sleep } from "@/lib/jobs/fetchers/http";
import type { RawJobRecord } from "@/lib/jobs/types";

const API_BASE = "https://api.onesiteblog.com/api";
const DOMAIN = "https://techcareerweb.com";

type OnesiteListResponse = {
  body?: {
    data?: OnesiteArticle[];
    totalPages?: number;
    page?: number;
  };
};

type OnesiteDetailResponse = {
  body?: {
    data?: OnesiteArticle;
  };
};

type OnesiteArticle = {
  id: string;
  title?: string;
  description?: string;
  content?: string;
  slug?: string;
  createdAt?: string;
  updatedAt?: string;
};

type TechCareerFetchOptions = {
  limit?: number;
  delayMs?: number;
  onProgress?: (message: string) => void;
};

function companyFromContent(title: string, content: string) {
  const locationMatch = content.match(/Location:\s*([^\n]+)/i);
  const companyLine = content.match(/(?:Company|Employer|Organization)\s*[:\-]\s*([^\n]+)/i);
  if (companyLine?.[1]) return stripHtml(companyLine[1]).slice(0, 120);

  const preview = content.match(/https?:\/\/([a-z0-9.-]+\.[a-z]{2,})/i);
  if (preview?.[1] && !/techcareerweb\.com|onesiteblog|facebook\.com|linkedin\.com/i.test(preview[1])) {
    const host = preview[1].replace(/^www\./, "");
    return host.split(".")[0]?.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()) ?? host;
  }

  if (title.includes("|")) return title.split("|").slice(1).join("|").trim() || "Tech Career MM employer";
  if (title.includes(" at ")) return title.split(" at ").slice(1).join(" at ").trim() || "Tech Career MM employer";

  return "Tech Career MM employer";
}

function locationFromContent(content: string) {
  const match = content.match(/Location:\s*([^\n.]+)/i);
  return match?.[1]?.trim() || undefined;
}

function publicArticleUrl(article: OnesiteArticle) {
  // /articles/[param] is a category listing page and shows "No Content Found" for job IDs.
  // Public job posts live under /article-details/[id] (UUID or slug both work).
  const key = article.id?.trim() || article.slug?.trim();
  if (!key) throw new Error("Tech Career article is missing id and slug.");
  return `https://techcareerweb.com/article-details/${key}`;
}

function toRawRecord(article: OnesiteArticle): RawJobRecord | null {
  const title = article.title?.trim();
  const html = `${article.description ?? ""}\n${article.content ?? ""}`;
  const description = stripHtml(html);
  if (!title || description.length < 40) return null;

  return {
    sourceId: "techcareer",
    sourceUrl: publicArticleUrl(article),
    title,
    companyName: companyFromContent(title, description),
    location: locationFromContent(description),
    description,
    postedAt: article.createdAt ?? article.updatedAt,
  };
}

export async function fetchTechCareerJobs(options: TechCareerFetchOptions = {}): Promise<RawJobRecord[]> {
  const limit = options.limit ?? 20;
  const delayMs = options.delayMs ?? 400;
  const pageSize = Math.min(20, limit);
  const records: RawJobRecord[] = [];
  let page = 1;
  let totalPages = 1;

  while (records.length < limit && page <= totalPages) {
    const listUrl = `${API_BASE}/blog/article-list?domain=${encodeURIComponent(DOMAIN)}&page=${page}&limit=${pageSize}`;
    const list = await fetchJson<OnesiteListResponse>(listUrl);
    const items = list.body?.data ?? [];
    totalPages = list.body?.totalPages ?? page;
    options.onProgress?.(`Tech Career MM: page ${page}/${totalPages}, ${items.length} articles.`);

    for (const item of items) {
      if (records.length >= limit) break;
      try {
        const detailUrl = `${API_BASE}/blog/article-detail?id=${encodeURIComponent(item.id)}&domain=${encodeURIComponent(DOMAIN)}`;
        const detail = await fetchJson<OnesiteDetailResponse>(detailUrl);
        const article = detail.body?.data ?? item;
        const record = toRawRecord(article);
        if (record) records.push(record);
        await sleep(delayMs);
      } catch (error) {
        options.onProgress?.(
          `Tech Career MM: skip ${item.id} (${error instanceof Error ? error.message : "error"})`,
        );
      }
    }

    page += 1;
    if (page <= totalPages && records.length < limit) await sleep(delayMs);
  }

  return records;
}
