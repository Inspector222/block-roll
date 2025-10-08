import { NextFunction, Request, Response } from 'express';
import { logger } from '../config/logger';
import { AppError } from '../utils/errors';
import { ResponseHandler } from '../utils/response';

export abstract class BaseController {
  /**
   * Catch async errors wrapper
   */
  protected catchAsync(
    fn: (req: Request, res: Response, next: NextFunction) => Promise<any>
  ) {
    return (req: Request, res: Response, next: NextFunction) => {
      Promise.resolve(fn(req, res, next)).catch(next);
    };
  }

  /**
   * Send success response
   */
  protected sendSuccess<T>(
    res: Response,
    data: T,
    message: string = 'Success',
    statusCode: number = 200,
    meta?: any
  ): Response {
    return ResponseHandler.success(res, data, message, statusCode, meta);
  }

  /**
   * Send created response
   */
  protected sendCreated<T>(
    res: Response,
    data: T,
    message: string = 'Resource created successfully'
  ): Response {
    return ResponseHandler.created(res, data, message);
  }

  /**
   * Send no content response
   */
  protected sendNoContent(res: Response, message: string = 'Success'): Response {
    return ResponseHandler.noContent(res, message);
  }

  /**
   * Send error response
   */
  protected sendError(
    res: Response,
    message: string,
    statusCode: number = 500,
    code: string = 'SERVER_ERROR',
    details?: any
  ): Response {
    return ResponseHandler.error(res, message, statusCode, code, details);
  }

  /**
   * Send paginated response
   */
  protected sendPaginated<T>(
    res: Response,
    data: T[],
    page: number,
    limit: number,
    total: number,
    message: string = 'Success'
  ): Response {
    return ResponseHandler.paginated(res, data, page, limit, total, message);
  }

  /**
   * Handle error
   */
  protected handleError(
    error: unknown,
    res: Response,
    defaultMessage: string = 'An error occurred'
  ): Response {
    if (error instanceof AppError) {
      logger.error(`AppError: ${error.message}`, { code: error.code });
      return this.sendError(
        res,
        error.message,
        error.statusCode,
        error.code || 'ERROR'
      );
    }

    if (error instanceof Error) {
      logger.error(`Error: ${error.message}`, { stack: error.stack });
      return this.sendError(res, error.message);
    }

    logger.error(`Unknown error: ${error}`);
    return this.sendError(res, defaultMessage);
  }

  /**
   * Get user ID from request
   */
  protected getUserId(req: Request): string {
    return (req as any).user?.userId || '';
  }

  /**
   * Get wallet address from request
   */
  protected getWalletAddress(req: Request): string {
    return (req as any).user?.walletAddress || '';
  }

  /**
   * Check if user is admin
   */
  protected isAdmin(req: Request): boolean {
    return (req as any).user?.role === 'admin';
  }

  /**
   * Validate required fields
   */
  protected validateRequiredFields(
    body: any,
    fields: string[]
  ): { isValid: boolean; missing: string[] } {
    const missing = fields.filter((field) => !body[field]);
    return {
      isValid: missing.length === 0,
      missing,
    };
  }

  /**
   * Extract pagination params
   */
  protected extractPaginationParams(query: any): {
    page: number;
    limit: number;
    skip: number;
  } {
    const page = Math.max(1, parseInt(query.page, 10) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(query.limit, 10) || 20));
    const skip = (page - 1) * limit;

    return { page, limit, skip };
  }

  /**
   * Extract sort params
   */
  protected extractSortParams(query: any): Record<string, 1 | -1> {
    const sortField = query.sortBy || 'createdAt';
    const sortOrder = query.sortOrder === 'asc' ? 1 : -1;

    return { [sortField]: sortOrder };
  }
}
