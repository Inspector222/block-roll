import mongoose, { Document, Model, Schema } from 'mongoose';

export type NotificationType =
  | 'file_uploaded'
  | 'file_shared'
  | 'access_granted'
  | 'access_revoked'
  | 'emergency_access'
  | 'file_expired'
  | 'workspace_invite'
  | 'api_key_created'
  | 'security_alert'
  | 'system'
  | 'admin';

export interface INotification extends Document {
  user: mongoose.Types.ObjectId;
  type: NotificationType;
  title: string;
  message: string;
  data?: Record<string, any>;
  read: boolean;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  actionUrl?: string;
  expiresAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  markAsRead(): Promise<void>;
  isExpired(): boolean;
}

export interface INotificationModel extends Model<INotification> {
  findUnreadByUser(userId: mongoose.Types.ObjectId): Promise<INotification[]>;
  findByUser(userId: mongoose.Types.ObjectId, limit?: number): Promise<INotification[]>;
  markAllAsRead(userId: mongoose.Types.ObjectId): Promise<number>;
  deleteExpired(): Promise<number>;
  getUnreadCount(userId: mongoose.Types.ObjectId): Promise<number>;
}

const NotificationSchema: Schema<INotification> = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User is required'],
      index: true,
    },
    type: {
      type: String,
      required: [true, 'Notification type is required'],
      enum: [
        'file_uploaded',
        'file_shared',
        'access_granted',
        'access_revoked',
        'emergency_access',
        'file_expired',
        'workspace_invite',
        'api_key_created',
        'security_alert',
        'system',
        'admin',
      ],
      index: true,
    },
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: [200, 'Title too long'],
    },
    message: {
      type: String,
      required: [true, 'Message is required'],
      trim: true,
      maxlength: [1000, 'Message too long'],
    },
    data: {
      type: Schema.Types.Mixed,
      default: {},
    },
    read: {
      type: Boolean,
      default: false,
      index: true,
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high', 'urgent'],
      default: 'medium',
      index: true,
    },
    actionUrl: {
      type: String,
      trim: true,
    },
    expiresAt: {
      type: Date,
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

// Indexes
NotificationSchema.index({ user: 1, read: 1 });
NotificationSchema.index({ user: 1, createdAt: -1 });
NotificationSchema.index({ expiresAt: 1 });
NotificationSchema.index({ type: 1, createdAt: -1 });

// Instance methods
NotificationSchema.methods.markAsRead = async function (): Promise<void> {
  this.read = true;
  await this.save();
};

NotificationSchema.methods.isExpired = function (): boolean {
  if (!this.expiresAt) return false;
  return new Date() > this.expiresAt;
};

// Static methods
NotificationSchema.statics.findUnreadByUser = function (
  userId: mongoose.Types.ObjectId
) {
  return this.find({
    user: userId,
    read: false,
  }).sort({ createdAt: -1 });
};

NotificationSchema.statics.findByUser = function (
  userId: mongoose.Types.ObjectId,
  limit = 50
) {
  return this.find({ user: userId })
    .sort({ createdAt: -1 })
    .limit(limit);
};

NotificationSchema.statics.markAllAsRead = async function (
  userId: mongoose.Types.ObjectId
) {
  const result = await this.updateMany(
    { user: userId, read: false },
    { $set: { read: true } }
  );
  return result.modifiedCount;
};

NotificationSchema.statics.deleteExpired = async function () {
  const result = await this.deleteMany({
    expiresAt: { $lte: new Date() },
  });
  return result.deletedCount;
};

NotificationSchema.statics.getUnreadCount = async function (
  userId: mongoose.Types.ObjectId
): Promise<number> {
  return this.countDocuments({ user: userId, read: false });
};

const Notification = mongoose.model<INotification, INotificationModel>(
  'Notification',
  NotificationSchema
);

export default Notification;

