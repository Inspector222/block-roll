import { Router } from 'express';
import authRoutes from './auth.routes';
import fileRoutes from './file.routes';
import sdkRoutes from './sdk.routes';
import workspaceRoutes from './workspace.routes';
import notificationRoutes from './notification.routes';
import adminRoutes from './admin.routes';

const router = Router();

// Health check
router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'BlockRoll API is running',
    timestamp: new Date().toISOString(),
  });
});

// API routes
router.use('/auth', authRoutes);
router.use('/file', fileRoutes);
router.use('/sdk', sdkRoutes);
router.use('/workspace', workspaceRoutes);
router.use('/notifications', notificationRoutes);
router.use('/admin', adminRoutes);

export default router;
