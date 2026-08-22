import type { SelectedAiModel } from "@/lib/ai/providers";

export const BYOK_STORAGE = {
  gemini: "nextstep-byok-gemini",
  openrouter: "nextstep-byok-openrouter",
  model: "nextstep-advisor-model",
} as const;

export function readByokKey(storageKey: string) {
  if (typeof window === "undefined") return "";
  try {
    return localStorage.getItem(storageKey)?.trim() ?? "";
  } catch {
    return "";
  }
}

export function writeByokKey(storageKey: string, value: string) {
  const trimmed = value.trim();
  if (!trimmed) localStorage.removeItem(storageKey);
  else localStorage.setItem(storageKey, trimmed);
}

export function readSavedAdvisorModel(): SelectedAiModel | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(BYOK_STORAGE.model);
    return raw ? (JSON.parse(raw) as SelectedAiModel) : null;
  } catch {
    return null;
  }
}
