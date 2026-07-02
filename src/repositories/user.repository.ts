import { type Profile,type User } from '@prisma/client';

import prisma from '@/lib/db';

export class UserRepository {
  async findByEmail(email: string): Promise<User | null> {
    return prisma.user.findUnique({
      where: { email },
    });
  }

  async findById(id: string): Promise<(User & { profile: Profile | null }) | null> {
    return prisma.user.findUnique({
      where: { id },
      include: { profile: true },
    });
  }

  async create(data: Pick<User, 'email' | 'password' | 'role'>): Promise<User> {
    return prisma.user.create({
      data,
    });
  }

  async getProfileByUserId(userId: string): Promise<Profile | null> {
    return prisma.profile.findUnique({
      where: { userId },
    });
  }

  async upsertProfile(userId: string, data: Omit<Profile, 'id' | 'userId' | 'createdAt' | 'updatedAt'>): Promise<Profile> {
    return prisma.profile.upsert({
      where: { userId },
      update: data,
      create: {
        ...data,
        userId,
      },
    });
  }
}
