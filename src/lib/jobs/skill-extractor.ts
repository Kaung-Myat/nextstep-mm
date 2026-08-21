import type { ExtractedSkill, NormalizedJobRecord } from "@/lib/jobs/types";

export interface SkillExtractor {
  extract(job: NormalizedJobRecord): Promise<ExtractedSkill[]>;
}

export const skillDictionary = [
  ["javascript", "JavaScript", "language", ["javascript", "js"]],
  ["typescript", "TypeScript", "language", ["typescript", "ts"]],
  ["python", "Python", "language", ["python"]],
  ["java", "Java", "language", ["java"]],
  ["php", "PHP", "language", ["php"]],
  ["csharp", "C#", "language", ["c#", "csharp", ".net"]],
  ["go", "Go", "language", ["golang"]],
  ["kotlin", "Kotlin", "language", ["kotlin"]],
  ["swift", "Swift", "language", ["swift"]],
  ["react", "React", "framework", ["react", "react.js", "reactjs"]],
  ["nextjs", "Next.js", "framework", ["next.js", "nextjs"]],
  ["vue", "Vue.js", "framework", ["vue", "vue.js", "vuejs"]],
  ["angular", "Angular", "framework", ["angular"]],
  ["nodejs", "Node.js", "framework", ["node.js", "nodejs", "node js"]],
  ["express", "Express", "framework", ["express", "express.js"]],
  ["nestjs", "NestJS", "framework", ["nestjs", "nest.js"]],
  ["laravel", "Laravel", "framework", ["laravel"]],
  ["django", "Django", "framework", ["django"]],
  ["flutter", "Flutter", "framework", ["flutter"]],
  ["react-native", "React Native", "framework", ["react native"]],
  ["tailwind", "Tailwind CSS", "framework", ["tailwind", "tailwindcss"]],
  ["postgresql", "PostgreSQL", "database", ["postgresql", "postgres"]],
  ["mysql", "MySQL", "database", ["mysql"]],
  ["mongodb", "MongoDB", "database", ["mongodb", "mongo"]],
  ["redis", "Redis", "database", ["redis"]],
  ["sql", "SQL", "database", ["sql"]],
  ["git", "Git", "tool", ["git", "github", "gitlab"]],
  ["docker", "Docker", "tool", ["docker"]],
  ["kubernetes", "Kubernetes", "tool", ["kubernetes", "k8s"]],
  ["aws", "AWS", "tool", ["aws", "amazon web services"]],
  ["azure", "Azure", "tool", ["azure"]],
  ["gcp", "GCP", "tool", ["gcp", "google cloud"]],
  ["linux", "Linux", "tool", ["linux"]],
  ["figma", "Figma", "tool", ["figma"]],
  ["rest-api", "REST APIs", "fundamental", ["rest api", "restful", "rest apis"]],
  ["graphql", "GraphQL", "fundamental", ["graphql"]],
  ["oop", "OOP", "fundamental", ["oop", "object oriented"]],
  ["data-structures", "Data Structures", "fundamental", ["data structures", "algorithms"]],
  ["testing", "Testing", "fundamental", ["unit test", "testing", "jest", "cypress", "playwright"]],
  ["communication", "Communication", "soft-skill", ["communication", "communicate"]],
  ["teamwork", "Teamwork", "soft-skill", ["teamwork", "collaboration", "collaborate"]],
  ["problem-solving", "Problem Solving", "soft-skill", ["problem solving", "problem-solving"]],
] as const;

export class DictionarySkillExtractor implements SkillExtractor {
  async extract(job: NormalizedJobRecord): Promise<ExtractedSkill[]> {
    const haystack = ` ${job.title} ${job.normalizedDescription} `.toLowerCase();
    return skillDictionary.flatMap(([slug, name, category, aliases]) => {
      const evidence = aliases.find((alias) => {
        const escaped = alias.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        return new RegExp(`(^|[^a-z0-9])${escaped}([^a-z0-9]|$)`, "i").test(haystack);
      });
      return evidence ? [{ slug, name, category, evidence: evidence.trim() }] : [];
    });
  }
}
