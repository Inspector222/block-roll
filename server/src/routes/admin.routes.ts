import { Router } from 'express';
import { AdminController } from '../controllers';
import { authenticate, requireAdmin } from '../middleware';

const router = Router();

// All routes require authentication and admin role
router.use(authenticate);
router.use(requireAdmin);

router.get('/stats', AdminController.getPlatformStats);
router.get('/users', AdminController.getAllUsers);
router.get('/files', AdminController.getAllFiles);
router.post('/users/:id/suspend', AdminController.suspendUser);
router.delete('/api-keys/:id', AdminController.revokeApiKey);
router.delete('/files/:id', AdminController.deleteFile);
router.post('/create', AdminController.createAdmin);
router.get('/by-wallet/:walletAddress', AdminController.getAdminByWallet);

export default router;
