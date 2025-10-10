import crypto from 'crypto';
import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IApiKey extends Document {
  key: string;
  hashedKey: string;
  owner: mongoose.Types.ObjectId;
  permissions: string[];
  sdkType: 'react' | 'vue' | 'cdn' | 'custom';
  active: boolean;
  usageCount: number;
  lastUsed?: Date;
  expiresAt?: Date;
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
  generateKey(): string;
  verifyKey(key: string): boolean;
  incrementUsage(): Promise<void>;
  isExpired: boolean;
}

export interface IApiKeyModel extends Model<IApiKey> {
  findByKey(key: string): Promise<IApiKey | null>;
  findActiveByOwner(ownerId: mongoose.Types.ObjectId): Promise<IApiKey[]>;
  revokeExpired(): Promise<number>;
}

const ApiKeySchema: Schema<IApiKey> = new Schema(
  {
    key: {
      type: String,
      unique: true,
      sparse: true,
      select: false, // Don't return key by default
    },
    hashedKey: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Owner is required'],
      index: true,
    },
    permissions: {
      type: [String],
      default: ['upload', 'read'],
      enum: ['upload', 'read', 'share', 'delete', 'emergencyAccess', 'admin'],
    },
    sdkType: {
      type: String,
      enum: ['react', 'vue', 'cdn', 'custom'],
      required: [true, 'SDK type is required'],
    },
    active: {
      type: Boolean,
      default: true,
      index: true,
    },
    usageCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    lastUsed: {
      type: Date,
    },
    expiresAt: {
      type: Date,
    },
    metadata: {
      type: Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: function (_doc, ret: any) {
        delete ret.__v;
        delete ret.hashedKey;
        delete ret.key;
        return ret;
      },
    },
  }
);

// Indexes
ApiKeySchema.index({ owner: 1, active: 1 });
ApiKeySchema.index({ createdAt: -1 });
ApiKeySchema.index({ expiresAt: 1 });

// Virtual for checking if key is expired
ApiKeySchema.virtual('isExpired').get(function () {
  if (!this.expiresAt) return false;
  return new Date() > this.expiresAt;
});

// Pre-save hook to generate and hash key
ApiKeySchema.pre('save', async function (next) {
  if (this.isNew && !this.key) {
    // Generate a random API key
    const apiKey = `br_${crypto.randomBytes(32).toString('hex')}`;
    this.key = apiKey;
    this.hashedKey = crypto.createHash('sha256').update(apiKey).digest('hex');
  }
  next();
});

// Instance methods
ApiKeySchema.methods.generateKey = function (): string {
  const apiKey = `br_${crypto.randomBytes(32).toString('hex')}`;
  this.key = apiKey;
  this.hashedKey = crypto.createHash('sha256').update(apiKey).digest('hex');
  return apiKey;
};

ApiKeySchema.methods.verifyKey = function (key: string): boolean {
  const hashedInput = crypto.createHash('sha256').update(key).digest('hex');
  return hashedInput === this.hashedKey;
};

ApiKeySchema.methods.incrementUsage = async function (): Promise<void> {
  this.usageCount += 1;
  this.lastUsed = new Date();
  await this.save();
};

// Static methods
ApiKeySchema.statics.findByKey = async function (key: string) {
  const hashedKey = crypto.createHash('sha256').update(key).digest('hex');
  return this.findOne({ hashedKey, active: true });
};

ApiKeySchema.statics.findActiveByOwner = function (ownerId: mongoose.Types.ObjectId) {
  return this.find({ owner: ownerId, active: true });
};

ApiKeySchema.statics.revokeExpired = async function () {
  const result = await this.updateMany(
    {
      expiresAt: { $lte: new Date() },
      active: true,
    },
    {
      $set: { active: false },
    }
  );
  return result.modifiedCount;
};

const ApiKey = mongoose.model<IApiKey, IApiKeyModel>('ApiKey', ApiKeySchema);

export default ApiKey;

