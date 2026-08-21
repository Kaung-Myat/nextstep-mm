"use client";

import { useEffect, useState } from "react";

const KEYBOARD_THRESHOLD_PX = 80;

function isCompactViewport() {
  return window.matchMedia("(max-width: 1023px)").matches;
}

function isTextEntry(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) return false;
  if (target.isContentEditable) return true;
  if (target instanceof HTMLTextAreaElement) return !target.readOnly && !target.disabled;
  if (target instanceof HTMLSelectElement) return !target.disabled;
  if (!(target instanceof HTMLInputElement) || target.readOnly || target.disabled) return false;
  const type = (target.type || "text").toLowerCase();
  return !["button", "submit", "reset", "checkbox", "radio", "file", "image", "range", "color", "hidden"].includes(type);
}

function viewportSuggestsKeyboard() {
  const viewport = window.visualViewport;
  if (!viewport) {
    return window.innerHeight < window.screen.height * 0.7;
  }
  // Prefer visualViewport: works when the layout viewport does not shrink with the keyboard.
  const occludedByViewport = Math.max(0, document.documentElement.clientHeight - viewport.height - viewport.offsetTop);
  const occludedByInner = Math.max(0, window.innerHeight - viewport.height);
  return Math.max(occludedByViewport, occludedByInner) > KEYBOARD_THRESHOLD_PX;
}

/**
 * Hides mobile chrome while the soft keyboard is up.
 * Uses text-field focus (most reliable) plus Visual Viewport as a backup.
 */
export function useVirtualKeyboardOpen() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    let blurTimer = 0;

    const sync = () => {
      if (!isCompactViewport()) {
        setOpen(false);
        return;
      }
      const focused = isTextEntry(document.activeElement);
      setOpen(focused || viewportSuggestsKeyboard());
    };

    const onFocusIn = (event: FocusEvent) => {
      window.clearTimeout(blurTimer);
      if (!isCompactViewport()) return;
      if (isTextEntry(event.target)) setOpen(true);
    };

    const onFocusOut = () => {
      window.clearTimeout(blurTimer);
      blurTimer = window.setTimeout(() => {
        if (!isCompactViewport()) {
          setOpen(false);
          return;
        }
        if (isTextEntry(document.activeElement) || viewportSuggestsKeyboard()) setOpen(true);
        else setOpen(false);
      }, 120);
    };

    sync();
    window.addEventListener("focusin", onFocusIn);
    window.addEventListener("focusout", onFocusOut);
    window.addEventListener("resize", sync);
    window.visualViewport?.addEventListener("resize", sync);
    window.visualViewport?.addEventListener("scroll", sync);

    return () => {
      window.clearTimeout(blurTimer);
      window.removeEventListener("focusin", onFocusIn);
      window.removeEventListener("focusout", onFocusOut);
      window.removeEventListener("resize", sync);
      window.visualViewport?.removeEventListener("resize", sync);
      window.visualViewport?.removeEventListener("scroll", sync);
    };
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    if (open) root.dataset.keyboard = "open";
    else delete root.dataset.keyboard;
    return () => {
      delete root.dataset.keyboard;
    };
  }, [open]);

  return open;
}
