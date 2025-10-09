/**
 * BlockRoll Core SDK
 * Main entry point for all BlockRoll SDKs
 */

import { BlockRollClient } from './client';
import { FileOperations } from './files';
import { WorkspaceOperations } from './workspace';
import { NotificationManager } from './notifications';
import { WebSocketManager } from './websocket';
import { BlockRollConfig } from './types';

export class BlockRollCore {
  private client: BlockRollClient;

  public files: FileOperations;
  public workspace: WorkspaceOperations;
  public notifications: NotificationManager;
  public websocket: WebSocketManager;

  constructor(config: BlockRollConfig) {
    // Validate API key
    if (!config.apiKey) {
      throw new Error('API key is required');
    }

    const baseURL = config.baseURL || 'https://api.blockroll.io/v1';
    const timeout = config.timeout || 30000;

    // Initialize HTTP client
    this.client = new BlockRollClient(config.apiKey, baseURL, timeout);

    // Initialize WebSocket manager
    this.websocket = new WebSocketManager(config.apiKey, baseURL);

    // Initialize operation modules
    this.files = new FileOperations(this.client);
    this.workspace = new WorkspaceOperations(this.client);
    this.notifications = new NotificationManager(this.client, this.websocket);

    // Auto-connect WebSocket if enabled
    if (config.realtime !== false) {
      this.websocket.connect();
    }
  }

  /**
   * Connect to real-time updates
   */
  connectRealtime(): void {
    this.websocket.connect();
  }

  /**
   * Disconnect from real-time updates
   */
  disconnectRealtime(): void {
    this.websocket.disconnect();
  }

  /**
   * Check if real-time is connected
   */
  isRealtimeConnected(): boolean {
    return this.websocket.isConnected();
  }

  /**
   * Update API key (useful for token refresh scenarios)
   */
  setApiKey(apiKey: string): void {
    this.client.setApiKey(apiKey);
  }
}

// Export everything
export * from './types';
export { BlockRollClient } from './client';
export { FileOperations } from './files';
export { WorkspaceOperations } from './workspace';
export { NotificationManager } from './notifications';
export { WebSocketManager } from './websocket';

// Default export
export default BlockRollCore;

