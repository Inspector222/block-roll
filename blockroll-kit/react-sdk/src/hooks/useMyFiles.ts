/**
 * useMyFiles React hook
 * Fetches and manages user's files with real-time updates
 */

import { useState, useEffect, useCallback } from 'react';
import { useBlockRollContext } from '../provider';
import type { ListFilesOptions, FileList, FileMetadata } from '@blockroll/core';

export function useMyFiles(options: ListFilesOptions = {}) {
  const { blockroll } = useBlockRollContext();
  const [files, setFiles] = useState<FileList>({
    data: [],
    total: 0,
    page: options.page || 1,
    limit: options.limit || 20,
    hasMore: false,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFiles = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await blockroll.files.list(options);
      setFiles(result);
    } catch (err: any) {
      setError(err.message || 'Failed to load files');
    } finally {
      setLoading(false);
    }
  }, [blockroll, options]);

  // Initial fetch
  useEffect(() => {
    fetchFiles();
  }, [fetchFiles]);

  // Listen for real-time file updates
  useEffect(() => {
    const unsubscribeUploaded = blockroll.websocket.on('file:uploaded', (file: FileMetadata) => {
      setFiles((prev) => ({
        ...prev,
        data: [file, ...prev.data],
        total: prev.total + 1,
      }));
    });

    const unsubscribeShared = blockroll.websocket.on('file:shared', (data) => {
      // Refresh files when a file is shared with you
      fetchFiles();
    });

    return () => {
      unsubscribeUploaded();
      unsubscribeShared();
    };
  }, [blockroll, fetchFiles]);

  return {
    files,
    loading,
    error,
    refetch: fetchFiles,
  };
}

