import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { AppConfig, ConfigurationError } from '../types';

/**
 * Configuration manager for the WhatsApp bot application
 * Handles loading, validation, and management of configuration settings
 */
export class ConfigManager {
  private static instance: ConfigManager;
  private config: AppConfig;

  private constructor() {
    this.config = this.loadDefaultConfig();
  }

  /**
   * Get singleton instance of ConfigManager
   */
  public static getInstance(): ConfigManager {
    if (!ConfigManager.instance) {
      ConfigManager.instance = new ConfigManager();
    }
    return ConfigManager.instance;
  }

  /**
   * Load configuration from file or use defaults
   */
  public loadConfig(configPath?: string): AppConfig {
    try {
      if (configPath && existsSync(configPath)) {
        const configData = readFileSync(configPath, 'utf-8');
        const fileConfig = JSON.parse(configData);
        this.config = this.mergeConfigs(this.config, fileConfig);
      }
      
      this.validateConfig(this.config);
      this.ensureDirectories();
      
      return this.config;
    } catch (error) {
      throw new ConfigurationError(
        `Failed to load configuration: ${error instanceof Error ? error.message : String(error)}`,
        error instanceof Error ? error : undefined
      );
    }
  }

  /**
   * Get current configuration
   */
  public getConfig(): AppConfig {
    return this.config;
  }

  /**
   * Update configuration
   */
  public updateConfig(updates: Partial<AppConfig>): void {
    this.config = this.mergeConfigs(this.config, updates);
    this.validateConfig(this.config);
  }

  /**
   * Save configuration to file
   */
  public saveConfig(configPath: string): void {
    try {
      const configDir = dirname(configPath);
      if (!existsSync(configDir)) {
        mkdirSync(configDir, { recursive: true });
      }
      
      writeFileSync(configPath, JSON.stringify(this.config, null, 2));
    } catch (error) {
      throw new ConfigurationError(
        `Failed to save configuration: ${error instanceof Error ? error.message : String(error)}`,
        error instanceof Error ? error : undefined
      );
    }
  }

  /**
   * Get WhatsApp-specific configuration
   */
  public getWhatsAppConfig() {
    return this.config.whatsapp;
  }

  /**
   * Get bot configuration
   */
  public getBotConfig() {
    return this.config.bot;
  }

  /**
   * Get logging configuration
   */
  public getLoggingConfig() {
    return this.config.logging;
  }

  /**
   * Load default configuration with environment variables
   */
  private loadDefaultConfig(): AppConfig {
    // Load admin numbers from environment
    const adminNumbersEnv = process.env.BLOCKROLL_ADMIN_NUMBERS || '';
    const adminNumbers = adminNumbersEnv.split(',').filter(num => num.trim()).map(num => num.trim());
    
    // Load logging configuration from environment
    const logLevel = (process.env.LOG_LEVEL as 'debug' | 'info' | 'warn' | 'error') || 'info';
    const enableFileLogging = process.env.ENABLE_FILE_LOGGING === 'true';
    const logFilePath = process.env.LOG_FILE_PATH || join(process.cwd(), 'logs', 'blockroll-bot.log');
    
    // Load session path from environment
    const sessionPath = process.env.SESSION_PATH || join(process.cwd(), 'sessions');
    
    return {
      whatsapp: {
        authStrategy: {
          dataPath: sessionPath
        },
        puppeteer: {
          headless: true,
          args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--disable-accelerated-2d-canvas',
            '--no-first-run',
            '--no-zygote',
            '--disable-gpu',
            '--disable-web-security',
            '--disable-features=VizDisplayCompositor'
          ]
        }
      },
      logging: {
        level: logLevel,
        enableConsole: true,
        enableFile: enableFileLogging,
        filePath: logFilePath
      },
      bot: {
        commands: [],
        autoReply: true,
        adminNumbers: adminNumbers
      }
    };
  }

  /**
   * Merge configuration objects
   */
  private mergeConfigs(defaultConfig: AppConfig, userConfig: any): AppConfig {
    const merged = { ...defaultConfig };

    if (userConfig.whatsapp) {
      merged.whatsapp = {
        ...merged.whatsapp,
        ...userConfig.whatsapp,
        authStrategy: {
          ...merged.whatsapp.authStrategy,
          ...userConfig.whatsapp.authStrategy
        },
        puppeteer: {
          ...merged.whatsapp.puppeteer,
          ...userConfig.whatsapp.puppeteer,
          args: userConfig.whatsapp.puppeteer?.args || merged.whatsapp.puppeteer.args
        }
      };
    }

    if (userConfig.logging) {
      merged.logging = {
        ...merged.logging,
        ...userConfig.logging
      };
    }

    if (userConfig.bot) {
      merged.bot = {
        ...merged.bot,
        ...userConfig.bot
      };
    }

    return merged;
  }

  /**
   * Validate configuration
   */
  private validateConfig(config: AppConfig): void {
    // Validate WhatsApp config
    if (!config.whatsapp) {
      throw new ConfigurationError('WhatsApp configuration is required');
    }

    if (!config.whatsapp.authStrategy?.dataPath) {
      throw new ConfigurationError('WhatsApp auth strategy data path is required');
    }

    // Validate logging config
    if (!config.logging) {
      throw new ConfigurationError('Logging configuration is required');
    }

    const validLogLevels = ['debug', 'info', 'warn', 'error'];
    if (!validLogLevels.includes(config.logging.level)) {
      throw new ConfigurationError(`Invalid log level: ${config.logging.level}`);
    }

    // Validate bot config
    if (!config.bot) {
      throw new ConfigurationError('Bot configuration is required');
    }

    if (typeof config.bot.autoReply !== 'boolean') {
      throw new ConfigurationError('Bot autoReply must be a boolean');
    }
  }

  /**
   * Ensure required directories exist
   */
  private ensureDirectories(): void {
    const paths = [
      this.config.whatsapp.authStrategy.dataPath,
      join(process.cwd(), 'logs')
    ];

    paths.forEach(path => {
      if (!existsSync(path)) {
        mkdirSync(path, { recursive: true });
      }
    });
  }
}

// Export singleton instance
export const configManager = ConfigManager.getInstance();
