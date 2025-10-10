import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IEmergencyAccess {
  enabled: boolean;
  backupWallets: string[];
  inactivityPeriod?: number; // in days
}

export interface IFile extends Document {
  owner: mongoose.Types.ObjectId;
  fileName: string;
  fileType: string;
  encryptedHash: string; // IPFS CID or hash stored on-chain
  fileHash: string; // Original file hash for verification
  accessList: string[]; // Wallet addresses
  emergencyAccess: IEmergencyAccess;
  size: number; // in bytes
  encryptionKeyRef: string; // Reference to encrypted key
  expiryDate?: Date;
  status: 'active' | 'revoked' | 'expired';
  workspace?: mongoose.Types.ObjectId;
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
  hasAccess(walletAddress: string): boolean;
  grantAccess(walletAddress: string): void;
  revokeAccess(walletAddress: string): void;
  isExpired: boolean;
}

export interface IFileModel extends Model<IFile> {
  findByOwner(ownerId: mongoose.Types.ObjectId): Promise<IFile[]>;
  findExpiredFiles(): Promise<IFile[]>;
}

const EmergencyAccessSchema = new Schema(
  {
    enabled: {
      type: Boolean,
      default: false,
    },
    backupWallets: {
      type: [String],
      default: [],
      validate: {
        validator: function (arr: string[]) {
          return arr.every((addr) => /^0x[a-fA-F0-9]{40}$/.test(addr));
        },
        message: 'Invalid wallet address in backup wallets',
      },
    },
    inactivityPeriod: {
      type: Number,
      min: 1,
      max: 365,
    },
  },
  { _id: false }
);

const FileSchema: Schema<IFile> = new Schema(
  {
    owner: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Owner is required'],
      index: true,
    },
    fileName: {
      type: String,
      required: [true, 'File name is required'],
      trim: true,
      maxlength: [255, 'File name too long'],
    },
    fileType: {
      type: String,
      required: [true, 'File type is required'],
      trim: true,
    },
    encryptedHash: {
      type: String,
      required: [true, 'Encrypted hash is required'],
      unique: true,
      index: true,
    },
    fileHash: {
      type: String,
      required: [true, 'File hash is required'],
      index: true,
    },
    accessList: {
      type: [String],
      default: [],
      validate: {
        validator: function (arr: string[]) {
          return arr.every((addr) => /^0x[a-fA-F0-9]{40}$/.test(addr));
        },
        message: 'Invalid wallet address in access list',
      },
    },
    emergencyAccess: {
      type: EmergencyAccessSchema,
      default: () => ({ enabled: false, backupWallets: [] }),
    },
    size: {
      type: Number,
      required: [true, 'File size is required'],
      min: [0, 'File size cannot be negative'],
    },
    encryptionKeyRef: {
      type: String,
      required: [true, 'Encryption key reference is required'],
    },
    expiryDate: {
      type: Date,
    },
    status: {
      type: String,
      enum: ['active', 'revoked', 'expired'],
      default: 'active',
      index: true,
    },
    workspace: {
      type: Schema.Types.ObjectId,
      ref: 'Workspace',
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
        return ret;
      },
    },
  }
);

// Indexes
FileSchema.index({ owner: 1, status: 1 });
FileSchema.index({ createdAt: -1 });
FileSchema.index({ expiryDate: 1 });
FileSchema.index({ 'accessList': 1 });

// Virtual for checking if file is expired
FileSchema.virtual('isExpired').get(function () {
  if (!this.expiryDate) return false;
  return new Date() > this.expiryDate;
});

// Methods
FileSchema.methods.hasAccess = function (walletAddress: string): boolean {
  return (
    this.accessList.includes(walletAddress.toLowerCase()) ||
    this.owner.toString() === walletAddress
  );
};

FileSchema.methods.grantAccess = function (walletAddress: string): void {
  const lowerAddress = walletAddress.toLowerCase();
  if (!this.accessList.includes(lowerAddress)) {
    this.accessList.push(lowerAddress);
  }
};

FileSchema.methods.revokeAccess = function (walletAddress: string): void {
  this.accessList = this.accessList.filter(
    (addr: string) => addr !== walletAddress.toLowerCase()
  );
};

// Static methods
FileSchema.statics.findByOwner = function (ownerId: mongoose.Types.ObjectId) {
  return this.find({ owner: ownerId, status: 'active' });
};

FileSchema.statics.findExpiredFiles = function () {
  return this.find({
    expiryDate: { $lte: new Date() },
    status: 'active',
  });
};

const File = mongoose.model<IFile, IFileModel>('File', FileSchema);

export default File;

