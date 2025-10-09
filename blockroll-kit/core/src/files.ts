/**
 * BlockRoll File Operations
 * Handles file upload, download, sharing, and management
 */

import { BlockRollClient } from './client';
import {
  UploadOptions,
  UploadResult,
  ListFilesOptions,
  FileList,
  FileMetadata,
  ShareOptions,
  ShareResult,
  RevokeOptions,
  EmergencyAccessOptions,
} from './types';

export class FileOperations {
  constructor(private client: BlockRollClient) {}

  /**
   * Upload a file
   */
  async upload(options: UploadOptions): Promise<UploadResult> {
    const additionalData: Record<string, any> = {
      accessType: options.accessType,
      encryption: options.encryption ?? true,
    };

    if (options.expiryDate) {
      additionalData.expiryDate = options.expiryDate.toISOString();
    }

    if (options.tags && options.tags.length > 0) {
      additionalData.tags = JSON.stringify(options.tags);
    }

    if (options.metadata) {
      additionalData.metadata = JSON.stringify(options.metadata);
    }

    const result = await this.client.upload<{ file: UploadResult }>(
      '/file/upload',
      options.file,
      additionalData,
      options.onProgress
    );

    return result.file;
  }

  /**
   * List user's files
   */
  async list(options: ListFilesOptions = {}): Promise<FileList> {
    const params: any = {
      page: options.page || 1,
      limit: options.limit || 20,
    };

    if (options.status) {
      params.status = options.status;
    }

    if (options.tags && options.tags.length > 0) {
      params.tags = options.tags.join(',');
    }

    if (options.search) {
      params.search = options.search;
    }

    const response = await this.client.get<{ files: FileList }>('/file/my-files', params);
    return response.files;
  }

  /**
   * Get file by ID
   */
  async getById(fileId: string): Promise<FileMetadata> {
    const response = await this.client.get<{ file: FileMetadata }>(`/file/${fileId}`);
    return response.file;
  }

  /**
   * Download file as Blob
   */
  async download(fileId: string): Promise<Blob> {
    // Use direct fetch for blob download
    const response = await fetch(`${this.client.baseURL}/file/${fileId}/download`, {
      headers: {
        'x-api-key': this.client.getApiKey(),
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || 'Download failed');
    }

    return response.blob();
  }

  /**
   * Share file with another wallet
   */
  async share(options: ShareOptions): Promise<ShareResult> {
    const data: any = {
      recipientWallet: options.recipientWallet,
      accessLevel: options.accessLevel,
    };

    if (options.expiryDate) {
      data.expiryDate = options.expiryDate.toISOString();
    }

    const response = await this.client.post<ShareResult>(
      `/file/${options.fileId}/share`,
      data
    );

    return response;
  }

  /**
   * Revoke access from a wallet
   */
  async revokeAccess(options: RevokeOptions): Promise<void> {
    await this.client.post(`/file/${options.fileId}/revoke`, {
      wallet: options.wallet,
    });
  }

  /**
   * Delete a file
   */
  async delete(fileId: string): Promise<void> {
    await this.client.delete(`/file/${fileId}`);
  }

  /**
   * Setup emergency access for a file
   */
  async setupEmergencyAccess(options: EmergencyAccessOptions): Promise<void> {
    await this.client.post(`/file/${options.fileId}/emergency-access`, {
      trustedContacts: options.trustedContacts,
      scope: options.scope,
    });
  }

  /**
   * Get shared files (files shared with you)
   */
  async getSharedFiles(options: ListFilesOptions = {}): Promise<FileList> {
    const params: any = {
      page: options.page || 1,
      limit: options.limit || 20,
    };

    const response = await this.client.get<{ files: FileList }>('/file/shared-with-me', params);
    return response.files;
  }

  /**
   * Get files shared by you
   */
  async getFilesSharedByMe(options: ListFilesOptions = {}): Promise<FileList> {
    const params: any = {
      page: options.page || 1,
      limit: options.limit || 20,
    };

    const response = await this.client.get<{ files: FileList }>('/file/shared-by-me', params);
    return response.files;
  }
}

