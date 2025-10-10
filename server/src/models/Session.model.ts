import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IDeviceInfo {
  fingerprint: string;
  name?: string;
  os?: string;
  browser?: string;
  trusted: boolean;
  lastSeen: Date;
}

export interface ISession extends Document {
  user: mongoose.Types.ObjectId;
  refreshToken: string; // Hashed
  deviceInfo: IDeviceInfo;
  ipAddress: string;
  geolocation?: {
    country?: string;
    city?: string;
    timezone?: string;
  };
  isActive: boolean;
  lastActivity: Date;
  expiresAt: Date;
  revokedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  updateActivity(): Promise<void>;
  revoke(): Promise<void>;
  isInactive(minutes?: number): boolean;
  isExpired: boolean;
}

export interface ISessionModel extends Model<ISession> {
  findActiveSessions(userId: mongoose.Types.ObjectId): Promise<ISession[]>;
  revokeAllSessions(userId: mongoose.Types.ObjectId): Promise<number>;
  revokeExpiredSessions(): Promise<number>;
  findByDevice(userId: mongoose.Types.ObjectId, fingerprint: string): Promise<ISession | null>;
}

const DeviceInfoSchema = new Schema(
  {
    fingerprint: {
      type: String,
      required: true,
    },
    name: String,
    os: String,
    browser: String,
    trusted: {
      type: Boolean,
      default: false,
    },
    lastSeen: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false }
);

const SessionSchema: Schema<ISession> = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    refreshToken: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    deviceInfo: {
      type: DeviceInfoSchema,
      required: true,
    },
    ipAddress: {
      type: String,
      required: true,
      index: true,
    },
    geolocation: {
      country: String,
      city: String,
      timezone: String,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    lastActivity: {
      type: Date,
      default: Date.now,
      index: true,
    },
    expiresAt: {
      type: Date,
      required: true,
    },
    revokedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: function (_doc, ret: any) {
        delete ret.__v;
        delete ret.refreshToken;
        return ret;
      },
    },
  }
);

// Compound indexes
SessionSchema.index({ user: 1, isActive: 1 });
SessionSchema.index({ user: 1, 'deviceInfo.fingerprint': 1 });
SessionSchema.index({ expiresAt: 1, isActive: 1 });

// Virtual for checking if session is expired
SessionSchema.virtual('isExpired').get(function () {
  return new Date() > this.expiresAt;
});

// Methods
SessionSchema.methods.updateActivity = async function (): Promise<void> {
  this.lastActivity = new Date();
  this.deviceInfo.lastSeen = new Date();
  await this.save();
};

SessionSchema.methods.revoke = async function (): Promise<void> {
  this.isActive = false;
  this.revokedAt = new Date();
  await this.save();
};

SessionSchema.methods.isInactive = function (minutes: number = 30): boolean {
  const inactiveTime = new Date();
  inactiveTime.setMinutes(inactiveTime.getMinutes() - minutes);
  return this.lastActivity < inactiveTime;
};

// Static methods
SessionSchema.statics.findActiveSessions = function (userId: mongoose.Types.ObjectId) {
  return this.find({
    user: userId,
    isActive: true,
    expiresAt: { $gt: new Date() },
  }).sort({ lastActivity: -1 });
};

SessionSchema.statics.revokeAllSessions = async function (
  userId: mongoose.Types.ObjectId
): Promise<number> {
  const result = await this.updateMany(
    { user: userId, isActive: true },
    {
      $set: {
        isActive: false,
        revokedAt: new Date(),
      },
    }
  );
  return result.modifiedCount;
};

SessionSchema.statics.revokeExpiredSessions = async function (): Promise<number> {
  const result = await this.updateMany(
    {
      isActive: true,
      expiresAt: { $lte: new Date() },
    },
    {
      $set: {
        isActive: false,
        revokedAt: new Date(),
      },
    }
  );
  return result.modifiedCount;
};

SessionSchema.statics.findByDevice = function (
  userId: mongoose.Types.ObjectId,
  fingerprint: string
) {
  return this.findOne({
    user: userId,
    'deviceInfo.fingerprint': fingerprint,
    isActive: true,
  });
};

const Session = mongoose.model<ISession, ISessionModel>('Session', SessionSchema);

export default Session;

