import { Router } from 'express';
import authRoutes from './auth.routes';
import fileRoutes from './file.routes';
import sdkRoutes from './sdk.routes';
import workspaceRoutes from './workspace.routes';
import notificationRoutes from './notification.routes';
import adminRoutes from './admin.routes';
import securityRoutes from './security.routes';

const router = Router();

// Health check
router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'BlockRoll API is running',
    security: 'Bank-level',
    realtime: 'WebSocket enabled',
    timestamp: new Date().toISOString(),
  });
});

// API routes
router.use('/auth', authRoutes);
router.use('/file', fileRoutes);
router.use('/sdk', sdkRoutes);
router.use('/workspace', workspaceRoutes);
router.use('/notifications', notificationRoutes);
router.use('/security', securityRoutes);
router.use('/admin', adminRoutes);

export default router;
