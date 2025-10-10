import dotenv from 'dotenv';

dotenv.config();

interface Config {
  env: string;
  port: number;
  host: string;
  mongodb: {
    uri: string;
    dbName: string;
  };
  jwt: {
    secret: string;
    expiresIn: string;
    refreshSecret: string;
    refreshExpiresIn: string;
  };
  blockchain: {
    rpcUrl: string;
    chainId: number;
    blockRollAddress: string;
    apiKeyManagerAddress: string;
    privateKey: string;
    network: string;
  };
  encryption: {
    key: string;
    algorithm: string;
  };
  redis: {
    host: string;
    port: number;
    password?: string;
  };
  rateLimit: {
    windowMs: number;
    maxRequests: number;
  };
  upload: {
    maxFileSize: number;
    uploadDir: string;
  };
  cors: {
    origin: string;
  };
  cookie: {
    httpOnly: boolean;
    secure: boolean;
    sameSite: 'strict' | 'lax' | 'none';
    maxAge: number;
  };
  admin: {
    walletAddress: string;
  };
  email: {
    service: string;
    user: string;
    password: string;
    from: string;
    adminEmail: string;
    host?: string;
    port?: number;
    secure?: boolean;
  };
  app: {
    baseUrl: string;
    name: string;
  };
}

const config: Config = {
  env: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '5000', 10),
  host: process.env.HOST || 'localhost',
  mongodb: {
    uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/blockroll',
    dbName: process.env.DB_NAME || 'blockroll',
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'your_jwt_secret_change_in_production',
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
    refreshSecret: process.env.REFRESH_TOKEN_SECRET || 'your_refresh_secret',
    refreshExpiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN || '30d',
  },
  blockchain: {
    rpcUrl: process.env.BLOCKCHAIN_RPC_URL || process.env.BLOCKDAG_RPC_URL || 'https://rpc.primordial.bdagscan.com',
    chainId: parseInt(process.env.BLOCKCHAIN_CHAIN_ID || process.env.BLOCKDAG_CHAIN_ID || '1', 10),
    blockRollAddress: process.env.BLOCKROLL_CONTRACT_ADDRESS || '',
    apiKeyManagerAddress: process.env.API_KEY_MANAGER_ADDRESS || '',
    privateKey: process.env.BLOCKCHAIN_PRIVATE_KEY || '',
    network: process.env.BLOCKCHAIN_NETWORK || 'blockdag',
  },
  encryption: {
    key: process.env.ENCRYPTION_KEY || 'change_this_32_char_key_for_prod',
    algorithm: process.env.ENCRYPTION_ALGORITHM || 'aes-256-gcm',
  },
  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379', 10),
    password: process.env.REDIS_PASSWORD,
  },
  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10),
    maxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100', 10),
  },
  upload: {
    maxFileSize: parseInt(process.env.MAX_FILE_SIZE || '104857600', 10), // 100MB
    uploadDir: process.env.UPLOAD_DIR || './uploads',
  },
  cors: {
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  },
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  },
  admin: {
    walletAddress: process.env.ADMIN_WALLET_ADDRESS || '',
  },
  email: {
    service: process.env.EMAIL_SERVICE || 'smtp',
    user: process.env.EMAIL_USER || '',
    password: process.env.EMAIL_PASSWORD || '',
    from: process.env.EMAIL_FROM || 'noreply@blockroll.io',
    adminEmail: process.env.EMAIL_ADMIN || 'admin@blockroll.io',
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT ? parseInt(process.env.EMAIL_PORT, 10) : undefined,
    secure: process.env.EMAIL_SECURE === 'true',
  },
  app: {
    baseUrl: process.env.APP_BASE_URL || 'http://localhost:3000',
    name: process.env.APP_NAME || 'BlockRoll',
  },
};

export default config;

