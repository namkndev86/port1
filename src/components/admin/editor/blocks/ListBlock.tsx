"use client"

import { CheckSquare,List, ListOrdered, Plus, Trash2 } from "lucide-react"

import { type Block } from "../types"

interface ListBlockProps {
  block: Block
  onChange: (data: any) => void
}

export default function ListBlock({ block, onChange }: ListBlockProps) {
  const listType = block.data.listType || "bullet" // "bullet" | "ordered" | "todo"
  const items = block.data.items || [""]
  const checked = block.data.checked || items.map(() => false)

  const updateItem = (index: number, val: string) => {
    const nextItems = [...items]
    nextItems[index] = val
    onChange({ listType, items: nextItems, checked })
  }

  const toggleCheck = (index: number) => {
    const nextChecked = [...checked]
    nextChecked[index] = !nextChecked[index]
    onChange({ listType, items, checked: nextChecked })
  }

  const addItem = (index: number) => {
    const nextItems = [...items]
    const nextChecked = [...checked]
    nextItems.splice(index + 1, 0, "")
    nextChecked.splice(index + 1, 0, false)
    onChange({ listType, items: nextItems, checked: nextChecked })
  }

  const deleteItem = (index: number) => {
    if (items.length <= 1) return
    const nextItems = items.filter((itemVal: string, i: number) => i !== index)
    const nextChecked = checked.filter((checkVal: boolean, i: number) => i !== index)
    onChange({ listType, items: nextItems, checked: nextChecked })
  }

  return (
    <div className="flex flex-col gap-2 w-full p-3 rounded-xl border border-card-border/40 bg-background/50">
      {/* 1. Header controls */}
      <div className="flex items-center gap-2 border-b border-card-border/40 pb-2 mb-1">
        <button
          type="button"
          onClick={() => onChange({ listType: "bullet", items, checked })}
          className={`flex items-center gap-1 px-2.5 py-1 text-[10px] font-bold rounded-lg cursor-pointer transition-colors ${
            listType === "bullet" ? "bg-primary text-white" : "text-muted hover:bg-background"
          }`}
        >
          <List className="w-3.5 h-3.5" /> Bullet
        </button>
        <button
          type="button"
          onClick={() => onChange({ listType: "ordered", items, checked })}
          className={`flex items-center gap-1 px-2.5 py-1 text-[10px] font-bold rounded-lg cursor-pointer transition-colors ${
            listType === "ordered" ? "bg-primary text-white" : "text-muted hover:bg-background"
          }`}
        >
          <ListOrdered className="w-3.5 h-3.5" /> Ordered
        </button>
        <button
          type="button"
          onClick={() => onChange({ listType: "todo", items, checked })}
          className={`flex items-center gap-1 px-2.5 py-1 text-[10px] font-bold rounded-lg cursor-pointer transition-colors ${
            listType === "todo" ? "bg-primary text-white" : "text-muted hover:bg-background"
          }`}
        >
          <CheckSquare className="w-3.5 h-3.5" /> Checklist
        </button>
      </div>

      {/* 2. Items list */}
      <div className="flex flex-col gap-2">
        {items.map((item: string, index: number) => (
          <div key={index} className="flex items-center gap-2 group/row">
            {/* List Type indicators */}
            <div className="flex items-center justify-center shrink-0 w-6 font-mono text-xs text-muted">
              {listType === "bullet" && <span className="w-1.5 h-1.5 rounded-full bg-muted-dark" />}
              {listType === "ordered" && <span>{index + 1}.</span>}
              {listType === "todo" && (
                <label className="relative flex items-center justify-center cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={!!checked[index]}
                    onChange={() => toggleCheck(index)}
                    className="sr-only"
                  />
                  <div
                    className={`w-4 h-4 rounded border flex items-center justify-center transition-all ${
                      checked[index]
                        ? "bg-primary border-primary text-white"
                        : "border-card-border/80 bg-background text-transparent hover:border-primary/50"
                    }`}
                  >
                    {checked[index] && (
                      <svg className="w-2.5 h-2.5 stroke-current" viewBox="0 0 24 24" fill="none" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                    )}
                  </div>
                </label>
              )}
            </div>

            {/* List Item Input */}
            <input
              type="text"
              value={item}
              onChange={(e) => updateItem(index, e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault()
                  addItem(index)
                } else if (e.key === "Backspace" && item === "" && items.length > 1) {
                  e.preventDefault()
                  deleteItem(index)
                }
              }}
              placeholder="List item..."
              className={`flex-1 bg-transparent text-foreground placeholder:text-muted/60 text-sm focus:outline-none py-0.5 ${
                listType === "todo" && checked[index] ? "line-through text-muted opacity-60" : ""
              }`}
            />

            {/* Actions */}
            <div className="opacity-0 group-hover/row:opacity-100 flex items-center gap-1 transition-opacity">
              <button
                type="button"
                onClick={() => addItem(index)}
                className="p-1 rounded text-muted hover:text-foreground hover:bg-background cursor-pointer"
                title="Add new item below"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
              {items.length > 1 && (
                <button
                  type="button"
                  onClick={() => deleteItem(index)}
                  className="p-1 rounded text-red-400/80 hover:text-red-400 hover:bg-red-950/20 cursor-pointer"
                  title="Remove item"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
