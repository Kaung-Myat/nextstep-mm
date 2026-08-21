import { findDuplicate } from "@/lib/jobs/deduplicate";
import { normalizeJob } from "@/lib/jobs/normalize";
import type { JobsRepository } from "@/lib/jobs/repository";
import type { SkillExtractor } from "@/lib/jobs/skill-extractor";
import { assertSourceUrlAllowed, getApprovedSource } from "@/lib/jobs/sources";
import type { IngestionResult, RawJobRecord } from "@/lib/jobs/types";

export class JobsIngestionService {
  constructor(private repository: JobsRepository, private skillExtractor: SkillExtractor) {}

  async ingest(raw: RawJobRecord): Promise<IngestionResult> {
    const source = getApprovedSource(raw.sourceId);
    if (!source) return { status: "needs-review", reason: "Source is not approved or enabled." };

    try {
      assertSourceUrlAllowed(source, raw.sourceUrl);
      const normalized = normalizeJob(raw, source);
      const duplicate = findDuplicate(normalized, await this.repository.findDedupCandidates(normalized));
      if (duplicate) return { status: "duplicate", duplicateJobId: duplicate.jobId, reason: duplicate.reason };

      const skills = await this.skillExtractor.extract(normalized);
      const jobId = await this.repository.save(normalized, skills);
      return { status: "imported", jobId, skills };
    } catch (error) {
      return { status: "needs-review", reason: error instanceof Error ? error.message : "Unknown ingestion error." };
    }
  }
}
