/**
 * AI-powered customer support for BlockRoll WhatsApp Bot
 */

import { geminiClient } from './client';
import { SupportContext, EscalationDecision } from './types';

// Track conversation history for better context
const conversationHistory = new Map<string, Array<{role: 'user' | 'assistant', content: string}>>();

export const blockRollSupport = {
  /**
   * Handle customer support inquiries
   */
  async handleSupport(context: SupportContext): Promise<string> {
    try {
      const { userQuestion, userType, userPhone, urgency } = context;
      
      // Get or initialize conversation history
      const history = conversationHistory.get(userPhone || 'anonymous') || [];
      
      // Check for urgent issues that require immediate escalation
      const urgentKeywords = [
        'hacked', 'security breach', 'unauthorized access', 'stolen files',
        'data leak', 'privacy breach', 'cannot access', 'lost files',
        'account locked', 'account suspended', 'access denied',
        'urgent', 'emergency', 'critical', 'help me now',
        'files deleted', 'compromised', 'malicious'
      ];
      
      const questionLower = userQuestion.toLowerCase();
      const isUrgent = urgentKeywords.some(keyword => questionLower.includes(keyword));
      
      if (isUrgent || urgency === 'high') {
        return this.handleEscalation({
          issue: userQuestion,
          userType,
          userPhone,
          urgency: 'high',
          reason: 'Urgent security or access issue detected'
        });
      }
      
      // Check for file-related issues
      const fileKeywords = ['upload', 'download', 'share', 'file', 'document', 'cannot access'];
      const isFileRelated = fileKeywords.some(keyword => questionLower.includes(keyword));
      
      if (isFileRelated) {
        return this.handleFileInquiry(context, history);
      }
      
      // Check if this is a follow-up to a previous inquiry
      const lastMessage = history[history.length - 1];
      if (lastMessage && lastMessage.role === 'assistant' && 
          (lastMessage.content.includes('file ID') || lastMessage.content.includes('provide more details'))) {
        return this.handleFollowUp(context, history);
      }
      
      // For general questions, use AI response
      let response = await geminiClient.generateTextResponse(
        this.getSupportPrompt(context)
      );
      
      // Always append navigation instruction
      response = response.trim() + '\n\n💬 Type "!help" for more options or "!ask <question>" for specific help.';
      
      // Update conversation history
      history.push({ role: 'user', content: userQuestion });
      history.push({ role: 'assistant', content: response });
      conversationHistory.set(userPhone || 'anonymous', history);
      
      return response;
      
    } catch (error: any) {
      console.error("BlockRoll support error:", error.message);
      return this.getFallbackResponse();
    }
  },

  /**
   * Handle file-specific inquiries
   */
  async handleFileInquiry(context: SupportContext, history: Array<{role: 'user' | 'assistant', content: string}> = []): Promise<string> {
    const { userQuestion, userType, userPhone } = context;
    
    // Check if file ID or wallet address is already provided
    const fileIdMatch = userQuestion.match(/\b[A-Z0-9]{24}\b/); // MongoDB ObjectId
    const walletMatch = userQuestion.match(/0x[a-fA-F0-9]{40}/); // Ethereum wallet
    
    if (fileIdMatch || walletMatch) {
      // File ID or wallet found, escalate to human support
      const escalationResponse = await this.handleEscalation({
        issue: userQuestion,
        userType,
        userPhone,
        urgency: 'medium',
        reason: 'File inquiry with file ID or wallet address',
        fileId: fileIdMatch?.[0],
        wallet: walletMatch?.[0]
      });
      
      // Update conversation history
      history.push({ role: 'user', content: userQuestion });
      history.push({ role: 'assistant', content: escalationResponse });
      conversationHistory.set(userPhone || 'anonymous', history);
      
      return escalationResponse;
    } else {
      // Ask for file ID or more details
      const response = `🔍 **File Support**\n\nI understand you have a file-related question. To help you quickly, could you please provide:\n\n• Your file ID (found in My Vault)\n• File name\n• Wallet address (for sharing issues)\n\n📋 This helps us locate the exact file you're referring to.\n\n💬 Type "!upload" or "!share" for guides.`;
      
      // Update conversation history
      history.push({ role: 'user', content: userQuestion });
      history.push({ role: 'assistant', content: response });
      conversationHistory.set(userPhone || 'anonymous', history);
      
      return response;
    }
  },

  /**
   * Handle follow-up inquiries
   */
  async handleFollowUp(context: SupportContext, history: Array<{role: 'user' | 'assistant', content: string}> = []): Promise<string> {
    const { userQuestion, userType, userPhone } = context;
    
    // Check if the response contains an ID or reference
    const idMatch = userQuestion.match(/\b[A-Z0-9]{24}\b/) || userQuestion.match(/0x[a-fA-F0-9]{40}/);
    
    if (idMatch) {
      // ID/reference found, escalate to human support
      const escalationResponse = await this.handleEscalation({
        issue: userQuestion,
        userType,
        userPhone,
        urgency: 'medium',
        reason: 'Follow-up with file ID or wallet address',
        reference: idMatch[0]
      });
      
      // Update conversation history
      history.push({ role: 'user', content: userQuestion });
      history.push({ role: 'assistant', content: escalationResponse });
      conversationHistory.set(userPhone || 'anonymous', history);
      
      return escalationResponse;
    } else {
      // Ask for more details
      const response = `I understand you're following up on a previous inquiry. Could you please provide more specific details? For example:\n\n• Your file ID (24-character code)\n• Wallet address (0x...)\n• Specific error message\n• File name\n• When the issue started\n\n💬 Type "!help" for guides or "!contact" for support info.`;
      
      // Update conversation history
      history.push({ role: 'user', content: userQuestion });
      history.push({ role: 'assistant', content: response });
      conversationHistory.set(userPhone || 'anonymous', history);
      
      return response;
    }
  },

  /**
   * Handle escalation to human support
   */
  async handleEscalation(context: any): Promise<string> {
    try {
      const { issue, userType, userPhone, urgency, reason, fileId, wallet } = context;
      
      // Log the escalation for human support team
      console.log(`🚨 BLOCKROLL ESCALATION:`, {
        userPhone,
        userType,
        issue,
        urgency,
        reason,
        fileId,
        wallet,
        timestamp: new Date().toISOString()
      });
      
      // Create escalation message for user
      let escalationMessage = `🚨 **Escalating to Human Support**\n\nI understand this requires immediate attention from our human support team.\n\n`;
      
      if (fileId) {
        escalationMessage += `📋 File ID: ${fileId}\n`;
      }
      
      if (wallet) {
        escalationMessage += `💼 Wallet: ${wallet}\n`;
      }
      
      escalationMessage += `⏰ Expected response time: 10-15 minutes\n`;
      escalationMessage += `📞 A support agent will contact you shortly.\n\n`;
      escalationMessage += `📧 Or email: support@blockroll.io\n`;
      escalationMessage += `💬 Discord: discord.gg/blockroll\n\n`;
      escalationMessage += `Type "!help" to see available commands.`;
      
      return escalationMessage;
      
    } catch (error: any) {
      console.error("Escalation error:", error.message);
      return this.getFallbackResponse();
    }
  },

  /**
   * Get AI support prompt
   */
  getSupportPrompt(context: SupportContext): string {
    return `
You are a professional, empathetic AI customer support assistant for BlockRoll, a non-custodial data exchange and storage platform powered by BlockDAG blockchain.

BlockRoll features:
- Non-custodial encrypted file storage (AES-256-GCM)
- Secure file sharing by wallet address
- Emergency Access mode for digital inheritance
- Team Workspaces for collaboration
- AI Guardian security monitoring
- Real-time notifications via WebSocket
- SDK/API for developers
- Bank-level security (95/100 score)

Guidelines:
- Always address the user respectfully and concisely
- Focus on file storage, sharing, security, and access control issues
- If the issue is urgent or cannot be resolved by AI, suggest escalation to a human agent
- If the user asks about platform features, provide clear, step-by-step instructions
- If the question is unclear, politely ask for more details
- Use emojis appropriately to make responses friendly
- Keep responses concise but helpful
- Never ask for passwords (BlockRoll uses wallet authentication)
- Emphasize security and encryption features

User type: ${context.userType || 'user'}
Phone: ${context.userPhone || 'N/A'}
Question: ${context.userQuestion}

Respond in a friendly, professional tone focused on BlockRoll's secure data transfer services.
`;
  },

  /**
   * Get fallback response for errors
   */
  getFallbackResponse(): string {
    return `😔 I'm experiencing some technical difficulties right now. Please try again in a moment, or type "!help" for command options.\n\n📧 You can also email: support@blockroll.io\n💬 Discord: discord.gg/blockroll\n\nOur human support team is available to help you!`;
  },

  /**
   * Clear conversation history
   */
  clearConversationHistory(userPhone: string): void {
    conversationHistory.delete(userPhone);
  }
};
