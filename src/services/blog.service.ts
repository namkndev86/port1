import { type BlogCategory, type BlogPost, type BlogTag } from '@prisma/client';

import { NotFoundError, ValidationError } from '@/lib/errors';
import { type BlogPostInput,blogPostSchema } from '@/lib/validation';
import { type BlogFilterOptions,type BlogPostWithRelations, BlogRepository } from '@/repositories/blog.repository';

export class BlogService {
  private blogRepo = new BlogRepository();

  async getPosts(options: BlogFilterOptions = {}): Promise<{ posts: BlogPostWithRelations[]; total: number }> {
    return this.blogRepo.findAll(options);
  }

  async getPostBySlug(slug: string): Promise<BlogPostWithRelations> {
    const post = await this.blogRepo.findBySlug(slug);
    if (!post) {
      throw new NotFoundError(`Blog post with slug "${slug}" not found`);
    }
    return post;
  }

  async getPostById(id: string): Promise<BlogPostWithRelations> {
    const post = await this.blogRepo.findById(id);
    if (!post) {
      throw new NotFoundError(`Blog post with ID "${id}" not found`);
    }
    return post;
  }

  async createPost(authorId: string, input: BlogPostInput): Promise<BlogPostWithRelations> {
    const result = blogPostSchema.safeParse(input);
    if (!result.success) {
      throw new ValidationError('Invalid blog post data', result.error.format());
    }

    const { tagIds, ...postData } = result.data;

    // Validate category existence
    const category = await this.blogRepo.findCategoryById(postData.categoryId);
    if (!category) {
      throw new ValidationError('Selected category does not exist');
    }

    // Verify slug uniqueness
    const existing = await this.blogRepo.findBySlug(postData.slug);
    if (existing) {
      throw new ValidationError('A blog post with this slug already exists');
    }

    return this.blogRepo.create(
      {
        ...postData,
        authorId,
        coverImage: postData.coverImage || null,
      } as any,
      tagIds
    );
  }

  async updatePost(id: string, input: BlogPostInput): Promise<BlogPostWithRelations> {
    const post = await this.blogRepo.findById(id);
    if (!post) {
      throw new NotFoundError(`Blog post with ID "${id}" not found`);
    }

    const result = blogPostSchema.safeParse(input);
    if (!result.success) {
      throw new ValidationError('Invalid blog post data', result.error.format());
    }

    const { tagIds, ...postData } = result.data;

    // Validate category existence
    const category = await this.blogRepo.findCategoryById(postData.categoryId);
    if (!category) {
      throw new ValidationError('Selected category does not exist');
    }

    // Verify slug uniqueness (excluding current)
    const existing = await this.blogRepo.findBySlug(postData.slug);
    if (existing && existing.id !== id) {
      throw new ValidationError('A blog post with this slug already exists');
    }

    return this.blogRepo.update(
      id,
      {
        ...postData,
        coverImage: postData.coverImage || null,
      } as any,
      tagIds
    );
  }

  async deletePost(id: string): Promise<BlogPost> {
    const post = await this.blogRepo.findById(id);
    if (!post) {
      throw new NotFoundError(`Blog post with ID "${id}" not found`);
    }
    return this.blogRepo.delete(id);
  }

  // Categories
  async getCategories(): Promise<BlogCategory[]> {
    return this.blogRepo.findAllCategories();
  }

  async createCategory(name: string): Promise<BlogCategory> {
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const categories = await this.blogRepo.findAllCategories();
    if (categories.some((c) => c.slug === slug)) {
      throw new ValidationError('A category with this name already exists');
    }
    return this.blogRepo.createCategory(name, slug);
  }

  // Tags
  async getTags(): Promise<BlogTag[]> {
    return this.blogRepo.findAllTags();
  }

  async createTag(name: string): Promise<BlogTag> {
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const tags = await this.blogRepo.findAllTags();
    if (tags.some((t) => t.slug === slug)) {
      throw new ValidationError('A tag with this name already exists');
    }
    return this.blogRepo.createTag(name, slug);
  }
}
