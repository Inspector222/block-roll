import { NextFunction, Request, Response } from 'express';
import { ApiKey, User } from '../models';
import { AuthenticationError, AuthorizationError } from '../utils/errors';
import { JWTPayload, JWTService } from '../utils/jwt';

// Extend Express Request type
declare global {
  namespace Express {
    interface Request {
      user?: JWTPayload;
      apiKey?: any;
    }
  }
}

/**
 * Authenticate user with JWT token from httpOnly cookie
 */
export const authenticate = async (
  req: Request,
  _res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Try to get token from httpOnly cookie first
    let token = req.cookies?.accessToken;

    // Fallback to Authorization header (for backwards compatibility/SDK use)
    if (!token) {
      token = JWTService.extractTokenFromHeader(req.headers.authorization);
    }

    if (!token) {
      throw new AuthenticationError('No token provided');
    }

    const payload = JWTService.verifyAccessToken(token);

    // Verify user still exists
    const user = await User.findById(payload.userId);
    if (!user) {
      throw new AuthenticationError('User not found');
    }

    req.user = payload;
    next();
  } catch (error) {
    next(error);
  }
};

/**
 * Authenticate with API key
 */
export const authenticateApiKey = async (
  req: Request,
  _res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const apiKey = req.headers['x-api-key'] as string;

    if (!apiKey) {
      throw new AuthenticationError('No API key provided');
    }

    const key = await ApiKey.findByKey(apiKey);

    if (!key) {
      throw new AuthenticationError('Invalid API key');
    }

    // Check if key is expired
    if (key.isExpired) {
      throw new AuthenticationError('API key has expired');
    }

    // Increment usage count
    await key.incrementUsage();

    req.apiKey = key;
    next();
  } catch (error) {
    next(error);
  }
};

/**
 * Optional authentication - doesn't throw if not authenticated
 */
export const optionalAuth = async (
  req: Request,
  _res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Try to get token from cookie first
    let token = req.cookies?.accessToken;

    // Fallback to Authorization header
    if (!token) {
      token = JWTService.extractTokenFromHeader(req.headers.authorization);
    }

    if (token) {
      try {
        const payload = JWTService.verifyAccessToken(token);
        const user = await User.findById(payload.userId);
        if (user) {
          req.user = payload;
        }
      } catch {
        // Ignore authentication errors for optional auth
      }
    }

    next();
  } catch (error) {
    next(error);
  }
};

/**
 * Require admin role
 */
export const requireAdmin = (
  req: Request,
  _res: Response,
  next: NextFunction
): void => {
  if (!req.user) {
    throw new AuthenticationError('Authentication required');
  }

  if (req.user.role !== 'admin') {
    throw new AuthorizationError('Admin access required');
  }

  next();
};

/**
 * Require specific permissions for API key
 */
export const requirePermissions = (...permissions: string[]) => {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.apiKey) {
      throw new AuthenticationError('API key required');
    }

    const hasPermission = permissions.every((permission) =>
      req.apiKey.permissions.includes(permission)
    );

    if (!hasPermission) {
      throw new AuthorizationError(
        `Missing required permissions: ${permissions.join(', ')}`
      );
    }

    next();
  };
};

/**
 * Require wallet ownership
 */
export const requireWalletOwnership = (walletAddressParam: string = 'walletAddress') => {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      throw new AuthenticationError('Authentication required');
    }

    const walletAddress =
      req.params[walletAddressParam] || req.body[walletAddressParam];

    if (
      !walletAddress ||
      walletAddress.toLowerCase() !== req.user.walletAddress.toLowerCase()
    ) {
      throw new AuthorizationError('Wallet ownership required');
    }

    next();
  };
};
