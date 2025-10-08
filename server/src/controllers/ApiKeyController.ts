import { Request, Response } from 'express';
import { BaseController } from './BaseController';
import { ApiKeyService } from '../services';
import { ValidationError } from '../utils/errors';

export class ApiKeyController extends BaseController {
  /**
   * Create API key
   * POST /sdk/create
   */
  createApiKey = this.catchAsync(async (req: Request, res: Response) => {
    const userId = this.getUserId(req);
    const { sdkType, permissions, expiresAt, metadata } = req.body;

    if (!sdkType) {
      throw new ValidationError('SDK type is required');
    }

    const result = await ApiKeyService.createApiKey(userId, {
      sdkType,
      permissions,
      expiresAt: expiresAt ? new Date(expiresAt) : undefined,
      metadata,
    });

    return this.sendCreated(
      res,
      {
        apiKey: result.apiKey,
        key: result.key, // Only returned once
      },
      'API key created successfully. Save this key securely - it will not be shown again.'
    );
  });

  /**
   * Get user's API keys
   * GET /sdk/my-keys
   */
  getMyApiKeys = this.catchAsync(async (req: Request, res: Response) => {
    const userId = this.getUserId(req);

    const apiKeys = await ApiKeyService.getApiKeysByOwner(userId);

    return this.sendSuccess(res, { apiKeys }, 'API keys retrieved successfully');
  });

  /**
   * Revoke API key
   * DELETE /sdk/revoke/:id
   */
  revokeApiKey = this.catchAsync(async (req: Request, res: Response) => {
    const userId = this.getUserId(req);
    const { id } = req.params;

    await ApiKeyService.revokeApiKey(id, userId);

    return this.sendSuccess(res, null, 'API key revoked successfully');
  });

  /**
   * Update API key permissions
   * PATCH /sdk/:id/permissions
   */
  updatePermissions = this.catchAsync(async (req: Request, res: Response) => {
    const userId = this.getUserId(req);
    const { id } = req.params;
    const { permissions } = req.body;

    if (!permissions || !Array.isArray(permissions)) {
      throw new ValidationError('Permissions array is required');
    }

    const apiKey = await ApiKeyService.updatePermissions(id, userId, permissions);

    return this.sendSuccess(res, { apiKey }, 'Permissions updated successfully');
  });

  /**
   * Get API key usage stats
   * GET /sdk/:id/stats
   */
  getUsageStats = this.catchAsync(async (req: Request, res: Response) => {
    const userId = this.getUserId(req);
    const { id } = req.params;

    const stats = await ApiKeyService.getUsageStats(id, userId);

    return this.sendSuccess(res, { stats }, 'Usage stats retrieved successfully');
  });

  /**
   * Verify API key (for SDK/CDN use)
   * POST /sdk/verify
   */
  verifyApiKey = this.catchAsync(async (req: Request, res: Response) => {
    const apiKey = req.headers['x-api-key'] as string;

    if (!apiKey) {
      throw new ValidationError('API key is required');
    }

    const result = await ApiKeyService.verifyApiKey(apiKey);

    return this.sendSuccess(
      res,
      {
        valid: true,
        permissions: result.permissions,
        sdkType: result.sdkType,
      },
      'API key is valid'
    );
  });
}

export default new ApiKeyController();

