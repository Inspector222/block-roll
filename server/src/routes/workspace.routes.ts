import { Router } from 'express';
import { WorkspaceController } from '../controllers';
import { authenticateWithAutoRefresh } from '../middleware';

const router = Router();

// All routes require authentication with auto-refresh
router.use(authenticateWithAutoRefresh);

router.post('/create', WorkspaceController.createWorkspace);
router.get('/my-workspaces', WorkspaceController.getMyWorkspaces);
router.get('/:id', WorkspaceController.getWorkspaceById);
router.post('/:id/add-member', WorkspaceController.addMember);
router.post('/:id/remove-member', WorkspaceController.removeMember);
router.patch('/:id/member-role', WorkspaceController.updateMemberRole);
router.get('/:id/files', WorkspaceController.getWorkspaceFiles);
router.delete('/:id', WorkspaceController.deleteWorkspace);

export default router;
