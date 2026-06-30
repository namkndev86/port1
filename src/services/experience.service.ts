import { ExperienceRepository } from '@/repositories/experience.repository';
import { experienceSchema, ExperienceInput } from '@/lib/validation';
import { NotFoundError, ValidationError } from '@/lib/errors';
import { Experience } from '@prisma/client';

export class ExperienceService {
  private expRepo = new ExperienceRepository();

  async getExperiences(): Promise<Experience[]> {
    return this.expRepo.findAll();
  }

  async createExperience(input: ExperienceInput): Promise<Experience> {
    const result = experienceSchema.safeParse(input);
    if (!result.success) {
      throw new ValidationError('Invalid experience data', result.error.format());
    }

    const data = result.data;
    if (!data.current && !data.endDate) {
      throw new ValidationError('End date is required if this is not your current job');
    }

    if (data.endDate && data.startDate > data.endDate) {
      throw new ValidationError('Start date cannot be after end date');
    }

    return this.expRepo.create({
      ...data,
      location: data.location || null,
      endDate: data.current ? null : (data.endDate || null),
    });
  }

  async updateExperience(id: string, input: ExperienceInput): Promise<Experience> {
    const exp = await this.expRepo.findById(id);
    if (!exp) {
      throw new NotFoundError(`Experience record with ID "${id}" not found`);
    }

    const result = experienceSchema.safeParse(input);
    if (!result.success) {
      throw new ValidationError('Invalid experience data', result.error.format());
    }

    const data = result.data;
    if (!data.current && !data.endDate) {
      throw new ValidationError('End date is required if this is not your current job');
    }

    if (data.endDate && data.startDate > data.endDate) {
      throw new ValidationError('Start date cannot be after end date');
    }

    return this.expRepo.update(id, {
      ...data,
      location: data.location || null,
      endDate: data.current ? null : (data.endDate || null),
    });
  }

  async deleteExperience(id: string): Promise<Experience> {
    const exp = await this.expRepo.findById(id);
    if (!exp) {
      throw new NotFoundError(`Experience record with ID "${id}" not found`);
    }
    return this.expRepo.delete(id);
  }
}
