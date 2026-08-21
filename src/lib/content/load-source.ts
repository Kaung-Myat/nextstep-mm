import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";

import { CONTENT_PATHS } from "@/lib/content/keys";
import {
  parseAdvisorTemplates,
  parseInternshipPrepPayload,
  parseRoadmapDefinition,
  type AdvisorTemplates,
  type InternshipPrepPayload,
  type RoadmapContentDefinition,
} from "@/lib/content/schemas";

function resolveRepoRoot() {
  // Prefer cwd (npm scripts). Fall back for nested invocation.
  return process.cwd();
}

function readJsonFile(relativePath: string): unknown {
  const absolute = path.join(resolveRepoRoot(), relativePath);
  return JSON.parse(readFileSync(absolute, "utf8")) as unknown;
}

/** Load + validate curated sources from `/content` (seed / tooling only). */
export function loadInternshipPrepSource(): InternshipPrepPayload {
  return parseInternshipPrepPayload(readJsonFile(CONTENT_PATHS.internshipPrep));
}

export function loadAdvisorTemplatesSource(): AdvisorTemplates {
  return parseAdvisorTemplates(readJsonFile(CONTENT_PATHS.advisorTemplates));
}

export function loadRoadmapSources(): RoadmapContentDefinition[] {
  const dir = path.join(resolveRepoRoot(), CONTENT_PATHS.roadmapsDir);
  const files = readdirSync(dir)
    .filter((name) => name.endsWith(".json"))
    .sort();

  return files.map((file) => parseRoadmapDefinition(readJsonFile(path.join(CONTENT_PATHS.roadmapsDir, file))));
}
