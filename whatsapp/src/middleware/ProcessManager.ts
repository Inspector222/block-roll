import { logger } from '../utils/logger';
import { ErrorHandler } from './ErrorHandler';

/**
 * Process management utilities for graceful shutdown and lifecycle management
 */
export class ProcessManager {
  private static shutdownHandlers: Array<() => Promise<void>> = [];
  private static isShuttingDown: boolean = false;

  /**
   * Register shutdown handler
   */
  public static registerShutdownHandler(handler: () => Promise<void>): void {
    this.shutdownHandlers.push(handler);
    logger.debug('Registered shutdown handler');
  }

  /**
   * Setup process signal handlers
   */
  public static setupSignalHandlers(): void {
    // Handle SIGINT (Ctrl+C)
    process.on('SIGINT', () => {
      logger.info('Received SIGINT signal');
      this.gracefulShutdown();
    });

    // Handle SIGTERM (termination signal)
    process.on('SIGTERM', () => {
      logger.info('Received SIGTERM signal');
      this.gracefulShutdown();
    });

    // Handle SIGHUP (hangup signal)
    process.on('SIGHUP', () => {
      logger.info('Received SIGHUP signal');
      this.gracefulShutdown();
    });

    logger.info('Process signal handlers setup complete');
  }

  /**
   * Perform graceful shutdown
   */
  public static async gracefulShutdown(): Promise<void> {
    if (this.isShuttingDown) {
      logger.warn('Shutdown already in progress');
      return;
    }

    this.isShuttingDown = true;
    logger.info('Starting graceful shutdown...');

    try {
      // Execute all registered shutdown handlers
      for (const handler of this.shutdownHandlers) {
        try {
          await handler();
        } catch (error) {
          await ErrorHandler.handleError(error, 'Shutdown handler');
        }
      }

      logger.info('Graceful shutdown completed');
      
      // Exit process
      setTimeout(() => {
        process.exit(0);
      }, 1000);

    } catch (error) {
      logger.error('Error during graceful shutdown', error);
      process.exit(1);
    }
  }

  /**
   * Force shutdown
   */
  public static forceShutdown(): void {
    logger.warn('Force shutdown initiated');
    process.exit(1);
  }

  /**
   * Get process information
   */
  public static getProcessInfo(): {
    pid: number;
    uptime: number;
    memoryUsage: NodeJS.MemoryUsage;
    platform: string;
    nodeVersion: string;
    cpuUsage?: NodeJS.CpuUsage;
  } {
    return {
      pid: process.pid,
      uptime: process.uptime(),
      memoryUsage: process.memoryUsage(),
      platform: process.platform,
      nodeVersion: process.version,
      cpuUsage: process.cpuUsage()
    };
  }

  /**
   * Get uptime in human readable format
   */
  public static getUptimeString(): string {
    const uptime = process.uptime();
    const hours = Math.floor(uptime / 3600);
    const minutes = Math.floor((uptime % 3600) / 60);
    const seconds = Math.floor(uptime % 60);

    return `${hours}h ${minutes}m ${seconds}s`;
  }

  /**
   * Get memory usage in human readable format
   */
  public static getMemoryUsageString(): string {
    const memory = process.memoryUsage();
    
    const formatBytes = (bytes: number): string => {
      const units = ['B', 'KB', 'MB', 'GB'];
      let size = bytes;
      let unitIndex = 0;

      while (size >= 1024 && unitIndex < units.length - 1) {
        size /= 1024;
        unitIndex++;
      }

      return `${size.toFixed(1)} ${units[unitIndex]}`;
    };

    return {
      rss: formatBytes(memory.rss),
      heapTotal: formatBytes(memory.heapTotal),
      heapUsed: formatBytes(memory.heapUsed),
      external: formatBytes(memory.external),
      arrayBuffers: formatBytes(memory.arrayBuffers)
    } as any;
  }

  /**
   * Check if process is shutting down
   */
  public static getIsShuttingDown(): boolean {
    return this.isShuttingDown;
  }

  /**
   * Setup process monitoring
   */
  public static setupProcessMonitoring(intervalMs: number = 60000): void {
    setInterval(() => {
      const processInfo = this.getProcessInfo();
      
      logger.debug('Process monitoring', {
        uptime: this.getUptimeString(),
        memory: this.getMemoryUsageString(),
        pid: processInfo.pid
      });

      // Check for memory leaks (simple heuristic)
      const memoryUsage = processInfo.memoryUsage;
      const heapUsedMB = memoryUsage.heapUsed / 1024 / 1024;
      
      if (heapUsedMB > 1000) { // 1GB threshold
        logger.warn('High memory usage detected', {
          heapUsedMB: heapUsedMB.toFixed(2),
          heapTotalMB: (memoryUsage.heapTotal / 1024 / 1024).toFixed(2)
        });
      }

    }, intervalMs);

    logger.info('Process monitoring setup complete', { intervalMs });
  }

  /**
   * Setup health check endpoint (if needed)
   */
  public static setupHealthCheck(): () => {
    status: 'healthy' | 'unhealthy';
    uptime: string;
    memory: any;
    pid: number;
  } {
    return () => {
      const processInfo = this.getProcessInfo();
      
      return {
        status: this.isShuttingDown ? 'unhealthy' : 'healthy',
        uptime: this.getUptimeString(),
        memory: this.getMemoryUsageString(),
        pid: processInfo.pid
      };
    };
  }
}
