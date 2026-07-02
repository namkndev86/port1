"use client"

import { AnimatePresence, motion } from "framer-motion"
import { AlertCircle, CheckCircle2, Info, X } from "lucide-react"

export interface ToastMessage {
  id: string
  text: string
  type: "success" | "error" | "info"
}

interface ToastProps {
  toasts: ToastMessage[]
  onClose: (id: string) => void
}

export default function Toast({ toasts, onClose }: ToastProps) {
  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 max-w-sm w-full pointer-events-none">
      <AnimatePresence>
        {toasts.map((toast) => {
          const isSuccess = toast.type === "success"
          const isError = toast.type === "error"

          return (
            <motion.div
              key={toast.id}
              layout
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
              className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl border shadow-xl bg-card backdrop-blur-xl ${
                isSuccess
                  ? "border-emerald-500/20 text-emerald-200"
                  : isError
                  ? "border-red-500/20 text-red-200"
                  : "border-primary/20 text-blue-200"
              }`}
            >
              <span className="shrink-0 mt-0.5">
                {isSuccess ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                ) : isError ? (
                  <AlertCircle className="w-5 h-5 text-red-400" />
                ) : (
                  <Info className="w-5 h-5 text-primary" />
                )}
              </span>
              <div className="flex-1 text-sm font-medium leading-snug">
                {toast.text}
              </div>
              <button
                onClick={() => onClose(toast.id)}
                className="shrink-0 p-0.5 rounded-lg text-muted hover:text-foreground hover:bg-background/80 transition-colors cursor-pointer"
                aria-label="Close notification"
              >
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          )
        })}
      </AnimatePresence>
    </div>
  )
}
