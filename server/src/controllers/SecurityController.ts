import { Request, Response } from 'express';
import { BaseController } from './BaseController';
import { SecurityService, SessionService } from '../services';

export class SecurityController extends BaseController {
  /**
   * Get user's active sessions
   * GET /security/sessions
   */
  getSessions = this.catchAsync(async (req: Request, res: Response) => {
    const userId = this.getUserId(req);

    const sessions = await SessionService.getActiveSessions(userId);

    return this.sendSuccess(res, { sessions }, 'Sessions retrieved successfully');
  });

  /**
   * Revoke specific session
   * DELETE /security/sessions/:id
   */
  revokeSession = this.catchAsync(async (req: Request, res: Response) => {
    const userId = this.getUserId(req);
    const { id } = req.params;

    await SessionService.revokeSession(id, userId);

    return this.sendSuccess(res, null, 'Session revoked successfully');
  });

  /**
   * Revoke all other sessions
   * POST /security/revoke-all-sessions
   */
  revokeAllSessions = this.catchAsync(async (req: Request, res: Response) => {
    const userId = this.getUserId(req);
    const currentSessionId = req.body.currentSessionId;

    const count = await SessionService.revokeAllOtherSessions(
      userId,
      currentSessionId
    );

    return this.sendSuccess(
      res,
      { revokedCount: count },
      `${count} session(s) revoked successfully`
    );
  });

  /**
   * Trust current device
   * POST /security/trust-device
   */
  trustDevice = this.catchAsync(async (req: Request, res: Response) => {
    const userId = this.getUserId(req);
    const { sessionId } = req.body;

    await SessionService.trustDevice(sessionId, userId);

    return this.sendSuccess(res, null, 'Device trusted successfully');
  });

  /**
   * Get security logs
   * GET /security/logs
   */
  getSecurityLogs = this.catchAsync(async (req: Request, res: Response) => {
    const userId = this.getUserId(req);
    const { page, limit } = this.extractPaginationParams(req.query);

    const result = await SecurityService.getUserSecurityLogs(userId, page, limit);

    return this.sendPaginated(
      res,
      result.logs,
      page,
      limit,
      result.total,
      'Security logs retrieved successfully'
    );
  });

  /**
   * Get security score
   * GET /security/score
   */
  getSecurityScore = this.catchAsync(async (req: Request, res: Response) => {
    const userId = this.getUserId(req);

    const score = await SecurityService.calculateSecurityScore(userId);
    const sessionStats = await SessionService.getSessionStats(userId);

    return this.sendSuccess(
      res,
      {
        score,
        level:
          score >= 90
            ? 'excellent'
            : score >= 70
              ? 'good'
              : score >= 50
                ? 'fair'
                : 'poor',
        sessionStats,
      },
      'Security score calculated'
    );
  });

  /**
   * Get critical security events (Admin only)
   * GET /security/critical-events
   */
  getCriticalEvents = this.catchAsync(async (req: Request, res: Response) => {
    const hours = parseInt(req.query.hours as string) || 24;

    const events = await SecurityService.getCriticalEvents(hours);

    return this.sendSuccess(
      res,
      { events },
      `Critical events from last ${hours} hours retrieved`
    );
  });
}

export default new SecurityController();

