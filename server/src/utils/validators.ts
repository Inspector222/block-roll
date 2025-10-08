import { ValidationError } from './errors';

export class Validators {
  /**
   * Validate Ethereum wallet address
   */
  static isValidWalletAddress(address: string): boolean {
    return /^0x[a-fA-F0-9]{40}$/.test(address);
  }

  /**
   * Validate email address
   */
  static isValidEmail(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  /**
   * Validate API key format
   */
  static isValidApiKey(key: string): boolean {
    return /^br_[a-fA-F0-9]{64}$/.test(key);
  }

  /**
   * Validate file size
   */
  static isValidFileSize(size: number, maxSize: number): boolean {
    return size > 0 && size <= maxSize;
  }

  /**
   * Validate file type
   */
  static isAllowedFileType(mimeType: string, allowedTypes: string[]): boolean {
    return allowedTypes.includes(mimeType);
  }

  /**
   * Sanitize filename
   */
  static sanitizeFilename(filename: string): string {
    return filename.replace(/[^a-zA-Z0-9._-]/g, '_');
  }

  /**
   * Validate object ID
   */
  static isValidObjectId(id: string): boolean {
    return /^[a-fA-F0-9]{24}$/.test(id);
  }

  /**
   * Validate pagination parameters
   */
  static validatePagination(page: any, limit: any): {
    page: number;
    limit: number;
  } {
    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 20;

    if (pageNum < 1) {
      throw new ValidationError('Page number must be at least 1');
    }

    if (limitNum < 1 || limitNum > 100) {
      throw new ValidationError('Limit must be between 1 and 100');
    }

    return { page: pageNum, limit: limitNum };
  }

  /**
   * Validate date range
   */
  static validateDateRange(startDate: string, endDate: string): {
    start: Date;
    end: Date;
  } {
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (isNaN(start.getTime())) {
      throw new ValidationError('Invalid start date');
    }

    if (isNaN(end.getTime())) {
      throw new ValidationError('Invalid end date');
    }

    if (start > end) {
      throw new ValidationError('Start date must be before end date');
    }

    return { start, end };
  }

  /**
   * Validate workspace role
   */
  static isValidWorkspaceRole(role: string): boolean {
    return ['owner', 'admin', 'editor', 'viewer'].includes(role);
  }

  /**
   * Validate permission
   */
  static isValidPermission(permission: string): boolean {
    const validPermissions = [
      'upload',
      'read',
      'share',
      'delete',
      'emergencyAccess',
      'admin',
    ];
    return validPermissions.includes(permission);
  }

  /**
   * Validate URL
   */
  static isValidUrl(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Validate hex string
   */
  static isValidHex(hex: string, length?: number): boolean {
    const hexRegex = length
      ? new RegExp(`^[a-fA-F0-9]{${length}}$`)
      : /^[a-fA-F0-9]+$/;
    return hexRegex.test(hex);
  }

  /**
   * Assert wallet address validity
   */
  static assertValidWalletAddress(address: string): void {
    if (!this.isValidWalletAddress(address)) {
      throw new ValidationError(`Invalid wallet address: ${address}`);
    }
  }

  /**
   * Assert object ID validity
   */
  static assertValidObjectId(id: string, fieldName: string = 'ID'): void {
    if (!this.isValidObjectId(id)) {
      throw new ValidationError(`Invalid ${fieldName}`);
    }
  }
}
