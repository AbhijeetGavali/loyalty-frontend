"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import { CheckCircle2, XCircle, AlertTriangle, Info, X } from "lucide-react";

type ToastType = "success" | "error" | "warning" | "info";

interface Toast {
  id: string;
  type: ToastType;
  message: string;
}

interface ToastCtx {
  toast: (type: ToastType, message: string) => void;
  success: (message: string) => void;
  error: (message: string) => void;
  warning: (message: string) => void;
  info: (message: string) => void;
}

const ToastContext = createContext<ToastCtx>({
  toast: () => {},
  success: () => {},
  error: () => {},
  warning: () => {},
  info: () => {},
});

export const useToast = () => useContext(ToastContext);

const ICONS: Record<ToastType, React.ReactNode> = {
  success: <CheckCircle2 className="size-4 text-emerald-400 shrink-0" />,
  error: <XCircle className="size-4 text-rose-400 shrink-0" />,
  warning: <AlertTriangle className="size-4 text-amber-400 shrink-0" />,
  info: <Info className="size-4 text-sky-400 shrink-0" />,
};

const STYLES: Record<ToastType, string> = {
  success: "border-emerald-500/20 bg-emerald-500/5",
  error: "border-rose-500/20 bg-rose-500/5",
  warning: "border-amber-500/20 bg-amber-500/5",
  info: "border-sky-500/20 bg-sky-500/5",
};

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const remove = useCallback((id: string) => {
    setToasts((t) => t.filter((x) => x.id !== id));
  }, []);

  const toast = useCallback((type: ToastType, message: string) => {
    const id = Math.random().toString(36).slice(2);
    setToasts((t) => [...t, { id, type, message }]);
    setTimeout(() => remove(id), 4000);
  }, [remove]);

  const success = useCallback((m: string) => toast("success", m), [toast]);
  const error = useCallback((m: string) => toast("error", m), [toast]);
  const warning = useCallback((m: string) => toast("warning", m), [toast]);
  const info = useCallback((m: string) => toast("info", m), [toast]);

  return (
    <ToastContext.Provider value={{ toast, success, error, warning, info }}>
      {children}
      <div className="fixed bottom-4 right-4 z-[9999] flex flex-col gap-2 max-w-sm w-full pointer-events-none">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`flex items-start gap-3 px-4 py-3 rounded-xl border bg-[#14100E] shadow-lg pointer-events-auto animate-in slide-in-from-bottom-2 duration-200 ${STYLES[t.type]}`}
          >
            {ICONS[t.type]}
            <p className="text-xs text-stone-200 flex-1 leading-relaxed">{t.message}</p>
            <button onClick={() => remove(t.id)} className="text-stone-600 hover:text-stone-400 shrink-0">
              <X className="size-3.5" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
