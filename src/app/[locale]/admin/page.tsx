import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { ProjectService } from "@/services/project.service"
import { BlogService } from "@/services/blog.service"
import { SkillService } from "@/services/skill.service"
import { ExperienceService } from "@/services/experience.service"
import { ContactService } from "@/services/contact.service"
import AdminDashboard from "@/components/admin/AdminDashboard"

export const dynamic = "force-dynamic" // Ensure session checks run on every request

export default async function AdminPage() {
  const session = await auth()
  if (!session || !session.user || session.user.role !== "ADMIN") {
    redirect("/admin/login")
  }

  const projectService = new ProjectService()
  const blogService = new BlogService()
  const skillService = new SkillService()
  const expService = new ExperienceService()
  const contactService = new ContactService()

  let projects: any[] = []
  let blogPosts: any[] = []
  let skills: any[] = []
  let experiences: any[] = []
  let messages: any[] = []
  let categories: any[] = []

  try {
    const [dbProjects, dbBlog, dbSkills, dbExperiences, dbMessages, dbCategories] = await Promise.all([
      projectService.getProjects().catch(() => []),
      blogService.getPosts({ publishedOnly: false }).catch(() => ({ posts: [] })),
      skillService.getSkills().catch(() => []),
      expService.getExperiences().catch(() => []),
      contactService.getMessages().catch(() => []),
      blogService.getCategories().catch(() => []),
    ])

    projects = dbProjects
    blogPosts = dbBlog.posts
    skills = dbSkills
    experiences = dbExperiences
    messages = dbMessages
    categories = dbCategories
  } catch (err) {
    console.error("⚠️ Failed to load database resources in Admin CMS page", err)
  }

  return (
    <AdminDashboard
      initialProjects={projects}
      initialBlogPosts={blogPosts}
      initialSkills={skills}
      initialExperiences={experiences}
      initialMessages={messages}
      categories={categories}
    />
  )
}
