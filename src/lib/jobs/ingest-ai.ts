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

export type ResolveIngestAiOptionsConfig = {
  /** When false, only the caller-supplied apiKey is used (public crawl API). */
  allowEnvApiKey?: boolean;
};

export function resolveIngestAiOptions(
  overrides: IngestAiOptions = {},
  config: ResolveIngestAiOptionsConfig = {},
): Required<Pick<IngestAiOptions, "provider" | "model" | "enabled">> & { apiKey?: string } {
  const allowEnvApiKey = config.allowEnvApiKey !== false;

  const provider =
    overrides.provider ??
    (process.env.INGEST_AI_PROVIDER as AiProviderId | undefined) ??
    DEFAULT_INGEST_AI_PROVIDER;

  const model =
    overrides.model?.trim() ||
    process.env.INGEST_AI_MODEL?.trim() ||
    (provider === "openrouter" ? DEFAULT_INGEST_AI_MODEL : "gemini-2.0-flash");

  const clientKey = overrides.apiKey?.trim();
  const envKey = allowEnvApiKey
    ? process.env.INGEST_AI_API_KEY?.trim() ||
      (provider === "openrouter"
        ? process.env.OPENROUTER_API_KEY?.trim()
        : process.env.GEMINI_API_KEY?.trim())
    : undefined;

  const apiKey = clientKey || envKey;

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
