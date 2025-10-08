/**
 * AI utility types and interfaces for BlockSend WhatsApp Bot
 */

export interface AIRequest {
  model: string;
  config: Record<string, any>;
  systemInstruction?: string;
  contents: Array<{ parts: Array<{ text: string }> }>;
}

export interface AIResponse {
  text: string;
  [key: string]: any;
}

export interface BlockSendContext {
  userType: 'customer' | 'seller' | 'unknown';
  userPhone?: string;
  userMessage: string;
  isGroup?: boolean;
  isAdmin?: boolean;
}

export interface MessageAnalysis {
  intent: string;
  entities: string[];
  flowOption: 'payment' | 'escrow' | 'wallet' | 'support' | 'other';
  confidence: number;
  requiresEscalation: boolean;
}

export interface PaymentContext {
  amount?: number;
  currency?: string;
  recipient?: string;
  purpose?: string;
  isInternational?: boolean;
}

export interface SupportContext {
  userType: 'customer' | 'seller';
  userPhone?: string;
  userQuestion: string;
  urgency: 'low' | 'medium' | 'high';
}

export interface EscalationDecision {
  shouldEscalate: boolean;
  reason: string;
  confidence: number;
  urgency: 'low' | 'medium' | 'high';
}

export interface ProductInfo {
  name: string;
  price: number;
  description: string;
  category: string;
  seller: string;
  stock?: number;
  weight_kg?: number;
  color?: string[];
  sizes?: string[];
  key_features?: string[];
}
