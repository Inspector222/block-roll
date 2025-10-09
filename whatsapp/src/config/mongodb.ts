/**
 * MongoDB connection manager for WhatsApp session storage
 */

import mongoose from 'mongoose';
import { logger } from '../utils/logger';

export class MongoDBManager {
  private static instance: MongoDBManager;
  private isConnected: boolean = false;

  private constructor() {}

  /**
   * Get singleton instance
   */
  public static getInstance(): MongoDBManager {
    if (!MongoDBManager.instance) {
      MongoDBManager.instance = new MongoDBManager();
    }
    return MongoDBManager.instance;
  }

  /**
   * Connect to MongoDB
   */
  public async connect(uri?: string): Promise<typeof mongoose> {
    if (this.isConnected) {
      logger.info('MongoDB already connected');
      return mongoose;
    }

    const mongoUri = uri || process.env.MONGODB_URI || 'mongodb://localhost:27017/blockroll-whatsapp';

    try {
      logger.info('Connecting to MongoDB...', { uri: this.sanitizeUri(mongoUri) });

      await mongoose.connect(mongoUri, {
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
      });

      this.isConnected = true;
      
      logger.info('✅ MongoDB connected successfully');

      // Handle connection events
      mongoose.connection.on('error', (err) => {
        logger.error('MongoDB connection error:', err);
      });

      mongoose.connection.on('disconnected', () => {
        logger.warn('MongoDB disconnected');
        this.isConnected = false;
      });

      mongoose.connection.on('reconnected', () => {
        logger.info('MongoDB reconnected');
        this.isConnected = true;
      });

      return mongoose;
    } catch (error) {
      logger.error('Failed to connect to MongoDB', error);
      throw new Error(`MongoDB connection failed: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Disconnect from MongoDB
   */
  public async disconnect(): Promise<void> {
    if (!this.isConnected) {
      return;
    }

    try {
      await mongoose.disconnect();
      this.isConnected = false;
      logger.info('MongoDB disconnected successfully');
    } catch (error) {
      logger.error('Error disconnecting from MongoDB', error);
      throw error;
    }
  }

  /**
   * Check if connected
   */
  public getIsConnected(): boolean {
    return this.isConnected;
  }

  /**
   * Get mongoose instance
   */
  public getMongoose(): typeof mongoose {
    return mongoose;
  }

  /**
   * Sanitize URI for logging (hide credentials)
   */
  private sanitizeUri(uri: string): string {
    try {
      const url = new URL(uri);
      if (url.password) {
        url.password = '****';
      }
      return url.toString();
    } catch {
      return uri.replace(/\/\/([^:]+):([^@]+)@/, '//$1:****@');
    }
  }
}

// Export singleton instance
export const mongoDBManager = MongoDBManager.getInstance();

