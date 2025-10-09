import { Client } from 'whatsapp-web.js';
import * as qrcode from 'qrcode-terminal';

import { 
  WhatsAppService, 
  MessageService, 
  MediaService 
} from '../services';
import { 
  EventHandlerManager,
  QRCodeEventHandler,
  ReadyEventHandler,
  AuthEventHandler,
  ConnectionEventHandler,
  MessageEventHandler,
  MessageAckEventHandler
} from '../handlers/EventHandlers';
import { ErrorHandler } from '../middleware/ErrorHandler';
import { ProcessManager } from '../middleware/ProcessManager';
import { configManager } from '../config';
import { logger } from '../utils/logger';
import { AppConfig, ServiceError } from '../types';
import { registerCustomCommands } from '../commands/CustomCommands';
import { registerMediaCommands } from '../commands/MediaCommands';

/**
 * Main WhatsApp Bot application class
 * Orchestrates all services and handles the application lifecycle
 */
export class WhatsAppBot {
  private whatsappService: WhatsAppService;
  private messageService: MessageService;
  private mediaService: MediaService;
  private eventHandlerManager: EventHandlerManager;
  private config: AppConfig;
  private isInitialized: boolean = false;

  constructor() {
    this.config = configManager.getConfig();
    this.eventHandlerManager = new EventHandlerManager();
    
    // Initialize services
    this.whatsappService = new WhatsAppService(this.config.whatsapp);
    this.messageService = new MessageService(this.config.bot.adminNumbers);
    this.mediaService = new MediaService();
    
    this.setupEventHandlers();
    this.setupProcessManagement();
    this.setupErrorHandling();
  }

  /**
   * Initialize the WhatsApp bot
   */
  public async initialize(): Promise<void> {
    try {
      logger.info('🚀 Initializing WhatsApp Bot...');
      
      // Configure logger
      logger.configure(this.config.logging);
      
      // Initialize WhatsApp service
      await this.whatsappService.initialize();
      
      // Register custom commands
      registerCustomCommands(this.messageService);
      
      // Register media commands
      registerMediaCommands(this.messageService);
      
      // Setup client event listeners
      this.setupClientEventListeners();
      
      this.isInitialized = true;
      
      logger.info('✅ WhatsApp Bot initialized successfully');
      
    } catch (error) {
      logger.error('❌ Failed to initialize WhatsApp Bot', error);
      throw new ServiceError(
        'Failed to initialize WhatsApp Bot',
        error instanceof Error ? error : undefined
      );
    }
  }

  /**
   * Destroy the WhatsApp bot
   */
  public async destroy(): Promise<void> {
    try {
      logger.info('🛑 Destroying WhatsApp Bot...');
      
      await this.whatsappService.destroy();
      this.isInitialized = false;
      
      logger.info('✅ WhatsApp Bot destroyed successfully');
      
    } catch (error) {
      logger.error('❌ Error destroying WhatsApp Bot', error);
      throw new ServiceError(
        'Failed to destroy WhatsApp Bot',
        error instanceof Error ? error : undefined
      );
    }
  }

  /**
   * Get WhatsApp service instance
   */
  public getWhatsAppService(): WhatsAppService {
    return this.whatsappService;
  }

  /**
   * Get message service instance
   */
  public getMessageService(): MessageService {
    return this.messageService;
  }

  /**
   * Get media service instance
   */
  public getMediaService(): MediaService {
    return this.mediaService;
  }

  /**
   * Get event handler manager
   */
  public getEventHandlerManager(): EventHandlerManager {
    return this.eventHandlerManager;
  }

  /**
   * Check if bot is initialized
   */
  public getIsInitialized(): boolean {
    return this.isInitialized;
  }

  /**
   * Setup event handlers
   */
  private setupEventHandlers(): void {
    // QR Code handler
    const qrHandler = new QRCodeEventHandler((qr: string) => {
      logger.info('📱 QR Code received! Scan this with your WhatsApp mobile app:');
      qrcode.generate(qr, { small: true });
      logger.info('Alternatively, you can copy this QR code data:');
      logger.info(qr);
    });

    // Ready handler
    const readyHandler = new ReadyEventHandler();

    // Authentication handler
    const authHandler = new AuthEventHandler();

    // Connection handler
    const connectionHandler = new ConnectionEventHandler();

    // Message handler
    const messageHandler = new MessageEventHandler(
      async (message) => {
        await this.messageService.processMessage(message);
      }
    );

    // Message acknowledgment handler
    const messageAckHandler = new MessageAckEventHandler();

    // Register handlers
    this.eventHandlerManager.registerHandler('qr', qrHandler);
    this.eventHandlerManager.registerHandler('ready', readyHandler);
    this.eventHandlerManager.registerHandler('authenticated', authHandler);
    this.eventHandlerManager.registerHandler('auth_failure', authHandler);
    this.eventHandlerManager.registerHandler('disconnected', connectionHandler);
    this.eventHandlerManager.registerHandler('change_state', connectionHandler);
    this.eventHandlerManager.registerHandler('message', messageHandler);
    this.eventHandlerManager.registerHandler('message_ack', messageAckHandler);

    logger.info('Event handlers setup complete');
  }

  /**
   * Setup client event listeners
   */
  private setupClientEventListeners(): void {
    const client = this.whatsappService.getClient();

    // QR Code
    client.on('qr', (qr: string) => {
      this.eventHandlerManager.handleEvent('qr', qr);
    });

    // Ready
    client.on('ready', () => {
      this.eventHandlerManager.handleEvent('ready', null);
    });

    // Authentication
    client.on('authenticated', () => {
      this.eventHandlerManager.handleEvent('authenticated', null);
    });

    client.on('auth_failure', (msg: string) => {
      this.eventHandlerManager.handleEvent('auth_failure', msg);
    });

    // Connection
    client.on('disconnected', (reason: string) => {
      this.eventHandlerManager.handleEvent('disconnected', reason);
    });

    client.on('change_state', (state: string) => {
      this.eventHandlerManager.handleEvent('change_state', state);
    });

    // Messages
    client.on('message', (message) => {
      this.eventHandlerManager.handleEvent('message', message);
    });

    client.on('message_ack', (message, ack) => {
      this.eventHandlerManager.handleEvent('message_ack', { message, ack });
    });

    client.on('message_create', (message) => {
      if (message.fromMe) {
        logger.debug('📤 Message sent by bot', {
          to: message.to,
          body: message.body.substring(0, 50)
        });
      }
    });

    logger.info('Client event listeners setup complete');
  }

  /**
   * Setup process management
   */
  private setupProcessManagement(): void {
    ProcessManager.setupSignalHandlers();
    ProcessManager.registerShutdownHandler(async () => {
      await this.destroy();
    });

    // Setup process monitoring
    ProcessManager.setupProcessMonitoring();

    logger.info('Process management setup complete');
  }

  /**
   * Setup error handling
   */
  private setupErrorHandling(): void {
    ErrorHandler.setupGlobalErrorHandlers();
    logger.info('Error handling setup complete');
  }

  /**
   * Get bot status information
   */
  public getStatus(): {
    initialized: boolean;
    whatsappReady: boolean;
    uptime: string;
    memory: any;
    commands: number;
    eventTypes: string[];
  } {
    return {
      initialized: this.isInitialized,
      whatsappReady: this.whatsappService.getIsInitialized(),
      uptime: ProcessManager.getUptimeString(),
      memory: ProcessManager.getMemoryUsageString(),
      commands: this.messageService.getCommands().length,
      eventTypes: this.eventHandlerManager.getRegisteredEventTypes()
    };
  }

  /**
   * Register custom command
   */
  public registerCommand(command: any): void {
    this.messageService.registerCommand(command);
  }

  /**
   * Unregister command
   */
  public unregisterCommand(trigger: string): void {
    this.messageService.unregisterCommand(trigger);
  }
}
