/** Light haptic feedback for tab/button presses. No-ops when unsupported (iOS Safari). */
export function hapticLight() {
  if (typeof navigator === "undefined") return;
  try {
    if (typeof navigator.vibrate === "function") navigator.vibrate(8);
  } catch {
    // ignore
  }
}

export function hapticMedium() {
  if (typeof navigator === "undefined") return;
  try {
    if (typeof navigator.vibrate === "function") navigator.vibrate(14);
  } catch {
    // ignore
  }
}

export function hapticSuccess() {
  if (typeof navigator === "undefined") return;
  try {
    if (typeof navigator.vibrate === "function") navigator.vibrate([10, 40, 12]);
  } catch {
    // ignore
  }
}
