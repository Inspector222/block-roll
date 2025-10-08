import { Router } from 'express';
import { NotificationController } from '../controllers';
import { authenticateWithAutoRefresh } from '../middleware';

const router = Router();

// All routes require authentication with auto-refresh
router.use(authenticateWithAutoRefresh);

router.get('/', NotificationController.getNotifications);
router.get('/unread', NotificationController.getUnreadNotifications);
router.get('/unread-count', NotificationController.getUnreadCount);
router.post('/:id/read', NotificationController.markAsRead);
router.post('/mark-all-read', NotificationController.markAllAsRead);
router.delete('/:id', NotificationController.deleteNotification);

export default router;
