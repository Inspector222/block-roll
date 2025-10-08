/**
 * Socket.IO Event Types for BlockRoll
 * Centralized event definitions for type safety
 */

// Server → Client Events
export enum ServerEvents {
  // Connection
  CONNECTED = 'connected',
  PONG = 'pong',

  // Notifications
  NEW_NOTIFICATION = 'notification:new',
  NOTIFICATION_READ = 'notification:read',
  NOTIFICATION_DELETED = 'notification:deleted',
  UNREAD_COUNT_UPDATE = 'notification:unread_count',

  // Files
  FILE_UPLOADED = 'file:uploaded',
  FILE_SHARED = 'file:shared',
  FILE_RECEIVED = 'file:received',
  FILE_ACCESS_REVOKED = 'file:access_revoked',
  FILE_DELETED = 'file:deleted',
  FILE_EXPIRING_SOON = 'file:expiring_soon',
  FILE_EXPIRED = 'file:expired',

  // AI Guardian / Security
  SECURITY_ALERT = 'security:alert',
  SECURITY_INCIDENT = 'security:incident',
  RISK_LEVEL_CHANGED = 'security:risk_level_changed',
  THREAT_BLOCKED = 'security:threat_blocked',
  VAULT_LOCKED = 'security:vault_locked',

  // Dashboard / Stats
  STATS_UPDATE = 'stats:update',
  ACTIVITY_UPDATE = 'activity:new',
  STORAGE_UPDATE = 'storage:update',

  // Workspace
  WORKSPACE_INVITE = 'workspace:invite',
  WORKSPACE_MEMBER_ADDED = 'workspace:member_added',
  WORKSPACE_MEMBER_REMOVED = 'workspace:member_removed',
  WORKSPACE_FILE_ADDED = 'workspace:file_added',

  // Admin
  ADMIN_USER_JOINED = 'admin:user_joined',
  ADMIN_FILE_UPLOADED = 'admin:file_uploaded',
  ADMIN_SECURITY_ALERT = 'admin:security_alert',
  ADMIN_PLATFORM_STATS = 'admin:platform_stats',

  // API Keys
  API_KEY_CREATED = 'apikey:created',
  API_KEY_REVOKED = 'apikey:revoked',
  API_KEY_LIMIT_REACHED = 'apikey:limit_reached',

  // System
  SYSTEM_ANNOUNCEMENT = 'system:announcement',
  MAINTENANCE_MODE = 'system:maintenance',
}

// Client → Server Events
export enum ClientEvents {
  // Connection
  PING = 'ping',

  // Subscriptions
  SUBSCRIBE_NOTIFICATIONS = 'subscribe:notifications',
  SUBSCRIBE_FILES = 'subscribe:files',
  SUBSCRIBE_GUARDIAN = 'subscribe:guardian',
  SUBSCRIBE_WORKSPACE = 'subscribe:workspace',
  UNSUBSCRIBE_WORKSPACE = 'unsubscribe:workspace',

  // Actions
  MARK_NOTIFICATION_READ = 'notification:mark_read',
  REQUEST_STATS = 'stats:request',
}

// Event Data Interfaces
export interface NotificationData {
  id: string;
  type: string;
  title: string;
  message: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  data?: any;
  timestamp: string;
}

export interface FileEventData {
  fileId: string;
  fileName: string;
  owner: string;
  receiver?: string;
  action: string;
  timestamp: string;
}

export interface SecurityAlertData {
  id: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  type: string;
  message: string;
  fileId?: string;
  userId?: string;
  timestamp: string;
  autoResolved?: boolean;
}

export interface StatsUpdateData {
  totalFiles?: number;
  totalShared?: number;
  activeAutomations?: number;
  securityScore?: number;
  storageUsed?: number;
  timestamp: string;
}

export interface ActivityData {
  action: string;
  file?: string;
  user?: string;
  timestamp: string;
}

export interface WorkspaceEventData {
  workspaceId: string;
  workspaceName: string;
  action: string;
  member?: string;
  file?: string;
  timestamp: string;
}

export interface AdminEventData {
  type: string;
  data: any;
  timestamp: string;
}

