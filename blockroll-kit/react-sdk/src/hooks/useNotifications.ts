/**
 * useNotifications React hook
 * Manages notifications with real-time WebSocket updates
 */

import { useState, useEffect, useCallback } from 'react';
import { useBlockRollContext } from '../provider';
import type { Notification, NotificationListOptions } from '@blockroll/core';

export function useNotifications(options: NotificationListOptions = {}) {
  const { blockroll } = useBlockRollContext();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load initial notifications
  useEffect(() => {
    const loadNotifications = async () => {
      setLoading(true);
      setError(null);

      try {
        const result = await blockroll.notifications.list({
          ...options,
          limit: options.limit || 50,
        });

        setNotifications(result.data);
        setUnreadCount(result.unreadCount);
      } catch (err: any) {
        setError(err.message || 'Failed to load notifications');
      } finally {
        setLoading(false);
      }
    };

    loadNotifications();
  }, [blockroll, options]);

  // Subscribe to real-time notifications
  const subscribe = useCallback(
    (callback: (notification: Notification) => void) => {
      return blockroll.notifications.subscribe((notification) => {
        // Update local state
        setNotifications((prev) => [notification, ...prev]);
        setUnreadCount((prev) => prev + 1);

        // Call user's callback
        callback(notification);
      });
    },
    [blockroll]
  );

  // Mark notification as read
  const markAsRead = useCallback(
    async (notificationId: string) => {
      try {
        await blockroll.notifications.markAsRead(notificationId);

        setNotifications((prev) =>
          prev.map((n) => (n.id === notificationId ? { ...n, read: true } : n))
        );

        setUnreadCount((prev) => Math.max(0, prev - 1));
      } catch (err: any) {
        console.error('Failed to mark as read:', err);
        throw err;
      }
    },
    [blockroll]
  );

  // Mark all as read
  const markAllAsRead = useCallback(async () => {
    try {
      await blockroll.notifications.markAllAsRead();

      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      setUnreadCount(0);
    } catch (err: any) {
      console.error('Failed to mark all as read:', err);
      throw err;
    }
  }, [blockroll]);

  return {
    notifications,
    unreadCount,
    loading,
    error,
    markAsRead,
    markAllAsRead,
    subscribe,
  };
}

