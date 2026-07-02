"use client"

import { Plus, Trash2, GitPullRequest, Sigma, Layers, Calendar, Minus, List } from "lucide-react"
import { Block } from "../types"

interface AdvancedBlockProps {
  block: Block
  onChange: (data: any) => void
}

// 1. Divider Block Editor
export function DividerBlock() {
  return (
    <div className="py-4 flex items-center justify-center select-none w-full">
      <div className="w-full h-px bg-card-border/60 border-dashed" />
      <span className="px-3 text-[10px] font-mono text-muted uppercase shrink-0">Horizontal Divider</span>
      <div className="w-full h-px bg-card-border/60 border-dashed" />
    </div>
  )
}

// 2. Table of Contents (TOC) Block Editor
export function TocBlock() {
  return (
    <div className="flex items-center gap-3 p-4 rounded-xl border border-dashed border-card-border bg-background/30 text-muted select-none w-full">
      <List className="w-5 h-5 text-primary animate-pulse" />
      <div className="flex flex-col">
        <span className="text-xs font-mono font-bold text-foreground">Table of Contents Block</span>
        <span className="text-[10px] font-sans">This block automatically compiles all H1-H6 headings on the public details page.</span>
      </div>
    </div>
  )
}

// 3. Math Block Editor (LaTeX)
export function MathBlock({ block, onChange }: AdvancedBlockProps) {
  const expression = block.data.expression || ""
  const isBlock = block.data.block !== false

  return (
    <div className="flex flex-col gap-3 w-full p-4 rounded-xl border border-card-border/40 bg-background/50">
      <div className="flex items-center justify-between border-b border-card-border/40 pb-2 mb-1 select-none">
        <span className="text-[10px] font-mono font-bold text-muted uppercase flex items-center gap-1">
          <Sigma className="w-3.5 h-3.5 text-primary" /> LaTeX Formula (KaTeX)
        </span>
        <label className="flex items-center gap-1.5 cursor-pointer text-xs text-muted hover:text-foreground">
          <input
            type="checkbox"
            checked={isBlock}
            onChange={(e) => onChange({ expression, block: e.target.checked })}
            className="w-3.5 h-3.5 rounded border-card-border bg-background text-primary focus:ring-primary"
          />
          <span>Display Mode (Centered Block)</span>
        </label>
      </div>

      <input
        type="text"
        value={expression}
        onChange={(e) => onChange({ expression: e.target.value, block: isBlock })}
        placeholder="e.g. f(x) = \int_{-\infty}^{\infty} e^{-x^2} dx"
        className="w-full bg-[#030611] border border-card-border/60 rounded-xl px-3 py-2 text-sm font-mono text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
      />
    </div>
  )
}

// 4. Mermaid Block Editor
export function MermaidBlock({ block, onChange }: AdvancedBlockProps) {
  const code = block.data.code || "graph TD\n  A[Start] --> B(Process)\n  B --> C{Decision}\n  C -->|Yes| D[Success]\n  C -->|No| E[Fail]"

  return (
    <div className="flex flex-col gap-3 w-full p-4 rounded-xl border border-card-border/40 bg-background/50 font-sans">
      <span className="text-[10px] font-mono font-bold text-muted uppercase flex items-center gap-1 select-none border-b border-card-border/40 pb-2 mb-1">
        <GitPullRequest className="w-3.5 h-3.5 text-primary" /> Mermaid Diagram Flowchart
      </span>

      <textarea
        value={code}
        onChange={(e) => onChange({ code: e.target.value })}
        rows={6}
        placeholder="graph TD..."
        className="w-full bg-[#030611] border border-card-border/60 rounded-xl p-3 text-xs md:text-sm font-mono text-foreground focus:outline-none focus:ring-1 focus:ring-primary resize-y"
      />
    </div>
  )
}

// 5. Accordion Block Editor
export function AccordionBlock({ block, onChange }: AdvancedBlockProps) {
  const title = block.data.title || ""
  const content = block.data.content || ""

  return (
    <div className="flex flex-col gap-3 w-full p-4 rounded-xl border border-card-border/40 bg-background/50">
      <span className="text-[10px] font-mono font-bold text-muted uppercase flex items-center gap-1 select-none border-b border-card-border/40 pb-2 mb-1">
        <Minus className="w-3.5 h-3.5 text-primary" /> Accordion Panel
      </span>

      <div className="flex flex-col gap-2">
        <input
          type="text"
          value={title}
          onChange={(e) => onChange({ title: e.target.value, content })}
          placeholder="Accordion Title (Trigger header)"
          className="w-full bg-[#030611] border border-card-border/60 rounded-xl px-3 py-2 text-sm font-bold text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
        />
        <textarea
          value={content}
          onChange={(e) => onChange({ title, content: e.target.value })}
          rows={3}
          placeholder="Accordion content body (Markdown/Text)"
          className="w-full bg-[#030611] border border-card-border/60 rounded-xl p-3 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary resize-y"
        />
      </div>
    </div>
  )
}

// 6. Tabs Container Block Editor
export function TabsBlock({ block, onChange }: AdvancedBlockProps) {
  const tabsList: { title: string; content: string }[] = block.data.tabs || [
    { title: "Tab 1", content: "Content 1" },
  ]

  const updateTab = (index: number, field: "title" | "content", val: string) => {
    const nextTabs = tabsList.map((t, i) =>
      i === index ? { ...t, [field]: val } : t
    )
    onChange({ tabs: nextTabs })
  }

  const addTab = () => {
    onChange({ tabs: [...tabsList, { title: `Tab ${tabsList.length + 1}`, content: "" }] })
  }

  const deleteTab = (index: number) => {
    if (tabsList.length <= 1) return
    onChange({ tabs: tabsList.filter((_, i) => i !== index) })
  }

  return (
    <div className="flex flex-col gap-3 w-full p-4 rounded-xl border border-card-border/40 bg-background/50">
      <div className="flex items-center justify-between border-b border-card-border/40 pb-2 mb-1 select-none">
        <span className="text-[10px] font-mono font-bold text-muted uppercase flex items-center gap-1">
          <Layers className="w-3.5 h-3.5 text-primary" /> Tabs Container
        </span>
        <button
          type="button"
          onClick={addTab}
          className="flex items-center gap-0.5 px-2 py-1 text-[10px] font-bold rounded-lg border border-card-border text-muted hover:text-foreground hover:bg-background cursor-pointer"
        >
          <Plus className="w-3 h-3" /> Tab
        </button>
      </div>

      <div className="flex flex-col gap-4">
        {tabsList.map((tab, idx) => (
          <div key={idx} className="flex flex-col gap-2 p-3 rounded-xl border border-card-border/40 bg-card relative group/tab">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={tab.title}
                onChange={(e) => updateTab(idx, "title", e.target.value)}
                placeholder="Tab Label Title"
                className="flex-1 bg-background border border-card-border/60 rounded-xl px-3 py-1.5 text-xs font-bold text-foreground focus:outline-none"
              />
              {tabsList.length > 1 && (
                <button
                  type="button"
                  onClick={() => deleteTab(idx)}
                  className="p-1.5 rounded bg-red-950/20 text-red-400 hover:bg-red-900/30 transition-all cursor-pointer shrink-0"
                  title="Delete tab"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
            <textarea
              value={tab.content}
              onChange={(e) => updateTab(idx, "content", e.target.value)}
              rows={2}
              placeholder="Tab Content (Markdown)"
              className="w-full bg-background border border-card-border/60 rounded-xl p-3 text-xs text-foreground focus:outline-none resize-y"
            />
          </div>
        ))}
      </div>
    </div>
  )
}

// 7. Timeline Block Editor
export function TimelineBlock({ block, onChange }: AdvancedBlockProps) {
  const events: { date: string; title: string; content: string }[] = block.data.events || [
    { date: "2026-07", title: "Project Milestones", content: "Details of timeline milestone." },
  ]

  const updateEvent = (index: number, field: "date" | "title" | "content", val: string) => {
    const nextEvents = events.map((ev, i) =>
      i === index ? { ...ev, [field]: val } : ev
    )
    onChange({ events: nextEvents })
  }

  const addEvent = () => {
    onChange({ events: [...events, { date: "", title: "", content: "" }] })
  }

  const deleteEvent = (index: number) => {
    if (events.length <= 1) return
    onChange({ events: events.filter((_, i) => i !== index) })
  }

  return (
    <div className="flex flex-col gap-3 w-full p-4 rounded-xl border border-card-border/40 bg-background/50">
      <div className="flex items-center justify-between border-b border-card-border/40 pb-2 mb-1 select-none">
        <span className="text-[10px] font-mono font-bold text-muted uppercase flex items-center gap-1">
          <Calendar className="w-3.5 h-3.5 text-primary" /> Timeline Flow
        </span>
        <button
          type="button"
          onClick={addEvent}
          className="flex items-center gap-0.5 px-2 py-1 text-[10px] font-bold rounded-lg border border-card-border text-muted hover:text-foreground hover:bg-background cursor-pointer"
        >
          <Plus className="w-3 h-3" /> Event
        </button>
      </div>

      <div className="flex flex-col gap-4">
        {events.map((ev, idx) => (
          <div key={idx} className="grid grid-cols-1 sm:grid-cols-3 gap-2 p-3 rounded-xl border border-card-border/40 bg-card relative group/ev">
            
            <div className="flex flex-col gap-1.5">
              <label className="text-[9px] font-mono text-muted uppercase">Milestone Date</label>
              <input
                type="text"
                value={ev.date}
                onChange={(e) => updateEvent(idx, "date", e.target.value)}
                placeholder="e.g. July 2026"
                className="w-full bg-background border border-card-border/60 rounded-xl px-3 py-1.5 text-xs text-foreground focus:outline-none"
              />
            </div>
            
            <div className="flex flex-col gap-1.5 sm:col-span-2">
              <div className="flex items-center gap-2">
                <div className="flex-1 flex flex-col gap-1">
                  <label className="text-[9px] font-mono text-muted uppercase">Milestone Title</label>
                  <input
                    type="text"
                    value={ev.title}
                    onChange={(e) => updateEvent(idx, "title", e.target.value)}
                    placeholder="Milestone Event Title"
                    className="w-full bg-background border border-card-border/60 rounded-xl px-3 py-1.5 text-xs font-bold text-foreground focus:outline-none"
                  />
                </div>
                {events.length > 1 && (
                  <button
                    type="button"
                    onClick={() => deleteEvent(idx)}
                    className="p-1.5 rounded bg-red-950/20 text-red-400 hover:bg-red-900/30 transition-all cursor-pointer self-end mb-0.5"
                    title="Delete milestone"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

            <div className="flex flex-col gap-1.5 sm:col-span-3">
              <label className="text-[9px] font-mono text-muted uppercase">Description Detail</label>
              <textarea
                value={ev.content}
                onChange={(e) => updateEvent(idx, "content", e.target.value)}
                rows={2}
                placeholder="Event description detail"
                className="w-full bg-background border border-card-border/60 rounded-xl p-3 text-xs text-foreground focus:outline-none resize-y"
              />
            </div>

          </div>
        ))}
      </div>
    </div>
  )
}
