"use client"

import { useState, useEffect, useRef, useTransition, useMemo } from "react"
import {
  ChevronUp,
  ChevronDown,
  Copy,
  Trash2,
  Plus,
  Maximize2,
  Minimize2,
  Eye,
  Undo2,
  Redo2,
  BookOpen,
  HelpCircle,
} from "lucide-react"
import { Block, BlockType } from "./types"

// Blocks Editors
import ParagraphBlock from "./blocks/ParagraphBlock"
import HeadingBlock from "./blocks/HeadingBlock"
import ListBlock from "./blocks/ListBlock"
import CodeBlock from "./blocks/CodeBlock"
import TableBlock from "./blocks/TableBlock"
import QuoteBlock from "./blocks/QuoteBlock"
import EmbedBlock from "./blocks/EmbedBlock"
import { DividerBlock, TocBlock, MathBlock, MermaidBlock, AccordionBlock, TabsBlock, TimelineBlock } from "./blocks/AdvancedBlocks"

interface RichBlogEditorProps {
  initialValue?: string // JSON string
  onChange: (value: string) => void
  onChangeReadingTime?: (minutes: number) => void
}

export default function RichBlogEditor({
  initialValue = "",
  onChange,
  onChangeReadingTime,
}: RichBlogEditorProps) {
  // Parse initial blocks
  const parseInitial = (): Block[] => {
    try {
      if (initialValue && initialValue.startsWith("[")) {
        return JSON.parse(initialValue)
      }
    } catch (e) {
      console.error("Failed to parse initial blocks JSON:", e)
    }
    // Fallback block if empty or invalid markdown
    return [
      { id: "1", type: "heading", data: { level: 2, text: "New Article Title" } },
      { id: "2", type: "paragraph", data: { text: "Start writing here or type '/' for blocks command list..." } },
    ]
  }

  const [blocks, setBlocksState] = useState<Block[]>(parseInitial)
  const [history, setHistory] = useState<Block[][]>([])
  const [redoHistory, setRedoHistory] = useState<Block[][]>([])
  
  // UX Controls
  const [slashIndex, setSlashIndex] = useState<number | null>(null)
  const [slashSearch, setSlashSearch] = useState("")
  const [focusMode, setFocusMode] = useState(false)
  const [fullscreen, setFullscreen] = useState(false)

  // References
  const slashMenuRef = useRef<HTMLDivElement>(null)

  // Update blocks state and save history
  const setBlocks = (newBlocks: Block[], trackHistory = true) => {
    if (trackHistory) {
      setHistory((prev) => [...prev, blocks])
      setRedoHistory([]) // clear redo history on new actions
    }
    setBlocksState(newBlocks)
  }

  // Undo/Redo operations
  const handleUndo = () => {
    if (history.length === 0) return
    const prev = history[history.length - 1]
    setRedoHistory((r) => [...r, blocks])
    setHistory((h) => h.slice(0, -1))
    setBlocksState(prev)
  }

  const handleRedo = () => {
    if (redoHistory.length === 0) return
    const next = redoHistory[redoHistory.length - 1]
    setHistory((h) => [...h, blocks])
    setRedoHistory((r) => r.slice(0, -1))
    setBlocksState(next)
  }

  // Keyboard shortcut listener
  useEffect(() => {
    const handleKeys = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "z") {
        e.preventDefault()
        handleUndo()
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "y") {
        e.preventDefault()
        handleRedo()
      }
    }
    window.addEventListener("keydown", handleKeys)
    return () => window.removeEventListener("keydown", handleKeys)
  }, [blocks, history, redoHistory])

  // Propagate content change
  useEffect(() => {
    const serialized = JSON.stringify(blocks)
    onChange(serialized)
    
    // Auto-save to localStorage
    localStorage.setItem("cms_editor_draft", serialized)

    // Calculate reading time & word counts
    let wordCount = 0
    blocks.forEach((b) => {
      if (b.type === "paragraph" || b.type === "heading" || b.type === "quote") {
        wordCount += (b.data.text || "").split(/\s+/).filter(Boolean).length
      } else if (b.type === "list") {
        const listItems = b.data.items || []
        listItems.forEach((li: string) => {
          wordCount += li.split(/\s+/).filter(Boolean).length
        })
      }
    })

    const readMinutes = Math.max(1, Math.ceil(wordCount / 200))
    if (onChangeReadingTime) {
      onChangeReadingTime(readMinutes)
    }
  }, [blocks])

  // Count words, characters in real-time
  const counts = useMemo(() => {
    let words = 0
    let chars = 0
    blocks.forEach((b) => {
      if (b.type === "paragraph" || b.type === "heading" || b.type === "quote") {
        const text = b.data.text || ""
        words += text.split(/\s+/).filter(Boolean).length
        chars += text.length
      } else if (b.type === "list") {
        const listItems = b.data.items || []
        listItems.forEach((li: string) => {
          words += li.split(/\s+/).filter(Boolean).length
          chars += li.length
        })
      }
    })
    return { words, chars, minutes: Math.max(1, Math.ceil(words / 200)) }
  }, [blocks])

  // Block Mutation Operations
  const handleUpdateBlockData = (index: number, data: any) => {
    // Check if user is typing a slash command in paragraph
    const block = blocks[index]
    if (block.type === "paragraph") {
      const text = data.text || ""
      if (text.endsWith("/")) {
        setSlashIndex(index)
        setSlashSearch("")
      } else if (slashIndex === index) {
        // If backspaced the slash
        if (!text.includes("/")) {
          setSlashIndex(null)
        } else {
          const slashPos = text.lastIndexOf("/")
          setSlashSearch(text.substring(slashPos + 1))
        }
      }
    }

    const nextBlocks = [...blocks]
    nextBlocks[index] = { ...block, data }
    setBlocks(nextBlocks)
  }

  const handleInsertBlock = (index: number, type: BlockType = "paragraph") => {
    const id = Math.random().toString(36).substring(2, 9)
    const newBlock: Block = {
      id,
      type,
      data: type === "heading" ? { level: 2, text: "" } : {},
    }
    const nextBlocks = [...blocks]
    nextBlocks.splice(index + 1, 0, newBlock)
    setBlocks(nextBlocks)
    setSlashIndex(null)
  }

  const handleDuplicateBlock = (index: number) => {
    const original = blocks[index]
    const id = Math.random().toString(36).substring(2, 9)
    const copyBlock: Block = {
      id,
      type: original.type,
      data: JSON.parse(JSON.stringify(original.data)),
    }
    const nextBlocks = [...blocks]
    nextBlocks.splice(index + 1, 0, copyBlock)
    setBlocks(nextBlocks)
  }

  const handleDeleteBlock = (index: number) => {
    if (blocks.length <= 1) return
    const nextBlocks = blocks.filter((_, i) => i !== index)
    setBlocks(nextBlocks)
  }

  const handleMoveBlock = (index: number, direction: "up" | "down") => {
    if (direction === "up" && index === 0) return
    if (direction === "down" && index === blocks.length - 1) return

    const targetIdx = direction === "up" ? index - 1 : index + 1
    const nextBlocks = [...blocks]
    const temp = nextBlocks[index]
    nextBlocks[index] = nextBlocks[targetIdx]
    nextBlocks[targetIdx] = temp
    setBlocks(nextBlocks)
  }

  const handleConvertBlockType = (index: number, type: BlockType) => {
    const nextBlocks = [...blocks]
    const original = nextBlocks[index]
    const textVal = original.data.text || ""

    // Format new block data
    let newData: any = {}
    if (type === "heading") {
      newData = { level: 2, text: textVal }
    } else if (type === "paragraph" || type === "quote" || type === "math" || type === "mermaid") {
      newData = { text: textVal, expression: textVal, code: textVal }
    } else if (type === "list") {
      newData = { listType: "bullet", items: [textVal || ""] }
    } else if (type === "code") {
      newData = { code: textVal, language: "typescript", lineNumbers: true }
    } else if (type === "table") {
      newData = { rows: [["Header 1", "Header 2"], ["", ""]] }
    } else if (type === "embed") {
      newData = { embedType: "youtube", url: "" }
    }

    nextBlocks[index] = {
      id: original.id,
      type,
      data: newData,
    }
    setBlocks(nextBlocks)
    setSlashIndex(null)
  }

  // Available command menu options
  const commands: { label: string; type: BlockType; desc: string }[] = [
    { label: "Paragraph text", type: "paragraph", desc: "Start writing plain text" },
    { label: "Heading size Title", type: "heading", desc: "Heading H1, H2, H3 title" },
    { label: "List bullet/number", type: "list", desc: "Bulleted, numbered list, or checkboxes" },
    { label: "Code Syntax Block", type: "code", desc: "Source code block with line numbering" },
    { label: "Grid Data Table", type: "table", desc: "Simple table with column resizing" },
    { label: "Quote & Callouts", type: "quote", desc: "Warning, success, info alert callouts" },
    { label: "Mermaid Flowchart", type: "mermaid", desc: "Mermaid TD/LR dynamic flows" },
    { label: "KaTeX Math Equation", type: "math", desc: "LaTeX format centered math equation" },
    { label: "Accordion Details", type: "accordion", desc: "Expandable text panel details" },
    { label: "Tabs Selector", type: "tabs", desc: "Layered multiple tabs selector cards" },
    { label: "Timeline Flow", type: "timeline", desc: "Flow milestone timelines" },
    { label: "Table of Contents", type: "toc", desc: "Auto compile H1-H6 anchors list" },
    { label: "Horizontal Divider", type: "divider", desc: "Visually separate sections" },
    { label: "Embed integrations", type: "embed", desc: "YouTube, GitHub, Loom frame embeds" },
  ]

  // Filter commands by search
  const filteredCommands = commands.filter((cmd) =>
    cmd.label.toLowerCase().includes(slashSearch.toLowerCase()) ||
    cmd.desc.toLowerCase().includes(slashSearch.toLowerCase())
  )

  // Close slash menu on outside click
  useEffect(() => {
    function clickOutside(e: MouseEvent) {
      if (slashMenuRef.current && !slashMenuRef.current.contains(e.target as Node)) {
        setSlashIndex(null)
      }
    }
    document.addEventListener("mousedown", clickOutside)
    return () => document.removeEventListener("mousedown", clickOutside)
  }, [])

  return (
    <div
      className={`flex flex-col border border-card-border rounded-2xl bg-card overflow-hidden shadow-lg transition-all ${
        fullscreen ? "fixed inset-0 z-50 rounded-none w-full h-full" : "w-full"
      } ${focusMode ? "border-primary/30" : ""}`}
    >
      
      {/* 1. Header toolbar actions */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-background border-b border-card-border/40 px-4 py-3 select-none">
        
        {/* Undo, Redo, Autosave metadata */}
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            disabled={history.length === 0}
            onClick={handleUndo}
            className="p-2 rounded-xl text-muted hover:text-foreground hover:bg-card/50 transition-colors disabled:opacity-30 cursor-pointer"
            title="Undo (Ctrl+Z)"
          >
            <Undo2 className="w-4 h-4" />
          </button>
          <button
            type="button"
            disabled={redoHistory.length === 0}
            onClick={handleRedo}
            className="p-2 rounded-xl text-muted hover:text-foreground hover:bg-card/50 transition-colors disabled:opacity-30 cursor-pointer"
            title="Redo (Ctrl+Y)"
          >
            <Redo2 className="w-4 h-4" />
          </button>
          
          <div className="h-4 w-px bg-card-border/40 mx-1" />
          
          <span className="text-[10px] font-mono text-muted/80 flex items-center gap-1">
            <BookOpen className="w-3.5 h-3.5 text-primary" /> Auto-saving draft locally
          </span>
        </div>

        {/* Focus, Fullscreen, Help options */}
        <div className="flex items-center gap-2 text-xs font-semibold">
          <button
            type="button"
            onClick={() => setFocusMode(!focusMode)}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer border ${
              focusMode ? "bg-primary/10 border-primary/30 text-primary" : "border-card-border text-muted hover:text-foreground hover:bg-card/50"
            }`}
          >
            Focus Mode
          </button>

          <button
            type="button"
            onClick={() => setFullscreen(!fullscreen)}
            className="p-2 rounded-xl border border-card-border text-muted hover:text-foreground hover:bg-card/50 transition-colors cursor-pointer"
            title={fullscreen ? "Exit Fullscreen" : "Fullscreen"}
          >
            {fullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>

      </div>

      {/* 2. Scrollable Edit Canvas */}
      <div className={`flex-1 overflow-y-auto px-6 py-8 md:px-12 md:py-12 bg-card ${fullscreen ? "h-[calc(100vh-100px)]" : "max-h-[500px]"}`}>
        <div className={`max-w-2xl mx-auto flex flex-col gap-5 ${focusMode ? "opacity-75 focus-within:opacity-100" : ""}`}>
          
          {blocks.map((block, idx) => {
            const isSelected = slashIndex === idx

            return (
              <div key={block.id} className="relative group/block flex items-start gap-3 w-full">
                
                {/* Block Controls Column (Grab, Up, Down, Add) */}
                <div className="absolute -left-12 top-1/2 -translate-y-1/2 flex items-center gap-0.5 opacity-0 group-hover/block:opacity-100 transition-opacity select-none z-10 bg-card border border-card-border/60 p-0.5 rounded-lg shadow-md shrink-0">
                  <button
                    type="button"
                    disabled={idx === 0}
                    onClick={() => handleMoveBlock(idx, "up")}
                    className="p-1 rounded text-muted hover:text-foreground hover:bg-background cursor-pointer disabled:opacity-20"
                    title="Move block up"
                  >
                    <ChevronUp className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    disabled={idx === blocks.length - 1}
                    onClick={() => handleMoveBlock(idx, "down")}
                    className="p-1 rounded text-muted hover:text-foreground hover:bg-background cursor-pointer disabled:opacity-20"
                    title="Move block down"
                  >
                    <ChevronDown className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDuplicateBlock(idx)}
                    className="p-1 rounded text-muted hover:text-foreground hover:bg-background cursor-pointer"
                    title="Duplicate Block"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                  {blocks.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleDeleteBlock(idx)}
                      className="p-1 rounded text-red-400 hover:text-red-400 hover:bg-red-950/20 cursor-pointer"
                      title="Delete Block"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* Main block entry renderer */}
                <div className="flex-1 min-w-0 relative">
                  
                  {block.type === "paragraph" && (
                    <ParagraphBlock
                      block={block}
                      onChange={(data) => handleUpdateBlockData(idx, data)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault()
                          handleInsertBlock(idx)
                        }
                      }}
                    />
                  )}

                  {block.type === "heading" && (
                    <HeadingBlock
                      block={block}
                      onChange={(data) => handleUpdateBlockData(idx, data)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault()
                          handleInsertBlock(idx)
                        }
                      }}
                    />
                  )}

                  {block.type === "list" && (
                    <ListBlock block={block} onChange={(data) => handleUpdateBlockData(idx, data)} />
                  )}

                  {block.type === "code" && (
                    <CodeBlock block={block} onChange={(data) => handleUpdateBlockData(idx, data)} />
                  )}

                  {block.type === "table" && (
                    <TableBlock block={block} onChange={(data) => handleUpdateBlockData(idx, data)} />
                  )}

                  {block.type === "quote" && (
                    <QuoteBlock block={block} onChange={(data) => handleUpdateBlockData(idx, data)} />
                  )}

                  {block.type === "embed" && (
                    <EmbedBlock block={block} onChange={(data) => handleUpdateBlockData(idx, data)} />
                  )}

                  {block.type === "divider" && <DividerBlock />}
                  {block.type === "toc" && <TocBlock />}
                  {block.type === "math" && <MathBlock block={block} onChange={(data) => handleUpdateBlockData(idx, data)} />}
                  {block.type === "mermaid" && <MermaidBlock block={block} onChange={(data) => handleUpdateBlockData(idx, data)} />}
                  {block.type === "accordion" && <AccordionBlock block={block} onChange={(data) => handleUpdateBlockData(idx, data)} />}
                  {block.type === "tabs" && <TabsBlock block={block} onChange={(data) => handleUpdateBlockData(idx, data)} />}
                  {block.type === "timeline" && <TimelineBlock block={block} onChange={(data) => handleUpdateBlockData(idx, data)} />}

                  {/* Notion-style Slash command menu overlay */}
                  {isSelected && (
                    <div
                      ref={slashMenuRef}
                      className="absolute left-0 top-full mt-1.5 w-64 rounded-xl bg-card border border-card-border shadow-2xl z-20 overflow-hidden py-1 max-h-60 overflow-y-auto select-none"
                    >
                      <div className="px-3 py-1.5 border-b border-card-border/40 text-[9px] font-mono text-muted uppercase">
                        Convert Block to...
                      </div>
                      
                      {filteredCommands.length > 0 ? (
                        filteredCommands.map((cmd) => (
                          <button
                            key={cmd.label}
                            type="button"
                            onClick={() => handleConvertBlockType(idx, cmd.type)}
                            className="w-full text-left px-3 py-2 hover:bg-background/80 transition-colors flex flex-col gap-0.5 cursor-pointer border-none"
                          >
                            <span className="text-xs font-bold text-foreground">{cmd.label}</span>
                            <span className="text-[10px] text-muted">{cmd.desc}</span>
                          </button>
                        ))
                      ) : (
                        <div className="px-3 py-2 text-xs text-muted font-sans">No matching block types.</div>
                      )}
                    </div>
                  )}

                </div>

                {/* Inline Hover inserter (+ block) */}
                <div className="absolute left-0 right-0 -bottom-3 h-2 opacity-0 hover:opacity-100 flex items-center justify-center pointer-events-none select-none z-10">
                  <div className="w-full h-px bg-primary/30 border-dashed pointer-events-none" />
                  <button
                    type="button"
                    onClick={() => handleInsertBlock(idx)}
                    className="pointer-events-auto p-1 rounded-full bg-primary text-white hover:bg-primary-hover shadow-md cursor-pointer border border-primary/20 shrink-0 mx-2 animate-bounce-slow"
                    title="Insert Paragraph Block here"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                  <div className="w-full h-px bg-primary/30 border-dashed pointer-events-none" />
                </div>

              </div>
            )
          })}

        </div>
      </div>

      {/* 3. Bottom status statistics bar */}
      <div className="bg-background px-4 py-2 border-t border-card-border/40 flex flex-wrap items-center justify-between text-[10px] font-mono text-muted select-none">
        <div className="flex items-center gap-4">
          <span>Words: <strong className="text-foreground">{counts.words}</strong></span>
          <span>Characters: <strong className="text-foreground">{counts.chars}</strong></span>
          <span>Reading Time: <strong className="text-foreground">{counts.minutes} min</strong></span>
        </div>
        
        <div className="flex items-center gap-1">
          <HelpCircle className="w-3 h-3 text-primary" />
          <span>Type <strong>/</strong> to change block styles</span>
        </div>
      </div>

    </div>
  )
}
