import { ApiKey, IApiKey, User } from '../models';
import { AuthorizationError, ConflictError, NotFoundError } from '../utils/errors';
import { Validators } from '../utils/validators';
import { BaseService } from './BaseService';

export interface CreateApiKeyData {
  sdkType: 'react' | 'vue' | 'cdn' | 'custom';
  permissions?: string[];
  expiresAt?: Date;
  metadata?: Record<string, any>;
}

export class ApiKeyService extends BaseService {
  constructor() {
    super('ApiKeyService');
  }

  /**
   * Create API key for user
   */
  async createApiKey(
    ownerId: string,
    data: CreateApiKeyData
  ): Promise<{ apiKey: IApiKey; key: string }> {
    return this.executeWithErrorHandling(async () => {
      const owner = await User.findById(ownerId);
      if (!owner) {
        throw new NotFoundError('User not found');
      }

      // Create API key
      const apiKey = new ApiKey({
        owner: ownerId,
        sdkType: data.sdkType,
        permissions: data.permissions || ['upload', 'read'],
        expiresAt: data.expiresAt,
        metadata: data.metadata,
      });

      // Generate the key (will be hashed in pre-save hook)
      const key = apiKey.generateKey();
      await apiKey.save();

      // Add to user's API keys
      owner.apiKeys.push(apiKey._id);
      await owner.save();

      this.logInfo('API key created', {
        ownerId,
        apiKeyId: apiKey._id,
        sdkType: data.sdkType,
      });

      // Return key only once (won't be retrievable again)
      return { apiKey, key };
    }, 'createApiKey');
  }

  /**
   * Verify API key
   */
  async verifyApiKey(key: string): Promise<IApiKey> {
    return this.executeWithErrorHandling(async () => {
      const apiKey = await ApiKey.findByKey(key);

      if (!apiKey) {
        throw new NotFoundError('Invalid API key');
      }

      if (apiKey.isExpired) {
        throw new AuthorizationError('API key has expired');
      }

      return apiKey;
    }, 'verifyApiKey');
  }

  /**
   * Get API keys by owner
   */
  async getApiKeysByOwner(ownerId: string): Promise<IApiKey[]> {
    return this.executeWithErrorHandling(async () => {
      const apiKeys = await ApiKey.findActiveByOwner(ownerId as any);
      return apiKeys;
    }, 'getApiKeysByOwner');
  }

  /**
   * Revoke API key
   */
  async revokeApiKey(apiKeyId: string, ownerId: string): Promise<void> {
    return this.executeWithErrorHandling(async () => {
      const apiKey = await ApiKey.findById(apiKeyId);

      if (!apiKey) {
        throw new NotFoundError('API key not found');
      }

      if (apiKey.owner.toString() !== ownerId) {
        throw new AuthorizationError('Only owner can revoke API key');
      }

      apiKey.active = false;
      await apiKey.save();

      this.logInfo('API key revoked', { apiKeyId, ownerId });
    }, 'revokeApiKey');
  }

  /**
   * Update API key permissions
   */
  async updatePermissions(
    apiKeyId: string,
    ownerId: string,
    permissions: string[]
  ): Promise<IApiKey> {
    return this.executeWithErrorHandling(async () => {
      const apiKey = await ApiKey.findById(apiKeyId);

      if (!apiKey) {
        throw new NotFoundError('API key not found');
      }

      if (apiKey.owner.toString() !== ownerId) {
        throw new AuthorizationError('Only owner can update permissions');
      }

      // Validate permissions
      permissions.forEach((perm) => {
        if (!Validators.isValidPermission(perm)) {
          throw new ConflictError(`Invalid permission: ${perm}`);
        }
      });

      apiKey.permissions = permissions;
      await apiKey.save();

      this.logInfo('API key permissions updated', { apiKeyId, permissions });

      return apiKey;
    }, 'updatePermissions');
  }

  /**
   * Get API key usage stats
   */
  async getUsageStats(apiKeyId: string, ownerId: string): Promise<{
    usageCount: number;
    lastUsed?: Date;
    createdAt: Date;
  }> {
    return this.executeWithErrorHandling(async () => {
      const apiKey = await ApiKey.findById(apiKeyId);

      if (!apiKey) {
        throw new NotFoundError('API key not found');
      }

      if (apiKey.owner.toString() !== ownerId) {
        throw new AuthorizationError('Only owner can view stats');
      }

      return {
        usageCount: apiKey.usageCount,
        lastUsed: apiKey.lastUsed,
        createdAt: apiKey.createdAt,
      };
    }, 'getUsageStats');
  }

  /**
   * Revoke all expired API keys (cron job)
   */
  async revokeExpiredKeys(): Promise<number> {
    return this.executeWithErrorHandling(async () => {
      const count = await ApiKey.revokeExpired();

      this.logInfo('Expired API keys revoked', { count });

      return count;
    }, 'revokeExpiredKeys');
  }
}

export default new ApiKeyService();

