"use client"

import { useState, useTransition, useMemo, useEffect } from "react"
import {
  // Projects
  createProjectAction,
  updateProjectAction,
  deleteProjectAction,
  duplicateProjectAction,
  bulkUpdateProjectsAction,
  bulkDeleteProjectsAction,

  // Blogs
  createBlogPostAction,
  updateBlogPostAction,
  deleteBlogPostAction,
  duplicateBlogPostAction,
  bulkUpdateBlogPostsAction,
  bulkDeleteBlogPostsAction,

  // Skills
  createSkillAction,
  updateSkillAction,
  deleteSkillAction,
  duplicateSkillAction,
  bulkUpdateSkillsAction,
  bulkDeleteSkillsAction,

  // Experiences
  createExperienceAction,
  updateExperienceAction,
  deleteExperienceAction,
  duplicateExperienceAction,
  bulkUpdateExperiencesAction,
  bulkDeleteExperiencesAction,

  // Message inbox
  markContactMessageReadAction,
  deleteContactMessageAction,
  bulkUpdateMessagesAction,
  bulkDeleteMessagesAction,
  logoutAction,
} from "@/app/[locale]/admin/actions"
import { Project, BlogPost, Skill, Experience, ContactMessage, BlogCategory } from "@prisma/client"
import { Layers, LogOut, Loader2 } from "lucide-react"

// Custom Components
import Toast, { ToastMessage } from "./Toast"
import CMSConfirmDialog from "./CMSConfirmDialog"
import CMSPreviewModal from "./CMSPreviewModal"
import CMSStats from "./CMSStats"
import CMSFilterBar from "./CMSFilterBar"
import CMSCard from "./CMSCard"
import CMSBulkToolbar from "./CMSBulkToolbar"
import CMSPagination from "./CMSPagination"
import CMSEmptyState from "./CMSEmptyState"
import CMSSkeleton from "./CMSSkeleton"
import ThemeSwitcher from "@/components/common/theme-switcher"
import RichBlogEditor from "./editor/RichBlogEditor"
import MediaLibrary from "./media/MediaLibrary"

interface AdminDashboardProps {
  initialProjects: any[]
  initialBlogPosts: any[]
  initialSkills: Skill[]
  initialExperiences: Experience[]
  initialMessages: ContactMessage[]
  categories: BlogCategory[]
}

type TabType = "projects" | "blog" | "skills" | "experience" | "messages" | "media"

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

  // 1. Data Store States
  const [projects, setProjects] = useState(initialProjects)
  const [blogPosts, setBlogPosts] = useState(initialBlogPosts)
  const [skills, setSkills] = useState(initialSkills)
  const [experiences, setExperiences] = useState(initialExperiences)
  const [messages, setMessages] = useState(initialMessages)

  // 2. Toolbar & Filtering States
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [sortBy, setSortBy] = useState("newest")
  const [currentPage, setCurrentPage] = useState(1)

  // 3. Selection & Modals States
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [showForm, setShowForm] = useState(false)
  const [editingItem, setEditingItem] = useState<any>(null)
  const [previewOpen, setPreviewOpen] = useState(false)
  const [previewItem, setPreviewItem] = useState<any>(null)
  const [formTab, setFormTab] = useState<"content" | "seo" | "publishing">("content")
  const [editorContent, setEditorContent] = useState("")
  const [readingTimeState, setReadingTimeState] = useState<number | null>(null)
  
  // Custom dialog config
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [confirmConfig, setConfirmConfig] = useState<{
    title: string
    description: string
    onConfirm: () => void
    type?: "danger" | "warning"
  } | null>(null)

  // Custom Toast State
  const [toasts, setToasts] = useState<ToastMessage[]>([])

  const showToast = (text: string, type: "success" | "error" | "info" = "success") => {
    const id = Math.random().toString(36).substring(2, 9)
    setToasts((prev) => [...prev, { id, text, type }])
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, 4000)
  }

  // Clear selections and filters when active tab changes
  useEffect(() => {
    setSelectedIds([])
    setSearchQuery("")
    setStatusFilter("all")
    setSortBy("newest")
    setCurrentPage(1)
    setShowForm(false)
    setEditingItem(null)
  }, [activeTab])

  // Sync editing item contents for blog post editor
  useEffect(() => {
    if (editingItem && activeTab === "blog") {
      setEditorContent(editingItem.content || "")
      setReadingTimeState(editingItem.readingTime || null)
    } else {
      setEditorContent("")
      setReadingTimeState(null)
    }
    setFormTab("content")
  }, [editingItem, activeTab])

  // Helpers to format dates for form fields
  const formatDateForInput = (dateVal: any) => {
    if (!dateVal) return ""
    const d = new Date(dateVal)
    const month = `${d.getMonth() + 1}`.padStart(2, "0")
    const day = `${d.getDate()}`.padStart(2, "0")
    return `${d.getFullYear()}-${month}-${day}`
  }

  // Compute stats based on complete items in each tab
  const activeItems = useMemo(() => {
    if (activeTab === "projects") return projects
    if (activeTab === "blog") return blogPosts
    if (activeTab === "skills") return skills
    if (activeTab === "experience") return experiences
    if (activeTab === "media") return []
    return messages
  }, [activeTab, projects, blogPosts, skills, experiences, messages])

  // --- Filtering & Sorting Computation ---
  const processedItems = useMemo(() => {
    let result = [...activeItems]

    // 1. Instant Text Search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim()
      result = result.filter((item) => {
        if (activeTab === "projects") {
          return (
            item.title.toLowerCase().includes(q) ||
            item.slug.toLowerCase().includes(q) ||
            (item.techStack && item.techStack.some((t: string) => t.toLowerCase().includes(q))) ||
            item.description.toLowerCase().includes(q)
          )
        }
        if (activeTab === "blog") {
          return (
            item.title.toLowerCase().includes(q) ||
            item.slug.toLowerCase().includes(q) ||
            item.summary.toLowerCase().includes(q)
          )
        }
        if (activeTab === "skills") {
          return item.name.toLowerCase().includes(q) || item.category.toLowerCase().includes(q)
        }
        if (activeTab === "experience") {
          return (
            item.company.toLowerCase().includes(q) ||
            item.role.toLowerCase().includes(q) ||
            item.description.toLowerCase().includes(q)
          )
        }
        // messages
        return (
          item.name.toLowerCase().includes(q) ||
          item.email.toLowerCase().includes(q) ||
          item.subject.toLowerCase().includes(q) ||
          item.message.toLowerCase().includes(q)
        )
      })
    }

    // 2. Status Filters
    if (statusFilter !== "all") {
      result = result.filter((item) => {
        if (activeTab === "projects") {
          if (statusFilter === "active") return item.active
          if (statusFilter === "inactive") return !item.active
          if (statusFilter === "featured") return item.featured
        }
        if (activeTab === "blog") {
          if (statusFilter === "published") return item.published && !item.archived
          if (statusFilter === "draft") return !item.published && !item.archived
          if (statusFilter === "archived") return item.archived
        }
        if (activeTab === "skills") {
          if (statusFilter === "active") return item.active
          if (statusFilter === "inactive") return !item.active
        }
        if (activeTab === "experience") {
          if (statusFilter === "current") return item.current
          if (statusFilter === "past") return !item.current
        }
        if (activeTab === "messages") {
          if (statusFilter === "unread") return !item.read
          if (statusFilter === "read") return item.read
        }
        return true
      })
    }

    // 3. Sorting
    result.sort((a, b) => {
      const timeA = new Date(a.createdAt || 0).getTime()
      const timeB = new Date(b.createdAt || 0).getTime()
      const updateA = new Date(a.updatedAt || a.createdAt || 0).getTime()
      const updateB = new Date(b.updatedAt || b.createdAt || 0).getTime()
      const titleA = (a.title || a.name || a.subject || "").toLowerCase()
      const titleB = (b.title || b.name || b.subject || "").toLowerCase()

      if (sortBy === "newest") return timeB - timeA
      if (sortBy === "oldest") return timeA - timeB
      if (sortBy === "updated") return updateB - updateA
      if (sortBy === "title_az") return titleA.localeCompare(titleB)
      if (sortBy === "title_za") return titleB.localeCompare(titleA)
      return 0
    })

    return result
  }, [activeItems, searchQuery, statusFilter, sortBy, activeTab])

  // --- Pagination Computations ---
  const totalPages = Math.ceil(processedItems.length / 10) || 1
  
  // Guard current page boundary
  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(1)
    }
  }, [totalPages, currentPage])

  const paginatedItems = useMemo(() => {
    const start = (currentPage - 1) * 10
    const end = start + 10
    return processedItems.slice(start, end)
  }, [processedItems, currentPage])

  // --- Form Reset/Edit Toggle triggers ---
  const handleEditClick = (item: any) => {
    setEditingItem(item)
    setShowForm(true)
    // Scroll window smoothly to the form container
    window.scrollTo({ top: 120, behavior: "smooth" })
  }

  // --- Selection handlers ---
  const handleSelectToggle = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    )
  }

  const handleSelectAllToggle = () => {
    const pageIds = paginatedItems.map((item) => item.id)
    const allSelectedOnPage = pageIds.every((id) => selectedIds.includes(id))
    if (allSelectedOnPage) {
      setSelectedIds((prev) => prev.filter((id) => !pageIds.includes(id)))
    } else {
      setSelectedIds((prev) => Array.from(new Set([...prev, ...pageIds])))
    }
  }

  // --- 1. Project Operations ---
  const handleSaveProject = async (e: React.FormEvent<HTMLFormElement>) => {
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
      active: fd.get("active") === "true",
      techStack: (fd.get("techStack") as string).split(",").map((s) => s.trim()).filter(Boolean),
      challenges: fd.get("challenges") as string,
      solutions: fd.get("solutions") as string,
      imageUrls: [],
    }

    startTransition(async () => {
      try {
        if (editingItem) {
          const res = await updateProjectAction(editingItem.id, data)
          if (res.success && res.data) {
            setProjects((prev) => prev.map((p) => (p.id === editingItem.id ? res.data : p)))
            showToast("✓ Project updated successfully")
            setShowForm(false)
            setEditingItem(null)
          }
        } else {
          const res = await createProjectAction(data)
          if (res.success && res.data) {
            setProjects([res.data, ...projects])
            showToast("✓ Project created successfully")
            setShowForm(false)
          }
        }
      } catch (err: any) {
        showToast(err.message || "Failed to save project", "error")
      }
    })
  }

  const handleProjectStatusChange = async (id: string, active: boolean) => {
    const item = projects.find((p) => p.id === id)
    if (!item) return
    const data = {
      title: item.title,
      slug: item.slug,
      description: item.description,
      content: item.content,
      githubUrl: item.githubUrl || "",
      demoUrl: item.demoUrl || "",
      featured: item.featured,
      active,
      techStack: item.techStack,
      challenges: item.challenges,
      solutions: item.solutions,
      imageUrls: item.images?.map((img: any) => img.url) || [],
    }

    try {
      const res = await updateProjectAction(id, data)
      if (res.success && res.data) {
        setProjects((prev) => prev.map((p) => (p.id === id ? res.data : p)))
        showToast("✓ Project status updated successfully")
      }
    } catch (err: any) {
      showToast(err.message || "Failed to update project status", "error")
    }
  }

  // --- 2. Blog Operations ---
  const handleSaveBlogPost = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)

    const statusVal = fd.get("status") as string || "DRAFT"
    const isPublished = statusVal === "PUBLISHED" || statusVal === "SCHEDULED"
    const isArchived = statusVal === "ARCHIVED"
    const pubDateStr = fd.get("publishedAt") as string
    const publishedAt = pubDateStr ? new Date(pubDateStr) : (statusVal === "PUBLISHED" ? new Date() : null)
    const readTimeVal = fd.get("readingTime") ? parseInt(fd.get("readingTime") as string, 10) : null

    const data = {
      title: fd.get("title") as string,
      slug: fd.get("slug") as string,
      summary: fd.get("summary") as string,
      description: fd.get("description") as string || null,
      content: fd.get("content") as string || "[]",
      coverImage: fd.get("coverImage") as string || null,
      thumbnail: fd.get("thumbnail") as string || null,
      readingTime: readTimeVal,
      status: statusVal,
      published: isPublished,
      archived: isArchived,
      publishedAt,
      seoTitle: fd.get("seoTitle") as string || null,
      seoDescription: fd.get("seoDescription") as string || null,
      seoKeywords: fd.get("seoKeywords") as string || null,
      canonicalUrl: fd.get("canonicalUrl") as string || null,
      ogImage: fd.get("ogImage") as string || null,
      visibility: fd.get("visibility") as string || "PUBLIC",
      language: fd.get("language") as string || "en",
      themeMetadata: fd.get("themeMetadata") as string || null,
      categoryId: fd.get("categoryId") as string,
      tagIds: editingItem ? (editingItem.tags?.map((t: any) => t.id) || []) : [],
    }

    startTransition(async () => {
      try {
        if (editingItem) {
          const res = await updateBlogPostAction(editingItem.id, data)
          if (res.success && res.data) {
            setBlogPosts((prev) => prev.map((p) => (p.id === editingItem.id ? res.data : p)))
            showToast("✓ Blog post updated successfully")
            setShowForm(false)
            setEditingItem(null)
          }
        } else {
          const res = await createBlogPostAction(data)
          if (res.success && res.data) {
            setBlogPosts([res.data, ...blogPosts])
            showToast("✓ Blog post created successfully")
            setShowForm(false)
          }
        }
      } catch (err: any) {
        showToast(err.message || "Failed to save blog post", "error")
      }
    })
  }

  const handleBlogStatusChange = async (id: string, newStatus: { published?: boolean; archived?: boolean }) => {
    const item = blogPosts.find((p) => p.id === id)
    if (!item) return

    const published = newStatus.published !== undefined ? newStatus.published : item.published
    const archived = newStatus.archived !== undefined ? newStatus.archived : item.archived
    const status = archived ? "ARCHIVED" : (published ? "PUBLISHED" : "DRAFT")

    const data = {
      title: item.title,
      slug: item.slug,
      summary: item.summary,
      description: item.description,
      content: item.content,
      coverImage: item.coverImage || "",
      thumbnail: item.thumbnail || "",
      readingTime: item.readingTime,
      status,
      published,
      archived,
      publishedAt: item.publishedAt ? new Date(item.publishedAt) : null,
      seoTitle: item.seoTitle,
      seoDescription: item.seoDescription,
      seoKeywords: item.seoKeywords,
      canonicalUrl: item.canonicalUrl || "",
      ogImage: item.ogImage || "",
      visibility: item.visibility || "PUBLIC",
      language: item.language || "en",
      themeMetadata: item.themeMetadata,
      categoryId: item.categoryId,
      tagIds: item.tags?.map((t: any) => t.id) || [],
    }

    try {
      const res = await updateBlogPostAction(id, data)
      if (res.success && res.data) {
        setBlogPosts((prev) => prev.map((p) => (p.id === id ? res.data : p)))
        showToast("✓ Blog status updated successfully")
      }
    } catch (err: any) {
      showToast(err.message || "Failed to update blog status", "error")
    }
  }

  // --- 3. Skill Operations ---
  const handleSaveSkill = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    const data = {
      name: fd.get("name") as string,
      category: fd.get("category") as string,
      proficiency: parseInt(fd.get("proficiency") as string, 10),
      icon: fd.get("icon") as string,
      active: fd.get("active") === "true",
    }

    startTransition(async () => {
      try {
        if (editingItem) {
          const res = await updateSkillAction(editingItem.id, data)
          if (res.success && res.data) {
            setSkills((prev) => prev.map((s) => (s.id === editingItem.id ? res.data : s)))
            showToast("✓ Skill updated successfully")
            setShowForm(false)
            setEditingItem(null)
          }
        } else {
          const res = await createSkillAction(data)
          if (res.success && res.data) {
            setSkills([...skills, res.data])
            showToast("✓ Skill created successfully")
            setShowForm(false)
          }
        }
      } catch (err: any) {
        showToast(err.message || "Failed to save skill", "error")
      }
    })
  }

  const handleSkillStatusChange = async (id: string, active: boolean) => {
    const item = skills.find((s) => s.id === id)
    if (!item) return
    const data = {
      name: item.name,
      category: item.category,
      proficiency: item.proficiency,
      icon: item.icon || "",
      active,
    }

    try {
      const res = await updateSkillAction(id, data)
      if (res.success && res.data) {
        setSkills((prev) => prev.map((s) => (s.id === id ? res.data : s)))
        showToast("✓ Skill status updated successfully")
      }
    } catch (err: any) {
      showToast(err.message || "Failed to update skill status", "error")
    }
  }

  // --- 4. Experience Operations ---
  const handleSaveExperience = async (e: React.FormEvent<HTMLFormElement>) => {
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
        if (editingItem) {
          const res = await updateExperienceAction(editingItem.id, data)
          if (res.success && res.data) {
            setExperiences((prev) => prev.map((exp) => (exp.id === editingItem.id ? res.data : exp)))
            showToast("✓ Experience updated successfully")
            setShowForm(false)
            setEditingItem(null)
          }
        } else {
          const res = await createExperienceAction(data)
          if (res.success && res.data) {
            setExperiences([res.data, ...experiences])
            showToast("✓ Experience created successfully")
            setShowForm(false)
          }
        }
      } catch (err: any) {
        showToast(err.message || "Failed to save experience", "error")
      }
    })
  }

  const handleExperienceStatusChange = async (id: string, current: boolean) => {
    const item = experiences.find((exp) => exp.id === id)
    if (!item) return
    const data = {
      company: item.company,
      role: item.role,
      startDate: new Date(item.startDate),
      endDate: item.endDate ? new Date(item.endDate) : null,
      current,
      description: item.description,
      location: item.location || "",
    }

    try {
      const res = await updateExperienceAction(id, data)
      if (res.success && res.data) {
        setExperiences((prev) => prev.map((exp) => (exp.id === id ? res.data : exp)))
        showToast("✓ Experience status updated successfully")
      }
    } catch (err: any) {
      showToast(err.message || "Failed to update experience status", "error")
    }
  }

  // --- 5. Message Operations ---
  const handleMessageStatusChange = async (id: string, read: boolean) => {
    try {
      const res = await markContactMessageReadAction(id, read)
      if (res.success && res.data) {
        setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, read } : m)))
        showToast(read ? "Message marked as read" : "Message marked as unread")
      }
    } catch (err: any) {
      showToast(err.message || "Failed to update message status", "error")
    }
  }

  // --- General Direct Action Handlers (View, Delete, Duplicate) ---
  const handleViewItem = (item: any) => {
    setPreviewItem(item)
    setPreviewOpen(true)
  }

  const handleDuplicateItem = async (id: string) => {
    startTransition(async () => {
      try {
        if (activeTab === "projects") {
          const res = await duplicateProjectAction(id)
          if (res.success && res.data) {
            setProjects([res.data, ...projects])
            showToast("✓ Project cloned successfully")
          }
        } else if (activeTab === "blog") {
          const res = await duplicateBlogPostAction(id)
          if (res.success && res.data) {
            setBlogPosts([res.data, ...blogPosts])
            showToast("✓ Blog post cloned successfully")
          }
        } else if (activeTab === "skills") {
          const res = await duplicateSkillAction(id)
          if (res.success && res.data) {
            setSkills([...skills, res.data])
            showToast("✓ Skill metrics cloned successfully")
          }
        } else if (activeTab === "experience") {
          const res = await duplicateExperienceAction(id)
          if (res.success && res.data) {
            setExperiences([res.data, ...experiences])
            showToast("✓ Work experience cloned successfully")
          }
        }
      } catch (err: any) {
        showToast(err.message || "Failed to duplicate item", "error")
      }
    })
  }

  const handleDeleteItemTrigger = (id: string) => {
    setConfirmConfig({
      title: `Delete this ${activeTab.slice(0, -1)}?`,
      description: `This action will permanently delete the item. This action cannot be undone.`,
      onConfirm: () => performDeleteItem(id),
    })
    setConfirmOpen(true)
  }

  const performDeleteItem = async (id: string) => {
    setConfirmOpen(false)
    startTransition(async () => {
      try {
        if (activeTab === "projects") {
          await deleteProjectAction(id)
          setProjects(projects.filter((p) => p.id !== id))
        } else if (activeTab === "blog") {
          await deleteBlogPostAction(id)
          setBlogPosts(blogPosts.filter((p) => p.id !== id))
        } else if (activeTab === "skills") {
          await deleteSkillAction(id)
          setSkills(skills.filter((s) => s.id !== id))
        } else if (activeTab === "experience") {
          await deleteExperienceAction(id)
          setExperiences(experiences.filter((exp) => exp.id !== id))
        } else if (activeTab === "messages") {
          await deleteContactMessageAction(id)
          setMessages(messages.filter((m) => m.id !== id))
        }
        showToast("✓ Deleted successfully")
      } catch (err: any) {
        showToast(err.message || "Deletion failed", "error")
      }
    })
  }

  // --- Bulk Action Handlers ---
  const handleBulkActionTrigger = async (action: string) => {
    if (action === "delete") {
      setConfirmConfig({
        title: `Delete ${selectedIds.length} items?`,
        description: `This will permanently delete all selected items. This cannot be undone.`,
        onConfirm: () => performBulkAction(action),
      })
      setConfirmOpen(true)
      return
    }
    await performBulkAction(action)
  }

  const performBulkAction = async (action: string) => {
    setConfirmOpen(false)
    startTransition(async () => {
      try {
        const ids = [...selectedIds]
        if (activeTab === "projects") {
          if (action === "activate") {
            await bulkUpdateProjectsAction(ids, true)
            setProjects((prev) => prev.map((item) => (ids.includes(item.id) ? { ...item, active: true } : item)))
            showToast("✓ Projects activated in bulk")
          } else if (action === "deactivate") {
            await bulkUpdateProjectsAction(ids, false)
            setProjects((prev) => prev.map((item) => (ids.includes(item.id) ? { ...item, active: false } : item)))
            showToast("✓ Projects deactivated in bulk")
          } else if (action === "delete") {
            await bulkDeleteProjectsAction(ids)
            setProjects((prev) => prev.filter((item) => !ids.includes(item.id)))
            showToast("✓ Projects deleted in bulk")
          }
        } else if (activeTab === "blog") {
          if (action === "publish") {
            await bulkUpdateBlogPostsAction(ids, { published: true, archived: false })
            setBlogPosts((prev) => prev.map((item) => (ids.includes(item.id) ? { ...item, published: true, archived: false } : item)))
            showToast("✓ Articles published in bulk")
          } else if (action === "draft") {
            await bulkUpdateBlogPostsAction(ids, { published: false, archived: false })
            setBlogPosts((prev) => prev.map((item) => (ids.includes(item.id) ? { ...item, published: false, archived: false } : item)))
            showToast("✓ Articles reverted to drafts")
          } else if (action === "archive") {
            await bulkUpdateBlogPostsAction(ids, { archived: true })
            setBlogPosts((prev) => prev.map((item) => (ids.includes(item.id) ? { ...item, archived: true } : item)))
            showToast("✓ Articles archived in bulk")
          } else if (action === "delete") {
            await bulkDeleteBlogPostsAction(ids)
            setBlogPosts((prev) => prev.filter((item) => !ids.includes(item.id)))
            showToast("✓ Articles deleted in bulk")
          }
        } else if (activeTab === "skills") {
          if (action === "activate") {
            await bulkUpdateSkillsAction(ids, true)
            setSkills((prev) => prev.map((item) => (ids.includes(item.id) ? { ...item, active: true } : item)))
            showToast("✓ Skills activated in bulk")
          } else if (action === "deactivate") {
            await bulkUpdateSkillsAction(ids, false)
            setSkills((prev) => prev.map((item) => (ids.includes(item.id) ? { ...item, active: false } : item)))
            showToast("✓ Skills deactivated in bulk")
          } else if (action === "delete") {
            await bulkDeleteSkillsAction(ids)
            setSkills((prev) => prev.filter((item) => !ids.includes(item.id)))
            showToast("✓ Skills deleted in bulk")
          }
        } else if (activeTab === "experience") {
          if (action === "current") {
            await bulkUpdateExperiencesAction(ids, true)
            setExperiences((prev) => prev.map((item) => (ids.includes(item.id) ? { ...item, current: true } : item)))
            showToast("✓ Experiences marked current")
          } else if (action === "past") {
            await bulkUpdateExperiencesAction(ids, false)
            setExperiences((prev) => prev.map((item) => (ids.includes(item.id) ? { ...item, current: false } : item)))
            showToast("✓ Experiences marked past")
          } else if (action === "delete") {
            await bulkDeleteExperiencesAction(ids)
            setExperiences((prev) => prev.filter((item) => !ids.includes(item.id)))
            showToast("✓ Experiences deleted in bulk")
          }
        } else if (activeTab === "messages") {
          if (action === "read") {
            await bulkUpdateMessagesAction(ids, true)
            setMessages((prev) => prev.map((item) => (ids.includes(item.id) ? { ...item, read: true } : item)))
            showToast("✓ Messages marked read")
          } else if (action === "unread") {
            await bulkUpdateMessagesAction(ids, false)
            setMessages((prev) => prev.map((item) => (ids.includes(item.id) ? { ...item, read: false } : item)))
            showToast("✓ Messages marked unread")
          } else if (action === "delete") {
            await bulkDeleteMessagesAction(ids)
            setMessages((prev) => prev.filter((item) => !ids.includes(item.id)))
            showToast("✓ Messages deleted in bulk")
          }
        }
        setSelectedIds([])
      } catch (err: any) {
        showToast(err.message || "Bulk operation failed", "error")
      }
    })
  }

  // --- Inline Status Change Hub ---
  const handleStatusChangeHub = async (id: string, newStatus: any) => {
    if (activeTab === "projects") await handleProjectStatusChange(id, newStatus)
    else if (activeTab === "blog") await handleBlogStatusChange(id, newStatus)
    else if (activeTab === "skills") await handleSkillStatusChange(id, newStatus)
    else if (activeTab === "experience") await handleExperienceStatusChange(id, newStatus)
    else if (activeTab === "messages") await handleMessageStatusChange(id, newStatus)
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col w-full relative pb-20 select-none transition-colors duration-300">
      
      {/* 1. Header component */}
      <header className="border-b border-card-border/60 bg-card px-6 py-4 flex items-center justify-between z-10">
        <div className="flex items-center gap-2">
          <Layers className="w-5 h-5 text-primary" />
          <h1 className="font-display font-bold text-lg text-foreground">Admin CMS Control</h1>
        </div>
        <div className="flex items-center gap-4">
          <ThemeSwitcher />
          <button
            onClick={() => logoutAction()}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-red-950/20 border border-red-500/20 text-red-200 text-xs font-semibold hover:bg-red-900/30 transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            Logout Session
          </button>
        </div>
      </header>

      {/* 2. Main Content Frame */}
      <div className="flex-1 flex flex-col md:flex-row max-w-7xl w-full mx-auto p-6 gap-8 relative">
        
        {/* Navigation Sidebar */}
        <aside className="w-full md:w-60 shrink-0 flex flex-col gap-2 self-start sticky top-6">
          {[
            { id: "projects", name: "Projects", count: projects.length },
            { id: "blog", name: "Blog Posts", count: blogPosts.length },
            { id: "skills", name: "Skills", count: skills.length },
            { id: "experience", name: "Experience", count: experiences.length },
            { id: "messages", name: "Contact Inbox", count: messages.filter((m) => !m.read).length },
            { id: "media", name: "Media Assets", count: 0 },
          ].map((tab) => {
            const isActive = activeTab === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as TabType)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold transition-all cursor-pointer select-none ${
                  isActive
                    ? "bg-primary text-white shadow-lg shadow-primary/20"
                    : "hover:bg-card-border/40 text-muted hover:text-foreground"
                }`}
              >
                <span>{tab.name}</span>
                {tab.count > 0 && (
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                      isActive ? "bg-background text-primary animate-pulse" : "bg-card border border-card-border/40 text-accent"
                    }`}
                  >
                    {tab.count}
                  </span>
                )}
              </button>
            )
          })}
        </aside>

        {/* Content Workspace */}
        <main className="flex-1 flex flex-col gap-6 min-w-0">
          
          {activeTab === "media" ? (
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-2">
                <h2 className="font-display font-black text-2xl md:text-3xl text-foreground capitalize leading-none">
                  Media Assets Gallery
                </h2>
                <p className="text-muted text-xs md:text-sm leading-relaxed">
                  Manage static assets, images, and project screenshots inside the virtual folders gallery.
                </p>
              </div>
              <MediaLibrary />
            </div>
          ) : (
            <>
              <div className="flex flex-col gap-2">
                <h2 className="font-display font-black text-2xl md:text-3xl text-foreground capitalize leading-none">
                  {activeTab} Manager
                </h2>
                <p className="text-muted text-xs md:text-sm leading-relaxed">
                  Query, status toggle, duplicate, update, and manage entries within the developer portfolio.
                </p>
              </div>

              {/* 3. Stat counters display */}
              <CMSStats type={activeTab} items={activeItems} />

              {/* 4. Filter bar component */}
              <CMSFilterBar
                type={activeTab}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                statusFilter={statusFilter}
                setStatusFilter={setStatusFilter}
                sortBy={sortBy}
                setSortBy={setSortBy}
                showForm={showForm}
                onAddClick={() => {
                  setEditingItem(null)
                  setShowForm(!showForm)
                }}
              />

          {/* 5. Creation/Editing Formdisplay panel */}
          {showForm && (
            <div className="glass rounded-2xl p-6 border border-card-border bg-card relative shadow-xl">
              <div className="border-b border-card-border/40 pb-3 mb-4">
                <h3 className="font-display font-bold text-base text-foreground">
                  {editingItem ? `Edit ${activeTab.slice(0, -1)}: ${editingItem.title || editingItem.name || editingItem.role}` : `Add New ${activeTab.slice(0, -1)}`}
                </h3>
              </div>
              
              {/* Project Form */}
              {activeTab === "projects" && (
                <form
                  key={editingItem ? editingItem.id : "new-project"}
                  onSubmit={handleSaveProject}
                  className="grid grid-cols-1 md:grid-cols-2 gap-4"
                >
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-mono font-bold text-muted uppercase">Project Title</label>
                    <input required name="title" defaultValue={editingItem?.title || ""} placeholder="Project Title" className="px-3 py-2.5 bg-background border border-card-border text-foreground rounded-xl text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary focus-visible:border-primary/50 transition-colors" />
                  </div>
                  
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-mono font-bold text-muted uppercase">Slug (kebab-case)</label>
                    <input required name="slug" defaultValue={editingItem?.slug || ""} placeholder="slug (kebab-case)" className="px-3 py-2.5 bg-background border border-card-border text-foreground rounded-xl text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary focus-visible:border-primary/50 transition-colors" />
                  </div>

                  <div className="flex flex-col gap-1.5 md:col-span-2">
                    <label className="text-[10px] font-mono font-bold text-muted uppercase">Tech Stack (comma-separated list)</label>
                    <input required name="techStack" defaultValue={editingItem?.techStack?.join(", ") || ""} placeholder="React, Go, PostgreSQL, Docker" className="px-3 py-2.5 bg-background border border-card-border text-foreground rounded-xl text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary focus-visible:border-primary/50 transition-colors" />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-mono font-bold text-muted uppercase">GitHub Repo URL</label>
                    <input name="githubUrl" defaultValue={editingItem?.githubUrl || ""} placeholder="GitHub URL" className="px-3 py-2.5 bg-background border border-card-border text-foreground rounded-xl text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary focus-visible:border-primary/50 transition-colors" />
                  </div>
                  
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-mono font-bold text-muted uppercase">Live Demo URL</label>
                    <input name="demoUrl" defaultValue={editingItem?.demoUrl || ""} placeholder="Live Demo URL" className="px-3 py-2.5 bg-background border border-card-border text-foreground rounded-xl text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary focus-visible:border-primary/50 transition-colors" />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-mono font-bold text-muted uppercase">Featured Showcase</label>
                      <select name="featured" defaultValue={editingItem?.featured ? "true" : "false"} className="px-3 py-2.5 bg-background border border-card-border text-foreground rounded-xl text-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary">
                        <option value="false" className="bg-card">No</option>
                        <option value="true" className="bg-card">Yes</option>
                      </select>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-mono font-bold text-muted uppercase">Active Status</label>
                      <select name="active" defaultValue={editingItem?.active !== false ? "true" : "false"} className="px-3 py-2.5 bg-background border border-card-border text-foreground rounded-xl text-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary">
                        <option value="true" className="bg-card">Active (Visible)</option>
                        <option value="false" className="bg-card">Inactive (Hidden)</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="flex flex-col gap-1.5 md:col-span-2">
                    <label className="text-[10px] font-mono font-bold text-muted uppercase">Short Description (Summary)</label>
                    <textarea required name="description" defaultValue={editingItem?.description || ""} placeholder="Short summary description" rows={2} className="px-3 py-2.5 bg-background border border-card-border text-foreground rounded-xl text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary focus-visible:border-primary/50 transition-colors" />
                  </div>

                  <div className="flex flex-col gap-1.5 md:col-span-2">
                    <label className="text-[10px] font-mono font-bold text-muted uppercase">Technical Challenges Faced</label>
                    <textarea required name="challenges" defaultValue={editingItem?.challenges || ""} placeholder="Technical Challenges faced" rows={3} className="px-3 py-2.5 bg-background border border-card-border text-foreground rounded-xl text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary focus-visible:border-primary/50 transition-colors" />
                  </div>

                  <div className="flex flex-col gap-1.5 md:col-span-2">
                    <label className="text-[10px] font-mono font-bold text-muted uppercase">Engineering Solutions Implemented</label>
                    <textarea required name="solutions" defaultValue={editingItem?.solutions || ""} placeholder="Engineering Solutions implemented" rows={3} className="px-3 py-2.5 bg-background border border-card-border text-foreground rounded-xl text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary focus-visible:border-primary/50 transition-colors" />
                  </div>

                  <div className="flex flex-col gap-1.5 md:col-span-2">
                    <label className="text-[10px] font-mono font-bold text-muted uppercase">Full Overview Details (Markdown supported)</label>
                    <textarea required name="content" defaultValue={editingItem?.content || ""} placeholder="Full overview details (Markdown)" rows={5} className="px-3 py-2.5 bg-background border border-card-border text-foreground rounded-xl text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary focus-visible:border-primary/50 transition-colors" />
                  </div>

                  <button type="submit" disabled={isPending} className="px-6 py-3 bg-primary text-white font-semibold rounded-xl text-sm hover:bg-primary-hover md:col-span-2 cursor-pointer flex items-center justify-center gap-2 shadow-lg shadow-primary/20">
                    {isPending && <Loader2 className="w-4 h-4 animate-spin" />}
                    {editingItem ? "Update Project" : "Publish Project"}
                  </button>
                </form>
              )}

              {/* BlogPost Form */}
              {activeTab === "blog" && (
                <div className="flex flex-col gap-5">
                  
                  {/* Tabs header selector */}
                  <div className="flex border-b border-card-border/40 select-none pb-1.5 mb-2 overflow-x-auto gap-1">
                    {[
                      { id: "content", name: "Content Editor" },
                      { id: "seo", name: "SEO Optimization" },
                      { id: "publishing", name: "Publishing & Metadata" },
                    ].map((tab) => (
                      <button
                        key={tab.id}
                        type="button"
                        onClick={() => setFormTab(tab.id as any)}
                        className={`px-4 py-2 text-xs font-mono font-bold border-b-2 cursor-pointer transition-all shrink-0 ${
                          formTab === tab.id
                            ? "border-primary text-primary bg-primary/5"
                            : "border-transparent text-muted hover:text-foreground"
                        }`}
                      >
                        {tab.name}
                      </button>
                    ))}
                  </div>

                  <form
                    key={editingItem ? editingItem.id : "new-blog"}
                    onSubmit={handleSaveBlogPost}
                    className="flex flex-col gap-5"
                  >
                    
                    {/* Hidden inputs to capture state values */}
                    <input type="hidden" name="content" value={editorContent} />
                    <input type="hidden" name="readingTime" value={readingTimeState || ""} />

                    {/* CONTENT TAB */}
                    {formTab === "content" && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex flex-col gap-1.5 md:col-span-2">
                          <label className="text-[10px] font-mono font-bold text-muted uppercase">Article Title</label>
                          <input required name="title" defaultValue={editingItem?.title || ""} placeholder="Post Title" className="px-3 py-2.5 bg-background border border-card-border text-foreground rounded-xl text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary focus-visible:border-primary/50 transition-colors" />
                        </div>

                        <div className="flex flex-col gap-1.5">
                          <label className="text-[10px] font-mono font-bold text-muted uppercase">Slug (kebab-case)</label>
                          <input required name="slug" defaultValue={editingItem?.slug || ""} placeholder="slug (kebab-case)" className="px-3 py-2.5 bg-background border border-card-border text-foreground rounded-xl text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary focus-visible:border-primary/50 transition-colors" />
                        </div>

                        <div className="flex flex-col gap-1.5">
                          <label className="text-[10px] font-mono font-bold text-muted uppercase">Category</label>
                          <select required name="categoryId" defaultValue={editingItem?.categoryId || ""} className="px-3 py-2.5 bg-background border border-card-border text-foreground rounded-xl text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary">
                            <option value="" className="bg-card">Select Category</option>
                            {categories.map((c) => (
                              <option key={c.id} value={c.id} className="bg-card">{c.name}</option>
                            ))}
                          </select>
                        </div>

                        <div className="flex flex-col gap-1.5 md:col-span-2">
                          <label className="text-[10px] font-mono font-bold text-muted uppercase">Short Description (Excerpt / Summary)</label>
                          <textarea required name="summary" defaultValue={editingItem?.summary || ""} placeholder="Short description excerpt summary..." rows={2} className="px-3 py-2.5 bg-background border border-card-border text-foreground rounded-xl text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary focus-visible:border-primary/50 transition-colors" />
                        </div>

                        <div className="flex flex-col gap-1.5 md:col-span-2">
                          <label className="text-[10px] font-mono font-bold text-muted uppercase">Cover Image URL</label>
                          <input name="coverImage" defaultValue={editingItem?.coverImage || ""} placeholder="Cover Image URL" className="px-3 py-2.5 bg-background border border-card-border text-foreground rounded-xl text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary focus-visible:border-primary/50 transition-colors" />
                        </div>

                        {/* ADVANCED RICH BLOCK EDITOR CONTAINER */}
                        <div className="flex flex-col gap-1.5 md:col-span-2 mt-2">
                          <label className="text-[10px] font-mono font-bold text-muted uppercase">Visual Block Editor</label>
                          <RichBlogEditor initialValue={editorContent} onChange={setEditorContent} onChangeReadingTime={setReadingTimeState} />
                        </div>
                      </div>
                    )}

                    {/* SEO TAB */}
                    {formTab === "seo" && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex flex-col gap-1.5 md:col-span-2">
                          <label className="text-[10px] font-mono font-bold text-muted uppercase">SEO Title Meta Tag</label>
                          <input name="seoTitle" defaultValue={editingItem?.seoTitle || ""} placeholder="SEO Meta Title (defaults to title)" className="px-3 py-2.5 bg-background border border-card-border text-foreground rounded-xl text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary" />
                        </div>

                        <div className="flex flex-col gap-1.5 md:col-span-2">
                          <label className="text-[10px] font-mono font-bold text-muted uppercase">SEO Description Meta Tag</label>
                          <textarea name="seoDescription" defaultValue={editingItem?.seoDescription || ""} placeholder="SEO Meta Description (defaults to summary)" rows={2} className="px-3 py-2.5 bg-background border border-card-border text-foreground rounded-xl text-sm focus-visible:outline-none" />
                        </div>

                        <div className="flex flex-col gap-1.5 md:col-span-2">
                          <label className="text-[10px] font-mono font-bold text-muted uppercase">Keywords (comma-separated)</label>
                          <input name="seoKeywords" defaultValue={editingItem?.seoKeywords || ""} placeholder="e.g. serverless, caching, nextjs" className="px-3 py-2.5 bg-background border border-card-border text-foreground rounded-xl text-sm focus-visible:outline-none" />
                        </div>

                        <div className="flex flex-col gap-1.5">
                          <label className="text-[10px] font-mono font-bold text-muted uppercase">Canonical Link URL</label>
                          <input name="canonicalUrl" defaultValue={editingItem?.canonicalUrl || ""} placeholder="https://example.com/blog/slug" className="px-3 py-2.5 bg-background border border-card-border text-foreground rounded-xl text-sm focus-visible:outline-none" />
                        </div>

                        <div className="flex flex-col gap-1.5">
                          <label className="text-[10px] font-mono font-bold text-muted uppercase">OpenGraph OG Image URL</label>
                          <input name="ogImage" defaultValue={editingItem?.ogImage || ""} placeholder="OG Share Image URL (defaults to coverImage)" className="px-3 py-2.5 bg-background border border-card-border text-foreground rounded-xl text-sm focus-visible:outline-none" />
                        </div>
                      </div>
                    )}

                    {/* PUBLISHING TAB */}
                    {formTab === "publishing" && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex flex-col gap-1.5">
                          <label className="text-[10px] font-mono font-bold text-muted uppercase">Status</label>
                          <select name="status" defaultValue={editingItem?.status || "DRAFT"} className="px-3 py-2.5 bg-background border border-card-border text-foreground rounded-xl text-xs focus-visible:outline-none">
                            <option value="DRAFT" className="bg-card">Draft (Unpublished)</option>
                            <option value="PUBLISHED" className="bg-card">Published (Live)</option>
                            <option value="SCHEDULED" className="bg-card">Scheduled (Delay Publish)</option>
                            <option value="ARCHIVED" className="bg-card">Archived</option>
                          </select>
                        </div>

                        <div className="flex flex-col gap-1.5">
                          <label className="text-[10px] font-mono font-bold text-muted uppercase">Schedule Publish Date/Time</label>
                          <input name="publishedAt" type="datetime-local" defaultValue={editingItem?.publishedAt ? new Date(editingItem.publishedAt).toISOString().slice(0, 16) : ""} className="px-3 py-2.5 bg-background border border-card-border text-foreground rounded-xl text-xs focus-visible:outline-none" />
                        </div>

                        <div className="flex flex-col gap-1.5">
                          <label className="text-[10px] font-mono font-bold text-muted uppercase">Visibility</label>
                          <select name="visibility" defaultValue={editingItem?.visibility || "PUBLIC"} className="px-3 py-2.5 bg-background border border-card-border text-foreground rounded-xl text-xs focus-visible:outline-none">
                            <option value="PUBLIC" className="bg-card">Public (Everyone)</option>
                            <option value="PRIVATE" className="bg-card">Private (Author Only)</option>
                          </select>
                        </div>

                        <div className="flex flex-col gap-1.5">
                          <label className="text-[10px] font-mono font-bold text-muted uppercase">Language</label>
                          <select name="language" defaultValue={editingItem?.language || "en"} className="px-3 py-2.5 bg-background border border-card-border text-foreground rounded-xl text-xs focus-visible:outline-none">
                            <option value="en" className="bg-card">English (en)</option>
                            <option value="vi" className="bg-card">Tiếng Việt (vi)</option>
                            <option value="ja" className="bg-card">日本語 (ja)</option>
                          </select>
                        </div>

                        <div className="flex flex-col gap-1.5 md:col-span-2">
                          <label className="text-[10px] font-mono font-bold text-muted uppercase">Thumbnail URL</label>
                          <input name="thumbnail" defaultValue={editingItem?.thumbnail || ""} placeholder="Small thumbnail thumbnail URL" className="px-3 py-2.5 bg-background border border-card-border text-foreground rounded-xl text-sm focus-visible:outline-none" />
                        </div>

                        <div className="flex flex-col gap-1.5 md:col-span-2">
                          <label className="text-[10px] font-mono font-bold text-muted uppercase">Full Excerpt Description</label>
                          <textarea name="description" defaultValue={editingItem?.description || ""} placeholder="Extended article markdown overview description..." rows={2} className="px-3 py-2.5 bg-background border border-card-border text-foreground rounded-xl text-sm focus-visible:outline-none" />
                        </div>

                        <div className="flex flex-col gap-1.5 md:col-span-2">
                          <label className="text-[10px] font-mono font-bold text-muted uppercase">Theme Configuration Metadata</label>
                          <input name="themeMetadata" defaultValue={editingItem?.themeMetadata || ""} placeholder='e.g. {"theme": "dark", "layout": "full"}' className="px-3 py-2.5 bg-background border border-card-border text-foreground rounded-xl text-sm focus-visible:outline-none" />
                        </div>
                      </div>
                    )}

                    {/* Submit Actions */}
                    <button type="submit" disabled={isPending} className="px-6 py-3 bg-primary text-white font-semibold rounded-xl text-sm hover:bg-primary-hover w-full cursor-pointer flex items-center justify-center gap-2 shadow-lg shadow-primary/20">
                      {isPending && <Loader2 className="w-4 h-4 animate-spin" />}
                      {editingItem ? "Update Post Settings" : "Publish New Post"}
                    </button>

                  </form>
                </div>
              )}

              {/* Skill Form */}
              {activeTab === "skills" && (
                <form
                  key={editingItem ? editingItem.id : "new-skill"}
                  onSubmit={handleSaveSkill}
                  className="grid grid-cols-1 sm:grid-cols-2 gap-4"
                >
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-mono font-bold text-muted uppercase">Skill Name</label>
                    <input required name="name" defaultValue={editingItem?.name || ""} placeholder="Skill Name (e.g. Next.js)" className="px-3 py-2.5 bg-background border border-card-border text-foreground rounded-xl text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary focus-visible:border-primary/50 transition-colors" />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-mono font-bold text-muted uppercase">Category Group</label>
                    <input required name="category" defaultValue={editingItem?.category || ""} placeholder="Category (e.g. Frontend, Backend, DevOps)" className="px-3 py-2.5 bg-background border border-card-border text-foreground rounded-xl text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary focus-visible:border-primary/50 transition-colors" />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-mono font-bold text-muted uppercase">Proficiency Percentage (1-100)</label>
                    <input required name="proficiency" type="number" min={1} max={100} defaultValue={editingItem?.proficiency || ""} placeholder="Proficiency % (1-100)" className="px-3 py-2.5 bg-background border border-card-border text-foreground rounded-xl text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary focus-visible:border-primary/50 transition-colors" />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-mono font-bold text-muted uppercase">Lucide Icon String identifier</label>
                    <input name="icon" defaultValue={editingItem?.icon || ""} placeholder="Lucide Icon string (e.g. Layout, Server, Database)" className="px-3 py-2.5 bg-background border border-card-border text-foreground rounded-xl text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary focus-visible:border-primary/50 transition-colors" />
                  </div>

                  <div className="flex flex-col gap-1.5 sm:col-span-2">
                    <label className="text-[10px] font-mono font-bold text-muted uppercase">Active Status</label>
                    <select name="active" defaultValue={editingItem?.active !== false ? "true" : "false"} className="px-3 py-2.5 bg-background border border-card-border text-foreground rounded-xl text-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary">
                      <option value="true" className="bg-card">Active (Visible)</option>
                      <option value="false" className="bg-card">Inactive (Hidden)</option>
                    </select>
                  </div>

                  <button type="submit" disabled={isPending} className="px-6 py-2.5 bg-primary text-white font-semibold rounded-xl text-sm hover:bg-primary-hover sm:col-span-2 cursor-pointer flex items-center justify-center gap-2 shadow-lg shadow-primary/20">
                    {isPending && <Loader2 className="w-4 h-4 animate-spin" />}
                    {editingItem ? "Update Skill" : "Save Skill"}
                  </button>
                </form>
              )}

              {/* Experience Form */}
              {activeTab === "experience" && (
                <form
                  key={editingItem ? editingItem.id : "new-experience"}
                  onSubmit={handleSaveExperience}
                  className="grid grid-cols-1 md:grid-cols-2 gap-4"
                >
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-mono font-bold text-muted uppercase">Company Name</label>
                    <input required name="company" defaultValue={editingItem?.company || ""} placeholder="Company Name" className="px-3 py-2.5 bg-background border border-card-border text-foreground rounded-xl text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary focus-visible:border-primary/50 transition-colors" />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-mono font-bold text-muted uppercase">Job Role / Title</label>
                    <input required name="role" defaultValue={editingItem?.role || ""} placeholder="Job Title / Role" className="px-3 py-2.5 bg-background border border-card-border text-foreground rounded-xl text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary focus-visible:border-primary/50 transition-colors" />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-mono font-bold text-muted uppercase">Start Date</label>
                    <input required name="startDate" type="date" defaultValue={formatDateForInput(editingItem?.startDate)} placeholder="Start Date" className="px-3 py-2.5 bg-background border border-card-border text-foreground rounded-xl text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary focus-visible:border-primary/50 transition-colors" />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-mono font-bold text-muted uppercase">End Date (optional)</label>
                    <input name="endDate" type="date" defaultValue={formatDateForInput(editingItem?.endDate)} placeholder="End Date" className="px-3 py-2.5 bg-background border border-card-border text-foreground rounded-xl text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary focus-visible:border-primary/50 transition-colors" />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-mono font-bold text-muted uppercase">Office Location</label>
                    <input name="location" defaultValue={editingItem?.location || ""} placeholder="Location (e.g. Remote, SF)" className="px-3 py-2.5 bg-background border border-card-border text-foreground rounded-xl text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary focus-visible:border-primary/50 transition-colors" />
                  </div>
                  
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-mono font-bold text-muted uppercase">Current Job</label>
                    <select name="current" defaultValue={editingItem?.current ? "true" : "false"} className="px-3 py-2.5 bg-background border border-card-border text-foreground rounded-xl text-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary">
                      <option value="false" className="bg-card">No (Past job)</option>
                      <option value="true" className="bg-card">Yes (Current job)</option>
                    </select>
                  </div>
                  
                  <div className="flex flex-col gap-1.5 md:col-span-2">
                    <label className="text-[10px] font-mono font-bold text-muted uppercase">Role Achievements & Duties</label>
                    <textarea required name="description" defaultValue={editingItem?.description || ""} placeholder="Responsibilities, skills used, achievements" rows={4} className="px-3 py-2.5 bg-background border border-card-border text-foreground rounded-xl text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary focus-visible:border-primary/50 transition-colors" />
                  </div>

                  <button type="submit" disabled={isPending} className="px-6 py-3 bg-primary text-white font-semibold rounded-xl text-sm hover:bg-primary-hover md:col-span-2 cursor-pointer flex items-center justify-center gap-2 shadow-lg shadow-primary/20">
                    {isPending && <Loader2 className="w-4 h-4 animate-spin" />}
                    {editingItem ? "Update Experience" : "Save Experience"}
                  </button>
                </form>
              )}
            </div>
          )}

          {/* 6. List Panel cards wrapper */}
          <div className="flex flex-col gap-4">
            
            {/* Header select-all toolbar */}
            {processedItems.length > 0 && (
              <div className="flex items-center justify-between px-5 py-2 border-b border-card-border/40 text-xs font-mono text-muted select-none">
                <div className="flex items-center gap-2">
                  <label className="relative flex items-center justify-center cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={paginatedItems.length > 0 && paginatedItems.map((item) => item.id).every((id) => selectedIds.includes(id))}
                      onChange={handleSelectAllToggle}
                      aria-label="Select all on current page"
                      className="sr-only"
                    />
                    <div
                      className={`w-4 h-4 rounded border flex items-center justify-center transition-all ${
                        paginatedItems.length > 0 && paginatedItems.map((item) => item.id).every((id) => selectedIds.includes(id))
                          ? "bg-primary border-primary text-white"
                          : "border-card-border/80 bg-background text-transparent hover:border-primary/50"
                      }`}
                    >
                      {paginatedItems.length > 0 && paginatedItems.map((item) => item.id).every((id) => selectedIds.includes(id)) && (
                        <svg className="w-2.5 h-2.5 stroke-current" viewBox="0 0 24 24" fill="none" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                      )}
                    </div>
                  </label>
                  <span>Select All on Page ({paginatedItems.length})</span>
                </div>
                <span>Total Filtered: {processedItems.length}</span>
              </div>
            )}

            {/* Skeleton Loading Panel during transitions */}
            {isPending && paginatedItems.length === 0 ? (
              <CMSSkeleton count={3} />
            ) : paginatedItems.length > 0 ? (
              paginatedItems.map((item) => (
                <CMSCard
                  key={item.id}
                  type={activeTab}
                  item={item}
                  isSelected={selectedIds.includes(item.id)}
                  onSelectToggle={handleSelectToggle}
                  onView={handleViewItem}
                  onEdit={handleEditClick}
                  onDuplicate={handleDuplicateItem}
                  onDelete={handleDeleteItemTrigger}
                  onStatusChange={handleStatusChangeHub}
                />
              ))
            ) : (
              <CMSEmptyState
                type={activeTab}
                hasFilters={searchQuery.trim().length > 0 || statusFilter !== "all"}
                onAddClick={() => setShowForm(true)}
              />
            )}
          </div>

          {/* 7. Pagination Controls */}
          <CMSPagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={(page) => setCurrentPage(page)}
          />

            </>
          )}
        </main>
      </div>

      {/* Floating Bulk Operations Toolbar */}
      {activeTab !== "media" && (
        <CMSBulkToolbar
          type={activeTab}
          selectedCount={selectedIds.length}
          onClear={() => setSelectedIds([])}
          onBulkAction={handleBulkActionTrigger}
          isPending={isPending}
        />
      )}

      {/* Custom Reusable Dialog Modals */}
      <CMSConfirmDialog
        isOpen={confirmOpen}
        title={confirmConfig?.title || ""}
        description={confirmConfig?.description || ""}
        onConfirm={confirmConfig?.onConfirm || (() => {})}
        onCancel={() => setConfirmOpen(false)}
        isPending={isPending}
      />

      {activeTab !== "media" && (
        <CMSPreviewModal
          isOpen={previewOpen}
          item={previewItem}
          type={activeTab}
          onClose={() => {
            setPreviewOpen(false)
            setPreviewItem(null)
          }}
        />
      )}

      {/* Custom Animated Success/Error Toasts */}
      <Toast toasts={toasts} onClose={(id) => setToasts((prev) => prev.filter((t) => t.id !== id))} />

    </div>
  )
}
