import { Router } from 'express';
import ContactController from '../controllers/ContactController';
import {
  validateContactForm,
  validateContactId,
  validateContactUpdate,
  validateContactFilters,
  validateTagOperation,
  validateTagParam,
  validateBulkUpdate,
  validateEmailTest,
  validateSearchQuery,
  validateStatsQuery,
  validateRecentContactsQuery
} from '../middleware/contactValidation';
import { authenticate as authenticateToken, requireAdmin } from '../middleware/auth.middleware';
import rateLimit from 'express-rate-limit';

const router = Router();

// Rate limiting for contact form submissions
const contactFormLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 contact form submissions per windowMs
  message: {
    error: 'Too many contact form submissions from this IP, please try again later.',
    retryAfter: '15 minutes'
  },
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => {
    // Skip rate limiting for admin users
    return req.user && req.user.role === 'admin';
  }
});

// Rate limiting for admin operations
const adminLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 100, // Limit each IP to 100 admin requests per minute
  message: {
    error: 'Too many admin requests from this IP, please try again later.',
    retryAfter: '1 minute'
  },
  standardHeaders: true,
  legacyHeaders: false
});

// Public routes (no authentication required)

/**
 * @route   POST /api/contact
 * @desc    Submit contact form
 * @access  Public
 * @rate    Limited to 5 submissions per 15 minutes per IP
 */
router.post('/', 
  contactFormLimiter,
  validateContactForm,
  ContactController.createContact
);

// Admin routes (authentication and admin role required)

/**
 * @route   GET /api/contact/admin
 * @desc    Get all contacts with filtering and pagination
 * @access  Admin
 */
router.get('/admin',
  authenticateToken,
  requireAdmin,
  adminLimiter,
  validateContactFilters,
  ContactController.getContacts
);

/**
 * @route   GET /api/contact/admin/stats
 * @desc    Get contact statistics
 * @access  Admin
 */
router.get('/admin/stats',
  authenticateToken,
  requireAdmin,
  adminLimiter,
  validateStatsQuery,
  ContactController.getContactStats
);

/**
 * @route   GET /api/contact/admin/recent
 * @desc    Get recent contacts
 * @access  Admin
 */
router.get('/admin/recent',
  authenticateToken,
  requireAdmin,
  adminLimiter,
  validateRecentContactsQuery,
  ContactController.getRecentContacts
);

/**
 * @route   GET /api/contact/admin/search
 * @desc    Search contacts
 * @access  Admin
 */
router.get('/admin/search',
  authenticateToken,
  requireAdmin,
  adminLimiter,
  validateSearchQuery,
  ContactController.searchContacts
);

/**
 * @route   GET /api/contact/admin/:id
 * @desc    Get contact by ID
 * @access  Admin
 */
router.get('/admin/:id',
  authenticateToken,
  requireAdmin,
  adminLimiter,
  validateContactId,
  ContactController.getContactById
);

/**
 * @route   PUT /api/contact/admin/:id
 * @desc    Update contact
 * @access  Admin
 */
router.put('/admin/:id',
  authenticateToken,
  requireAdmin,
  adminLimiter,
  validateContactId,
  validateContactUpdate,
  ContactController.updateContact
);

/**
 * @route   DELETE /api/contact/admin/:id
 * @desc    Delete contact
 * @access  Admin
 */
router.delete('/admin/:id',
  authenticateToken,
  requireAdmin,
  adminLimiter,
  validateContactId,
  ContactController.deleteContact
);

/**
 * @route   PATCH /api/contact/admin/:id/read
 * @desc    Mark contact as read
 * @access  Admin
 */
router.patch('/admin/:id/read',
  authenticateToken,
  requireAdmin,
  adminLimiter,
  validateContactId,
  ContactController.markAsRead
);

/**
 * @route   PATCH /api/contact/admin/:id/replied
 * @desc    Mark contact as replied
 * @access  Admin
 */
router.patch('/admin/:id/replied',
  authenticateToken,
  requireAdmin,
  adminLimiter,
  validateContactId,
  ContactController.markAsReplied
);

/**
 * @route   PATCH /api/contact/admin/:id/assign
 * @desc    Assign contact to admin
 * @access  Admin
 */
router.patch('/admin/:id/assign',
  authenticateToken,
  requireAdmin,
  adminLimiter,
  validateContactId,
  ContactController.assignContact
);

/**
 * @route   POST /api/contact/admin/:id/tags
 * @desc    Add tag to contact
 * @access  Admin
 */
router.post('/admin/:id/tags',
  authenticateToken,
  requireAdmin,
  adminLimiter,
  validateContactId,
  validateTagOperation,
  ContactController.addTag
);

/**
 * @route   DELETE /api/contact/admin/:id/tags/:tag
 * @desc    Remove tag from contact
 * @access  Admin
 */
router.delete('/admin/:id/tags/:tag',
  authenticateToken,
  requireAdmin,
  adminLimiter,
  validateTagParam,
  ContactController.removeTag
);

/**
 * @route   PATCH /api/contact/admin/bulk/status
 * @desc    Bulk update contact status
 * @access  Admin
 */
router.patch('/admin/bulk/status',
  authenticateToken,
  requireAdmin,
  adminLimiter,
  validateBulkUpdate,
  ContactController.bulkUpdateStatus
);

/**
 * @route   POST /api/contact/admin/test-email
 * @desc    Test email service
 * @access  Admin
 */
router.post('/admin/test-email',
  authenticateToken,
  requireAdmin,
  adminLimiter,
  validateEmailTest,
  ContactController.testEmailService
);

export default router;
