import type { AiProviderId } from "@/lib/ai/providers";
import { DictionarySkillExtractor, type SkillExtractor } from "@/lib/jobs/skill-extractor";
import type { ExtractedSkill, NormalizedJobRecord } from "@/lib/jobs/types";

type AiSkillExtractorOptions = {
  provider?: AiProviderId;
  model?: string;
  apiKey?: string;
  enabled?: boolean;
  onAiSuccess?: () => void;
};

type AiSkillJson = {
  skills?: Array<{
    slug?: string;
    name?: string;
    category?: ExtractedSkill["category"];
    evidence?: string;
  }>;
};

const ALLOWED_CATEGORIES = new Set<ExtractedSkill["category"]>([
  "language",
  "framework",
  "database",
  "tool",
  "fundamental",
  "soft-skill",
]);

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 64);
}

function normalizeAiSkills(payload: AiSkillJson): ExtractedSkill[] {
  const skills = Array.isArray(payload.skills) ? payload.skills : [];
  const seen = new Set<string>();
  const out: ExtractedSkill[] = [];

  for (const skill of skills) {
    const name = skill.name?.trim();
    if (!name) continue;
    const slug = slugify(skill.slug?.trim() || name);
    if (!slug || seen.has(slug)) continue;
    const category = skill.category && ALLOWED_CATEGORIES.has(skill.category) ? skill.category : "fundamental";
    seen.add(slug);
    out.push({
      slug,
      name,
      category,
      evidence: skill.evidence?.trim() || name,
    });
  }

  return out.slice(0, 16);
}

function mergeSkills(primary: ExtractedSkill[], secondary: ExtractedSkill[]) {
  const seen = new Set(primary.map((skill) => skill.slug));
  const merged = [...primary];
  for (const skill of secondary) {
    if (seen.has(skill.slug)) continue;
    seen.add(skill.slug);
    merged.push(skill);
  }
  return merged;
}

function extractJsonObject(text: string): AiSkillJson {
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/i)?.[1];
  const candidate = (fenced ?? text).trim();
  const start = candidate.indexOf("{");
  const end = candidate.lastIndexOf("}");
  if (start === -1 || end === -1 || end <= start) throw new Error("AI skill response was not JSON.");
  return JSON.parse(candidate.slice(start, end + 1)) as AiSkillJson;
}

async function callGemini(apiKey: string, model: string, prompt: string) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`;
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-goog-api-key": apiKey,
    },
    body: JSON.stringify({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: { temperature: 0.1 },
    }),
  });
  const payload = (await response.json()) as {
    error?: { message?: string };
    candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>;
  };
  if (!response.ok) throw new Error(payload.error?.message ?? `Gemini failed (${response.status})`);
  const text = payload.candidates?.[0]?.content?.parts?.map((part) => part.text ?? "").join("")?.trim();
  if (!text) throw new Error("Gemini returned an empty skill response.");
  return text;
}

async function callOpenRouter(apiKey: string, model: string, prompt: string) {
  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "HTTP-Referer": process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
      "X-Title": "NextStep MM Ingest",
    },
    body: JSON.stringify({
      model,
      temperature: 0.1,
      messages: [
        {
          role: "system",
          content: "Extract skills from Myanmar tech job descriptions. Reply with JSON only.",
        },
        { role: "user", content: prompt },
      ],
    }),
  });
  const payload = (await response.json()) as {
    error?: { message?: string };
    choices?: Array<{ message?: { content?: string } }>;
  };
  if (!response.ok) throw new Error(payload.error?.message ?? `OpenRouter failed (${response.status})`);
  const text = payload.choices?.[0]?.message?.content?.trim();
  if (!text) throw new Error("OpenRouter returned an empty skill response.");
  return text;
}

function buildPrompt(job: NormalizedJobRecord) {
  return [
    "Extract concrete technical and soft skills from this Myanmar junior/internship job posting.",
    "Return JSON only in this shape:",
    '{"skills":[{"slug":"react","name":"React","category":"framework","evidence":"React"}]}',
    "category must be one of: language, framework, database, tool, fundamental, soft-skill.",
    "Only include skills clearly supported by the text. Max 12 skills.",
    `Title: ${job.title}`,
    `Company: ${job.companyName}`,
    `Description: ${job.normalizedDescription.slice(0, 5000)}`,
  ].join("\n");
}

export class AiSkillExtractor implements SkillExtractor {
  private fallback = new DictionarySkillExtractor();

  constructor(private options: AiSkillExtractorOptions = {}) {}

  async extract(job: NormalizedJobRecord): Promise<ExtractedSkill[]> {
    const dictionarySkills = await this.fallback.extract(job);
    const enabled = this.options.enabled !== false;
    const apiKey = this.options.apiKey?.trim();
    const provider = this.options.provider ?? "openrouter";

    if (!enabled || !apiKey) return dictionarySkills;

    const model =
      this.options.model?.trim() ||
      (provider === "openrouter" ? "openrouter/free" : "gemini-2.0-flash");

    try {
      const prompt = buildPrompt(job);
      const text =
        provider === "openrouter"
          ? await callOpenRouter(apiKey, model, prompt)
          : await callGemini(apiKey, model, prompt);
      const aiSkills = normalizeAiSkills(extractJsonObject(text));
      this.options.onAiSuccess?.();
      return mergeSkills(aiSkills, dictionarySkills);
    } catch {
      return dictionarySkills;
    }
  }
}
