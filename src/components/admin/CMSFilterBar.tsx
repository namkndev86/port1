"use client"

import { Search, Plus, CalendarRange, ListFilter, ArrowUpDown, X } from "lucide-react"

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

  return (
    <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between w-full p-4 glass rounded-2xl border border-card-border/40 bg-[#040813]/60 shadow-lg">
      
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
          className="w-full pl-10 pr-9 py-2.5 bg-[#030611] border border-card-border/60 rounded-xl text-white text-sm placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:border-primary/50 transition-all font-sans"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 rounded-lg text-gray-500 hover:text-white transition-colors cursor-pointer"
            aria-label="Clear search query"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* 2. Filters & Actions toolbar */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Status Filter */}
        <div className="flex items-center gap-2 relative">
          <span className="text-gray-500 shrink-0 hidden sm:inline">
            <ListFilter className="w-4 h-4" />
          </span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            aria-label="Filter by Status"
            className="px-3.5 py-2.5 bg-[#030611] border border-card-border/60 rounded-xl text-xs font-semibold text-gray-300 hover:text-white transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            {statusOptions.map((opt) => (
              <option key={opt.value} value={opt.value} className="bg-[#0b0f19]">
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {/* Sort selector */}
        <div className="flex items-center gap-2 relative">
          <span className="text-gray-500 shrink-0 hidden sm:inline">
            <ArrowUpDown className="w-4 h-4" />
          </span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            aria-label="Sort options"
            className="px-3.5 py-2.5 bg-[#030611] border border-card-border/60 rounded-xl text-xs font-semibold text-gray-300 hover:text-white transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            {sortOptions.map((opt) => (
              <option key={opt.value} value={opt.value} className="bg-[#0b0f19]">
                {opt.label}
              </option>
            ))}
          </select>
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
