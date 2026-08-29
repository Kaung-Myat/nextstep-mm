"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import {
  clampFontScale,
  FONT_SCALE_MAX,
  FONT_SCALE_MIN,
  FONT_SCALE_STEP,
} from "@/components/preferences/preferences-provider";
import { hapticLight } from "@/lib/haptics";
import { cn } from "@/lib/utils";

type FontScaleSliderProps = {
  value: number;
  label: string;
  onChange: (value: number) => void;
};

function valueFromPointer(clientX: number, track: HTMLElement) {
  const rect = track.getBoundingClientRect();
  if (rect.width <= 0) return FONT_SCALE_MIN;
  const ratio = Math.min(1, Math.max(0, (clientX - rect.left) / rect.width));
  return clampFontScale(FONT_SCALE_MIN + ratio * (FONT_SCALE_MAX - FONT_SCALE_MIN));
}

export function FontScaleSlider({ value, label, onChange }: FontScaleSliderProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const thumbRef = useRef<HTMLButtonElement>(null);
  const [dragging, setDragging] = useState(false);
  const lastValueRef = useRef(value);

  useEffect(() => {
    lastValueRef.current = value;
  }, [value]);

  const progress = ((value - FONT_SCALE_MIN) / (FONT_SCALE_MAX - FONT_SCALE_MIN)) * 100;

  const updateFromPointer = useCallback(
    (clientX: number) => {
      const track = trackRef.current;
      if (!track) return;
      const next = valueFromPointer(clientX, track);
      if (next === lastValueRef.current) return;
      lastValueRef.current = next;
      hapticLight();
      onChange(next);
    },
    [onChange],
  );

  function handleThumbPointerDown(event: React.PointerEvent<HTMLButtonElement>) {
    event.preventDefault();
    event.stopPropagation();
    lastValueRef.current = value;
    setDragging(true);
    event.currentTarget.setPointerCapture(event.pointerId);
  }

  function handleThumbPointerMove(event: React.PointerEvent<HTMLButtonElement>) {
    if (!event.currentTarget.hasPointerCapture(event.pointerId)) return;
    updateFromPointer(event.clientX);
  }

  function handleThumbPointerUp(event: React.PointerEvent<HTMLButtonElement>) {
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    setDragging(false);
  }

  function handleThumbKeyDown(event: React.KeyboardEvent<HTMLButtonElement>) {
    let next = value;
    if (event.key === "ArrowRight" || event.key === "ArrowUp") {
      event.preventDefault();
      next = clampFontScale(value + FONT_SCALE_STEP);
    } else if (event.key === "ArrowLeft" || event.key === "ArrowDown") {
      event.preventDefault();
      next = clampFontScale(value - FONT_SCALE_STEP);
    } else if (event.key === "Home") {
      event.preventDefault();
      next = FONT_SCALE_MIN;
    } else if (event.key === "End") {
      event.preventDefault();
      next = FONT_SCALE_MAX;
    } else {
      return;
    }
    if (next !== value) {
      hapticLight();
      onChange(next);
    }
  }

  return (
    <div ref={trackRef} className="relative flex min-h-11 flex-1 touch-none items-center select-none">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 h-2 rounded-full bg-[color:var(--color-panel-strong)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-0 h-2 rounded-full bg-[color:var(--color-accent)]"
        style={{ width: `${progress}%` }}
      />
      <button
        ref={thumbRef}
        type="button"
        role="slider"
        aria-label={label}
        aria-valuemin={FONT_SCALE_MIN}
        aria-valuemax={FONT_SCALE_MAX}
        aria-valuenow={value}
        aria-valuetext={`${Math.round(value * 100)}%`}
        onPointerDown={handleThumbPointerDown}
        onPointerMove={handleThumbPointerMove}
        onPointerUp={handleThumbPointerUp}
        onPointerCancel={handleThumbPointerUp}
        onKeyDown={handleThumbKeyDown}
        className={cn(
          "absolute top-1/2 z-10 size-[1.35rem] -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-[color:var(--color-surface)] bg-[color:var(--color-accent)] shadow-[var(--shadow-soft)]",
          "before:absolute before:-inset-3 before:content-['']",
          dragging ? "cursor-grabbing" : "cursor-grab",
        )}
        style={{ left: `${progress}%` }}
      />
    </div>
  );
}
