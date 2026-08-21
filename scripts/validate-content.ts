/**
 * Validate curated JSON under /content without touching the database.
 * Usage: npm run content:validate
 */
import {
  loadAdvisorTemplatesSource,
  loadInternshipPrepSource,
  loadRoadmapSources,
} from "../src/lib/content/load-source";

function main() {
  const prep = loadInternshipPrepSource();
  const advisor = loadAdvisorTemplatesSource();
  const roadmaps = loadRoadmapSources();

  console.log(
    `OK — internship-prep v${prep.version}, advisor-templates v${advisor.version}, roadmaps: ${roadmaps
      .map((r) => r.path)
      .join(", ")}`,
  );
}

try {
  main();
} catch (error) {
  console.error("Content validation failed:", error);
  process.exitCode = 1;
}
