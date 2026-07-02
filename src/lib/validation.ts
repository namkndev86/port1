import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const contactMessageSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  subject: z.string().min(3, 'Subject must be at least 3 characters'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

export const profileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  title: z.string().min(2, 'Title must be at least 2 characters'),
  tagline: z.string().min(5, 'Tagline must be at least 5 characters'),
  bio: z.string().min(10, 'Bio must be at least 10 characters'),
  avatarUrl: z.string().url().nullable().optional().or(z.literal('')),
  resumeUrl: z.string().url().nullable().optional().or(z.literal('')),
  githubUrl: z.string().url().nullable().optional().or(z.literal('')),
  linkedinUrl: z.string().url().nullable().optional().or(z.literal('')),
  twitterUrl: z.string().url().nullable().optional().or(z.literal('')),
});

export const skillSchema = z.object({
  name: z.string().min(1, 'Skill name is required'),
  category: z.string().min(1, 'Category is required'),
  proficiency: z.number().int().min(1).max(100, 'Proficiency must be between 1 and 100'),
  icon: z.string().optional().nullable(),
});

export const experienceSchema = z.object({
  company: z.string().min(1, 'Company is required'),
  role: z.string().min(1, 'Role is required'),
  startDate: z.coerce.date(),
  endDate: z.coerce.date().nullable().optional(),
  current: z.boolean().default(false),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  location: z.string().optional().nullable(),
});

export const projectSchema = z.object({
  title: z.string().min(2, 'Title is required'),
  slug: z.string().min(2, 'Slug is required').regex(/^[a-z0-9-]+$/, 'Slug must be url-friendly (kebab-case)'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  content: z.string().min(10, 'Content details are required'),
  githubUrl: z.string().url().optional().nullable().or(z.literal('')),
  demoUrl: z.string().url().optional().nullable().or(z.literal('')),
  featured: z.boolean().default(false),
  techStack: z.array(z.string()).min(1, 'At least one technology is required'),
  challenges: z.string().min(10, 'Challenges description is required'),
  solutions: z.string().min(10, 'Solutions description is required'),
  imageUrls: z.array(z.string().url()).optional().default([]),
});

export const blogPostSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters'),
  slug: z.string().min(2, 'Slug is required').regex(/^[a-z0-9-]+$/, 'Slug must be url-friendly (kebab-case)'),
  summary: z.string().min(10, 'Summary must be at least 10 characters'),
  content: z.string().min(20, 'Content details must be at least 20 characters'),
  coverImage: z.string().url().optional().nullable().or(z.literal('')),
  published: z.boolean().default(false),
  categoryId: z.string().min(1, 'Category is required'),
  tagIds: z.array(z.string()).optional().default([]),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type ContactMessageInput = z.infer<typeof contactMessageSchema>;
export type ProfileInput = z.infer<typeof profileSchema>;
export type SkillInput = z.infer<typeof skillSchema>;
export type ExperienceInput = z.infer<typeof experienceSchema>;
export type ProjectInput = z.infer<typeof projectSchema>;
export type BlogPostInput = z.infer<typeof blogPostSchema>;
