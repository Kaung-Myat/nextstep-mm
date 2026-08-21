/**
 * Maps curated roadmap item slugs to Skill.slug values from the job dictionary.
 * Used to surface Myanmar market demand without regenerating curriculum.
 */
export const roadmapItemSkillSlugs: Record<string, string[]> = {
  // Frontend
  "html-css-layouts": ["tailwind", "figma"],
  "javascript-dom-foundations": ["javascript"],
  "react-component-thinking": ["react"],
  "nextjs-routing-data-fetching": ["nextjs", "react", "typescript"],
  "frontend-job-ready-projects": ["git", "react", "figma"],
  "frontend-api-collaboration": ["rest-api", "git", "javascript"],

  // Backend
  "nodejs-runtime-basics": ["nodejs", "javascript"],
  "http-rest-api-basics": ["rest-api", "nodejs"],
  "express-route-architecture": ["express", "nodejs"],
  "postgresql-prisma-basics": ["postgresql", "sql", "nodejs"],
  "backend-auth-and-deployment": ["nodejs", "docker", "rest-api"],
  "backend-debugging-observability": ["nodejs", "testing"],

  // Fullstack
  "web-flow-and-product-thinking": ["javascript", "rest-api"],
  "nextjs-fullstack-basics": ["nextjs", "react", "nodejs"],
  "data-models-and-persistence": ["postgresql", "sql", "nodejs"],
  "auth-and-user-workflows": ["nextjs", "nodejs", "rest-api"],
  "ship-fullstack-portfolio-project": ["nextjs", "react", "postgresql", "git"],
  "fullstack-quality-and-explanation": ["testing", "git", "typescript"],
};

export function skillSlugsForItem(itemSlug: string): string[] {
  return roadmapItemSkillSlugs[itemSlug] ?? [];
}
