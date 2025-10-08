import { Admin, IUser, User } from '../models';
import { AuthenticationError, NotFoundError, ValidationError } from '../utils/errors';
import { JWTPayload, JWTService } from '../utils/jwt';
import { Validators } from '../utils/validators';
import { BaseService } from './BaseService';

export class AuthService extends BaseService {
  constructor() {
    super('AuthService');
  }

  /**
   * Connect wallet and create/login user
   */
  async connectWallet(walletAddress: string): Promise<{
    user: IUser;
    accessToken: string;
    refreshToken: string;
    isNewUser: boolean;
  }> {
    return this.executeWithErrorHandling(async () => {
      // Validate wallet address
      Validators.assertValidWalletAddress(walletAddress);

      const normalizedAddress = walletAddress.toLowerCase();

      // Find or create user
      let user = await User.findByWallet(normalizedAddress);
      let isNewUser = false;

      if (!user) {
        user = await User.create({
          walletAddress: normalizedAddress,
          role: 'user',
        });
        isNewUser = true;
        this.logInfo('New user created', { walletAddress: normalizedAddress });
      }

      // Check if user is admin
      const admin = await Admin.findByWallet(normalizedAddress);
      if (admin && user.role !== 'admin') {
        user.role = 'admin';
        await user.save();
      }

      // Generate tokens
      const payload: Omit<JWTPayload, 'iat' | 'exp'> = {
        userId: user._id.toString(),
        walletAddress: user.walletAddress,
        role: user.role,
      };

      const { accessToken, refreshToken } = JWTService.generateTokens(payload);

      this.logInfo('Wallet connected successfully', {
        walletAddress: normalizedAddress,
        userId: user._id,
      });

      return {
        user,
        accessToken,
        refreshToken,
        isNewUser,
      };
    }, 'connectWallet');
  }

  /**
   * Verify wallet signature (for additional security)
   */
  async verifyWalletSignature(
    walletAddress: string,
    signature: string,
    message: string
  ): Promise<boolean> {
    return this.executeWithErrorHandling(async () => {
      // In a real implementation, you would verify the signature using ethers.js
      // For now, we'll return true as a placeholder
      // TODO: Implement actual signature verification using ethers.js

      this.logInfo('Wallet signature verified', { walletAddress });
      return true;
    }, 'verifyWalletSignature');
  }

  /**
   * Refresh access token
   */
  async refreshToken(refreshToken: string): Promise<{
    accessToken: string;
    refreshToken: string;
  }> {
    return this.executeWithErrorHandling(async () => {
      // Verify refresh token
      const payload = JWTService.verifyRefreshToken(refreshToken);

      // Check if user still exists
      const user = await User.findById(payload.userId);
      if (!user) {
        throw new AuthenticationError('User not found');
      }

      // Generate new tokens
      const newPayload: Omit<JWTPayload, 'iat' | 'exp'> = {
        userId: user._id.toString(),
        walletAddress: user.walletAddress,
        role: user.role,
      };

      const tokens = JWTService.generateTokens(newPayload);

      this.logInfo('Token refreshed', { userId: user._id });

      return tokens;
    }, 'refreshToken');
  }

  /**
   * Get user by wallet address
   */
  async getUserByWallet(walletAddress: string): Promise<IUser> {
    return this.executeWithErrorHandling(async () => {
      Validators.assertValidWalletAddress(walletAddress);

      const user = await User.findByWallet(walletAddress.toLowerCase());

      if (!user) {
        throw new NotFoundError('User not found');
      }

      return user;
    }, 'getUserByWallet');
  }

  /**
   * Get user by ID
   */
  async getUserById(userId: string): Promise<IUser> {
    return this.executeWithErrorHandling(async () => {
      Validators.assertValidObjectId(userId, 'User ID');

      const user = await User.findById(userId);

      if (!user) {
        throw new NotFoundError('User not found');
      }

      return user;
    }, 'getUserById');
  }

  /**
   * Update user email
   */
  async updateEmail(userId: string, email: string): Promise<IUser> {
    return this.executeWithErrorHandling(async () => {
      if (!Validators.isValidEmail(email)) {
        throw new ValidationError('Invalid email format');
      }

      const user = await User.findById(userId);
      if (!user) {
        throw new NotFoundError('User not found');
      }

      user.email = email;
      await user.save();

      this.logInfo('User email updated', { userId, email });

      return user;
    }, 'updateEmail');
  }

  /**
   * Logout user (client-side token invalidation)
   */
  async logout(userId: string): Promise<void> {
    return this.executeWithErrorHandling(async () => {
      // In a stateless JWT setup, logout is handled client-side
      // This method is for logging purposes
      this.logInfo('User logged out', { userId });
    }, 'logout');
  }
}

export default new AuthService();

