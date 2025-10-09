/**
 * BlockRoll React SDK
 * Main entry point
 */

// Provider
export { BlockRollProvider, useBlockRollContext } from './provider';
export type { BlockRollProviderProps } from './provider';

// Hooks
export {
  useBlockRoll,
  useMyFiles,
  useNotifications,
  useWorkspace,
} from './hooks';

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

