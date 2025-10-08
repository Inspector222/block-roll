import { Router } from 'express';
import SecurityController from '../controllers/SecurityController';
import { authenticateWithAutoRefresh, requireAdmin } from '../middleware';

const router = Router();

// All routes require authentication
router.use(authenticateWithAutoRefresh);

// User security endpoints
router.get('/sessions', SecurityController.getSessions);
router.delete('/sessions/:id', SecurityController.revokeSession);
router.post('/revoke-all-sessions', SecurityController.revokeAllSessions);
router.post('/trust-device', SecurityController.trustDevice);
router.get('/logs', SecurityController.getSecurityLogs);
router.get('/score', SecurityController.getSecurityScore);

// Admin security endpoints
router.get('/critical-events', requireAdmin, SecurityController.getCriticalEvents);

export default router;

