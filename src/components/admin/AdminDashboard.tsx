"use client"

import { useState, useTransition } from "react"
import {
  createProjectAction,
  deleteProjectAction,
  createBlogPostAction,
  deleteBlogPostAction,
  createSkillAction,
  deleteSkillAction,
  createExperienceAction,
  deleteExperienceAction,
  markContactMessageReadAction,
  deleteContactMessageAction,
  logoutAction,
} from "@/app/admin/actions"
import { Project, BlogPost, Skill, Experience, ContactMessage, BlogCategory } from "@prisma/client"
import {
  FolderGit2,
  BookOpen,
  Sparkles,
  Briefcase,
  Mail,
  Trash2,
  Plus,
  LogOut,
  MailOpen,
  Calendar,
  Layers,
} from "lucide-react"

interface AdminDashboardProps {
  initialProjects: Project[]
  initialBlogPosts: BlogPost[]
  initialSkills: Skill[]
  initialExperiences: Experience[]
  initialMessages: ContactMessage[]
  categories: BlogCategory[]
}

type TabType = "projects" | "blog" | "skills" | "experience" | "messages"

export default function AdminDashboard({
  initialProjects,
  initialBlogPosts,
  initialSkills,
  initialExperiences,
  initialMessages,
  categories,
}: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<TabType>("projects")
  const [isPending, startTransition] = useTransition()

  // Local state queues (optimistic updates/instant UI reaction)
  const [projects, setProjects] = useState(initialProjects)
  const [blogPosts, setBlogPosts] = useState(initialBlogPosts)
  const [skills, setSkills] = useState(initialSkills)
  const [experiences, setExperiences] = useState(initialExperiences)
  const [messages, setMessages] = useState(initialMessages)

  // Creation form toggles
  const [showForm, setShowForm] = useState(false)

  // 1. Project Handlers
  const handleCreateProject = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    const data = {
      title: fd.get("title") as string,
      slug: fd.get("slug") as string,
      description: fd.get("description") as string,
      content: fd.get("content") as string,
      githubUrl: fd.get("githubUrl") as string,
      demoUrl: fd.get("demoUrl") as string,
      featured: fd.get("featured") === "true",
      techStack: (fd.get("techStack") as string).split(",").map((s) => s.trim()),
      challenges: fd.get("challenges") as string,
      solutions: fd.get("solutions") as string,
      imageUrls: [],
    }

    startTransition(async () => {
      try {
        const res = await createProjectAction(data)
        if (res.success && res.data) {
          setProjects([res.data, ...projects])
          setShowForm(false)
        }
      } catch (err: any) {
        alert(err.message || "Failed to create project")
      }
    })
  }

  const handleDeleteProject = async (id: string) => {
    if (!confirm("Are you sure?")) return
    startTransition(async () => {
      try {
        await deleteProjectAction(id)
        setProjects(projects.filter((p) => p.id !== id))
      } catch (err: any) {
        alert(err.message || "Failed to delete project")
      }
    })
  }

  // 2. Blog Handlers
  const handleCreateBlogPost = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    const data = {
      title: fd.get("title") as string,
      slug: fd.get("slug") as string,
      summary: fd.get("summary") as string,
      content: fd.get("content") as string,
      coverImage: fd.get("coverImage") as string,
      published: fd.get("published") === "true",
      categoryId: fd.get("categoryId") as string,
      tagIds: [],
    }

    startTransition(async () => {
      try {
        const res = await createBlogPostAction(data)
        if (res.success && res.data) {
          setBlogPosts([res.data, ...blogPosts])
          setShowForm(false)
        }
      } catch (err: any) {
        alert(err.message || "Failed to publish blog post")
      }
    })
  }

  const handleDeleteBlogPost = async (id: string) => {
    if (!confirm("Are you sure?")) return
    startTransition(async () => {
      try {
        await deleteBlogPostAction(id)
        setBlogPosts(blogPosts.filter((p) => p.id !== id))
      } catch (err: any) {
        alert(err.message || "Failed to delete blog post")
      }
    })
  }

  // 3. Skill Handlers
  const handleCreateSkill = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    const data = {
      name: fd.get("name") as string,
      category: fd.get("category") as string,
      proficiency: parseInt(fd.get("proficiency") as string, 10),
      icon: fd.get("icon") as string,
    }

    startTransition(async () => {
      try {
        const res = await createSkillAction(data)
        if (res.success && res.data) {
          setSkills([...skills, res.data])
          setShowForm(false)
        }
      } catch (err: any) {
        alert(err.message || "Failed to save skill")
      }
    })
  }

  const handleDeleteSkill = async (id: string) => {
    if (!confirm("Are you sure?")) return
    startTransition(async () => {
      try {
        await deleteSkillAction(id)
        setSkills(skills.filter((s) => s.id !== id))
      } catch (err: any) {
        alert(err.message || "Failed to delete skill")
      }
    })
  }

  // 4. Experience Handlers
  const handleCreateExperience = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    const data = {
      company: fd.get("company") as string,
      role: fd.get("role") as string,
      startDate: new Date(fd.get("startDate") as string),
      endDate: fd.get("endDate") ? new Date(fd.get("endDate") as string) : null,
      current: fd.get("current") === "true",
      description: fd.get("description") as string,
      location: fd.get("location") as string,
    }

    startTransition(async () => {
      try {
        const res = await createExperienceAction(data)
        if (res.success && res.data) {
          setExperiences([res.data, ...experiences])
          setShowForm(false)
        }
      } catch (err: any) {
        alert(err.message || "Failed to save experience")
      }
    })
  }

  const handleDeleteExperience = async (id: string) => {
    if (!confirm("Are you sure?")) return
    startTransition(async () => {
      try {
        await deleteExperienceAction(id)
        setExperiences(experiences.filter((exp) => exp.id !== id))
      } catch (err: any) {
        alert(err.message || "Failed to delete experience")
      }
    })
  }

  // 5. Contact Message Handlers
  const handleMarkRead = async (id: string, read: boolean) => {
    startTransition(async () => {
      try {
        await markContactMessageReadAction(id, read)
        setMessages(
          messages.map((m) => (m.id === id ? { ...m, read } : m))
        )
      } catch (err: any) {
        alert(err.message || "Failed to update status")
      }
    })
  }

  const handleDeleteMessage = async (id: string) => {
    if (!confirm("Are you sure?")) return
    startTransition(async () => {
      try {
        await deleteContactMessageAction(id)
        setMessages(messages.filter((m) => m.id !== id))
      } catch (err: any) {
        alert(err.message || "Failed to delete message")
      }
    })
  }

  return (
    <div className="min-h-screen bg-[#02050b] text-foreground flex flex-col w-full">
      {/* CMS Header bar */}
      <header className="border-b border-card-border/60 bg-[#040813] px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Layers className="w-5 h-5 text-primary" />
          <h1 className="font-display font-bold text-lg text-white">Admin CMS Control</h1>
        </div>
        <button
          onClick={() => logoutAction()}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-red-950/20 border border-red-500/20 text-red-200 text-xs font-semibold hover:bg-red-900/30 transition-colors cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          Logout Session
        </button>
      </header>

      {/* Main CMS Layout */}
      <div className="flex-1 flex flex-col md:flex-row max-w-7xl w-full mx-auto p-6 gap-8">
        
        {/* Navigation Sidebar */}
        <aside className="w-full md:w-60 shrink-0 flex flex-col gap-2">
          {[
            { id: "projects", name: "Projects", icon: FolderGit2, count: projects.length },
            { id: "blog", name: "Blog Posts", icon: BookOpen, count: blogPosts.length },
            { id: "skills", name: "Skills", icon: Sparkles, count: skills.length },
            { id: "experience", name: "Experience", icon: Briefcase, count: experiences.length },
            { id: "messages", name: "Contact Inbox", icon: Mail, count: messages.filter((m) => !m.read).length },
          ].map((tab) => {
            const Icon = tab.icon
            const isActive = activeTab === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id as TabType)
                  setShowForm(false)
                }}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                  isActive
                    ? "bg-primary text-white shadow-lg shadow-primary/20"
                    : "hover:bg-card-border/40 text-muted hover:text-white"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-4 h-4" />
                  <span>{tab.name}</span>
                </div>
                {tab.count > 0 && (
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                    isActive ? "bg-white text-primary" : "bg-[#0b0f19] text-accent"
                  }`}>
                    {tab.count}
                  </span>
                )}
              </button>
            )
          })}
        </aside>

        {/* Content Workspace */}
        <main className="flex-1 flex flex-col gap-6">
          <div className="flex items-center justify-between border-b border-card-border/40 pb-4">
            <h2 className="font-display font-bold text-2xl text-white capitalize">{activeTab} Manager</h2>
            {activeTab !== "messages" && (
              <button
                onClick={() => setShowForm(!showForm)}
                className="flex items-center gap-1.5 px-4 py-2 bg-accent hover:bg-accent-hover text-white text-xs font-semibold rounded-xl transition-all cursor-pointer shadow-lg shadow-accent/15"
              >
                {showForm ? "Cancel Form" : <><Plus className="w-4 h-4" /> Add Item</>}
              </button>
            )}
          </div>

          {/* Form display panel */}
          {showForm && (
            <div className="glass rounded-2xl p-6 border border-primary/25 bg-primary/5">
              
              {/* Project Creation Form */}
              {activeTab === "projects" && (
                <form onSubmit={handleCreateProject} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input required name="title" placeholder="Project Title" className="px-3 py-2 bg-[#050811] border border-card-border rounded-xl text-white text-sm" />
                  <input required name="slug" placeholder="slug (kebab-case)" className="px-3 py-2 bg-[#050811] border border-card-border rounded-xl text-white text-sm" />
                  <input required name="techStack" placeholder="Tech Stack (comma separated: React, Go, Docker)" className="px-3 py-2 bg-[#050811] border border-card-border rounded-xl text-white text-sm md:col-span-2" />
                  <input name="githubUrl" placeholder="GitHub URL" className="px-3 py-2 bg-[#050811] border border-card-border rounded-xl text-white text-sm" />
                  <input name="demoUrl" placeholder="Live Demo URL" className="px-3 py-2 bg-[#050811] border border-card-border rounded-xl text-white text-sm" />
                  
                  <div className="flex items-center gap-3">
                    <label className="text-xs font-semibold text-gray-400">Featured</label>
                    <select name="featured" className="px-3 py-1.5 bg-[#050811] border border-card-border rounded-xl text-white text-xs">
                      <option value="false">No</option>
                      <option value="true">Yes</option>
                    </select>
                  </div>
                  
                  <textarea required name="description" placeholder="Short summary description" rows={3} className="px-3 py-2 bg-[#050811] border border-card-border rounded-xl text-white text-sm md:col-span-2" />
                  <textarea required name="challenges" placeholder="Technical Challenges faced" rows={3} className="px-3 py-2 bg-[#050811] border border-card-border rounded-xl text-white text-sm md:col-span-2" />
                  <textarea required name="solutions" placeholder="Engineering Solutions implemented" rows={3} className="px-3 py-2 bg-[#050811] border border-card-border rounded-xl text-white text-sm md:col-span-2" />
                  <textarea required name="content" placeholder="Full overview details (Markdown)" rows={5} className="px-3 py-2 bg-[#050811] border border-card-border rounded-xl text-white text-sm md:col-span-2" />
                  <button type="submit" disabled={isPending} className="px-6 py-3 bg-primary text-white font-semibold rounded-xl text-sm hover:bg-primary-hover md:col-span-2 cursor-pointer">
                    Publish Project
                  </button>
                </form>
              )}

              {/* BlogPost Creation Form */}
              {activeTab === "blog" && (
                <form onSubmit={handleCreateBlogPost} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input required name="title" placeholder="Post Title" className="px-3 py-2 bg-[#050811] border border-card-border rounded-xl text-white text-sm md:col-span-2" />
                  <input required name="slug" placeholder="slug (kebab-case)" className="px-3 py-2 bg-[#050811] border border-card-border rounded-xl text-white text-sm" />
                  <select required name="categoryId" className="px-3 py-2 bg-[#050811] border border-card-border rounded-xl text-white text-sm">
                    <option value="">Select Category</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                  <input name="coverImage" placeholder="Cover Image URL" className="px-3 py-2 bg-[#050811] border border-card-border rounded-xl text-white text-sm md:col-span-2" />
                  
                  <div className="flex items-center gap-3">
                    <label className="text-xs font-semibold text-gray-400">Publish Immediately</label>
                    <select name="published" className="px-3 py-1.5 bg-[#050811] border border-card-border rounded-xl text-white text-xs">
                      <option value="false">Draft</option>
                      <option value="true">Published</option>
                    </select>
                  </div>
                  
                  <textarea required name="summary" placeholder="Short description summary" rows={2} className="px-3 py-2 bg-[#050811] border border-card-border rounded-xl text-white text-sm md:col-span-2" />
                  <textarea required name="content" placeholder="Content Body (Markdown)" rows={6} className="px-3 py-2 bg-[#050811] border border-card-border rounded-xl text-white text-sm md:col-span-2" />
                  <button type="submit" disabled={isPending} className="px-6 py-3 bg-primary text-white font-semibold rounded-xl text-sm hover:bg-primary-hover md:col-span-2 cursor-pointer">
                    Publish Post
                  </button>
                </form>
              )}

              {/* Skill Creation Form */}
              {activeTab === "skills" && (
                <form onSubmit={handleCreateSkill} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <input required name="name" placeholder="Skill Name (e.g. Next.js)" className="px-3 py-2 bg-[#050811] border border-card-border rounded-xl text-white text-sm" />
                  <input required name="category" placeholder="Category (e.g. Frontend, Backend)" className="px-3 py-2 bg-[#050811] border border-card-border rounded-xl text-white text-sm" />
                  <input required name="proficiency" type="number" min={1} max={100} placeholder="Proficiency % (1-100)" className="px-3 py-2 bg-[#050811] border border-card-border rounded-xl text-white text-sm" />
                  <input name="icon" placeholder="Lucide Icon string (e.g. Server, Layout)" className="px-3 py-2 bg-[#050811] border border-card-border rounded-xl text-white text-sm" />
                  <button type="submit" disabled={isPending} className="px-6 py-2.5 bg-primary text-white font-semibold rounded-xl text-sm hover:bg-primary-hover sm:col-span-2 cursor-pointer">
                    Save Skill
                  </button>
                </form>
              )}

              {/* Experience Creation Form */}
              {activeTab === "experience" && (
                <form onSubmit={handleCreateExperience} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input required name="company" placeholder="Company Name" className="px-3 py-2 bg-[#050811] border border-card-border rounded-xl text-white text-sm" />
                  <input required name="role" placeholder="Job Title / Role" className="px-3 py-2 bg-[#050811] border border-card-border rounded-xl text-white text-sm" />
                  <input required name="startDate" type="date" placeholder="Start Date" className="px-3 py-2 bg-[#050811] border border-card-border rounded-xl text-white text-sm" />
                  <input name="endDate" type="date" placeholder="End Date" className="px-3 py-2 bg-[#050811] border border-card-border rounded-xl text-white text-sm" />
                  <input name="location" placeholder="Location (e.g. Remote, SF)" className="px-3 py-2 bg-[#050811] border border-card-border rounded-xl text-white text-sm" />
                  
                  <div className="flex items-center gap-3">
                    <label className="text-xs font-semibold text-gray-400">Current Job</label>
                    <select name="current" className="px-3 py-1.5 bg-[#050811] border border-card-border rounded-xl text-white text-xs">
                      <option value="false">No</option>
                      <option value="true">Yes</option>
                    </select>
                  </div>
                  
                  <textarea required name="description" placeholder="Description of responsibilities and achievements" rows={4} className="px-3 py-2 bg-[#050811] border border-card-border rounded-xl text-white text-sm md:col-span-2" />
                  <button type="submit" disabled={isPending} className="px-6 py-3 bg-primary text-white font-semibold rounded-xl text-sm hover:bg-primary-hover md:col-span-2 cursor-pointer">
                    Save Experience
                  </button>
                </form>
              )}
            </div>
          )}

          {/* List display panel */}
          <div className="flex flex-col gap-4">
            
            {/* Project List layout */}
            {activeTab === "projects" && projects.map((p) => (
              <div key={p.id} className="glass rounded-xl p-4 flex items-center justify-between gap-4 border border-card-border/40">
                <div>
                  <h4 className="font-semibold text-white text-sm md:text-base">{p.title}</h4>
                  <span className="font-mono text-xs text-muted">/{p.slug}</span>
                </div>
                <button
                  onClick={() => handleDeleteProject(p.id)}
                  disabled={isPending}
                  className="p-2 rounded-lg bg-red-950/20 hover:bg-red-950/40 text-red-400 hover:text-red-300 border border-red-500/10 cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}

            {/* Blog Post List layout */}
            {activeTab === "blog" && blogPosts.map((post) => (
              <div key={post.id} className="glass rounded-xl p-4 flex items-center justify-between gap-4 border border-card-border/40">
                <div>
                  <h4 className="font-semibold text-white text-sm md:text-base">{post.title}</h4>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-mono border ${
                    post.published ? "bg-accent/10 border-accent/20 text-accent" : "bg-yellow-950/20 border-yellow-500/20 text-yellow-300"
                  }`}>
                    {post.published ? "Published" : "Draft"}
                  </span>
                </div>
                <button
                  onClick={() => handleDeleteBlogPost(post.id)}
                  disabled={isPending}
                  className="p-2 rounded-lg bg-red-950/20 hover:bg-red-950/40 text-red-400 hover:text-red-300 border border-red-500/10 cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}

            {/* Skills List layout */}
            {activeTab === "skills" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {skills.map((s) => (
                  <div key={s.id} className="glass rounded-xl p-4 flex items-center justify-between gap-4 border border-card-border/40">
                    <div>
                      <h4 className="font-semibold text-white text-sm">{s.name}</h4>
                      <span className="text-xs text-muted capitalize">{s.category} ({s.proficiency}%)</span>
                    </div>
                    <button
                      onClick={() => handleDeleteSkill(s.id)}
                      disabled={isPending}
                      className="p-2 rounded-lg bg-red-950/20 hover:bg-red-950/40 text-red-400 hover:text-red-300 border border-red-500/10 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Experience List layout */}
            {activeTab === "experience" && experiences.map((exp) => (
              <div key={exp.id} className="glass rounded-xl p-4 flex items-center justify-between gap-4 border border-card-border/40">
                <div>
                  <h4 className="font-semibold text-white text-sm md:text-base">{exp.role}</h4>
                  <span className="text-xs text-accent font-semibold">{exp.company}</span>
                </div>
                <button
                  onClick={() => handleDeleteExperience(exp.id)}
                  disabled={isPending}
                  className="p-2 rounded-lg bg-red-950/20 hover:bg-red-950/40 text-red-400 hover:text-red-300 border border-red-500/10 cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}

            {/* Contact Message List layout */}
            {activeTab === "messages" && messages.map((msg) => (
              <div
                key={msg.id}
                className={`glass rounded-xl p-5 border flex flex-col gap-3 transition-colors ${
                  msg.read ? "border-card-border/40" : "border-primary/30 bg-primary/5"
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-card-border/40 pb-3">
                  <div>
                    <h4 className="font-bold text-white text-sm md:text-base">{msg.subject}</h4>
                    <p className="text-xs text-muted">
                      From: <span className="text-gray-300 font-semibold">{msg.name}</span> ({msg.email})
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleMarkRead(msg.id, !msg.read)}
                      disabled={isPending}
                      className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white border border-card-border text-xs flex items-center gap-1 cursor-pointer"
                    >
                      <MailOpen className="w-3.5 h-3.5" />
                      {msg.read ? "Mark Unread" : "Mark Read"}
                    </button>
                    <button
                      onClick={() => handleDeleteMessage(msg.id)}
                      disabled={isPending}
                      className="p-2 rounded-lg bg-red-950/20 hover:bg-red-950/40 text-red-400 hover:text-red-300 border border-red-500/10 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
                <p className="text-muted text-sm leading-relaxed whitespace-pre-line bg-[#040813] p-4 rounded-xl border border-card-border/40">
                  {msg.message}
                </p>
                <span className="text-[10px] text-gray-500 font-mono flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  Received: {new Date(msg.createdAt).toLocaleString()}
                </span>
              </div>
            ))}

            {activeTab === "projects" && projects.length === 0 && (
              <p className="text-center text-muted text-sm py-12">No projects found. Add one above!</p>
            )}
            {activeTab === "blog" && blogPosts.length === 0 && (
              <p className="text-center text-muted text-sm py-12">No blog posts found. Write one above!</p>
            )}
            {activeTab === "skills" && skills.length === 0 && (
              <p className="text-center text-muted text-sm py-12">No skills found. Add one above!</p>
            )}
            {activeTab === "experience" && experiences.length === 0 && (
              <p className="text-center text-muted text-sm py-12">No work experiences found. Add one above!</p>
            )}
            {activeTab === "messages" && messages.length === 0 && (
              <p className="text-center text-muted text-sm py-12">Inbox is empty. Contact messages will appear here.</p>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}
