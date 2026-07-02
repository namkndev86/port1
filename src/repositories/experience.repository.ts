import { type Experience } from '@prisma/client';

import prisma from '@/lib/db';

export class ExperienceRepository {
  async findAll(): Promise<Experience[]> {
    return prisma.experience.findMany({
      orderBy: { startDate: 'desc' },
    });
  }

  async findById(id: string): Promise<Experience | null> {
    return prisma.experience.findUnique({
      where: { id },
    });
  }

  async create(data: Omit<Experience, 'id' | 'createdAt' | 'updatedAt'>): Promise<Experience> {
    return prisma.experience.create({
      data,
    });
  }

  async update(id: string, data: Partial<Omit<Experience, 'id' | 'createdAt' | 'updatedAt'>>): Promise<Experience> {
    return prisma.experience.update({
      where: { id },
      data,
    });
  }

  async delete(id: string): Promise<Experience> {
    return prisma.experience.delete({
      where: { id },
    });
  }
}
