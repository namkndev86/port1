import prisma from '@/lib/db';
import { Project, ProjectImage } from '@prisma/client';

export type ProjectWithImages = Project & { images: ProjectImage[] };

export class ProjectRepository {
  async findAll(options?: { activeOnly?: boolean }): Promise<ProjectWithImages[]> {
    const whereClause: any = {};
    if (options?.activeOnly) {
      whereClause.active = true;
    }
    return prisma.project.findMany({
      where: whereClause,
      include: { images: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findFeatured(): Promise<ProjectWithImages[]> {
    return prisma.project.findMany({
      where: { featured: true, active: true },
      include: { images: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findBySlug(slug: string): Promise<ProjectWithImages | null> {
    return prisma.project.findUnique({
      where: { slug },
      include: { images: true },
    });
  }

  async findById(id: string): Promise<ProjectWithImages | null> {
    return prisma.project.findUnique({
      where: { id },
      include: { images: true },
    });
  }

  async create(data: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>, imageUrls?: string[]): Promise<ProjectWithImages> {
    return prisma.project.create({
      data: {
        ...data,
        images: imageUrls
          ? {
              create: imageUrls.map((url, i) => ({
                url,
                alt: `${data.title} Screenshot ${i + 1}`,
                isMain: i === 0,
              })),
            }
          : undefined,
      },
      include: { images: true },
    });
  }

  async update(
    id: string,
    data: Partial<Omit<Project, 'id' | 'createdAt' | 'updatedAt'>>,
    imageUrls?: string[]
  ): Promise<ProjectWithImages> {
    // If new images are provided, replace existing images
    if (imageUrls) {
      await prisma.projectImage.deleteMany({
        where: { projectId: id },
      });
    }

    return prisma.project.update({
      where: { id },
      data: {
        ...data,
        images: imageUrls
          ? {
              create: imageUrls.map((url, i) => ({
                url,
                alt: `${data.title || 'Project'} Screenshot ${i + 1}`,
                isMain: i === 0,
              })),
            }
          : undefined,
      },
      include: { images: true },
    });
  }

  async delete(id: string): Promise<Project> {
    return prisma.project.delete({
      where: { id },
    });
  }
}
