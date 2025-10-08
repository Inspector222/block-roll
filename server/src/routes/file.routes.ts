import { Router } from 'express';
import multer from 'multer';
import { FileController } from '../controllers';
import { authenticateWithAutoRefresh, uploadLimiter } from '../middleware';
import config from '../config';

const router = Router();

// Configure multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: config.upload.maxFileSize,
  },
});

// All routes require authentication with auto-refresh
router.use(authenticateWithAutoRefresh);

// File operations
router.post('/upload', uploadLimiter, upload.single('file'), FileController.uploadFile);
router.get('/my-files', FileController.getMyFiles);
router.get('/:id', FileController.getFileById);
router.post('/:id/share', FileController.shareFile);
router.post('/:id/revoke', FileController.revokeAccess);
router.delete('/:id', FileController.deleteFile);
router.post('/:id/emergency-access', FileController.enableEmergencyAccess);

export default router;
