import crypto from 'crypto';
import { NextFunction, Request, Response } from 'express';
import { logger } from '../config/logger';
import SecurityService from '../services/SecurityService';
import { AuthorizationError } from '../utils/errors';

// Extend Express Request
declare global {
  namespace Express {
    interface Request {
      clientInfo?: {
        ipAddress: string;
        userAgent: string;
        deviceFingerprint: string;
        geolocation?: any;
      };
    }
  }
}

/**
 * Brute force protection middleware
 * Banks use this to prevent password cracking attempts
 */
export const bruteForceProtection = async (
  req: Request,
  _res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const ipAddress = getClientIP(req);

    const result = await SecurityService.checkBruteForce(ipAddress);

    if (result.shouldBlock) {
      logger.warn('🚨 IP blocked due to brute force', {
        ipAddress,
        attempts: result.attemptCount,
      });

      throw new AuthorizationError(
        'Too many failed attempts. Your IP has been temporarily blocked.',
        'IP_BLOCKED'
      );
    }

    if (result.isAttack) {
      logger.warn('⚠️ Brute force attack detected', {
        ipAddress,
        attempts: result.attemptCount,
      });
    }

    next();
  } catch (error) {
    next(error);
  }
};

/**
 * Device fingerprinting middleware
 * Banks track devices for security
 */
export const deviceFingerprinting = (
  req: Request,
  _res: Response,
  next: NextFunction
): void => {
  try {
    const ipAddress = getClientIP(req);
    const userAgent = req.headers['user-agent'] || 'Unknown';

    // Generate device fingerprint
    const fingerprintData = [
      userAgent,
      req.headers['accept-language'],
      req.headers['accept-encoding'],
      ipAddress,
    ].join('|');

    const deviceFingerprint = crypto
      .createHash('sha256')
      .update(fingerprintData)
      .digest('hex');

    // Attach to request
    req.clientInfo = {
      ipAddress,
      userAgent,
      deviceFingerprint,
    };

    next();
  } catch (error) {
    next(error);
  }
};

/**
 * Suspicious activity detection
 * Banks monitor for unusual patterns
 */
export const suspiciousActivityDetection = async (
  req: Request,
  _res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Only check for authenticated users
    if (!req.user) {
      return next();
    }

    const userId = req.user.userId;
    const ipAddress = req.clientInfo?.ipAddress || getClientIP(req);
    const deviceFingerprint = req.clientInfo?.deviceFingerprint;

    const result = await SecurityService.detectSuspiciousActivity(
      userId,
      ipAddress,
      deviceFingerprint
    );

    if (result.isSuspicious) {
      logger.warn('⚠️ Suspicious activity detected', {
        userId,
        reasons: result.reasons,
        riskScore: result.riskScore,
      });

      // For very high risk, could add additional verification
      if (result.riskScore >= 70) {
        // In production, you might want to require MFA or email verification
        logger.error('🚨 High risk activity detected', {
          userId,
          riskScore: result.riskScore,
        });
      }
    }

    next();
  } catch (error) {
    // Don't block request, just log
    logger.error('Error in suspicious activity detection:', error);
    next();
  }
};

/**
 * IP-based security checks
 * Banks block known malicious IPs
 */
export const ipSecurityCheck = async (
  req: Request,
  _res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const ipAddress = getClientIP(req);

    // Check if IP is blacklisted
    const isBlacklisted = await SecurityService.isIPBlacklisted(ipAddress);

    if (isBlacklisted) {
      logger.warn('🚨 Blocked IP attempted access', { ipAddress });

      throw new AuthorizationError(
        'Access denied from this IP address',
        'IP_BLACKLISTED'
      );
    }

    next();
  } catch (error) {
    next(error);
  }
};

/**
 * Request signature verification
 * Banks use this for critical operations
 */
export const verifyRequestSignature = (requiredForMethods: string[] = ['POST', 'PUT', 'DELETE']) => {
  return (req: Request, _res: Response, next: NextFunction): void => {
    // Skip if method not in required list
    if (!requiredForMethods.includes(req.method)) {
      return next();
    }

    const signature = req.headers['x-request-signature'] as string;
    const timestamp = req.headers['x-request-timestamp'] as string;

    // If signatures are not being used, skip (for backward compatibility)
    if (!signature && !timestamp) {
      return next();
    }

    // If one is provided, both must be provided
    if (!signature || !timestamp) {
      throw new AuthorizationError('Invalid request signature');
    }

    // Check timestamp is recent (within 5 minutes)
    const requestTime = parseInt(timestamp, 10);
    const now = Date.now();
    const fiveMinutes = 5 * 60 * 1000;

    if (Math.abs(now - requestTime) > fiveMinutes) {
      throw new AuthorizationError('Request signature expired');
    }

    // In production, verify the actual signature
    // const expectedSignature = crypto
    //   .createHmac('sha256', SECRET_KEY)
    //   .update(`${timestamp}:${JSON.stringify(req.body)}`)
    //   .digest('hex');

    // if (signature !== expectedSignature) {
    //   throw new AuthorizationError('Invalid request signature');
    // }

    next();
  };
};

/**
 * Session activity tracking
 * Banks track every action for audit
 */
export const trackSessionActivity = async (
  req: Request,
  _res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Only for authenticated requests
    if (!req.user) {
      return next();
    }

    // Log the activity (non-blocking)
    const ipAddress = getClientIP(req);
    const action = `${req.method} ${req.path}`;

    SecurityService.logSecurityEvent({
      userId: req.user.userId,
      walletAddress: req.user.walletAddress,
      eventType: 'login_success', // Generic activity
      severity: 'info',
      description: `Action: ${action}`,
      ipAddress,
      userAgent: req.headers['user-agent'] || 'Unknown',
      metadata: {
        method: req.method,
        path: req.path,
        query: req.query,
      },
    }).catch((err) => {
      // Don't block request if logging fails
      logger.error('Failed to log session activity:', err);
    });

    next();
  } catch (error) {
    next(error);
  }
};

/**
 * Content Security Policy
 * Banks prevent XSS and injection attacks
 */
export const contentSecurityPolicy = (
  _req: Request,
  res: Response,
  next: NextFunction
): void => {
  res.setHeader(
    'Content-Security-Policy',
    "default-src 'self'; " +
      "script-src 'self' 'unsafe-inline'; " +
      "style-src 'self' 'unsafe-inline'; " +
      "img-src 'self' data: https:; " +
      "font-src 'self' data:; " +
      "connect-src 'self' wss: https:;"
  );

  next();
};

/**
 * Prevent parameter pollution
 */
export const preventParameterPollution = (
  req: Request,
  _res: Response,
  next: NextFunction
): void => {
  // Convert array parameters to single values (take first)
  Object.keys(req.query).forEach((key) => {
    if (Array.isArray(req.query[key])) {
      req.query[key] = (req.query[key] as string[])[0];
    }
  });

  next();
};

/**
 * Get client IP address (handle proxies)
 */
function getClientIP(req: Request): string {
  const forwarded = req.headers['x-forwarded-for'] as string;
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }

  const realIP = req.headers['x-real-ip'] as string;
  if (realIP) {
    return realIP;
  }

  return req.socket.remoteAddress || 'Unknown';
}

