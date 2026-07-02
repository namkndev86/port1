"use client"

import { ArrowDown,ArrowRight, Trash2 } from "lucide-react"

import { type Block } from "../types"

interface TableBlockProps {
  block: Block
  onChange: (data: any) => void
}

export default function TableBlock({ block, onChange }: TableBlockProps) {
  const rows: string[][] = block.data.rows || [
    ["Header 1", "Header 2"],
    ["Cell A1", "Cell A2"],
  ]

  const updateCell = (rowIndex: number, colIndex: number, val: string) => {
    const nextRows = rows.map((r, ri) =>
      r.map((c, ci) => (ri === rowIndex && ci === colIndex ? val : c))
    )
    onChange({ rows: nextRows })
  }

  const addRow = () => {
    const colCount = rows[0]?.length || 2
    const newRow = Array.from({ length: colCount }).map(() => "")
    onChange({ rows: [...rows, newRow] })
  }

  const deleteRow = (rowIndex: number) => {
    if (rows.length <= 1) return
    onChange({ rows: rows.filter((_, ri) => ri !== rowIndex) })
  }

  const addColumn = () => {
    const nextRows = rows.map((r) => [...r, ""])
    onChange({ rows: nextRows })
  }

  const deleteColumn = (colIndex: number) => {
    if (rows[0]?.length <= 1) return
    const nextRows = rows.map((r) => r.filter((_, ci) => ci !== colIndex))
    onChange({ rows: nextRows })
  }

  return (
    <div className="flex flex-col gap-2 w-full p-4 rounded-xl border border-card-border/40 bg-background/50">
      
      {/* 1. Header controls */}
      <div className="flex items-center justify-between gap-4 border-b border-card-border/40 pb-2 mb-2 select-none">
        <span className="text-[10px] font-mono font-bold text-muted uppercase flex items-center gap-1">
          Grid Table Editor
        </span>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={addColumn}
            className="flex items-center gap-1 px-2 py-1 text-[10px] font-bold rounded-lg border border-card-border text-muted hover:text-foreground hover:bg-background cursor-pointer transition-colors"
          >
            <ArrowRight className="w-3.5 h-3.5" /> + Col
          </button>
          <button
            type="button"
            onClick={addRow}
            className="flex items-center gap-1 px-2 py-1 text-[10px] font-bold rounded-lg border border-card-border text-muted hover:text-foreground hover:bg-background cursor-pointer transition-colors"
          >
            <ArrowDown className="w-3.5 h-3.5" /> + Row
          </button>
        </div>
      </div>

      {/* 2. Scrollable Table content */}
      <div className="overflow-x-auto w-full border border-card-border/60 rounded-xl bg-card">
        <table className="w-full border-collapse text-left">
          <tbody>
            {rows.map((row, ri) => (
              <tr key={ri} className="border-b border-card-border/40 last:border-0 hover:bg-background/20 group/tr">
                {row.map((cell, ci) => (
                  <td key={ci} className="p-2 border-r border-card-border/40 last:border-0 min-w-[120px] relative">
                    <input
                      type="text"
                      value={cell}
                      onChange={(e) => updateCell(ri, ci, e.target.value)}
                      className="w-full bg-transparent text-foreground placeholder:text-muted/40 text-xs focus:outline-none py-1 block"
                      placeholder={`Cell [${ri},${ci}]`}
                    />
                    
                    {/* Delete Column button on top row */}
                    {ri === 0 && row.length > 1 && (
                      <button
                        type="button"
                        onClick={() => deleteColumn(ci)}
                        className="absolute right-1 top-1 p-0.5 rounded bg-red-950/20 text-red-400 opacity-0 hover:opacity-100 hover:bg-red-900/30 transition-all cursor-pointer"
                        title="Delete this column"
                      >
                        <Trash2 className="w-2.5 h-2.5" />
                      </button>
                    )}
                  </td>
                ))}

                {/* Delete Row button */}
                <td className="w-10 p-2 text-center select-none">
                  {rows.length > 1 && (
                    <button
                      type="button"
                      onClick={() => deleteRow(ri)}
                      className="p-1 rounded text-red-400 opacity-0 group-hover/tr:opacity-100 hover:bg-red-950/20 transition-all cursor-pointer"
                      title="Delete this row"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  )
}
