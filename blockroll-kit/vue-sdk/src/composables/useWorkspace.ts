/**
 * useWorkspace Vue composable
 * Manages team workspaces
 */

import { ref, onMounted, onUnmounted } from 'vue';
import { useBlockRollCore } from '../plugin';
import type {
  Workspace,
  CreateWorkspaceOptions,
  AddMemberOptions,
  WorkspaceRole,
} from '@blockroll/core';

export function useWorkspace() {
  const blockroll = useBlockRollCore();
  const workspaces = ref<Workspace[]>([]);
  const loading = ref(true);
  const error = ref<string | null>(null);

  const fetchWorkspaces = async () => {
    loading.value = true;
    error.value = null;

    try {
      const result = await blockroll.workspace.list();
      workspaces.value = result;
    } catch (err: any) {
      error.value = err.message || 'Failed to load workspaces';
    } finally {
      loading.value = false;
    }
  };

  const createWorkspace = async (options: CreateWorkspaceOptions): Promise<Workspace> => {
    try {
      const workspace = await blockroll.workspace.create(options);

      // Update local state
      workspaces.value = [workspace, ...workspaces.value];

      return workspace;
    } catch (err: any) {
      throw err;
    }
  };

  const addMember = async (options: AddMemberOptions): Promise<void> => {
    try {
      await blockroll.workspace.addMember(options);
      await fetchWorkspaces();
    } catch (err: any) {
      throw err;
    }
  };

  const removeMember = async (workspaceId: string, memberWallet: string): Promise<void> => {
    try {
      await blockroll.workspace.removeMember(workspaceId, memberWallet);
      await fetchWorkspaces();
    } catch (err: any) {
      throw err;
    }
  };

  const updateMemberRole = async (
    workspaceId: string,
    memberWallet: string,
    role: WorkspaceRole
  ): Promise<void> => {
    try {
      await blockroll.workspace.updateMemberRole(workspaceId, memberWallet, role);
      await fetchWorkspaces();
    } catch (err: any) {
      throw err;
    }
  };

  const deleteWorkspace = async (workspaceId: string): Promise<void> => {
    try {
      await blockroll.workspace.delete(workspaceId);

      // Update local state
      workspaces.value = workspaces.value.filter((ws) => ws.id !== workspaceId);
    } catch (err: any) {
      throw err;
    }
  };

  onMounted(() => {
    fetchWorkspaces();

    // Listen for real-time updates
    const unsubscribe = blockroll.websocket.on('workspace:member_added', () => {
      fetchWorkspaces();
    });

    onUnmounted(() => {
      unsubscribe();
    });
  });

  return {
    workspaces,
    loading,
    error,
    createWorkspace,
    addMember,
    removeMember,
    updateMemberRole,
    deleteWorkspace,
    refetch: fetchWorkspaces,
  };
}

