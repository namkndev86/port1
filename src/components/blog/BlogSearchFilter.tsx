"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { useState, useTransition } from "react"
import { Search, Loader2 } from "lucide-react"
import { BlogCategory } from "@prisma/client"

import { useTranslation } from "@/components/common/locale-provider"

interface BlogSearchFilterProps {
  categories: BlogCategory[]
}

export default function BlogSearchFilter({ categories }: BlogSearchFilterProps) {
  const { t, locale } = useTranslation()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()

  // Get current query states
  const currentCategory = searchParams.get("category") || ""
  const currentSearch = searchParams.get("search") || ""

  const [searchVal, setSearchVal] = useState(currentSearch)

  const updateFilters = (category: string, search: string) => {
    const params = new URLSearchParams()
    if (category) params.set("category", category)
    if (search) params.set("search", search)
    params.set("page", "1") // Reset to page 1

    startTransition(() => {
      router.push(`/${locale}/blog?${params.toString()}`)
    })
  }

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    updateFilters(currentCategory, searchVal)
  }

  return (
    <div className="flex flex-col gap-6 w-full border-b border-card-border/40 pb-8">
      {/* Search Input bar */}
      <form onSubmit={handleSearchSubmit} className="relative max-w-md w-full">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
        <input
          type="text"
          value={searchVal}
          onChange={(e) => setSearchVal(e.target.value)}
          placeholder={t('blog.search')}
          className="w-full pl-9 pr-12 py-2.5 bg-[#050811] border border-card-border rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-primary transition-colors text-sm"
        />
        {isPending ? (
          <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-primary animate-spin" />
        ) : (
          searchVal !== currentSearch && (
            <button
              type="submit"
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs font-semibold text-primary hover:text-white transition-colors cursor-pointer"
            >
              Apply
            </button>
          )
        )}
      </form>
 
       {/* Category Pills list */}
      <div className="flex flex-wrap gap-2.5 items-center">
        <span className="text-xs font-mono text-muted uppercase tracking-wider mr-2">Categories:</span>
        <button
          onClick={() => updateFilters("", searchVal)}
          className={`px-4 py-1.5 rounded-full text-xs font-semibold cursor-pointer border transition-all duration-300 ${
            currentCategory === ""
              ? "bg-primary border-primary text-white"
              : "glass text-muted hover:text-white hover:border-primary/40"
          }`}
        >
          {t('blog.categories.all')}
        </button>

        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => updateFilters(cat.slug, searchVal)}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold cursor-pointer border transition-all duration-300 ${
              currentCategory === cat.slug
                ? "bg-primary border-primary text-white"
                : "glass text-muted hover:text-white hover:border-primary/40"
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>
    </div>
  )
}
