"use client"

import { useMemo } from "react"
import { BarChart3, Globe, ShieldAlert, FileText, CheckCircle2, MessageSquare, Briefcase, Sparkles, FolderGit2 } from "lucide-react"

interface CMSStatsProps {
  type: "projects" | "blog" | "skills" | "experience" | "messages"
  items: any[]
}

export default function CMSStats({ type, items }: CMSStatsProps) {
  const stats = useMemo(() => {
    const total = items.length

    if (type === "blog") {
      const published = items.filter((item) => item.published && !item.archived).length
      const draft = items.filter((item) => !item.published && !item.archived).length
      const archived = items.filter((item) => item.archived).length
      return [
        { label: "Total Articles", count: total, icon: FileText, color: "text-primary" },
        { label: "Published", count: published, icon: Globe, color: "text-emerald-400" },
        { label: "Drafts", count: draft, icon: BarChart3, color: "text-amber-400" },
        { label: "Archived", count: archived, icon: ShieldAlert, color: "text-rose-400" },
      ]
    }

    if (type === "projects") {
      const active = items.filter((item) => item.active).length
      const inactive = items.filter((item) => !item.active).length
      const featured = items.filter((item) => item.featured).length
      return [
        { label: "Total Projects", count: total, icon: FolderGit2, color: "text-primary" },
        { label: "Active", count: active, icon: CheckCircle2, color: "text-emerald-400" },
        { label: "Inactive", count: inactive, icon: ShieldAlert, color: "text-rose-400" },
        { label: "Featured Showcase", count: featured, icon: Sparkles, color: "text-amber-400" },
      ]
    }

    if (type === "skills") {
      const active = items.filter((item) => item.active).length
      const inactive = items.filter((item) => !item.active).length
      return [
        { label: "Total Skills", count: total, icon: Sparkles, color: "text-primary" },
        { label: "Active in Portfolio", count: active, icon: CheckCircle2, color: "text-emerald-400" },
        { label: "Inactive (Hidden)", count: inactive, icon: ShieldAlert, color: "text-rose-400" },
      ]
    }

    if (type === "experience") {
      const current = items.filter((item) => item.current).length
      const past = items.filter((item) => !item.current).length
      return [
        { label: "Job Postings", count: total, icon: Briefcase, color: "text-primary" },
        { label: "Current Employment", count: current, icon: CheckCircle2, color: "text-emerald-400" },
        { label: "Past Experiences", count: past, icon: Globe, color: "text-muted" },
      ]
    }

    // messages
    const unread = items.filter((item) => !item.read).length
    const read = items.filter((item) => item.read).length
    return [
      { label: "Inbox Total", count: total, icon: MessageSquare, color: "text-primary" },
      { label: "New (Unread)", count: unread, icon: ShieldAlert, color: "text-emerald-400" },
      { label: "Read Messages", count: read, icon: CheckCircle2, color: "text-muted" },
    ]
  }, [type, items])

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full">
      {stats.map((stat, i) => {
        const Icon = stat.icon
        return (
          <div
            key={i}
            className="glass rounded-2xl p-4 border border-card-border/40 bg-card flex items-center justify-between gap-4 shadow-sm"
          >
            <div className="flex flex-col gap-1">
              <span className="text-[11px] font-mono font-semibold tracking-wider text-muted uppercase">
                {stat.label}
              </span>
              <span className={`text-2xl font-black font-mono leading-none ${stat.color}`}>
                {stat.count}
              </span>
            </div>
            <div className="p-2.5 bg-background rounded-xl border border-card-border/40 shrink-0">
              <Icon className={`w-4 h-4 ${stat.color}`} />
            </div>
          </div>
        )
      })}
    </div>
  )
}
