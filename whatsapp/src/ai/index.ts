/**
 * AI utilities - Main entry point for BlockSend WhatsApp Bot
 * 
 * This module provides a clean interface to all AI functionality
 * including message parsing, customer support, and Gemini integration.
 */

import { Type } from "@google/genai";
import { parseStructured } from "./client";
import { parseBlockSendMessage } from "./parsers";
import { blockSendSupport } from "./support";

// Core exports
export { AIError, geminiClient } from './client';
export { apiKeyManager, DEFAULT_AI_CONFIG } from './config';

// Type exports
export type {
    AIRequest,
    AIResponse,
    BlockSendContext, EscalationDecision, MessageAnalysis,
    PaymentContext, ProductInfo, SupportContext
} from './types';

// Service exports
export { parseStructured } from './client';
export {
    blockSendParserSchema, classifyIntent, parseBlockSendMessage,
    parsePaymentContext
} from './parsers';
export { blockSendSupport } from './support';

/**
 * Ready-to-use handler for understanding user messages and extracting BlockSend flow options
 */
export async function parseUserMessageForBlockSend(userMessage: string) {
  const schema = {
    type: Type.OBJECT,
    properties: {
      intent: { 
        type: Type.STRING,
        enum: ["send_money", "receive_money", "create_wallet", "check_balance", "support", "other"]
      },
      entities: {
        type: Type.ARRAY,
        items: { type: Type.STRING }
      },
      flowOption: {
        type: Type.STRING,
        enum: ["payment", "escrow", "wallet", "support", "other"]
      },
      confidence: {
        type: Type.NUMBER,
        minimum: 0,
        maximum: 1
      }
    },
    required: ["intent", "flowOption", "confidence"],
    propertyOrdering: ["intent", "entities", "flowOption", "confidence"]
  };

  const systemInstruction = `
You are a chatbot message parser for BlockSend, a WhatsApp-first global payment platform.
- Extract the user's intent (e.g., 'send_money', 'receive_money', 'create_wallet', 'check_balance', 'support').
- Extract any entities mentioned (e.g., amounts, currencies, phone numbers, transaction IDs).
- Decide the flowOption: one of 'payment', 'escrow', 'wallet', 'support', or 'other'.
- Provide a confidence score (0-1) for your analysis.
Return a JSON object matching the schema.
`;

  return parseStructured(userMessage, schema, systemInstruction);
}

/**
 * Generate AI-powered response for BlockSend support
 */
export async function generateBlockSendResponse(
  userMessage: string,
  context: {
    userType?: 'customer' | 'seller';
    userPhone?: string;
    isGroup?: boolean;
    isAdmin?: boolean;
  } = {}
): Promise<string> {
  try {
    const analysis = await parseBlockSendMessage(userMessage);
    
    // Route based on intent and flow
    switch (analysis.intent) {
      case 'send_money':
        return generatePaymentResponse(userMessage, analysis);
      case 'receive_money':
        return generateReceivingResponse(userMessage, analysis);
      case 'create_wallet':
        return generateWalletCreationResponse();
      case 'check_balance':
        return generateBalanceResponse();
      case 'support':
        return await blockSendSupport.handleSupport({
          userQuestion: userMessage,
          userType: context.userType || 'customer',
          userPhone: context.userPhone,
          urgency: 'low'
        });
      default:
        return generateGenericResponse(userMessage, analysis);
    }
  } catch (error) {
    console.error('Error generating BlockSend response:', error);
    return blockSendSupport.getFallbackResponse();
  }
}

/**
 * Generate payment-related responses
 */
function generatePaymentResponse(userMessage: string, analysis: any): string {
  const amount = analysis.entities.find((e: string) => /\d+/.test(e));
  const currency = analysis.entities.find((e: string) => /USD|EUR|NGN|GBP|CAD|AUD/i.test(e));
  
  return `💸 *Send Money with BlockSend*\n\nI can help you send money globally with our secure payment system!\n\n${amount ? `💰 Amount: ${amount}\n` : ''}${currency ? `💱 Currency: ${currency}\n` : ''}\n🔒 Features:\n• AI-powered fraud protection\n• Real-time transaction tracking\n• WhatsApp integration\n• Multi-currency support\n\n💬 Type "send" to start a transfer or "menu" for more options.`;
}

/**
 * Generate receiving money responses
 */
function generateReceivingResponse(userMessage: string, analysis: any): string {
  return `💰 *Receive Money with BlockSend*\n\nSet up your account to receive payments from anywhere in the world!\n\n✨ Benefits:\n• Instant notifications\n• Secure escrow protection\n• Low fees\n• Global reach\n\n💬 Type "receive" to set up receiving or "menu" for more options.`;
}

/**
 * Generate wallet creation response
 */
function generateWalletCreationResponse(): string {
  return `🏦 *Create Your BlockSend Wallet*\n\nGet started with your secure digital wallet for global payments!\n\n🛡️ Security features:\n• End-to-end encryption\n• Multi-factor authentication\n• AI fraud detection\n• BlockDAG technology\n\n💬 Type "create wallet" to get started or "menu" for more options.`;
}

/**
 * Generate balance check response
 */
function generateBalanceResponse(): string {
  return `📊 *Check Your Balance*\n\nView your BlockSend wallet balance and transaction history.\n\n📈 You can see:\n• Available balance\n• Pending transactions\n• Transaction history\n• Currency breakdown\n\n💬 Type "balance" to check your account or "menu" for more options.`;
}

/**
 * Generate generic response for unclear intents
 */
function generateGenericResponse(userMessage: string, analysis: any): string {
  return `🤖 *BlockSend AI Assistant*\n\nI'm here to help you with global payments, escrow services, and secure money transfers!\n\n🚀 What I can help with:\n• Send money globally\n• Receive payments\n• Create secure escrows\n• Check balances\n• Customer support\n\n💬 Type "menu" to see all options or ask me anything about BlockSend!`;
}
