import { BotCommand } from '../types';
import blockRollAISupport from '../ai/blockroll-support';
import { getCategories } from '../knowledge/blockroll-faq';

/**
 * BlockRoll custom command definitions
 * All commands specific to BlockRoll platform
 */
export const customCommands: BotCommand[] = [
  {
    trigger: 'ask',
    description: 'Ask BlockRoll AI anything about the platform',
    handler: async (message, args) => {
      const question = args?.join(' ') || '';
      
      if (!question) {
        await message.reply('Please ask a question!\n\nExample:\n!ask How do I upload a file?');
        return;
      }

      await message.reply('🤔 Let me think...');
      
      const response = await blockRollAISupport.getResponse(
        message.from,
        question
      );

      await message.reply(`🤖 **BlockRoll AI**\n\n${response}`);
    }
  },
  
  {
    trigger: 'help',
    description: 'Get help and available topics',
    handler: async (message, args) => {
      const helpMessage = blockRollAISupport.getQuickHelp();
      await message.reply(helpMessage);
    }
  },
  
  {
    trigger: 'topics',
    description: 'Browse FAQ topics',
    handler: async (message, args) => {
      const categories = getCategories();
      
      const topicsMessage = `📚 **BlockRoll FAQ Topics**\n\n` +
        categories.map((cat, i) => `${i + 1}. ${cat}`).join('\n') +
        `\n\n💬 To see questions in a topic:\n!category <topic name>\n\n` +
        `Or just ask me anything:\n!ask <your question>`;

      await message.reply(topicsMessage);
    }
  },
  
  {
    trigger: 'category',
    description: 'Get FAQs for a specific category',
    handler: async (message, args) => {
      const categoryName = args?.join(' ') || '';
      
      if (!categoryName) {
        const categories = getCategories();
        await message.reply(
          `Please specify a category:\n\n${categories.join('\n')}\n\n` +
          `Example: !category Security & Privacy`
        );
        return;
      }

      const response = blockRollAISupport.getCategoryHelp(categoryName);
      await message.reply(response);
    }
  },
  
  {
    trigger: 'upload',
    description: 'Learn how to upload files',
    handler: async (message, args) => {
      const guide = `📤 **How to Upload Files to BlockRoll**\n\n` +
        `**Step-by-Step:**\n` +
        `1️⃣ Go to 'My Vault' in dashboard\n` +
        `2️⃣ Click 'Upload File' button\n` +
        `3️⃣ Select file (max 100MB)\n` +
        `4️⃣ Set details:\n` +
        `   • Access type (Private/Public)\n` +
        `   • Expiry date (optional)\n` +
        `   • Encryption: AES-256\n` +
        `5️⃣ Click 'Upload'\n\n` +
        `🔒 Encrypted on your device!\n` +
        `⚡ Real-time notification when done!\n\n` +
        `Questions? !ask How do I share files?`;

      await message.reply(guide);
    }
  },
  
  {
    trigger: 'share',
    description: 'Learn how to share files',
    handler: async (message, args) => {
      const guide = `🔗 **How to Share Files**\n\n` +
        `1️⃣ Go to 'My Vault'\n` +
        `2️⃣ Click 'Share' on your file\n` +
        `3️⃣ Enter wallet address:\n` +
        `   Example: 0x742d35Cc...\n` +
        `4️⃣ Set access level:\n` +
        `   • View Only\n` +
        `   • Edit\n` +
        `   • Download\n` +
        `5️⃣ Optional expiry date\n` +
        `6️⃣ Click 'Share File'\n\n` +
        `✅ Recipient notified instantly!\n` +
        `⚡ Real-time WebSocket notification!\n\n` +
        `Revoke anytime from 'Shared Files'`;

      await message.reply(guide);
    }
  },
  
  {
    trigger: 'security',
    description: 'Learn about BlockRoll security',
    handler: async (message, args) => {
      const securityInfo = `🔒 **BlockRoll Security**\n\n` +
        `**95/100 Bank-Level Score 🏆**\n\n` +
        `🛡️ **Encryption:**\n` +
        `• AES-256-GCM (military-grade)\n` +
        `• Client-side encryption\n` +
        `• You control all keys\n\n` +
        `🔐 **Authentication:**\n` +
        `• Wallet-based (no passwords)\n` +
        `• httpOnly cookies\n` +
        `• Auto token refresh\n` +
        `• Brute force protection\n\n` +
        `🚨 **AI Guardian:**\n` +
        `• Real-time threat detection\n` +
        `• Suspicious activity alerts\n` +
        `• Device fingerprinting\n` +
        `• Risk scoring\n\n` +
        `✅ **Compliance:**\n` +
        `SOC 2 • ISO 27001 • GDPR\n\n` +
        `_Safer than most banks!_ 🏦`;

      await message.reply(securityInfo);
    }
  },
  
  {
    trigger: 'features',
    description: 'See all BlockRoll features',
    handler: async (message, args) => {
      const featuresMessage = `✨ **BlockRoll Features**\n\n` +
        `📁 **SafeVault** - Private encrypted storage\n\n` +
        `👥 **Team Workspace** - Secure collaboration\n\n` +
        `🚨 **Emergency Access** - Digital inheritance\n\n` +
        `🛡️ **AI Guardian** - 24/7 security monitoring\n\n` +
        `⚡ **Real-Time** - Instant WebSocket updates\n\n` +
        `💻 **SDK** - React, Vue, CDN, REST API\n\n` +
        `🔐 **Bank-Level Security** - 20+ features\n\n` +
        `🌍 **Decentralized** - BlockDAG + IPFS\n\n` +
        `Ask about any feature: !ask <question>`;

      await message.reply(featuresMessage);
    }
  },
  
  {
    trigger: 'pricing',
    description: 'Get pricing information',
    handler: async (message, args) => {
      const pricingMessage = `💰 **BlockRoll Pricing**\n\n` +
        `**Free Tier** 🆓\n` +
        `• 5 GB storage\n` +
        `• All core features\n\n` +
        `**Pro Plan** ⭐\n` +
        `• 100 GB storage\n` +
        `• Team workspaces\n` +
        `• Priority support\n\n` +
        `**Enterprise** 🏢\n` +
        `• Unlimited storage\n` +
        `• Custom integrations\n` +
        `• SLA guarantees\n\n` +
        `All plans: Unlimited shares, Real-time notifications, AI Guardian!\n\n` +
        `Visit: blockroll.io/pricing`;

      await message.reply(pricingMessage);
    }
  },
  
  {
    trigger: 'start',
    description: 'Get started guide',
    handler: async (message, args) => {
      const startGuide = `🚀 **Get Started with BlockRoll**\n\n` +
        `**1. Connect Wallet** 🔐\n` +
        `Visit app.blockroll.io\n` +
        `Click "Connect Wallet"\n` +
        `No signup needed!\n\n` +
        `**2. Upload File** 📤\n` +
        `My Vault → Upload File\n` +
        `Auto-encrypted!\n\n` +
        `**3. Share Securely** 🔗\n` +
        `Enter wallet address\n` +
        `Instant notification!\n\n` +
        `Need help? !ask <question>`;

      await message.reply(startGuide);
    }
  },
  
  {
    trigger: 'contact',
    description: 'Contact information',
    handler: async (message, args) => {
      const contactInfo = `📞 **Contact BlockRoll**\n\n` +
        `💬 **WhatsApp:** Right here!\n` +
        `📧 **Email:** support@blockroll.io\n` +
        `🌐 **Website:** blockroll.io\n` +
        `📚 **Docs:** docs.blockroll.io\n` +
        `💬 **Discord:** discord.gg/blockroll\n` +
        `🐦 **X/Twitter:** @BlockRollHQ\n\n` +
        `Ask me anything: !ask <question>`;

      await message.reply(contactInfo);
    }
  },
  
  {
    trigger: 'wallet',
    description: 'Learn about wallet authentication',
    handler: async (message, args) => {
      const walletInfo = `🔐 **Wallet Authentication**\n\n` +
        `**No Passwords!** 🎉\n` +
        `Your wallet IS your account\n\n` +
        `**Supported Wallets:**\n` +
        `• MetaMask 🦊\n` +
        `• Coinbase Wallet\n` +
        `• Trust Wallet\n` +
        `• 300+ via WalletConnect\n\n` +
        `**How to Connect:**\n` +
        `1. Visit app.blockroll.io\n` +
        `2. Click "Connect Wallet"\n` +
        `3. Choose your wallet\n` +
        `4. Sign transaction\n` +
        `5. You're in!\n\n` +
        `Questions? !ask <question>`;

      await message.reply(walletInfo);
    }
  },
  
  {
    trigger: 'emergency',
    description: 'Learn about Emergency Access',
    handler: async (message, args) => {
      const emergencyInfo = `🚨 **Emergency Access Mode**\n\n` +
        `**Digital Inheritance & Recovery**\n\n` +
        `**What it is:**\n` +
        `Trusted contacts access your files if you're inactive\n\n` +
        `**Setup:**\n` +
        `1. Add trusted wallet addresses\n` +
        `2. Set inactivity period (days)\n` +
        `3. Choose scope (full/specific files)\n\n` +
        `**Use Cases:**\n` +
        `• Digital inheritance\n` +
        `• Business continuity\n` +
        `• Lost access recovery\n\n` +
        `They can ONLY access after inactivity period!\n\n` +
        `More info: !ask Emergency Access`;

      await message.reply(emergencyInfo);
    }
  },
  
  {
    trigger: 'sdk',
    description: 'Developer SDK information',
    handler: async (message, args) => {
      const sdkInfo = `💻 **BlockRoll SDK**\n\n` +
        `**Integration Options:**\n\n` +
        `**React SDK:**\n` +
        `\`\`\`\nimport BlockRoll from '@blockroll/react';\nconst client = new BlockRoll('api-key');\nawait client.upload(file);\n\`\`\`\n\n` +
        `**Vue SDK:**\n` +
        `\`\`\`\nimport { BlockRoll } from '@blockroll/vue';\n\`\`\`\n\n` +
        `**CDN:**\n` +
        `\`\`\`\n<script src="https://cdn.blockroll.io/sdk.js"></script>\n\`\`\`\n\n` +
        `**REST API:**\n` +
        `Any language via HTTP\n\n` +
        `Get API key: Dashboard → SDK & Integration\n\n` +
        `Docs: !ask How do I get API key?`;

      await message.reply(sdkInfo);
    }
  },
  
  {
    trigger: 'reset',
    description: 'Reset AI conversation',
    handler: async (message, args) => {
      blockRollAISupport.clearHistory(message.from);
      await message.reply('✅ Conversation reset!\n\nStart fresh: !ask <question>');
    }
  },
  
  {
    trigger: 'about',
    description: 'About BlockRoll',
    handler: async (message, args) => {
      const aboutMessage = `🎲 **BlockRoll**\n\n` +
        `> _Own. Encrypt. Share. Control._\n\n` +
        `**Next-gen secure file storage**\n` +
        `Built on BlockDAG blockchain\n\n` +
        `✨ **Highlights:**\n` +
        `• Non-custodial (you own data)\n` +
        `• Military-grade encryption\n` +
        `• Bank-level security (95/100)\n` +
        `• Real-time updates\n` +
        `• AI-powered security\n\n` +
        `🌐 **Try it:**\n` +
        `app.blockroll.io\n\n` +
        `📚 **Learn more:**\n` +
        `!features or !ask <question>`;

      await message.reply(aboutMessage);
    }
  }
];

/**
 * Register all custom commands
 */
export function registerCustomCommands(messageService: any): void {
  customCommands.forEach(command => {
    messageService.registerCommand(command);
  });
  console.log(`✅ Registered ${customCommands.length} BlockRoll commands`);
}
