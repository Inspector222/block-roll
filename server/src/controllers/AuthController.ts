import { Request, Response } from 'express';
import { BaseController } from './BaseController';
import { AuthService } from '../services';
import { ValidationError } from '../utils/errors';

export class AuthController extends BaseController {
  /**
   * Connect wallet
   * POST /auth/connect-wallet
   */
  connectWallet = this.catchAsync(async (req: Request, res: Response) => {
    const { walletAddress, signature, message } = req.body;

    if (!walletAddress) {
      throw new ValidationError('Wallet address is required');
    }

    // Optional: Verify signature if provided
    if (signature && message) {
      await AuthService.verifyWalletSignature(walletAddress, signature, message);
    }

    const result = await AuthService.connectWallet(walletAddress);

    return this.sendSuccess(
      res,
      {
        user: result.user,
        accessToken: result.accessToken,
        refreshToken: result.refreshToken,
        isNewUser: result.isNewUser,
      },
      result.isNewUser ? 'Account created successfully' : 'Logged in successfully'
    );
  });

  /**
   * Refresh token
   * POST /auth/refresh
   */
  refreshToken = this.catchAsync(async (req: Request, res: Response) => {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      throw new ValidationError('Refresh token is required');
    }

    const tokens = await AuthService.refreshToken(refreshToken);

    return this.sendSuccess(res, tokens, 'Token refreshed successfully');
  });

  /**
   * Verify session
   * GET /auth/verify-session
   */
  verifySession = this.catchAsync(async (req: Request, res: Response) => {
    const userId = this.getUserId(req);

    const user = await AuthService.getUserById(userId);

    return this.sendSuccess(res, { user }, 'Session verified');
  });

  /**
   * Update user email
   * PATCH /auth/email
   */
  updateEmail = this.catchAsync(async (req: Request, res: Response) => {
    const userId = this.getUserId(req);
    const { email } = req.body;

    if (!email) {
      throw new ValidationError('Email is required');
    }

    const user = await AuthService.updateEmail(userId, email);

    return this.sendSuccess(res, { user }, 'Email updated successfully');
  });

  /**
   * Logout
   * POST /auth/logout
   */
  logout = this.catchAsync(async (req: Request, res: Response) => {
    const userId = this.getUserId(req);

    await AuthService.logout(userId);

    return this.sendSuccess(res, null, 'Logged out successfully');
  });

  /**
   * Get current user
   * GET /auth/me
   */
  getCurrentUser = this.catchAsync(async (req: Request, res: Response) => {
    const userId = this.getUserId(req);

    const user = await AuthService.getUserById(userId);

    return this.sendSuccess(res, { user });
  });
}

export default new AuthController();

