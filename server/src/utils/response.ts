import { Response } from 'express';

interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    totalPages?: number;
  };
  timestamp: string;
}

export class ResponseHandler {
  static success<T>(
    res: Response,
    data: T,
    message: string = 'Success',
    statusCode: number = 200,
    meta?: any
  ): Response {
    const response: ApiResponse<T> = {
      success: true,
      message,
      data,
      timestamp: new Date().toISOString(),
    };

    if (meta) {
      response.meta = meta;
    }

    return res.status(statusCode).json(response);
  }

  static created<T>(
    res: Response,
    data: T,
    message: string = 'Resource created successfully'
  ): Response {
    return this.success(res, data, message, 201);
  }

  static noContent(res: Response, message: string = 'Success'): Response {
    return res.status(204).json({
      success: true,
      message,
      timestamp: new Date().toISOString(),
    });
  }

  static error(
    res: Response,
    message: string,
    statusCode: number = 500,
    code: string = 'SERVER_ERROR',
    details?: any
  ): Response {
    const response: ApiResponse = {
      success: false,
      error: {
        code,
        message,
        details,
      },
      timestamp: new Date().toISOString(),
    };

    return res.status(statusCode).json(response);
  }

  static badRequest(
    res: Response,
    message: string = 'Bad request',
    details?: any
  ): Response {
    return this.error(res, message, 400, 'BAD_REQUEST', details);
  }

  static unauthorized(
    res: Response,
    message: string = 'Unauthorized',
    details?: any
  ): Response {
    return this.error(res, message, 401, 'UNAUTHORIZED', details);
  }

  static forbidden(
    res: Response,
    message: string = 'Forbidden',
    details?: any
  ): Response {
    return this.error(res, message, 403, 'FORBIDDEN', details);
  }

  static notFound(
    res: Response,
    message: string = 'Resource not found',
    details?: any
  ): Response {
    return this.error(res, message, 404, 'NOT_FOUND', details);
  }

  static conflict(
    res: Response,
    message: string = 'Conflict',
    details?: any
  ): Response {
    return this.error(res, message, 409, 'CONFLICT', details);
  }

  static paginated<T>(
    res: Response,
    data: T[],
    page: number,
    limit: number,
    total: number,
    message: string = 'Success'
  ): Response {
    const totalPages = Math.ceil(total / limit);

    return this.success(
      res,
      data,
      message,
      200,
      {
        page,
        limit,
        total,
        totalPages,
      }
    );
  }
}
