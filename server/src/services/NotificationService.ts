import { INotification, Notification, NotificationType } from '../models';
import { AuthorizationError, NotFoundError } from '../utils/errors';
import { Validators } from '../utils/validators';
import { BaseService } from './BaseService';
import SocketService from './SocketService';

export interface CreateNotificationData {
  type: NotificationType;
  title: string;
  message: string;
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  actionUrl?: string;
  expiresAt?: Date;
  data?: Record<string, any>;
}

export class NotificationService extends BaseService {
  constructor() {
    super('NotificationService');
  }

  /**
   * Create notification
   */
  async createNotification(
    userId: string,
    data: CreateNotificationData
  ): Promise<INotification> {
    return this.executeWithErrorHandling(async () => {
      const notification = await Notification.create({
        user: userId,
        type: data.type,
        title: data.title,
        message: data.message,
        priority: data.priority || 'medium',
        actionUrl: data.actionUrl,
        expiresAt: data.expiresAt,
        data: data.data,
      });

      // Send real-time notification via WebSocket
      await SocketService.sendNotification(userId, {
        id: (notification._id as any).toString(),
        type: data.type,
        title: data.title,
        message: data.message,
        priority: data.priority || 'medium',
        data: data.data,
        timestamp: notification.createdAt.toISOString(),
      });

      // Update unread count
      const unreadCount = await Notification.getUnreadCount(userId as any);
      await SocketService.updateUnreadCount(userId, unreadCount);

      this.logInfo('Notification created and sent via WebSocket', {
        userId,
        notificationId: notification._id,
        type: data.type,
      });

      return notification;
    }, 'createNotification');
  }

  /**
   * Get notifications by user
   */
  async getNotificationsByUser(
    userId: string,
    limit: number = 50
  ): Promise<INotification[]> {
    return this.executeWithErrorHandling(async () => {
      const notifications = await Notification.findByUser(userId as any, limit);
      return notifications;
    }, 'getNotificationsByUser');
  }

  /**
   * Get unread notifications
   */
  async getUnreadNotifications(userId: string): Promise<INotification[]> {
    return this.executeWithErrorHandling(async () => {
      const notifications = await Notification.findUnreadByUser(userId as any);
      return notifications;
    }, 'getUnreadNotifications');
  }

  /**
   * Get unread count
   */
  async getUnreadCount(userId: string): Promise<number> {
    return this.executeWithErrorHandling(async () => {
      const count = await Notification.getUnreadCount(userId as any);
      return count;
    }, 'getUnreadCount');
  }

  /**
   * Mark notification as read
   */
  async markAsRead(
    notificationId: string,
    userId: string
  ): Promise<INotification> {
    return this.executeWithErrorHandling(async () => {
      Validators.assertValidObjectId(notificationId, 'Notification ID');

      const notification = await Notification.findById(notificationId);

      if (!notification) {
        throw new NotFoundError('Notification not found');
      }

      if (notification.user.toString() !== userId) {
        throw new AuthorizationError('Cannot mark other user\'s notifications');
      }

      await notification.markAsRead();

      // Update unread count via WebSocket
      const unreadCount = await Notification.getUnreadCount(userId as any);
      await SocketService.updateUnreadCount(userId, unreadCount);

      this.logInfo('Notification marked as read', { notificationId, userId });

      return notification;
    }, 'markAsRead');
  }

  /**
   * Mark all as read
   */
  async markAllAsRead(userId: string): Promise<number> {
    return this.executeWithErrorHandling(async () => {
      const count = await Notification.markAllAsRead(userId as any);

      this.logInfo('All notifications marked as read', { userId, count });

      return count;
    }, 'markAllAsRead');
  }

  /**
   * Delete notification
   */
  async deleteNotification(
    notificationId: string,
    userId: string
  ): Promise<void> {
    return this.executeWithErrorHandling(async () => {
      const notification = await Notification.findById(notificationId);

      if (!notification) {
        throw new NotFoundError('Notification not found');
      }

      if (notification.user.toString() !== userId) {
        throw new AuthorizationError('Cannot delete other user\'s notifications');
      }

      await notification.deleteOne();

      this.logInfo('Notification deleted', { notificationId, userId });
    }, 'deleteNotification');
  }

  /**
   * Delete expired notifications (cron job)
   */
  async deleteExpiredNotifications(): Promise<number> {
    return this.executeWithErrorHandling(async () => {
      const count = await Notification.deleteExpired();

      this.logInfo('Expired notifications deleted', { count });

      return count;
    }, 'deleteExpiredNotifications');
  }

  /**
   * Broadcast notification to all users
   */
  async broadcastNotification(
    data: Omit<CreateNotificationData, 'userId'>
  ): Promise<number> {
    return this.executeWithErrorHandling(async () => {
      // This would typically fetch all users and create notifications
      // For now, we'll log the intent
      this.logInfo('Broadcast notification requested', { type: data.type });

      // Implementation would involve creating notifications for all users
      return 0;
    }, 'broadcastNotification');
  }
}

export default new NotificationService();

