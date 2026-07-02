"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

import { auth, signIn, signOut } from "@/lib/auth"
import prisma from "@/lib/db"
import { type BlogPostInput, type ExperienceInput, loginSchema, type ProfileInput, type ProjectInput, type SkillInput } from "@/lib/validation"
import { UserRepository } from "@/repositories/user.repository"
import { BlogService } from "@/services/blog.service"
import { ContactService } from "@/services/contact.service"
import { ExperienceService } from "@/services/experience.service"
import { ProjectService } from "@/services/project.service"
import { SkillService } from "@/services/skill.service"

// Helper to assert admin authorization status
async function assertAdmin() {
  const session = await auth()
  if (!session || !session.user || session.user.role !== "ADMIN") {
    throw new Error("Access denied. Unauthorized operation.")
  }
  return session
}

// 1. Authentication actions
export async function loginAction(prevState: any, formData: FormData) {
  const email = formData.get("email") as string
  const password = formData.get("password") as string

  const parsed = loginSchema.safeParse({ email, password })
  if (!parsed.success) {
    return { error: "Invalid email or password structure" }
  }

  try {
    await signIn("credentials", {
      email,
      password,
      redirect: false,
    })
  } catch (err: any) {
    console.error("Auth error:", err)
    return { error: "Authentication failed. Invalid credentials." }
  }

  redirect("/admin")
}

export async function logoutAction() {
  await signOut({ redirectTo: "/" })
}

// 2. Profile actions
export async function updateProfileAction(data: ProfileInput) {
  const session = await assertAdmin()
  const userRepo = new UserRepository()
  await userRepo.upsertProfile(session.user.id, data as any)
  revalidatePath("/portfolio")
  return { success: true }
}

// 3. Project actions
export async function createProjectAction(data: ProjectInput) {
  await assertAdmin()
  const service = new ProjectService()
  const project = await service.createProject(data)
  revalidatePath("/portfolio")
  revalidatePath("/portfolio/projects")
  return { success: true, data: project }
}

export async function updateProjectAction(id: string, data: ProjectInput) {
  await assertAdmin()
  const service = new ProjectService()
  const project = await service.updateProject(id, data)
  revalidatePath("/portfolio")
  revalidatePath("/portfolio/projects")
  revalidatePath(`/portfolio/projects/${data.slug}`)
  return { success: true, data: project }
}

export async function deleteProjectAction(id: string) {
  await assertAdmin()
  const service = new ProjectService()
  const project = await service.deleteProject(id)
  revalidatePath("/portfolio")
  revalidatePath("/portfolio/projects")
  return { success: true, data: project }
}

// 4. Blog actions
export async function createBlogPostAction(data: BlogPostInput) {
  const session = await assertAdmin()
  const service = new BlogService()
  const post = await service.createPost(session.user.id, data)
  revalidatePath("/blog")
  return { success: true, data: post }
}

export async function updateBlogPostAction(id: string, data: BlogPostInput) {
  await assertAdmin()
  const service = new BlogService()
  const post = await service.updatePost(id, data)
  revalidatePath("/blog")
  revalidatePath(`/blog/${data.slug}`)
  return { success: true, data: post }
}

export async function deleteBlogPostAction(id: string) {
  await assertAdmin()
  const service = new BlogService()
  const post = await service.deletePost(id)
  revalidatePath("/blog")
  return { success: true, data: post }
}

// 5. Skill actions
export async function createSkillAction(data: SkillInput) {
  await assertAdmin()
  const service = new SkillService()
  const skill = await service.createSkill(data)
  revalidatePath("/portfolio")
  return { success: true, data: skill }
}

export async function updateSkillAction(id: string, data: SkillInput) {
  await assertAdmin()
  const service = new SkillService()
  const skill = await service.updateSkill(id, data)
  revalidatePath("/portfolio")
  return { success: true, data: skill }
}

export async function deleteSkillAction(id: string) {
  await assertAdmin()
  const service = new SkillService()
  const skill = await service.deleteSkill(id)
  revalidatePath("/portfolio")
  return { success: true, data: skill }
}

// 6. Experience actions
export async function createExperienceAction(data: ExperienceInput) {
  await assertAdmin()
  const service = new ExperienceService()
  const exp = await service.createExperience(data)
  revalidatePath("/portfolio")
  return { success: true, data: exp }
}

export async function updateExperienceAction(id: string, data: ExperienceInput) {
  await assertAdmin()
  const service = new ExperienceService()
  const exp = await service.updateExperience(id, data)
  revalidatePath("/portfolio")
  return { success: true, data: exp }
}

export async function deleteExperienceAction(id: string) {
  await assertAdmin()
  const service = new ExperienceService()
  const exp = await service.deleteExperience(id)
  revalidatePath("/portfolio")
  return { success: true, data: exp }
}

// 7. Contact actions
export async function markContactMessageReadAction(id: string, read: boolean) {
  await assertAdmin()
  const service = new ContactService()
  const msg = await service.markAsRead(id, read)
  return { success: true, data: msg }
}

export async function deleteContactMessageAction(id: string) {
  await assertAdmin()
  const service = new ContactService()
  const msg = await service.deleteMessage(id)
  return { success: true, data: msg }
}

// 8. Clones & Duplications actions
export async function duplicateProjectAction(id: string) {
  await assertAdmin()
  const original = await prisma.project.findUnique({
    where: { id },
    include: { images: true }
  })
  if (!original) throw new Error("Project not found")

  const slugSuffix = Math.floor(Math.random() * 10000)
  const newSlug = `${original.slug}-copy-${slugSuffix}`

  const project = await prisma.project.create({
    data: {
      title: `Copy of ${original.title}`,
      slug: newSlug,
      description: original.description,
      content: original.content,
      githubUrl: original.githubUrl,
      demoUrl: original.demoUrl,
      featured: false,
      active: original.active,
      techStack: original.techStack,
      challenges: original.challenges,
      solutions: original.solutions,
      images: {
        create: original.images.map((img) => ({
          url: img.url,
          alt: img.alt,
          isMain: img.isMain,
        })),
      },
    },
    include: { images: true },
  })

  revalidatePath("/portfolio")
  revalidatePath("/portfolio/projects")
  return { success: true, data: project }
}

export async function duplicateBlogPostAction(id: string) {
  await assertAdmin()
  const original = await prisma.blogPost.findUnique({
    where: { id },
    include: { tags: true }
  })
  if (!original) throw new Error("Blog post not found")

  const slugSuffix = Math.floor(Math.random() * 10000)
  const newSlug = `${original.slug}-copy-${slugSuffix}`

  const post = await prisma.blogPost.create({
    data: {
      title: `Copy of ${original.title}`,
      slug: newSlug,
      summary: original.summary,
      description: original.description,
      content: original.content,
      coverImage: original.coverImage,
      thumbnail: original.thumbnail,
      readingTime: original.readingTime,
      status: "DRAFT",
      published: false,
      archived: false,
      seoTitle: original.seoTitle,
      seoDescription: original.seoDescription,
      seoKeywords: original.seoKeywords,
      canonicalUrl: original.canonicalUrl,
      ogImage: original.ogImage,
      visibility: original.visibility,
      language: original.language,
      themeMetadata: original.themeMetadata,
      authorId: original.authorId,
      categoryId: original.categoryId,
      tags: {
        connect: original.tags.map((tag) => ({ id: tag.id })),
      },
    },
    include: { category: true, tags: true },
  })

  revalidatePath("/blog")
  return { success: true, data: post }
}

export async function duplicateSkillAction(id: string) {
  await assertAdmin()
  const original = await prisma.skill.findUnique({ where: { id } })
  if (!original) throw new Error("Skill not found")

  const nameSuffix = Math.floor(Math.random() * 10000)
  const newName = `${original.name} Copy ${nameSuffix}`

  const skill = await prisma.skill.create({
    data: {
      name: newName,
      category: original.category,
      proficiency: original.proficiency,
      icon: original.icon,
      active: original.active,
    },
  })

  revalidatePath("/portfolio")
  return { success: true, data: skill }
}

export async function duplicateExperienceAction(id: string) {
  await assertAdmin()
  const original = await prisma.experience.findUnique({ where: { id } })
  if (!original) throw new Error("Experience not found")

  const exp = await prisma.experience.create({
    data: {
      company: original.company,
      role: `Copy of ${original.role}`,
      startDate: original.startDate,
      endDate: original.endDate,
      current: original.current,
      description: original.description,
      location: original.location,
    },
  })

  revalidatePath("/portfolio")
  return { success: true, data: exp }
}

// 9. Bulk Actions
export async function bulkUpdateProjectsAction(ids: string[], active: boolean) {
  await assertAdmin()
  await prisma.project.updateMany({
    where: { id: { in: ids } },
    data: { active },
  })
  revalidatePath("/portfolio")
  revalidatePath("/portfolio/projects")
  return { success: true }
}

export async function bulkDeleteProjectsAction(ids: string[]) {
  await assertAdmin()
  await prisma.project.deleteMany({
    where: { id: { in: ids } },
  })
  revalidatePath("/portfolio")
  revalidatePath("/portfolio/projects")
  return { success: true }
}

export async function bulkUpdateBlogPostsAction(ids: string[], data: { published?: boolean; archived?: boolean }) {
  await assertAdmin()
  const updateData: any = {}
  if (data.published !== undefined) {
    updateData.published = data.published
    updateData.publishedAt = data.published ? new Date() : null
  }
  if (data.archived !== undefined) {
    updateData.archived = data.archived
  }
  await prisma.blogPost.updateMany({
    where: { id: { in: ids } },
    data: updateData,
  })
  revalidatePath("/blog")
  return { success: true }
}

export async function bulkDeleteBlogPostsAction(ids: string[]) {
  await assertAdmin()
  await prisma.blogPost.deleteMany({
    where: { id: { in: ids } },
  })
  revalidatePath("/blog")
  return { success: true }
}

export async function bulkUpdateSkillsAction(ids: string[], active: boolean) {
  await assertAdmin()
  await prisma.skill.updateMany({
    where: { id: { in: ids } },
    data: { active },
  })
  revalidatePath("/portfolio")
  return { success: true }
}

export async function bulkDeleteSkillsAction(ids: string[]) {
  await assertAdmin()
  await prisma.skill.deleteMany({
    where: { id: { in: ids } },
  })
  revalidatePath("/portfolio")
  return { success: true }
}

export async function bulkUpdateExperiencesAction(ids: string[], current: boolean) {
  await assertAdmin()
  await prisma.experience.updateMany({
    where: { id: { in: ids } },
    data: { current },
  })
  revalidatePath("/portfolio")
  return { success: true }
}

export async function bulkDeleteExperiencesAction(ids: string[]) {
  await assertAdmin()
  await prisma.experience.deleteMany({
    where: { id: { in: ids } },
  })
  revalidatePath("/portfolio")
  return { success: true }
}

export async function bulkUpdateMessagesAction(ids: string[], read: boolean) {
  await assertAdmin()
  await prisma.contactMessage.updateMany({
    where: { id: { in: ids } },
    data: { read },
  })
  return { success: true }
}

export async function bulkDeleteMessagesAction(ids: string[]) {
  await assertAdmin()
  await prisma.contactMessage.deleteMany({
    where: { id: { in: ids } },
  })
  return { success: true }
}
