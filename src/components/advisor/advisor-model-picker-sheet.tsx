"use client";

import { useEffect, useState } from "react";

import { useAdvisorChrome } from "@/components/advisor/advisor-chrome-context";
import { usePreferences } from "@/components/preferences/preferences-provider";
import { BottomSheet } from "@/components/profile/native-pickers";
import { useByok } from "@/components/settings/byok-provider";
import { AI_PROVIDER_META } from "@/lib/ai/providers";
import { cn } from "@/lib/utils";

/** Renders outside the sticky header so the sheet portal never collapses the app bar. */
export function AdvisorModelPickerSheet() {
  const { copy } = usePreferences();
  const { modelPickerOpen, closeModelPicker } = useAdvisorChrome();
  const {
    availableModels,
    availableProviders,
    modelsLoading,
    modelsError,
    refreshModels,
    selectedModel,
    setSelectedModel,
  } = useByok();
  const [modelQuery, setModelQuery] = useState("");
  const ready = availableProviders.length > 0 && Boolean(selectedModel);

  useEffect(() => {
    if (!modelPickerOpen) setModelQuery("");
  }, [modelPickerOpen]);

  const filteredModels = availableModels.filter((model) => {
    const q = modelQuery.trim().toLowerCase();
    if (!q) return true;
    return model.label.toLowerCase().includes(q) || model.id.toLowerCase().includes(q) || model.provider.includes(q);
  });

  return (
    <BottomSheet open={modelPickerOpen && ready} title={copy.settings.selectModel} onClose={closeModelPicker}>
      <div className="mt-4 space-y-3">
        <div className="flex items-center gap-2">
          <input
            type="search"
            value={modelQuery}
            onChange={(event) => setModelQuery(event.target.value)}
            placeholder={copy.settings.searchModels}
            className="min-h-11 flex-1 rounded-2xl border border-[color:var(--color-line)] bg-[color:var(--color-panel)] px-3.5 text-sm outline-none focus:border-[color:var(--color-accent)]"
          />
          <button
            type="button"
            onClick={refreshModels}
            disabled={modelsLoading}
            className="pressable min-h-11 shrink-0 rounded-2xl bg-[color:var(--color-panel-strong)] px-3 text-[12px] font-semibold disabled:opacity-60"
          >
            {copy.settings.refreshModels}
          </button>
        </div>
        {modelsLoading ? <p className="text-[12px] text-[color:var(--color-text-muted)]">{copy.settings.modelsLoading}</p> : null}
        {modelsError ? <p className="text-[12px] text-[color:var(--color-warm)]">{copy.settings.modelsError}</p> : null}
        <div className="max-h-[50vh] space-y-2 overflow-y-auto overscroll-contain">
          {filteredModels.length === 0 ? (
            <p className="rounded-2xl bg-[color:var(--color-panel)] px-4 py-6 text-center text-[13px] text-[color:var(--color-text-muted)]">
              {copy.settings.noModels}
            </p>
          ) : (
            filteredModels.map((model) => {
              const active = selectedModel?.provider === model.provider && selectedModel.modelId === model.id;
              return (
                <button
                  key={`${model.provider}:${model.id}`}
                  type="button"
                  onClick={() => {
                    setSelectedModel({ provider: model.provider, modelId: model.id });
                    closeModelPicker();
                  }}
                  className={cn(
                    "flex min-h-14 w-full items-center justify-between rounded-2xl px-4 text-left",
                    active
                      ? "bg-[color:var(--color-accent-soft)] text-[color:var(--color-accent)]"
                      : "bg-[color:var(--color-panel)] text-[color:var(--color-text)]",
                  )}
                >
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-bold">{model.label}</span>
                    <span className="mt-0.5 block truncate text-[11px] font-medium text-[color:var(--color-text-muted)]">
                      {AI_PROVIDER_META[model.provider].name} · {model.id}
                    </span>
                  </span>
                  {active ? <span className="ml-3 text-sm">✓</span> : null}
                </button>
              );
            })
          )}
        </div>
      </div>
    </BottomSheet>
  );
}
