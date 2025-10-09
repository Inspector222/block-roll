/**
 * BlockRoll Vue SDK
 * Main entry point
 */

// Plugin
export { BlockRollPlugin, useBlockRollCore, BlockRollKey } from './plugin';
export type { BlockRollPluginOptions } from './plugin';

// Composables
export {
  useBlockRoll,
  useMyFiles,
  useNotifications,
  useWorkspace,
} from './composables';

// Re-export core types for convenience
export type {
  UploadOptions,
  UploadResult,
  ShareOptions,
  ShareResult,
  RevokeOptions,
  FileMetadata,
  FileList,
  Workspace,
  Notification,
  AccessType,
  AccessLevel,
  WorkspaceRole,
  BlockRollError,
} from '@blockroll/core';

