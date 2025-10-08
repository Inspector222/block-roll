import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IAdminStats {
  totalUsers: number;
  totalFiles: number;
  totalApiKeys: number;
  totalWorkspaces: number;
  storageUsed: number; // in bytes
  activeUsers: number;
  lastUpdated: Date;
}

export interface IAdminActivity {
  action: string;
  targetType: 'user' | 'file' | 'apiKey' | 'workspace' | 'system';
  targetId?: mongoose.Types.ObjectId;
  details: string;
  timestamp: Date;
}

export interface IAdmin extends Document {
  walletAddress: string;
  permissions: string[];
  stats: IAdminStats;
  activityLog: IAdminActivity[];
  settings: {
    emailNotifications: boolean;
    securityAlerts: boolean;
    weeklyReports: boolean;
  };
  createdAt: Date;
  updatedAt: Date;
}

const AdminStatsSchema = new Schema(
  {
    totalUsers: {
      type: Number,
      default: 0,
      min: 0,
    },
    totalFiles: {
      type: Number,
      default: 0,
      min: 0,
    },
    totalApiKeys: {
      type: Number,
      default: 0,
      min: 0,
    },
    totalWorkspaces: {
      type: Number,
      default: 0,
      min: 0,
    },
    storageUsed: {
      type: Number,
      default: 0,
      min: 0,
    },
    activeUsers: {
      type: Number,
      default: 0,
      min: 0,
    },
    lastUpdated: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false }
);

const AdminActivitySchema = new Schema(
  {
    action: {
      type: String,
      required: true,
      trim: true,
    },
    targetType: {
      type: String,
      enum: ['user', 'file', 'apiKey', 'workspace', 'system'],
      required: true,
    },
    targetId: {
      type: Schema.Types.ObjectId,
    },
    details: {
      type: String,
      required: true,
      trim: true,
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false }
);

const AdminSchema: Schema<IAdmin> = new Schema(
  {
    walletAddress: {
      type: String,
      required: [true, 'Wallet address is required'],
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
      validate: {
        validator: function (v: string) {
          return /^0x[a-fA-F0-9]{40}$/.test(v);
        },
        message: 'Invalid wallet address format',
      },
    },
    permissions: {
      type: [String],
      default: [
        'view_users',
        'view_files',
        'view_analytics',
        'manage_api_keys',
        'view_security_alerts',
      ],
      enum: [
        'view_users',
        'manage_users',
        'view_files',
        'manage_files',
        'view_analytics',
        'manage_api_keys',
        'view_security_alerts',
        'manage_security',
        'system_settings',
        'super_admin',
      ],
    },
    stats: {
      type: AdminStatsSchema,
      default: () => ({
        totalUsers: 0,
        totalFiles: 0,
        totalApiKeys: 0,
        totalWorkspaces: 0,
        storageUsed: 0,
        activeUsers: 0,
        lastUpdated: new Date(),
      }),
    },
    activityLog: {
      type: [AdminActivitySchema],
      default: [],
    },
    settings: {
      emailNotifications: {
        type: Boolean,
        default: true,
      },
      securityAlerts: {
        type: Boolean,
        default: true,
      },
      weeklyReports: {
        type: Boolean,
        default: true,
      },
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: function (doc, ret) {
        delete ret.__v;
        return ret;
      },
    },
  }
);

// Indexes
AdminSchema.index({ walletAddress: 1 });
AdminSchema.index({ 'activityLog.timestamp': -1 });

// Instance methods
AdminSchema.methods.hasPermission = function (permission: string): boolean {
  return (
    this.permissions.includes(permission) || this.permissions.includes('super_admin')
  );
};

AdminSchema.methods.logActivity = function (
  action: string,
  targetType: 'user' | 'file' | 'apiKey' | 'workspace' | 'system',
  details: string,
  targetId?: mongoose.Types.ObjectId
): void {
  this.activityLog.unshift({
    action,
    targetType,
    targetId,
    details,
    timestamp: new Date(),
  });

  // Keep only last 1000 activities
  if (this.activityLog.length > 1000) {
    this.activityLog = this.activityLog.slice(0, 1000);
  }
};

AdminSchema.methods.updateStats = async function (
  stats: Partial<IAdminStats>
): Promise<void> {
  this.stats = {
    ...this.stats,
    ...stats,
    lastUpdated: new Date(),
  };
  await this.save();
};

// Static methods
AdminSchema.statics.findByWallet = function (walletAddress: string) {
  return this.findOne({ walletAddress: walletAddress.toLowerCase() });
};

AdminSchema.statics.getAllAdmins = function () {
  return this.find().sort({ createdAt: -1 });
};

AdminSchema.statics.getSuperAdmins = function () {
  return this.find({ permissions: 'super_admin' });
};

const Admin: Model<IAdmin> = mongoose.model<IAdmin>('Admin', AdminSchema);

export default Admin;
