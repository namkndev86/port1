import prisma from '@/lib/db';
import { ContactMessage } from '@prisma/client';

export class ContactRepository {
  async create(data: Omit<ContactMessage, 'id' | 'read' | 'createdAt'>): Promise<ContactMessage> {
    return prisma.contactMessage.create({
      data,
    });
  }

  async findAll(): Promise<ContactMessage[]> {
    return prisma.contactMessage.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async findById(id: string): Promise<ContactMessage | null> {
    return prisma.contactMessage.findUnique({
      where: { id },
    });
  }

  async updateReadStatus(id: string, read: boolean): Promise<ContactMessage> {
    return prisma.contactMessage.update({
      where: { id },
      data: { read },
    });
  }

  async delete(id: string): Promise<ContactMessage> {
    return prisma.contactMessage.delete({
      where: { id },
    });
  }
}
