"use client"

import { Code2, FileText, Frame,Globe, Play, Video } from "lucide-react"

import { type Block } from "../types"

interface EmbedBlockProps {
  block: Block
  onChange: (data: any) => void
}

export default function EmbedBlock({ block, onChange }: EmbedBlockProps) {
  const url = block.data.url || ""
  const embedType = block.data.embedType || "youtube" // "youtube" | "vimeo" | "github" | "codesandbox" | "figma" | "loom" | "pdf"

  const types = [
    { label: "YouTube", value: "youtube", icon: Play, placeholder: "e.g. https://www.youtube.com/watch?v=..." },
    { label: "Vimeo", value: "vimeo", icon: Video, placeholder: "e.g. https://vimeo.com/..." },
    { label: "GitHub", value: "github", icon: Code2, placeholder: "e.g. https://github.com/user/repo" },
    { label: "CodeSandbox", value: "codesandbox", icon: Globe, placeholder: "e.g. https://codesandbox.io/embed/..." },
    { label: "Figma", value: "figma", icon: Frame, placeholder: "e.g. https://figma.com/file/..." },
    { label: "Loom", value: "loom", icon: Video, placeholder: "e.g. https://www.loom.com/share/..." },
    { label: "PDF Link", value: "pdf", icon: FileText, placeholder: "e.g. https://example.com/document.pdf" },
  ]

  const activeType = types.find((t) => t.value === embedType) || types[0]
  const Icon = activeType.icon

  return (
    <div className="flex flex-col gap-3 w-full p-4 rounded-xl border border-card-border/40 bg-background/50">
      
      {/* 1. Embed type selector */}
      <div className="flex flex-wrap items-center gap-1.5 border-b border-card-border/40 pb-2.5 mb-1 select-none">
        {types.map((t) => {
          const TIcon = t.icon
          return (
            <button
              key={t.value}
              type="button"
              onClick={() => onChange({ url, embedType: t.value })}
              className={`flex items-center gap-1 px-2.5 py-1 text-[10px] font-bold rounded-lg cursor-pointer transition-colors ${
                embedType === t.value ? "bg-primary text-white" : "text-muted hover:bg-background"
              }`}
            >
              <TIcon className="w-3.5 h-3.5" />
              <span>{t.label}</span>
            </button>
          )
        })}
      </div>

      {/* 2. URL Input */}
      <div className="flex items-center gap-3 bg-card border border-card-border/60 rounded-xl px-3 py-2.5">
        <span className="text-muted shrink-0">
          <Icon className="w-5 h-5" />
        </span>
        <input
          type="url"
          value={url}
          onChange={(e) => onChange({ url: e.target.value, embedType })}
          placeholder={activeType.placeholder}
          className="flex-1 bg-transparent text-foreground placeholder:text-muted/50 text-sm focus:outline-none block"
        />
      </div>

      {/* 3. Small Preview indicator */}
      {url && (
        <div className="text-[10px] font-mono text-muted/60 mt-1 pl-1 truncate">
          ✓ Configured embed source: {url}
        </div>
      )}

    </div>
  )
}
