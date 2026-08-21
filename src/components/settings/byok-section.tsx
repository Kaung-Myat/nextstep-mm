"use client";

import { useState } from "react";

import { useByok } from "@/components/settings/byok-provider";
import { usePreferences } from "@/components/preferences/preferences-provider";
import { OptionSheetField } from "@/components/profile/native-pickers";
import { AI_PROVIDER_META, type AiProviderId } from "@/lib/ai/providers";
import { useToast } from "@/components/ui/toast";
import { cn } from "@/lib/utils";

const PROVIDERS: AiProviderId[] = ["gemini", "openrouter"];

function maskKey(value: string) {
  if (!value) return "";
  if (value.length <= 8) return "••••••••";
  return `${value.slice(0, 4)}••••${value.slice(-4)}`;
}

export function ByokSection() {
  const { copy } = usePreferences();
  const { showToast } = useToast();
  const {
    geminiKey,
    openrouterKey,
    setGeminiKey,
    setOpenrouterKey,
    clearGeminiKey,
    clearOpenrouterKey,
  } = useByok();

  const [provider, setProvider] = useState<AiProviderId>("gemini");
  const [draft, setDraft] = useState("");
  const [showKey, setShowKey] = useState(false);

  const savedKey = provider === "gemini" ? geminiKey : openrouterKey;
  const meta = AI_PROVIDER_META[provider];
  const connected = Boolean(savedKey);

  function selectProvider(next: AiProviderId) {
    setProvider(next);
    setDraft("");
    setShowKey(false);
  }

  function save() {
    const value = draft.trim();
    if (!value) return;
    if (provider === "gemini") setGeminiKey(value);
    else setOpenrouterKey(value);
    setDraft("");
    setShowKey(false);
    showToast({
      tone: "success",
      title: copy.settings.toastKeySaved,
      description: AI_PROVIDER_META[provider].name,
    });
  }

  function remove() {
    if (provider === "gemini") clearGeminiKey();
    else clearOpenrouterKey();
    setDraft("");
    showToast({
      tone: "info",
      title: copy.settings.toastKeyRemoved,
      description: AI_PROVIDER_META[provider].name,
    });
  }

  return (
    <section className="space-y-3">
      <div className="px-0.5">
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[color:var(--color-accent)]">
          {copy.settings.byokEyebrow}
        </p>
        <h2 className="mt-1 text-[17px] font-bold text-[color:var(--color-text)]">{copy.settings.byokTitle}</h2>
        <p className="mt-1 text-[13px] leading-5 text-[color:var(--color-text-muted)]">{copy.settings.byokDescription}</p>
      </div>

      <div className="overflow-hidden rounded-2xl border border-[color:var(--color-line)] bg-[color:var(--color-card)]">
        <div className="space-y-4 p-4">
          <OptionSheetField
            label={copy.settings.providerLabel}
            value={provider}
            placeholder={copy.settings.providerLabel}
            sheetTitle={copy.settings.providerLabel}
            size="compact"
            onChange={(value) => selectProvider(value as AiProviderId)}
            options={PROVIDERS.map((id) => ({
              value: id,
              label: AI_PROVIDER_META[id].name,
            }))}
          />

          <div className="flex items-center justify-between gap-3">
            <p className="text-[12px] font-semibold text-[color:var(--color-text-soft)]">{meta.keyLabel}</p>
            <span
              className={cn(
                "rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.08em]",
                connected
                  ? "bg-[color:var(--color-accent-soft)] text-[color:var(--color-accent)]"
                  : "bg-[color:var(--color-panel)] text-[color:var(--color-text-muted)]",
              )}
            >
              {connected ? copy.settings.connected : copy.settings.notConnected}
            </span>
          </div>

          {connected ? (
            <p className="rounded-xl bg-[color:var(--color-panel)] px-3 py-2.5 font-mono text-[12px] text-[color:var(--color-text-soft)]">
              {maskKey(savedKey)}
            </p>
          ) : null}

          <label className="block">
            <span className="mb-1.5 block text-[12px] font-semibold text-[color:var(--color-text-muted)]">
              {connected ? copy.settings.replaceKey : copy.settings.apiKeyLabel}
            </span>
            <div className="relative">
              <input
                type={showKey ? "text" : "password"}
                autoComplete="off"
                spellCheck={false}
                value={draft}
                onChange={(event) => setDraft(event.target.value)}
                placeholder={copy.settings.keyPlaceholder}
                className="min-h-12 w-full rounded-xl border border-[color:var(--color-line)] bg-[color:var(--color-panel)] px-3.5 pr-12 text-[14px] text-[color:var(--color-text)] outline-none focus:border-[color:var(--color-accent)]"
              />
              <button
                type="button"
                onClick={() => setShowKey((value) => !value)}
                className="pressable absolute right-2 top-1/2 -translate-y-1/2 rounded-lg px-2 py-1 text-[11px] font-semibold text-[color:var(--color-text-muted)]"
              >
                {showKey ? copy.settings.hideKey : copy.settings.showKey}
              </button>
            </div>
          </label>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={save}
              disabled={!draft.trim()}
              className="pressable min-h-11 flex-1 rounded-xl bg-[color:var(--color-accent)] text-[13px] font-semibold text-[color:var(--color-accent-foreground)] disabled:opacity-45"
            >
              {copy.settings.saveKey}
            </button>
            {connected ? (
              <button
                type="button"
                onClick={remove}
                className="pressable min-h-11 flex-1 rounded-xl border border-[color:var(--color-line-strong)] text-[13px] font-semibold text-[color:var(--color-text-muted)]"
              >
                {copy.settings.removeKey}
              </button>
            ) : null}
          </div>

          <a
            href={meta.docsUrl}
            target="_blank"
            rel="noreferrer"
            className="block text-[12px] font-semibold text-[color:var(--color-accent)]"
          >
            {copy.settings.getApiKey} ↗
          </a>
        </div>

        <div className="border-t border-[color:var(--color-line)] bg-[color:var(--color-panel)] px-4 py-3">
          <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[color:var(--color-text-muted)]">
            {copy.settings.savedProviders}
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            {PROVIDERS.map((id) => {
              const hasKey = id === "gemini" ? Boolean(geminiKey) : Boolean(openrouterKey);
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => selectProvider(id)}
                  className={cn(
                    "rounded-full px-3 py-1.5 text-[11px] font-semibold",
                    provider === id
                      ? "bg-[color:var(--color-accent)] text-[color:var(--color-accent-foreground)]"
                      : hasKey
                        ? "bg-[color:var(--color-accent-soft)] text-[color:var(--color-accent)]"
                        : "bg-[color:var(--color-card)] text-[color:var(--color-text-muted)]",
                  )}
                >
                  {AI_PROVIDER_META[id].name}
                  {hasKey ? " ✓" : ""}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
