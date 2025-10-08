import { Message, Chat, Contact } from 'whatsapp-web.js';
import { MessageContext } from '../types';

/**
 * Utility functions for WhatsApp message processing
 */
export class MessageHelpers {
  /**
   * Extract command and arguments from message body
   */
  public static parseCommand(messageBody: string): { command: string; args: string[] } {
    const parts = messageBody.trim().split(/\s+/);
    const command = parts[0]?.toLowerCase() || '';
    const args = parts.slice(1);
    
    return { command, args };
  }

  /**
   * Check if message is a command (starts with !)
   */
  public static isCommand(messageBody: string): boolean {
    return messageBody.trim().startsWith('!');
  }

  /**
   * Remove command prefix from message
   */
  public static removeCommandPrefix(messageBody: string): string {
    return messageBody.replace(/^!/, '').trim();
  }

  /**
   * Check if contact is admin
   */
  public static isAdmin(contact: Contact, adminNumbers: string[]): boolean {
    return adminNumbers.includes(contact.number);
  }

  /**
   * Check if message is from group
   */
  public static isGroupMessage(message: Message): boolean {
    return message.from.includes('@g.us');
  }

  /**
   * Format phone number
   */
  public static formatPhoneNumber(number: string): string {
    // Remove all non-digit characters
    const digits = number.replace(/\D/g, '');
    
    // Add country code if not present
    if (digits.length === 10) {
      return `1${digits}`;
    }
    
    return digits;
  }

  /**
   * Generate message context
   */
  public static async createMessageContext(
    message: Message,
    adminNumbers: string[]
  ): Promise<MessageContext> {
    const chat = await message.getChat();
    const contact = await message.getContact();
    const isGroup = this.isGroupMessage(message);
    const isAdmin = this.isAdmin(contact, adminNumbers);
    
    const { command, args } = this.parseCommand(message.body);
    
    return {
      message,
      chat,
      contact,
      isGroup,
      isAdmin,
      args
    };
  }

  /**
   * Sanitize message content for logging
   */
  public static sanitizeMessage(messageBody: string, maxLength: number = 100): string {
    let sanitized = messageBody.replace(/[\r\n\t]/g, ' ').trim();
    
    if (sanitized.length > maxLength) {
      sanitized = sanitized.substring(0, maxLength) + '...';
    }
    
    return sanitized;
  }

  /**
   * Check if message contains media
   */
  public static hasMedia(message: Message): boolean {
    return message.hasMedia;
  }

  /**
   * Get message type description
   */
  public static getMessageTypeDescription(message: Message): string {
    switch (message.type as any) {
      case 'text': return 'Text';
      case 'image': return 'Image';
      case 'video': return 'Video';
      case 'audio': return 'Audio';
      case 'document': return 'Document';
      case 'sticker': return 'Sticker';
      case 'location': return 'Location';
      case 'contact': return 'Contact';
      case 'poll': return 'Poll';
      default: return 'Unknown';
    }
  }
}

/**
 * Time utility functions
 */
export class TimeHelpers {
  /**
   * Format timestamp to readable string
   */
  public static formatTimestamp(timestamp: number): string {
    return new Date(timestamp * 1000).toLocaleString();
  }

  /**
   * Get relative time (e.g., "2 minutes ago")
   */
  public static getRelativeTime(timestamp: number): string {
    const now = Date.now();
    const messageTime = timestamp * 1000;
    const diff = now - messageTime;
    
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    
    if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
    if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    return 'Just now';
  }

  /**
   * Sleep for specified milliseconds
   */
  public static sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

/**
 * String utility functions
 */
export class StringHelpers {
  /**
   * Capitalize first letter of string
   */
  public static capitalize(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  }

  /**
   * Truncate string to specified length
   */
  public static truncate(str: string, length: number, suffix: string = '...'): string {
    if (str.length <= length) return str;
    return str.substring(0, length - suffix.length) + suffix;
  }

  /**
   * Check if string is empty or whitespace
   */
  public static isEmpty(str: string): boolean {
    return !str || str.trim().length === 0;
  }

  /**
   * Remove emojis from string
   */
  public static removeEmojis(str: string): string {
    return str.replace(/[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/gu, '');
  }

  /**
   * Generate random string
   */
  public static generateRandomString(length: number): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }
}

/**
 * Validation utility functions
 */
export class ValidationHelpers {
  /**
   * Validate phone number format
   */
  public static isValidPhoneNumber(phoneNumber: string): boolean {
    const phoneRegex = /^\+?[1-9]\d{1,14}$/;
    return phoneRegex.test(phoneNumber.replace(/\D/g, ''));
  }

  /**
   * Validate email format
   */
  public static isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Validate URL format
   */
  public static isValidUrl(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Check if string contains only numbers
   */
  public static isNumeric(str: string): boolean {
    return /^\d+$/.test(str);
  }
}
