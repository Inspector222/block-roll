import { Router } from 'express';
import { AuthController } from '../controllers';
import { authenticateWithAutoRefresh, strictLimiter } from '../middleware';

const router = Router();

// Public routes
router.post('/connect-wallet', strictLimiter, AuthController.connectWallet);
router.post('/refresh', strictLimiter, AuthController.refreshToken);

// Protected routes with auto-refresh
router.use(authenticateWithAutoRefresh);
router.get('/verify-session', AuthController.verifySession);
router.get('/me', AuthController.getCurrentUser);
router.patch('/email', AuthController.updateEmail);
router.post('/logout', AuthController.logout);

export default router;
