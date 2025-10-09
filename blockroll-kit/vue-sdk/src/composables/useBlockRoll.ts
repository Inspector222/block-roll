/**
 * useBlockRoll Vue composable
 * Provides access to file operations
 */

import { ref } from 'vue';
import { useBlockRollCore } from '../plugin';
import type {
  UploadOptions,
  UploadResult,
  ShareOptions,
  ShareResult,
  RevokeOptions,
  EmergencyAccessOptions,
} from '@blockroll/core';

export function useBlockRoll() {
  const blockroll = useBlockRollCore();
  const loading = ref(false);
  const error = ref<string | null>(null);

  const uploadFile = async (options: UploadOptions): Promise<UploadResult> => {
    loading.value = true;
    error.value = null;

    try {
      const result = await blockroll.files.upload(options);
      return result;
    } catch (err: any) {
      error.value = err.message || 'Upload failed';
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const shareFile = async (options: ShareOptions): Promise<ShareResult> => {
    loading.value = true;
    error.value = null;

    try {
      const result = await blockroll.files.share(options);
      return result;
    } catch (err: any) {
      error.value = err.message || 'Share failed';
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const downloadFile = async (fileId: string): Promise<Blob> => {
    loading.value = true;
    error.value = null;

    try {
      const blob = await blockroll.files.download(fileId);
      return blob;
    } catch (err: any) {
      error.value = err.message || 'Download failed';
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const revokeAccess = async (options: RevokeOptions): Promise<void> => {
    loading.value = true;
    error.value = null;

    try {
      await blockroll.files.revokeAccess(options);
    } catch (err: any) {
      error.value = err.message || 'Revoke failed';
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const deleteFile = async (fileId: string): Promise<void> => {
    loading.value = true;
    error.value = null;

    try {
      await blockroll.files.delete(fileId);
    } catch (err: any) {
      error.value = err.message || 'Delete failed';
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const setupEmergencyAccess = async (options: EmergencyAccessOptions): Promise<void> => {
    loading.value = true;
    error.value = null;

    try {
      await blockroll.files.setupEmergencyAccess(options);
    } catch (err: any) {
      error.value = err.message || 'Setup failed';
      throw err;
    } finally {
      loading.value = false;
    }
  };

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

