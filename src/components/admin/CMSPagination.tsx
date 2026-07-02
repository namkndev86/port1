"use client"

import { ChevronLeft, ChevronRight } from "lucide-react"

interface CMSPaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

export default function CMSPagination({ currentPage, totalPages, onPageChange }: CMSPaginationProps) {
  if (totalPages <= 1) return null

  // Generate page numbers to show
  const getPageNumbers = () => {
    const pages = []
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i)
    }
    return pages
  }

  const pages = getPageNumbers()

  return (
    <div className="flex items-center justify-between p-4 glass rounded-2xl border border-card-border/40 bg-[#040813]/20 shadow-md">
      
      {/* 1. Page Info text */}
      <span className="font-mono text-xs text-muted">
        Page <span className="text-white font-bold">{currentPage}</span> of{" "}
        <span className="text-white font-bold">{totalPages}</span>
      </span>

      {/* 2. Page Buttons */}
      <nav aria-label="CMS pagination" className="flex items-center gap-1.5">
        
        {/* Previous */}
        <button
          type="button"
          onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          aria-label="Go to previous page"
          className="p-2 rounded-xl border border-card-border/40 text-gray-400 hover:text-white disabled:opacity-30 disabled:hover:text-gray-400 hover:bg-white/5 transition-all cursor-pointer disabled:cursor-not-allowed"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {/* Page Indexes */}
        {pages.map((p) => {
          const isActive = p === currentPage
          return (
            <button
              key={p}
              type="button"
              onClick={() => onPageChange(p)}
              aria-label={`Go to page ${p}`}
              aria-current={isActive ? "page" : undefined}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
                isActive
                  ? "bg-primary border border-primary/20 text-white shadow-lg shadow-primary/10"
                  : "border border-card-border/40 text-gray-400 hover:text-white hover:bg-white/5"
              }`}
            >
              {p}
            </button>
          )
        })}

        {/* Next */}
        <button
          type="button"
          onClick={() => currentPage < totalPages && onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          aria-label="Go to next page"
          className="p-2 rounded-xl border border-card-border/40 text-gray-400 hover:text-white disabled:opacity-30 disabled:hover:text-gray-400 hover:bg-white/5 transition-all cursor-pointer disabled:cursor-not-allowed"
        >
          <ChevronRight className="w-4 h-4" />
        </button>

      </nav>

    </div>
  )
}
