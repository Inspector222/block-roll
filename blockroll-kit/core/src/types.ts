/**
 * BlockRoll Core SDK Types
 */

// ==================== Configuration ====================

export interface BlockRollConfig {
  apiKey: string;
  baseURL?: string;
  timeout?: number;
  realtime?: boolean;
}

// ==================== Common Types ====================

export type AccessType = 'private' | 'public' | 'restricted';
export type AccessLevel = 'view' | 'edit' | 'download';
export type FileStatus = 'active' | 'deleted' | 'expired';
export type WorkspaceRole = 'owner' | 'admin' | 'editor' | 'viewer';
export type NotificationType = 
  | 'file_uploaded'
  | 'file_shared'
  | 'file_revoked'
  | 'workspace_invite'
  | 'security_alert'
  | 'system';

// ==================== File Types ====================

export interface UploadOptions {
  file: File | Blob;
  accessType: AccessType;
  encryption?: boolean;
  expiryDate?: Date;
  tags?: string[];
  metadata?: Record<string, any>;
  onProgress?: (percent: number) => void;
}

export interface UploadResult {
  fileId: string;
  name: string;
  type: string;
  size: number;
  ipfsHash: string;
  encryptedHash: string;
  txHash?: string;
  owner: string;
  createdAt: string;
}

export interface FileMetadata {
  id: string;
  name: string;
  type: string;
  size: number;
  ipfsHash: string;
  encryptedHash: string;
  accessType: AccessType;
  status: FileStatus;
  owner: string;
  accessList: Array<{
    wallet: string;
    accessLevel: AccessLevel;
    grantedAt: string;
    expiresAt?: string;
  }>;
  tags?: string[];
  expiryDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ListFilesOptions {
  page?: number;
  limit?: number;
  status?: FileStatus;
  tags?: string[];
  search?: string;
}

export interface FileList {
  data: FileMetadata[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

export interface ShareOptions {
  fileId: string;
  recipientWallet: string;
  accessLevel: AccessLevel;
  expiryDate?: Date;
}

export interface ShareResult {
  success: boolean;
  shareId: string;
  txHash?: string;
  notificationSent: boolean;
}

export interface RevokeOptions {
  fileId: string;
  wallet: string;
}

// ==================== Workspace Types ====================

export interface CreateWorkspaceOptions {
  name: string;
  description?: string;
}

export interface Workspace {
  id: string;
  name: string;
  description?: string;
  owner: string;
  members: Array<{
    wallet: string;
    role: WorkspaceRole;
    joinedAt: string;
  }>;
  fileCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface AddMemberOptions {
  workspaceId: string;
  memberWallet: string;
  role: WorkspaceRole;
}

// ==================== Notification Types ====================

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  priority: 'low' | 'medium' | 'high';
  read: boolean;
  metadata?: Record<string, any>;
  createdAt: string;
}

export interface NotificationListOptions {
  page?: number;
  limit?: number;
  unreadOnly?: boolean;
  type?: NotificationType;
}

export interface NotificationList {
  data: Notification[];
  total: number;
  unreadCount: number;
}

// ==================== API Key Types ====================

export interface CreateApiKeyOptions {
  name: string;
  permissions: string[];
  sdkType: 'react' | 'vue' | 'cdn' | 'custom';
  rateLimit?: number;
}

export interface ApiKey {
  id: string;
  name: string;
  key?: string; // Only returned on creation
  keyPreview: string;
  sdkType: string;
  permissions: string[];
  isActive: boolean;
  lastUsedAt?: string;
  createdAt: string;
}

export interface ApiKeyUsageStats {
  totalRequests: number;
  uploadCount: number;
  downloadCount: number;
  lastUsed?: string;
}

// ==================== Error Types ====================

export class BlockRollError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode?: number,
    public details?: any
  ) {
    super(message);
    this.name = 'BlockRollError';
  }
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: {
    message: string;
    code: string;
    details?: any;
  };
}

// ==================== WebSocket Types ====================

export interface WebSocketEvents {
  'notification:new': (notification: Notification) => void;
  'file:uploaded': (file: FileMetadata) => void;
  'file:shared': (data: { fileId: string; sharedBy: string }) => void;
  'file:revoked': (data: { fileId: string; revokedBy: string }) => void;
  'workspace:member_added': (data: { workspaceId: string; member: string }) => void;
  'security:alert': (alert: any) => void;
}

export type WebSocketEventName = keyof WebSocketEvents;

// ==================== Emergency Access Types ====================

export interface EmergencyAccessOptions {
  fileId: string;
  trustedContacts: Array<{
    wallet: string;
    inactivityPeriod: number; // days
  }>;
  scope: 'full' | 'specific';
}

