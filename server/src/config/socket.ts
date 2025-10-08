import { Server as HTTPServer } from 'http';
import { Server, Socket } from 'socket.io';
import { logger } from './logger';
import config from './index';
import { JWTService } from '../utils/jwt';
import { User } from '../models';

export class SocketManager {
  private static instance: SocketManager;
  private io: Server | null = null;
  private userSockets: Map<string, Set<string>> = new Map(); // userId -> Set of socketIds

  private constructor() {}

  public static getInstance(): SocketManager {
    if (!SocketManager.instance) {
      SocketManager.instance = new SocketManager();
    }
    return SocketManager.instance;
  }

  /**
   * Initialize Socket.IO server
   */
  public initialize(httpServer: HTTPServer): void {
    this.io = new Server(httpServer, {
      cors: {
        origin: config.cors.origin,
        credentials: true,
        methods: ['GET', 'POST'],
      },
      path: '/socket.io',
      transports: ['websocket', 'polling'],
    });

    this.setupMiddleware();
    this.setupEventHandlers();

    logger.info('✅ WebSocket server initialized');
  }

  /**
   * Setup authentication middleware
   */
  private setupMiddleware(): void {
    if (!this.io) return;

    this.io.use(async (socket: Socket, next) => {
      try {
        // Get token from handshake auth or cookie
        const token =
          socket.handshake.auth.token ||
          socket.handshake.headers.cookie
            ?.split(';')
            .find((c) => c.trim().startsWith('accessToken='))
            ?.split('=')[1];

        if (!token) {
          return next(new Error('Authentication required'));
        }

        // Verify token
        const payload = JWTService.verifyAccessToken(token);

        // Verify user exists
        const user = await User.findById(payload.userId);
        if (!user) {
          return next(new Error('User not found'));
        }

        // Attach user data to socket
        (socket as any).user = {
          userId: payload.userId,
          walletAddress: payload.walletAddress,
          role: payload.role,
        };

        next();
      } catch (error: any) {
        logger.error('Socket authentication failed:', error);
        next(new Error('Authentication failed'));
      }
    });
  }

  /**
   * Setup event handlers
   */
  private setupEventHandlers(): void {
    if (!this.io) return;

    this.io.on('connection', (socket: Socket) => {
      const user = (socket as any).user;
      const userId = user.userId;
      const walletAddress = user.walletAddress;
      const role = user.role;

      logger.info('🔌 Client connected', {
        socketId: socket.id,
        userId,
        walletAddress,
      });

      // Track user socket
      if (!this.userSockets.has(userId)) {
        this.userSockets.set(userId, new Set());
      }
      this.userSockets.get(userId)!.add(socket.id);

      // Join user-specific room
      socket.join(`user:${userId}`);
      socket.join(`wallet:${walletAddress}`);

      // Join admin room if admin
      if (role === 'admin') {
        socket.join('admin');
        logger.info('👑 Admin joined admin room', { userId });
      }

      // Send welcome message
      socket.emit('connected', {
        message: 'Connected to BlockRoll real-time server',
        userId,
        timestamp: new Date().toISOString(),
      });

      // Handle disconnect
      socket.on('disconnect', () => {
        logger.info('🔌 Client disconnected', {
          socketId: socket.id,
          userId,
        });

        // Remove from tracking
        const sockets = this.userSockets.get(userId);
        if (sockets) {
          sockets.delete(socket.id);
          if (sockets.size === 0) {
            this.userSockets.delete(userId);
          }
        }
      });

      // Handle ping/pong for connection health
      socket.on('ping', () => {
        socket.emit('pong', { timestamp: new Date().toISOString() });
      });

      // Subscribe to specific events
      socket.on('subscribe:notifications', () => {
        socket.join(`notifications:${userId}`);
        logger.info('Subscribed to notifications', { userId });
      });

      socket.on('subscribe:files', () => {
        socket.join(`files:${userId}`);
        logger.info('Subscribed to files', { userId });
      });

      socket.on('subscribe:guardian', () => {
        socket.join(`guardian:${userId}`);
        logger.info('Subscribed to AI Guardian', { userId });
      });

      socket.on('subscribe:workspace', (workspaceId: string) => {
        socket.join(`workspace:${workspaceId}`);
        logger.info('Subscribed to workspace', { userId, workspaceId });
      });
    });
  }

  /**
   * Get Socket.IO instance
   */
  public getIO(): Server {
    if (!this.io) {
      throw new Error('Socket.IO not initialized');
    }
    return this.io;
  }

  /**
   * Emit to specific user
   */
  public emitToUser(userId: string, event: string, data: any): void {
    if (!this.io) return;
    this.io.to(`user:${userId}`).emit(event, data);
    logger.info('Event emitted to user', { event, userId });
  }

  /**
   * Emit to specific wallet
   */
  public emitToWallet(walletAddress: string, event: string, data: any): void {
    if (!this.io) return;
    this.io.to(`wallet:${walletAddress.toLowerCase()}`).emit(event, data);
  }

  /**
   * Emit to all admins
   */
  public emitToAdmins(event: string, data: any): void {
    if (!this.io) return;
    this.io.to('admin').emit(event, data);
    logger.info('Event emitted to admins', { event });
  }

  /**
   * Emit to workspace
   */
  public emitToWorkspace(workspaceId: string, event: string, data: any): void {
    if (!this.io) return;
    this.io.to(`workspace:${workspaceId}`).emit(event, data);
  }

  /**
   * Broadcast to all connected clients
   */
  public broadcast(event: string, data: any): void {
    if (!this.io) return;
    this.io.emit(event, data);
    logger.info('Event broadcasted', { event });
  }

  /**
   * Check if user is online
   */
  public isUserOnline(userId: string): boolean {
    const sockets = this.userSockets.get(userId);
    return sockets ? sockets.size > 0 : false;
  }

  /**
   * Get online users count
   */
  public getOnlineUsersCount(): number {
    return this.userSockets.size;
  }

  /**
   * Get user's socket count
   */
  public getUserSocketCount(userId: string): number {
    const sockets = this.userSockets.get(userId);
    return sockets ? sockets.size : 0;
  }
}

export default SocketManager;

