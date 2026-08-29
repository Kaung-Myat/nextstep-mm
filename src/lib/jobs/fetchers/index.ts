import { fetchJobNetJobs } from "@/lib/jobs/fetchers/jobnet";
import { fetchTechCareerJobs } from "@/lib/jobs/fetchers/techcareer";
import type { ApprovedJobSourceId } from "@/lib/jobs/sources";
import type { RawJobRecord } from "@/lib/jobs/types";

export type FetchableSourceId = Extract<ApprovedJobSourceId, "jobnet" | "techcareer">;

export type FetchJobsOptions = {
  sources?: FetchableSourceId[];
  limitPerSource?: number;
  onProgress?: (message: string) => void;
};

export async function fetchApprovedSourceJobs(options: FetchJobsOptions = {}): Promise<RawJobRecord[]> {
  const sources = options.sources ?? ["jobnet", "techcareer"];
  const limitPerSource = options.limitPerSource ?? 20;
  const records: RawJobRecord[] = [];
  const emit = options.onProgress ?? (() => undefined);

  for (const source of sources) {
    try {
      if (source === "jobnet") {
        emit("Collecting listings…");
        records.push(...(await fetchJobNetJobs({ limit: limitPerSource, onProgress: options.onProgress })));
      }
      if (source === "techcareer") {
        emit("Collecting more listings…");
        records.push(...(await fetchTechCareerJobs({ limit: limitPerSource, onProgress: options.onProgress })));
      }
    } catch (error) {
      // Keep other sources usable when one source is down.
      emit(`Skipped one source (${error instanceof Error ? error.message : "error"}). Continuing…`);
      console.error(`fetchApprovedSourceJobs source=${source} failed:`, error);
    }
  }

  return records;
}

export { fetchJobNetJobs, fetchTechCareerJobs };
