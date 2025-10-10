import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import ContactService from '../services/ContactService';
import { BaseController } from './BaseController';

class ContactController extends BaseController {
  constructor() {
    super('ContactController');
  }

  /**
   * Create a new contact form submission
   * POST /api/contact
   */
  async createContact(req: Request, res: Response): Promise<void> {
    try {
      // Check validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        this.sendErrorResponse(res, 'Validation failed', 400, errors.array());
        return;
      }

      const { name, email, subject, message, source } = req.body;

      // Check for spam/duplicate submissions (same email + subject within 5 minutes)
      const recentSubmission = await ContactService.getContacts(1, 1, {
        search: email,
        dateFrom: new Date(Date.now() - 5 * 60 * 1000) // 5 minutes ago
      });

      if (recentSubmission.contacts.length > 0) {
        const recent = recentSubmission.contacts[0];
        if (recent.subject === subject) {
          this.sendErrorResponse(res, 'Duplicate submission detected. Please wait before submitting again.', 429);
          return;
        }
      }

      const contact = await ContactService.createContact({
        name,
        email,
        subject,
        message,
        source: source || 'website'
      }, req);

      this.sendSuccessResponse(res, {
        message: 'Thank you for your message! We\'ll get back to you within 24 hours.',
        contactId: contact._id,
        autoResponderSent: contact.autoResponderSent
      }, 'Contact form submitted successfully', 201);

    } catch (error) {
      this.logError('Failed to create contact', error);
      this.sendErrorResponse(res, 'Failed to submit contact form. Please try again.', 500);
    }
  }

  /**
   * Get all contacts (Admin only)
   * GET /api/contact/admin
   */
  async getContacts(req: Request, res: Response): Promise<void> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 20;
      
      const filters = {
        status: req.query.status as string,
        priority: req.query.priority as string,
        source: req.query.source as string,
        assignedTo: req.query.assignedTo as string,
        search: req.query.search as string,
        dateFrom: req.query.dateFrom ? new Date(req.query.dateFrom as string) : undefined,
        dateTo: req.query.dateTo ? new Date(req.query.dateTo as string) : undefined
      };

      const result = await ContactService.getContacts(page, limit, filters);

      this.sendSuccessResponse(res, {
        contacts: result.contacts,
        pagination: {
          page,
          limit,
          total: result.total,
          pages: result.pages
        }
      });

    } catch (error) {
      this.logError('Failed to get contacts', error);
      this.sendErrorResponse(res, 'Failed to retrieve contacts', 500);
    }
  }

  /**
   * Get contact by ID (Admin only)
   * GET /api/contact/admin/:id
   */
  async getContactById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const contact = await ContactService.getContactById(id);

      if (!contact) {
        this.sendErrorResponse(res, 'Contact not found', 404);
        return;
      }

      this.sendSuccessResponse(res, { contact });

    } catch (error) {
      this.logError(`Failed to get contact ${req.params.id}`, error);
      this.sendErrorResponse(res, 'Failed to retrieve contact', 500);
    }
  }

  /**
   * Update contact (Admin only)
   * PUT /api/contact/admin/:id
   */
  async updateContact(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const updates = req.body;
      const adminId = req.user?.id; // Assuming you have user authentication

      const contact = await ContactService.updateContact(id, updates, adminId);

      if (!contact) {
        this.sendErrorResponse(res, 'Contact not found', 404);
        return;
      }

      this.sendSuccessResponse(res, { contact });

    } catch (error) {
      this.logError(`Failed to update contact ${req.params.id}`, error);
      this.sendErrorResponse(res, 'Failed to update contact', 500);
    }
  }

  /**
   * Delete contact (Admin only)
   * DELETE /api/contact/admin/:id
   */
  async deleteContact(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const adminId = req.user?.id;

      const deleted = await ContactService.deleteContact(id, adminId);

      if (!deleted) {
        this.sendErrorResponse(res, 'Contact not found', 404);
        return;
      }

      this.sendSuccessResponse(res, { message: 'Contact deleted successfully' });

    } catch (error) {
      this.logError(`Failed to delete contact ${req.params.id}`, error);
      this.sendErrorResponse(res, 'Failed to delete contact', 500);
    }
  }

  /**
   * Mark contact as read (Admin only)
   * PATCH /api/contact/admin/:id/read
   */
  async markAsRead(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const adminId = req.user?.id;

      const contact = await ContactService.markAsRead(id, adminId);

      if (!contact) {
        this.sendErrorResponse(res, 'Contact not found', 404);
        return;
      }

      this.sendSuccessResponse(res, { contact });

    } catch (error) {
      this.logError(`Failed to mark contact ${req.params.id} as read`, error);
      this.sendErrorResponse(res, 'Failed to mark contact as read', 500);
    }
  }

  /**
   * Mark contact as replied (Admin only)
   * PATCH /api/contact/admin/:id/replied
   */
  async markAsReplied(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const adminId = req.user?.id;

      const contact = await ContactService.markAsReplied(id, adminId);

      if (!contact) {
        this.sendErrorResponse(res, 'Contact not found', 404);
        return;
      }

      this.sendSuccessResponse(res, { contact });

    } catch (error) {
      this.logError(`Failed to mark contact ${req.params.id} as replied`, error);
      this.sendErrorResponse(res, 'Failed to mark contact as replied', 500);
    }
  }

  /**
   * Assign contact to admin (Admin only)
   * PATCH /api/contact/admin/:id/assign
   */
  async assignContact(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { assignedTo } = req.body;
      const adminId = req.user?.id;

      if (!assignedTo) {
        this.sendErrorResponse(res, 'assignedTo is required', 400);
        return;
      }

      const contact = await ContactService.assignContact(id, assignedTo, adminId);

      if (!contact) {
        this.sendErrorResponse(res, 'Contact not found', 404);
        return;
      }

      this.sendSuccessResponse(res, { contact });

    } catch (error) {
      this.logError(`Failed to assign contact ${req.params.id}`, error);
      this.sendErrorResponse(res, 'Failed to assign contact', 500);
    }
  }

  /**
   * Add tag to contact (Admin only)
   * POST /api/contact/admin/:id/tags
   */
  async addTag(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { tag } = req.body;
      const adminId = req.user?.id;

      if (!tag) {
        this.sendErrorResponse(res, 'tag is required', 400);
        return;
      }

      const contact = await ContactService.addTag(id, tag, adminId);

      if (!contact) {
        this.sendErrorResponse(res, 'Contact not found', 404);
        return;
      }

      this.sendSuccessResponse(res, { contact });

    } catch (error) {
      this.logError(`Failed to add tag to contact ${req.params.id}`, error);
      this.sendErrorResponse(res, 'Failed to add tag', 500);
    }
  }

  /**
   * Remove tag from contact (Admin only)
   * DELETE /api/contact/admin/:id/tags/:tag
   */
  async removeTag(req: Request, res: Response): Promise<void> {
    try {
      const { id, tag } = req.params;
      const adminId = req.user?.id;

      const contact = await ContactService.removeTag(id, tag, adminId);

      if (!contact) {
        this.sendErrorResponse(res, 'Contact not found', 404);
        return;
      }

      this.sendSuccessResponse(res, { contact });

    } catch (error) {
      this.logError(`Failed to remove tag from contact ${req.params.id}`, error);
      this.sendErrorResponse(res, 'Failed to remove tag', 500);
    }
  }

  /**
   * Get contact statistics (Admin only)
   * GET /api/contact/admin/stats
   */
  async getContactStats(req: Request, res: Response): Promise<void> {
    try {
      const dateFrom = req.query.dateFrom ? new Date(req.query.dateFrom as string) : undefined;
      const dateTo = req.query.dateTo ? new Date(req.query.dateTo as string) : undefined;

      const stats = await ContactService.getContactStats(dateFrom, dateTo);

      this.sendSuccessResponse(res, { stats });

    } catch (error) {
      this.logError('Failed to get contact stats', error);
      this.sendErrorResponse(res, 'Failed to retrieve contact statistics', 500);
    }
  }

  /**
   * Get recent contacts (Admin only)
   * GET /api/contact/admin/recent
   */
  async getRecentContacts(req: Request, res: Response): Promise<void> {
    try {
      const limit = parseInt(req.query.limit as string) || 10;
      const contacts = await ContactService.getRecentContacts(limit);

      this.sendSuccessResponse(res, { contacts });

    } catch (error) {
      this.logError('Failed to get recent contacts', error);
      this.sendErrorResponse(res, 'Failed to retrieve recent contacts', 500);
    }
  }

  /**
   * Search contacts (Admin only)
   * GET /api/contact/admin/search
   */
  async searchContacts(req: Request, res: Response): Promise<void> {
    try {
      const { q } = req.query;
      const limit = parseInt(req.query.limit as string) || 20;

      if (!q) {
        this.sendErrorResponse(res, 'Search query is required', 400);
        return;
      }

      const contacts = await ContactService.searchContacts(q as string, limit);

      this.sendSuccessResponse(res, { contacts });

    } catch (error) {
      this.logError('Failed to search contacts', error);
      this.sendErrorResponse(res, 'Failed to search contacts', 500);
    }
  }

  /**
   * Bulk update contact status (Admin only)
   * PATCH /api/contact/admin/bulk/status
   */
  async bulkUpdateStatus(req: Request, res: Response): Promise<void> {
    try {
      const { ids, status } = req.body;
      const adminId = req.user?.id;

      if (!ids || !Array.isArray(ids) || ids.length === 0) {
        this.sendErrorResponse(res, 'ids array is required', 400);
        return;
      }

      if (!status) {
        this.sendErrorResponse(res, 'status is required', 400);
        return;
      }

      const validStatuses = ['new', 'read', 'replied', 'closed'];
      if (!validStatuses.includes(status)) {
        this.sendErrorResponse(res, 'Invalid status', 400);
        return;
      }

      const updatedCount = await ContactService.bulkUpdateStatus(ids, status, adminId);

      this.sendSuccessResponse(res, { 
        message: `${updatedCount} contacts updated successfully`,
        updatedCount 
      });

    } catch (error) {
      this.logError('Failed to bulk update contact status', error);
      this.sendErrorResponse(res, 'Failed to bulk update contact status', 500);
    }
  }

  /**
   * Test email service (Admin only)
   * POST /api/contact/admin/test-email
   */
  async testEmailService(req: Request, res: Response): Promise<void> {
    try {
      const { email } = req.body;

      if (!email) {
        this.sendErrorResponse(res, 'Email is required for testing', 400);
        return;
      }

      // Import EmailService here to avoid circular dependency
      const EmailService = (await import('../services/EmailService')).default;
      
      const testResult = await EmailService.testConnection();

      if (testResult) {
        this.sendSuccessResponse(res, { 
          message: 'Email service is working correctly',
          testEmail: email 
        });
      } else {
        this.sendErrorResponse(res, 'Email service test failed', 500);
      }

    } catch (error) {
      this.logError('Failed to test email service', error);
      this.sendErrorResponse(res, 'Failed to test email service', 500);
    }
  }
}

export default new ContactController();
