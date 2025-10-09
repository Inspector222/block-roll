import { MessageMedia } from 'whatsapp-web.js';
import { BotCommand } from '../types';
import { logger } from '../utils/logger';

/**
 * Media-related commands for BlockRoll WhatsApp Bot
 */
export const mediaCommands: BotCommand[] = [
  {
    trigger: 'media-help',
    description: 'Show media handling capabilities',
    groupAllowed: true,
    handler: async (message, args) => {
      const helpText = `📎 **BlockRoll Media Handling**

**Send Media:**
• !send-image - Send a sample image
• !send-doc - Send a document
• !send-from-url <url> - Send image from URL

**Receive Media:**
• Send any image/video/document
• Bot will detect and process it
• Supported: Images, Videos, Audio, PDFs, Docs

**Media Info:**
• Just send media to get info
• Bot shows: Type, Size, Filename

**Supported Formats:**
📸 Images: JPEG, PNG, GIF, WebP
🎥 Videos: MP4, AVI, MOV
🎵 Audio: MP3, WAV, OGG
📄 Docs: PDF, TXT, Word

**Max File Size:** 100 MB

Try sending an image now! 📷`;

      await message.reply(helpText);
    }
  },

  {
    trigger: 'send-image',
    description: 'Send a sample image',
    groupAllowed: true,
    handler: async (message, args) => {
      try {
        await message.reply('📤 Sending sample image from URL...');

        // Send image from URL with caption
        const media = await MessageMedia.fromUrl(
          'https://via.placeholder.com/600x400/0066cc/ffffff?text=BlockRoll+Sample+Image'
        );

        await message.reply(media, undefined, {
          caption: '🎨 **BlockRoll Sample Image**\n\nThis is how you can send images via the bot!\n\n✅ Sent from: URL\n📏 Size: 600x400px'
        });

        logger.info('Sample image sent successfully', { to: message.from });
      } catch (error) {
        logger.error('Error sending sample image', error);
        await message.reply('❌ Failed to send image. Please try again.');
      }
    }
  },

  {
    trigger: 'send-doc',
    description: 'Send a sample document',
    groupAllowed: true,
    handler: async (message, args) => {
      try {
        await message.reply('📤 Sending sample document...');

        // Create a text document
        const docContent = `
BlockRoll - Secure Data Exchange Platform

This is a sample document sent via WhatsApp Bot!

Features:
✅ Non-custodial data storage
✅ End-to-end encryption
✅ File sharing by wallet address
✅ Emergency Access mode
✅ Team Workspaces
✅ AI-powered security

Visit: blockroll.io
        `.trim();

        const base64Doc = Buffer.from(docContent).toString('base64');
        const media = new MessageMedia(
          'text/plain',
          base64Doc,
          'blockroll-info.txt'
        );

        await message.reply(media, undefined, {
          caption: '📄 **BlockRoll Information Document**\n\nA sample text file from the bot!'
        });

        logger.info('Sample document sent successfully', { to: message.from });
      } catch (error) {
        logger.error('Error sending sample document', error);
        await message.reply('❌ Failed to send document. Please try again.');
      }
    }
  },

  {
    trigger: 'send-from-url',
    description: 'Send image from a URL',
    groupAllowed: true,
    handler: async (message, args) => {
      const url = args?.join(' ') || '';

      if (!url) {
        await message.reply(
          '❌ Please provide a URL!\n\n' +
          'Usage: !send-from-url <image-url>\n\n' +
          'Example:\n!send-from-url https://example.com/image.png'
        );
        return;
      }

      // Validate URL format
      if (!url.startsWith('http://') && !url.startsWith('https://')) {
        await message.reply('❌ Invalid URL. Must start with http:// or https://');
        return;
      }

      try {
        await message.reply(`📥 Downloading image from URL...\n${url}`);

        const media = await MessageMedia.fromUrl(url);

        await message.reply(media, undefined, {
          caption: `✅ **Image from URL**\n\nSource: ${url}`
        });

        logger.info('Image sent from URL', { url, to: message.from });
      } catch (error) {
        logger.error('Error sending image from URL', { error, url });
        await message.reply(
          '❌ Failed to download/send image from URL.\n\n' +
          'Possible reasons:\n' +
          '• Invalid image URL\n' +
          '• Image too large\n' +
          '• Network error\n' +
          '• Unsupported format'
        );
      }
    }
  },

  {
    trigger: 'media-formats',
    description: 'Show supported media formats',
    groupAllowed: true,
    handler: async (message, args) => {
      const formatsText = `📋 **Supported Media Formats**

**Images:**
• JPEG (.jpg, .jpeg)
• PNG (.png)
• GIF (.gif)
• WebP (.webp)

**Videos:**
• MP4 (.mp4)
• AVI (.avi)
• MOV (.mov)

**Audio:**
• MP3 (.mp3)
• WAV (.wav)
• OGG (.ogg)

**Documents:**
• PDF (.pdf)
• Text (.txt)
• Word (.doc, .docx)

**Limits:**
• Max file size: 100 MB
• Max dimensions: No limit
• Max duration: No limit (videos/audio)

**How to Send:**
1. Just attach the file
2. Add caption (optional)
3. Send!

Bot will automatically:
✅ Detect media type
✅ Validate file
✅ Process and respond
✅ Show file info`;

      await message.reply(formatsText);
    }
  }
];

/**
 * Register media commands
 */
export function registerMediaCommands(messageService: any): void {
  mediaCommands.forEach(command => {
    messageService.registerCommand(command);
  });
  logger.info(`✅ Registered ${mediaCommands.length} media commands`);
}

