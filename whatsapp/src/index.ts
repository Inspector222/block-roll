#!/usr/bin/env node

/**
 * WhatsApp Bot - Main Entry Point
 * 
 * This is the main entry point for the WhatsApp Bot application.
 * It initializes and starts the bot with proper error handling and lifecycle management.
 */

// Load environment variables
import 'dotenv/config';

import { WhatsAppBot } from './app/WhatsAppBot';
import { configManager } from './config';
import { ErrorHandler } from './middleware/ErrorHandler';
import { ProcessManager } from './middleware/ProcessManager';
import { logger } from './utils/logger';

/**
 * Main application class
 */
class WhatsAppBotApp {
  private bot: WhatsAppBot;

  constructor() {
    this.bot = new WhatsAppBot();
  }

  /**
   * Start the application
   */
  public async start(): Promise<void> {
    try {
      logger.info('🚀 Starting WhatsApp Bot Application...');

      // Load configuration
      const config = configManager.loadConfig();

      // Initialize bot
      await this.bot.initialize();

      // Display startup information
      this.displayStartupInfo();

      // Keep the process alive
      this.keepAlive();

    } catch (error) {
      logger.error('❌ Failed to start WhatsApp Bot Application', error);
      ErrorHandler.handleError(error, 'Application startup');
      process.exit(1);
    }
  }

  /**
   * Display startup information
   */
  private displayStartupInfo(): void {
    const status = this.bot.getStatus();
    
    logger.info('🎉 WhatsApp Bot is running!');
    logger.info('📊 Status Information:', {
      initialized: status.initialized,
      whatsappReady: status.whatsappReady,
      uptime: status.uptime,
      commands: status.commands,
      eventTypes: status.eventTypes.length
    });

    logger.info('🤖 Available Commands:');
    this.bot.getMessageService().getCommands().forEach(command => {
      const triggers = Array.isArray(command.trigger) ? command.trigger : [command.trigger];
      logger.info(`  • ${triggers.join(', ')} - ${command.description}`);
    });
  }

  /**
   * Keep the process alive
   */
  private keepAlive(): void {
    // The process will stay alive as long as the WhatsApp client is running
    // Event handlers will keep the event loop active
    
    // Optional: Add periodic status logging
    setInterval(() => {
      if (!ProcessManager.getIsShuttingDown()) {
        logger.debug('Bot is running', {
          uptime: ProcessManager.getUptimeString(),
          memory: ProcessManager.getMemoryUsageString()
        });
      }
    }, 300000); // Every 5 minutes
  }

  /**
   * Get bot instance
   */
  public getBot(): WhatsAppBot {
    return this.bot;
  }
}

/**
 * Application entry point
 */
async function main(): Promise<void> {
  const app = new WhatsAppBotApp();
  
  try {
    await app.start();
  } catch (error) {
    logger.error('Fatal error in main function', error);
    process.exit(1);
  }
}

// Handle uncaught exceptions and unhandled rejections
process.on('uncaughtException', (error: Error) => {
  logger.error('Uncaught Exception in main process', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason: unknown, promise: Promise<unknown>) => {
  logger.error('Unhandled Promise Rejection in main process', {
    reason: reason instanceof Error ? reason.message : String(reason),
    promise: promise.toString()
  });
  process.exit(1);
});

// Start the application
if (require.main === module) {
  main().catch((error) => {
    logger.error('Failed to start application', error);
    process.exit(1);
  });
}

// Export for potential use in other modules
export { WhatsAppBotApp };
export default WhatsAppBotApp;