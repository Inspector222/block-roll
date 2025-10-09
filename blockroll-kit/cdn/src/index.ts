/**
 * BlockRoll CDN Bundle
 * Vanilla JavaScript SDK for any website
 */

import { BlockRollCore } from '@blockroll/core';
import type {
  BlockRollConfig,
  UploadOptions,
  UploadResult,
  ShareOptions,
  ShareResult,
  RevokeOptions,
  ListFilesOptions,
  FileList,
  FileMetadata,
  CreateWorkspaceOptions,
  Workspace,
  AddMemberOptions,
  WorkspaceRole,
  NotificationListOptions,
  NotificationList,
  Notification,
  EmergencyAccessOptions,
} from '@blockroll/core';

/**
 * BlockRoll class for CDN usage
 * Exposes a simple API for vanilla JavaScript
 */
class BlockRoll {
  private core: BlockRollCore;

  constructor(config: {
    apiKey: string;
    baseURL?: string;
    realtime?: boolean;
    timeout?: number;
  }) {
    if (!config.apiKey) {
      throw new Error('BlockRoll: API key is required');
    }

    this.core = new BlockRollCore({
      apiKey: config.apiKey,
      baseURL: config.baseURL,
      realtime: config.realtime,
      timeout: config.timeout,
    });

    console.log('✅ BlockRoll initialized');
  }

  // ==================== Files API ====================

  files = {
    /**
     * Upload a file
     */
    upload: async (options: UploadOptions): Promise<UploadResult> => {
      return this.core.files.upload(options);
    },

    /**
     * List user's files
     */
    list: async (options?: ListFilesOptions): Promise<FileList> => {
      return this.core.files.list(options);
    },

    /**
     * Get file by ID
     */
    get: async (fileId: string): Promise<FileMetadata> => {
      return this.core.files.getById(fileId);
    },

    /**
     * Download file
     */
    download: async (fileId: string): Promise<Blob> => {
      return this.core.files.download(fileId);
    },

    /**
     * Share file with wallet
     */
    share: async (options: ShareOptions): Promise<ShareResult> => {
      return this.core.files.share(options);
    },

    /**
     * Revoke access from wallet
     */
    revoke: async (fileId: string, wallet: string): Promise<void> => {
      return this.core.files.revokeAccess({ fileId, wallet });
    },

    /**
     * Delete file
     */
    delete: async (fileId: string): Promise<void> => {
      return this.core.files.delete(fileId);
    },

    /**
     * Setup emergency access
     */
    setupEmergencyAccess: async (options: EmergencyAccessOptions): Promise<void> => {
      return this.core.files.setupEmergencyAccess(options);
    },

    /**
     * Get files shared with you
     */
    getSharedFiles: async (options?: ListFilesOptions): Promise<FileList> => {
      return this.core.files.getSharedFiles(options);
    },

    /**
     * Get files shared by you
     */
    getSharedByMe: async (options?: ListFilesOptions): Promise<FileList> => {
      return this.core.files.getFilesSharedByMe(options);
    },
  };

  // ==================== Workspace API ====================

  workspace = {
    /**
     * Create workspace
     */
    create: async (options: CreateWorkspaceOptions): Promise<Workspace> => {
      return this.core.workspace.create(options);
    },

    /**
     * List workspaces
     */
    list: async (): Promise<Workspace[]> => {
      return this.core.workspace.list();
    },

    /**
     * Get workspace by ID
     */
    get: async (workspaceId: string): Promise<Workspace> => {
      return this.core.workspace.getById(workspaceId);
    },

    /**
     * Add member to workspace
     */
    addMember: async (options: AddMemberOptions): Promise<void> => {
      return this.core.workspace.addMember(options);
    },

    /**
     * Remove member from workspace
     */
    removeMember: async (workspaceId: string, memberWallet: string): Promise<void> => {
      return this.core.workspace.removeMember(workspaceId, memberWallet);
    },

    /**
     * Update member role
     */
    updateMemberRole: async (
      workspaceId: string,
      memberWallet: string,
      role: WorkspaceRole
    ): Promise<void> => {
      return this.core.workspace.updateMemberRole(workspaceId, memberWallet, role);
    },

    /**
     * Delete workspace
     */
    delete: async (workspaceId: string): Promise<void> => {
      return this.core.workspace.delete(workspaceId);
    },

    /**
     * Get workspace files
     */
    getFiles: async (
      workspaceId: string,
      options?: { page?: number; limit?: number }
    ): Promise<FileList> => {
      return this.core.workspace.getFiles(workspaceId, options);
    },
  };

  // ==================== Notifications API ====================

  notifications = {
    /**
     * Get notifications
     */
    list: async (options?: NotificationListOptions): Promise<NotificationList> => {
      return this.core.notifications.list(options);
    },

    /**
     * Mark as read
     */
    markAsRead: async (notificationId: string): Promise<void> => {
      return this.core.notifications.markAsRead(notificationId);
    },

    /**
     * Mark all as read
     */
    markAllAsRead: async (): Promise<void> => {
      return this.core.notifications.markAllAsRead();
    },

    /**
     * Get unread count
     */
    getUnreadCount: async (): Promise<number> => {
      return this.core.notifications.getUnreadCount();
    },

    /**
     * Subscribe to real-time notifications
     */
    subscribe: (callback: (notification: Notification) => void): (() => void) => {
      return this.core.notifications.subscribe(callback);
    },

    /**
     * Delete notification
     */
    delete: async (notificationId: string): Promise<void> => {
      return this.core.notifications.delete(notificationId);
    },
  };

  // ==================== Utility Methods ====================

  /**
   * Disconnect from real-time updates
   */
  disconnect(): void {
    this.core.disconnectRealtime();
  }

  /**
   * Check if real-time is connected
   */
  isConnected(): boolean {
    return this.core.isRealtimeConnected();
  }
}

// Expose globally for CDN usage
if (typeof window !== 'undefined') {
  (window as any).BlockRoll = BlockRoll;
}

// Also export for module usage
export default BlockRoll;
export { BlockRoll };

