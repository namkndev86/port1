"use client"

import { BookOpen, Briefcase, FolderGit2, Mail, Plus,Sparkles } from "lucide-react"

interface CMSEmptyStateProps {
  type: "projects" | "blog" | "skills" | "experience" | "messages"
  hasFilters: boolean
  onAddClick: () => void
}

export default function CMSEmptyState({ type, hasFilters, onAddClick }: CMSEmptyStateProps) {
  
  // Icon based on type
  const Icon = {
    projects: FolderGit2,
    blog: BookOpen,
    skills: Sparkles,
    experience: Briefcase,
    messages: Mail,
  }[type]

  const label = {
    projects: "project post",
    blog: "blog article",
    skills: "skill metric",
    experience: "work experience entry",
    messages: "incoming message",
  }[type]

  const title = hasFilters ? "No items match your filters" : `No ${label}s created yet`
  const desc = hasFilters
    ? "Try clearing your search query or reset status filters to find what you are looking for."
    : `Create your very first ${label} to start showcasing it on your developer portfolio.`

  const showAdd = type !== "messages" && !hasFilters

  return (
    <div className="flex flex-col items-center justify-center text-center p-8 md:p-16 glass rounded-2xl border border-card-border/30 bg-card/30 py-16">
      
      {/* Icon Graphic */}
      <div className="p-4 rounded-2xl bg-background border border-card-border text-primary/40 mb-4 shrink-0 animate-pulse-slow">
        <Icon className="w-10 h-10" />
      </div>

      <h3 className="font-display font-bold text-base md:text-lg text-foreground mb-1.5">
        {title}
      </h3>
      
      <p className="text-muted text-xs md:text-sm max-w-sm leading-relaxed mb-6 font-sans">
        {desc}
      </p>

      {showAdd && (
        <button
          type="button"
          onClick={onAddClick}
          className="flex items-center gap-1.5 px-4.5 py-2.5 bg-accent hover:bg-accent-hover text-white text-xs font-semibold rounded-xl cursor-pointer transition-all shadow-lg shadow-accent/15 select-none"
        >
          <Plus className="w-4 h-4" />
          Add First {type.replace(/^\w/, (c) => c.toUpperCase()).slice(0, -1)}
        </button>
      )}

    </div>
  )
}
