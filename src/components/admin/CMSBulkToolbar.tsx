"use client"

import { AnimatePresence, motion } from "framer-motion"
import { Check, FileDown,Globe, ShieldAlert, Trash2, X } from "lucide-react"

interface CMSBulkToolbarProps {
  type: "projects" | "blog" | "skills" | "experience" | "messages"
  selectedCount: number
  onClear: () => void
  onBulkAction: (action: string) => Promise<void>
  isPending?: boolean
}

export default function CMSBulkToolbar({
  type,
  selectedCount,
  onClear,
  onBulkAction,
  isPending = false,
}: CMSBulkToolbarProps) {
  
  // Custom action buttons based on resource type
  const actions = (() => {
    if (type === "blog") {
      return [
        { label: "Publish", value: "publish", icon: Globe, style: "bg-emerald-600 hover:bg-emerald-500 shadow-emerald-950/20 text-white" },
        { label: "Draft", value: "draft", icon: FileDown, style: "bg-amber-600 hover:bg-amber-500 shadow-amber-950/20 text-white" },
        { label: "Archive", value: "archive", icon: ShieldAlert, style: "bg-rose-600 hover:bg-rose-500 shadow-rose-950/20 text-white" },
      ]
    }
    if (type === "projects" || type === "skills") {
      return [
        { label: "Activate", value: "activate", icon: Check, style: "bg-emerald-600 hover:bg-emerald-500 shadow-emerald-950/20 text-white" },
        { label: "Deactivate", value: "deactivate", icon: X, style: "bg-rose-600 hover:bg-rose-500 shadow-rose-950/20 text-white" },
      ]
    }
    if (type === "experience") {
      return [
        { label: "Current", value: "current", icon: Check, style: "bg-emerald-600 hover:bg-emerald-500 shadow-emerald-950/20 text-white" },
        { label: "Past", value: "past", icon: X, style: "bg-rose-600 hover:bg-rose-500 shadow-rose-950/20 text-white" },
      ]
    }
    // messages
    return [
      { label: "Read", value: "read", icon: Check, style: "bg-emerald-600 hover:bg-emerald-500 shadow-emerald-950/20 text-white" },
      { label: "Unread", value: "unread", icon: X, style: "bg-rose-600 hover:bg-rose-500 shadow-rose-950/20 text-white" },
    ]
  })()

  return (
    <AnimatePresence>
      {selectedCount > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 80, x: "-50%" }}
          animate={{ opacity: 1, y: 0, x: "-50%" }}
          exit={{ opacity: 0, y: 80, x: "-50%" }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
          className="fixed bottom-8 left-1/2 z-40 w-full max-w-xl px-4 pointer-events-none"
        >
          <div className="pointer-events-auto flex items-center justify-between gap-4 p-4 rounded-2xl glass border border-primary/30 bg-card/95 shadow-2xl backdrop-blur-xl">
            {/* Counts info */}
            <div className="flex items-center gap-3">
              <button
                onClick={onClear}
                className="p-1 rounded-lg text-muted hover:text-foreground hover:bg-background/85 transition-colors cursor-pointer"
                title="Deselect All"
                aria-label="Clear selection"
              >
                <X className="w-4 h-4" />
              </button>
              <div className="flex flex-col">
                <span className="text-xs font-mono font-bold text-foreground leading-none">
                  {selectedCount} Selected
                </span>
                <span className="text-[10px] text-muted font-mono leading-tight">
                  Bulk operations
                </span>
              </div>
            </div>

            {/* Actions group */}
            <div className="flex items-center gap-2">
              {actions.map((act) => {
                const Icon = act.icon
                return (
                  <button
                    key={act.value}
                    disabled={isPending}
                    onClick={() => onBulkAction(act.value)}
                    className={`flex items-center gap-1 px-3 py-2 text-[10px] font-bold rounded-xl cursor-pointer shadow-md transition-all select-none disabled:opacity-40 ${act.style}`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{act.label}</span>
                  </button>
                )
              })}
              
              <div className="h-6 w-px bg-card-border/40" />

              <button
                disabled={isPending}
                onClick={() => onBulkAction("delete")}
                className="flex items-center gap-1 px-3 py-2 text-[10px] font-bold rounded-xl cursor-pointer shadow-md bg-red-950/20 border border-red-500/30 hover:bg-red-900/30 text-red-200 disabled:opacity-40 transition-all select-none"
                title="Delete Selected"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete</span>
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
