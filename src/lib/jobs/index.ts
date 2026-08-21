export { AiSkillExtractor } from "@/lib/jobs/ai-skill-extractor";
export {
  createIngestSkillExtractor,
  DEFAULT_INGEST_AI_MODEL,
  DEFAULT_INGEST_AI_PROVIDER,
  resolveIngestAiOptions,
} from "@/lib/jobs/ingest-ai";
export { fetchApprovedSourceJobs } from "@/lib/jobs/fetchers";
export { JobsIngestionService } from "@/lib/jobs/ingest";
export { runJobIngest } from "@/lib/jobs/run-ingest";
export { createManualJobRecord } from "@/lib/jobs/manual-source";
export { PrismaJobsRepository, type JobsRepository } from "@/lib/jobs/repository";
export { DictionarySkillExtractor, type SkillExtractor } from "@/lib/jobs/skill-extractor";
export { aggregateJobTrends } from "@/lib/jobs/trends";
export { listApprovedMarketJobs } from "@/lib/jobs/market";
export { getStackDescription, rankSkills, rankStacks } from "@/lib/jobs/market-types";
export { approvedJobSources } from "@/lib/jobs/sources";
export type { IngestionResult, RawJobRecord, TrendRow } from "@/lib/jobs/types";
export type { MarketJob } from "@/lib/jobs/market-types";

