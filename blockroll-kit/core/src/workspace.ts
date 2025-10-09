/**
 * BlockRoll Workspace Operations
 * Handles team collaboration and workspace management
 */

import { BlockRollClient } from './client';
import {
  CreateWorkspaceOptions,
  Workspace,
  AddMemberOptions,
  WorkspaceRole,
  FileList,
} from './types';

export class WorkspaceOperations {
  constructor(private client: BlockRollClient) {}

  /**
   * Create a new workspace
   */
  async create(options: CreateWorkspaceOptions): Promise<Workspace> {
    const response = await this.client.post<{ workspace: Workspace }>('/workspace/create', {
      name: options.name,
      description: options.description,
    });

    return response.workspace;
  }

  /**
   * List user's workspaces
   */
  async list(): Promise<Workspace[]> {
    const response = await this.client.get<{ workspaces: Workspace[] }>('/workspace/my-workspaces');
    return response.workspaces;
  }

  /**
   * Get workspace by ID
   */
  async getById(workspaceId: string): Promise<Workspace> {
    const response = await this.client.get<{ workspace: Workspace }>(`/workspace/${workspaceId}`);
    return response.workspace;
  }

  /**
   * Add member to workspace
   */
  async addMember(options: AddMemberOptions): Promise<void> {
    await this.client.post(`/workspace/${options.workspaceId}/members`, {
      memberWallet: options.memberWallet,
      role: options.role,
    });
  }

  /**
   * Remove member from workspace
   */
  async removeMember(workspaceId: string, memberWallet: string): Promise<void> {
    await this.client.delete(`/workspace/${workspaceId}/members/${memberWallet}`);
  }

  /**
   * Update member role
   */
  async updateMemberRole(workspaceId: string, memberWallet: string, role: WorkspaceRole): Promise<void> {
    await this.client.patch(`/workspace/${workspaceId}/members/${memberWallet}`, {
      role,
    });
  }

  /**
   * Get workspace files
   */
  async getFiles(workspaceId: string, options: { page?: number; limit?: number } = {}): Promise<FileList> {
    const params = {
      page: options.page || 1,
      limit: options.limit || 20,
    };

    const response = await this.client.get<{ files: FileList }>(
      `/workspace/${workspaceId}/files`,
      params
    );

    return response.files;
  }

  /**
   * Delete workspace
   */
  async delete(workspaceId: string): Promise<void> {
    await this.client.delete(`/workspace/${workspaceId}`);
  }
}

