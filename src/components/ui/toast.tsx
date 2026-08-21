"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import { cn } from "@/lib/utils";

export type ToastTone = "success" | "error" | "info";

export type ToastInput = {
  tone?: ToastTone;
  title: string;
  description?: string;
  durationMs?: number;
};

type ToastItem = ToastInput & {
  id: string;
  tone: ToastTone;
};

type ToastContextValue = {
  showToast: (toast: ToastInput) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const dismiss = useCallback((id: string) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);

  const showToast = useCallback(
    (toast: ToastInput) => {
      const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
      const item: ToastItem = {
        id,
        tone: toast.tone ?? "info",
        title: toast.title,
        description: toast.description,
        durationMs: toast.durationMs ?? 3600,
      };
      setToasts((current) => [...current.slice(-2), item]);
      window.setTimeout(() => dismiss(id), item.durationMs);
    },
    [dismiss],
  );

  const value = useMemo(() => ({ showToast }), [showToast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div
        className="pointer-events-none fixed inset-x-0 z-[80] flex flex-col items-center gap-2 px-3"
        style={{ bottom: "calc(var(--tab-height) + env(safe-area-inset-bottom, 0px) + 0.75rem)" }}
        aria-live="polite"
      >
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={cn(
              "toast-enter pointer-events-auto w-full max-w-md rounded-2xl border px-3.5 py-3 shadow-[0_10px_30px_rgba(12,20,24,0.16)]",
              toast.tone === "success" &&
                "border-[color:var(--color-accent)]/25 bg-[color:var(--color-card)] text-[color:var(--color-text)]",
              toast.tone === "error" && "border-red-200 bg-white text-red-700",
              toast.tone === "info" &&
                "border-[color:var(--color-line)] bg-[color:var(--color-card)] text-[color:var(--color-text)]",
            )}
            role="status"
          >
            <div className="flex items-start gap-2.5">
              <span
                className={cn(
                  "mt-0.5 grid size-5 shrink-0 place-items-center rounded-full text-[11px] font-bold",
                  toast.tone === "success" && "bg-[color:var(--color-accent-soft)] text-[color:var(--color-accent)]",
                  toast.tone === "error" && "bg-red-100 text-red-600",
                  toast.tone === "info" && "bg-[color:var(--color-panel)] text-[color:var(--color-text-muted)]",
                )}
                aria-hidden
              >
                {toast.tone === "success" ? "✓" : toast.tone === "error" ? "!" : "i"}
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-[13px] font-semibold leading-5">{toast.title}</p>
                {toast.description ? (
                  <p className="mt-0.5 text-[12px] leading-4 text-[color:var(--color-text-muted)]">{toast.description}</p>
                ) : null}
              </div>
              <button
                type="button"
                className="pressable -mr-1 rounded-full px-2 py-1 text-[11px] font-semibold text-[color:var(--color-text-soft)]"
                onClick={() => dismiss(toast.id)}
              >
                ✕
              </button>
            </div>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const value = useContext(ToastContext);
  if (!value) throw new Error("useToast must be used inside ToastProvider.");
  return value;
}
