import { Request, Response } from 'express';
import { BaseController } from './BaseController';
import { WorkspaceService } from '../services';
import { ValidationError } from '../utils/errors';

export class WorkspaceController extends BaseController {
  /**
   * Create workspace
   * POST /workspace/create
   */
  createWorkspace = this.catchAsync(async (req: Request, res: Response) => {
    const userId = this.getUserId(req);
    const { name, description, members } = req.body;

    if (!name) {
      throw new ValidationError('Workspace name is required');
    }

    const workspace = await WorkspaceService.createWorkspace(userId, {
      name,
      description,
      members,
    });

    return this.sendCreated(res, { workspace }, 'Workspace created successfully');
  });

  /**
   * Get workspace by ID
   * GET /workspace/:id
   */
  getWorkspaceById = this.catchAsync(async (req: Request, res: Response) => {
    const userId = this.getUserId(req);
    const { id } = req.params;

    const workspace = await WorkspaceService.getWorkspaceById(id, userId);

    return this.sendSuccess(res, { workspace });
  });

  /**
   * Get user's workspaces
   * GET /workspace/my-workspaces
   */
  getMyWorkspaces = this.catchAsync(async (req: Request, res: Response) => {
    const userId = this.getUserId(req);

    const workspaces = await WorkspaceService.getWorkspacesByUser(userId);

    return this.sendSuccess(res, { workspaces }, 'Workspaces retrieved successfully');
  });

  /**
   * Add member to workspace
   * POST /workspace/:id/add-member
   */
  addMember = this.catchAsync(async (req: Request, res: Response) => {
    const userId = this.getUserId(req);
    const { id } = req.params;
    const { walletAddress, role } = req.body;

    if (!walletAddress) {
      throw new ValidationError('Wallet address is required');
    }

    const workspace = await WorkspaceService.addMember(
      id,
      userId,
      walletAddress,
      role
    );

    return this.sendSuccess(res, { workspace }, 'Member added successfully');
  });

  /**
   * Remove member from workspace
   * POST /workspace/:id/remove-member
   */
  removeMember = this.catchAsync(async (req: Request, res: Response) => {
    const userId = this.getUserId(req);
    const { id } = req.params;
    const { walletAddress } = req.body;

    if (!walletAddress) {
      throw new ValidationError('Wallet address is required');
    }

    const workspace = await WorkspaceService.removeMember(id, userId, walletAddress);

    return this.sendSuccess(res, { workspace }, 'Member removed successfully');
  });

  /**
   * Update member role
   * PATCH /workspace/:id/member-role
   */
  updateMemberRole = this.catchAsync(async (req: Request, res: Response) => {
    const userId = this.getUserId(req);
    const { id } = req.params;
    const { walletAddress, role } = req.body;

    if (!walletAddress || !role) {
      throw new ValidationError('Wallet address and role are required');
    }

    const workspace = await WorkspaceService.updateMemberRole(
      id,
      userId,
      walletAddress,
      role
    );

    return this.sendSuccess(res, { workspace }, 'Member role updated successfully');
  });

  /**
   * Delete workspace
   * DELETE /workspace/:id
   */
  deleteWorkspace = this.catchAsync(async (req: Request, res: Response) => {
    const userId = this.getUserId(req);
    const { id } = req.params;

    await WorkspaceService.deleteWorkspace(id, userId);

    return this.sendSuccess(res, null, 'Workspace deleted successfully');
  });

  /**
   * Get workspace files
   * GET /workspace/:id/files
   */
  getWorkspaceFiles = this.catchAsync(async (req: Request, res: Response) => {
    const userId = this.getUserId(req);
    const { id } = req.params;

    const workspace = await WorkspaceService.getWorkspaceById(id, userId);

    return this.sendSuccess(
      res,
      { files: workspace.files },
      'Workspace files retrieved successfully'
    );
  });
}

export default new WorkspaceController();

