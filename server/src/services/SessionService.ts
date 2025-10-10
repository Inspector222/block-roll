import crypto from 'crypto';
import { BaseService } from './BaseService';
import Session, { ISession } from '../models/Session.model';
import { /* User */ } from '../models';
import { NotFoundError, AuthorizationError } from '../utils/errors';
import SecurityService from './SecurityService';

export interface CreateSessionData {
  userId: string;
  refreshToken: string;
  deviceFingerprint: string;
  deviceName?: string;
  os?: string;
  browser?: string;
  ipAddress: string;
  geolocation?: {
    country?: string;
    city?: string;
    timezone?: string;
  };
  expiresAt: Date;
}

export class SessionService extends BaseService {
  constructor() {
    super('SessionService');
  }

  /**
   * Create new session
   */
  async createSession(data: CreateSessionData): Promise<ISession> {
    return this.executeWithErrorHandling(async () => {
      // Hash refresh token
      const hashedToken = crypto
        .createHash('sha256')
        .update(data.refreshToken)
        .digest('hex');

      // Check if device is already trusted
      const existingSessions = await Session.find({
        user: data.userId,
        'deviceInfo.fingerprint': data.deviceFingerprint,
      });

      const isTrustedDevice = existingSessions.some((s) => s.deviceInfo.trusted);

      const session = await Session.create({
        user: data.userId,
        refreshToken: hashedToken,
        deviceInfo: {
          fingerprint: data.deviceFingerprint,
          name: data.deviceName,
          os: data.os,
          browser: data.browser,
          trusted: isTrustedDevice,
          lastSeen: new Date(),
        },
        ipAddress: data.ipAddress,
        geolocation: data.geolocation,
        isActive: true,
        lastActivity: new Date(),
        expiresAt: data.expiresAt,
      });

      // Log new device if not trusted
      if (!isTrustedDevice) {
        await SecurityService.logSecurityEvent({
          userId: data.userId,
          eventType: 'new_device',
          severity: 'warning',
          description: `Login from new device: ${data.deviceName || 'Unknown'}`,
          ipAddress: data.ipAddress,
          userAgent: data.browser || 'Unknown',
          deviceFingerprint: data.deviceFingerprint,
          geolocation: data.geolocation,
        });
      }

      this.logInfo('Session created', {
        userId: data.userId,
        deviceFingerprint: data.deviceFingerprint,
      });

      return session;
    }, 'createSession');
  }

  /**
   * Get active sessions for user
   */
  async getActiveSessions(userId: string): Promise<ISession[]> {
    return this.executeWithErrorHandling(async () => {
      const sessions = await Session.findActiveSessions(userId as any);
      return sessions;
    }, 'getActiveSessions');
  }

  /**
   * Revoke specific session
   */
  async revokeSession(sessionId: string, userId: string): Promise<void> {
    return this.executeWithErrorHandling(async () => {
      const session = await Session.findById(sessionId);

      if (!session) {
        throw new NotFoundError('Session not found');
      }

      if (session.user.toString() !== userId) {
        throw new AuthorizationError('Cannot revoke other user\'s session');
      }

      await session.revoke();

      await SecurityService.logSecurityEvent({
        userId,
        eventType: 'logout',
        severity: 'info',
        description: 'Session revoked by user',
        ipAddress: 'N/A',
        userAgent: 'system',
        metadata: { sessionId },
      });

      this.logInfo('Session revoked', { sessionId, userId });
    }, 'revokeSession');
  }

  /**
   * Revoke all sessions except current
   */
  async revokeAllOtherSessions(
    userId: string,
    currentSessionId: string
  ): Promise<number> {
    return this.executeWithErrorHandling(async () => {
      const result = await Session.updateMany(
        {
          user: userId,
          _id: { $ne: currentSessionId },
          isActive: true,
        },
        {
          $set: {
            isActive: false,
            revokedAt: new Date(),
          },
        }
      );

      await SecurityService.logSecurityEvent({
        userId,
        eventType: 'logout',
        severity: 'info',
        description: 'All other sessions revoked',
        ipAddress: 'N/A',
        userAgent: 'system',
        metadata: { revokedCount: result.modifiedCount },
      });

      this.logInfo('All other sessions revoked', {
        userId,
        count: result.modifiedCount,
      });

      return result.modifiedCount;
    }, 'revokeAllOtherSessions');
  }

  /**
   * Trust device
   */
  async trustDevice(sessionId: string, userId: string): Promise<void> {
    return this.executeWithErrorHandling(async () => {
      const session = await Session.findById(sessionId);

      if (!session) {
        throw new NotFoundError('Session not found');
      }

      if (session.user.toString() !== userId) {
        throw new AuthorizationError('Cannot modify other user\'s session');
      }

      session.deviceInfo.trusted = true;
      await session.save();

      this.logInfo('Device trusted', { sessionId, userId });
    }, 'trustDevice');
  }

  /**
   * Update session activity
   */
  async updateSessionActivity(sessionId: string): Promise<void> {
    return this.executeWithErrorHandling(async () => {
      const session = await Session.findById(sessionId);

      if (session && session.isActive) {
        await session.updateActivity();
      }
    }, 'updateSessionActivity');
  }

  /**
   * Cleanup expired sessions (cron job)
   */
  async cleanupExpiredSessions(): Promise<number> {
    return this.executeWithErrorHandling(async () => {
      const count = await Session.revokeExpiredSessions();

      this.logInfo('Expired sessions cleaned up', { count });

      return count;
    }, 'cleanupExpiredSessions');
  }

  /**
   * Verify refresh token
   */
  async verifyRefreshToken(
    refreshToken: string
  ): Promise<ISession | null> {
    return this.executeWithErrorHandling(async () => {
      const hashedToken = crypto
        .createHash('sha256')
        .update(refreshToken)
        .digest('hex');

      const session = await Session.findOne({
        refreshToken: hashedToken,
        isActive: true,
        expiresAt: { $gt: new Date() },
      });

      return session;
    }, 'verifyRefreshToken');
  }

  /**
   * Get session statistics for user
   */
  async getSessionStats(userId: string): Promise<{
    activeDevices: number;
    trustedDevices: number;
    lastActivity: Date | null;
  }> {
    return this.executeWithErrorHandling(async () => {
      const sessions = await Session.findActiveSessions(userId as any);

      const activeDevices = sessions.length;
      const trustedDevices = sessions.filter((s) => s.deviceInfo.trusted).length;
      const lastActivity = sessions[0]?.lastActivity || null;

      return {
        activeDevices,
        trustedDevices,
        lastActivity,
      };
    }, 'getSessionStats');
  }
}

export default new SessionService();

