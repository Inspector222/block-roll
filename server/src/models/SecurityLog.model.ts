import mongoose, { Document, Model, Schema } from 'mongoose';

export type SecurityEventType =
  | 'login_success'
  | 'login_failed'
  | 'login_suspicious'
  | 'token_refresh'
  | 'logout'
  | 'password_change'
  | 'mfa_enabled'
  | 'mfa_disabled'
  | 'new_device'
  | 'new_ip'
  | 'suspicious_activity'
  | 'brute_force_attempt'
  | 'account_locked'
  | 'account_unlocked'
  | 'api_key_created'
  | 'api_key_revoked'
  | 'file_access_denied'
  | 'unauthorized_access_attempt'
  | 'session_hijack_attempt'
  | 'rate_limit_exceeded';

export interface ISecurityLog extends Document {
  user?: mongoose.Types.ObjectId;
  walletAddress?: string;
  eventType: SecurityEventType;
  severity: 'info' | 'warning' | 'critical';
  description: string;
  ipAddress: string;
  userAgent: string;
  deviceFingerprint?: string;
  geolocation?: {
    country?: string;
    city?: string;
    latitude?: number;
    longitude?: number;
  };
  metadata?: Record<string, any>;
  blocked: boolean;
  createdAt: Date;
}

export interface ISecurityLogModel extends Model<ISecurityLog> {
  findByUser(userId: mongoose.Types.ObjectId, limit?: number): Promise<ISecurityLog[]>;
  findSuspiciousActivity(timeRange?: number): Promise<ISecurityLog[]>;
  findByIP(ipAddress: string, limit?: number): Promise<ISecurityLog[]>;
  getFailedLoginAttempts(ipAddress: string, timeRange?: number): Promise<number>;
}

const SecurityLogSchema: Schema<ISecurityLog> = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    walletAddress: {
      type: String,
      lowercase: true,
    },
    eventType: {
      type: String,
      required: true,
      enum: [
        'login_success',
        'login_failed',
        'login_suspicious',
        'token_refresh',
        'logout',
        'password_change',
        'mfa_enabled',
        'mfa_disabled',
        'new_device',
        'new_ip',
        'suspicious_activity',
        'brute_force_attempt',
        'account_locked',
        'account_unlocked',
        'api_key_created',
        'api_key_revoked',
        'file_access_denied',
        'unauthorized_access_attempt',
        'session_hijack_attempt',
        'rate_limit_exceeded',
      ],
    },
    severity: {
      type: String,
      enum: ['info', 'warning', 'critical'],
      default: 'info',
    },
    description: {
      type: String,
      required: true,
    },
    ipAddress: {
      type: String,
      required: true,
    },
    userAgent: {
      type: String,
      required: true,
    },
    deviceFingerprint: {
      type: String,
    },
    geolocation: {
      country: String,
      city: String,
      latitude: Number,
      longitude: Number,
    },
    metadata: {
      type: Schema.Types.Mixed,
      default: {},
    },
    blocked: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: function (_doc, ret: any) {
        delete ret.__v;
        return ret;
      },
    },
  }
);

// Indexes for efficient querying
SecurityLogSchema.index({ createdAt: -1 });
SecurityLogSchema.index({ user: 1, createdAt: -1 });
SecurityLogSchema.index({ eventType: 1, createdAt: -1 });
SecurityLogSchema.index({ severity: 1, createdAt: -1 });
SecurityLogSchema.index({ blocked: 1, createdAt: -1 });
SecurityLogSchema.index({ ipAddress: 1, eventType: 1 });

// Static methods
SecurityLogSchema.statics.findByUser = function (
  userId: mongoose.Types.ObjectId,
  limit = 50
) {
  return this.find({ user: userId })
    .sort({ createdAt: -1 })
    .limit(limit);
};

SecurityLogSchema.statics.findSuspiciousActivity = function (timeRange = 24) {
  const since = new Date();
  since.setHours(since.getHours() - timeRange);

  return this.find({
    severity: { $in: ['warning', 'critical'] },
    createdAt: { $gte: since },
  }).sort({ createdAt: -1 });
};

SecurityLogSchema.statics.findByIP = function (ipAddress: string, limit = 100) {
  return this.find({ ipAddress })
    .sort({ createdAt: -1 })
    .limit(limit);
};

SecurityLogSchema.statics.getFailedLoginAttempts = async function (
  ipAddress: string,
  timeRange = 15
): Promise<number> {
  const since = new Date();
  since.setMinutes(since.getMinutes() - timeRange);

  return this.countDocuments({
    ipAddress,
    eventType: 'login_failed',
    createdAt: { $gte: since },
  });
};

const SecurityLog = mongoose.model<ISecurityLog, ISecurityLogModel>(
  'SecurityLog',
  SecurityLogSchema
);

export default SecurityLog;

