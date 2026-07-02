"use client"

import { useEffect,useRef, useState } from "react"

import { ChevronDown, Loader2 } from "lucide-react"

interface CMSStatusBadgeProps {
  type: "projects" | "blog" | "skills" | "experience" | "messages"
  item: any
  onStatusChange: (id: string, newStatus: any) => Promise<void>
}

export default function CMSStatusBadge({ type, item, onStatusChange }: CMSStatusBadgeProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Click outside to close dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  // 1. Compute current status properties
  const badgeProps = (() => {
    if (type === "blog") {
      if (item.archived) {
        return { label: "Archived", style: "bg-rose-500/10 border-rose-500/20 text-rose-300" }
      }
      if (item.published) {
        return { label: "Published", style: "bg-emerald-500/10 border-emerald-500/20 text-emerald-300" }
      }
      return { label: "Draft", style: "bg-amber-500/10 border-amber-500/20 text-amber-300" }
    }

    if (type === "projects" || type === "skills") {
      if (item.active) {
        return { label: "Active", style: "bg-emerald-500/10 border-emerald-500/20 text-emerald-300" }
      }
      return { label: "Inactive", style: "bg-rose-500/10 border-rose-500/20 text-rose-300" }
    }

    if (type === "experience") {
      if (item.current) {
        return { label: "Current Job", style: "bg-emerald-500/10 border-emerald-500/20 text-emerald-300" }
      }
      return { label: "Past Job", style: "bg-card border border-card-border/60 text-muted" }
    }

    // messages
    if (item.read) {
      return { label: "Read", style: "bg-card border border-card-border/60 text-muted" }
    }
    return { label: "Unread", style: "bg-emerald-500/10 border-emerald-500/20 text-emerald-300" }
  })()

  // 2. Options available for change
  const options = (() => {
    if (type === "blog") {
      return [
        { label: "Draft", value: "draft", active: !item.published && !item.archived },
        { label: "Published", value: "published", active: item.published && !item.archived },
        { label: "Archived", value: "archived", active: item.archived },
      ]
    }
    if (type === "projects" || type === "skills") {
      return [
        { label: "Active", value: "active", active: item.active },
        { label: "Inactive", value: "inactive", active: !item.active },
      ]
    }
    if (type === "experience") {
      return [
        { label: "Current Job", value: "current", active: item.current },
        { label: "Past Job", value: "past", active: !item.current },
      ]
    }
    if (type === "messages") {
      return [
        { label: "Unread", value: "unread", active: !item.read },
        { label: "Read", value: "read", active: item.read },
      ]
    }
    return []
  })()

  const handleSelect = async (val: string) => {
    setIsOpen(false)
    setIsUpdating(true)
    try {
      if (type === "blog") {
        if (val === "draft") await onStatusChange(item.id, { published: false, archived: false })
        else if (val === "published") await onStatusChange(item.id, { published: true, archived: false })
        else if (val === "archived") await onStatusChange(item.id, { archived: true })
      } else if (type === "projects" || type === "skills") {
        await onStatusChange(item.id, val === "active")
      } else if (type === "experience") {
        await onStatusChange(item.id, val === "current")
      } else if (type === "messages") {
        await onStatusChange(item.id, val === "read")
      }
    } catch (err) {
      console.error("Status toggle error:", err)
    } finally {
      setIsUpdating(false)
    }
  }

  return (
    <div ref={dropdownRef} className="relative inline-block text-left">
      <button
        onClick={() => !isUpdating && setIsOpen(!isOpen)}
        disabled={isUpdating}
        className={`px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold border transition-all inline-flex items-center gap-1 cursor-pointer select-none focus-visible:ring-1 focus-visible:ring-primary focus-visible:outline-none ${badgeProps.style}`}
      >
        {isUpdating ? (
          <Loader2 className="w-3 h-3 animate-spin" />
        ) : (
          <>
            <span>{badgeProps.label}</span>
            <ChevronDown className="w-3 h-3 opacity-60" />
          </>
        )}
      </button>

      {isOpen && (
        <div className="absolute left-0 mt-1.5 w-28 rounded-xl bg-card border border-card-border/85 shadow-2xl z-20 overflow-hidden py-1">
          {options.map((opt) => (
            <button
              key={opt.value}
              onClick={() => handleSelect(opt.value)}
              className={`w-full text-left px-3 py-1.5 text-[10px] font-semibold font-mono hover:bg-background/80 transition-colors cursor-pointer flex items-center justify-between ${
                opt.active ? "text-primary bg-primary/5" : "text-muted hover:text-foreground"
              }`}
            >
              {opt.label}
              {opt.active && <span className="w-1.5 h-1.5 rounded-full bg-primary" />}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
