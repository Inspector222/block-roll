/**
 * AI utility types and interfaces for BlockRoll WhatsApp Bot
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

export interface BlockRollContext {
  userType: 'user' | 'admin' | 'unknown';
  userPhone?: string;
  userMessage: string;
  isGroup?: boolean;
  isAdmin?: boolean;
}

export interface MessageAnalysis {
  intent: string;
  entities: string[];
  flowOption: 'file_operation' | 'security' | 'sharing' | 'support' | 'other';
  confidence: number;
  requiresEscalation: boolean;
}

export interface FileContext {
  fileName?: string;
  fileType?: string;
  recipientWallet?: string;
  accessLevel?: 'view' | 'edit' | 'download';
  expiryDate?: string;
  isEmergencyAccess?: boolean;
}

export interface SupportContext {
  userType: 'user' | 'admin';
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
