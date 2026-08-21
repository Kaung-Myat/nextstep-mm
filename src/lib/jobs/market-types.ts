export type MarketRole = "frontend" | "backend" | "fullstack";
export type MarketLevel = "intern" | "junior";

export type MarketJob = {
  id: string;
  title: string;
  company: string;
  role: MarketRole;
  level: MarketLevel;
  location: string;
  postedDaysAgo: number;
  skills: string[];
  stack: string;
  sourceUrl: string;
  sourceName: string;
};

const stackDescriptions: Record<string, string> = {
  "React + TypeScript": "Common in frontend product teams",
  "Node.js + PostgreSQL": "Strong backend and API pairing",
  "React + Node.js": "Frequent internship fullstack stack",
  "Next.js + PostgreSQL": "Growing end-to-end product stack",
};

export function getStackDescription(stack: string) {
  return stackDescriptions[stack] ?? "Appears across approved listings";
}

export function rankSkills(jobs: MarketJob[], limit = 8) {
  const totals = new Map<string, number>();
  jobs.forEach((job) => {
    new Set(job.skills).forEach((skill) => totals.set(skill, (totals.get(skill) ?? 0) + 1));
  });
  return [...totals.entries()]
    .map(([name, count]) => ({ name, count, share: jobs.length ? Math.round((count / jobs.length) * 100) : 0 }))
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name))
    .slice(0, limit);
}

export function rankStacks(jobs: MarketJob[], limit = 4) {
  const totals = new Map<string, number>();
  jobs.forEach((job) => totals.set(job.stack, (totals.get(job.stack) ?? 0) + 1));
  return [...totals.entries()]
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name))
    .slice(0, limit);
}
