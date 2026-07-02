import prisma from '@/lib/db';
import { Skill } from '@prisma/client';

export class SkillRepository {
  async findAll(options?: { activeOnly?: boolean }): Promise<Skill[]> {
    const whereClause: any = {};
    if (options?.activeOnly) {
      whereClause.active = true;
    }
    return prisma.skill.findMany({
      where: whereClause,
      orderBy: [
        { category: 'asc' },
        { proficiency: 'desc' },
      ],
    });
  }

  async findById(id: string): Promise<Skill | null> {
    return prisma.skill.findUnique({
      where: { id },
    });
  }

  async create(data: Omit<Skill, 'id' | 'createdAt' | 'updatedAt'>): Promise<Skill> {
    return prisma.skill.create({
      data,
    });
  }

  async update(id: string, data: Partial<Omit<Skill, 'id' | 'createdAt' | 'updatedAt'>>): Promise<Skill> {
    return prisma.skill.update({
      where: { id },
      data,
    });
  }

  async delete(id: string): Promise<Skill> {
    return prisma.skill.delete({
      where: { id },
    });
  }
}
