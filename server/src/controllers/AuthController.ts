import { Request, Response } from 'express';
import config from '../config';
import { AuthService } from '../services';
import { ValidationError } from '../utils/errors';
import { BaseController } from './BaseController';

export class AuthController extends BaseController {
  /**
   * Set authentication cookies
   */
  private setAuthCookies(res: Response, accessToken: string, refreshToken: string): void {
    // Set access token cookie (httpOnly)
    res.cookie('accessToken', accessToken, {
      httpOnly: config.cookie.httpOnly,
      secure: config.cookie.secure,
      sameSite: config.cookie.sameSite,
      maxAge: config.cookie.maxAge,
      path: '/',
    });

    // Set refresh token cookie (httpOnly)
    res.cookie('refreshToken', refreshToken, {
      httpOnly: config.cookie.httpOnly,
      secure: config.cookie.secure,
      sameSite: config.cookie.sameSite,
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
      path: '/',
    });
  }

  /**
   * Clear authentication cookies
   */
  private clearAuthCookies(res: Response): void {
    res.clearCookie('accessToken', { path: '/' });
    res.clearCookie('refreshToken', { path: '/' });
  }

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

    // Set httpOnly cookies
    this.setAuthCookies(res, result.accessToken, result.refreshToken);

    return this.sendSuccess(
      res,
      {
        user: result.user,
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
    // Get refresh token from cookie
    const refreshToken = req.cookies?.refreshToken;

    if (!refreshToken) {
      throw new ValidationError('Refresh token is required');
    }

    const tokens = await AuthService.refreshToken(refreshToken);

    // Set new httpOnly cookies
    this.setAuthCookies(res, tokens.accessToken, tokens.refreshToken);

    return this.sendSuccess(res, null, 'Token refreshed successfully');
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

    // Clear httpOnly cookies
    this.clearAuthCookies(res);

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

