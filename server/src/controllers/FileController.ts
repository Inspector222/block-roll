import { Request, Response } from 'express';
import { BaseController } from './BaseController';
import { FileService } from '../services';
import { ValidationError } from '../utils/errors';

export class FileController extends BaseController {
  /**
   * Upload file
   * POST /file/upload
   */
  uploadFile = this.catchAsync(async (req: Request, res: Response) => {
    const userId = this.getUserId(req);
    const { fileName, fileType, receiver, expiryDate, workspace, metadata } = req.body;

    if (!req.file) {
      throw new ValidationError('File is required');
    }

    if (!fileName || !receiver) {
      throw new ValidationError('File name and receiver are required');
    }

    const result = await FileService.uploadFile(userId, {
      fileName,
      fileType: fileType || req.file.mimetype,
      fileBuffer: req.file.buffer,
      receiver,
      expiryDate: expiryDate ? new Date(expiryDate) : undefined,
      workspace,
      metadata,
    });

    return this.sendCreated(
      res,
      {
        file: result.file,
      },
      'File uploaded successfully'
    );
  });

  /**
   * Get file by ID
   * GET /file/:id
   */
  getFileById = this.catchAsync(async (req: Request, res: Response) => {
    const userId = this.getUserId(req);
    const { id } = req.params;

    const file = await FileService.getFileById(id, userId);

    return this.sendSuccess(res, { file });
  });

  /**
   * Get user's files
   * GET /file/my-files
   */
  getMyFiles = this.catchAsync(async (req: Request, res: Response) => {
    const userId = this.getUserId(req);
    const { page, limit } = this.extractPaginationParams(req.query);

    const result = await FileService.getFilesByOwner(userId, page, limit);

    return this.sendPaginated(
      res,
      result.files,
      page,
      limit,
      result.total,
      'Files retrieved successfully'
    );
  });

  /**
   * Share file
   * POST /file/:id/share
   */
  shareFile = this.catchAsync(async (req: Request, res: Response) => {
    const userId = this.getUserId(req);
    const { id } = req.params;
    const { recipientWallet } = req.body;

    if (!recipientWallet) {
      throw new ValidationError('Recipient wallet is required');
    }

    const file = await FileService.shareFile(id, userId, recipientWallet);

    return this.sendSuccess(res, { file }, 'File shared successfully');
  });

  /**
   * Revoke file access
   * POST /file/:id/revoke
   */
  revokeAccess = this.catchAsync(async (req: Request, res: Response) => {
    const userId = this.getUserId(req);
    const { id } = req.params;
    const { walletAddress } = req.body;

    const file = await FileService.revokeAccess(id, userId, walletAddress);

    return this.sendSuccess(res, { file }, 'Access revoked successfully');
  });

  /**
   * Delete file
   * DELETE /file/:id
   */
  deleteFile = this.catchAsync(async (req: Request, res: Response) => {
    const userId = this.getUserId(req);
    const { id } = req.params;

    await FileService.deleteFile(id, userId);

    return this.sendSuccess(res, null, 'File deleted successfully');
  });

  /**
   * Enable emergency access
   * POST /file/:id/emergency-access
   */
  enableEmergencyAccess = this.catchAsync(async (req: Request, res: Response) => {
    const userId = this.getUserId(req);
    const { id } = req.params;
    const { backupWallets, inactivityPeriod } = req.body;

    if (!backupWallets || !Array.isArray(backupWallets)) {
      throw new ValidationError('Backup wallets array is required');
    }

    if (!inactivityPeriod) {
      throw new ValidationError('Inactivity period is required');
    }

    const file = await FileService.enableEmergencyAccess(
      id,
      userId,
      backupWallets,
      inactivityPeriod
    );

    return this.sendSuccess(res, { file }, 'Emergency access enabled');
  });
}

export default new FileController();

