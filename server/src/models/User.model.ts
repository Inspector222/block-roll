import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IUser extends Document {
  walletAddress: string;
  email?: string;
  role: 'user' | 'admin';
  apiKeys: mongoose.Types.ObjectId[];
  workspaces: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema<IUser> = new Schema(
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
        message: 'Invalid Ethereum wallet address format',
      },
    },
    email: {
      type: String,
      sparse: true,
      trim: true,
      lowercase: true,
      validate: {
        validator: function (v: string) {
          return !v || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
        },
        message: 'Invalid email format',
      },
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
      index: true,
    },
    apiKeys: [
      {
        type: Schema.Types.ObjectId,
        ref: 'ApiKey',
      },
    ],
    workspaces: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Workspace',
      },
    ],
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
UserSchema.index({ walletAddress: 1, role: 1 });
UserSchema.index({ createdAt: -1 });

// Virtual for files
UserSchema.virtual('files', {
  ref: 'File',
  localField: '_id',
  foreignField: 'owner',
});

// Instance methods
UserSchema.methods.isAdmin = function (): boolean {
  return this.role === 'admin';
};

// Static methods
UserSchema.statics.findByWallet = function (walletAddress: string) {
  return this.findOne({ walletAddress: walletAddress.toLowerCase() });
};

UserSchema.statics.getAllAdmins = function () {
  return this.find({ role: 'admin' });
};

const User: Model<IUser> = mongoose.model<IUser>('User', UserSchema);

export default User;

