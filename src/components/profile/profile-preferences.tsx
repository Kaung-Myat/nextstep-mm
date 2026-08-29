"use client";

import { useRef } from "react";

import {
  FONT_SCALE_DEFAULT,
  FONT_SCALE_MAX,
  FONT_SCALE_MIN,
  FONT_SCALE_STEP,
  usePreferences,
  type AppLocale,
  type ThemePreference,
} from "@/components/preferences/preferences-provider";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { hapticLight } from "@/lib/haptics";
import { cn } from "@/lib/utils";

export function ProfilePreferences() {
  const { theme, locale, fontScale, setTheme, setLocale, setFontScale, copy } = usePreferences();
  const scaleAnchorRef = useRef<HTMLDivElement>(null);
  const themes: Array<{ value: ThemePreference; label: string }> = [
    { value: "light", label: copy.profile.light },
    { value: "dark", label: copy.profile.dark },
    { value: "system", label: copy.profile.system },
  ];
  const locales: Array<{ value: AppLocale; label: string; detail: string }> = [
    { value: "en", label: copy.profile.english, detail: "English" },
    { value: "my", label: copy.profile.burmese, detail: "မြန်မာစာ" },
  ];
  const scalePercent = Math.round(fontScale * 100);
  const progress = ((fontScale - FONT_SCALE_MIN) / (FONT_SCALE_MAX - FONT_SCALE_MIN)) * 100;

  function updateScale(value: number) {
    setFontScale(value, scaleAnchorRef.current);
  }

  return (
    <div className="page-enter space-y-3">
      <Card className="overflow-hidden p-0">
        <div className="border-b border-[color:var(--color-line)] px-4 py-3.5">
          <CardTitle className="text-[15px]">{copy.profile.appearance}</CardTitle>
          <CardDescription className="mt-0.5">{copy.profile.appearanceDescription}</CardDescription>
        </div>
        <div className="grid grid-cols-3 gap-1 p-2">
          {themes.map((option) => (
            <button
              key={option.value}
              type="button"
              aria-pressed={theme === option.value}
              onClick={() => {
                hapticLight();
                setTheme(option.value);
              }}
              className={cn(
                "pressable min-h-11 rounded-[0.7rem] px-2 text-[12px] font-bold transition-colors",
                theme === option.value
                  ? "bg-[color:var(--color-accent)] text-[color:var(--color-accent-foreground)]"
                  : "bg-[color:var(--color-panel)] text-[color:var(--color-text-muted)]",
              )}
            >
              {option.label}
            </button>
          ))}
        </div>
      </Card>

      <Card className="overflow-hidden p-0">
        <div className="border-b border-[color:var(--color-line)] px-4 py-3.5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <CardTitle className="text-[15px]">{copy.profile.textSize}</CardTitle>
              <CardDescription className="mt-0.5">{copy.profile.textSizeDescription}</CardDescription>
            </div>
            <p className="shrink-0 text-[13px] font-bold tabular-nums text-[color:var(--color-accent)]">
              {fontScale === FONT_SCALE_DEFAULT ? copy.profile.textSizeDefault : `${scalePercent}%`}
            </p>
          </div>
        </div>
        <div ref={scaleAnchorRef} className="space-y-3 px-4 py-4">
          <div className="flex items-center gap-3">
            <span aria-hidden="true" className="text-[12px] font-semibold text-[color:var(--color-text-muted)]">
              A
            </span>
            <label className="relative flex min-h-10 flex-1 items-center">
              <span className="sr-only">{copy.profile.textSize}</span>
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-0 h-2 rounded-full bg-[color:var(--color-panel-strong)]"
              />
              <span
                aria-hidden="true"
                className="pointer-events-none absolute left-0 h-2 rounded-full bg-[color:var(--color-accent)]"
                style={{ width: `${progress}%` }}
              />
              <input
                type="range"
                min={FONT_SCALE_MIN}
                max={FONT_SCALE_MAX}
                step={FONT_SCALE_STEP}
                value={fontScale}
                onPointerDown={(event) => event.currentTarget.focus({ preventScroll: true })}
                onTouchStart={(event) => event.currentTarget.focus({ preventScroll: true })}
                onChange={(event) => updateScale(Number(event.target.value))}
                className="font-scale-range relative z-10 w-full"
              />
            </label>
            <span aria-hidden="true" className="text-[18px] font-semibold text-[color:var(--color-text)]">
              A
            </span>
          </div>
          <div className="flex justify-between text-[11px] font-medium text-[color:var(--color-text-muted)]">
            <span>{Math.round(FONT_SCALE_MIN * 100)}%</span>
            <button
              type="button"
              onClick={() => updateScale(FONT_SCALE_DEFAULT)}
              className="pressable rounded-md px-2 py-0.5 text-[color:var(--color-accent)]"
            >
              {copy.profile.textSizeDefault}
            </button>
            <span>{Math.round(FONT_SCALE_MAX * 100)}%</span>
          </div>
        </div>
      </Card>

      <Card className="overflow-hidden p-0">
        <div className="border-b border-[color:var(--color-line)] px-4 py-3.5">
          <CardTitle className="text-[15px]">{copy.profile.language}</CardTitle>
          <CardDescription className="mt-0.5">{copy.profile.languageDescription}</CardDescription>
        </div>
        <div className="divide-y divide-[color:var(--color-line)]">
          {locales.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => {
                hapticLight();
                setLocale(option.value);
              }}
              className="pressable flex min-h-12 w-full items-center justify-between px-4 text-left"
            >
              <span>
                <span className="block text-[14px] font-semibold">{option.label}</span>
                <span className="block text-[12px] text-[color:var(--color-text-muted)]">{option.detail}</span>
              </span>
              <span
                className={cn(
                  "grid size-5 place-items-center rounded-full border text-[10px]",
                  locale === option.value
                    ? "border-[color:var(--color-accent)] bg-[color:var(--color-accent)] text-[color:var(--color-accent-foreground)]"
                    : "border-[color:var(--color-line-strong)]",
                )}
              >
                {locale === option.value ? "✓" : ""}
              </span>
            </button>
          ))}
        </div>
      </Card>
    </div>
  );
}
