"use client"

import { Eye, Edit3, Copy, Trash2, Calendar, User, Tag } from "lucide-react"
import CMSStatusBadge from "./CMSStatusBadge"

interface CMSCardProps {
  type: "projects" | "blog" | "skills" | "experience" | "messages"
  item: any
  isSelected: boolean
  onSelectToggle: (id: string) => void
  onView: (item: any) => void
  onEdit: (item: any) => void
  onDuplicate: (id: string) => void
  onDelete: (id: string) => void
  onStatusChange: (id: string, newStatus: any) => Promise<void>
}

export default function CMSCard({
  type,
  item,
  isSelected,
  onSelectToggle,
  onView,
  onEdit,
  onDuplicate,
  onDelete,
  onStatusChange,
}: CMSCardProps) {
  
  // Format relative time / date
  const formatDates = () => {
    const created = new Date(item.createdAt || Date.now())
    const updated = new Date(item.updatedAt || Date.now())
    return {
      created: created.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "2-digit" }),
      updated: updated.toLocaleDateString(undefined, { month: "short", day: "numeric" }),
    }
  }

  const dates = formatDates()
  const hasEdit = type !== "messages"
  const hasDuplicate = type !== "messages"

  // Title and Subtitle compute
  const details = (() => {
    if (type === "blog") {
      return {
        title: item.title,
        subtitle: `/${item.slug}`,
        body: item.summary,
        metaIcon: Tag,
        metaText: item.category?.name || "Uncategorized",
      }
    }
    if (type === "projects") {
      return {
        title: item.title,
        subtitle: `/${item.slug}`,
        body: item.description,
        metaIcon: null,
        metaText: item.techStack ? item.techStack.slice(0, 3).join(", ") : "",
      }
    }
    if (type === "skills") {
      return {
        title: item.name,
        subtitle: `Proficiency: ${item.proficiency}%`,
        body: `Category: ${item.category}`,
        metaIcon: null,
        metaText: "",
      }
    }
    if (type === "experience") {
      return {
        title: item.role,
        subtitle: item.company,
        body: item.description.substring(0, 120) + (item.description.length > 120 ? "..." : ""),
        metaIcon: null,
        metaText: item.location || "",
      }
    }
    // messages
    return {
      title: item.subject,
      subtitle: `From: ${item.name} (${item.email})`,
      body: item.message.substring(0, 120) + (item.message.length > 120 ? "..." : ""),
      metaIcon: User,
      metaText: item.name,
    }
  })()

  return (
    <div
      className={`glass rounded-2xl border transition-all duration-300 p-5 flex gap-4 items-start select-none ${
        isSelected
          ? "border-primary/40 bg-primary/5 shadow-lg shadow-primary/5"
          : "border-card-border/40 hover:border-card-border/80 bg-card/45"
      }`}
    >
      {/* 1. Selection Checkbox */}
      <div className="pt-1.5 shrink-0">
        <label className="relative flex items-center justify-center cursor-pointer">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={() => onSelectToggle(item.id)}
            aria-label={`Select row for bulk actions`}
            className="sr-only"
          />
          <div
            className={`w-4.5 h-4.5 rounded border flex items-center justify-center transition-all ${
              isSelected
                ? "bg-primary border-primary text-white shadow-md shadow-primary/20"
                : "border-card-border/80 bg-background text-transparent hover:border-primary/50"
            }`}
          >
            {isSelected && (
              <svg className="w-3 h-3 stroke-current" viewBox="0 0 24 24" fill="none" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            )}
          </div>
        </label>
      </div>

      {/* 2. Middle Content Section */}
      <div className="flex-1 min-w-0 flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div className="flex-1 min-w-0 flex flex-col gap-1.5">
          <div className="flex flex-wrap items-center gap-2">
            <h4 className="font-display font-bold text-sm md:text-base text-foreground truncate shrink-0 max-w-full">
              {details.title}
            </h4>
            <span className="shrink-0">
              <CMSStatusBadge type={type} item={item} onStatusChange={onStatusChange} />
            </span>
          </div>

          <p className="font-mono text-[10px] md:text-xs text-muted truncate leading-none">
            {details.subtitle}
          </p>

          <p className="text-muted-dark text-xs md:text-sm leading-relaxed line-clamp-1 mt-1 font-sans">
            {details.body}
          </p>

          {/* Date and Meta Row */}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[10px] font-mono text-gray-500 mt-2">
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              Created {dates.created}
            </span>
            {item.updatedAt && (
              <span className="hidden sm:inline">
                • Updated {dates.updated}
              </span>
            )}
            {details.metaText && (
              <span className="px-2 py-0.5 rounded bg-background border border-card-border text-[9px] text-muted capitalize">
                {details.metaText}
              </span>
            )}
          </div>
        </div>

        {/* 3. Action Buttons Section */}
        <div className="flex items-center gap-1 shrink-0 bg-background/70 border border-card-border p-1.5 rounded-xl self-end md:self-center">
          {/* View Button */}
          <button
            onClick={() => onView(item)}
            className="p-2 rounded-lg text-muted hover:text-foreground hover:bg-background/80 transition-colors cursor-pointer"
            title="Preview Details"
            aria-label="Preview details"
          >
            <Eye className="w-4 h-4" />
          </button>

          {/* Edit Button */}
          {hasEdit && (
            <button
              onClick={() => onEdit(item)}
              className="p-2 rounded-lg text-muted hover:text-foreground hover:bg-background/80 transition-colors cursor-pointer"
              title="Edit Element"
              aria-label="Edit item"
            >
              <Edit3 className="w-4 h-4" />
            </button>
          )}

          {/* Duplicate Button */}
          {hasDuplicate && (
            <button
              onClick={() => onDuplicate(item.id)}
              className="p-2 rounded-lg text-muted hover:text-foreground hover:bg-background/80 transition-colors cursor-pointer"
              title="Duplicate Element"
              aria-label="Duplicate item"
            >
              <Copy className="w-4 h-4" />
            </button>
          )}

          {/* Delete Button */}
          <button
            onClick={() => onDelete(item.id)}
            className="p-2 rounded-lg text-red-400/80 hover:text-red-400 hover:bg-red-950/20 transition-colors cursor-pointer"
            title="Delete Element"
            aria-label="Delete item"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
