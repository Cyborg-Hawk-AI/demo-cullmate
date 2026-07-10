"use client";

import { createContext, useContext, useState, useCallback, ReactNode } from "react";

type Toast = {
  id: string;
  message: string;
  type: "success" | "info" | "warning";
};

type ToastContextType = {
  showToast: (message: string, type?: Toast["type"]) => void;
};

const ToastContext = createContext<ToastContextType | null>(null);

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((message: string, type: Toast["type"] = "success") => {
    const id = Math.random().toString(36).slice(2);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  }, []);

  const colors = {
    success: "border-emerald-500/40 bg-emerald-500/10 text-emerald-300",
    info: "border-blue-500/40 bg-blue-500/10 text-blue-300",
    warning: "border-amber-500/40 bg-amber-500/10 text-amber-300",
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-2">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`animate-slide-up rounded-lg border px-4 py-3 text-sm shadow-lg ${colors[toast.type]}`}
          >
            {toast.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
