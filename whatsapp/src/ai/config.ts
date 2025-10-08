/**
 * AI configuration and API key management for BlockSend WhatsApp Bot
 */

import { GoogleGenAI } from "@google/genai";

// Load and validate API keys from environment
const loadApiKeys = (): string[] => {
  const rawKeys = process.env.GEMINI_API_KEYS || process.env.AI_API_KEYS || '';
  const apiKeys = rawKeys.split(',').filter(k => k.trim());
  
  if (apiKeys.length === 0) {
    if (process.env.GEMINI_API_KEY || process.env.AI_API_KEY) {
      const singleKey = process.env.GEMINI_API_KEY || process.env.AI_API_KEY;
      if (singleKey) {
        apiKeys.push(singleKey);
      }
    } else {
      console.error("❌ FATAL: No Gemini API keys found. Please set GEMINI_API_KEYS or GEMINI_API_KEY in your .env file.");
      process.exit(1);
    }
  }
  
  return apiKeys;
};

/**
 * API Key Manager for handling multiple Gemini API keys with rotation
 */
export class ApiKeyManager {
  private keys: string[];
  private currentIndex: number = 0;

  constructor() {
    this.keys = loadApiKeys();
    console.log(`🔑 Loaded ${this.keys.length} Gemini API key(s)`);
  }

  /**
   * Get current Gemini client
   */
  getClient(): GoogleGenAI {
    return new GoogleGenAI({ apiKey: this.keys[this.currentIndex] });
  }

  /**
   * Switch to next API key (round-robin)
   */
  switchKey(): GoogleGenAI {
    this.currentIndex = (this.currentIndex + 1) % this.keys.length;
    console.log(`🔄 Switching to Gemini API key index ${this.currentIndex}`);
    return this.getClient();
  }

  /**
   * Get current key index for logging
   */
  getCurrentIndex(): number {
    return this.currentIndex;
  }

  /**
   * Get total number of available keys
   */
  getKeyCount(): number {
    return this.keys.length;
  }
}

// Export singleton instance
export const apiKeyManager = new ApiKeyManager();

/**
 * Default AI configuration for BlockSend with environment variable support
 */
export const DEFAULT_AI_CONFIG = {
  model: process.env.GEMINI_MODEL || "gemini-1.5-flash",
  temperature: parseFloat(process.env.GEMINI_TEMPERATURE || "0.7"),
  maxOutputTokens: parseInt(process.env.GEMINI_MAX_TOKENS || "500"),
  retryDelay: parseInt(process.env.GEMINI_RETRY_DELAY || "2000"), // 2 seconds
  maxRetries: parseInt(process.env.GEMINI_MAX_RETRIES || "3")
} as const;
