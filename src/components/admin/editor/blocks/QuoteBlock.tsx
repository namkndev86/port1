"use client"

import { Quote, AlertTriangle, AlertCircle, CheckCircle, Info, Sparkles } from "lucide-react"
import { Block } from "../types"

interface QuoteBlockProps {
  block: Block
  onChange: (data: any) => void
}

export default function QuoteBlock({ block, onChange }: QuoteBlockProps) {
  const text = block.data.text || ""
  const quoteType = block.data.quoteType || "quote" // "quote" | "warning" | "success" | "info" | "error" | "tip"

  const types = [
    { label: "Quote", value: "quote", icon: Quote, style: "border-primary/40 bg-primary/5 text-primary" },
    { label: "Warning", value: "warning", icon: AlertTriangle, style: "border-amber-500/30 bg-amber-500/5 text-amber-500" },
    { label: "Success", value: "success", icon: CheckCircle, style: "border-emerald-500/30 bg-emerald-500/5 text-emerald-500" },
    { label: "Info", value: "info", icon: Info, style: "border-blue-500/30 bg-blue-500/5 text-blue-400" },
    { label: "Error", value: "error", icon: AlertCircle, style: "border-red-500/30 bg-red-500/5 text-red-500" },
    { label: "Tip", value: "tip", icon: Sparkles, style: "border-purple-500/30 bg-purple-500/5 text-purple-400" },
  ]

  const activeType = types.find((t) => t.value === quoteType) || types[0]
  const Icon = activeType.icon

  return (
    <div className="flex flex-col gap-3 w-full p-4 rounded-xl border border-card-border/40 bg-background/50">
      
      {/* 1. Header Type selectors */}
      <div className="flex flex-wrap items-center gap-1.5 border-b border-card-border/40 pb-2.5 mb-1 select-none">
        {types.map((t) => (
          <button
            key={t.value}
            type="button"
            onClick={() => onChange({ text, quoteType: t.value })}
            className={`px-2.5 py-1 text-[10px] font-bold rounded-lg cursor-pointer transition-colors ${
              quoteType === t.value ? "bg-primary text-white" : "text-muted hover:bg-background"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* 2. Styled Box input */}
      <div className={`flex gap-3 p-4 rounded-xl border transition-all ${activeType.style}`}>
        <span className="shrink-0 mt-0.5 opacity-80">
          <Icon className="w-5 h-5" />
        </span>
        <textarea
          value={text}
          onChange={(e) => onChange({ text: e.target.value, quoteType })}
          placeholder={`Enter ${quoteType} text content...`}
          rows={2}
          className="flex-1 bg-transparent border-none text-foreground placeholder:text-muted/50 text-sm focus:outline-none resize-y block leading-relaxed"
        />
      </div>

    </div>
  )
}
