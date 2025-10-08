import { Router } from 'express';
import { AuthController } from '../controllers';
import {
  authenticateWithAutoRefresh,
  strictLimiter,
  bruteForceProtection,
} from '../middleware';

const router = Router();

// Public routes with brute force protection
router.post(
  '/connect-wallet',
  strictLimiter,
  bruteForceProtection,
  AuthController.connectWallet
);
router.post('/refresh', strictLimiter, AuthController.refreshToken);

// Protected routes with auto-refresh
router.use(authenticateWithAutoRefresh);
router.get('/verify-session', AuthController.verifySession);
router.get('/me', AuthController.getCurrentUser);
router.patch('/email', AuthController.updateEmail);
router.post('/logout', AuthController.logout);

export default router;
