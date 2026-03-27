"use client";

import { useState, useEffect, useCallback } from "react";

interface ToastMessage {
  id: string;
  text: string;
  type: "success" | "warning" | "info";
}

let toastSubscribers: Array<(msg: ToastMessage) => void> = [];

export function showToast(text: string, type: ToastMessage["type"] = "info") {
  const msg: ToastMessage = {
    id: `toast_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
    text,
    type,
  };
  for (const sub of toastSubscribers) {
    sub(msg);
  }
}

const typeStyles: Record<ToastMessage["type"], string> = {
  success: "border-habbo-green/60 bg-habbo-green/10 text-habbo-green",
  warning: "border-habbo-gold/60 bg-habbo-gold/10 text-habbo-gold",
  info: "border-habbo-cyan/60 bg-habbo-cyan/10 text-habbo-cyan",
};

const AUTO_DISMISS_MS = 5000;

export function ToastContainer() {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = useCallback((msg: ToastMessage) => {
    setToasts((prev) => [...prev, msg]);
  }, []);

  useEffect(() => {
    toastSubscribers.push(addToast);
    return () => {
      toastSubscribers = toastSubscribers.filter((s) => s !== addToast);
    };
  }, [addToast]);

  useEffect(() => {
    if (toasts.length === 0) return;
    const timer = setTimeout(() => {
      setToasts((prev) => prev.slice(1));
    }, AUTO_DISMISS_MS);
    return () => clearTimeout(timer);
  }, [toasts]);

  function dismiss(id: string) {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-100 flex flex-col gap-2 max-w-sm">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`flex items-center gap-3 px-4 py-3 rounded-lg border backdrop-blur-sm shadow-lg animate-slide-up ${typeStyles[toast.type]}`}
        >
          <span className="text-sm flex-1">{toast.text}</span>
          <button
            onClick={() => dismiss(toast.id)}
            className="text-xs opacity-60 hover:opacity-100 transition-opacity"
          >
            ×
          </button>
        </div>
      ))}
    </div>
  );
}
