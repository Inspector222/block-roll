import { Message } from 'whatsapp-web.js';
import { WhatsAppEvent, EventHandler, MessageContext } from '../types';
import { logger } from '../utils/logger';
import { MessageHelpers } from '../utils/helpers';

/**
 * Base event handler class
 */
export abstract class BaseEventHandler<T = any> implements EventHandler<T> {
  public abstract handle(event: WhatsAppEvent): Promise<void>;
}

/**
 * QR Code event handler
 */
export class QRCodeEventHandler extends BaseEventHandler<string> {
  private qrCodeCallback?: (qr: string) => void;

  constructor(qrCodeCallback?: (qr: string) => void) {
    super();
    this.qrCodeCallback = qrCodeCallback;
  }

  public async handle(event: WhatsAppEvent): Promise<void> {
    if (event.type === 'qr' && event.data) {
      logger.info('QR Code received - scan with WhatsApp mobile app');
      
      if (this.qrCodeCallback) {
        this.qrCodeCallback(event.data);
      }
    }
  }
}

/**
 * Ready event handler
 */
export class ReadyEventHandler extends BaseEventHandler {
  public async handle(event: WhatsAppEvent): Promise<void> {
    if (event.type === 'ready') {
      logger.info('WhatsApp client is ready');
      logger.info('📱 You can now send and receive messages');
    }
  }
}

/**
 * Authentication event handler
 */
export class AuthEventHandler extends BaseEventHandler {
  public async handle(event: WhatsAppEvent): Promise<void> {
    switch (event.type) {
      case 'authenticated':
        logger.info('WhatsApp client authenticated successfully');
        break;
      case 'auth_failure':
        logger.error('WhatsApp authentication failed', { message: event.data });
        break;
    }
  }
}

/**
 * Connection event handler
 */
export class ConnectionEventHandler extends BaseEventHandler {
  public async handle(event: WhatsAppEvent): Promise<void> {
    switch (event.type) {
      case 'disconnected':
        logger.warn('WhatsApp client disconnected', { reason: event.data });
        break;
      case 'change_state':
        logger.debug('WhatsApp client state changed', { state: event.data });
        break;
    }
  }
}

/**
 * Message event handler
 */
export class MessageEventHandler extends BaseEventHandler<Message> {
  private messageProcessor: (message: Message) => Promise<void>;

  constructor(messageProcessor: (message: Message) => Promise<void>) {
    super();
    this.messageProcessor = messageProcessor;
  }

  public async handle(event: WhatsAppEvent): Promise<void> {
    if (event.type === 'message' && event.data) {
      const message = event.data as Message;
      
      logger.debug('Message received', {
        from: message.from,
        type: message.type,
        body: MessageHelpers.sanitizeMessage(message.body)
      });

      try {
        await this.messageProcessor(message);
      } catch (error) {
        logger.error('Error processing message', {
          error: error instanceof Error ? error.message : String(error),
          messageId: message.id
        });
      }
    }
  }
}

/**
 * Message acknowledgment handler
 */
export class MessageAckEventHandler extends BaseEventHandler {
  public async handle(event: WhatsAppEvent): Promise<void> {
    if (event.type === 'message_ack') {
      const { message, ack } = event.data;
      
      logger.debug('Message acknowledgment received', {
        messageId: message.id,
        ack
      });
    }
  }
}

/**
 * Media upload handler
 */
export class MediaUploadEventHandler extends BaseEventHandler {
  public async handle(event: WhatsAppEvent): Promise<void> {
    if (event.type === 'media_uploaded') {
      const { message, media } = event.data;
      
      logger.info('Media uploaded successfully', {
        messageId: message.id,
        mediaType: media.mimetype
      });
    }
  }
}

/**
 * Group event handlers
 */
export class GroupEventHandler extends BaseEventHandler {
  public async handle(event: WhatsAppEvent): Promise<void> {
    switch (event.type) {
      case 'group_join':
        logger.info('User joined group', { data: event.data });
        break;
      case 'group_leave':
        logger.info('User left group', { data: event.data });
        break;
      case 'group_update':
        logger.info('Group updated', { data: event.data });
        break;
      case 'group_admin_changed':
        logger.info('Group admin changed', { data: event.data });
        break;
    }
  }
}

/**
 * Call event handler
 */
export class CallEventHandler extends BaseEventHandler {
  public async handle(event: WhatsAppEvent): Promise<void> {
    if (event.type === 'incoming_call') {
      logger.info('Incoming call received', { data: event.data });
    }
  }
}

/**
 * Battery change handler
 */
export class BatteryEventHandler extends BaseEventHandler {
  public async handle(event: WhatsAppEvent): Promise<void> {
    if (event.type === 'battery_changed') {
      logger.debug('Battery level changed', { battery: event.data });
    }
  }
}

/**
 * Event handler manager
 */
export class EventHandlerManager {
  private handlers: Map<string, EventHandler[]> = new Map();

  /**
   * Register event handler
   */
  public registerHandler(eventType: string, handler: EventHandler): void {
    if (!this.handlers.has(eventType)) {
      this.handlers.set(eventType, []);
    }
    
    this.handlers.get(eventType)!.push(handler);
    
    logger.debug('Registered event handler', { eventType });
  }

  /**
   * Unregister event handler
   */
  public unregisterHandler(eventType: string, handler: EventHandler): void {
    const handlers = this.handlers.get(eventType);
    if (handlers) {
      const index = handlers.indexOf(handler);
      if (index > -1) {
        handlers.splice(index, 1);
        logger.debug('Unregistered event handler', { eventType });
      }
    }
  }

  /**
   * Handle event
   */
  public async handleEvent(eventType: string, data: any): Promise<void> {
    const handlers = this.handlers.get(eventType);
    
    if (handlers && handlers.length > 0) {
      const event: WhatsAppEvent = {
        type: eventType,
        data,
        timestamp: new Date()
      };

      // Execute all handlers for this event type
      await Promise.all(
        handlers.map(handler => 
          handler.handle(event).catch(error => {
            logger.error('Error in event handler', {
              eventType,
              error: error instanceof Error ? error.message : String(error)
            });
          })
        )
      );
    }
  }

  /**
   * Get all registered event types
   */
  public getRegisteredEventTypes(): string[] {
    return Array.from(this.handlers.keys());
  }

  /**
   * Get handlers for specific event type
   */
  public getHandlers(eventType: string): EventHandler[] {
    return this.handlers.get(eventType) || [];
  }

  /**
   * Clear all handlers
   */
  public clearHandlers(): void {
    this.handlers.clear();
    logger.info('Cleared all event handlers');
  }
}
