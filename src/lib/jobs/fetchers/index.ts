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

  for (const source of sources) {
    if (source === "jobnet") {
      records.push(...(await fetchJobNetJobs({ limit: limitPerSource, onProgress: options.onProgress })));
    }
    if (source === "techcareer") {
      records.push(...(await fetchTechCareerJobs({ limit: limitPerSource, onProgress: options.onProgress })));
    }
  }

  return records;
}

export { fetchJobNetJobs, fetchTechCareerJobs };
