import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import { JWTService } from '../utils/jwt';
import { AuthenticationError } from '../utils/errors';
import { User } from '../models';
import { logger } from '../config/logger';
import config from '../config';
import jwt from 'jsonwebtoken';

/**
 * Automatic token refresh middleware
 * Implements bank-level security with seamless token refresh
 */
export const autoRefreshToken = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Try to get access token from cookie
    let accessToken = req.cookies?.accessToken;
    
    // Fallback to Authorization header
    if (!accessToken) {
      accessToken = JWTService.extractTokenFromHeader(req.headers.authorization);
    }

    // If no access token at all, skip to next middleware (will be handled by authenticate)
    if (!accessToken) {
      return next();
    }

    try {
      // Try to verify access token
      const payload = JWTService.verifyAccessToken(accessToken);
      
      // Verify user still exists
      const user = await User.findById(payload.userId);
      if (!user) {
        throw new AuthenticationError('User not found');
      }

      // Token is valid, set user and continue
      req.user = payload;
      next();
    } catch (error: any) {
      // If token is expired, try to refresh automatically
      if (error.code === 'TOKEN_EXPIRED' || error instanceof jwt.TokenExpiredError) {
        logger.info('Access token expired, attempting auto-refresh');

        // Get refresh token from cookie
        const refreshToken = req.cookies?.refreshToken;

        if (!refreshToken) {
          logger.warn('No refresh token available for auto-refresh');
          throw new AuthenticationError('Session expired, please login again');
        }

        try {
          // Verify refresh token
          const refreshPayload = JWTService.verifyRefreshToken(refreshToken);

          // Check if user still exists
          const user = await User.findById(refreshPayload.userId);
          if (!user) {
            throw new AuthenticationError('User not found');
          }

          // Generate new tokens
          const newPayload = {
            userId: (user._id as mongoose.Types.ObjectId).toString(),
            walletAddress: user.walletAddress,
            role: user.role,
          };

          const { accessToken: newAccessToken, refreshToken: newRefreshToken } =
            JWTService.generateTokens(newPayload);

          // Set new httpOnly cookies
          res.cookie('accessToken', newAccessToken, {
            httpOnly: config.cookie.httpOnly,
            secure: config.cookie.secure,
            sameSite: config.cookie.sameSite,
            maxAge: config.cookie.maxAge,
            path: '/',
          });

          res.cookie('refreshToken', newRefreshToken, {
            httpOnly: config.cookie.httpOnly,
            secure: config.cookie.secure,
            sameSite: config.cookie.sameSite,
            maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
            path: '/',
          });

          // Set user in request
          req.user = {
            userId: (user._id as mongoose.Types.ObjectId).toString(),
            walletAddress: user.walletAddress,
            role: user.role,
          };

          logger.info('✅ Token auto-refreshed successfully', {
            userId: user._id,
            walletAddress: user.walletAddress,
          });

          // Add header to indicate token was refreshed
          res.setHeader('X-Token-Refreshed', 'true');

          next();
        } catch (refreshError: any) {
          // Refresh token is also invalid/expired
          logger.error('Auto-refresh failed:', refreshError);

          // Clear invalid cookies
          res.clearCookie('accessToken', { path: '/' });
          res.clearCookie('refreshToken', { path: '/' });

          if (refreshError.code === 'REFRESH_TOKEN_EXPIRED') {
            throw new AuthenticationError(
              'Session expired, please login again',
              'SESSION_EXPIRED'
            );
          }

          throw new AuthenticationError(
            'Invalid session, please login again',
            'INVALID_SESSION'
          );
        }
      } else {
        // Other authentication errors
        throw error;
      }
    }
  } catch (error) {
    next(error);
  }
};

/**
 * Combined authentication with auto-refresh
 * This replaces the regular authenticate middleware
 */
export const authenticateWithAutoRefresh = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    await autoRefreshToken(req, res, () => {
      // After auto-refresh, check if user is set
      if (!req.user) {
        throw new AuthenticationError('Authentication required');
      }
      next();
    });
  } catch (error) {
    next(error);
  }
};

