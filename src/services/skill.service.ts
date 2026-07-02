import { type Skill } from '@prisma/client';

import { NotFoundError, ValidationError } from '@/lib/errors';
import { type SkillInput,skillSchema } from '@/lib/validation';
import { SkillRepository } from '@/repositories/skill.repository';

export class SkillService {
  private skillRepo = new SkillRepository();

  async getSkills(options?: { activeOnly?: boolean }): Promise<Skill[]> {
    return this.skillRepo.findAll(options);
  }

  async createSkill(input: SkillInput): Promise<Skill> {
    const result = skillSchema.safeParse(input);
    if (!result.success) {
      throw new ValidationError('Invalid skill data', result.error.format());
    }

    const data = result.data;
    return this.skillRepo.create({
      ...data,
      icon: data.icon || null,
    });
  }

  async updateSkill(id: string, input: SkillInput): Promise<Skill> {
    const skill = await this.skillRepo.findById(id);
    if (!skill) {
      throw new NotFoundError(`Skill with ID "${id}" not found`);
    }

    const result = skillSchema.safeParse(input);
    if (!result.success) {
      throw new ValidationError('Invalid skill data', result.error.format());
    }

    const data = result.data;
    return this.skillRepo.update(id, {
      ...data,
      icon: data.icon || null,
    });
  }

  async deleteSkill(id: string): Promise<Skill> {
    const skill = await this.skillRepo.findById(id);
    if (!skill) {
      throw new NotFoundError(`Skill with ID "${id}" not found`);
    }
    return this.skillRepo.delete(id);
  }
}
