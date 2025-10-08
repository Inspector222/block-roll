import { Request, Response, NextFunction } from 'express';
import { validationResult, ValidationChain } from 'express-validator';
import { ValidationError } from '../utils/errors';

/**
 * Validate request using express-validator
 */
export const validate = (validations: ValidationChain[]) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    // Execute all validations
    for (const validation of validations) {
      await validation.run(req);
    }

    // Check for errors
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const formattedErrors = errors.array().map((error: any) => ({
        field: error.param || error.path,
        message: error.msg,
        value: error.value,
      }));

      throw new ValidationError('Validation failed', 'VALIDATION_ERROR');
    }

    next();
  };
};

/**
 * Validate file upload
 */
export const validateFileUpload = (options: {
  maxSize?: number;
  allowedMimeTypes?: string[];
  required?: boolean;
}) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const file = req.file;

    // Check if file is required
    if (options.required && !file) {
      throw new ValidationError('File is required');
    }

    if (!file) {
      return next();
    }

    // Validate file size
    if (options.maxSize && file.size > options.maxSize) {
      throw new ValidationError(
        `File size exceeds maximum limit of ${options.maxSize / 1024 / 1024}MB`
      );
    }

    // Validate MIME type
    if (options.allowedMimeTypes && !options.allowedMimeTypes.includes(file.mimetype)) {
      throw new ValidationError(
        `File type ${file.mimetype} is not allowed. Allowed types: ${options.allowedMimeTypes.join(', ')}`
      );
    }

    next();
  };
};

/**
 * Sanitize request body
 */
export const sanitizeBody = (allowedFields: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const sanitizedBody: any = {};

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        sanitizedBody[field] = req.body[field];
      }
    });

    req.body = sanitizedBody;
    next();
  };
};
