"use client"

import { useState, useEffect, useMemo } from "react"
import { Eye, Copy, Check, Terminal, ExternalLink, Sparkles, AlertTriangle, AlertCircle, CheckCircle, Info, Quote, ChevronDown } from "lucide-react"
import katex from "katex"
import "katex/dist/katex.min.css"

import { Block } from "../admin/editor/types"

interface BlockRendererProps {
  content: string // JSON string array of blocks
}

// 1. Helper: Parse inline markdown styles like bold (**), italic (_), and link [text](url)
function renderTextWithFormatting(text: string): React.ReactNode {
  if (!text) return ""

  const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g
  const parts = []
  let lastIndex = 0
  let match

  while ((match = linkRegex.exec(text)) !== null) {
    const plainText = text.substring(lastIndex, match.index)
    if (plainText) parts.push(...parseInlineStyles(plainText))

    const linkText = match[1]
    const linkUrl = match[2]
    const isExternal = linkUrl.startsWith("http")

    parts.push(
      <a
        key={match.index}
        href={linkUrl}
        target={isExternal ? "_blank" : undefined}
        rel={isExternal ? "noopener noreferrer" : undefined}
        className="text-primary hover:underline font-semibold inline-flex items-center gap-0.5"
      >
        {linkText}
        {isExternal && <ExternalLink className="w-3 h-3 inline" />}
      </a>
    )
    lastIndex = linkRegex.lastIndex
  }

  const remaining = text.substring(lastIndex)
  if (remaining) parts.push(...parseInlineStyles(remaining))

  return parts.length > 0 ? parts : text
}

function parseInlineStyles(text: string): React.ReactNode[] {
  let tokens: any[] = [{ text }]

  // Bold: **text**
  tokens = tokens.flatMap((t: any) => {
    if (t.bold || t.italic || t.code) return [t]
    const parts = t.text.split(/\*\*(.*?)\*\*/g)
    return parts.map((p: string, i: number) => ({ text: p, bold: i % 2 === 1 }))
  })

  // Italic: _text_
  tokens = tokens.flatMap((t: any) => {
    if (t.bold || t.italic || t.code) return [t]
    const parts = t.text.split(/\_(.*?)\_/g)
    return parts.map((p: string, i: number) => ({ text: p, bold: t.bold, italic: i % 2 === 1 }))
  })

  // Highlight: ==text==
  tokens = tokens.flatMap((t: any) => {
    if (t.bold || t.italic || t.code || t.highlight) return [t]
    const parts = t.text.split(/==(.*?)==/g)
    return parts.map((p: string, i: number) => ({ text: p, bold: t.bold, italic: t.italic, highlight: i % 2 === 1 }))
  })

  // Code: `code`
  tokens = tokens.flatMap((t: any) => {
    if (t.bold || t.italic || t.code) return [t]
    const parts = t.text.split(/`(.*?)`/g)
    return parts.map((p: string, i: number) => ({ text: p, bold: t.bold, italic: t.italic, highlight: t.highlight, code: i % 2 === 1 }))
  })

  return tokens.map((t: any, idx: number) => {
    if (t.code) {
      return (
        <code key={idx} className="bg-background border border-card-border/60 px-1.5 py-0.5 rounded text-xs font-mono text-primary font-bold">
          {t.text}
        </code>
      )
    }

    let element: React.ReactNode = t.text
    if (t.bold) element = <strong key={idx} className="font-bold text-foreground">{element}</strong>
    if (t.italic) element = <em key={idx} className="italic text-foreground/80">{element}</em>
    if (t.highlight) element = <mark key={idx} className="bg-primary/20 text-primary px-1 rounded">{element}</mark>
    return <span key={idx}>{element}</span>
  })
}

// 2. Helper: Dynamic client-side Mermaid chart compiler
function MermaidChart({ code }: { code: string }) {
  const [svg, setSvg] = useState<string>("")
  const [error, setError] = useState<boolean>(false)

  useEffect(() => {
    let active = true
    import("mermaid").then((m) => {
      const mermaid = m.default
      mermaid.initialize({ startOnLoad: false, theme: "dark" })
      const id = `mermaid-${Math.random().toString(36).substring(2, 9)}`
      mermaid.render(id, code)
        .then(({ svg: renderedSvg }) => {
          if (active) setSvg(renderedSvg)
        })
        .catch((err) => {
          console.error("Mermaid compile error:", err)
          if (active) setError(true)
        })
    })
    return () => {
      active = false
    }
  }, [code])

  if (error) {
    return <div className="text-xs font-mono p-3 bg-red-950/20 text-red-400 rounded-lg border border-red-500/10">Failed to render Mermaid chart markup.</div>
  }

  if (!svg) {
    return <div className="text-xs text-muted font-mono animate-pulse p-4">Loading flowchart visual...</div>
  }

  return (
    <div
      className="flex items-center justify-center p-6 bg-[#040813]/40 border border-card-border rounded-xl overflow-auto w-full"
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  )
}

// 3. Helper: Simple regex code highlighters
function highlightCode(code: string, language: string) {
  if (!code) return ""

  let html = code
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")

  if (["javascript", "typescript", "go", "rust", "python", "sql", "json"].includes(language)) {
    // Keywords
    html = html.replace(/\b(const|let|var|function|return|import|from|export|default|class|extends|if|else|for|while|async|await|package|func|go|struct|type|fn|pub|impl|def|print|select|insert|update|delete|where|from)\b/g, '<span class="text-primary font-bold">$1</span>')
    // Comments
    html = html.replace(/(\/\/.*|\/\*[\s\S]*?\*\/|#.*)/g, '<span class="text-muted opacity-50 italic">$1</span>')
    // Strings
    html = html.replace(/(['"`])(.*?)\1/g, '<span class="text-emerald-400 font-semibold">$1$2$1</span>')
    // Numbers
    html = html.replace(/\b(\d+)\b/g, '<span class="text-amber-400">$1</span>')
  }

  return <code className="font-mono text-xs md:text-sm leading-relaxed" dangerouslySetInnerHTML={{ __html: html }} />
}

export default function BlockRenderer({ content }: BlockRendererProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null)
  
  // Tabs active states mapping
  const [tabsState, setTabsState] = useState<Record<string, number>>({})

  // Parse blocks
  const blocks: Block[] = useMemo(() => {
    try {
      if (content && content.startsWith("[")) {
        return JSON.parse(content)
      }
    } catch (e) {
      console.error("Renderer JSON parsing error:", e)
    }
    return []
  }, [content])

  if (blocks.length === 0) {
    return <div className="whitespace-pre-line text-sm leading-relaxed text-muted">{content}</div>
  }

  // Pre-calculate headings for Table of Contents (TOC) block
  const headingBlocks = blocks.filter((b) => b.type === "heading")

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  return (
    <div className="flex flex-col gap-6 text-muted text-sm md:text-base leading-relaxed w-full">
      {blocks.map((block) => {
        const id = block.id

        switch (block.type) {
          case "paragraph": {
            return (
              <p key={id} className="text-muted leading-relaxed font-sans select-text">
                {renderTextWithFormatting(block.data.text)}
              </p>
            )
          }

          case "heading": {
            const level = block.data.level || 2
            const text = block.data.text || ""
            const headingId = text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")
            
            const H = `h${level}` as 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
            const classes = {
              1: "text-2xl md:text-4xl font-black font-display text-foreground mt-8 mb-3 scroll-mt-24",
              2: "text-xl md:text-3xl font-bold font-display text-foreground mt-6 mb-2.5 scroll-mt-24",
              3: "text-lg md:text-2xl font-bold font-display text-foreground mt-5 mb-2 scroll-mt-24",
              4: "text-base md:text-xl font-bold text-foreground mt-4 mb-2 scroll-mt-24",
              5: "text-sm md:text-lg font-bold uppercase tracking-wider text-foreground mt-4 mb-1.5 scroll-mt-24",
              6: "text-xs md:text-sm font-mono font-bold text-muted uppercase mt-3 mb-1 scroll-mt-24",
            }[level as 1 | 2 | 3 | 4 | 5 | 6]

            return (
              <H key={id} id={headingId} className={classes}>
                {text}
              </H>
            )
          }

          case "list": {
            const listType = block.data.listType || "bullet"
            const items: string[] = block.data.items || []
            const checked: boolean[] = block.data.checked || []

            if (listType === "todo") {
              return (
                <div key={id} className="flex flex-col gap-2 pl-2">
                  {items.map((item, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm md:text-base leading-relaxed">
                      <div className="flex items-center justify-center shrink-0 w-5">
                        <div className={`w-4 h-4 rounded border flex items-center justify-center transition-all ${
                          checked[i] ? "bg-primary border-primary text-white" : "border-card-border/80 bg-background text-transparent"
                        }`}>
                          {checked[i] && (
                            <svg className="w-2.5 h-2.5 stroke-current" viewBox="0 0 24 24" fill="none" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
                              <polyline points="20 6 9 17 4 12"></polyline>
                            </svg>
                          )}
                        </div>
                      </div>
                      <span className={checked[i] ? "line-through text-muted/65 opacity-60 font-sans" : "text-muted font-sans"}>
                        {renderTextWithFormatting(item)}
                      </span>
                    </div>
                  ))}
                </div>
              )
            }

            const L = listType === "ordered" ? "ol" : "ul"
            const listClass = listType === "ordered" ? "list-decimal pl-6 flex flex-col gap-2" : "list-disc pl-6 flex flex-col gap-2"

            return (
              <L key={id} className={listClass}>
                {items.map((item, i) => (
                  <li key={i} className="text-muted font-sans">
                    {renderTextWithFormatting(item)}
                  </li>
                ))}
              </L>
            )
          }

          case "code": {
            const code = block.data.code || ""
            const language = block.data.language || "typescript"
            const filename = block.data.filename || ""
            const lineNumbers = block.data.lineNumbers !== false

            return (
              <div key={id} className="flex flex-col w-full rounded-2xl border border-card-border/60 bg-[#030611] overflow-hidden shadow-md my-2">
                <div className="flex items-center justify-between px-4 py-2 border-b border-card-border/40 bg-card text-xs font-mono select-none">
                  <div className="flex items-center gap-2 text-muted">
                    <Terminal className="w-3.5 h-3.5 text-primary" />
                    <span>{filename || language}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleCopy(code, id)}
                    className="p-1 rounded text-muted hover:text-foreground hover:bg-background/80 transition-colors cursor-pointer flex items-center gap-1"
                  >
                    {copiedId === id ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-[10px]">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span className="text-[10px]">Copy</span>
                      </>
                    )}
                  </button>
                </div>
                <div className="flex overflow-x-auto relative p-3">
                  {lineNumbers && (
                    <div className="w-8 border-r border-card-border/20 pr-2 text-right text-muted-dark select-none font-mono text-xs leading-relaxed shrink-0">
                      {code.split("\n").map((line: string, i: number) => (
                        <div key={i} className="opacity-40">{i + 1}</div>
                      ))}
                    </div>
                  )}
                  <pre className="flex-1 pl-3 overflow-x-auto text-gray-200">
                    {highlightCode(code, language)}
                  </pre>
                </div>
              </div>
            )
          }

          case "table": {
            const rows: string[][] = block.data.rows || []
            if (rows.length === 0) return null

            return (
              <div key={id} className="overflow-x-auto w-full border border-card-border/60 rounded-xl bg-card my-2 shadow-sm">
                <table className="w-full border-collapse text-left text-sm font-sans">
                  <thead>
                    <tr className="border-b border-card-border bg-background/50 font-bold text-foreground">
                      {rows[0].map((cell, idx) => (
                        <th key={idx} className="p-3 border-r border-card-border/50 last:border-0">{cell}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {rows.slice(1).map((row, ri) => (
                      <tr key={ri} className="border-b border-card-border/40 last:border-0 hover:bg-background/20">
                        {row.map((cell, ci) => (
                          <td key={ci} className="p-3 border-r border-card-border/40 last:border-0 text-muted-dark">{renderTextWithFormatting(cell)}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )
          }

          case "quote": {
            const text = block.data.text || ""
            const quoteType = block.data.quoteType || "quote"

            const styles = {
              quote: { style: "border-primary/50 bg-primary/5 text-muted-dark", icon: Quote },
              warning: { style: "border-amber-500/40 bg-amber-500/5 text-amber-600/90 dark:text-amber-400", icon: AlertTriangle },
              success: { style: "border-emerald-500/40 bg-emerald-500/5 text-emerald-600/90 dark:text-emerald-400", icon: CheckCircle },
              info: { style: "border-blue-500/40 bg-blue-500/5 text-blue-600/90 dark:text-blue-400", icon: Info },
              error: { style: "border-red-500/40 bg-red-500/5 text-red-600/90 dark:text-red-400", icon: AlertCircle },
              tip: { style: "border-purple-500/40 bg-purple-500/5 text-purple-600/90 dark:text-purple-400", icon: Sparkles },
            }[quoteType as "quote" | "warning" | "success" | "info" | "error" | "tip"] || { style: "border-primary/50 bg-primary/5", icon: Quote }

            const QIcon = styles.icon

            return (
              <div key={id} className={`flex gap-3 p-4 rounded-xl border leading-relaxed my-2 ${styles.style}`}>
                <span className="shrink-0 mt-0.5 opacity-80">
                  <QIcon className="w-5 h-5 text-current" />
                </span>
                <p className="flex-1 font-sans italic">{renderTextWithFormatting(text)}</p>
              </div>
            )
          }

          case "embed": {
            const url = block.data.url || ""
            const embedType = block.data.embedType || "youtube"

            if (!url) return null

            if (embedType === "youtube" || embedType === "vimeo") {
              let videoSrc = url
              if (embedType === "youtube") {
                const ytId = url.includes("v=") ? url.split("v=")[1]?.split("&")[0] : url.split("/").pop()
                videoSrc = `https://www.youtube.com/embed/${ytId}`
              } else {
                const vimId = url.split("/").pop()
                videoSrc = `https://player.vimeo.com/video/${vimId}`
              }

              return (
                <div key={id} className="w-full aspect-video rounded-xl overflow-hidden border border-card-border bg-[#030611] shadow-md my-2">
                  <iframe
                    src={videoSrc}
                    title="Embedded video player"
                    allowFullScreen
                    className="w-full h-full border-0"
                  />
                </div>
              )
            }

            // Fallback link element
            return (
              <a
                key={id}
                href={url}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-between p-3.5 border border-card-border hover:border-primary bg-card/40 hover:bg-card rounded-xl text-xs font-mono text-muted hover:text-foreground transition-all my-2 shadow-sm"
              >
                <span>Embedded resource link: {url}</span>
                <ExternalLink className="w-3.5 h-3.5 text-primary" />
              </a>
            )
          }

          case "divider": {
            return <hr key={id} className="my-6 border-0 h-px bg-card-border/60" />
          }

          case "toc": {
            if (headingBlocks.length === 0) return null
            return (
              <div key={id} className="flex flex-col gap-2 p-4 rounded-xl border border-card-border bg-card/30 my-4 shadow-sm select-none">
                <span className="text-[10px] font-mono font-bold text-muted uppercase">Table of Contents</span>
                <ul className="flex flex-col gap-1.5 pl-3 border-l border-primary/30 mt-1">
                  {headingBlocks.map((hb) => {
                    const headingId = (hb.data.text || "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")
                    const indent = { 1: "pl-0", 2: "pl-2", 3: "pl-4", 4: "pl-6", 5: "pl-8", 6: "pl-10" }[(hb.data.level || 2) as 1 | 2 | 3 | 4 | 5 | 6]
                    return (
                      <li key={hb.id} className={`${indent} text-xs font-mono`}>
                        <a href={`#${headingId}`} className="text-muted hover:text-primary transition-colors hover:underline">
                          {hb.data.text}
                        </a>
                      </li>
                    )
                  })}
                </ul>
              </div>
            )
          }

          case "math": {
            const expression = block.data.expression || ""
            const isBlock = block.data.block !== false
            try {
              const html = katex.renderToString(expression, { throwOnError: false, displayMode: isBlock })
              return (
                <div
                  key={id}
                  className={`w-full overflow-x-auto select-all font-sans my-2 ${isBlock ? "text-center py-4 bg-background/30 rounded-xl border border-card-border/40" : "inline"}`}
                  dangerouslySetInnerHTML={{ __html: html }}
                />
              )
            } catch {
              return <span key={id} className="font-mono text-xs text-red-400">{expression}</span>
            }
          }

          case "mermaid": {
            return <MermaidChart key={id} code={block.data.code || ""} />
          }

          case "accordion": {
            const title = block.data.title || "Show Details"
            const accordionContent = block.data.content || ""
            return (
              <details key={id} className="w-full border border-card-border/60 bg-card/20 rounded-xl overflow-hidden my-2 shadow-sm group">
                <summary className="p-3 bg-card hover:bg-card/75 text-foreground text-sm font-bold font-display cursor-pointer select-none flex items-center justify-between transition-colors list-none">
                  <span>{title}</span>
                  <ChevronDown className="w-4 h-4 text-muted group-open:rotate-180 transition-transform" />
                </summary>
                <div className="p-4 border-t border-card-border/40 text-muted bg-background/25 text-xs md:text-sm leading-relaxed whitespace-pre-line font-sans select-text">
                  {accordionContent}
                </div>
              </details>
            )
          }

          case "tabs": {
            const tabsList: { title: string; content: string }[] = block.data.tabs || []
            if (tabsList.length === 0) return null
            const activeIdx = tabsState[id] || 0

            return (
              <div key={id} className="flex flex-col w-full rounded-xl border border-card-border bg-card/30 overflow-hidden shadow-sm my-2 select-none">
                <div className="flex flex-wrap items-center bg-card border-b border-card-border/40 px-3">
                  {tabsList.map((t, index) => (
                    <button
                      key={index}
                      onClick={() => setTabsState((prev) => ({ ...prev, [id]: index }))}
                      className={`px-4 py-2.5 text-xs font-mono font-bold cursor-pointer border-b-2 transition-all ${
                        activeIdx === index
                          ? "border-primary text-primary bg-primary/5"
                          : "border-transparent text-muted hover:text-foreground"
                      }`}
                    >
                      {t.title}
                    </button>
                  ))}
                </div>
                <div className="p-4 text-muted text-xs md:text-sm leading-relaxed whitespace-pre-line font-sans select-text">
                  {tabsList[activeIdx]?.content}
                </div>
              </div>
            )
          }

          case "timeline": {
            const events: { date: string; title: string; content: string }[] = block.data.events || []
            if (events.length === 0) return null

            return (
              <div key={id} className="flex flex-col gap-6 pl-4 border-l border-primary/20 relative my-4">
                {events.map((ev, index) => (
                  <div key={index} className="relative flex flex-col gap-1 text-left">
                    <div className="absolute -left-[21px] top-1.5 w-2.5 h-2.5 rounded-full bg-primary border-2 border-background animate-pulse" />
                    <span className="text-[10px] font-mono font-bold text-primary">{ev.date}</span>
                    <h4 className="text-sm font-bold text-foreground font-display">{ev.title}</h4>
                    <p className="text-xs md:text-sm text-muted leading-relaxed whitespace-pre-line font-sans select-text">{ev.content}</p>
                  </div>
                ))}
              </div>
            )
          }

          default:
            return null
        }
      })}
    </div>
  )
}
