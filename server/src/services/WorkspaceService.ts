import { IWorkspace, Notification, User, Workspace } from '../models';
import { AuthorizationError, NotFoundError, ValidationError } from '../utils/errors';
import { Validators } from '../utils/validators';
import { BaseService } from './BaseService';

export interface CreateWorkspaceData {
  name: string;
  description?: string;
  members?: Array<{ wallet: string; role: 'admin' | 'editor' | 'viewer' }>;
}

export class WorkspaceService extends BaseService {
  constructor() {
    super('WorkspaceService');
  }

  /**
   * Create workspace
   */
  async createWorkspace(
    creatorId: string,
    data: CreateWorkspaceData
  ): Promise<IWorkspace> {
    return this.executeWithErrorHandling(async () => {
      const creator = await User.findById(creatorId);
      if (!creator) {
        throw new NotFoundError('Creator not found');
      }

      // Create initial members array with creator as owner
      const members = [
        {
          wallet: creator.walletAddress,
          role: 'owner' as const,
          joinedAt: new Date(),
        },
      ];

      // Add additional members if provided
      if (data.members) {
        for (const member of data.members) {
          Validators.assertValidWalletAddress(member.wallet);
          members.push({
            wallet: member.wallet.toLowerCase(),
            role: member.role as any, // Members cannot be added as owner, but keep the type
            joinedAt: new Date(),
          });
        }
      }

      const workspace = await Workspace.create({
        name: data.name,
        description: data.description,
        members,
        createdBy: creatorId,
      });

      // Add workspace to creator
      creator.workspaces.push(workspace._id as any);
      await creator.save();

      // Send notifications to added members
      if (data.members) {
        for (const member of data.members) {
          const memberUser = await User.findByWallet(member.wallet.toLowerCase());
          if (memberUser) {
            await Notification.create({
              user: memberUser._id,
              type: 'workspace_invite',
              title: 'Workspace Invitation',
              message: `You've been added to workspace "${workspace.name}"`,
              priority: 'medium',
              data: { workspaceId: workspace._id },
            });
          }
        }
      }

      this.logInfo('Workspace created', {
        workspaceId: workspace._id,
        creatorId,
        name: workspace.name,
      });

      return workspace;
    }, 'createWorkspace');
  }

  /**
   * Get workspace by ID
   */
  async getWorkspaceById(
    workspaceId: string,
    userId: string
  ): Promise<IWorkspace> {
    return this.executeWithErrorHandling(async () => {
      Validators.assertValidObjectId(workspaceId, 'Workspace ID');

      const workspace = await Workspace.findById(workspaceId).populate('files');

      if (!workspace) {
        throw new NotFoundError('Workspace not found');
      }

      // Check if user is a member
      const user = await User.findById(userId);
      if (!user) {
        throw new NotFoundError('User not found');
      }

      if (!workspace.hasMember(user.walletAddress)) {
        throw new AuthorizationError('Not a member of this workspace');
      }

      return workspace;
    }, 'getWorkspaceById');
  }

  /**
   * Get workspaces by user
   */
  async getWorkspacesByUser(userId: string): Promise<IWorkspace[]> {
    return this.executeWithErrorHandling(async () => {
      const user = await User.findById(userId);
      if (!user) {
        throw new NotFoundError('User not found');
      }

      const workspaces = await Workspace.findByMember(user.walletAddress);

      return workspaces;
    }, 'getWorkspacesByUser');
  }

  /**
   * Add member to workspace
   */
  async addMember(
    workspaceId: string,
    requesterId: string,
    walletAddress: string,
    role: 'admin' | 'editor' | 'viewer' = 'viewer'
  ): Promise<IWorkspace> {
    return this.executeWithErrorHandling(async () => {
      Validators.assertValidWalletAddress(walletAddress);

      const workspace = await Workspace.findById(workspaceId);
      if (!workspace) {
        throw new NotFoundError('Workspace not found');
      }

      const requester = await User.findById(requesterId);
      if (!requester) {
        throw new NotFoundError('Requester not found');
      }

      // Check if requester is owner or admin
      const requesterRole = workspace.getMemberRole(requester.walletAddress);
      if (requesterRole !== 'owner' && requesterRole !== 'admin') {
        throw new AuthorizationError('Only workspace owners/admins can add members');
      }

      // Check if already a member
      if (workspace.hasMember(walletAddress)) {
        throw new ValidationError('User is already a member');
      }

      workspace.addMember(walletAddress, role);
      await workspace.save();

      // Send notification
      const newMember = await User.findByWallet(walletAddress.toLowerCase());
      if (newMember) {
        await Notification.create({
          user: newMember._id,
          type: 'workspace_invite',
          title: 'Added to Workspace',
          message: `You've been added to workspace "${workspace.name}"`,
          priority: 'medium',
          data: { workspaceId: workspace._id },
        });
      }

      this.logInfo('Member added to workspace', {
        workspaceId,
        walletAddress,
        role,
      });

      return workspace;
    }, 'addMember');
  }

  /**
   * Remove member from workspace
   */
  async removeMember(
    workspaceId: string,
    requesterId: string,
    walletAddress: string
  ): Promise<IWorkspace> {
    return this.executeWithErrorHandling(async () => {
      const workspace = await Workspace.findById(workspaceId);
      if (!workspace) {
        throw new NotFoundError('Workspace not found');
      }

      const requester = await User.findById(requesterId);
      if (!requester) {
        throw new NotFoundError('Requester not found');
      }

      // Check if requester is owner or admin
      const requesterRole = workspace.getMemberRole(requester.walletAddress);
      if (requesterRole !== 'owner' && requesterRole !== 'admin') {
        throw new AuthorizationError('Only workspace owners/admins can remove members');
      }

      // Cannot remove owner
      const memberRole = workspace.getMemberRole(walletAddress);
      if (memberRole === 'owner') {
        throw new ValidationError('Cannot remove workspace owner');
      }

      workspace.removeMember(walletAddress);
      await workspace.save();

      this.logInfo('Member removed from workspace', {
        workspaceId,
        walletAddress,
      });

      return workspace;
    }, 'removeMember');
  }

  /**
   * Update member role
   */
  async updateMemberRole(
    workspaceId: string,
    requesterId: string,
    walletAddress: string,
    newRole: 'admin' | 'editor' | 'viewer'
  ): Promise<IWorkspace> {
    return this.executeWithErrorHandling(async () => {
      const workspace = await Workspace.findById(workspaceId);
      if (!workspace) {
        throw new NotFoundError('Workspace not found');
      }

      const requester = await User.findById(requesterId);
      if (!requester) {
        throw new NotFoundError('Requester not found');
      }

      // Only owner can update roles
      if (!workspace.isOwner(requester.walletAddress)) {
        throw new AuthorizationError('Only workspace owner can update roles');
      }

      workspace.updateMemberRole(walletAddress, newRole);
      await workspace.save();

      this.logInfo('Member role updated', {
        workspaceId,
        walletAddress,
        newRole,
      });

      return workspace;
    }, 'updateMemberRole');
  }

  /**
   * Delete workspace
   */
  async deleteWorkspace(workspaceId: string, userId: string): Promise<void> {
    return this.executeWithErrorHandling(async () => {
      const workspace = await Workspace.findById(workspaceId);
      if (!workspace) {
        throw new NotFoundError('Workspace not found');
      }

      const user = await User.findById(userId);
      if (!user) {
        throw new NotFoundError('User not found');
      }

      // Only owner can delete workspace
      if (!workspace.isOwner(user.walletAddress)) {
        throw new AuthorizationError('Only workspace owner can delete workspace');
      }

      await workspace.deleteOne();

      this.logInfo('Workspace deleted', { workspaceId, userId });
    }, 'deleteWorkspace');
  }
}

export default new WorkspaceService();

