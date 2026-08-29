import "dotenv/config";

import { createIngestSkillExtractor } from "@/lib/jobs/ingest-ai";
import { fetchApprovedSourceJobs, type FetchableSourceId } from "@/lib/jobs/fetchers";
import { normalizeJob } from "@/lib/jobs/normalize";
import { runJobIngest } from "@/lib/jobs/run-ingest";
import { getApprovedSource } from "@/lib/jobs/sources";
import type { IngestionResult, RawJobRecord } from "@/lib/jobs/types";

type CliOptions = {
  sources: FetchableSourceId[];
  limit: number;
  dryRun: boolean;
  autoApprove: boolean;
};

function parseArgs(argv: string[]): CliOptions {
  const sources: FetchableSourceId[] = [];
  let limit = Number(process.env.INGEST_LIMIT ?? 15);
  let dryRun = false;
  let autoApprove = false;

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === "--dry-run") {
      dryRun = true;
      continue;
    }
    if (arg === "--approve") {
      autoApprove = true;
      continue;
    }
    if (arg === "--limit") {
      limit = Number(argv[i + 1] ?? limit);
      i += 1;
      continue;
    }
    if (arg === "--source") {
      const value = argv[i + 1];
      i += 1;
      if (value === "all") {
        sources.push("jobnet", "techcareer");
      } else if (value === "jobnet" || value === "techcareer") {
        sources.push(value);
      } else {
        throw new Error(`Unknown source "${value}". Use jobnet, techcareer, or all.`);
      }
      continue;
    }
    if (arg === "--help" || arg === "-h") {
      printHelp();
      process.exit(0);
    }
  }

  return {
    sources: sources.length > 0 ? [...new Set(sources)] : ["jobnet", "techcareer"],
    limit: Number.isFinite(limit) && limit > 0 ? Math.floor(limit) : 15,
    dryRun,
    autoApprove,
  };
}

function printHelp() {
  console.log(`Usage: npm run jobs:ingest -- [options]

Options:
  --source jobnet|techcareer|all   Source to fetch (default: all)
  --limit <n>                      Max jobs per source (default: 15)
  --approve                        Auto-approve newly imported jobs
  --dry-run                        Fetch and extract skills without writing to DB
  -h, --help                       Show help

Env:
  DATABASE_URL                     Required unless --dry-run
  INGEST_AI_ENABLED                default true; set false for dictionary only
  INGEST_AI_PROVIDER               openrouter | gemini (default openrouter)
  INGEST_AI_MODEL                  default openrouter/free
  INGEST_AI_API_KEY                optional; falls back to OPENROUTER_API_KEY / GEMINI_API_KEY
`);
}

async function dryRunIngest(records: RawJobRecord[]) {
  const extractor = createIngestSkillExtractor();
  const results: IngestionResult[] = [];
  for (const raw of records) {
    try {
      const source = getApprovedSource(raw.sourceId);
      if (!source) {
        results.push({ status: "needs-review", reason: "Source is not approved or enabled." });
        continue;
      }
      const normalized = normalizeJob(raw, source);
      const skills = await extractor.extract(normalized);
      console.log(
        `DRY ${raw.sourceId}: ${raw.title} @ ${raw.companyName} → ${skills.map((skill) => skill.slug).join(", ") || "(no skills)"}`,
      );
      results.push({ status: "imported", jobId: "dry-run", skills });
    } catch (error) {
      results.push({
        status: "needs-review",
        reason: error instanceof Error ? error.message : "Unknown dry-run error.",
      });
    }
  }
  return results;
}

async function main() {
  const options = parseArgs(process.argv.slice(2));
  console.log(
    `Ingest sources=${options.sources.join(",")} limitPerSource=${options.limit} dryRun=${options.dryRun} autoApprove=${options.autoApprove}`,
  );

  if (options.dryRun) {
    const records = await fetchApprovedSourceJobs({
      sources: options.sources,
      limitPerSource: options.limit,
      onProgress: (message) => console.log(message),
    });
    console.log(`Fetched ${records.length} raw listings.`);
    const results = await dryRunIngest(records);
    const imported = results.filter((result) => result.status === "imported").length;
    const needsReview = results.filter((result) => result.status === "needs-review").length;
    console.log(`Done. imported=${imported} needs-review=${needsReview}`);
    return;
  }

  const summary = await runJobIngest({
    sources: options.sources,
    limitPerSource: options.limit,
    autoApprove: options.autoApprove,
    onProgress: (event) => {
      if (event.type === "log") console.log(event.message);
      if (event.type === "phase") console.log(`[phase] ${event.phase}${event.detail ? ` ${event.detail}` : ""}`);
      if (event.type === "item") console.log(`[item] ${event.current}/${event.total} ${event.title ?? ""}`);
    },
  });

  console.log(
    `Done. fetched=${summary.fetched} imported=${summary.imported} duplicate=${summary.duplicate} needs-review=${summary.needsReview} approved=${summary.approved} model=${summary.model} ai=${summary.aiUsed} aiHits=${summary.aiSuccessCount}`,
  );
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
