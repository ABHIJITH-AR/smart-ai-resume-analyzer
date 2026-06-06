import React, { useEffect } from "react";
import { CheckCircle2, AlertTriangle, XCircle, Info } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export interface ToastMessage {
  id: string;
  type: "success" | "warning" | "error" | "info";
  title: string;
  message: string;
}

interface ToastProps {
  toasts: ToastMessage[];
  onClose: (id: string) => void;
}

export default function ToastPopup({ toasts, onClose }: ToastProps) {
  return (
    <div className="fixed top-6 right-6 z-55 flex flex-col gap-3 min-w-[320px] max-w-[420px]">
      <AnimatePresence>
        {toasts.map((toast) => {
          const isSuccess = toast.type === "success";
          const isWarning = toast.type === "warning";
          const isError = toast.type === "error";

          let icon = <Info className="w-5 h-5 text-blue-400" />;
          let borderClass = "border-blue-500/20";
          let bgClass = "bg-slate-900/95";

          if (isSuccess) {
            icon = <CheckCircle2 className="w-5 h-5 text-emerald-400" />;
            borderClass = "border-emerald-500/30";
          } else if (isWarning) {
            icon = <AlertTriangle className="w-5 h-5 text-amber-400" />;
            borderClass = "border-amber-500/30";
          } else if (isError) {
            icon = <XCircle className="w-5 h-5 text-rose-400" />;
            borderClass = "border-rose-500/30";
          }

          return (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.15 } }}
              className={`p-4 rounded-xl border ${borderClass} ${bgClass} backdrop-blur-md shadow-2xl flex gap-3 items-start relative overflow-hidden`}
              id={`toast-${toast.id}`}
            >
              {/* Bottom progress bar */}
              <motion.div
                initial={{ width: "100%" }}
                animate={{ width: "0%" }}
                transition={{ duration: 4.5, ease: "linear" }}
                className={`absolute bottom-0 left-0 h-1 ${
                  isSuccess
                    ? "bg-emerald-500"
                    : isWarning
                    ? "bg-amber-500"
                    : isError
                    ? "bg-rose-500"
                    : "bg-blue-500"
                }`}
              />

              <div className="flex-shrink-0 mt-0.5">{icon}</div>

              <div className="flex-grow">
                <h4 className="font-semibold text-sm text-slate-100">{toast.title}</h4>
                <p className="text-xs text-slate-400 mt-1 whitespace-pre-line leading-relaxed">
                  {toast.message}
                </p>
              </div>

              <button
                onClick={() => onClose(toast.id)}
                className="flex-shrink-0 text-slate-500 hover:text-slate-300 transition-colors p-1 rounded-lg hover:bg-slate-800"
                id={`btn-close-toast-${toast.id}`}
              >
                <XCircle className="w-4 h-4" />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
