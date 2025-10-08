import { Message, Contact, Chat, MessageMedia } from 'whatsapp-web.js';

// Core WhatsApp types
export interface WhatsAppClient {
  initialize(): Promise<void>;
  destroy(): Promise<void>;
  getState(): Promise<string>;
  on(event: string, callback: (...args: any[]) => void): void;
  sendMessage(to: string, content: string): Promise<Message>;
}

// Configuration types
export interface WhatsAppConfig {
  authStrategy: {
    dataPath: string;
  };
  puppeteer: {
    headless: boolean;
    args: string[];
  };
}

export interface AppConfig {
  whatsapp: WhatsAppConfig;
  logging: {
    level: 'debug' | 'info' | 'warn' | 'error';
    enableConsole: boolean;
    enableFile: boolean;
    filePath?: string;
  };
  bot: {
    commands: BotCommand[];
    autoReply: boolean;
    adminNumbers: string[];
  };
}

// Bot command types
export interface BotCommand {
  trigger: string | string[];
  handler: (message: Message, args?: string[]) => Promise<void>;
  description: string;
  adminOnly?: boolean;
  groupAllowed?: boolean;
}

// Message processing types
export interface MessageContext {
  message: Message;
  chat: Chat;
  contact: Contact;
  isGroup: boolean;
  isAdmin: boolean;
  args: string[];
}

export interface MessageProcessor {
  canHandle(message: Message): boolean;
  handle(context: MessageContext): Promise<void>;
}

// Service types
export interface IWhatsAppService {
  initialize(): Promise<void>;
  destroy(): Promise<void>;
  sendMessage(to: string, content: string): Promise<Message>;
  sendMedia(to: string, media: MessageMedia): Promise<Message>;
  getChatInfo(chatId: string): Promise<Chat>;
  getContactInfo(contactId: string): Promise<Contact>;
}

export interface IMessageService {
  processMessage(message: Message): Promise<void>;
  registerCommand(command: BotCommand): void;
  unregisterCommand(trigger: string): void;
}

export interface IMediaService {
  downloadMedia(message: Message): Promise<MessageMedia | null>;
  validateMedia(media: MessageMedia): boolean;
  getMediaInfo(media: MessageMedia): MediaInfo;
}

// Media types
export interface MediaInfo {
  type: string;
  size: number;
  filename?: string;
  mimetype: string;
}

// Event types
export interface WhatsAppEvent {
  type: string;
  data: any;
  timestamp: Date;
}

export interface EventHandler<T = any> {
  handle(event: WhatsAppEvent): Promise<void>;
}

// Logger types
export interface ILogger {
  debug(message: string, meta?: any): void;
  info(message: string, meta?: any): void;
  warn(message: string, meta?: any): void;
  error(message: string, meta?: any): void;
}

// Error types
export class WhatsAppError extends Error {
  constructor(
    message: string,
    public code: string,
    public originalError?: Error
  ) {
    super(message);
    this.name = 'WhatsAppError';
  }
}

export class ConfigurationError extends WhatsAppError {
  constructor(message: string, originalError?: Error) {
    super(message, 'CONFIG_ERROR', originalError);
    this.name = 'ConfigurationError';
  }
}

export class ServiceError extends WhatsAppError {
  constructor(message: string, originalError?: Error) {
    super(message, 'SERVICE_ERROR', originalError);
    this.name = 'ServiceError';
  }
}

// Utility types
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>;

export type OptionalFields<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
