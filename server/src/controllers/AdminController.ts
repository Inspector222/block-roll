import { Request, Response } from 'express';
import { AdminService } from '../services';
import { ValidationError } from '../utils/errors';
import { BaseController } from './BaseController';

export class AdminController extends BaseController {
  /**
   * Get platform statistics
   * GET /admin/stats
   */
  getPlatformStats = this.catchAsync(async (_req: Request, res: Response) => {
    const stats = await AdminService.getPlatformStats();

    return this.sendSuccess(res, { stats }, 'Platform stats retrieved');
  });

  /**
   * Get all users
   * GET /admin/users
   */
  getAllUsers = this.catchAsync(async (req: Request, res: Response) => {
    const { page, limit } = this.extractPaginationParams(req.query);

    const result = await AdminService.getAllUsers(page, limit);

    return this.sendPaginated(
      res,
      result.users,
      page,
      limit,
      result.total,
      'Users retrieved successfully'
    );
  });

  /**
   * Get all files
   * GET /admin/files
   */
  getAllFiles = this.catchAsync(async (req: Request, res: Response) => {
    const { page, limit } = this.extractPaginationParams(req.query);

    const result = await AdminService.getAllFiles(page, limit);

    return this.sendPaginated(
      res,
      result.files,
      page,
      limit,
      result.total,
      'Files retrieved successfully'
    );
  });

  /**
   * Suspend user
   * POST /admin/users/:id/suspend
   */
  suspendUser = this.catchAsync(async (req: Request, res: Response) => {
    const adminId = this.getUserId(req);
    const { id } = req.params;

    await AdminService.suspendUser(adminId, id);

    return this.sendSuccess(res, null, 'User suspended successfully');
  });

  /**
   * Revoke API key
   * DELETE /admin/api-keys/:id
   */
  revokeApiKey = this.catchAsync(async (req: Request, res: Response) => {
    const adminId = this.getUserId(req);
    const { id } = req.params;

    await AdminService.revokeApiKey(adminId, id);

    return this.sendSuccess(res, null, 'API key revoked successfully');
  });

  /**
   * Delete file
   * DELETE /admin/files/:id
   */
  deleteFile = this.catchAsync(async (req: Request, res: Response) => {
    const adminId = this.getUserId(req);
    const { id } = req.params;

    await AdminService.deleteFile(adminId, id);

    return this.sendSuccess(res, null, 'File deleted successfully');
  });

  /**
   * Create admin
   * POST /admin/create
   */
  createAdmin = this.catchAsync(async (req: Request, res: Response) => {
    const { walletAddress, permissions } = req.body;

    if (!walletAddress) {
      throw new ValidationError('Wallet address is required');
    }

    const admin = await AdminService.createAdmin(walletAddress, permissions);

    return this.sendCreated(res, { admin }, 'Admin created successfully');
  });

  /**
   * Get admin by wallet
   * GET /admin/by-wallet/:walletAddress
   */
  getAdminByWallet = this.catchAsync(async (req: Request, res: Response) => {
    const { walletAddress } = req.params;

    const admin = await AdminService.getAdminByWallet(walletAddress);

    if (!admin) {
      return this.sendSuccess(res, { admin: null }, 'Not an admin');
    }

    return this.sendSuccess(res, { admin }, 'Admin retrieved successfully');
  });
}

export default new AdminController();

