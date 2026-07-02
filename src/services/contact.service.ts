import { type ContactMessage } from '@prisma/client';

import { NotFoundError, ValidationError } from '@/lib/errors';
import { type ContactMessageInput,contactMessageSchema } from '@/lib/validation';
import { ContactRepository } from '@/repositories/contact.repository';

export class ContactService {
  private contactRepo = new ContactRepository();

  async getMessages(): Promise<ContactMessage[]> {
    return this.contactRepo.findAll();
  }

  async submitMessage(input: ContactMessageInput): Promise<ContactMessage> {
    const result = contactMessageSchema.safeParse(input);
    if (!result.success) {
      throw new ValidationError('Invalid message data', result.error.format());
    }

    const message = await this.contactRepo.create(result.data);

    // Optional: Add email notifications hook here (e.g. using Resend or NodeMailer)
    // console.log(`[Email Notification] New message from ${message.name}: ${message.subject}`);

    return message;
  }

  async markAsRead(id: string, read: boolean = true): Promise<ContactMessage> {
    const message = await this.contactRepo.findById(id);
    if (!message) {
      throw new NotFoundError(`Message with ID "${id}" not found`);
    }
    return this.contactRepo.updateReadStatus(id, read);
  }

  async deleteMessage(id: string): Promise<ContactMessage> {
    const message = await this.contactRepo.findById(id);
    if (!message) {
      throw new NotFoundError(`Message with ID "${id}" not found`);
    }
    return this.contactRepo.delete(id);
  }
}
