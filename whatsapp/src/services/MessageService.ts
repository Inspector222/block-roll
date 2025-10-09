import { Message } from 'whatsapp-web.js';
import { IMessageService, BotCommand, MessageContext, ServiceError } from '../types';
import { logger } from '../utils/logger';
import { MessageHelpers } from '../utils/helpers';

/**
 * Message service implementation
 * Handles message processing and command routing
 */
export class MessageService implements IMessageService {
  private commands: Map<string, BotCommand> = new Map();
  private messageProcessors: Array<{ processor: any; priority: number }> = [];

  constructor(private adminNumbers: string[]) {
    this.registerDefaultCommands();
  }

  /**
   * Process incoming message
   */
  public async processMessage(message: Message): Promise<void> {
    try {
      const context = await MessageHelpers.createMessageContext(message, this.adminNumbers);
      
      logger.debug('Processing message', {
        from: message.from,
        type: message.type,
        body: MessageHelpers.sanitizeMessage(message.body)
      });

      // Try custom processors first
      for (const { processor } of this.messageProcessors.sort((a, b) => b.priority - a.priority)) {
        if (processor.canHandle && await processor.canHandle(message)) {
          await processor.handle(context);
          return;
        }
      }

      // Process commands if message is a command
      if (MessageHelpers.isCommand(message.body)) {
        await this.processCommand(context);
        return;
      }

      // Handle regular messages
      await this.handleRegularMessage(context);

    } catch (error) {
      logger.error('Error processing message', {
        error: error instanceof Error ? error.message : String(error),
        messageId: message.id,
        from: message.from
      });
    }
  }

  /**
   * Register bot command
   */
  public registerCommand(command: BotCommand): void {
    const triggers = Array.isArray(command.trigger) ? command.trigger : [command.trigger];
    
    triggers.forEach(trigger => {
      const normalizedTrigger = trigger.toLowerCase();
      this.commands.set(normalizedTrigger, command);
      
      logger.info(`Registered command: ${normalizedTrigger}`, {
        description: command.description,
        adminOnly: command.adminOnly
      });
    });
  }

  /**
   * Unregister bot command
   */
  public unregisterCommand(trigger: string): void {
    const normalizedTrigger = trigger.toLowerCase();
    const removed = this.commands.delete(normalizedTrigger);
    
    if (removed) {
      logger.info(`Unregistered command: ${normalizedTrigger}`);
    }
  }

  /**
   * Register message processor
   */
  public registerMessageProcessor(processor: any, priority: number = 0): void {
    this.messageProcessors.push({ processor, priority });
    this.messageProcessors.sort((a, b) => b.priority - a.priority);
    
    logger.info('Registered message processor', { priority });
  }

  /**
   * Get all registered commands
   */
  public getCommands(): BotCommand[] {
    return Array.from(this.commands.values());
  }

  /**
   * Process command message
   */
  private async processCommand(context: MessageContext): Promise<void> {
    const { command } = MessageHelpers.parseCommand(
      MessageHelpers.removeCommandPrefix(context.message.body)
    );

    const botCommand = this.commands.get(command);
    
    if (!botCommand) {
      await context.message.reply(`❌ Unknown command: ${command}`);
      return;
    }

    // Check admin-only commands
    if (botCommand.adminOnly && !context.isAdmin) {
      await context.message.reply('❌ This command is only available to administrators');
      return;
    }

    // Check group restrictions
    if (!botCommand.groupAllowed && context.isGroup) {
      await context.message.reply('❌ This command cannot be used in groups');
      return;
    }

    try {
      logger.info(`Executing command: ${command}`, {
        from: context.contact.number,
        isAdmin: context.isAdmin,
        isGroup: context.isGroup
      });

      await botCommand.handler(context.message, context.args);
      
    } catch (error) {
      logger.error(`Error executing command: ${command}`, error);
      await context.message.reply(`❌ Error executing command: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Handle regular (non-command) messages
   */
  private async handleRegularMessage(context: MessageContext): Promise<void> {
    // Check if message has media
    if (context.message.hasMedia) {
      await this.handleMediaMessage(context);
      return;
    }

    // Handle auto-replies for specific keywords
    const messageBody = context.message.body.toLowerCase();
    
    if (messageBody.includes('ping')) {
      await context.message.reply('🏓 Pong!');
    } else if (messageBody.includes('hello') || messageBody.includes('hi')) {
      await context.message.reply('👋 Hello! How can I help you today?');
    } else if (messageBody.includes('help')) {
      await this.sendHelpMessage(context);
    } else if (messageBody.includes('time')) {
      const currentTime = new Date().toLocaleString();
      await context.message.reply(`🕐 Current time: ${currentTime}`);
    }
  }

  /**
   * Handle messages with media attachments
   */
  private async handleMediaMessage(context: MessageContext): Promise<void> {
    try {
      logger.info('Processing media message', {
        from: context.contact.number,
        type: context.message.type
      });

      // Send acknowledgment
      await context.message.reply('📥 Downloading media...');

      // Download media (this is imported from services but we need to use it)
      const media = await context.message.downloadMedia();

      if (!media) {
        await context.message.reply(
          '❌ Failed to download media.\n\n' +
          'Possible reasons:\n' +
          '• Media was deleted\n' +
          '• Media too large\n' +
          '• Network error\n\n' +
          'Please try sending again.'
        );
        return;
      }

      // Get media info
      const fileSize = media.filesize || this.estimateBase64Size(media.data);
      const fileSizeFormatted = this.formatFileSize(fileSize);
      const mediaType = this.getMediaCategory(media.mimetype);

      // Build response
      let response = `✅ **Media Received!**\n\n`;
      response += `📋 **Info:**\n`;
      response += `• Type: ${mediaType}\n`;
      response += `• Format: ${media.mimetype}\n`;
      response += `• Size: ${fileSizeFormatted}\n`;
      
      if (media.filename) {
        response += `• Filename: ${media.filename}\n`;
      }

      response += `\n💡 **What I can do:**\n`;
      response += `• Process images\n`;
      response += `• Extract text from documents\n`;
      response += `• Analyze media content\n\n`;
      response += `Type !media-help for more options!`;

      await context.message.reply(response);

      logger.info('Media processed successfully', {
        type: mediaType,
        size: fileSizeFormatted,
        from: context.contact.number
      });

    } catch (error) {
      logger.error('Error handling media message', error);
      await context.message.reply(
        '❌ Error processing media. Please try again or contact support.'
      );
    }
  }

  /**
   * Get media category from mimetype
   */
  private getMediaCategory(mimetype: string): string {
    if (mimetype.startsWith('image/')) return '📸 Image';
    if (mimetype.startsWith('video/')) return '🎥 Video';
    if (mimetype.startsWith('audio/')) return '🎵 Audio';
    if (mimetype.startsWith('application/pdf')) return '📄 PDF Document';
    if (mimetype.startsWith('application/')) return '📎 Document';
    if (mimetype.startsWith('text/')) return '📝 Text File';
    return '❓ Unknown';
  }

  /**
   * Format file size for display
   */
  private formatFileSize(bytes: number): string {
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
   * Estimate base64 data size in bytes
   */
  private estimateBase64Size(base64Data: string): number {
    const padding = (base64Data.match(/=/g) || []).length;
    const dataLength = base64Data.length - padding;
    return Math.floor((dataLength * 3) / 4);
  }

  /**
   * Send help message
   */
  private async sendHelpMessage(context: MessageContext): Promise<void> {
    const availableCommands = this.getCommands()
      .filter(cmd => {
        if (cmd.adminOnly && !context.isAdmin) return false;
        if (!cmd.groupAllowed && context.isGroup) return false;
        return true;
      })
      .map(cmd => {
        const triggers = Array.isArray(cmd.trigger) ? cmd.trigger : [cmd.trigger];
        return `• *${triggers.join(', ')}* - ${cmd.description}`;
      })
      .join('\n');

    const helpText = `
🤖 *WhatsApp Bot Help*

Available commands:
${availableCommands}

Send any message to interact with the bot!
    `;

    await context.message.reply(helpText);
  }

  /**
   * Register default commands
   */
  private registerDefaultCommands(): void {
    // Info command
    this.registerCommand({
      trigger: 'info',
      description: 'Get chat and contact information',
      groupAllowed: true,
      handler: async (message, args) => {
        const chat = await message.getChat();
        const contact = await message.getContact();
        
        const info = `
📋 *Chat Information*

• *Chat ID:* ${chat.id._serialized}
• *Contact Name:* ${contact.name || contact.pushname || 'Unknown'}
• *Contact Number:* ${contact.number || 'Unknown'}
• *Message Type:* ${message.type}
• *Is Group:* ${chat.isGroup ? 'Yes' : 'No'}
• *Timestamp:* ${new Date(message.timestamp * 1000).toLocaleString()}
        `;
        
        await message.reply(info);
      }
    });

    // Commands command
    this.registerCommand({
      trigger: 'commands',
      description: 'List all available commands',
      groupAllowed: true,
      handler: async (message, args) => {
        const commands = this.getCommands()
          .map(cmd => {
            const triggers = Array.isArray(cmd.trigger) ? cmd.trigger : [cmd.trigger];
            return `• *${triggers.join(', ')}* - ${cmd.description}`;
          })
          .join('\n');

        const commandsText = `
🤖 *Available Commands*

${commands}
        `;

        await message.reply(commandsText);
      }
    });

    // Status command (admin only)
    this.registerCommand({
      trigger: 'status',
      description: 'Get bot status information',
      adminOnly: true,
      groupAllowed: false,
      handler: async (message, args) => {
        const uptime = process.uptime();
        const memoryUsage = process.memoryUsage();
        
        const statusText = `
📊 *Bot Status*

• *Uptime:* ${Math.floor(uptime / 3600)}h ${Math.floor((uptime % 3600) / 60)}m
• *Memory Usage:* ${Math.round(memoryUsage.heapUsed / 1024 / 1024)}MB
• *Node Version:* ${process.version}
• *Platform:* ${process.platform}
        `;

        await message.reply(statusText);
      }
    });
  }
}
