import crypto from 'crypto';
import config from '../config';
import { EncryptionError } from './errors';

export class EncryptionService {
  private static algorithm = config.encryption.algorithm;
  private static key = Buffer.from(config.encryption.key, 'utf-8').slice(0, 32);

  /**
   * Encrypt data using AES-256-GCM
   */
  static encrypt(data: string | Buffer): {
    encryptedData: string;
    iv: string;
    authTag: string;
  } {
    try {
      const iv = crypto.randomBytes(16);
      const cipher = crypto.createCipheriv(
        this.algorithm as crypto.CipherGCMTypes,
        this.key,
        iv
      );

      const dataString = Buffer.isBuffer(data) ? data.toString('utf-8') : data;

      let encrypted = cipher.update(dataString, 'utf8', 'hex');
      encrypted += cipher.final('hex');

      const authTag = cipher.getAuthTag();

      return {
        encryptedData: encrypted,
        iv: iv.toString('hex'),
        authTag: authTag.toString('hex'),
      };
    } catch (error) {
      throw new EncryptionError('Encryption failed');
    }
  }

  /**
   * Decrypt data using AES-256-GCM
   */
  static decrypt(
    encryptedData: string,
    iv: string,
    authTag: string
  ): string {
    try {
      const decipher = crypto.createDecipheriv(
        this.algorithm as crypto.CipherGCMTypes,
        this.key,
        Buffer.from(iv, 'hex')
      );

      decipher.setAuthTag(Buffer.from(authTag, 'hex'));

      let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
      decrypted += decipher.final('utf8');

      return decrypted;
    } catch (error) {
      throw new EncryptionError('Decryption failed');
    }
  }

  /**
   * Hash data using SHA-256
   */
  static hash(data: string): string {
    return crypto.createHash('sha256').update(data).digest('hex');
  }

  /**
   * Generate file hash from buffer
   */
  static hashFile(buffer: Buffer): string {
    return crypto.createHash('sha256').update(buffer).digest('hex');
  }

  /**
   * Generate random encryption key
   */
  static generateKey(length: number = 32): string {
    return crypto.randomBytes(length).toString('hex');
  }

  /**
   * Generate random IV
   */
  static generateIV(): string {
    return crypto.randomBytes(16).toString('hex');
  }

  /**
   * Encrypt file buffer
   */
  static encryptFile(fileBuffer: Buffer): {
    encryptedBuffer: Buffer;
    iv: string;
    authTag: string;
    fileHash: string;
  } {
    try {
      // Generate file hash first
      const fileHash = this.hashFile(fileBuffer);

      // Encrypt the file
      const iv = crypto.randomBytes(16);
      const cipher = crypto.createCipheriv(
        this.algorithm as crypto.CipherGCMTypes,
        this.key,
        iv
      );

      const encrypted = Buffer.concat([
        cipher.update(fileBuffer),
        cipher.final(),
      ]);

      const authTag = cipher.getAuthTag();

      return {
        encryptedBuffer: encrypted,
        iv: iv.toString('hex'),
        authTag: authTag.toString('hex'),
        fileHash,
      };
    } catch (error) {
      throw new EncryptionError('File encryption failed');
    }
  }

  /**
   * Decrypt file buffer
   */
  static decryptFile(
    encryptedBuffer: Buffer,
    iv: string,
    authTag: string
  ): Buffer {
    try {
      const decipher = crypto.createDecipheriv(
        this.algorithm as crypto.CipherGCMTypes,
        this.key,
        Buffer.from(iv, 'hex')
      );

      decipher.setAuthTag(Buffer.from(authTag, 'hex'));

      const decrypted = Buffer.concat([
        decipher.update(encryptedBuffer),
        decipher.final(),
      ]);

      return decrypted;
    } catch (error) {
      throw new EncryptionError('File decryption failed');
    }
  }

  /**
   * Compare hash with data
   */
  static verifyHash(data: string, hash: string): boolean {
    const dataHash = this.hash(data);
    return crypto.timingSafeEqual(
      Buffer.from(dataHash),
      Buffer.from(hash)
    );
  }

  /**
   * Generate API key
   */
  static generateApiKey(): string {
    return `br_${crypto.randomBytes(32).toString('hex')}`;
  }
}
