export type AiProviderId = "gemini" | "openrouter";

export type AiModelOption = {
  id: string;
  label: string;
  provider: AiProviderId;
};

export const AI_PROVIDER_META: Record<
  AiProviderId,
  { id: AiProviderId; name: string; keyLabel: string; docsUrl: string }
> = {
  gemini: {
    id: "gemini",
    name: "Google Gemini",
    keyLabel: "Gemini API key",
    docsUrl: "https://aistudio.google.com/apikey",
  },
  openrouter: {
    id: "openrouter",
    name: "OpenRouter",
    keyLabel: "OpenRouter API key",
    docsUrl: "https://openrouter.ai/keys",
  },
};

/** Static fallbacks used while remote catalogs load or if listing fails. OpenRouter first (default). */
export const AI_MODELS: readonly AiModelOption[] = [
  { provider: "openrouter", id: "openrouter/free", label: "OpenRouter Free" },
  { provider: "openrouter", id: "google/gemini-2.0-flash-001", label: "Gemini 2.0 Flash (via OpenRouter)" },
  { provider: "openrouter", id: "openai/gpt-4o-mini", label: "GPT-4o Mini" },
  { provider: "openrouter", id: "anthropic/claude-3.5-sonnet", label: "Claude 3.5 Sonnet" },
  { provider: "openrouter", id: "meta-llama/llama-3.3-70b-instruct", label: "Llama 3.3 70B" },
  { provider: "gemini", id: "gemini-2.0-flash", label: "Gemini 2.0 Flash" },
  { provider: "gemini", id: "gemini-2.5-flash", label: "Gemini 2.5 Flash" },
  { provider: "gemini", id: "gemini-2.5-pro", label: "Gemini 2.5 Pro" },
] as const;

export type SelectedAiModel = {
  provider: AiProviderId;
  modelId: string;
};

export const DEFAULT_ADVISOR_MODEL: SelectedAiModel = {
  provider: "openrouter",
  modelId: "openrouter/free",
};

export function isAiProviderId(value: unknown): value is AiProviderId {
  return value === "gemini" || value === "openrouter";
}

export function isPlausibleModelId(modelId: string) {
  return /^[\w./:-]{2,200}$/.test(modelId.trim());
}

export function modelsForProviders(providers: AiProviderId[], catalog: readonly AiModelOption[] = AI_MODELS) {
  return catalog.filter((model) => providers.includes(model.provider));
}

export function findModel(selection: SelectedAiModel | null, catalog: readonly AiModelOption[] = AI_MODELS) {
  if (!selection) return null;
  return catalog.find((model) => model.provider === selection.provider && model.id === selection.modelId) ?? null;
}

export function defaultModelForProviders(
  providers: AiProviderId[],
  catalog: readonly AiModelOption[] = AI_MODELS,
): SelectedAiModel | null {
  const available = modelsForProviders(providers, catalog);
  const openrouterDefault = available.find((model) => model.provider === "openrouter");
  if (openrouterDefault) {
    return { provider: openrouterDefault.provider, modelId: openrouterDefault.id };
  }
  const first = available[0];
  return first ? { provider: first.provider, modelId: first.id } : null;
}

export function resolveSelectedModel(
  providers: AiProviderId[],
  preferred: SelectedAiModel | null,
  catalog: readonly AiModelOption[],
): SelectedAiModel | null {
  if (!preferred || !providers.includes(preferred.provider) || !isPlausibleModelId(preferred.modelId)) {
    return defaultModelForProviders(providers, catalog);
  }
  if (findModel(preferred, catalog)) return preferred;

  const providerModels = catalog.filter((model) => model.provider === preferred.provider);
  // Catalog for this provider has not loaded yet — keep the saved choice.
  if (providerModels.length === 0) return preferred;

  return defaultModelForProviders(providers, catalog);
}
