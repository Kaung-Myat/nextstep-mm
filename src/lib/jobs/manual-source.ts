import type { RawJobRecord } from "@/lib/jobs/types";

// UI/file parsing belongs outside the pipeline. This adapter only validates the
// boundary shape so importers can share the service.
export function createManualJobRecord(input: Omit<RawJobRecord, "sourceId">): RawJobRecord {
  return { ...input, sourceId: "manual-listing" };
}
