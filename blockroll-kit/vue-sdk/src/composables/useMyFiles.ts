/**
 * useMyFiles Vue composable
 * Fetches and manages user's files with real-time updates
 */

import { ref, onMounted, onUnmounted } from 'vue';
import { useBlockRollCore } from '../plugin';
import type { ListFilesOptions, FileList, FileMetadata } from '@blockroll/core';

export function useMyFiles(options: ListFilesOptions = {}) {
  const blockroll = useBlockRollCore();
  const files = ref<FileList>({
    data: [],
    total: 0,
    page: options.page || 1,
    limit: options.limit || 20,
    hasMore: false,
  });
  const loading = ref(true);
  const error = ref<string | null>(null);

  const fetchFiles = async () => {
    loading.value = true;
    error.value = null;

    try {
      const result = await blockroll.files.list(options);
      files.value = result;
    } catch (err: any) {
      error.value = err.message || 'Failed to load files';
    } finally {
      loading.value = false;
    }
  };

  onMounted(() => {
    fetchFiles();

    // Listen for real-time updates
    const unsubscribeUploaded = blockroll.websocket.on('file:uploaded', (file: FileMetadata) => {
      files.value = {
        ...files.value,
        data: [file, ...files.value.data],
        total: files.value.total + 1,
      };
    });

    const unsubscribeShared = blockroll.websocket.on('file:shared', () => {
      fetchFiles();
    });

    onUnmounted(() => {
      unsubscribeUploaded();
      unsubscribeShared();
    });
  });

  return {
    files,
    loading,
    error,
    refetch: fetchFiles,
  };
}

