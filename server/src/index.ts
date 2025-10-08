import compression from 'compression';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express, { Application } from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import http from 'http';
import config from './config';
import Database from './config/database';
import { logger, morganStream } from './config/logger';
import { errorHandler, generalLimiter, notFoundHandler } from './middleware';
import routes from './routes';
import SocketManager from './config/socket';

class Server {
  private app: Application;
  private httpServer: http.Server;
  private port: number;

  constructor() {
    this.app = express();
    this.httpServer = http.createServer(this.app);
    this.port = config.port;

    this.initializeMiddleware();
    this.initializeRoutes();
    this.initializeErrorHandling();
    this.initializeWebSocket();
  }

  /**
   * Initialize middleware
   */
  private initializeMiddleware(): void {
    // Security
    this.app.use(helmet());
    this.app.use(
      cors({
        origin: config.cors.origin,
        credentials: true,
      })
    );

    // Rate limiting
    this.app.use(generalLimiter);

    // Body parsing
    this.app.use(express.json({ limit: '10mb' }));
    this.app.use(express.urlencoded({ extended: true, limit: '10mb' }));

    // Cookie parsing
    this.app.use(cookieParser());

    // Compression
    this.app.use(compression());

    // Logging
    if (config.env === 'development') {
      this.app.use(morgan('dev'));
    } else {
      this.app.use(morgan('combined', { stream: morganStream }));
    }

    logger.info('✅ Middleware initialized');
  }

  /**
   * Initialize routes
   */
  private initializeRoutes(): void {
    // API routes
    this.app.use('/api/v1', routes);

    // Root route
    this.app.get('/', (req, res) => {
      res.json({
        success: true,
        message: 'Welcome to BlockRoll API',
        version: '1.0.0',
        documentation: '/api/v1/docs',
        health: '/api/v1/health',
      });
    });

    logger.info('✅ Routes initialized');
  }

  /**
   * Initialize error handling
   */
  private initializeErrorHandling(): void {
    // 404 handler
    this.app.use(notFoundHandler);

    // Global error handler
    this.app.use(errorHandler);

    logger.info('✅ Error handling initialized');
  }

  /**
   * Initialize WebSocket
   */
  private initializeWebSocket(): void {
    const socketManager = SocketManager.getInstance();
    socketManager.initialize(this.httpServer);
    logger.info('✅ WebSocket initialized');
  }

  /**
   * Connect to database
   */
  private async connectDatabase(): Promise<void> {
    try {
      const db = Database.getInstance();
      await db.connect();
      logger.info('✅ Database connected');
    } catch (error) {
      logger.error('❌ Database connection failed:', error);
      process.exit(1);
    }
  }

  /**
   * Start server
   */
  public async start(): Promise<void> {
    try {
      // Connect to database
      await this.connectDatabase();

      // Start HTTP server (with Socket.IO)
      this.httpServer.listen(this.port, () => {
        logger.info('='.repeat(50));
        logger.info(`🚀 BlockRoll Server Started`);
        logger.info('='.repeat(50));
        logger.info(`Environment: ${config.env}`);
        logger.info(`Port: ${this.port}`);
        logger.info(`HTTP: http://${config.host}:${this.port}`);
        logger.info(`API: http://${config.host}:${this.port}/api/v1`);
        logger.info(`WebSocket: ws://${config.host}:${this.port}`);
        logger.info('='.repeat(50));
      });

      // Graceful shutdown
      this.setupGracefulShutdown();
    } catch (error) {
      logger.error('❌ Server startup failed:', error);
      process.exit(1);
    }
  }

  /**
   * Setup graceful shutdown
   */
  private setupGracefulShutdown(): void {
    const shutdown = async (signal: string) => {
      logger.info(`${signal} received. Starting graceful shutdown...`);

      // Close database connection
      const db = Database.getInstance();
      await db.disconnect();

      logger.info('✅ Graceful shutdown completed');
      process.exit(0);
    };

    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT', () => shutdown('SIGINT'));

    // Handle uncaught exceptions
    process.on('uncaughtException', (error) => {
      logger.error('❌ Uncaught Exception:', error);
      process.exit(1);
    });

    // Handle unhandled promise rejections
    process.on('unhandledRejection', (reason, promise) => {
      logger.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
      process.exit(1);
    });
  }

  /**
   * Get Express app instance
   */
  public getApp(): Application {
    return this.app;
  }
}

// Create and start server
const server = new Server();
server.start();

export default server;
