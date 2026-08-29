import { revalidatePath, revalidateTag } from "next/cache";

import { createIngestSkillExtractor, resolveIngestAiOptions, type IngestAiOptions } from "@/lib/jobs/ingest-ai";
import { fetchApprovedSourceJobs, type FetchableSourceId } from "@/lib/jobs/fetchers";
import { JobsIngestionService } from "@/lib/jobs/ingest";
import { getPrisma } from "@/lib/db";
import { PrismaJobsRepository } from "@/lib/jobs/repository";
import type { IngestionResult } from "@/lib/jobs/types";

export type CrawlPhaseId = "prepare" | "fetch" | "extract" | "publish" | "done";

export type CrawlProgressEvent =
  | { type: "phase"; phase: CrawlPhaseId; detail?: string }
  | { type: "log"; message: string }
  | { type: "item"; current: number; total: number; title?: string };

export type RunJobIngestOptions = {
  sources?: FetchableSourceId[];
  limitPerSource?: number;
  autoApprove?: boolean;
  ai?: IngestAiOptions;
  /** When false, do not fall back to server env API keys (public crawl path). */
  allowEnvApiKey?: boolean;
  onProgress?: (event: CrawlProgressEvent) => void;
};

export type RunJobIngestSummary = {
  fetched: number;
  imported: number;
  duplicate: number;
  needsReview: number;
  approved: number;
  provider: string;
  model: string;
  aiUsed: boolean;
  aiSuccessCount: number;
  results: IngestionResult[];
};

function summarize(results: IngestionResult[]) {
  const counts = { imported: 0, duplicate: 0, "needs-review": 0 };
  for (const result of results) counts[result.status] += 1;
  return counts;
}

export async function runJobIngest(options: RunJobIngestOptions = {}): Promise<RunJobIngestSummary> {
  const sources = options.sources ?? ["jobnet", "techcareer"];
  const limitPerSource = options.limitPerSource ?? Number(process.env.INGEST_LIMIT ?? 10);
  let aiSuccessCount = 0;
  const ai = resolveIngestAiOptions(options.ai, { allowEnvApiKey: options.allowEnvApiKey });
  const extractor = createIngestSkillExtractor(options.ai, {
    allowEnvApiKey: options.allowEnvApiKey,
    onAiSuccess: () => {
      aiSuccessCount += 1;
    },
  });
  const emit = options.onProgress ?? (() => undefined);

  emit({ type: "phase", phase: "prepare" });

  emit({ type: "phase", phase: "fetch" });
  const records = await fetchApprovedSourceJobs({
    sources,
    limitPerSource: Number.isFinite(limitPerSource) && limitPerSource > 0 ? Math.floor(limitPerSource) : 10,
    onProgress: (message) => emit({ type: "log", message }),
  });
  emit({ type: "log", message: `Fetched ${records.length} listings.` });

  emit({ type: "phase", phase: "extract" });
  const service = new JobsIngestionService(new PrismaJobsRepository(), extractor);
  const results: IngestionResult[] = [];
  for (const [index, raw] of records.entries()) {
    emit({
      type: "item",
      current: index + 1,
      total: Math.max(records.length, 1),
      title: raw.title,
    });
    results.push(await service.ingest(raw));
  }

  const counts = summarize(results);
  let approved = 0;
  if (options.autoApprove) {
    emit({ type: "phase", phase: "publish" });
    const importedIds = results
      .filter((result): result is Extract<IngestionResult, { status: "imported" }> => result.status === "imported")
      .map((result) => result.jobId);

    if (importedIds.length > 0) {
      const update = await getPrisma().job.updateMany({
        where: { id: { in: importedIds }, status: "PENDING" },
        data: { status: "APPROVED", reviewedAt: new Date() },
      });
      approved = update.count;
    }
    emit({ type: "log", message: `Published ${approved} job(s) to Jobs & Trends.` });
  }

  emit({ type: "phase", phase: "done" });

  if (approved > 0 || counts.imported > 0) {
    try {
      revalidateTag("market-jobs", "max");
      revalidatePath("/");
      revalidatePath("/jobs");
      revalidatePath("/trends");
      revalidatePath("/roadmaps");
    } catch (error) {
      console.warn("Market cache revalidation skipped:", error);
    }
  }

  return {
    fetched: records.length,
    imported: counts.imported,
    duplicate: counts.duplicate,
    needsReview: counts["needs-review"],
    approved,
    provider: ai.provider,
    model: ai.model,
    aiUsed: aiSuccessCount > 0,
    aiSuccessCount,
    results,
  };
}
