/**
 * BlockRoll Notification Manager
 * Handles notifications and real-time updates
 */

import { BlockRollClient } from './client';
import { WebSocketManager } from './websocket';
import {
  Notification,
  NotificationListOptions,
  NotificationList,
} from './types';

export class NotificationManager {
  constructor(
    private client: BlockRollClient,
    private websocket: WebSocketManager
  ) {}

  /**
   * Get notifications
   */
  async list(options: NotificationListOptions = {}): Promise<NotificationList> {
    const params: any = {
      page: options.page || 1,
      limit: options.limit || 20,
    };

    if (options.unreadOnly) {
      params.unreadOnly = true;
    }

    if (options.type) {
      params.type = options.type;
    }

    const response = await this.client.get<NotificationList>('/notifications', params);
    return response;
  }

  /**
   * Mark notification as read
   */
  async markAsRead(notificationId: string): Promise<void> {
    await this.client.post(`/notifications/${notificationId}/read`);
  }

  /**
   * Mark all notifications as read
   */
  async markAllAsRead(): Promise<void> {
    await this.client.post('/notifications/read-all');
  }

  /**
   * Get unread count
   */
  async getUnreadCount(): Promise<number> {
    const response = await this.client.get<{ count: number }>('/notifications/unread-count');
    return response.count;
  }

  /**
   * Subscribe to real-time notifications via WebSocket
   */
  subscribe(callback: (notification: Notification) => void): () => void {
    return this.websocket.on('notification:new', callback);
  }

  /**
   * Delete notification
   */
  async delete(notificationId: string): Promise<void> {
    await this.client.delete(`/notifications/${notificationId}`);
  }
}

