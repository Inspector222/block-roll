import { Request, Response } from 'express';
import { NotificationService } from '../services';
import { BaseController } from './BaseController';

export class NotificationController extends BaseController {
  /**
   * Get user's notifications
   * GET /notifications
   */
  getNotifications = this.catchAsync(async (req: Request, res: Response) => {
    const userId = this.getUserId(req);
    const limit = parseInt(req.query.limit as string) || 50;

    const notifications = await NotificationService.getNotificationsByUser(
      userId,
      limit
    );

    return this.sendSuccess(res, { notifications }, 'Notifications retrieved');
  });

  /**
   * Get unread notifications
   * GET /notifications/unread
   */
  getUnreadNotifications = this.catchAsync(async (req: Request, res: Response) => {
    const userId = this.getUserId(req);

    const notifications = await NotificationService.getUnreadNotifications(userId);

    return this.sendSuccess(res, { notifications }, 'Unread notifications retrieved');
  });

  /**
   * Get unread count
   * GET /notifications/unread-count
   */
  getUnreadCount = this.catchAsync(async (req: Request, res: Response) => {
    const userId = this.getUserId(req);

    const count = await NotificationService.getUnreadCount(userId);

    return this.sendSuccess(res, { count }, 'Unread count retrieved');
  });

  /**
   * Mark notification as read
   * POST /notifications/:id/read
   */
  markAsRead = this.catchAsync(async (req: Request, res: Response) => {
    const userId = this.getUserId(req);
    const { id } = req.params;

    const notification = await NotificationService.markAsRead(id, userId);

    return this.sendSuccess(res, { notification }, 'Notification marked as read');
  });

  /**
   * Mark all as read
   * POST /notifications/mark-all-read
   */
  markAllAsRead = this.catchAsync(async (req: Request, res: Response) => {
    const userId = this.getUserId(req);

    const count = await NotificationService.markAllAsRead(userId);

    return this.sendSuccess(
      res,
      { count },
      `${count} notification(s) marked as read`
    );
  });

  /**
   * Delete notification
   * DELETE /notifications/:id
   */
  deleteNotification = this.catchAsync(async (req: Request, res: Response) => {
    const userId = this.getUserId(req);
    const { id } = req.params;

    await NotificationService.deleteNotification(id, userId);

    return this.sendSuccess(res, null, 'Notification deleted');
  });
}

export default new NotificationController();

