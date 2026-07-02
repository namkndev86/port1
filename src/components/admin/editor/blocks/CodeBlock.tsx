"use client"

import { Terminal } from "lucide-react"
import { Block } from "../types"

interface CodeBlockProps {
  block: Block
  onChange: (data: any) => void
}

export default function CodeBlock({ block, onChange }: CodeBlockProps) {
  const code = block.data.code || ""
  const language = block.data.language || "typescript"
  const filename = block.data.filename || ""
  const lineNumbers = block.data.lineNumbers !== false

  const languages = [
    { label: "TypeScript", value: "typescript" },
    { label: "JavaScript", value: "javascript" },
    { label: "Python", value: "python" },
    { label: "Go", value: "go" },
    { label: "Rust", value: "rust" },
    { label: "Java", value: "java" },
    { label: "C#", value: "csharp" },
    { label: "SQL", value: "sql" },
    { label: "JSON", value: "json" },
    { label: "YAML", value: "yaml" },
    { label: "Bash", value: "bash" },
  ]

  return (
    <div className="flex flex-col w-full rounded-xl border border-card-border/60 bg-[#030611] overflow-hidden">
      
      {/* 1. Header Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-card px-4 py-2 border-b border-card-border/40 text-xs font-mono select-none">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-primary" />
          
          {/* Language Selector */}
          <select
            value={language}
            onChange={(e) => onChange({ code, language: e.target.value, filename, lineNumbers })}
            className="bg-background border border-card-border/60 rounded px-2 py-1 text-xs text-foreground cursor-pointer focus:outline-none focus:ring-1 focus:ring-primary"
          >
            {languages.map((lang) => (
              <option key={lang.value} value={lang.value} className="bg-card">
                {lang.label}
              </option>
            ))}
          </select>
          
          {/* Filename Input */}
          <input
            type="text"
            value={filename}
            onChange={(e) => onChange({ code, language, filename: e.target.value, lineNumbers })}
            placeholder="e.g. index.ts (optional)"
            className="bg-background border border-card-border/60 rounded px-2 py-1 text-xs text-foreground placeholder:text-muted/60 focus:outline-none focus:ring-1 focus:ring-primary w-40"
          />
        </div>

        {/* Line Numbers Switch */}
        <label className="flex items-center gap-1.5 cursor-pointer text-muted select-none hover:text-foreground transition-colors">
          <input
            type="checkbox"
            checked={lineNumbers}
            onChange={(e) => onChange({ code, language, filename, lineNumbers: e.target.checked })}
            className="w-3.5 h-3.5 rounded border-card-border bg-background text-primary focus:ring-primary cursor-pointer"
          />
          <span>Line Numbers</span>
        </label>
      </div>

      {/* 2. Code Editor Field */}
      <div className="flex relative min-h-[120px]">
        {/* Left numbers bar mockup */}
        {lineNumbers && (
          <div className="w-10 bg-background/20 border-r border-card-border/20 py-3 text-right pr-2 text-muted-dark select-none font-mono text-xs leading-relaxed">
            {code.split("\n").map((line: string, i: number) => (
              <div key={i}>{i + 1}</div>
            ))}
          </div>
        )}
        
        <textarea
          value={code}
          onChange={(e) => onChange({ code: e.target.value, language, filename, lineNumbers })}
          placeholder="// Enter your source code here..."
          className="flex-1 bg-transparent text-gray-200 placeholder:text-muted/40 font-mono text-xs md:text-sm leading-relaxed p-3 focus:outline-none resize-y min-h-[120px] overflow-auto whitespace-pre block border-none focus:ring-0"
        />
      </div>

    </div>
  )
}
