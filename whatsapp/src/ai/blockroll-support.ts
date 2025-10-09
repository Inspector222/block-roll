/**
 * BlockRoll AI Support System
 * Provides intelligent FAQ responses about BlockRoll platform
 */

import { BLOCKROLL_KNOWLEDGE_BASE, getAllFAQs, searchFAQs } from '../knowledge/blockroll-faq';
import { logger } from '../utils/logger';
import { geminiClient } from './client';
import { DEFAULT_AI_CONFIG } from './config';

export class BlockRollAISupport {
  private conversationHistory: Map<string, any[]> = new Map();

  /**
   * System prompt for BlockRoll AI
   */
  private getSystemPrompt(): string {
    const faqContext = getAllFAQs()
      .map(faq => `Q: ${faq.question}\nA: ${faq.answer}`)
      .join('\n\n');

    return `You are BlockRoll Support Bot, an AI assistant for BlockRoll - a non-custodial data exchange and storage platform powered by BlockDAG blockchain.

**Your Role:**
- Help users understand BlockRoll features
- Answer questions about security, encryption, file sharing
- Guide users through the platform
- Provide technical support
- Be friendly, professional, and concise

**BlockRoll Key Information:**

**What is BlockRoll:**
BlockRoll is a non-custodial data exchange and storage platform. Users own, encrypt, share, and control their files with complete privacy. Powered by BlockDAG blockchain, with files stored on IPFS.

**Core Features:**
1. SafeVault - Private encrypted file storage
2. Wallet-based authentication (no passwords)
3. End-to-end encryption (AES-256-GCM)
4. File sharing by wallet address
5. Emergency Access Mode - Digital inheritance
6. Team Workspaces - Collaborative file management
7. AI Guardian - Real-time security monitoring
8. SDK & API - Developer integrations
9. Real-time notifications via WebSocket
10. Bank-level security (95/100 score)

**Security Features (20+):**
- httpOnly cookie authentication
- Automatic token refresh
- Brute force protection
- Device fingerprinting
- Suspicious activity detection
- Multi-device session management
- Risk scoring system (0-100)
- Comprehensive audit logs
- Real-time security alerts
- Account lockout mechanism

**Tech Stack:**
- Frontend: Next.js
- Backend: Node.js + TypeScript + Express
- Blockchain: BlockDAG
- Storage: IPFS (encrypted)
- Real-Time: Socket.IO WebSocket
- Auth: Reown AppKit (WalletConnect)

**FAQ Knowledge Base:**

${faqContext}

**Response Guidelines:**
1. Be concise but informative
2. Use emojis appropriately (🔒 for security, 📁 for files, ⚡ for speed, etc.)
3. Provide step-by-step instructions when needed
4. Mention relevant features
5. If unsure, acknowledge and suggest contacting human support
6. Use bullet points for clarity
7. Include examples when helpful
8. Stay positive and helpful

**Important Notes:**
- BlockRoll is NON-CUSTODIAL (users control their data)
- NO passwords (wallet-based authentication only)
- Files are encrypted BEFORE upload
- Real-time updates via WebSocket
- Bank-level security standards

Answer the user's question clearly and professionally.`;
  }

  /**
   * Get AI response for user question
   */
  async getResponse(
    userId: string,
    userMessage: string
  ): Promise<string> {
    try {
      // Search knowledge base for relevant FAQs
      const relevantFAQs = searchFAQs(userMessage);
      let contextualInfo = '';

      if (relevantFAQs.length > 0) {
        contextualInfo = '\n\nRelevant FAQ entries:\n' + 
          relevantFAQs.slice(0, 3)
            .map(faq => `Q: ${faq.question}\nA: ${faq.answer}`)
            .join('\n\n');
      }

      // Construct prompt with system instructions and user question
      const fullPrompt = `${this.getSystemPrompt()}\n\nUser Question: ${userMessage}${contextualInfo}`;

      // Generate response using geminiClient
      const aiResponse = await geminiClient.generateTextResponse(
        fullPrompt,
        undefined,
        {
          temperature: DEFAULT_AI_CONFIG.temperature,
          maxOutputTokens: DEFAULT_AI_CONFIG.maxOutputTokens
        }
      );

      logger.info('✅ AI response generated', { 
        userId,
        messageLength: userMessage.length,
        responseLength: aiResponse.length
      });

      return aiResponse;

    } catch (error: any) {
      logger.error('AI response generation failed', error);
      
      // Fallback to knowledge base search
      return this.getFallbackResponse(userMessage);
    }
  }

  /**
   * Get fallback response from knowledge base
   */
  private getFallbackResponse(userMessage: string): string {
    const relevantFAQs = searchFAQs(userMessage);

    if (relevantFAQs.length > 0) {
      const faq = relevantFAQs[0];
      return `📚 **${faq.question}**\n\n${faq.answer}\n\n_💡 Tip: For more personalized help, try asking your question differently or contact our support team!_`;
    }

    return `I'm having trouble connecting to my AI service right now, but I can still help!\n\n🔍 **Common Topics:**\n\n` +
      BLOCKROLL_KNOWLEDGE_BASE.map(cat => 
        `**${cat.category}**\n${cat.questions.slice(0, 2).map(q => `• ${q.question}`).join('\n')}`
      ).join('\n\n') +
      `\n\n_💬 Type a question from above or contact support: support@blockroll.io_`;
  }

  /**
   * Clear conversation history for user
   */
  clearHistory(userId: string): void {
    this.conversationHistory.delete(userId);
    logger.info('Conversation history cleared', { userId });
  }

  /**
   * Get quick help message
   */
  getQuickHelp(): string {
    return `👋 **Welcome to BlockRoll Support!**

I'm your AI-powered assistant. I can help you with:

📁 **File Management**
• How to upload files
• How to share files
• How to revoke access

🔒 **Security & Privacy**
• How encryption works
• AI Guardian features
• Security best practices

👥 **Team Collaboration**
• Team Workspaces
• Member roles
• File sharing in teams

🚨 **Emergency Access**
• Setting up trusted contacts
• Digital inheritance
• Recovery options

💻 **Developers**
• SDK integration
• API keys
• REST API usage

💰 **Pricing & Plans**
• Free vs Pro features
• Storage limits
• Enterprise solutions

**Just ask me anything!** For example:
• "How do I upload a file?"
• "Is BlockRoll secure?"
• "What is Emergency Access?"
• "How do I get an API key?"

Type your question and I'll help! 😊`;
  }

  /**
   * Get category-specific help
   */
  getCategoryHelp(category: string): string {
    const cat = BLOCKROLL_KNOWLEDGE_BASE.find(
      c => c.category.toLowerCase() === category.toLowerCase()
    );

    if (!cat) {
      return `Category "${category}" not found. Available categories: ${BLOCKROLL_KNOWLEDGE_BASE.map(c => c.category).join(', ')}`;
    }

    return `📚 **${cat.category}**\n\n` +
      cat.questions.map((q, i) => 
        `${i + 1}. **${q.question}**\n${q.answer}`
      ).join('\n\n');
  }
}

export default new BlockRollAISupport();

