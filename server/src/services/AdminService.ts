import { BaseService } from './BaseService';
import { Admin, IAdmin, User, File, ApiKey, Workspace } from '../models';
import { NotFoundError, AuthorizationError } from '../utils/errors';
import { Validators } from '../utils/validators';

export class AdminService extends BaseService {
  constructor() {
    super('AdminService');
  }

  /**
   * Get platform statistics
   */
  async getPlatformStats(): Promise<{
    totalUsers: number;
    totalFiles: number;
    totalApiKeys: number;
    totalWorkspaces: number;
    activeUsers: number;
    storageUsed: number;
  }> {
    return this.executeWithErrorHandling(async () => {
      const [
        totalUsers,
        totalFiles,
        totalApiKeys,
        totalWorkspaces,
        activeFiles,
      ] = await Promise.all([
        User.countDocuments(),
        File.countDocuments(),
        ApiKey.countDocuments({ active: true }),
        Workspace.countDocuments(),
        File.find({ status: 'active' }),
      ]);

      // Calculate storage used
      const storageUsed = activeFiles.reduce((sum, file) => sum + file.size, 0);

      return {
        totalUsers,
        totalFiles,
        totalApiKeys,
        totalWorkspaces,
        activeUsers: totalUsers, // Simplified - could track last login
        storageUsed,
      };
    }, 'getPlatformStats');
  }

  /**
   * Get all users (admin only)
   */
  async getAllUsers(
    page: number = 1,
    limit: number = 20
  ): Promise<{ users: any[]; total: number }> {
    return this.executeWithErrorHandling(async () => {
      const skip = (page - 1) * limit;

      const [users, total] = await Promise.all([
        User.find()
          .select('-__v')
          .skip(skip)
          .limit(limit)
          .sort({ createdAt: -1 }),
        User.countDocuments(),
      ]);

      return { users, total };
    }, 'getAllUsers');
  }

  /**
   * Get all files (admin only)
   */
  async getAllFiles(
    page: number = 1,
    limit: number = 20
  ): Promise<{ files: any[]; total: number }> {
    return this.executeWithErrorHandling(async () => {
      const skip = (page - 1) * limit;

      const [files, total] = await Promise.all([
        File.find()
          .populate('owner', 'walletAddress email role')
          .select('-__v')
          .skip(skip)
          .limit(limit)
          .sort({ createdAt: -1 }),
        File.countDocuments(),
      ]);

      return { files, total };
    }, 'getAllFiles');
  }

  /**
   * Suspend user
   */
  async suspendUser(adminId: string, userId: string): Promise<void> {
    return this.executeWithErrorHandling(async () => {
      const user = await User.findById(userId);
      if (!user) {
        throw new NotFoundError('User not found');
      }

      // In a real implementation, you would add a 'suspended' field to the User model
      // For now, we'll just log the action

      const admin = await Admin.findOne({ walletAddress: (await User.findById(adminId))?.walletAddress });
      if (admin) {
        admin.logActivity(
          'suspend_user',
          'user',
          `User ${user.walletAddress} suspended`,
          userId as any
        );
        await admin.save();
      }

      this.logInfo('User suspended', { userId, adminId });
    }, 'suspendUser');
  }

  /**
   * Revoke API key (admin)
   */
  async revokeApiKey(adminId: string, apiKeyId: string): Promise<void> {
    return this.executeWithErrorHandling(async () => {
      const apiKey = await ApiKey.findById(apiKeyId);
      if (!apiKey) {
        throw new NotFoundError('API key not found');
      }

      apiKey.active = false;
      await apiKey.save();

      const admin = await Admin.findOne({ walletAddress: (await User.findById(adminId))?.walletAddress });
      if (admin) {
        admin.logActivity(
          'revoke_api_key',
          'apiKey',
          `API key revoked`,
          apiKeyId as any
        );
        await admin.save();
      }

      this.logInfo('API key revoked by admin', { apiKeyId, adminId });
    }, 'revokeApiKey');
  }

  /**
   * Delete file (admin)
   */
  async deleteFile(adminId: string, fileId: string): Promise<void> {
    return this.executeWithErrorHandling(async () => {
      const file = await File.findById(fileId);
      if (!file) {
        throw new NotFoundError('File not found');
      }

      await file.deleteOne();

      const admin = await Admin.findOne({ walletAddress: (await User.findById(adminId))?.walletAddress });
      if (admin) {
        admin.logActivity(
          'delete_file',
          'file',
          `File ${file.fileName} deleted`,
          fileId as any
        );
        await admin.save();
      }

      this.logInfo('File deleted by admin', { fileId, adminId });
    }, 'deleteFile');
  }

  /**
   * Get admin by wallet
   */
  async getAdminByWallet(walletAddress: string): Promise<IAdmin | null> {
    return this.executeWithErrorHandling(async () => {
      Validators.assertValidWalletAddress(walletAddress);
      const admin = await Admin.findByWallet(walletAddress.toLowerCase());
      return admin;
    }, 'getAdminByWallet');
  }

  /**
   * Create admin
   */
  async createAdmin(walletAddress: string, permissions?: string[]): Promise<IAdmin> {
    return this.executeWithErrorHandling(async () => {
      Validators.assertValidWalletAddress(walletAddress);

      const existingAdmin = await Admin.findByWallet(walletAddress.toLowerCase());
      if (existingAdmin) {
        throw new AuthorizationError('Admin already exists');
      }

      const admin = await Admin.create({
        walletAddress: walletAddress.toLowerCase(),
        permissions: permissions || [
          'view_users',
          'view_files',
          'view_analytics',
          'manage_api_keys',
          'view_security_alerts',
        ],
      });

      // Update user role
      const user = await User.findByWallet(walletAddress.toLowerCase());
      if (user && user.role !== 'admin') {
        user.role = 'admin';
        await user.save();
      }

      this.logInfo('Admin created', { walletAddress, adminId: admin._id });

      return admin;
    }, 'createAdmin');
  }

  /**
   * Update admin stats (cron job)
   */
  async updateAdminStats(): Promise<void> {
    return this.executeWithErrorHandling(async () => {
      const stats = await this.getPlatformStats();

      const admins = await Admin.find();

      for (const admin of admins) {
        await admin.updateStats(stats);
      }

      this.logInfo('Admin stats updated', { count: admins.length });
    }, 'updateAdminStats');
  }
}

export default new AdminService();

