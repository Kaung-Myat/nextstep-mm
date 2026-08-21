"use client";

import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";

import { usePreferences } from "@/components/preferences/preferences-provider";
import { cn } from "@/lib/utils";

export type SheetOption = { value: string; label: string };

export function BottomSheet({
  open,
  title,
  onClose,
  children,
}: {
  open: boolean;
  title: string;
  onClose: () => void;
  children: ReactNode;
}) {
  const { copy } = usePreferences();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    // Lock background scroll; sheet itself is portaled to body so sticky/fixed headers stay visible.
    const previousHtml = document.documentElement.style.overflow;
    const previousBody = document.body.style.overflow;
    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", closeOnEscape);
    return () => {
      document.documentElement.style.overflow = previousHtml;
      document.body.style.overflow = previousBody;
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [open, onClose]);

  if (!open || !mounted) return null;

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-end justify-center" role="dialog" aria-modal="true" aria-label={title}>
      <button type="button" aria-label={copy.common.close} className="absolute inset-0 bg-slate-950/45 backdrop-blur-[2px]" onClick={onClose} />
      <div className="safe-bottom relative z-10 max-h-[85dvh] w-full max-w-xl overflow-y-auto overscroll-contain rounded-t-[2rem] border border-[color:var(--color-line)] bg-[color:var(--color-background-elevated)] px-5 pb-5 pt-3 shadow-[0_-20px_60px_rgba(10,35,45,0.28)] sm:mb-3 sm:rounded-[2rem]">
        <div className="mx-auto mb-4 h-1.5 w-10 rounded-full bg-[color:var(--color-line-strong)]" />
        <h2 className="text-center text-lg font-bold text-[color:var(--color-text)]">{title}</h2>
        {children}
      </div>
    </div>,
    document.body,
  );
}

type OptionSheetFieldProps = {
  label: string;
  value: string;
  options: SheetOption[];
  placeholder: string;
  onChange: (value: string) => void;
  name?: string;
  sheetTitle?: string;
  size?: "default" | "compact";
};

export function OptionSheetField({
  label,
  value,
  options,
  placeholder,
  onChange,
  name,
  sheetTitle,
  size = "default",
}: OptionSheetFieldProps) {
  const [open, setOpen] = useState(false);
  const { copy } = usePreferences();
  const selected = options.find((option) => option.value === value);
  const title = sheetTitle ?? copy.profile.chooseOption;

  return (
    <>
      {name ? <input type="hidden" name={name} value={value} /> : null}
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={cn(
          "flex w-full items-center justify-between gap-4 rounded-2xl border border-[color:var(--color-line-strong)] bg-[color:var(--color-panel)] text-left",
          size === "compact" ? "min-h-12 rounded-xl px-3.5 py-2" : "min-h-16 px-4",
        )}
      >
        <span className="min-w-0">
          <span className="block text-xs font-semibold text-[color:var(--color-text-muted)]">{label}</span>
          <span
            className={cn(
              "mt-0.5 block truncate font-bold text-[color:var(--color-text)]",
              size === "compact" ? "text-[14px]" : "text-sm",
              !selected && "text-[color:var(--color-text-muted)]",
            )}
          >
            {selected?.label ?? placeholder}
          </span>
        </span>
        <svg aria-hidden="true" viewBox="0 0 24 24" className="size-5 shrink-0 fill-none stroke-[color:var(--color-text-muted)] stroke-2">
          <path d="m9 6 6 6-6 6" />
        </svg>
      </button>
      <BottomSheet open={open} title={title} onClose={() => setOpen(false)}>
        <div className="mt-4 max-h-[55vh] space-y-2 overflow-y-auto">
          {options.map((option) => {
            const active = value === option.value;
            return (
              <button
                key={option.value}
                type="button"
                onClick={() => {
                  onChange(option.value);
                  setOpen(false);
                }}
                className={cn(
                  "flex min-h-14 w-full items-center justify-between rounded-2xl px-4 text-left text-sm font-bold",
                  active
                    ? "bg-[color:var(--color-accent-soft)] text-[color:var(--color-accent)]"
                    : "bg-[color:var(--color-panel)] text-[color:var(--color-text)]",
                )}
              >
                <span>{option.label}</span>
                {active ? (
                  <span className="grid size-6 place-items-center rounded-full bg-[color:var(--color-accent)] text-xs text-[color:var(--color-accent-foreground)]">
                    ✓
                  </span>
                ) : null}
              </button>
            );
          })}
        </div>
      </BottomSheet>
    </>
  );
}

function parseDate(value: string) {
  const [year, month, day] = value.split("-").map(Number);
  const now = new Date();
  return { year: year || now.getFullYear(), month: month || now.getMonth() + 1, day: day || now.getDate() };
}

export function IOSDatePickerField({
  name,
  label,
  value,
  onChange,
}: {
  name: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState(() => parseDate(value));
  const { copy, locale } = usePreferences();
  const currentYear = new Date().getFullYear();
  const years = useMemo(() => Array.from({ length: 8 }, (_, index) => currentYear - 1 + index), [currentYear]);
  const months = useMemo(
    () =>
      Array.from({ length: 12 }, (_, index) =>
        new Intl.DateTimeFormat(locale === "my" ? "my-MM" : "en-US", { month: "short" }).format(new Date(2024, index, 1)),
      ),
    [locale],
  );
  const daysInMonth = new Date(draft.year, draft.month, 0).getDate();
  const day = Math.min(draft.day, daysInMonth);
  const formatted = value
    ? new Intl.DateTimeFormat(locale === "my" ? "my-MM" : "en-GB", {
        day: "numeric",
        month: "long",
        year: "numeric",
      }).format(new Date(`${value}T00:00:00`))
    : copy.profile.notSet;

  function chooseDate() {
    onChange(`${draft.year}-${String(draft.month).padStart(2, "0")}-${String(day).padStart(2, "0")}`);
    setOpen(false);
  }

  return (
    <>
      <input type="hidden" name={name} value={value} />
      <button
        type="button"
        onClick={() => {
          setDraft(parseDate(value));
          setOpen(true);
        }}
        className="flex min-h-16 w-full items-center justify-between gap-4 rounded-2xl border border-[color:var(--color-line-strong)] bg-[color:var(--color-panel)] px-4 text-left"
      >
        <span>
          <span className="block text-xs font-semibold text-[color:var(--color-text-muted)]">{label}</span>
          <span className="mt-1 block text-sm font-bold">{formatted}</span>
        </span>
        <svg aria-hidden="true" viewBox="0 0 24 24" className="size-5 fill-none stroke-[color:var(--color-text-muted)] stroke-[1.8]">
          <rect x="3" y="5" width="18" height="16" rx="2" />
          <path d="M7 3v4m10-4v4M3 10h18" />
        </svg>
      </button>
      <BottomSheet open={open} title={copy.profile.chooseDate} onClose={() => setOpen(false)}>
        <div className="relative mt-5 grid h-56 grid-cols-[0.8fr_1.3fr_1fr] gap-2 overflow-hidden">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 top-1/2 h-11 -translate-y-1/2 rounded-xl border-y border-[color:var(--color-line)] bg-[color:var(--color-accent-soft)]"
          />
          <Wheel
            values={Array.from({ length: daysInMonth }, (_, index) => index + 1)}
            selected={day}
            onSelect={(selected) => setDraft((current) => ({ ...current, day: selected }))}
          />
          <Wheel
            values={months.map((month, index) => ({ value: index + 1, label: month }))}
            selected={draft.month}
            onSelect={(selected) => setDraft((current) => ({ ...current, month: selected }))}
          />
          <Wheel
            values={years}
            selected={draft.year}
            onSelect={(selected) => setDraft((current) => ({ ...current, year: selected }))}
          />
        </div>
        <div className="mt-4 grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="min-h-12 rounded-full bg-[color:var(--color-panel-strong)] text-sm font-bold"
          >
            {copy.profile.cancel}
          </button>
          <button
            type="button"
            onClick={chooseDate}
            className="min-h-12 rounded-full bg-[color:var(--color-accent)] text-sm font-bold text-[color:var(--color-accent-foreground)]"
          >
            {copy.profile.done}
          </button>
        </div>
      </BottomSheet>
    </>
  );
}

const WHEEL_ITEM = "2.75rem"; // h-11
const WHEEL_PAD = `calc((100% - ${WHEEL_ITEM}) / 2)`;

function Wheel({
  values,
  selected,
  onSelect,
}: {
  values: Array<number | { value: number; label: string }>;
  selected: number;
  onSelect: (value: number) => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const programmaticRef = useRef(false);
  const selectedRef = useRef(selected);
  const frameRef = useRef<number | null>(null);
  selectedRef.current = selected;

  const valueList = values.map((entry) => (typeof entry === "number" ? entry : entry.value));
  const valueKey = valueList.join(",");

  function centeredIndex() {
    const el = containerRef.current;
    if (!el) return 0;
    const mid = el.getBoundingClientRect().top + el.clientHeight / 2;
    let best = 0;
    let bestDist = Number.POSITIVE_INFINITY;
    for (let index = 0; index < valueList.length; index += 1) {
      const node = itemRefs.current[index];
      if (!node) continue;
      const rect = node.getBoundingClientRect();
      const dist = Math.abs(rect.top + rect.height / 2 - mid);
      if (dist < bestDist) {
        bestDist = dist;
        best = index;
      }
    }
    return best;
  }

  function scrollToIndex(index: number, behavior: ScrollBehavior = "auto") {
    const el = containerRef.current;
    const item = itemRefs.current[index];
    if (!el || !item) return;
    programmaticRef.current = true;
    const top = item.offsetTop - (el.clientHeight - item.offsetHeight) / 2;
    el.scrollTo({ top: Math.max(0, top), behavior });
    window.setTimeout(() => {
      programmaticRef.current = false;
    }, behavior === "smooth" ? 220 : 50);
  }

  // Align wheel when selection changes from outside (open / month-year clamp).
  useEffect(() => {
    const index = valueList.indexOf(selected);
    if (index < 0) return;
    // Defer until spacers/layout are measured.
    const raf = requestAnimationFrame(() => {
      if (centeredIndex() === index) return;
      scrollToIndex(index);
    });
    return () => cancelAnimationFrame(raf);
    // valueList is derived from valueKey each render
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected, valueKey]);

  useEffect(
    () => () => {
      if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
    },
    [],
  );

  function syncFromScroll() {
    if (programmaticRef.current) return;
    if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
    frameRef.current = requestAnimationFrame(() => {
      frameRef.current = null;
      if (programmaticRef.current) return;
      const next = valueList[centeredIndex()];
      if (next !== undefined && next !== selectedRef.current) onSelect(next);
    });
  }

  return (
    <div
      ref={containerRef}
      onScroll={syncFromScroll}
      className="no-scrollbar z-10 h-full snap-y snap-mandatory overflow-y-auto overscroll-contain"
      style={{ scrollPaddingBlock: WHEEL_PAD }}
    >
      <div aria-hidden="true" className="shrink-0" style={{ height: WHEEL_PAD }} />
      {values.map((entry, index) => {
        const value = typeof entry === "number" ? entry : entry.value;
        const label = typeof entry === "number" ? String(entry) : entry.label;
        return (
          <button
            key={value}
            ref={(node) => {
              itemRefs.current[index] = node;
            }}
            type="button"
            onClick={() => {
              scrollToIndex(index, "smooth");
              onSelect(value);
            }}
            className={cn(
              "flex h-11 w-full shrink-0 snap-center items-center justify-center rounded-xl text-sm transition-colors",
              selected === value ? "font-bold text-[color:var(--color-text)]" : "text-[color:var(--color-text-muted)]",
            )}
          >
            {label}
          </button>
        );
      })}
      <div aria-hidden="true" className="shrink-0" style={{ height: WHEEL_PAD }} />
    </div>
  );
}
