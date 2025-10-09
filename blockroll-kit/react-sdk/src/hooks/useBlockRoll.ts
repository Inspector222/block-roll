/**
 * Main BlockRoll React hook
 * Provides access to file operations
 */

import { useState, useCallback } from 'react';
import { useBlockRollContext } from '../provider';
import type {
  UploadOptions,
  UploadResult,
  ShareOptions,
  ShareResult,
  RevokeOptions,
  EmergencyAccessOptions,
} from '@blockroll/core';

export function useBlockRoll() {
  const { blockroll } = useBlockRollContext();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const uploadFile = useCallback(
    async (options: UploadOptions): Promise<UploadResult> => {
      setLoading(true);
      setError(null);

      try {
        const result = await blockroll.files.upload(options);
        return result;
      } catch (err: any) {
        const errorMessage = err.message || 'Upload failed';
        setError(errorMessage);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [blockroll]
  );

  const shareFile = useCallback(
    async (options: ShareOptions): Promise<ShareResult> {
      setLoading(true);
      setError(null);

      try {
        const result = await blockroll.files.share(options);
        return result;
      } catch (err: any) {
        const errorMessage = err.message || 'Share failed';
        setError(errorMessage);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [blockroll]
  );

  const downloadFile = useCallback(
    async (fileId: string): Promise<Blob> => {
      setLoading(true);
      setError(null);

      try {
        const blob = await blockroll.files.download(fileId);
        return blob;
      } catch (err: any) {
        const errorMessage = err.message || 'Download failed';
        setError(errorMessage);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [blockroll]
  );

  const revokeAccess = useCallback(
    async (options: RevokeOptions): Promise<void> => {
      setLoading(true);
      setError(null);

      try {
        await blockroll.files.revokeAccess(options);
      } catch (err: any) {
        const errorMessage = err.message || 'Revoke failed';
        setError(errorMessage);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [blockroll]
  );

  const deleteFile = useCallback(
    async (fileId: string): Promise<void> {
      setLoading(true);
      setError(null);

      try {
        await blockroll.files.delete(fileId);
      } catch (err: any) {
        const errorMessage = err.message || 'Delete failed';
        setError(errorMessage);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [blockroll]
  );

  const setupEmergencyAccess = useCallback(
    async (options: EmergencyAccessOptions): Promise<void> => {
      setLoading(true);
      setError(null);

      try {
        await blockroll.files.setupEmergencyAccess(options);
      } catch (err: any) {
        const errorMessage = err.message || 'Setup failed';
        setError(errorMessage);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [blockroll]
  );

  return {
    uploadFile,
    shareFile,
    downloadFile,
    revokeAccess,
    deleteFile,
    setupEmergencyAccess,
    loading,
    error,
  };
}

