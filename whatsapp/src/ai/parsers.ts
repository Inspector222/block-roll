/**
 * AI parsers for BlockSend WhatsApp Bot
 */

import { Type } from "@google/genai";
import { parseStructured } from './client';
import { MessageAnalysis, PaymentContext } from './types';

/**
 * Schema for parsing user messages and extracting BlockSend-specific intents
 */
export const blockSendParserSchema = {
  type: Type.OBJECT,
  properties: {
    intent: {
      type: Type.STRING,
      enum: [
        "send_money",
        "receive_money", 
        "create_wallet",
        "check_balance",
        "view_transactions",
        "escrow_payment",
        "release_escrow",
        "dispute_escrow",
        "get_support",
        "check_status",
        "cancel_transaction",
        "other"
      ],
      description: "The user's primary intent or action"
    },
    entities: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "Relevant entities like amounts, currencies, phone numbers, transaction IDs"
    },
    flowOption: {
      type: Type.STRING,
      enum: ["payment", "escrow", "wallet", "support", "other"],
      description: "The main flow the user wants to access"
    },
    paymentContext: {
      type: Type.OBJECT,
      properties: {
        amount: { type: Type.NUMBER },
        currency: { type: Type.STRING },
        recipient: { type: Type.STRING },
        purpose: { type: Type.STRING },
        isInternational: { type: Type.BOOLEAN }
      },
      description: "Payment-related information extracted from the message"
    },
    confidence: {
      type: Type.NUMBER,
      minimum: 0,
      maximum: 1,
      description: "Confidence score for the analysis (0-1)"
    },
    requiresEscalation: {
      type: Type.BOOLEAN,
      description: "Whether this request requires human intervention"
    }
  },
  required: ["intent", "flowOption", "confidence", "requiresEscalation"],
  propertyOrdering: ["intent", "entities", "flowOption", "paymentContext", "confidence", "requiresEscalation"]
};

const systemInstruction = `
You are a professional AI parser for BlockSend, a WhatsApp-first global payment platform powered by BlockDAG technology.

Your job is to analyze user messages and extract structured information for payment processing, escrow services, and customer support.

Key responsibilities:
- Identify the user's primary intent (send_money, receive_money, create_wallet, check_balance, etc.)
- Extract relevant entities (amounts, currencies, phone numbers, transaction IDs)
- Determine the appropriate flow (payment, escrow, wallet, support)
- Extract payment context when applicable (amount, currency, recipient, purpose)
- Assess confidence level (0-1) in your analysis
- Determine if human escalation is needed

BlockSend features:
- Global money transfers with AI-powered fraud protection
- Escrow services for secure transactions
- WhatsApp integration for easy payments
- Multi-currency support
- Real-time transaction tracking

Guidelines:
- For payment amounts, extract numbers and currency codes (USD, EUR, NGN, etc.)
- For recipients, look for phone numbers, usernames, or "to [name]"
- For international transfers, look for country names or international indicators
- Set requiresEscalation to true for disputes, fraud concerns, or complex issues
- Be conservative with confidence scores - use 0.8+ only when very certain
- Return JSON matching the exact schema provided
`;

/**
 * Parse user message for BlockSend-specific flows and intents
 */
export async function parseBlockSendMessage(userMessage: string): Promise<MessageAnalysis> {
  try {
    const result = await parseStructured(userMessage, blockSendParserSchema, systemInstruction);
    
    return {
      intent: result.intent,
      entities: result.entities || [],
      flowOption: result.flowOption,
      confidence: result.confidence,
      requiresEscalation: result.requiresEscalation
    };
  } catch (error) {
    console.error('Error parsing BlockSend message:', error);
    
    // Fallback response
    return {
      intent: 'other',
      entities: [],
      flowOption: 'other',
      confidence: 0.1,
      requiresEscalation: true
    };
  }
}

/**
 * Parse payment-specific context from user message
 */
export async function parsePaymentContext(userMessage: string): Promise<PaymentContext | null> {
  try {
    const result = await parseStructured(userMessage, blockSendParserSchema, systemInstruction);
    
    if (result.paymentContext) {
      return result.paymentContext as PaymentContext;
    }
    
    return null;
  } catch (error) {
    console.error('Error parsing payment context:', error);
    return null;
  }
}

/**
 * Simple intent classification for quick routing
 */
export async function classifyIntent(userMessage: string): Promise<string> {
  try {
    const analysis = await parseBlockSendMessage(userMessage);
    return analysis.intent;
  } catch (error) {
    console.error('Error classifying intent:', error);
    return 'other';
  }
}
