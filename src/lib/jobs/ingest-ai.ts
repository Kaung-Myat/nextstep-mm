import type { AiProviderId } from "@/lib/ai/providers";
import { AiSkillExtractor } from "@/lib/jobs/ai-skill-extractor";
import { DictionarySkillExtractor, type SkillExtractor } from "@/lib/jobs/skill-extractor";

export const DEFAULT_INGEST_AI_PROVIDER: AiProviderId = "openrouter";
export const DEFAULT_INGEST_AI_MODEL = "openrouter/free";

export type IngestAiOptions = {
  provider?: AiProviderId;
  model?: string;
  apiKey?: string;
  enabled?: boolean;
};

export function resolveIngestAiOptions(overrides: IngestAiOptions = {}): Required<
  Pick<IngestAiOptions, "provider" | "model" | "enabled">
> & { apiKey?: string } {
  const provider =
    overrides.provider ??
    (process.env.INGEST_AI_PROVIDER as AiProviderId | undefined) ??
    DEFAULT_INGEST_AI_PROVIDER;

  const model =
    overrides.model?.trim() ||
    process.env.INGEST_AI_MODEL?.trim() ||
    (provider === "openrouter" ? DEFAULT_INGEST_AI_MODEL : "gemini-2.0-flash");

  const apiKey =
    overrides.apiKey?.trim() ||
    process.env.INGEST_AI_API_KEY?.trim() ||
    (provider === "openrouter"
      ? process.env.OPENROUTER_API_KEY?.trim()
      : process.env.GEMINI_API_KEY?.trim());

  const enabled = overrides.enabled ?? process.env.INGEST_AI_ENABLED !== "false";

  return { provider, model, apiKey, enabled };
}

export function createIngestSkillExtractor(overrides: IngestAiOptions = {}): SkillExtractor {
  const resolved = resolveIngestAiOptions(overrides);
  if (!resolved.enabled || !resolved.apiKey) {
    return new DictionarySkillExtractor();
  }

  return new AiSkillExtractor({
    provider: resolved.provider,
    model: resolved.model,
    apiKey: resolved.apiKey,
    enabled: true,
  });
}
