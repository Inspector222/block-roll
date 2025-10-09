/**
 * useNotifications Vue composable
 * Manages notifications with real-time updates
 */

import { ref, onMounted, onUnmounted } from 'vue';
import { useBlockRollCore } from '../plugin';
import type { Notification, NotificationListOptions } from '@blockroll/core';

export function useNotifications(options: NotificationListOptions = {}) {
  const blockroll = useBlockRollCore();
  const notifications = ref<Notification[]>([]);
  const unreadCount = ref(0);
  const loading = ref(true);
  const error = ref<string | null>(null);

  const fetchNotifications = async () => {
    loading.value = true;
    error.value = null;

    try {
      const result = await blockroll.notifications.list({
        ...options,
        limit: options.limit || 50,
      });

      notifications.value = result.data;
      unreadCount.value = result.unreadCount;
    } catch (err: any) {
      error.value = err.message || 'Failed to load notifications';
    } finally {
      loading.value = false;
    }
  };

  const markAsRead = async (notificationId: string) => {
    try {
      await blockroll.notifications.markAsRead(notificationId);

      // Update local state
      notifications.value = notifications.value.map((n) =>
        n.id === notificationId ? { ...n, read: true } : n
      );

      unreadCount.value = Math.max(0, unreadCount.value - 1);
    } catch (err: any) {
      console.error('Failed to mark as read:', err);
      throw err;
    }
  };

  const markAllAsRead = async () => {
    try {
      await blockroll.notifications.markAllAsRead();

      // Update local state
      notifications.value = notifications.value.map((n) => ({ ...n, read: true }));
      unreadCount.value = 0;
    } catch (err: any) {
      console.error('Failed to mark all as read:', err);
      throw err;
    }
  };

  const subscribe = (callback: (notification: Notification) => void): (() => void) => {
    return blockroll.notifications.subscribe((notification) => {
      // Update local state
      notifications.value = [notification, ...notifications.value];
      unreadCount.value += 1;

      // Call user's callback
      callback(notification);
    });
  };

  onMounted(() => {
    fetchNotifications();
  });

  return {
    notifications,
    unreadCount,
    loading,
    error,
    markAsRead,
    markAllAsRead,
    subscribe,
    refetch: fetchNotifications,
  };
}

