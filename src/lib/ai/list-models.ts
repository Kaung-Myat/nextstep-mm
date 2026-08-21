import type { AiModelOption, AiProviderId } from "@/lib/ai/providers";
import { AI_MODELS } from "@/lib/ai/providers";

type OpenRouterModel = {
  id?: string;
  name?: string;
  pricing?: { prompt?: string; completion?: string };
  architecture?: {
    modality?: string;
    input_modalities?: string[];
    output_modalities?: string[];
  };
};

type GeminiModel = {
  name?: string;
  displayName?: string;
  description?: string;
  supportedGenerationMethods?: string[];
};

const MAX_OPENROUTER_MODELS = 80;
const NON_CHAT_RE =
  /lyria|whisper|tts|audio|music|image|imagen|vision|video|embedding|embed|moderation|clip|realtime|transcri|speech|diffusion|flux|veo|aura-?2|sonic/i;

function isFreeOpenRouterModel(model: OpenRouterModel) {
  const prompt = Number.parseFloat(model.pricing?.prompt ?? "1");
  const completion = Number.parseFloat(model.pricing?.completion ?? "1");
  return (Number.isFinite(prompt) && prompt === 0 && Number.isFinite(completion) && completion === 0) || model.id?.includes(":free");
}

function isChatOpenRouterModel(model: OpenRouterModel) {
  const id = model.id ?? "";
  const name = model.name ?? "";
  if (NON_CHAT_RE.test(id) || NON_CHAT_RE.test(name)) return false;

  const outputs = model.architecture?.output_modalities ?? [];
  const inputs = model.architecture?.input_modalities ?? [];
  const modality = model.architecture?.modality ?? "";

  // Require text output when modalities are declared.
  if (outputs.length > 0 && !outputs.includes("text")) return false;
  if (outputs.includes("audio") || outputs.includes("image") || outputs.includes("video")) return false;
  if (inputs.length > 0 && !inputs.includes("text")) return false;
  if (modality && !modality.includes("text")) return false;
  return true;
}

export function fallbackModelsForProvider(provider: AiProviderId): AiModelOption[] {
  return AI_MODELS.filter((model) => model.provider === provider);
}

export async function listGeminiModels(apiKey: string): Promise<AiModelOption[]> {
  const response = await fetch(
    "https://generativelanguage.googleapis.com/v1beta/models?pageSize=100",
    {
      method: "GET",
      headers: { "x-goog-api-key": apiKey },
      cache: "no-store",
    },
  );
  const payload = (await response.json()) as { models?: GeminiModel[]; error?: { message?: string } };
  if (!response.ok) {
    throw new Error(payload.error?.message ?? `Gemini model list failed (${response.status})`);
  }

  const models = (payload.models ?? [])
    .filter((model) => model.supportedGenerationMethods?.includes("generateContent"))
    .map((model) => {
      const id = (model.name ?? "").replace(/^models\//, "").trim();
      return {
        provider: "gemini" as const,
        id,
        label: model.displayName?.trim() || id,
      };
    })
    .filter((model) => Boolean(model.id) && !NON_CHAT_RE.test(model.id) && !model.id.includes("embedding"));

  models.sort((a, b) => a.label.localeCompare(b.label));
  return models.length > 0 ? models : fallbackModelsForProvider("gemini");
}

export async function listOpenRouterModels(apiKey: string): Promise<AiModelOption[]> {
  const response = await fetch("https://openrouter.ai/api/v1/models", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "HTTP-Referer": "https://nextstep-mm.app",
      "X-Title": "NextStep MM",
    },
    cache: "no-store",
  });
  const payload = (await response.json()) as { data?: OpenRouterModel[]; error?: { message?: string } };
  if (!response.ok) {
    throw new Error(payload.error?.message ?? `OpenRouter model list failed (${response.status})`);
  }

  const models = (payload.data ?? [])
    .filter((model) => Boolean(model.id) && isChatOpenRouterModel(model))
    .map((model) => ({
      provider: "openrouter" as const,
      id: model.id!.trim(),
      label: model.name?.trim() || model.id!.trim(),
      free: isFreeOpenRouterModel(model),
    }));

  models.sort((a, b) => {
    if (a.free !== b.free) return a.free ? -1 : 1;
    return a.label.localeCompare(b.label);
  });

  const capped = models.slice(0, MAX_OPENROUTER_MODELS).map(({ provider, id, label }) => ({ provider, id, label }));
  return capped.length > 0 ? capped : fallbackModelsForProvider("openrouter");
}

export async function listModelsForProvider(provider: AiProviderId, apiKey: string) {
  if (provider === "gemini") return listGeminiModels(apiKey);
  return listOpenRouterModels(apiKey);
}
