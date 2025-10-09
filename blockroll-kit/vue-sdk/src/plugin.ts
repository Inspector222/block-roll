/**
 * BlockRoll Vue Plugin
 * Provides BlockRoll to Vue applications
 */

import { App, inject, InjectionKey } from 'vue';
import { BlockRollCore, BlockRollConfig } from '@blockroll/core';

export const BlockRollKey: InjectionKey<BlockRollCore> = Symbol('BlockRoll');

export interface BlockRollPluginOptions {
  apiKey: string;
  baseURL?: string;
  realtime?: boolean;
  timeout?: number;
}

/**
 * BlockRoll Vue Plugin
 * Install with: app.use(BlockRollPlugin, { apiKey: 'YOUR_KEY' })
 */
export const BlockRollPlugin = {
  install(app: App, options: BlockRollPluginOptions) {
    if (!options.apiKey) {
      throw new Error('BlockRoll: API key is required');
    }

    const config: BlockRollConfig = {
      apiKey: options.apiKey,
      baseURL: options.baseURL,
      realtime: options.realtime,
      timeout: options.timeout,
    };

    const blockroll = new BlockRollCore(config);

    // Provide for Composition API
    app.provide(BlockRollKey, blockroll);

    // Add to global properties for Options API
    app.config.globalProperties.$blockroll = blockroll;

    console.log('✅ BlockRoll Vue plugin installed');

    // Cleanup on app unmount
    const cleanup = () => {
      blockroll.disconnectRealtime();
    };

    // Store cleanup function
    app.config.globalProperties.$blockrollCleanup = cleanup;
  },
};

/**
 * Hook to access BlockRoll core instance
 */
export function useBlockRollCore(): BlockRollCore {
  const blockroll = inject(BlockRollKey);
  
  if (!blockroll) {
    throw new Error(
      'BlockRoll plugin not installed. ' +
      'Use app.use(BlockRollPlugin, { apiKey: "your-key" })'
    );
  }

  return blockroll;
}

