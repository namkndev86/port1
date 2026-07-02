import { type Project } from '@prisma/client';

import { NotFoundError, ValidationError } from '@/lib/errors';
import { type ProjectInput,projectSchema } from '@/lib/validation';
import { ProjectRepository, type ProjectWithImages } from '@/repositories/project.repository';

export class ProjectService {
  private projectRepo = new ProjectRepository();

  async getProjects(options?: { activeOnly?: boolean }): Promise<ProjectWithImages[]> {
    return this.projectRepo.findAll(options);
  }

  async getFeaturedProjects(): Promise<ProjectWithImages[]> {
    return this.projectRepo.findFeatured();
  }

  async getProjectBySlug(slug: string): Promise<ProjectWithImages> {
    const project = await this.projectRepo.findBySlug(slug);
    if (!project) {
      throw new NotFoundError(`Project with slug "${slug}" not found`);
    }
    return project;
  }

  async getProjectById(id: string): Promise<ProjectWithImages> {
    const project = await this.projectRepo.findById(id);
    if (!project) {
      throw new NotFoundError(`Project with ID "${id}" not found`);
    }
    return project;
  }

  async createProject(input: ProjectInput): Promise<ProjectWithImages> {
    const result = projectSchema.safeParse(input);
    if (!result.success) {
      throw new ValidationError('Invalid project data', result.error.format());
    }

    const { imageUrls, ...projectData } = result.data;
    
    // Check if slug is unique
    const existing = await this.projectRepo.findBySlug(projectData.slug);
    if (existing) {
      throw new ValidationError('A project with this slug already exists');
    }

    return this.projectRepo.create(projectData as any, imageUrls);
  }

  async updateProject(id: string, input: ProjectInput): Promise<ProjectWithImages> {
    const project = await this.projectRepo.findById(id);
    if (!project) {
      throw new NotFoundError(`Project with ID "${id}" not found`);
    }

    const result = projectSchema.safeParse(input);
    if (!result.success) {
      throw new ValidationError('Invalid project data', result.error.format());
    }

    const { imageUrls, ...projectData } = result.data;

    // Check if slug is unique (excluding this project)
    const existing = await this.projectRepo.findBySlug(projectData.slug);
    if (existing && existing.id !== id) {
      throw new ValidationError('A project with this slug already exists');
    }

    return this.projectRepo.update(id, projectData as any, imageUrls);
  }

  async deleteProject(id: string): Promise<Project> {
    const project = await this.projectRepo.findById(id);
    if (!project) {
      throw new NotFoundError(`Project with ID "${id}" not found`);
    }
    return this.projectRepo.delete(id);
  }
}
