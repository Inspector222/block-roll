import mongoose, { Document, Model, Schema } from 'mongoose';

export interface ILoginAttempt {
  ipAddress: string;
  success: boolean;
  timestamp: Date;
  deviceFingerprint?: string;
}

export interface IAccountSecurity extends Document {
  user: mongoose.Types.ObjectId;
  walletAddress: string;
  
  // Account lockout
  isLocked: boolean;
  lockReason?: string;
  lockedAt?: Date;
  lockExpiresAt?: Date;
  failedLoginAttempts: number;
  lastFailedLogin?: Date;
  
  // MFA/2FA
  mfaEnabled: boolean;
  mfaSecret?: string;
  mfaBackupCodes?: string[];
  
  // Trusted IPs
  trustedIPs: string[];
  
  // Trusted devices
  trustedDevices: string[]; // Device fingerprints
  
  // Login history
  loginHistory: ILoginAttempt[];
  
  // Security settings
  requireMFAForSensitiveOperations: boolean;
  allowedCountries?: string[];
  sessionTimeout: number; // in minutes
  
  // Risk assessment
  riskScore: number;
  lastRiskAssessment: Date;
  
  createdAt: Date;
  updatedAt: Date;
}

const LoginAttemptSchema = new Schema(
  {
    ipAddress: {
      type: String,
      required: true,
    },
    success: {
      type: Boolean,
      required: true,
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
    deviceFingerprint: String,
  },
  { _id: false }
);

const AccountSecuritySchema: Schema<IAccountSecurity> = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    walletAddress: {
      type: String,
      required: true,
      lowercase: true,
      unique: true,
    },
    isLocked: {
      type: Boolean,
      default: false,
    },
    lockReason: String,
    lockedAt: Date,
    lockExpiresAt: {
      type: Date,
    },
    failedLoginAttempts: {
      type: Number,
      default: 0,
    },
    lastFailedLogin: Date,
    mfaEnabled: {
      type: Boolean,
      default: false,
    },
    mfaSecret: {
      type: String,
      select: false, // Never return in queries
    },
    mfaBackupCodes: {
      type: [String],
      select: false,
    },
    trustedIPs: {
      type: [String],
      default: [],
    },
    trustedDevices: {
      type: [String],
      default: [],
    },
    loginHistory: {
      type: [LoginAttemptSchema],
      default: [],
    },
    requireMFAForSensitiveOperations: {
      type: Boolean,
      default: false,
    },
    allowedCountries: {
      type: [String],
      default: [],
    },
    sessionTimeout: {
      type: Number,
      default: 30, // 30 minutes
    },
    riskScore: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    lastRiskAssessment: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: function (_doc, ret: any) {
        delete ret.__v;
        delete ret.mfaSecret;
        delete ret.mfaBackupCodes;
        return ret;
      },
    },
  }
);

// Indexes
// Note: walletAddress already has unique: true which creates an index automatically
AccountSecuritySchema.index({ isLocked: 1 });
AccountSecuritySchema.index({ lockExpiresAt: 1 });

// Methods
AccountSecuritySchema.methods.lockAccount = async function (
  reason: string,
  duration: number = 30
): Promise<void> {
  this.isLocked = true;
  this.lockReason = reason;
  this.lockedAt = new Date();
  
  const expiresAt = new Date();
  expiresAt.setMinutes(expiresAt.getMinutes() + duration);
  this.lockExpiresAt = expiresAt;
  
  await this.save();
};

AccountSecuritySchema.methods.unlockAccount = async function (): Promise<void> {
  this.isLocked = false;
  this.lockReason = undefined;
  this.lockedAt = undefined;
  this.lockExpiresAt = undefined;
  this.failedLoginAttempts = 0;
  await this.save();
};

AccountSecuritySchema.methods.recordLoginAttempt = async function (
  ipAddress: string,
  success: boolean,
  deviceFingerprint?: string
): Promise<void> {
  this.loginHistory.unshift({
    ipAddress,
    success,
    timestamp: new Date(),
    deviceFingerprint,
  });

  // Keep only last 100 attempts
  if (this.loginHistory.length > 100) {
    this.loginHistory = this.loginHistory.slice(0, 100);
  }

  if (!success) {
    this.failedLoginAttempts += 1;
    this.lastFailedLogin = new Date();

    // Auto-lock after 5 failed attempts
    if (this.failedLoginAttempts >= 5) {
      await this.lockAccount('Too many failed login attempts', 30);
    }
  } else {
    this.failedLoginAttempts = 0;
    this.lastFailedLogin = undefined;
  }

  await this.save();
};

AccountSecuritySchema.methods.addTrustedDevice = async function (
  deviceFingerprint: string
): Promise<void> {
  if (!this.trustedDevices.includes(deviceFingerprint)) {
    this.trustedDevices.push(deviceFingerprint);
    await this.save();
  }
};

AccountSecuritySchema.methods.removeTrustedDevice = async function (
  deviceFingerprint: string
): Promise<void> {
  this.trustedDevices = this.trustedDevices.filter((d: string) => d !== deviceFingerprint);
  await this.save();
};

AccountSecuritySchema.methods.isTrustedDevice = function (
  deviceFingerprint: string
): boolean {
  return this.trustedDevices.includes(deviceFingerprint);
};

AccountSecuritySchema.methods.isTrustedIP = function (ipAddress: string): boolean {
  return this.trustedIPs.includes(ipAddress);
};

// Static methods
AccountSecuritySchema.statics.findByWallet = function (walletAddress: string) {
  return this.findOne({ walletAddress: walletAddress.toLowerCase() });
};

AccountSecuritySchema.statics.unlockExpiredAccounts = async function (): Promise<number> {
  const result = await this.updateMany(
    {
      isLocked: true,
      lockExpiresAt: { $lte: new Date() },
    },
    {
      $set: {
        isLocked: false,
        lockReason: undefined,
        lockedAt: undefined,
        lockExpiresAt: undefined,
        failedLoginAttempts: 0,
      },
    }
  );

  return result.modifiedCount;
};

const AccountSecurity: Model<IAccountSecurity> = mongoose.model<IAccountSecurity>(
  'AccountSecurity',
  AccountSecuritySchema
);

export default AccountSecurity;

