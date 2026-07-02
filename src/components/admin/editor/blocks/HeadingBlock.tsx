"use client"

import { Block } from "../types"

interface HeadingBlockProps {
  block: Block
  onChange: (data: any) => void
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void
}

export default function HeadingBlock({ block, onChange, onKeyDown }: HeadingBlockProps) {
  const level = block.data.level || 2
  const text = block.data.text || ""

  const levelClasses = {
    1: "text-2xl md:text-3xl font-black font-display",
    2: "text-xl md:text-2xl font-bold font-display",
    3: "text-lg md:text-xl font-bold font-display",
    4: "text-base md:text-lg font-bold",
    5: "text-sm md:text-base font-bold uppercase tracking-wider",
    6: "text-xs md:text-sm font-mono font-bold text-muted uppercase",
  }[level as 1 | 2 | 3 | 4 | 5 | 6]

  return (
    <div className="flex flex-col sm:flex-row gap-2 items-stretch sm:items-center w-full group">
      {/* 1. Level selector */}
      <div className="flex gap-0.5 border border-card-border/60 rounded-lg p-0.5 bg-background select-none shrink-0 self-start">
        {[1, 2, 3, 4, 5, 6].map((l) => (
          <button
            key={l}
            type="button"
            onClick={() => onChange({ text, level: l })}
            className={`w-6 h-6 text-[10px] font-bold rounded flex items-center justify-center transition-all cursor-pointer ${
              level === l
                ? "bg-primary text-white"
                : "text-muted hover:text-foreground hover:bg-background"
            }`}
          >
            H{l}
          </button>
        ))}
      </div>

      {/* 2. Heading Text Input */}
      <input
        type="text"
        value={text}
        onChange={(e) => onChange({ level, text: e.target.value })}
        onKeyDown={onKeyDown}
        placeholder={`Heading ${level}...`}
        className={`flex-1 bg-transparent text-foreground placeholder:text-muted focus:outline-none py-1 block border-b border-transparent focus:border-card-border/40 ${levelClasses}`}
      />
    </div>
  )
}
