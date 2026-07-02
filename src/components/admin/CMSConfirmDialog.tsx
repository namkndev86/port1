"use client"

import { useEffect, useRef } from "react"

import { AnimatePresence, motion } from "framer-motion"
import { AlertTriangle } from "lucide-react"

interface CMSConfirmDialogProps {
  isOpen: boolean
  title: string
  description: string
  confirmText?: string
  cancelText?: string
  onConfirm: () => void
  onCancel: () => void
  isPending?: boolean
  type?: "danger" | "warning" | "info"
}

export default function CMSConfirmDialog({
  isOpen,
  title,
  description,
  confirmText = "Confirm",
  cancelText = "Cancel",
  onConfirm,
  onCancel,
  isPending = false,
  type = "danger",
}: CMSConfirmDialogProps) {
  const dialogRef = useRef<HTMLDivElement>(null)

  // Listen to Escape key press to close dialog
  useEffect(() => {
    if (!isOpen) return
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onCancel()
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [isOpen, onCancel])

  // Focus trap: Focus first button when open
  useEffect(() => {
    if (isOpen && dialogRef.current) {
      const focusable = dialogRef.current.querySelectorAll("button")
      if (focusable.length > 0) {
        // focus the cancel button first (safer option)
        ;(focusable[0] as HTMLButtonElement).focus()
      }
    }
  }, [isOpen])

  const isDanger = type === "danger"

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onCancel}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Modal Box */}
          <motion.div
            ref={dialogRef}
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ type: "spring", duration: 0.4 }}
            role="dialog"
            aria-modal="true"
            aria-labelledby="confirm-dialog-title"
            aria-describedby="confirm-dialog-desc"
            className="relative w-full max-w-md p-6 rounded-2xl bg-card border border-card-border shadow-2xl flex flex-col gap-4 z-10"
          >
            <div className="flex items-start gap-4">
              <div
                className={`p-3 rounded-xl shrink-0 ${
                  isDanger
                    ? "bg-red-500/10 text-red-400 border border-red-500/20"
                    : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                }`}
              >
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div className="flex-1 flex flex-col gap-1">
                <h3
                  id="confirm-dialog-title"
                  className="text-lg font-bold text-foreground leading-snug font-display"
                >
                  {title}
                </h3>
                <p id="confirm-dialog-desc" className="text-sm text-muted leading-relaxed">
                  {description}
                </p>
              </div>
            </div>

            {/* Buttons Layout */}
            <div className="flex items-center justify-end gap-3 mt-2 border-t border-card-border/40 pt-4">
              <button
                type="button"
                onClick={onCancel}
                disabled={isPending}
                className="px-4 py-2 text-xs font-semibold text-muted hover:text-foreground rounded-xl border border-card-border hover:bg-background/80 disabled:opacity-50 transition-all cursor-pointer"
              >
                {cancelText}
              </button>
              <button
                type="button"
                onClick={onConfirm}
                disabled={isPending}
                className={`px-4 py-2 text-xs font-semibold text-white rounded-xl transition-all cursor-pointer shadow-lg disabled:opacity-50 ${
                  isDanger
                    ? "bg-red-600 hover:bg-red-500 shadow-red-950/20"
                    : "bg-amber-600 hover:bg-amber-500 shadow-amber-950/20"
                }`}
              >
                {isPending ? "Processing..." : confirmText}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
