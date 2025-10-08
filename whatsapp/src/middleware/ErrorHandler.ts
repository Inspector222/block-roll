import { WhatsAppError, ServiceError } from '../types';
import { logger } from '../utils/logger';

/**
 * Error handling middleware and utilities
 */
export class ErrorHandler {
  /**
   * Handle WhatsApp-specific errors
   */
  public static handleWhatsAppError(error: any, context?: string): WhatsAppError {
    let whatsappError: WhatsAppError;

    if (error instanceof WhatsAppError) {
      whatsappError = error;
    } else if (error instanceof Error) {
      whatsappError = new ServiceError(error.message, error);
    } else {
      whatsappError = new ServiceError(String(error));
    }

    // Add context if provided
    if (context) {
      whatsappError.message = `${context}: ${whatsappError.message}`;
    }

    logger.error('WhatsApp error occurred', {
      message: whatsappError.message,
      code: whatsappError.code,
      originalError: whatsappError.originalError?.message,
      context
    });

    return whatsappError;
  }

  /**
   * Handle and log errors gracefully
   */
  public static async handleError(error: any, context?: string): Promise<void> {
    try {
      const handledError = this.handleWhatsAppError(error, context);
      
      // You can add additional error handling logic here
      // such as sending error reports, notifications, etc.
      
    } catch (handlingError) {
      logger.error('Error in error handler', {
        originalError: error instanceof Error ? error.message : String(error),
        handlingError: handlingError instanceof Error ? handlingError.message : String(handlingError),
        context
      });
    }
  }

  /**
   * Wrap async functions with error handling
   */
  public static withErrorHandling<T extends any[], R>(
    fn: (...args: T) => Promise<R>,
    context?: string
  ) {
    return async (...args: T): Promise<R | undefined> => {
      try {
        return await fn(...args);
      } catch (error) {
        await this.handleError(error, context);
        return undefined;
      }
    };
  }

  /**
   * Wrap sync functions with error handling
   */
  public static withSyncErrorHandling<T extends any[], R>(
    fn: (...args: T) => R,
    context?: string
  ) {
    return (...args: T): R | undefined => {
      try {
        return fn(...args);
      } catch (error) {
        this.handleError(error, context);
        return undefined;
      }
    };
  }

  /**
   * Create error response message
   */
  public static createErrorResponse(error: any, userFriendly: boolean = true): string {
    if (userFriendly) {
      return '❌ An error occurred. Please try again later.';
    }

    if (error instanceof WhatsAppError) {
      return `❌ Error (${error.code}): ${error.message}`;
    }

    if (error instanceof Error) {
      return `❌ Error: ${error.message}`;
    }

    return `❌ Unknown error: ${String(error)}`;
  }

  /**
   * Check if error is retryable
   */
  public static isRetryableError(error: any): boolean {
    if (error instanceof WhatsAppError) {
      const retryableCodes = ['NETWORK_ERROR', 'TIMEOUT_ERROR', 'RATE_LIMIT_ERROR'];
      return retryableCodes.includes(error.code);
    }

    // Check for common retryable error patterns
    const errorMessage = error instanceof Error ? error.message : String(error);
    const retryablePatterns = [
      'network',
      'timeout',
      'connection',
      'rate limit',
      'temporary',
      'unavailable'
    ];

    return retryablePatterns.some(pattern => 
      errorMessage.toLowerCase().includes(pattern)
    );
  }

  /**
   * Get error severity level
   */
  public static getErrorSeverity(error: any): 'low' | 'medium' | 'high' | 'critical' {
    if (error instanceof WhatsAppError) {
      switch (error.code) {
        case 'CONFIG_ERROR':
        case 'AUTH_ERROR':
          return 'critical';
        case 'SERVICE_ERROR':
          return 'high';
        case 'VALIDATION_ERROR':
          return 'medium';
        default:
          return 'low';
      }
    }

    if (error instanceof Error) {
      const errorMessage = error.message.toLowerCase();
      
      if (errorMessage.includes('critical') || errorMessage.includes('fatal')) {
        return 'critical';
      }
      
      if (errorMessage.includes('error') || errorMessage.includes('failed')) {
        return 'high';
      }
      
      if (errorMessage.includes('warning') || errorMessage.includes('invalid')) {
        return 'medium';
      }
    }

    return 'low';
  }

  /**
   * Setup global error handlers
   */
  public static setupGlobalErrorHandlers(): void {
    // Handle unhandled promise rejections
    process.on('unhandledRejection', (reason: unknown, promise: Promise<unknown>) => {
      logger.error('Unhandled Promise Rejection', {
        reason: reason instanceof Error ? reason.message : String(reason),
        promise: promise.toString()
      });
    });

    // Handle uncaught exceptions
    process.on('uncaughtException', (error: Error) => {
      logger.error('Uncaught Exception', {
        message: error.message,
        stack: error.stack
      });
      
      // Exit process after logging critical error
      setTimeout(() => {
        process.exit(1);
      }, 1000);
    });

    // Handle warnings
    process.on('warning', (warning: Error) => {
      logger.warn('Process Warning', {
        name: warning.name,
        message: warning.message,
        stack: warning.stack
      });
    });

    logger.info('Global error handlers setup complete');
  }
}
