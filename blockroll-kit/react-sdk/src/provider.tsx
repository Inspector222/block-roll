/**
 * BlockRoll React Provider
 * Provides BlockRoll context to React components
 */

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { BlockRollCore, BlockRollConfig } from '@blockroll/core';

interface BlockRollContextValue {
  blockroll: BlockRollCore;
  connected: boolean;
  apiKey: string;
}

const BlockRollContext = createContext<BlockRollContextValue | null>(null);

export interface BlockRollProviderProps {
  apiKey: string;
  baseURL?: string;
  realtime?: boolean;
  timeout?: number;
  children: ReactNode;
}

/**
 * BlockRollProvider component
 * Wrap your app with this to enable BlockRoll functionality
 */
export function BlockRollProvider({
  apiKey,
  baseURL,
  realtime = true,
  timeout,
  children,
}: BlockRollProviderProps) {
  const [blockroll] = useState(() => {
    const config: BlockRollConfig = {
      apiKey,
      baseURL,
      timeout,
      realtime,
    };
    return new BlockRollCore(config);
  });

  const [connected, setConnected] = useState(false);

  useEffect(() => {
    // Monitor WebSocket connection status
    if (realtime) {
      const checkConnection = () => {
        setConnected(blockroll.isRealtimeConnected());
      };

      // Check initially
      checkConnection();

      // Check periodically
      const interval = setInterval(checkConnection, 2000);

      return () => {
        clearInterval(interval);
        blockroll.disconnectRealtime();
      };
    }
  }, [blockroll, realtime]);

  const value: BlockRollContextValue = {
    blockroll,
    connected,
    apiKey,
  };

  return (
    <BlockRollContext.Provider value={value}>
      {children}
    </BlockRollContext.Provider>
  );
}

/**
 * Hook to access BlockRoll context
 */
export function useBlockRollContext(): BlockRollContextValue {
  const context = useContext(BlockRollContext);
  
  if (!context) {
    throw new Error(
      'useBlockRollContext must be used within BlockRollProvider. ' +
      'Wrap your app with <BlockRollProvider apiKey="your-key">...</BlockRollProvider>'
    );
  }

  return context;
}

