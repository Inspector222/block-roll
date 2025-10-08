import { existsSync, mkdirSync, appendFileSync } from 'fs';
import { join } from 'path';
import { ILogger } from '../types';

/**
 * Log levels enum
 */
export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3
}

/**
 * Professional logger implementation with console and file output
 */
export class Logger implements ILogger {
  private static instance: Logger;
  private logLevel: LogLevel;
  private enableConsole: boolean;
  private enableFile: boolean;
  private filePath?: string;

  private constructor() {
    this.logLevel = LogLevel.INFO;
    this.enableConsole = true;
    this.enableFile = false;
  }

  /**
   * Get singleton instance
   */
  public static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  /**
   * Configure logger
   */
  public configure(options: {
    level: string;
    enableConsole: boolean;
    enableFile: boolean;
    filePath?: string;
  }): void {
    this.logLevel = this.parseLogLevel(options.level);
    this.enableConsole = options.enableConsole;
    this.enableFile = options.enableFile;
    this.filePath = options.filePath;

    if (this.enableFile && this.filePath) {
      this.ensureLogDirectory();
    }
  }

  /**
   * Log debug message
   */
  public debug(message: string, meta?: any): void {
    this.log(LogLevel.DEBUG, message, meta);
  }

  /**
   * Log info message
   */
  public info(message: string, meta?: any): void {
    this.log(LogLevel.INFO, message, meta);
  }

  /**
   * Log warning message
   */
  public warn(message: string, meta?: any): void {
    this.log(LogLevel.WARN, message, meta);
  }

  /**
   * Log error message
   */
  public error(message: string, meta?: any): void {
    this.log(LogLevel.ERROR, message, meta);
  }

  /**
   * Internal log method
   */
  private log(level: LogLevel, message: string, meta?: any): void {
    if (level < this.logLevel) {
      return;
    }

    const timestamp = new Date().toISOString();
    const levelName = LogLevel[level];
    const formattedMessage = this.formatMessage(timestamp, levelName, message, meta);

    if (this.enableConsole) {
      this.logToConsole(level, formattedMessage);
    }

    if (this.enableFile && this.filePath) {
      this.logToFile(formattedMessage);
    }
  }

  /**
   * Format log message
   */
  private formatMessage(timestamp: string, level: string, message: string, meta?: any): string {
    let formatted = `[${timestamp}] ${level.toUpperCase()}: ${message}`;
    
    if (meta) {
      formatted += ` ${JSON.stringify(meta)}`;
    }
    
    return formatted;
  }

  /**
   * Log to console with colors
   */
  private logToConsole(level: LogLevel, message: string): void {
    const colors = {
      [LogLevel.DEBUG]: '\x1b[36m', // Cyan
      [LogLevel.INFO]: '\x1b[32m',  // Green
      [LogLevel.WARN]: '\x1b[33m',  // Yellow
      [LogLevel.ERROR]: '\x1b[31m'  // Red
    };

    const resetColor = '\x1b[0m';
    const color = colors[level] || '';
    
    console.log(`${color}${message}${resetColor}`);
  }

  /**
   * Log to file
   */
  private logToFile(message: string): void {
    try {
      if (this.filePath) {
        appendFileSync(this.filePath, message + '\n');
      }
    } catch (error) {
      console.error('Failed to write to log file:', error);
    }
  }

  /**
   * Parse log level from string
   */
  private parseLogLevel(level: string): LogLevel {
    switch (level.toLowerCase()) {
      case 'debug': return LogLevel.DEBUG;
      case 'info': return LogLevel.INFO;
      case 'warn': return LogLevel.WARN;
      case 'error': return LogLevel.ERROR;
      default: return LogLevel.INFO;
    }
  }

  /**
   * Ensure log directory exists
   */
  private ensureLogDirectory(): void {
    if (this.filePath) {
      const logDir = join(this.filePath, '..');
      if (!existsSync(logDir)) {
        mkdirSync(logDir, { recursive: true });
      }
    }
  }
}

// Export singleton instance
export const logger = Logger.getInstance();
