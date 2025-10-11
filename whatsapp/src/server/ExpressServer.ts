import express, { Request, Response, NextFunction } from 'express';
import QRCode from 'qrcode';
import { logger } from '../utils/logger';

/**
 * Express server for serving WhatsApp QR code and status
 */
export class ExpressServer {
  private app: express.Application;
  private server: any;
  private currentQRCode: string | null = null;
  private port: number;

  constructor(port: number = 3001) {
    this.port = port;
    this.app = express();
    this.setupMiddleware();
    this.setupRoutes();
  }

  /**
   * Setup middleware
   */
  private setupMiddleware(): void {
    // Enable CORS for all routes
    this.app.use((req: Request, res: Response, next: NextFunction) => {
      res.header('Access-Control-Allow-Origin', '*');
      res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
      res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
      
      if (req.method === 'OPTIONS') {
        res.sendStatus(200);
      } else {
        next();
      }
    });

    // Parse JSON bodies
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
  }

  /**
   * Setup routes
   */
  private setupRoutes(): void {
    // Health check endpoint
    this.app.get('/health', (req: Request, res: Response) => {
      res.json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
      });
    });

    // QR code data endpoint (JSON)
    this.app.get('/qr', (req: Request, res: Response) => {
      if (!this.currentQRCode) {
        return res.status(404).json({
          error: 'No QR code available',
          message: 'WhatsApp client is not generating QR code at the moment'
        });
      }

      res.json({
        qr: this.currentQRCode,
        timestamp: new Date().toISOString()
      });
    });

    // QR code image endpoint (PNG)
    this.app.get('/qr/image', async (req: Request, res: Response) => {
      if (!this.currentQRCode) {
        return res.status(404).json({
          error: 'No QR code available',
          message: 'WhatsApp client is not generating QR code at the moment'
        });
      }

      try {
        const qrCodeBuffer = await QRCode.toBuffer(this.currentQRCode, {
          type: 'png',
          width: 300,
          margin: 2,
          color: {
            dark: '#000000',
            light: '#FFFFFF'
          }
        });

        res.setHeader('Content-Type', 'image/png');
        res.setHeader('Content-Length', qrCodeBuffer.length);
        res.send(qrCodeBuffer);
      } catch (error) {
        logger.error('Error generating QR code image', error);
        res.status(500).json({
          error: 'Failed to generate QR code image',
          message: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    });

    // QR code HTML page
    this.app.get('/qr/page', (req: Request, res: Response) => {
      if (!this.currentQRCode) {
        return res.status(404).send(`
          <!DOCTYPE html>
          <html>
          <head>
            <title>WhatsApp QR Code - Not Available</title>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1">
            <style>
              body { font-family: Arial, sans-serif; text-align: center; padding: 50px; background: #f5f5f5; }
              .container { max-width: 600px; margin: 0 auto; background: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
              .error { color: #e74c3c; }
            </style>
          </head>
          <body>
            <div class="container">
              <h1>📱 WhatsApp QR Code</h1>
              <p class="error">No QR code available at the moment</p>
              <p>WhatsApp client is not generating QR code. Please check the bot status.</p>
              <button onclick="location.reload()">Refresh</button>
            </div>
          </body>
          </html>
        `);
      }

      res.send(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>WhatsApp QR Code</title>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <style>
            body { 
              font-family: Arial, sans-serif; 
              text-align: center; 
              padding: 20px; 
              background: linear-gradient(135deg, #25D366, #128C7E);
              margin: 0;
              min-height: 100vh;
              display: flex;
              align-items: center;
              justify-content: center;
            }
            .container { 
              max-width: 400px; 
              margin: 0 auto; 
              background: white; 
              padding: 30px; 
              border-radius: 15px; 
              box-shadow: 0 4px 20px rgba(0,0,0,0.2);
            }
            .qr-code { 
              margin: 20px 0; 
              border: 2px solid #25D366; 
              border-radius: 10px; 
              padding: 10px;
              background: white;
            }
            .instructions { 
              color: #666; 
              font-size: 14px; 
              line-height: 1.5;
              margin: 20px 0;
            }
            .status { 
              color: #25D366; 
              font-weight: bold; 
              margin: 10px 0;
            }
            button { 
              background: #25D366; 
              color: white; 
              border: none; 
              padding: 10px 20px; 
              border-radius: 5px; 
              cursor: pointer; 
              font-size: 16px;
              margin: 10px;
            }
            button:hover { background: #128C7E; }
            .auto-refresh { font-size: 12px; color: #999; }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>📱 WhatsApp QR Code</h1>
            <div class="status">Scan this QR code with your WhatsApp mobile app</div>
            <div class="qr-code">
              <img src="/qr/image" alt="WhatsApp QR Code" style="max-width: 100%; height: auto;">
            </div>
            <div class="instructions">
              <p><strong>Instructions:</strong></p>
              <p>1. Open WhatsApp on your phone</p>
              <p>2. Go to Settings → Linked Devices</p>
              <p>3. Tap "Link a Device"</p>
              <p>4. Scan this QR code</p>
            </div>
            <button onclick="location.reload()">Refresh QR Code</button>
            <button onclick="window.open('/qr', '_blank')">Get QR Data</button>
            <div class="auto-refresh">
              <p>Page will auto-refresh every 30 seconds</p>
              <p>Last updated: <span id="timestamp">${new Date().toLocaleString()}</span></p>
            </div>
          </div>
          
          <script>
            // Auto-refresh every 30 seconds
            setInterval(() => {
              location.reload();
            }, 30000);
            
            // Update timestamp every second
            setInterval(() => {
              document.getElementById('timestamp').textContent = new Date().toLocaleString();
            }, 1000);
          </script>
        </body>
        </html>
      `);
    });

    // Bot status endpoint
    this.app.get('/status', (req: Request, res: Response) => {
      res.json({
        status: 'running',
        hasQRCode: !!this.currentQRCode,
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        endpoints: {
          qrData: '/qr',
          qrImage: '/qr/image',
          qrPage: '/qr/page',
          health: '/health'
        }
      });
    });

    // Root endpoint with instructions
    this.app.get('/', (req: Request, res: Response) => {
      res.send(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>BlockRoll WhatsApp Bot</title>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <style>
            body { font-family: Arial, sans-serif; text-align: center; padding: 50px; background: #f5f5f5; }
            .container { max-width: 600px; margin: 0 auto; background: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
            .endpoint { background: #f8f9fa; padding: 10px; margin: 10px 0; border-radius: 5px; font-family: monospace; }
            .endpoint a { color: #25D366; text-decoration: none; }
            .endpoint a:hover { text-decoration: underline; }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>🤖 BlockRoll WhatsApp Bot</h1>
            <p>Express server is running and ready to serve QR codes!</p>
            
            <h3>Available Endpoints:</h3>
            <div class="endpoint">
              <a href="/qr/page">📱 QR Code Page</a> - Interactive QR code display
            </div>
            <div class="endpoint">
              <a href="/qr/image">🖼️ QR Code Image</a> - Direct PNG image
            </div>
            <div class="endpoint">
              <a href="/qr">📄 QR Code Data</a> - Raw QR code data (JSON)
            </div>
            <div class="endpoint">
              <a href="/status">📊 Bot Status</a> - Bot status and information
            </div>
            <div class="endpoint">
              <a href="/health">💚 Health Check</a> - Server health status
            </div>
          </div>
        </body>
        </html>
      `);
    });
  }

  /**
   * Update the current QR code
   */
  public updateQRCode(qrCode: string): void {
    this.currentQRCode = qrCode;
    logger.info('QR code updated and available at http://localhost:' + this.port + '/qr/page');
  }

  /**
   * Clear the current QR code
   */
  public clearQRCode(): void {
    this.currentQRCode = null;
    logger.info('QR code cleared');
  }

  /**
   * Get the current QR code
   */
  public getCurrentQRCode(): string | null {
    return this.currentQRCode;
  }

  /**
   * Start the Express server
   */
  public async start(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.server = this.app.listen(this.port, () => {
        logger.info(`🌐 Express server started on http://localhost:${this.port}`);
        logger.info(`📱 QR code available at: http://localhost:${this.port}/qr/page`);
        logger.info(`📄 QR data available at: http://localhost:${this.port}/qr`);
        logger.info(`🖼️ QR image available at: http://localhost:${this.port}/qr/image`);
        resolve();
      });

      this.server.on('error', (error: Error) => {
        logger.error('Express server error', error);
        reject(error);
      });
    });
  }

  /**
   * Stop the Express server
   */
  public async stop(): Promise<void> {
    return new Promise((resolve) => {
      if (this.server) {
        this.server.close(() => {
          logger.info('Express server stopped');
          resolve();
        });
      } else {
        resolve();
      }
    });
  }

  /**
   * Get the server port
   */
  public getPort(): number {
    return this.port;
  }

  /**
   * Check if server is running
   */
  public isRunning(): boolean {
    return !!this.server && this.server.listening;
  }
}
