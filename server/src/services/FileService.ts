import mongoose from 'mongoose';
import { File, IFile, Notification, User } from '../models';
import { EncryptionService } from '../utils/encryption';
import {
    AuthorizationError,
    NotFoundError
} from '../utils/errors';
import { Validators } from '../utils/validators';
import { BaseService } from './BaseService';
import BlockchainService from './BlockchainService';
import SocketService from './SocketService';

export interface UploadFileData {
  fileName: string;
  fileType: string;
  fileBuffer: Buffer;
  receiver: string;
  expiryDate?: Date;
  workspace?: string;
  metadata?: Record<string, any>;
}

export class FileService extends BaseService {
  constructor() {
    super('FileService');
  }

  /**
   * Upload and encrypt file
   */
  async uploadFile(
    ownerId: string,
    data: UploadFileData
  ): Promise<{ file: IFile; encryptedBuffer: Buffer }> {
    return this.executeWithErrorHandling(async () => {
      // Validate owner
      const owner = await User.findById(ownerId);
      if (!owner) {
        throw new NotFoundError('Owner not found');
      }

      // Validate receiver wallet address
      Validators.assertValidWalletAddress(data.receiver);

      // Encrypt file
      const { encryptedBuffer, iv, authTag, fileHash } =
        EncryptionService.encryptFile(data.fileBuffer);

      // Generate encrypted hash for storage
      const encryptedHash = EncryptionService.hash(
        `${fileHash}_${iv}_${authTag}`
      );

      // Create encryption key reference
      const encryptionKeyRef = EncryptionService.hash(`${iv}_${authTag}`);

      // Create file record
      const file = await File.create({
        owner: ownerId,
        fileName: data.fileName,
        fileType: data.fileType,
        encryptedHash,
        fileHash,
        size: data.fileBuffer.length,
        encryptionKeyRef,
        receiver: data.receiver.toLowerCase(),
        accessList: [data.receiver.toLowerCase()],
        expiryDate: data.expiryDate,
        workspace: data.workspace,
        metadata: {
          ...data.metadata,
          iv,
          authTag,
        },
        status: 'active',
      });

      // Register file on blockchain
      try {
        const blockchainResult = await BlockchainService.uploadFile({
          fileHash,
          receiver: data.receiver,
          expiryDate: data.expiryDate
            ? Math.floor(data.expiryDate.getTime() / 1000)
            : undefined,
          encryptedKeyRef: encryptionKeyRef,
        });

        // Update file with blockchain data
        file.metadata.blockchainFileId = blockchainResult.fileId;
        file.metadata.blockchainTxHash = blockchainResult.txHash;
        await file.save();

        this.logInfo('File registered on blockchain', {
          fileId: file._id,
          blockchainFileId: blockchainResult.fileId,
          txHash: blockchainResult.txHash,
        });
      } catch (error) {
        this.logError('Failed to register file on blockchain', {
          fileId: file._id,
          error: error instanceof Error ? error.message : 'Unknown error',
        });
        // Continue with file upload even if blockchain fails
        // You can decide to fail the entire upload or just log the error
      }

      // Create notification for receiver
      await Notification.create({
        user: ownerId,
        type: 'file_uploaded',
        title: 'File Uploaded',
        message: `File "${data.fileName}" uploaded successfully`,
        priority: 'medium',
        data: { fileId: file._id },
      });

      // Send real-time events via WebSocket
      await SocketService.notifyFileUploaded(ownerId, {
        fileId: file._id.toString(),
        fileName: data.fileName,
        owner: ownerId,
        receiver: data.receiver,
        action: 'uploaded',
        timestamp: new Date().toISOString(),
      });

      // Notify receiver via WebSocket
      await SocketService.notifyFileShared(ownerId, data.receiver, {
        fileId: file._id.toString(),
        fileName: data.fileName,
        owner: ownerId,
        receiver: data.receiver,
        action: 'shared',
        timestamp: new Date().toISOString(),
      });

      // Notify admins
      await SocketService.notifyAdminFileUploaded({
        fileId: file._id.toString(),
        fileName: data.fileName,
        owner: ownerId,
        action: 'uploaded',
        timestamp: new Date().toISOString(),
      });

      this.logInfo('File uploaded successfully with real-time notifications', {
        fileId: file._id,
        ownerId,
        fileName: data.fileName,
      });

      return { file, encryptedBuffer };
    }, 'uploadFile');
  }

  /**
   * Get file by ID
   */
  async getFileById(fileId: string, userId: string): Promise<IFile> {
    return this.executeWithErrorHandling(async () => {
      Validators.assertValidObjectId(fileId, 'File ID');

      const file = await File.findById(fileId).populate('owner workspace');

      if (!file) {
        throw new NotFoundError('File not found');
      }

      // Check access
      const user = await User.findById(userId);
      if (!user) {
        throw new NotFoundError('User not found');
      }

      if (
        file.owner._id.toString() !== userId &&
        !file.hasAccess(user.walletAddress)
      ) {
        throw new AuthorizationError('No access to this file');
      }

      return file;
    }, 'getFileById');
  }

  /**
   * Get files by owner
   */
  async getFilesByOwner(
    ownerId: string,
    page: number = 1,
    limit: number = 20
  ): Promise<{ files: IFile[]; total: number }> {
    return this.executeWithErrorHandling(async () => {
      const skip = (page - 1) * limit;

      const [files, total] = await Promise.all([
        File.findByOwner(new mongoose.Types.ObjectId(ownerId))
          .skip(skip)
          .limit(limit)
          .sort({ createdAt: -1 }),
        File.countDocuments({ owner: ownerId, status: 'active' }),
      ]);

      return { files, total };
    }, 'getFilesByOwner');
  }

  /**
   * Share file with another wallet
   */
  async shareFile(
    fileId: string,
    ownerId: string,
    recipientWallet: string
  ): Promise<IFile> {
    return this.executeWithErrorHandling(async () => {
      Validators.assertValidWalletAddress(recipientWallet);

      const file = await File.findById(fileId);
      if (!file) {
        throw new NotFoundError('File not found');
      }

      // Verify ownership
      if (file.owner.toString() !== ownerId) {
        throw new AuthorizationError('Only file owner can share');
      }

      // Add to access list
      file.grantAccess(recipientWallet);
      await file.save();

      // Create notification for recipient
      const recipient = await User.findByWallet(recipientWallet.toLowerCase());
      if (recipient) {
        await Notification.create({
          user: recipient._id,
          type: 'file_shared',
          title: 'File Shared With You',
          message: `A file "${file.fileName}" has been shared with you`,
          priority: 'medium',
          data: { fileId: file._id },
        });
      }

      // Send real-time WebSocket events
      await SocketService.notifyFileShared(ownerId, recipientWallet, {
        fileId: file._id.toString(),
        fileName: file.fileName,
        owner: ownerId,
        receiver: recipientWallet,
        action: 'shared',
        timestamp: new Date().toISOString(),
      });

      this.logInfo('File shared with real-time notification', {
        fileId,
        ownerId,
        recipientWallet,
      });

      return file;
    }, 'shareFile');
  }

  /**
   * Revoke file access
   */
  async revokeAccess(
    fileId: string,
    ownerId: string,
    walletAddress?: string
  ): Promise<IFile> {
    return this.executeWithErrorHandling(async () => {
      const file = await File.findById(fileId);
      if (!file) {
        throw new NotFoundError('File not found');
      }

      // Verify ownership
      if (file.owner.toString() !== ownerId) {
        throw new AuthorizationError('Only file owner can revoke access');
      }

      if (walletAddress) {
        // Revoke specific wallet
        file.revokeAccess(walletAddress);
      } else {
        // Revoke all access
        file.status = 'revoked';
        file.accessList = [];
      }

      await file.save();

      this.logInfo('File access revoked', { fileId, ownerId, walletAddress });

      return file;
    }, 'revokeAccess');
  }

  /**
   * Delete file
   */
  async deleteFile(fileId: string, ownerId: string): Promise<void> {
    return this.executeWithErrorHandling(async () => {
      const file = await File.findById(fileId);
      if (!file) {
        throw new NotFoundError('File not found');
      }

      // Verify ownership
      if (file.owner.toString() !== ownerId) {
        throw new AuthorizationError('Only file owner can delete');
      }

      await file.deleteOne();

      this.logInfo('File deleted', { fileId, ownerId });
    }, 'deleteFile');
  }

  /**
   * Enable emergency access
   */
  async enableEmergencyAccess(
    fileId: string,
    ownerId: string,
    backupWallets: string[],
    inactivityPeriod: number
  ): Promise<IFile> {
    return this.executeWithErrorHandling(async () => {
      const file = await File.findById(fileId);
      if (!file) {
        throw new NotFoundError('File not found');
      }

      if (file.owner.toString() !== ownerId) {
        throw new AuthorizationError('Only file owner can enable emergency access');
      }

      // Validate backup wallets
      backupWallets.forEach((wallet) => {
        Validators.assertValidWalletAddress(wallet);
      });

      file.emergencyAccess = {
        enabled: true,
        backupWallets: backupWallets.map((w) => w.toLowerCase()),
        inactivityPeriod,
      };

      await file.save();

      this.logInfo('Emergency access enabled', { fileId, ownerId });

      return file;
    }, 'enableEmergencyAccess');
  }

  /**
   * Get files expiring soon
   */
  async getExpiringFiles(days: number = 7): Promise<IFile[]> {
    return this.executeWithErrorHandling(async () => {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + days);

      const files = await File.find({
        expiryDate: {
          $gte: new Date(),
          $lte: futureDate,
        },
        status: 'active',
      });

      return files;
    }, 'getExpiringFiles');
  }

  /**
   * Mark expired files
   */
  async markExpiredFiles(): Promise<number> {
    return this.executeWithErrorHandling(async () => {
      const expiredFiles = await File.findExpiredFiles();

      const updatePromises = expiredFiles.map(async (file) => {
        file.status = 'expired';
        await file.save();

        // Notify owner
        await Notification.create({
          user: file.owner,
          type: 'file_expired',
          title: 'File Expired',
          message: `File "${file.fileName}" has expired`,
          priority: 'low',
          data: { fileId: file._id },
        });
      });

      await Promise.all(updatePromises);

      this.logInfo('Expired files marked', { count: expiredFiles.length });

      return expiredFiles.length;
    }, 'markExpiredFiles');
  }
}

export default new FileService();

