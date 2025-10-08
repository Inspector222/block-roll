import { BotCommand } from '../types';
import { 
  generateBlockSendResponse, 
  parseBlockSendMessage, 
  blockSendSupport 
} from '../ai';

/**
 * Custom command definitions
 * Add your custom commands here for better organization
 */
export const customCommands: BotCommand[] = [
  {
    trigger: 'weather',
    description: 'Get weather information for a location',
    handler: async (message, args) => {
      const location = args?.join(' ') || '';
      if (!location) {
        await message.reply('❌ Please provide a location. Usage: !weather <location>');
        return;
      }
      
      // Mock weather response - replace with actual API call
      await message.reply(`🌤️ Weather for ${location}: Sunny, 25°C, Light winds`);
    }
  },
  
  {
    trigger: 'joke',
    description: 'Get a random joke',
    handler: async (message, args) => {
      const jokes = [
        'Why don\'t scientists trust atoms? Because they make up everything! 😄',
        'Why did the scarecrow win an award? Because he was outstanding in his field! 🌾',
        'What do you call a fake noodle? An impasta! 🍝',
        'Why don\'t eggs tell jokes? They\'d crack each other up! 🥚'
      ];
      
      const randomJoke = jokes[Math.floor(Math.random() * jokes.length)];
      await message.reply(randomJoke);
    }
  },
  
  {
    trigger: 'echo',
    description: 'Echo back your message',
    handler: async (message, args) => {
      const text = args?.join(' ') || '';
      if (!text) {
        await message.reply('❌ Please provide text to echo. Usage: !echo <text>');
        return;
      }
      
      await message.reply(`📢 Echo: ${text}`);
    }
  },
  
  {
    trigger: 'admin',
    description: 'Admin-only command for testing',
    adminOnly: true,
    groupAllowed: false,
    handler: async (message, args) => {
      await message.reply('🔐 This is an admin-only command!');
    }
  },
  
  {
    trigger: 'send',
    description: 'Send money globally with BlockSend',
    handler: async (message, args) => {
      const userMessage = args?.join(' ') || 'send money';
      const response = await generateBlockSendResponse(userMessage, {
        userPhone: message.from,
        isGroup: message.from.includes('@g.us'),
        isAdmin: false
      });
      await message.reply(response);
    }
  },
  
  {
    trigger: 'balance',
    description: 'Check your BlockSend wallet balance',
    handler: async (message, args) => {
      const response = await generateBlockSendResponse('check balance', {
        userPhone: message.from,
        isGroup: message.from.includes('@g.us'),
        isAdmin: false
      });
      await message.reply(response);
    }
  },
  
  {
    trigger: 'wallet',
    description: 'Create or manage your BlockSend wallet',
    handler: async (message, args) => {
      const response = await generateBlockSendResponse('create wallet', {
        userPhone: message.from,
        isGroup: message.from.includes('@g.us'),
        isAdmin: false
      });
      await message.reply(response);
    }
  },
  
  {
    trigger: 'support',
    description: 'Get BlockSend customer support',
    handler: async (message, args) => {
      const userQuestion = args?.join(' ') || 'I need help';
      const response = await blockSendSupport.handleSupport({
        userQuestion,
        userType: 'customer',
        userPhone: message.from,
        urgency: 'low'
      });
      await message.reply(response);
    }
  },
  
  {
    trigger: 'ai',
    description: 'Ask BlockSend AI assistant anything',
    handler: async (message, args) => {
      const userMessage = args?.join(' ') || 'help';
      const response = await generateBlockSendResponse(userMessage, {
        userPhone: message.from,
        isGroup: message.from.includes('@g.us'),
        isAdmin: false
      });
      await message.reply(response);
    }
  }
];

/**
 * Register all custom commands
 * Call this function after initializing the bot
 */
export function registerCustomCommands(messageService: any): void {
  customCommands.forEach(command => {
    messageService.registerCommand(command);
  });
}
