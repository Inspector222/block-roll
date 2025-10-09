/**
 * BlockRoll HTTP Client
 * Handles all HTTP requests to the BlockRoll backend API
 */

import axios, { AxiosInstance, AxiosError, AxiosRequestConfig } from 'axios';
import { BlockRollError, ApiResponse } from './types';

export class BlockRollClient {
  private client: AxiosInstance;
  private apiKey: string;
  public baseURL: string;

  constructor(apiKey: string, baseURL: string = 'https://api.blockroll.io/v1', timeout: number = 30000) {
    this.apiKey = apiKey;
    this.baseURL = baseURL;

    this.client = axios.create({
      baseURL: this.baseURL,
      timeout: timeout,
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': this.apiKey,
      },
    });

    this.setupInterceptors();
  }

  /**
   * Setup request and response interceptors
   */
  private setupInterceptors(): void {
    // Request interceptor
    this.client.interceptors.request.use(
      (config) => {
        // Add timestamp for request signing
        config.headers['x-timestamp'] = Date.now().toString();
        return config;
      },
      (error) => {
        return Promise.reject(this.handleError(error));
      }
    );

    // Response interceptor
    this.client.interceptors.response.use(
      (response) => {
        // Extract data from ApiResponse format
        const data = response.data;
        
        if (data.success === false) {
          throw new BlockRollError(
            data.error?.message || 'Request failed',
            data.error?.code || 'API_ERROR',
            response.status,
            data.error?.details
          );
        }

        return data.data || data;
      },
      (error: AxiosError) => {
        return Promise.reject(this.handleError(error));
      }
    );
  }

  /**
   * Handle and transform errors
   */
  private handleError(error: any): BlockRollError {
    if (error instanceof BlockRollError) {
      return error;
    }

    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
      const data = error.response?.data as any;

      // Handle specific HTTP status codes
      if (status === 401) {
        return new BlockRollError(
          data?.error?.message || 'Invalid API key',
          'UNAUTHORIZED',
          401
        );
      }

      if (status === 403) {
        return new BlockRollError(
          data?.error?.message || 'Insufficient permissions',
          'FORBIDDEN',
          403
        );
      }

      if (status === 404) {
        return new BlockRollError(
          data?.error?.message || 'Resource not found',
          'NOT_FOUND',
          404
        );
      }

      if (status === 429) {
        return new BlockRollError(
          data?.error?.message || 'Rate limit exceeded',
          'RATE_LIMIT',
          429
        );
      }

      if (status === 413) {
        return new BlockRollError(
          'File too large',
          'FILE_TOO_LARGE',
          413
        );
      }

      if (status && status >= 500) {
        return new BlockRollError(
          'Server error. Please try again.',
          'SERVER_ERROR',
          status
        );
      }

      return new BlockRollError(
        data?.error?.message || error.message || 'Request failed',
        data?.error?.code || 'NETWORK_ERROR',
        status
      );
    }

    return new BlockRollError(
      error.message || 'Unknown error',
      'UNKNOWN_ERROR'
    );
  }

  /**
   * GET request
   */
  async get<T = any>(url: string, params?: any): Promise<T> {
    const response = await this.client.get<T>(url, { params });
    return response as T;
  }

  /**
   * POST request
   */
  async post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.post<T>(url, data, config);
    return response as T;
  }

  /**
   * PUT request
   */
  async put<T = any>(url: string, data?: any): Promise<T> {
    const response = await this.client.put<T>(url, data);
    return response as T;
  }

  /**
   * PATCH request
   */
  async patch<T = any>(url: string, data?: any): Promise<T> {
    const response = await this.client.patch<T>(url, data);
    return response as T;
  }

  /**
   * DELETE request
   */
  async delete<T = any>(url: string): Promise<T> {
    const response = await this.client.delete<T>(url);
    return response as T;
  }

  /**
   * Upload file with progress tracking
   */
  async upload<T = any>(
    url: string,
    file: File | Blob,
    additionalData?: Record<string, any>,
    onProgress?: (percent: number) => void
  ): Promise<T> {
    const formData = new FormData();
    formData.append('file', file);

    if (additionalData) {
      Object.keys(additionalData).forEach((key) => {
        const value = additionalData[key];
        if (value !== undefined && value !== null) {
          formData.append(key, typeof value === 'object' ? JSON.stringify(value) : value);
        }
      });
    }

    const config: AxiosRequestConfig = {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onProgress(percent);
        }
      },
    };

    const response = await this.client.post<T>(url, formData, config);
    return response as T;
  }

  /**
   * Download file as blob
   */
  async downloadBlob(url: string): Promise<Blob> {
    const response = await this.client.get(url, {
      responseType: 'blob',
    });
    return response as unknown as Blob;
  }

  /**
   * Get API key for header inspection
   */
  getApiKey(): string {
    return this.apiKey;
  }

  /**
   * Update API key
   */
  setApiKey(apiKey: string): void {
    this.apiKey = apiKey;
    this.client.defaults.headers['x-api-key'] = apiKey;
  }
}

