import { logger } from '../config/logger';
import { AppError } from '../utils/errors';

export abstract class BaseService {
  protected serviceName: string;

  constructor(serviceName: string) {
    this.serviceName = serviceName;
  }

  /**
   * Log info message
   */
  protected logInfo(message: string, meta?: any): void {
    logger.info(`[${this.serviceName}] ${message}`, meta);
  }

  /**
   * Log error message
   */
  protected logError(message: string, error?: any): void {
    logger.error(`[${this.serviceName}] ${message}`, {
      error: error?.message || error,
      stack: error?.stack,
    });
  }

  /**
   * Log warning message
   */
  protected logWarning(message: string, meta?: any): void {
    logger.warn(`[${this.serviceName}] ${message}`, meta);
  }

  /**
   * Handle service error
   */
  protected handleError(error: unknown, context: string): never {
    this.logError(`Error in ${context}`, error);

    if (error instanceof AppError) {
      throw error;
    }

    if (error instanceof Error) {
      throw new AppError(error.message, 500, true);
    }

    throw new AppError('An unexpected error occurred', 500, true);
  }

  /**
   * Validate input
   */
  protected validateInput(condition: boolean, message: string): void {
    if (!condition) {
      throw new AppError(message, 400, true, 'VALIDATION_ERROR');
    }
  }

  /**
   * Execute with error handling
   */
  protected async executeWithErrorHandling<T>(
    operation: () => Promise<T>,
    context: string
  ): Promise<T> {
    try {
      return await operation();
    } catch (error) {
      return this.handleError(error, context);
    }
  }
}
