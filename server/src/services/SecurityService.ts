import { BaseService } from './BaseService';
import SecurityLog, { SecurityEventType, ISecurityLog } from '../models/SecurityLog.model';
import { User } from '../models';
import SocketService from './SocketService';

export interface SecurityEventData {
  userId?: string;
  walletAddress?: string;
  eventType: SecurityEventType;
  severity?: 'info' | 'warning' | 'critical';
  description: string;
  ipAddress: string;
  userAgent: string;
  deviceFingerprint?: string;
  geolocation?: {
    country?: string;
    city?: string;
  };
  metadata?: Record<string, any>;
  blocked?: boolean;
}

export class SecurityService extends BaseService {
  constructor() {
    super('SecurityService');
  }

  /**
   * Log security event
   */
  async logSecurityEvent(data: SecurityEventData): Promise<ISecurityLog> {
    return this.executeWithErrorHandling(async () => {
      const log = await SecurityLog.create({
        user: data.userId,
        walletAddress: data.walletAddress,
        eventType: data.eventType,
        severity: data.severity || 'info',
        description: data.description,
        ipAddress: data.ipAddress,
        userAgent: data.userAgent,
        deviceFingerprint: data.deviceFingerprint,
        geolocation: data.geolocation,
        metadata: data.metadata,
        blocked: data.blocked || false,
      });

      // Send real-time alert for critical events
      if (data.severity === 'critical' && data.userId) {
        await SocketService.sendSecurityAlert(data.userId, {
          id: log._id.toString(),
          severity: 'critical',
          type: data.eventType,
          message: data.description,
          timestamp: log.createdAt.toISOString(),
        });
      }

      this.logInfo('Security event logged', {
        eventType: data.eventType,
        severity: data.severity,
        userId: data.userId,
      });

      return log;
    }, 'logSecurityEvent');
  }

  /**
   * Detect suspicious activity
   */
  async detectSuspiciousActivity(
    userId: string,
    ipAddress: string,
    deviceFingerprint?: string
  ): Promise<{
    isSuspicious: boolean;
    reasons: string[];
    riskScore: number;
  }> {
    return this.executeWithErrorHandling(async () => {
      const reasons: string[] = [];
      let riskScore = 0;

      // Check for new IP address
      const recentLogs = await SecurityLog.find({
        user: userId,
        eventType: 'login_success',
      })
        .sort({ createdAt: -1 })
        .limit(10);

      const knownIPs = new Set(recentLogs.map((log) => log.ipAddress));
      if (!knownIPs.has(ipAddress)) {
        reasons.push('Login from new IP address');
        riskScore += 30;
      }

      // Check for new device
      if (deviceFingerprint) {
        const knownDevices = new Set(
          recentLogs.map((log) => log.deviceFingerprint).filter(Boolean)
        );
        if (!knownDevices.has(deviceFingerprint)) {
          reasons.push('Login from new device');
          riskScore += 20;
        }
      }

      // Check for rapid location changes
      const lastLogin = recentLogs[0];
      if (lastLogin && lastLogin.geolocation && lastLogin.ipAddress !== ipAddress) {
        const timeDiff = new Date().getTime() - lastLogin.createdAt.getTime();
        const minutesDiff = timeDiff / 60000;

        // If different country within 30 minutes
        if (minutesDiff < 30) {
          reasons.push('Impossible travel detected');
          riskScore += 50;
        }
      }

      // Check for recent failed attempts
      const failedAttempts = await SecurityLog.countDocuments({
        user: userId,
        eventType: 'login_failed',
        createdAt: { $gte: new Date(Date.now() - 15 * 60 * 1000) },
      });

      if (failedAttempts > 3) {
        reasons.push(`${failedAttempts} recent failed login attempts`);
        riskScore += 40;
      }

      const isSuspicious = riskScore >= 50;

      if (isSuspicious) {
        await this.logSecurityEvent({
          userId,
          eventType: 'suspicious_activity',
          severity: riskScore >= 70 ? 'critical' : 'warning',
          description: `Suspicious login detected: ${reasons.join(', ')}`,
          ipAddress,
          userAgent: 'system',
          metadata: { reasons, riskScore },
        });
      }

      return { isSuspicious, reasons, riskScore };
    }, 'detectSuspiciousActivity');
  }

  /**
   * Check for brute force attack
   */
  async checkBruteForce(ipAddress: string): Promise<{
    isAttack: boolean;
    attemptCount: number;
    shouldBlock: boolean;
  }> {
    return this.executeWithErrorHandling(async () => {
      const attemptCount = await SecurityLog.getFailedLoginAttempts(ipAddress, 15);

      const isAttack = attemptCount >= 5;
      const shouldBlock = attemptCount >= 10;

      if (isAttack) {
        await this.logSecurityEvent({
          eventType: 'brute_force_attempt',
          severity: shouldBlock ? 'critical' : 'warning',
          description: `Brute force attack detected: ${attemptCount} failed attempts`,
          ipAddress,
          userAgent: 'system',
          metadata: { attemptCount },
          blocked: shouldBlock,
        });
      }

      return { isAttack, attemptCount, shouldBlock };
    }, 'checkBruteForce');
  }

  /**
   * Get user's security logs
   */
  async getUserSecurityLogs(
    userId: string,
    page = 1,
    limit = 50
  ): Promise<{ logs: ISecurityLog[]; total: number }> {
    return this.executeWithErrorHandling(async () => {
      const skip = (page - 1) * limit;

      const [logs, total] = await Promise.all([
        SecurityLog.findByUser(userId as any, limit).skip(skip),
        SecurityLog.countDocuments({ user: userId }),
      ]);

      return { logs, total };
    }, 'getUserSecurityLogs');
  }

  /**
   * Get critical security events
   */
  async getCriticalEvents(hours = 24): Promise<ISecurityLog[]> {
    return this.executeWithErrorHandling(async () => {
      const since = new Date();
      since.setHours(since.getHours() - hours);

      const events = await SecurityLog.find({
        severity: 'critical',
        createdAt: { $gte: since },
      })
        .sort({ createdAt: -1 })
        .limit(100);

      return events;
    }, 'getCriticalEvents');
  }

  /**
   * Check if IP is blacklisted
   */
  async isIPBlacklisted(ipAddress: string): Promise<boolean> {
    return this.executeWithErrorHandling(async () => {
      const blockedCount = await SecurityLog.countDocuments({
        ipAddress,
        blocked: true,
        createdAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) },
      });

      return blockedCount > 0;
    }, 'isIPBlacklisted');
  }

  /**
   * Calculate user security score
   */
  async calculateSecurityScore(userId: string): Promise<number> {
    return this.executeWithErrorHandling(async () => {
      let score = 100;

      // Check for recent security events
      const recentEvents = await SecurityLog.find({
        user: userId,
        createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
      });

      // Deduct points for each event type
      const criticalEvents = recentEvents.filter((e) => e.severity === 'critical');
      const warningEvents = recentEvents.filter((e) => e.severity === 'warning');

      score -= criticalEvents.length * 10;
      score -= warningEvents.length * 5;

      // Bonus for no incidents
      if (recentEvents.length === 0) {
        score = 100;
      }

      // Check for MFA (future)
      // const user = await User.findById(userId);
      // if (user.mfaEnabled) score += 5;

      return Math.max(0, Math.min(100, score));
    }, 'calculateSecurityScore');
  }

  /**
   * Detect account takeover attempt
   */
  async detectAccountTakeover(userId: string, ipAddress: string): Promise<boolean> {
    return this.executeWithErrorHandling(async () => {
      // Check for multiple failed attempts from different IPs
      const since = new Date();
      since.setHours(since.getHours() - 1);

      const failedAttempts = await SecurityLog.find({
        user: userId,
        eventType: 'login_failed',
        createdAt: { $gte: since },
      });

      // Different IPs attempting access
      const uniqueIPs = new Set(failedAttempts.map((log) => log.ipAddress));

      if (uniqueIPs.size >= 3) {
        await this.logSecurityEvent({
          userId,
          eventType: 'suspicious_activity',
          severity: 'critical',
          description: 'Possible account takeover attempt detected',
          ipAddress,
          userAgent: 'system',
          metadata: { uniqueIPs: uniqueIPs.size, attempts: failedAttempts.length },
        });

        return true;
      }

      return false;
    }, 'detectAccountTakeover');
  }
}

export default new SecurityService();

