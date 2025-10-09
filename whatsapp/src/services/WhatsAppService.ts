import { Client, Message, MessageMedia, RemoteAuth } from 'whatsapp-web.js';
import { MongoStore } from 'wwebjs-mongo';
import { mongoDBManager } from '../config/mongodb';
import { IWhatsAppService, ServiceError, WhatsAppConfig } from '../types';
import { logger } from '../utils/logger';

/**
 * WhatsApp service implementation with MongoDB session storage
 * Handles all WhatsApp Web.js client operations
 */
export class WhatsAppService implements IWhatsAppService {
  private client!: Client;
  private isInitialized: boolean = false;
  private isSessionSaved: boolean = false;
  private config: WhatsAppConfig;

  constructor(config: WhatsAppConfig) {
    this.config = config;
    // Client will be initialized in initialize() method after MongoDB connects
  }

  /**
   * Initialize WhatsApp client with MongoDB store
   */
  public async initialize(): Promise<void> {
    try {
      logger.info('Initializing WhatsApp service with MongoDB store...');

      // Connect to MongoDB first
      const mongoose = await mongoDBManager.connect();
      logger.info('MongoDB connection established for session storage');

      // Create MongoDB store for WhatsApp sessions
      const store = new MongoStore({ mongoose: mongoose });
      logger.info('MongoDB store created for WhatsApp sessions');

      // Get configuration from environment
      const clientId = process.env.SESSION_CLIENT_ID || 'blockroll-bot';
      const backupSyncIntervalMs = parseInt(process.env.BACKUP_SYNC_INTERVAL || '300000', 10);

      // Initialize WhatsApp client with RemoteAuth strategy
      this.client = new Client({
        authStrategy: new RemoteAuth({
          clientId: clientId,
          dataPath: this.config.authStrategy.dataPath,
          store: store,
          backupSyncIntervalMs: backupSyncIntervalMs
        }),
        puppeteer: this.config.puppeteer
      });

      logger.info('WhatsApp client configured with RemoteAuth', {
        clientId,
        backupSyncIntervalMs,
        dataPath: this.config.authStrategy.dataPath
      });

      // Setup event listeners before initialization
      this.setupEventListeners();

      // Initialize the client
      await this.client.initialize();
      this.isInitialized = true;

      logger.info('✅ WhatsApp service initialized successfully');
    } catch (error) {
      logger.error('❌ Failed to initialize WhatsApp service', error);
      throw new ServiceError(
        'Failed to initialize WhatsApp client',
        error instanceof Error ? error : undefined
      );
    }
  }

  /**
   * Destroy WhatsApp client and disconnect MongoDB
   */
  public async destroy(): Promise<void> {
    try {
      logger.info('🛑 Destroying WhatsApp service...');

      if (this.client) {
        await this.client.destroy();
      }

      this.isInitialized = false;
      this.isSessionSaved = false;

      // Disconnect MongoDB
      await mongoDBManager.disconnect();

      logger.info('✅ WhatsApp service destroyed successfully');
    } catch (error) {
      logger.error('❌ Failed to destroy WhatsApp service', error);
      throw new ServiceError(
        'Failed to destroy WhatsApp client',
        error instanceof Error ? error : undefined
      );
    }
  }

  /**
   * Send text message
   */
  public async sendMessage(to: string, content: string): Promise<Message> {
    this.ensureInitialized();

    try {
      logger.debug(`Sending message to ${to}: ${content.substring(0, 50)}...`);

      const message = await this.client.sendMessage(to, content);

      logger.info(`Message sent successfully to ${to}`);
      return message;
    } catch (error) {
      logger.error(`Failed to send message to ${to}`, error);
      throw new ServiceError(
        `Failed to send message to ${to}`,
        error instanceof Error ? error : undefined
      );
    }
  }

  /**
   * Send media message
   */
  public async sendMedia(to: string, media: MessageMedia): Promise<Message> {
    this.ensureInitialized();

    try {
      logger.debug(`Sending media to ${to}: ${media.mimetype}`);

      const message = await this.client.sendMessage(to, media);

      logger.info(`Media sent successfully to ${to}`);
      return message;
    } catch (error) {
      logger.error(`Failed to send media to ${to}`, error);
      throw new ServiceError(
        `Failed to send media to ${to}`,
        error instanceof Error ? error : undefined
      );
    }
  }

  /**
   * Get chat information
   */
  public async getChatInfo(chatId: string): Promise<any> {
    this.ensureInitialized();

    try {
      const chat = await this.client.getChatById(chatId);
      return chat;
    } catch (error) {
      logger.error(`Failed to get chat info for ${chatId}`, error);
      throw new ServiceError(
        `Failed to get chat info for ${chatId}`,
        error instanceof Error ? error : undefined
      );
    }
  }

  /**
   * Get contact information
   */
  public async getContactInfo(contactId: string): Promise<any> {
    this.ensureInitialized();

    try {
      const contact = await this.client.getContactById(contactId);
      return contact;
    } catch (error) {
      logger.error(`Failed to get contact info for ${contactId}`, error);
      throw new ServiceError(
        `Failed to get contact info for ${contactId}`,
        error instanceof Error ? error : undefined
      );
    }
  }

  /**
   * Get client instance (for event listeners)
   */
  public getClient(): Client {
    return this.client;
  }

  /**
   * Check if service is initialized
   */
  public getIsInitialized(): boolean {
    return this.isInitialized;
  }

  /**
   * Check if session is saved to MongoDB
   */
  public getIsSessionSaved(): boolean {
    return this.isSessionSaved;
  }

  /**
   * Get client state
   */
  public async getState(): Promise<string> {
    this.ensureInitialized();

    try {
      return await this.client.getState();
    } catch (error) {
      logger.error('Failed to get client state', error);
      throw new ServiceError(
        'Failed to get client state',
        error instanceof Error ? error : undefined
      );
    }
  }

  /**
   * Setup event listeners
   */
  private setupEventListeners(): void {
    this.client.on('qr', (qr: string) => {
      logger.info('📱 QR code received - scan with WhatsApp mobile app');
      // QR code will be handled by main application
    });

    this.client.on('ready', () => {
      logger.info('✅ WhatsApp client is ready');
      logger.warn('⏳ Session is being saved to MongoDB (takes ~1 minute)...');
    });

    this.client.on('authenticated', () => {
      logger.info('✅ WhatsApp client authenticated successfully');
    });

    this.client.on('auth_failure', (msg: string) => {
      logger.error('❌ WhatsApp authentication failed', { message: msg });
    });

    this.client.on('disconnected', (reason: string) => {
      logger.warn('⚠️ WhatsApp client disconnected', { reason });
      this.isInitialized = false;
      this.isSessionSaved = false;
    });

    this.client.on('change_state', (state: string) => {
      logger.debug('WhatsApp client state changed', { state });
    });

    this.client.on('message', (message: Message) => {
      logger.debug('Message received', {
        from: message.from,
        type: message.type,
        hasMedia: message.hasMedia
      });
    });

    // New event: Remote session saved to MongoDB
    this.client.on('remote_session_saved', () => {
      this.isSessionSaved = true;
      logger.info('💾 ✅ Session successfully saved to MongoDB!');
      logger.info('🎉 Bot is now fully operational and session is persisted!');
    });

    // Handle loading session from MongoDB
    this.client.on('loading_screen', (percent: number, message: string) => {
      logger.debug(`Loading screen: ${percent}% - ${message}`);
    });
  }

  /**
   * Ensure service is initialized
   */
  private ensureInitialized(): void {
    if (!this.isInitialized) {
      throw new ServiceError('WhatsApp service is not initialized');
    }
  }
}
