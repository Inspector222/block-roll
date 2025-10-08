import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/errors';
import { logger } from '../config/logger';
import config from '../config';

/**
 * Global error handler
 */
export const errorHandler = (
  error: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction
): Response => {
  let statusCode = 500;
  let message = 'Internal Server Error';
  let code = 'SERVER_ERROR';
  let details: any = undefined;

  // Handle operational errors
  if (error instanceof AppError) {
    statusCode = error.statusCode;
    message = error.message;
    code = error.code || 'ERROR';

    // Log operational errors at appropriate level
    if (statusCode >= 500) {
      logger.error('Operational Error:', {
        code,
        message,
        stack: error.stack,
        url: req.url,
        method: req.method,
      });
    } else {
      logger.warn('Client Error:', {
        code,
        message,
        url: req.url,
        method: req.method,
      });
    }
  }
  // Handle Mongoose validation errors
  else if (error.name === 'ValidationError') {
    statusCode = 400;
    message = 'Validation Error';
    code = 'VALIDATION_ERROR';
    details = (error as any).errors;

    logger.warn('Validation Error:', { details, url: req.url });
  }
  // Handle Mongoose CastError
  else if (error.name === 'CastError') {
    statusCode = 400;
    message = 'Invalid ID format';
    code = 'INVALID_ID';

    logger.warn('Cast Error:', { message, url: req.url });
  }
  // Handle MongoDB duplicate key error
  else if ((error as any).code === 11000) {
    statusCode = 409;
    message = 'Duplicate key error';
    code = 'DUPLICATE_KEY';
    const field = Object.keys((error as any).keyValue || {})[0];
    details = { field };

    logger.warn('Duplicate Key Error:', { field, url: req.url });
  }
  // Handle JWT errors
  else if (error.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Invalid token';
    code = 'INVALID_TOKEN';

    logger.warn('JWT Error:', { message, url: req.url });
  }
  // Handle JWT expiration
  else if (error.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Token expired';
    code = 'TOKEN_EXPIRED';

    logger.warn('Token Expired:', { url: req.url });
  }
  // Handle unexpected errors
  else {
    logger.error('Unexpected Error:', {
      message: error.message,
      stack: error.stack,
      url: req.url,
      method: req.method,
      body: req.body,
    });
  }

  // Send error response
  return res.status(statusCode).json({
    success: false,
    error: {
      code,
      message,
      ...(details && { details }),
      ...(config.env === 'development' && {
        stack: error.stack,
      }),
    },
    timestamp: new Date().toISOString(),
  });
};

/**
 * Handle 404 errors
 */
export const notFoundHandler = (
  req: Request,
  res: Response,
  next: NextFunction
): Response => {
  return res.status(404).json({
    success: false,
    error: {
      code: 'NOT_FOUND',
      message: `Route ${req.method} ${req.url} not found`,
    },
    timestamp: new Date().toISOString(),
  });
};

/**
 * Catch async errors wrapper
 */
export const catchAsync = (
  fn: (req: Request, res: Response, next: NextFunction) => Promise<any>
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};
