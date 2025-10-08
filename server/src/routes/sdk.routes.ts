import { Router } from 'express';
import { ApiKeyController } from '../controllers';
import { authenticateWithAutoRefresh, authenticateApiKey, apiKeyLimiter } from '../middleware';

const router = Router();

// Public route for API key verification (SDK/CDN use)
router.post('/verify', apiKeyLimiter, authenticateApiKey, ApiKeyController.verifyApiKey);

// Protected routes with auto-refresh
router.use(authenticateWithAutoRefresh);

router.post('/create', ApiKeyController.createApiKey);
router.get('/my-keys', ApiKeyController.getMyApiKeys);
router.delete('/revoke/:id', ApiKeyController.revokeApiKey);
router.patch('/:id/permissions', ApiKeyController.updatePermissions);
router.get('/:id/stats', ApiKeyController.getUsageStats);

export default router;
