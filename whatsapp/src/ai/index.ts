/**
 * AI utilities - Main entry point for BlockRoll WhatsApp Bot
 * 
 * This module provides AI functionality for BlockRoll FAQ support,
 * including intelligent message parsing and customer support.
 */

// Core exports
export { AIError, geminiClient } from './client';
export { apiKeyManager, DEFAULT_AI_CONFIG } from './config';

// BlockRoll AI Support
export { default as blockRollAISupport } from './blockroll-support';

// Type exports
export type {
    AIRequest,
    AIResponse
} from './types';

// Service exports  
export { parseStructured } from './client';
