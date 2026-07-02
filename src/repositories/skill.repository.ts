import prisma from '@/lib/db';
import { Skill } from '@prisma/client';

export class SkillRepository {
  async findAll(): Promise<Skill[]> {
    return prisma.skill.findMany({
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
