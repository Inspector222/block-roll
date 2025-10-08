import { Message, MessageMedia } from 'whatsapp-web.js';
import { IMediaService, MediaInfo } from '../types';
import { logger } from '../utils/logger';

/**
 * Media service implementation
 * Handles media download, validation, and processing
 */
export class MediaService implements IMediaService {
  private maxFileSize: number = 100 * 1024 * 1024; // 100MB
  private readonly allowedMimeTypes: string[] = [
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp',
    'video/mp4',
    'video/avi',
    'video/mov',
    'audio/mpeg',
    'audio/wav',
    'audio/ogg',
    'application/pdf',
    'text/plain',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ];

  /**
   * Download media from message
   */
  public async downloadMedia(message: Message): Promise<MessageMedia | null> {
    try {
      if (!message.hasMedia) {
        logger.debug('Message does not contain media');
        return null;
      }

      logger.debug('Downloading media', {
        messageId: message.id,
        type: message.type
      });

      const media = await message.downloadMedia();
      
      if (!media) {
        logger.warn('Failed to download media - no data returned');
        return null;
      }

      // Validate media
      if (!this.validateMedia(media)) {
        logger.warn('Downloaded media failed validation', {
          mimetype: media.mimetype,
          filesize: media.filesize
        });
        return null;
      }

      logger.info('Media downloaded successfully', {
        mimetype: media.mimetype,
        filesize: media.filesize,
        filename: media.filename
      });

      return media;

    } catch (error) {
      logger.error('Error downloading media', {
        error: error instanceof Error ? error.message : String(error),
        messageId: message.id
      });
      return null;
    }
  }

  /**
   * Validate media file
   */
  public validateMedia(media: MessageMedia): boolean {
    try {
      // Check if media has required properties
      if (!media.mimetype || !media.data) {
        logger.warn('Media missing required properties', {
          hasMimetype: !!media.mimetype,
          hasData: !!media.data
        });
        return false;
      }

      // Check file size
      if (media.filesize && media.filesize > this.maxFileSize) {
        logger.warn('Media file too large', {
          filesize: media.filesize,
          maxSize: this.maxFileSize
        });
        return false;
      }

      // Check MIME type
      if (!this.allowedMimeTypes.includes(media.mimetype)) {
        logger.warn('Media MIME type not allowed', {
          mimetype: media.mimetype,
          allowedTypes: this.allowedMimeTypes
        });
        return false;
      }

      // Validate data format (basic check)
      if (!this.isValidBase64(media.data)) {
        logger.warn('Invalid media data format');
        return false;
      }

      return true;

    } catch (error) {
      logger.error('Error validating media', error);
      return false;
    }
  }

  /**
   * Get media information
   */
  public getMediaInfo(media: MessageMedia): MediaInfo {
    const size = media.filesize || this.estimateBase64Size(media.data);
    
    return {
      type: media.mimetype,
      size: size,
      filename: media.filename || undefined,
      mimetype: media.mimetype
    };
  }

  /**
   * Create media from file path
   */
  public async createMediaFromPath(filePath: string): Promise<MessageMedia | null> {
    try {
      const media = MessageMedia.fromFilePath(filePath);
      
      if (!this.validateMedia(media)) {
        logger.warn('Created media failed validation', { filePath });
        return null;
      }

      return media;

    } catch (error) {
      logger.error('Error creating media from file path', {
        error: error instanceof Error ? error.message : String(error),
        filePath
      });
      return null;
    }
  }

  /**
   * Create media from URL
   */
  public async createMediaFromUrl(url: string, options?: any): Promise<MessageMedia | null> {
    try {
      const media = await MessageMedia.fromUrl(url, options);
      
      if (!this.validateMedia(media)) {
        logger.warn('Created media from URL failed validation', { url });
        return null;
      }

      return media;

    } catch (error) {
      logger.error('Error creating media from URL', {
        error: error instanceof Error ? error.message : String(error),
        url
      });
      return null;
    }
  }

  /**
   * Get media type category
   */
  public getMediaCategory(mimetype: string): string {
    if (mimetype.startsWith('image/')) return 'image';
    if (mimetype.startsWith('video/')) return 'video';
    if (mimetype.startsWith('audio/')) return 'audio';
    if (mimetype.startsWith('application/')) return 'document';
    if (mimetype.startsWith('text/')) return 'text';
    return 'unknown';
  }

  /**
   * Format file size for display
   */
  public formatFileSize(bytes: number): string {
    const units = ['B', 'KB', 'MB', 'GB'];
    let size = bytes;
    let unitIndex = 0;

    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024;
      unitIndex++;
    }

    return `${size.toFixed(1)} ${units[unitIndex]}`;
  }

  /**
   * Check if base64 string is valid
   */
  private isValidBase64(str: string): boolean {
    try {
      const base64Regex = /^[A-Za-z0-9+/]*={0,2}$/;
      return base64Regex.test(str) && str.length % 4 === 0;
    } catch {
      return false;
    }
  }

  /**
   * Estimate base64 data size in bytes
   */
  private estimateBase64Size(base64Data: string): number {
    // Base64 encoding increases size by ~33%
    // Remove padding and calculate approximate original size
    const padding = (base64Data.match(/=/g) || []).length;
    const dataLength = base64Data.length - padding;
    return Math.floor((dataLength * 3) / 4);
  }

  /**
   * Get allowed MIME types
   */
  public getAllowedMimeTypes(): string[] {
    return [...this.allowedMimeTypes];
  }

  /**
   * Add allowed MIME type
   */
  public addAllowedMimeType(mimetype: string): void {
    if (!this.allowedMimeTypes.includes(mimetype)) {
      this.allowedMimeTypes.push(mimetype);
      logger.info('Added allowed MIME type', { mimetype });
    }
  }

  /**
   * Remove allowed MIME type
   */
  public removeAllowedMimeType(mimetype: string): void {
    const index = this.allowedMimeTypes.indexOf(mimetype);
    if (index > -1) {
      this.allowedMimeTypes.splice(index, 1);
      logger.info('Removed allowed MIME type', { mimetype });
    }
  }

  /**
   * Set maximum file size
   */
  public setMaxFileSize(maxSize: number): void {
    this.maxFileSize = maxSize;
    logger.info('Updated maximum file size', { maxSize: this.formatFileSize(maxSize) });
  }

  /**
   * Get maximum file size
   */
  public getMaxFileSize(): number {
    return this.maxFileSize;
  }
}
