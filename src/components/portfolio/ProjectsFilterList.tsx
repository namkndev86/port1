"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import { ArrowUpRight, Code2, Search } from "lucide-react"
import { ProjectWithImages } from "@/repositories/project.repository"

import { useTranslation } from "@/components/common/locale-provider"

interface ProjectsFilterListProps {
  projects: ProjectWithImages[]
}

export default function ProjectsFilterList({ projects }: ProjectsFilterListProps) {
  const { t, locale } = useTranslation()
  const [selectedTag, setSelectedTag] = useState<string>("All")
  const [searchQuery, setSearchQuery] = useState("")

  const allLabel = locale === "vi" ? "Tất cả" : locale === "ja" ? "すべて" : "All"

  // Extract all unique tags
  const allTags = [allLabel, ...Array.from(new Set(projects.flatMap((p) => p.techStack)))]

  // Filter projects based on tag and search
  const filteredProjects = projects.filter((project) => {
    const isAll = selectedTag === allLabel || selectedTag === "All"
    const matchesTag = isAll || project.techStack.includes(selectedTag)
    const matchesSearch =
      project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.techStack.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()))
    return matchesTag && matchesSearch
  })

  return (
    <div className="flex flex-col gap-8 w-full">
      {/* Search & Filter bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 border-b border-card-border/40 pb-6">
        
        {/* Search */}
        <div className="relative max-w-sm w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={
              locale === "vi"
                ? "Tìm kiếm dự án..."
                : locale === "ja"
                ? "プロジェクトを検索..."
                : "Search projects..."
            }
            className="w-full pl-9 pr-4 py-2.5 bg-[#050811] border border-card-border rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-primary transition-colors text-sm"
          />
        </div>

        {/* Tag Filters list */}
        <div className="flex flex-wrap gap-2 max-w-full overflow-x-auto no-scrollbar py-1">
          {allTags.slice(0, 8).map((tag) => (
            <button
              key={tag}
              onClick={() => setSelectedTag(tag)}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold cursor-pointer border transition-all duration-300 ${
                selectedTag === tag
                  ? "bg-primary border-primary text-white"
                  : "glass text-muted hover:text-white hover:border-primary/40"
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* Projects Grid List */}
      <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <AnimatePresence mode="popLayout">
          {filteredProjects.map((project) => (
            <motion.div
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              key={project.id}
              className="glass rounded-2xl overflow-hidden hover:border-primary/20 hover:shadow-2xl transition-all duration-300 flex flex-col h-full group"
            >
              {/* Image Banner */}
              <div className="h-44 w-full bg-[#080d1e] border-b border-card-border flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-primary/5 group-hover:bg-primary/10 transition-colors" />
                {project.images?.[0]?.url ? (
                  <img
                    src={project.images[0].url}
                    alt={project.images[0].alt || project.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <Code2 className="w-12 h-12 text-primary/30 group-hover:scale-110 transition-transform duration-500" />
                )}
              </div>

              {/* Card content details */}
              <div className="p-5 flex flex-col flex-1 gap-4">
                <h3 className="font-display font-bold text-lg text-white group-hover:text-primary transition-colors">
                  {project.title}
                </h3>
                <p className="text-muted text-xs md:text-sm leading-relaxed flex-1">
                  {project.description}
                </p>

                {/* Badges */}
                <div className="flex flex-wrap gap-1.5 py-1">
                  {project.techStack.map((t) => (
                    <span key={t} className="px-2 py-0.5 rounded bg-card-border/60 border border-card-border/80 text-[9px] font-mono text-gray-300 uppercase">
                      {t}
                    </span>
                  ))}
                </div>

                <div className="border-t border-card-border/40 pt-4 flex items-center justify-between">
                  <Link
                    href={`/${locale}/portfolio/projects/${project.slug}`}
                    className="text-xs font-semibold text-white group-hover:text-primary flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    {t('portfolio.projects.details')}
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </Link>
                  {project.demoUrl && (
                    <a
                      href={project.demoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[10px] text-muted hover:text-white transition-colors cursor-pointer"
                    >
                      {t('portfolio.projects.demo')}
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Empty State */}
      {filteredProjects.length === 0 && (
        <div className="text-center py-20 border border-dashed border-card-border/60 rounded-3xl">
          <p className="text-muted text-sm">
            {locale === "vi"
              ? "Không tìm thấy dự án nào phù hợp."
              : locale === "ja"
              ? "該当するプロジェクトが見つかりませんでした。"
              : "No projects matched the selected filters."}
          </p>
        </div>
      )}
    </div>
  )
}
