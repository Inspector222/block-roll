import { BaseService } from './BaseService';
import SocketManager from '../config/socket';
import {
  ServerEvents,
  NotificationData,
  FileEventData,
  SecurityAlertData,
  StatsUpdateData,
  ActivityData,
  WorkspaceEventData,
  AdminEventData,
} from '../types/socket.events';

export class SocketService extends BaseService {
  private socketManager: SocketManager;

  constructor() {
    super('SocketService');
    this.socketManager = SocketManager.getInstance();
  }

  /**
   * Send notification to user in real-time
   */
  async sendNotification(userId: string, notification: NotificationData): Promise<void> {
    try {
      this.socketManager.emitToUser(userId, ServerEvents.NEW_NOTIFICATION, notification);
      this.logInfo('Real-time notification sent', { userId, notificationId: notification.id });
    } catch (error) {
      this.logError('Failed to send notification', error);
    }
  }

  /**
   * Update unread notification count
   */
  async updateUnreadCount(userId: string, count: number): Promise<void> {
    try {
      this.socketManager.emitToUser(userId, ServerEvents.UNREAD_COUNT_UPDATE, {
        count,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      this.logError('Failed to update unread count', error);
    }
  }

  /**
   * Notify when file is uploaded
   */
  async notifyFileUploaded(userId: string, fileData: FileEventData): Promise<void> {
    try {
      this.socketManager.emitToUser(userId, ServerEvents.FILE_UPLOADED, fileData);
      this.logInfo('File upload notification sent', { userId, fileId: fileData.fileId });
    } catch (error) {
      this.logError('Failed to send file upload notification', error);
    }
  }

  /**
   * Notify when file is shared
   */
  async notifyFileShared(
    ownerId: string,
    receiverWallet: string,
    fileData: FileEventData
  ): Promise<void> {
    try {
      // Notify owner
      this.socketManager.emitToUser(ownerId, ServerEvents.FILE_SHARED, fileData);

      // Notify receiver
      this.socketManager.emitToWallet(receiverWallet, ServerEvents.FILE_RECEIVED, fileData);

      this.logInfo('File sharing notifications sent', {
        ownerId,
        receiverWallet,
        fileId: fileData.fileId,
      });
    } catch (error) {
      this.logError('Failed to send file sharing notifications', error);
    }
  }

  /**
   * Notify when file access is revoked
   */
  async notifyAccessRevoked(userId: string, fileData: FileEventData): Promise<void> {
    try {
      this.socketManager.emitToUser(userId, ServerEvents.FILE_ACCESS_REVOKED, fileData);
      this.logInfo('Access revoked notification sent', { userId, fileId: fileData.fileId });
    } catch (error) {
      this.logError('Failed to send access revoked notification', error);
    }
  }

  /**
   * Send security alert to user
   */
  async sendSecurityAlert(userId: string, alert: SecurityAlertData): Promise<void> {
    try {
      this.socketManager.emitToUser(userId, ServerEvents.SECURITY_ALERT, alert);

      // Also notify admins of high/critical severity alerts
      if (alert.severity === 'high' || alert.severity === 'critical') {
        this.socketManager.emitToAdmins(ServerEvents.ADMIN_SECURITY_ALERT, {
          ...alert,
          userId,
        });
      }

      this.logInfo('Security alert sent', { userId, severity: alert.severity });
    } catch (error) {
      this.logError('Failed to send security alert', error);
    }
  }

  /**
   * Send security incident notification
   */
  async notifySecurityIncident(userId: string, incident: SecurityAlertData): Promise<void> {
    try {
      this.socketManager.emitToUser(userId, ServerEvents.SECURITY_INCIDENT, incident);
      this.logInfo('Security incident notification sent', { userId });
    } catch (error) {
      this.logError('Failed to send security incident notification', error);
    }
  }

  /**
   * Update user's dashboard stats
   */
  async updateDashboardStats(userId: string, stats: StatsUpdateData): Promise<void> {
    try {
      this.socketManager.emitToUser(userId, ServerEvents.STATS_UPDATE, stats);
    } catch (error) {
      this.logError('Failed to update dashboard stats', error);
    }
  }

  /**
   * Send new activity update
   */
  async sendActivityUpdate(userId: string, activity: ActivityData): Promise<void> {
    try {
      this.socketManager.emitToUser(userId, ServerEvents.ACTIVITY_UPDATE, activity);
    } catch (error) {
      this.logError('Failed to send activity update', error);
    }
  }

  /**
   * Update storage usage
   */
  async updateStorageUsage(
    userId: string,
    storageData: { used: number; total: number; percentage: number }
  ): Promise<void> {
    try {
      this.socketManager.emitToUser(userId, ServerEvents.STORAGE_UPDATE, {
        ...storageData,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      this.logError('Failed to update storage usage', error);
    }
  }

  /**
   * Notify workspace members
   */
  async notifyWorkspace(workspaceId: string, event: WorkspaceEventData): Promise<void> {
    try {
      this.socketManager.emitToWorkspace(workspaceId, ServerEvents.WORKSPACE_MEMBER_ADDED, event);
      this.logInfo('Workspace notification sent', { workspaceId });
    } catch (error) {
      this.logError('Failed to send workspace notification', error);
    }
  }

  /**
   * Notify user of workspace invite
   */
  async notifyWorkspaceInvite(userId: string, event: WorkspaceEventData): Promise<void> {
    try {
      this.socketManager.emitToUser(userId, ServerEvents.WORKSPACE_INVITE, event);
      this.logInfo('Workspace invite sent', { userId, workspaceId: event.workspaceId });
    } catch (error) {
      this.logError('Failed to send workspace invite', error);
    }
  }

  /**
   * Send file expiring soon notification
   */
  async notifyFileExpiringSoon(userId: string, fileData: FileEventData): Promise<void> {
    try {
      this.socketManager.emitToUser(userId, ServerEvents.FILE_EXPIRING_SOON, fileData);
      this.logInfo('File expiring notification sent', { userId, fileId: fileData.fileId });
    } catch (error) {
      this.logError('Failed to send file expiring notification', error);
    }
  }

  /**
   * Broadcast admin platform stats
   */
  async broadcastAdminStats(stats: any): Promise<void> {
    try {
      this.socketManager.emitToAdmins(ServerEvents.ADMIN_PLATFORM_STATS, {
        type: 'platform_stats',
        data: stats,
        timestamp: new Date().toISOString(),
      });
      this.logInfo('Admin stats broadcasted');
    } catch (error) {
      this.logError('Failed to broadcast admin stats', error);
    }
  }

  /**
   * Notify admins of new user
   */
  async notifyAdminUserJoined(userData: any): Promise<void> {
    try {
      this.socketManager.emitToAdmins(ServerEvents.ADMIN_USER_JOINED, {
        type: 'user_joined',
        data: userData,
        timestamp: new Date().toISOString(),
      });
      this.logInfo('Admin notified of new user');
    } catch (error) {
      this.logError('Failed to notify admin of new user', error);
    }
  }

  /**
   * Notify admins of file upload
   */
  async notifyAdminFileUploaded(fileData: FileEventData): Promise<void> {
    try {
      this.socketManager.emitToAdmins(ServerEvents.ADMIN_FILE_UPLOADED, {
        type: 'file_uploaded',
        data: fileData,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      this.logError('Failed to notify admin of file upload', error);
    }
  }

  /**
   * Broadcast system announcement
   */
  async broadcastSystemAnnouncement(message: string, priority: 'low' | 'high' = 'low'): Promise<void> {
    try {
      this.socketManager.broadcast(ServerEvents.SYSTEM_ANNOUNCEMENT, {
        message,
        priority,
        timestamp: new Date().toISOString(),
      });
      this.logInfo('System announcement broadcasted', { message });
    } catch (error) {
      this.logError('Failed to broadcast system announcement', error);
    }
  }

  /**
   * Get online status
   */
  isUserOnline(userId: string): boolean {
    return this.socketManager.isUserOnline(userId);
  }

  /**
   * Get online users count
   */
  getOnlineUsersCount(): number {
    return this.socketManager.getOnlineUsersCount();
  }
}

export default new SocketService();

