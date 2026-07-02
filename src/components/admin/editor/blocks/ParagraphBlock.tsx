"use client"

import { useEffect, useRef } from "react"
import { Block } from "../types"

interface ParagraphBlockProps {
  block: Block
  onChange: (data: any) => void
  onKeyDown?: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void
  placeholder?: string
  dataBlockIdx?: number
}

export default function ParagraphBlock({
  block,
  onChange,
  onKeyDown,
  placeholder = "Type '/' for commands...",
  dataBlockIdx,
}: ParagraphBlockProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const adjustHeight = () => {
    const el = textareaRef.current
    if (el) {
      el.style.height = "auto"
      el.style.height = `${el.scrollHeight}px`
    }
  }

  useEffect(() => {
    adjustHeight()
  }, [block.data.text])

  return (
    <textarea
      ref={textareaRef}
      value={block.data.text || ""}
      onChange={(e) => {
        onChange({ text: e.target.value })
        adjustHeight()
      }}
      onKeyDown={onKeyDown}
      placeholder={placeholder}
      rows={1}
      data-block-idx={dataBlockIdx}
      className="w-full bg-transparent text-foreground placeholder:text-muted focus:outline-none resize-none overflow-hidden text-sm md:text-base leading-relaxed py-1 block"
    />
  )
}
