/**
 * AI-powered customer support for BlockSend WhatsApp Bot
 */

import { geminiClient } from './client';
import { SupportContext, EscalationDecision } from './types';

// Track conversation history for better context
const conversationHistory = new Map<string, Array<{role: 'user' | 'assistant', content: string}>>();

export const blockSendSupport = {
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
        'fraud', 'scam', 'stolen', 'hacked', 'security', 'unauthorized',
        'payment failed', 'transaction error', 'money lost', 'refund',
        'account blocked', 'account suspended', 'access denied',
        'urgent', 'emergency', 'critical', 'help me now',
        'dispute', 'chargeback', 'reversal', 'charge dispute'
      ];
      
      const questionLower = userQuestion.toLowerCase();
      const isUrgent = urgentKeywords.some(keyword => questionLower.includes(keyword));
      
      if (isUrgent || urgency === 'high') {
        return this.handleEscalation({
          issue: userQuestion,
          userType,
          userPhone,
          urgency: 'high',
          reason: 'Urgent security or payment issue detected'
        });
      }
      
      // Check for transaction-related issues
      const transactionKeywords = ['transaction', 'payment', 'transfer', 'send money', 'receive money'];
      const isTransactionRelated = transactionKeywords.some(keyword => questionLower.includes(keyword));
      
      if (isTransactionRelated) {
        return this.handleTransactionInquiry(context, history);
      }
      
      // Check if this is a follow-up to a previous inquiry
      const lastMessage = history[history.length - 1];
      if (lastMessage && lastMessage.role === 'assistant' && 
          (lastMessage.content.includes('transaction ID') || lastMessage.content.includes('provide more details'))) {
        return this.handleFollowUp(context, history);
      }
      
      // For general questions, use AI response
      let response = await geminiClient.generateTextResponse(
        this.getSupportPrompt(context)
      );
      
      // Always append navigation instruction
      response = response.trim() + '\n\n💬 Type "menu" to return to the main menu.';
      
      // Update conversation history
      history.push({ role: 'user', content: userQuestion });
      history.push({ role: 'assistant', content: response });
      conversationHistory.set(userPhone || 'anonymous', history);
      
      return response;
      
    } catch (error: any) {
      console.error("BlockSend support error:", error.message);
      return this.getFallbackResponse();
    }
  },

  /**
   * Handle transaction-specific inquiries
   */
  async handleTransactionInquiry(context: SupportContext, history: Array<{role: 'user' | 'assistant', content: string}> = []): Promise<string> {
    const { userQuestion, userType, userPhone } = context;
    
    // Check if transaction ID is already provided
    const transactionIdMatch = userQuestion.match(/\b[A-Z0-9]{8,}\b/) || userQuestion.match(/\b\d{8,}\b/);
    
    if (transactionIdMatch) {
      // Transaction ID found, escalate to human support
      const escalationResponse = await this.handleEscalation({
        issue: userQuestion,
        userType,
        userPhone,
        urgency: 'medium',
        reason: 'Transaction inquiry with transaction ID',
        transactionId: transactionIdMatch[0]
      });
      
      // Update conversation history
      history.push({ role: 'user', content: userQuestion });
      history.push({ role: 'assistant', content: escalationResponse });
      conversationHistory.set(userPhone || 'anonymous', history);
      
      return escalationResponse;
    } else {
      // Ask for transaction ID
      const response = `🔍 *Transaction Support*\n\nI understand you have a transaction-related question. To help you quickly, could you please provide your transaction ID?\n\n📋 You can find your transaction ID in your transaction history or confirmation message.\n\n💬 Type "menu" to return to the main menu.`;
      
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
    
    // Check if the response contains an ID or reference number
    const idMatch = userQuestion.match(/\b[A-Z0-9]{8,}\b/) || userQuestion.match(/\b\d{8,}\b/);
    
    if (idMatch) {
      // ID/reference found, escalate to human support
      const escalationResponse = await this.handleEscalation({
        issue: userQuestion,
        userType,
        userPhone,
        urgency: 'medium',
        reason: 'Follow-up with transaction ID',
        reference: idMatch[0]
      });
      
      // Update conversation history
      history.push({ role: 'user', content: userQuestion });
      history.push({ role: 'assistant', content: escalationResponse });
      conversationHistory.set(userPhone || 'anonymous', history);
      
      return escalationResponse;
    } else {
      // Ask for more details
      const response = `I understand you're following up on a previous inquiry. Could you please provide more specific details about your issue? For example:\n\n• Your transaction ID\n• Specific error message\n• Amount and currency involved\n• Date of the transaction\n\n💬 Type "menu" to return to the main menu.`;
      
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
      const { issue, userType, userPhone, urgency, reason, transactionId } = context;
      
      // Log the escalation for human support team
      console.log(`🚨 BLOCKSEND ESCALATION:`, {
        userPhone,
        userType,
        issue,
        urgency,
        reason,
        transactionId,
        timestamp: new Date().toISOString()
      });
      
      // Create escalation message for user
      let escalationMessage = `🚨 *Escalating to Human Support*\n\nI understand this requires immediate attention from our human support team.\n\n`;
      
      if (transactionId) {
        escalationMessage += `📋 Transaction ID: ${transactionId}\n`;
      }
      
      escalationMessage += `⏰ Expected response time: 10-15 minutes\n`;
      escalationMessage += `📞 A support agent will contact you shortly.\n\n`;
      escalationMessage += `💬 Type "menu" to return to the main menu.`;
      
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
You are a professional, empathetic AI customer support assistant for BlockSend, a WhatsApp-first global payment platform powered by BlockDAG technology.

BlockSend features:
- Global money transfers with AI-powered fraud protection
- Escrow services for secure transactions  
- WhatsApp integration for easy payments
- Multi-currency support
- Real-time transaction tracking

Guidelines:
- Always address the user respectfully and concisely
- Focus on payment, escrow, and wallet-related issues
- If the issue is urgent or cannot be resolved by AI, suggest escalation to a human agent
- If the user asks about platform features, provide clear, step-by-step instructions
- If the question is unclear, politely ask for more details
- Use emojis appropriately to make responses friendly
- Keep responses concise but helpful

User type: ${context.userType || 'customer'}
Phone: ${context.userPhone || 'N/A'}
Question: ${context.userQuestion}

Respond in a friendly, professional tone focused on BlockSend services.
`;
  },

  /**
   * Get fallback response for errors
   */
  getFallbackResponse(): string {
    return `😔 I'm experiencing some technical difficulties right now. Please try again in a moment, or type "menu" to return to the main menu.\n\nIf the issue persists, our human support team is available to help you.`;
  },

  /**
   * Clear conversation history
   */
  clearConversationHistory(userPhone: string): void {
    conversationHistory.delete(userPhone);
  }
};
