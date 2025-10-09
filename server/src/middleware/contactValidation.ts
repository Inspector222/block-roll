import { body, param, query } from 'express-validator';

// Contact form validation
export const validateContactForm = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters')
    .matches(/^[a-zA-Z\s\-'\.]+$/)
    .withMessage('Name can only contain letters, spaces, hyphens, apostrophes, and periods'),

  body('email')
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail()
    .isLength({ max: 254 })
    .withMessage('Email address is too long'),

  body('subject')
    .trim()
    .isLength({ min: 5, max: 200 })
    .withMessage('Subject must be between 5 and 200 characters')
    .matches(/^[a-zA-Z0-9\s\-_.,!?()]+$/)
    .withMessage('Subject contains invalid characters'),

  body('message')
    .trim()
    .isLength({ min: 10, max: 2000 })
    .withMessage('Message must be between 10 and 2000 characters')
    .custom((value) => {
      // Check for spam patterns
      const spamPatterns = [
        /(?:https?:\/\/[^\s]+)/gi, // URLs
        /(?:www\.[^\s]+)/gi, // www links
        /(?:[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/gi, // Multiple emails
        /(?:free|win|prize|congratulations|urgent|act now|limited time)/gi, // Spam keywords
        /(?:bitcoin|crypto|investment|profit|guaranteed)/gi, // Crypto spam
        /(?:viagra|pharmacy|pills|medication)/gi, // Medical spam
      ];

      const spamCount = spamPatterns.reduce((count, pattern) => {
        return count + (pattern.test(value) ? 1 : 0);
      }, 0);

      if (spamCount >= 2) {
        throw new Error('Message appears to be spam');
      }

      return true;
    }),

  body('source')
    .optional()
    .isIn(['website', 'api', 'whatsapp', 'email'])
    .withMessage('Invalid source value')
];

// Admin contact validation
export const validateContactId = [
  param('id')
    .isMongoId()
    .withMessage('Invalid contact ID format')
];

export const validateContactUpdate = [
  param('id')
    .isMongoId()
    .withMessage('Invalid contact ID format'),

  body('status')
    .optional()
    .isIn(['new', 'read', 'replied', 'closed'])
    .withMessage('Invalid status value'),

  body('priority')
    .optional()
    .isIn(['low', 'medium', 'high'])
    .withMessage('Invalid priority value'),

  body('assignedTo')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Assigned to field is too long'),

  body('adminNotes')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Admin notes cannot exceed 1000 characters'),

  body('tags')
    .optional()
    .isArray()
    .withMessage('Tags must be an array')
    .custom((tags) => {
      if (tags && tags.length > 10) {
        throw new Error('Maximum 10 tags allowed');
      }
      if (tags) {
        for (const tag of tags) {
          if (typeof tag !== 'string' || tag.length > 50) {
            throw new Error('Each tag must be a string with maximum 50 characters');
          }
        }
      }
      return true;
    })
];

export const validateContactFilters = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),

  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),

  query('status')
    .optional()
    .isIn(['new', 'read', 'replied', 'closed'])
    .withMessage('Invalid status filter'),

  query('priority')
    .optional()
    .isIn(['low', 'medium', 'high'])
    .withMessage('Invalid priority filter'),

  query('source')
    .optional()
    .isIn(['website', 'api', 'whatsapp', 'email'])
    .withMessage('Invalid source filter'),

  query('dateFrom')
    .optional()
    .isISO8601()
    .withMessage('Invalid dateFrom format (use ISO 8601)'),

  query('dateTo')
    .optional()
    .isISO8601()
    .withMessage('Invalid dateTo format (use ISO 8601)')
    .custom((value, { req }) => {
      if (value && req.body?.dateFrom) {
        const dateFrom = new Date(req.body.dateFrom);
        const dateTo = new Date(value);
        if (dateTo <= dateFrom) {
          throw new Error('dateTo must be after dateFrom');
        }
      }
      return true;
    }),

  query('search')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Search query must be between 2 and 100 characters')
    .matches(/^[a-zA-Z0-9\s\-_.,!?@]+$/)
    .withMessage('Search query contains invalid characters')
];

export const validateTagOperation = [
  param('id')
    .isMongoId()
    .withMessage('Invalid contact ID format'),

  body('tag')
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage('Tag must be between 1 and 50 characters')
    .matches(/^[a-zA-Z0-9\s\-_]+$/)
    .withMessage('Tag can only contain letters, numbers, spaces, hyphens, and underscores')
];

export const validateTagParam = [
  param('id')
    .isMongoId()
    .withMessage('Invalid contact ID format'),

  param('tag')
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage('Tag must be between 1 and 50 characters')
    .matches(/^[a-zA-Z0-9\s\-_]+$/)
    .withMessage('Tag can only contain letters, numbers, spaces, hyphens, and underscores')
];

export const validateBulkUpdate = [
  body('ids')
    .isArray({ min: 1, max: 100 })
    .withMessage('ids must be an array with 1-100 items')
    .custom((ids) => {
      for (const id of ids) {
        if (typeof id !== 'string' || !/^[0-9a-fA-F]{24}$/.test(id)) {
          throw new Error('All IDs must be valid MongoDB ObjectIds');
        }
      }
      return true;
    }),

  body('status')
    .isIn(['new', 'read', 'replied', 'closed'])
    .withMessage('Invalid status value')
];

export const validateEmailTest = [
  body('email')
    .isEmail()
    .withMessage('Please provide a valid email address for testing')
    .normalizeEmail()
];

export const validateSearchQuery = [
  query('q')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Search query must be between 2 and 100 characters')
    .matches(/^[a-zA-Z0-9\s\-_.,!?@]+$/)
    .withMessage('Search query contains invalid characters'),

  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100')
];

export const validateStatsQuery = [
  query('dateFrom')
    .optional()
    .isISO8601()
    .withMessage('Invalid dateFrom format (use ISO 8601)'),

  query('dateTo')
    .optional()
    .isISO8601()
    .withMessage('Invalid dateTo format (use ISO 8601)')
    .custom((value, { req }) => {
      if (value && req.query?.dateFrom) {
        const dateFrom = new Date(req.query.dateFrom as string);
        const dateTo = new Date(value);
        if (dateTo <= dateFrom) {
          throw new Error('dateTo must be after dateFrom');
        }
      }
      return true;
    })
];

export const validateRecentContactsQuery = [
  query('limit')
    .optional()
    .isInt({ min: 1, max: 50 })
    .withMessage('Limit must be between 1 and 50')
];
