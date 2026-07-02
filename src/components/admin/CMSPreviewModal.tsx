"use client"

import { useEffect, useRef } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { X, Calendar, Link as LinkIcon, GitBranch, Sparkles, Mail, MessageSquare } from "lucide-react"

interface CMSPreviewModalProps {
  isOpen: boolean
  item: any
  type: "projects" | "blog" | "skills" | "experience" | "messages"
  onClose: () => void
}

export default function CMSPreviewModal({ isOpen, item, type, onClose }: CMSPreviewModalProps) {
  const modalRef = useRef<HTMLDivElement>(null)

  // Escape key close
  useEffect(() => {
    if (!isOpen) return
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [isOpen, onClose])

  return (
    <AnimatePresence>
      {isOpen && item && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/75 backdrop-blur-sm"
          />

          {/* Modal content */}
          <motion.div
            ref={modalRef}
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ type: "spring", duration: 0.4 }}
            role="dialog"
            aria-modal="true"
            className="relative w-full max-w-3xl max-h-[85vh] bg-card border border-card-border rounded-2xl shadow-2xl flex flex-col z-10 overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-card-border/40 bg-background/80">
              <span className="text-xs font-mono font-bold tracking-wider text-accent uppercase flex items-center gap-1.5">
                {type === "messages" ? <Mail className="w-3.5 h-3.5" /> : <Sparkles className="w-3.5 h-3.5" />}
                Previewing {type.slice(0, -1)}
              </span>
              <button
                onClick={onClose}
                className="p-1 rounded-lg text-muted hover:text-foreground hover:bg-background/85 transition-colors cursor-pointer"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Body */}
            <div className="flex-1 overflow-y-auto p-6 md:p-8 flex flex-col gap-6 scrollbar-thin">
              
              {/* Blog Post Preview */}
              {type === "blog" && (
                <div className="flex flex-col gap-6">
                  {item.coverImage && (
                    <div className="w-full h-48 md:h-64 rounded-xl overflow-hidden border border-card-border p-1 bg-background/5">
                      <img src={item.coverImage} alt={item.title} className="w-full h-full object-cover rounded-lg" />
                    </div>
                  )}
                  <div className="flex flex-col gap-2">
                    <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground leading-tight">
                      {item.title}
                    </h2>
                    <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-muted">
                      {item.category && (
                        <span className="px-2 py-0.5 rounded bg-primary/10 border border-primary/20 text-primary uppercase font-bold text-[10px]">
                          {item.category.name}
                        </span>
                      )}
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        {new Date(item.createdAt).toLocaleDateString()}
                      </span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono border border-card-border bg-background">
                        {item.published ? "Published" : "Draft"}
                      </span>
                    </div>
                  </div>
                  <p className="text-sm font-semibold text-foreground/80 border-l-2 border-primary pl-4 py-1 bg-primary/5 rounded-r-lg italic">
                    {item.summary}
                  </p>
                  <div className="prose dark:prose-invert max-w-none text-muted text-sm md:text-base leading-relaxed whitespace-pre-wrap pt-4 border-t border-card-border/40">
                    {item.content}
                  </div>
                </div>
              )}

              {/* Project Preview */}
              {type === "projects" && (
                <div className="flex flex-col gap-6">
                  <div className="flex flex-col gap-2">
                    <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground leading-tight">
                      {item.title}
                    </h2>
                    <span className="font-mono text-xs text-accent">Slug: /{item.slug}</span>
                  </div>

                  <div className="flex flex-wrap gap-3">
                    {item.githubUrl && (
                      <a
                        href={item.githubUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-card-border hover:border-primary text-xs font-semibold text-muted hover:text-foreground transition-colors"
                      >
                        <GitBranch className="w-3.5 h-3.5" />
                        GitHub Repository
                      </a>
                    )}
                    {item.demoUrl && (
                      <a
                        href={item.demoUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-card-border hover:border-primary text-xs font-semibold text-muted hover:text-foreground transition-colors"
                      >
                        <LinkIcon className="w-3.5 h-3.5" />
                        Live Demo
                      </a>
                    )}
                  </div>

                  {item.techStack && item.techStack.length > 0 && (
                    <div className="flex flex-col gap-2">
                      <h4 className="text-xs font-mono font-bold text-muted uppercase">Tech Stack</h4>
                      <div className="flex flex-wrap gap-2">
                        {item.techStack.map((tech: string) => (
                          <span key={tech} className="px-2 py-1 rounded bg-background border border-card-border text-xs font-mono text-foreground uppercase">
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex flex-col gap-2 pt-4 border-t border-card-border/40">
                    <h4 className="text-xs font-mono font-bold text-muted uppercase">Summary</h4>
                    <p className="text-sm text-muted leading-relaxed">{item.description}</p>
                  </div>

                  {item.challenges && (
                    <div className="flex flex-col gap-2">
                      <h4 className="text-xs font-mono font-bold text-red-400 uppercase">Challenges</h4>
                      <p className="text-sm text-muted leading-relaxed bg-red-500/5 border border-red-500/10 p-4 rounded-xl">{item.challenges}</p>
                    </div>
                  )}

                  {item.solutions && (
                    <div className="flex flex-col gap-2">
                      <h4 className="text-xs font-mono font-bold text-emerald-400 uppercase">Solutions</h4>
                      <p className="text-sm text-muted leading-relaxed bg-emerald-500/5 border border-emerald-500/10 p-4 rounded-xl">{item.solutions}</p>
                    </div>
                  )}

                  {item.content && (
                    <div className="flex flex-col gap-2 pt-4 border-t border-card-border/40">
                      <h4 className="text-xs font-mono font-bold text-muted uppercase">Details (Markdown)</h4>
                      <div className="prose dark:prose-invert max-w-none text-muted text-sm leading-relaxed whitespace-pre-wrap">
                        {item.content}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Message Inbox Preview */}
              {type === "messages" && (
                <div className="flex flex-col gap-6">
                  <div className="flex flex-col gap-2 bg-background border border-card-border/40 p-4 rounded-xl">
                    <h3 className="text-lg font-bold text-foreground">{item.subject}</h3>
                    <div className="text-xs text-muted font-mono flex flex-col gap-1 mt-2">
                      <span>Sender: <strong className="text-foreground/80">{item.name}</strong></span>
                      <span>Email: <strong className="text-foreground/80">{item.email}</strong></span>
                      <span>Received: <strong className="text-foreground/80">{new Date(item.createdAt).toLocaleString()}</strong></span>
                      <span>Status: <strong className={item.read ? "text-muted" : "text-emerald-400"}>{item.read ? "Read" : "Unread"}</strong></span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <h4 className="text-xs font-mono font-bold text-muted uppercase flex items-center gap-1">
                      <MessageSquare className="w-3.5 h-3.5" />
                      Message Content
                    </h4>
                    <p className="text-sm text-muted leading-relaxed whitespace-pre-line bg-background p-5 rounded-xl border border-card-border">
                      {item.message}
                    </p>
                  </div>
                </div>
              )}

              {/* Skill Preview */}
              {type === "skills" && (
                <div className="flex flex-col gap-4">
                  <h3 className="text-xl font-bold text-foreground">{item.name}</h3>
                  <div className="grid grid-cols-2 gap-4 bg-background p-4 rounded-xl border border-card-border/40 text-sm font-mono">
                    <span className="text-muted">Category:</span>
                    <span className="text-foreground capitalize">{item.category}</span>
                    <span className="text-muted">Proficiency:</span>
                    <span className="text-foreground">{item.proficiency}%</span>
                    <span className="text-muted">Status:</span>
                    <span className={item.active ? "text-emerald-400" : "text-muted"}>{item.active ? "Active" : "Inactive"}</span>
                    <span className="text-muted">Icon:</span>
                    <span className="text-foreground">{item.icon || "None"}</span>
                  </div>
                </div>
              )}

              {/* Experience Preview */}
              {type === "experience" && (
                <div className="flex flex-col gap-4">
                  <div className="flex flex-col gap-1">
                    <h3 className="text-xl font-bold text-foreground">{item.role}</h3>
                    <span className="text-sm text-accent font-semibold">{item.company}</span>
                  </div>
                  <div className="text-xs font-mono text-muted flex flex-col gap-1">
                    <span>Duration: {new Date(item.startDate).toLocaleDateString()} - {item.current ? "Present" : item.endDate ? new Date(item.endDate).toLocaleDateString() : "N/A"}</span>
                    <span>Location: {item.location || "N/A"}</span>
                  </div>
                  <div className="flex flex-col gap-2 pt-4 border-t border-card-border/40">
                    <h4 className="text-xs font-mono font-bold text-muted uppercase">Responsibilities</h4>
                    <p className="text-sm text-muted leading-relaxed whitespace-pre-line bg-background p-5 rounded-xl border border-card-border">
                      {item.description}
                    </p>
                  </div>
                </div>
              )}

            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
