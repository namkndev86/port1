"use client"

import { useState, useRef, useEffect } from "react"
import { Search, Plus, ListFilter, ArrowUpDown, X, ChevronDown } from "lucide-react"

interface CMSFilterBarProps {
  type: "projects" | "blog" | "skills" | "experience" | "messages"
  searchQuery: string
  setSearchQuery: (val: string) => void
  statusFilter: string
  setStatusFilter: (val: string) => void
  sortBy: string
  setSortBy: (val: string) => void
  showForm: boolean
  onAddClick: () => void
}

export default function CMSFilterBar({
  type,
  searchQuery,
  setSearchQuery,
  statusFilter,
  setStatusFilter,
  sortBy,
  setSortBy,
  showForm,
  onAddClick,
}: CMSFilterBarProps) {
  const [statusOpen, setStatusOpen] = useState(false)
  const [sortOpen, setSortOpen] = useState(false)
  const statusRef = useRef<HTMLDivElement>(null)
  const sortRef = useRef<HTMLDivElement>(null)

  // Close dropdowns on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (statusRef.current && !statusRef.current.contains(event.target as Node)) {
        setStatusOpen(false)
      }
      if (sortRef.current && !sortRef.current.contains(event.target as Node)) {
        setSortOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])
  
  // Status options mapping based on resource type
  const statusOptions = {
    blog: [
      { label: "All Statuses", value: "all" },
      { label: "Published Only", value: "published" },
      { label: "Drafts Only", value: "draft" },
      { label: "Archived Only", value: "archived" },
    ],
    projects: [
      { label: "All Projects", value: "all" },
      { label: "Active Only", value: "active" },
      { label: "Inactive Only", value: "inactive" },
      { label: "Featured Only", value: "featured" },
    ],
    skills: [
      { label: "All Skills", value: "all" },
      { label: "Active Only", value: "active" },
      { label: "Inactive Only", value: "inactive" },
    ],
    experience: [
      { label: "All Experience", value: "all" },
      { label: "Current Role", value: "current" },
      { label: "Past Roles", value: "past" },
    ],
    messages: [
      { label: "All Messages", value: "all" },
      { label: "Unread Only", value: "unread" },
      { label: "Read Only", value: "read" },
    ],
  }[type]

  // Sorting options
  const sortOptions = [
    { label: "Newest Created", value: "newest" },
    { label: "Oldest Created", value: "oldest" },
    { label: "Recently Updated", value: "updated" },
    { label: "Title A-Z", value: "title_az" },
    { label: "Title Z-A", value: "title_za" },
  ]

  const showAddBtn = type !== "messages"
  const currentStatusLabel = statusOptions.find((opt) => opt.value === statusFilter)?.label || "All Statuses"
  const currentSortLabel = sortOptions.find((opt) => opt.value === sortBy)?.label || "Newest Created"

  return (
    <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between w-full p-4 glass rounded-2xl border border-card-border/40 bg-card/60 shadow-lg relative">
      
      {/* 1. Search Box with Icon */}
      <div className="flex-1 min-w-[200px] relative">
        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500">
          <Search className="w-4 h-4" />
        </span>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={`Search by title or details...`}
          aria-label="Search CMS list items"
          className="w-full pl-10 pr-9 py-2.5 bg-background border border-card-border rounded-xl text-foreground text-sm placeholder:text-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:border-primary/50 transition-all font-sans"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 rounded-lg text-muted hover:text-foreground transition-colors cursor-pointer"
            aria-label="Clear search query"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* 2. Filters & Actions toolbar */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Status Filter Dropdown */}
        <div ref={statusRef} className="flex items-center gap-2 relative">
          <span className="text-gray-500 shrink-0 hidden sm:inline">
            <ListFilter className="w-4 h-4" />
          </span>
          <button
            type="button"
            onClick={() => {
              setStatusOpen(!statusOpen)
              setSortOpen(false)
            }}
            className="px-4 py-2.5 bg-background border border-card-border rounded-xl text-xs font-semibold text-muted hover:text-foreground transition-colors cursor-pointer flex items-center gap-1.5 focus:outline-none focus:ring-2 focus:ring-primary select-none w-40 justify-between"
          >
            <span className="truncate">{currentStatusLabel}</span>
            <ChevronDown className="w-3.5 h-3.5 opacity-60 shrink-0" />
          </button>

          {statusOpen && (
            <div className="absolute right-0 top-full mt-1.5 w-44 rounded-xl bg-card border border-card-border/85 shadow-2xl z-20 overflow-hidden py-1">
              {statusOptions.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => {
                    setStatusFilter(opt.value)
                    setStatusOpen(false)
                  }}
                  className={`w-full text-left px-4 py-2 text-xs font-semibold hover:bg-background/80 transition-colors cursor-pointer flex items-center justify-between ${
                    opt.value === statusFilter ? "text-primary bg-primary/5" : "text-muted hover:text-foreground"
                  }`}
                >
                  {opt.label}
                  {opt.value === statusFilter && <span className="w-1.5 h-1.5 rounded-full bg-primary" />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Sort Selector Dropdown */}
        <div ref={sortRef} className="flex items-center gap-2 relative">
          <span className="text-gray-500 shrink-0 hidden sm:inline">
            <ArrowUpDown className="w-4 h-4" />
          </span>
          <button
            type="button"
            onClick={() => {
              setSortOpen(!sortOpen)
              setStatusOpen(false)
            }}
            className="px-4 py-2.5 bg-background border border-card-border rounded-xl text-xs font-semibold text-muted hover:text-foreground transition-colors cursor-pointer flex items-center gap-1.5 focus:outline-none focus:ring-2 focus:ring-primary select-none w-44 justify-between"
          >
            <span className="truncate">{currentSortLabel}</span>
            <ChevronDown className="w-3.5 h-3.5 opacity-60 shrink-0" />
          </button>

          {sortOpen && (
            <div className="absolute right-0 top-full mt-1.5 w-48 rounded-xl bg-card border border-card-border/85 shadow-2xl z-20 overflow-hidden py-1">
              {sortOptions.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => {
                    setSortBy(opt.value)
                    setSortOpen(false)
                  }}
                  className={`w-full text-left px-4 py-2 text-xs font-semibold hover:bg-background/80 transition-colors cursor-pointer flex items-center justify-between ${
                    opt.value === sortBy ? "text-primary bg-primary/5" : "text-muted hover:text-foreground"
                  }`}
                >
                  {opt.label}
                  {opt.value === sortBy && <span className="w-1.5 h-1.5 rounded-full bg-primary" />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Create/Add Item toggle */}
        {showAddBtn && (
          <button
            onClick={onAddClick}
            className={`flex items-center gap-1.5 px-4.5 py-2.5 text-xs font-semibold rounded-xl cursor-pointer transition-all shadow-lg select-none ${
              showForm
                ? "bg-red-950/20 hover:bg-red-900/30 text-red-200 border border-red-500/20 shadow-red-950/5"
                : "bg-accent hover:bg-accent-hover text-white shadow-accent/15"
            }`}
          >
            {showForm ? (
              <>Cancel Form</>
            ) : (
              <>
                <Plus className="w-4 h-4" />
                Add {type === "blog" ? "Blog" : type.slice(0, -1).replace(/^\w/, (c) => c.toUpperCase())}
              </>
            )}
          </button>
        )}
      </div>

    </div>
  )
}
