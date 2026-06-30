"use server"

import { auth, signIn, signOut } from "@/lib/auth"
import { ProjectService } from "@/services/project.service"
import { BlogService } from "@/services/blog.service"
import { SkillService } from "@/services/skill.service"
import { ExperienceService } from "@/services/experience.service"
import { ContactService } from "@/services/contact.service"
import { UserRepository } from "@/repositories/user.repository"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { loginSchema, ContactMessageInput, ProfileInput, SkillInput, ExperienceInput, ProjectInput, BlogPostInput } from "@/lib/validation"

// Helper to assert admin authorization status
async function assertAdmin() {
  const session = await auth()
  if (!session || session.user.role !== "ADMIN") {
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
