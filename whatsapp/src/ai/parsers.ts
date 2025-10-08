/**
 * AI parsers for BlockRoll WhatsApp Bot
 */

import { Type } from "@google/genai";
import { parseStructured } from './client';
import { MessageAnalysis, FileContext } from './types';

/**
 * Schema for parsing user messages and extracting BlockRoll-specific intents
 */
export const blockRollParserSchema = {
  type: Type.OBJECT,
  properties: {
    intent: {
      type: Type.STRING,
      enum: [
        "upload_file",
        "share_file", 
        "revoke_access",
        "download_file",
        "view_files",
        "check_security",
        "setup_emergency_access",
        "create_workspace",
        "get_support",
        "check_status",
        "get_api_key",
        "other"
      ],
      description: "The user's primary intent or action"
    },
    entities: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "Relevant entities like file names, wallet addresses, file IDs"
    },
    flowOption: {
      type: Type.STRING,
      enum: ["file_operation", "security", "sharing", "support", "other"],
      description: "The main flow the user wants to access"
    },
    fileContext: {
      type: Type.OBJECT,
      properties: {
        fileName: { type: Type.STRING },
        fileType: { type: Type.STRING },
        recipientWallet: { type: Type.STRING },
        accessLevel: { type: Type.STRING },
        expiryDate: { type: Type.STRING }
      },
      description: "File-related information extracted from the message"
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
  propertyOrdering: ["intent", "entities", "flowOption", "fileContext", "confidence", "requiresEscalation"]
};

const systemInstruction = `
You are a professional AI parser for BlockRoll, a non-custodial data exchange and storage platform powered by BlockDAG blockchain.

Your job is to analyze user messages and extract structured information for file operations, security queries, and customer support.

Key responsibilities:
- Identify the user's primary intent (upload_file, share_file, revoke_access, check_security, etc.)
- Extract relevant entities (file names, wallet addresses, file IDs, file types)
- Determine the appropriate flow (file_operation, security, sharing, support)
- Extract file context when applicable (file name, type, recipient wallet, access level)
- Assess confidence level (0-1) in your analysis
- Determine if human escalation is needed

BlockRoll features:
- Encrypted file storage (AES-256-GCM)
- Secure file sharing by wallet address
- Non-custodial (users control their data)
- Emergency Access mode for digital inheritance
- Team Workspaces for collaboration
- AI Guardian security monitoring
- Real-time notifications

Guidelines:
- For file sharing, look for wallet addresses (0x...)
- For access levels, identify: view, edit, download
- For security issues, set requiresEscalation to true
- Set requiresEscalation to true for disputes, security concerns, or complex issues
- Be conservative with confidence scores - use 0.8+ only when very certain
- Return JSON matching the exact schema provided
`;

/**
 * Parse user message for BlockRoll-specific flows and intents
 */
export async function parseBlockRollMessage(userMessage: string): Promise<MessageAnalysis> {
  try {
    const result = await parseStructured(userMessage, blockRollParserSchema, systemInstruction);
    
    return {
      intent: result.intent,
      entities: result.entities || [],
      flowOption: result.flowOption,
      confidence: result.confidence,
      requiresEscalation: result.requiresEscalation
    };
  } catch (error) {
    console.error('Error parsing BlockRoll message:', error);
    
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
 * Parse file-specific context from user message
 */
export async function parseFileContext(userMessage: string): Promise<FileContext | null> {
  try {
    const result = await parseStructured(userMessage, blockRollParserSchema, systemInstruction);
    
    if (result.fileContext) {
      return result.fileContext as FileContext;
    }
    
    return null;
  } catch (error) {
    console.error('Error parsing file context:', error);
    return null;
  }
}

/**
 * Simple intent classification for quick routing
 */
export async function classifyIntent(userMessage: string): Promise<string> {
  try {
    const analysis = await parseBlockRollMessage(userMessage);
    return analysis.intent;
  } catch (error) {
    console.error('Error classifying intent:', error);
    return 'other';
  }
}
