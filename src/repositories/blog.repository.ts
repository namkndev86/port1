import prisma from '@/lib/db';
import { BlogPost, BlogCategory, BlogTag } from '@prisma/client';

export type BlogPostWithRelations = BlogPost & {
  category: BlogCategory;
  tags: BlogTag[];
};

export interface BlogFilterOptions {
  categorySlug?: string;
  tagSlug?: string;
  search?: string;
  publishedOnly?: boolean;
  page?: number;
  limit?: number;
}

export class BlogRepository {
  async findAll(options: BlogFilterOptions = {}): Promise<{ posts: BlogPostWithRelations[]; total: number }> {
    const {
      categorySlug,
      tagSlug,
      search,
      publishedOnly = true,
      page = 1,
      limit = 10,
    } = options;

    const skip = (page - 1) * limit;

    const whereClause: any = {};

    if (publishedOnly) {
      whereClause.published = true;
      whereClause.archived = false;
      whereClause.status = "PUBLISHED";
      whereClause.visibility = "PUBLIC";
      whereClause.publishedAt = { lte: new Date() };
    }

    if (categorySlug) {
      whereClause.category = { slug: categorySlug };
    }

    if (tagSlug) {
      whereClause.tags = {
        some: { slug: tagSlug },
      };
    }

    if (search) {
      whereClause.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { summary: { contains: search, mode: 'insensitive' } },
        { content: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [posts, total] = await Promise.all([
      prisma.blogPost.findMany({
        where: whereClause,
        include: {
          category: true,
          tags: true,
        },
        orderBy: { publishedAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.blogPost.count({ where: whereClause }),
    ]);

    return { posts, total };
  }

  async findBySlug(slug: string): Promise<BlogPostWithRelations | null> {
    return prisma.blogPost.findUnique({
      where: { slug },
      include: {
        category: true,
        tags: true,
      },
    });
  }

  async findById(id: string): Promise<BlogPostWithRelations | null> {
    return prisma.blogPost.findUnique({
      where: { id },
      include: {
        category: true,
        tags: true,
      },
    });
  }

  async create(
    data: Omit<BlogPost, 'id' | 'createdAt' | 'updatedAt' | 'publishedAt'> & { publishedAt?: Date | null },
    tagIds: string[] = []
  ): Promise<BlogPostWithRelations> {
    const publishedAt = data.status === "PUBLISHED" 
      ? (data.publishedAt || new Date()) 
      : (data.status === "SCHEDULED" ? data.publishedAt : null);

    return prisma.blogPost.create({
      data: {
        ...data,
        publishedAt,
        tags: {
          connect: tagIds.map((id) => ({ id })),
        },
      },
      include: {
        category: true,
        tags: true,
      },
    });
  }

  async update(
    id: string,
    data: Partial<Omit<BlogPost, 'id' | 'createdAt' | 'updatedAt' | 'publishedAt'>> & { publishedAt?: Date | null },
    tagIds?: string[]
  ): Promise<BlogPostWithRelations> {
    const updateData: any = { ...data };

    if (data.status !== undefined) {
      if (data.status === "PUBLISHED") {
        updateData.publishedAt = data.publishedAt || new Date();
      } else if (data.status === "SCHEDULED") {
        updateData.publishedAt = data.publishedAt;
      } else {
        updateData.publishedAt = null;
      }
    }

    if (tagIds) {
      updateData.tags = {
        set: tagIds.map((id) => ({ id })),
      };
    }

    return prisma.blogPost.update({
      where: { id },
      data: updateData,
      include: {
        category: true,
        tags: true,
      },
    });
  }

  async delete(id: string): Promise<BlogPost> {
    return prisma.blogPost.delete({
      where: { id },
    });
  }

  // Categories
  async findAllCategories(): Promise<BlogCategory[]> {
    return prisma.blogCategory.findMany({
      orderBy: { name: 'asc' },
    });
  }

  async findCategoryById(id: string): Promise<BlogCategory | null> {
    return prisma.blogCategory.findUnique({ where: { id } });
  }

  async createCategory(name: string, slug: string): Promise<BlogCategory> {
    return prisma.blogCategory.create({
      data: { name, slug },
    });
  }

  // Tags
  async findAllTags(): Promise<BlogTag[]> {
    return prisma.blogTag.findMany({
      orderBy: { name: 'asc' },
    });
  }

  async findTagById(id: string): Promise<BlogTag | null> {
    return prisma.blogTag.findUnique({ where: { id } });
  }

  async createTag(name: string, slug: string): Promise<BlogTag> {
    return prisma.blogTag.create({
      data: { name, slug },
    });
  }
}
