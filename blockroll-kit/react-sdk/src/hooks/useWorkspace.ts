/**
 * useWorkspace React hook
 * Manages team workspaces and collaboration
 */

import { useState, useEffect, useCallback } from 'react';
import { useBlockRollContext } from '../provider';
import type {
  Workspace,
  CreateWorkspaceOptions,
  AddMemberOptions,
  WorkspaceRole,
} from '@blockroll/core';

export function useWorkspace() {
  const { blockroll } = useBlockRollContext();
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load workspaces
  const fetchWorkspaces = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await blockroll.workspace.list();
      setWorkspaces(result);
    } catch (err: any) {
      setError(err.message || 'Failed to load workspaces');
    } finally {
      setLoading(false);
    }
  }, [blockroll]);

  useEffect(() => {
    fetchWorkspaces();
  }, [fetchWorkspaces]);

  // Listen for real-time workspace updates
  useEffect(() => {
    const unsubscribe = blockroll.websocket.on('workspace:member_added', (data) => {
      // Refresh workspaces when a member is added
      fetchWorkspaces();
    });

    return () => unsubscribe();
  }, [blockroll, fetchWorkspaces]);

  // Create workspace
  const createWorkspace = useCallback(
    async (options: CreateWorkspaceOptions): Promise<Workspace> => {
      try {
        const workspace = await blockroll.workspace.create(options);

        // Update local state
        setWorkspaces((prev) => [workspace, ...prev]);

        return workspace;
      } catch (err: any) {
        throw err;
      }
    },
    [blockroll]
  );

  // Add member
  const addMember = useCallback(
    async (options: AddMemberOptions): Promise<void> => {
      try {
        await blockroll.workspace.addMember(options);

        // Refresh workspaces to get updated member list
        await fetchWorkspaces();
      } catch (err: any) {
        throw err;
      }
    },
    [blockroll, fetchWorkspaces]
  );

  // Remove member
  const removeMember = useCallback(
    async (workspaceId: string, memberWallet: string): Promise<void> => {
      try {
        await blockroll.workspace.removeMember(workspaceId, memberWallet);

        // Refresh workspaces
        await fetchWorkspaces();
      } catch (err: any) {
        throw err;
      }
    },
    [blockroll, fetchWorkspaces]
  );

  // Update member role
  const updateMemberRole = useCallback(
    async (workspaceId: string, memberWallet: string, role: WorkspaceRole): Promise<void> => {
      try {
        await blockroll.workspace.updateMemberRole(workspaceId, memberWallet, role);

        // Refresh workspaces
        await fetchWorkspaces();
      } catch (err: any) {
        throw err;
      }
    },
    [blockroll, fetchWorkspaces]
  );

  // Delete workspace
  const deleteWorkspace = useCallback(
    async (workspaceId: string): Promise<void> => {
      try {
        await blockroll.workspace.delete(workspaceId);

        // Update local state
        setWorkspaces((prev) => prev.filter((ws) => ws.id !== workspaceId));
      } catch (err: any) {
        throw err;
      }
    },
    [blockroll]
  );

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

