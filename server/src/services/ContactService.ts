import { IContact, Contact } from '../models/Contact';
import { BaseService } from './BaseService';
import EmailService from './EmailService';
import { Request } from 'express';

interface CreateContactData {
  name: string;
  email: string;
  subject: string;
  message: string;
  source?: 'website' | 'api' | 'whatsapp' | 'email';
  ipAddress?: string;
  userAgent?: string;
}

interface ContactFilters {
  status?: string;
  priority?: string;
  source?: string;
  assignedTo?: string;
  dateFrom?: Date;
  dateTo?: Date;
  search?: string;
}

interface ContactStats {
  total: number;
  new: number;
  read: number;
  replied: number;
  closed: number;
  byPriority: {
    low: number;
    medium: number;
    high: number;
  };
  bySource: {
    website: number;
    api: number;
    whatsapp: number;
    email: number;
  };
  avgResponseTime: number;
}

class ContactService extends BaseService {
  constructor() {
    super('ContactService');
  }

  async createContact(data: CreateContactData, req?: Request): Promise<IContact> {
    try {
      // Extract additional data from request if available
      const contactData = {
        ...data,
        ipAddress: req?.ip || req?.connection?.remoteAddress || data.ipAddress,
        userAgent: req?.get('User-Agent') || data.userAgent,
        source: data.source || 'website'
      };

      // Create contact record
      const contact = new Contact(contactData);
      await contact.save();

      this.logInfo(`New contact created: ${contact._id} from ${contact.email}`);

      // Send auto-responder email
      try {
        const autoResponderSent = await EmailService.sendAutoResponder({
          name: contact.name,
          email: contact.email,
          subject: contact.subject,
          message: contact.message,
          contactId: (contact._id as any).toString()
        });

        if (autoResponderSent) {
          contact.autoResponderSent = true;
          await contact.save();
          this.logInfo(`Auto-responder sent to ${contact.email}`);
        }
      } catch (emailError) {
        this.logError('Failed to send auto-responder', emailError);
        // Don't fail the contact creation if email fails
      }

      // Send admin notification
      try {
        await EmailService.sendAdminNotification({
          name: contact.name,
          email: contact.email,
          subject: contact.subject,
          message: contact.message,
          contactId: (contact._id as any).toString()
        });
        this.logInfo(`Admin notification sent for contact ${contact._id}`);
      } catch (emailError) {
        this.logError('Failed to send admin notification', emailError);
        // Don't fail the contact creation if email fails
      }

      return contact;
    } catch (error) {
      this.logError('Failed to create contact', error);
      throw error;
    }
  }

  async getContacts(
    page: number = 1,
    limit: number = 20,
    filters: ContactFilters = {}
  ): Promise<{ contacts: IContact[]; total: number; pages: number }> {
    try {
      const query: any = {};

      // Apply filters
      if (filters.status) query.status = filters.status;
      if (filters.priority) query.priority = filters.priority;
      if (filters.source) query.source = filters.source;
      if (filters.assignedTo) query.assignedTo = filters.assignedTo;
      if (filters.dateFrom || filters.dateTo) {
        query.createdAt = {};
        if (filters.dateFrom) query.createdAt.$gte = filters.dateFrom;
        if (filters.dateTo) query.createdAt.$lte = filters.dateTo;
      }
      if (filters.search) {
        query.$or = [
          { name: { $regex: filters.search, $options: 'i' } },
          { email: { $regex: filters.search, $options: 'i' } },
          { subject: { $regex: filters.search, $options: 'i' } },
          { message: { $regex: filters.search, $options: 'i' } }
        ];
      }

      const skip = (page - 1) * limit;
      const contacts = await Contact.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean();

      const total = await Contact.countDocuments(query);
      const pages = Math.ceil(total / limit);

      return { contacts: contacts as any, total, pages };
    } catch (error) {
      this.logError('Failed to get contacts', error);
      throw error;
    }
  }

  async getContactById(id: string): Promise<IContact | null> {
    try {
      const contact = await Contact.findById(id);
      return contact;
    } catch (error) {
      this.logError(`Failed to get contact ${id}`, error);
      throw error;
    }
  }

  async updateContact(
    id: string,
    updates: Partial<IContact>,
    adminId?: string
  ): Promise<IContact | null> {
    try {
      const contact = await Contact.findByIdAndUpdate(
        id,
        { ...updates, updatedAt: new Date() },
        { new: true, runValidators: true }
      );

      if (contact) {
        this.logInfo(`Contact ${id} updated by ${adminId || 'system'}`);
      }

      return contact;
    } catch (error) {
      this.logError(`Failed to update contact ${id}`, error);
      throw error;
    }
  }

  async deleteContact(id: string, adminId?: string): Promise<boolean> {
    try {
      const result = await Contact.findByIdAndDelete(id);
      if (result) {
        this.logInfo(`Contact ${id} deleted by ${adminId || 'system'}`);
        return true;
      }
      return false;
    } catch (error) {
      this.logError(`Failed to delete contact ${id}`, error);
      throw error;
    }
  }

  async markAsRead(id: string, adminId?: string): Promise<IContact | null> {
    try {
      const contact = await Contact.findByIdAndUpdate(
        id,
        { status: 'read', updatedAt: new Date() },
        { new: true }
      );

      if (contact) {
        this.logInfo(`Contact ${id} marked as read by ${adminId || 'system'}`);
      }

      return contact;
    } catch (error) {
      this.logError(`Failed to mark contact ${id} as read`, error);
      throw error;
    }
  }

  async markAsReplied(id: string, adminId?: string): Promise<IContact | null> {
    try {
      const contact = await Contact.findByIdAndUpdate(
        id,
        { status: 'replied', updatedAt: new Date() },
        { new: true }
      );

      if (contact) {
        this.logInfo(`Contact ${id} marked as replied by ${adminId || 'system'}`);
      }

      return contact;
    } catch (error) {
      this.logError(`Failed to mark contact ${id} as replied`, error);
      throw error;
    }
  }

  async assignContact(id: string, assignedTo: string, adminId?: string): Promise<IContact | null> {
    try {
      const contact = await Contact.findByIdAndUpdate(
        id,
        { assignedTo, updatedAt: new Date() },
        { new: true }
      );

      if (contact) {
        this.logInfo(`Contact ${id} assigned to ${assignedTo} by ${adminId || 'system'}`);
      }

      return contact;
    } catch (error) {
      this.logError(`Failed to assign contact ${id}`, error);
      throw error;
    }
  }

  async addTag(id: string, tag: string, adminId?: string): Promise<IContact | null> {
    try {
      const contact = await Contact.findByIdAndUpdate(
        id,
        { $addToSet: { tags: tag }, updatedAt: new Date() },
        { new: true }
      );

      if (contact) {
        this.logInfo(`Tag "${tag}" added to contact ${id} by ${adminId || 'system'}`);
      }

      return contact;
    } catch (error) {
      this.logError(`Failed to add tag to contact ${id}`, error);
      throw error;
    }
  }

  async removeTag(id: string, tag: string, adminId?: string): Promise<IContact | null> {
    try {
      const contact = await Contact.findByIdAndUpdate(
        id,
        { $pull: { tags: tag }, updatedAt: new Date() },
        { new: true }
      );

      if (contact) {
        this.logInfo(`Tag "${tag}" removed from contact ${id} by ${adminId || 'system'}`);
      }

      return contact;
    } catch (error) {
      this.logError(`Failed to remove tag from contact ${id}`, error);
      throw error;
    }
  }

  async getContactStats(dateFrom?: Date, dateTo?: Date): Promise<ContactStats> {
    try {
      const matchQuery: any = {};
      if (dateFrom || dateTo) {
        matchQuery.createdAt = {};
        if (dateFrom) matchQuery.createdAt.$gte = dateFrom;
        if (dateTo) matchQuery.createdAt.$lte = dateTo;
      }

      const pipeline = [
        { $match: matchQuery },
        {
          $group: {
            _id: null,
            total: { $sum: 1 },
            new: { $sum: { $cond: [{ $eq: ['$status', 'new'] }, 1, 0] } },
            read: { $sum: { $cond: [{ $eq: ['$status', 'read'] }, 1, 0] } },
            replied: { $sum: { $cond: [{ $eq: ['$status', 'replied'] }, 1, 0] } },
            closed: { $sum: { $cond: [{ $eq: ['$status', 'closed'] }, 1, 0] } },
            lowPriority: { $sum: { $cond: [{ $eq: ['$priority', 'low'] }, 1, 0] } },
            mediumPriority: { $sum: { $cond: [{ $eq: ['$priority', 'medium'] }, 1, 0] } },
            highPriority: { $sum: { $cond: [{ $eq: ['$priority', 'high'] }, 1, 0] } },
            websiteSource: { $sum: { $cond: [{ $eq: ['$source', 'website'] }, 1, 0] } },
            apiSource: { $sum: { $cond: [{ $eq: ['$source', 'api'] }, 1, 0] } },
            whatsappSource: { $sum: { $cond: [{ $eq: ['$source', 'whatsapp'] }, 1, 0] } },
            emailSource: { $sum: { $cond: [{ $eq: ['$source', 'email'] }, 1, 0] } }
          }
        }
      ];

      const result = await Contact.aggregate(pipeline);
      const stats = result[0] || {
        total: 0, new: 0, read: 0, replied: 0, closed: 0,
        lowPriority: 0, mediumPriority: 0, highPriority: 0,
        websiteSource: 0, apiSource: 0, whatsappSource: 0, emailSource: 0
      };

      // Calculate average response time for replied contacts
      const repliedContacts = await Contact.find({
        status: 'replied',
        ...matchQuery
      }).select('createdAt updatedAt');

      const avgResponseTime = repliedContacts.length > 0
        ? repliedContacts.reduce((sum, contact) => {
            return sum + (contact.updatedAt.getTime() - contact.createdAt.getTime());
          }, 0) / repliedContacts.length
        : 0;

      return {
        total: stats.total,
        new: stats.new,
        read: stats.read,
        replied: stats.replied,
        closed: stats.closed,
        byPriority: {
          low: stats.lowPriority,
          medium: stats.mediumPriority,
          high: stats.highPriority
        },
        bySource: {
          website: stats.websiteSource,
          api: stats.apiSource,
          whatsapp: stats.whatsappSource,
          email: stats.emailSource
        },
        avgResponseTime
      };
    } catch (error) {
      this.logError('Failed to get contact stats', error);
      throw error;
    }
  }

  async getRecentContacts(limit: number = 10): Promise<IContact[]> {
    try {
      const contacts = await Contact.find()
        .sort({ createdAt: -1 })
        .limit(limit)
        .select('name email subject status priority createdAt')
        .lean();

      return contacts as any;
    } catch (error) {
      this.logError('Failed to get recent contacts', error);
      throw error;
    }
  }

  async searchContacts(query: string, limit: number = 20): Promise<IContact[]> {
    try {
      const contacts = await Contact.find({
        $or: [
          { name: { $regex: query, $options: 'i' } },
          { email: { $regex: query, $options: 'i' } },
          { subject: { $regex: query, $options: 'i' } },
          { message: { $regex: query, $options: 'i' } }
        ]
      })
        .sort({ createdAt: -1 })
        .limit(limit)
        .lean();

      return contacts as any;
    } catch (error) {
      this.logError('Failed to search contacts', error);
      throw error;
    }
  }

  async bulkUpdateStatus(ids: string[], status: string, adminId?: string): Promise<number> {
    try {
      const result = await Contact.updateMany(
        { _id: { $in: ids } },
        { status, updatedAt: new Date() }
      );

      this.logInfo(`Bulk updated ${result.modifiedCount} contacts to status "${status}" by ${adminId || 'system'}`);
      return result.modifiedCount;
    } catch (error) {
      this.logError('Failed to bulk update contact status', error);
      throw error;
    }
  }
}

export default new ContactService();
