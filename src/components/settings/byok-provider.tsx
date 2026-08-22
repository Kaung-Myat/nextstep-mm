"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

import {
  AI_MODELS,
  AI_PROVIDER_META,
  findModel,
  isPlausibleModelId,
  modelsForProviders,
  resolveSelectedModel,
  type AiModelOption,
  type AiProviderId,
  type SelectedAiModel,
} from "@/lib/ai/providers";
import { BYOK_STORAGE, readByokKey, readSavedAdvisorModel, writeByokKey } from "@/lib/byok/storage";

type ByokContextValue = {
  geminiKey: string;
  openrouterKey: string;
  hasGemini: boolean;
  hasOpenrouter: boolean;
  availableProviders: AiProviderId[];
  availableModels: AiModelOption[];
  modelsLoading: boolean;
  modelsError: string;
  selectedModel: SelectedAiModel | null;
  selectedModelLabel: string | null;
  refreshModels: () => void;
  setGeminiKey: (value: string) => void;
  setOpenrouterKey: (value: string) => void;
  clearGeminiKey: () => void;
  clearOpenrouterKey: () => void;
  setSelectedModel: (value: SelectedAiModel) => void;
  getKeyForProvider: (provider: AiProviderId) => string;
};

const ByokContext = createContext<ByokContextValue | null>(null);

function hashKeyFingerprint(apiKey: string) {
  let hash = 0;
  for (let i = 0; i < apiKey.length; i += 1) {
    hash = (hash * 31 + apiKey.charCodeAt(i)) >>> 0;
  }
  return hash.toString(16);
}

function cacheKeyFor(provider: AiProviderId, apiKey: string) {
  return `nextstep-model-cache:${provider}:${hashKeyFingerprint(apiKey)}`;
}

function readCachedModels(provider: AiProviderId, apiKey: string): AiModelOption[] | null {
  try {
    const raw = sessionStorage.getItem(cacheKeyFor(provider, apiKey));
    if (!raw) return null;
    const parsed = JSON.parse(raw) as { at: number; models: AiModelOption[] };
    if (!parsed?.models?.length || Date.now() - parsed.at > 1000 * 60 * 60) return null;
    return parsed.models;
  } catch {
    return null;
  }
}

function writeCachedModels(provider: AiProviderId, apiKey: string, models: AiModelOption[]) {
  try {
    sessionStorage.setItem(cacheKeyFor(provider, apiKey), JSON.stringify({ at: Date.now(), models }));
  } catch {
    // Ignore quota / private mode failures.
  }
}

async function fetchProviderModels(provider: AiProviderId, apiKey: string) {
  const cached = readCachedModels(provider, apiKey);
  if (cached) return cached;

  const response = await fetch("/api/ai/models", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ provider, apiKey }),
  });
  const payload = (await response.json()) as { models?: AiModelOption[]; error?: string; fallback?: boolean };
  if (!payload.models?.length) {
    throw new Error(payload.error ?? "Could not load models.");
  }
  if (!payload.fallback) writeCachedModels(provider, apiKey, payload.models);
  return payload.models;
}

export function ByokProvider({ children }: { children: ReactNode }) {
  // Start empty so SSR and the first client paint match (keys live in localStorage).
  const [geminiKey, setGeminiKeyState] = useState("");
  const [openrouterKey, setOpenrouterKeyState] = useState("");
  const [preferredModel, setPreferredModel] = useState<SelectedAiModel | null>(null);
  const [remoteModels, setRemoteModels] = useState<AiModelOption[]>([]);
  const [modelsLoading, setModelsLoading] = useState(false);
  const [modelsError, setModelsError] = useState("");
  const [refreshToken, setRefreshToken] = useState(0);

  useEffect(() => {
    setGeminiKeyState(readByokKey(BYOK_STORAGE.gemini));
    setOpenrouterKeyState(readByokKey(BYOK_STORAGE.openrouter));
    setPreferredModel(readSavedAdvisorModel());
  }, []);

  const availableProviders = useMemo(() => {
    const providers: AiProviderId[] = [];
    if (openrouterKey) providers.push("openrouter");
    if (geminiKey) providers.push("gemini");
    return providers;
  }, [geminiKey, openrouterKey]);

  const loadRemote = availableProviders.length > 0;

  useEffect(() => {
    let cancelled = false;

    async function loadModels() {
      if (!loadRemote) {
        setRemoteModels([]);
        setModelsLoading(false);
        setModelsError("");
        return;
      }

      setModelsLoading(true);
      setModelsError("");

      try {
        const batches = await Promise.all(
          availableProviders.map(async (provider) => {
            const apiKey = provider === "gemini" ? geminiKey : openrouterKey;
            try {
              return await fetchProviderModels(provider, apiKey);
            } catch (error) {
              if (!cancelled) {
                setModelsError(error instanceof Error ? error.message : "Could not load models.");
              }
              return modelsForProviders([provider], AI_MODELS);
            }
          }),
        );
        if (!cancelled) setRemoteModels(batches.flat());
      } finally {
        if (!cancelled) setModelsLoading(false);
      }
    }

    void loadModels();
    return () => {
      cancelled = true;
    };
  }, [availableProviders, geminiKey, openrouterKey, refreshToken, loadRemote]);

  const availableModels = useMemo(() => {
    if (remoteModels.length > 0) return modelsForProviders(availableProviders, remoteModels);
    return modelsForProviders(availableProviders, AI_MODELS);
  }, [availableProviders, remoteModels]);

  const selectedModel = useMemo(
    () => resolveSelectedModel(availableProviders, preferredModel, availableModels),
    [availableProviders, preferredModel, availableModels],
  );

  const setGeminiKey = useCallback((value: string) => {
    setGeminiKeyState(value.trim());
    writeByokKey(BYOK_STORAGE.gemini, value);
  }, []);

  const setOpenrouterKey = useCallback((value: string) => {
    setOpenrouterKeyState(value.trim());
    writeByokKey(BYOK_STORAGE.openrouter, value);
  }, []);

  const clearGeminiKey = useCallback(() => {
    setGeminiKey("");
  }, [setGeminiKey]);

  const clearOpenrouterKey = useCallback(() => {
    setOpenrouterKey("");
  }, [setOpenrouterKey]);

  const setSelectedModel = useCallback(
    (value: SelectedAiModel) => {
      if (!availableProviders.includes(value.provider) || !isPlausibleModelId(value.modelId)) return;
      if (!findModel(value, availableModels) && remoteModels.length > 0) return;
      setPreferredModel(value);
      localStorage.setItem(BYOK_STORAGE.model, JSON.stringify(value));
    },
    [availableProviders, availableModels, remoteModels.length],
  );

  const getKeyForProvider = useCallback(
    (provider: AiProviderId) => (provider === "gemini" ? geminiKey : openrouterKey),
    [geminiKey, openrouterKey],
  );

  const refreshModels = useCallback(() => {
    for (const provider of availableProviders) {
      const apiKey = getKeyForProvider(provider);
      try {
        sessionStorage.removeItem(cacheKeyFor(provider, apiKey));
      } catch {
        // ignore
      }
    }
    setRefreshToken((value) => value + 1);
  }, [availableProviders, getKeyForProvider]);

  const matched = findModel(selectedModel, availableModels);
  const selectedModelLabel = selectedModel
    ? `${AI_PROVIDER_META[selectedModel.provider].name} · ${matched?.label ?? selectedModel.modelId}`
    : null;

  const value = useMemo<ByokContextValue>(
    () => ({
      geminiKey,
      openrouterKey,
      hasGemini: Boolean(geminiKey),
      hasOpenrouter: Boolean(openrouterKey),
      availableProviders,
      availableModels,
      modelsLoading,
      modelsError,
      selectedModel,
      selectedModelLabel,
      refreshModels,
      setGeminiKey,
      setOpenrouterKey,
      clearGeminiKey,
      clearOpenrouterKey,
      setSelectedModel,
      getKeyForProvider,
    }),
    [
      geminiKey,
      openrouterKey,
      availableProviders,
      availableModels,
      modelsLoading,
      modelsError,
      selectedModel,
      selectedModelLabel,
      refreshModels,
      setGeminiKey,
      setOpenrouterKey,
      clearGeminiKey,
      clearOpenrouterKey,
      setSelectedModel,
      getKeyForProvider,
    ],
  );

  return <ByokContext.Provider value={value}>{children}</ByokContext.Provider>;
}

export function useByok() {
  const value = useContext(ByokContext);
  if (!value) throw new Error("useByok must be used inside ByokProvider.");
  return value;
}
