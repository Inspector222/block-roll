import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IWorkspaceMember {
  wallet: string;
  role: 'owner' | 'admin' | 'editor' | 'viewer';
  joinedAt: Date;
}

export interface IWorkspace extends Document {
  name: string;
  description?: string;
  members: IWorkspaceMember[];
  files: mongoose.Types.ObjectId[];
  settings: {
    allowFileSharing: boolean;
    requireApproval: boolean;
    maxMembers: number;
  };
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const WorkspaceMemberSchema = new Schema(
  {
    wallet: {
      type: String,
      required: true,
      lowercase: true,
      validate: {
        validator: function (v: string) {
          return /^0x[a-fA-F0-9]{40}$/.test(v);
        },
        message: 'Invalid wallet address',
      },
    },
    role: {
      type: String,
      enum: ['owner', 'admin', 'editor', 'viewer'],
      default: 'viewer',
    },
    joinedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false }
);

const WorkspaceSchema: Schema<IWorkspace> = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Workspace name is required'],
      trim: true,
      maxlength: [100, 'Workspace name too long'],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, 'Description too long'],
    },
    members: {
      type: [WorkspaceMemberSchema],
      default: [],
      validate: {
        validator: function (arr: IWorkspaceMember[]) {
          return arr.length > 0;
        },
        message: 'Workspace must have at least one member',
      },
    },
    files: [
      {
        type: Schema.Types.ObjectId,
        ref: 'File',
      },
    ],
    settings: {
      allowFileSharing: {
        type: Boolean,
        default: true,
      },
      requireApproval: {
        type: Boolean,
        default: false,
      },
      maxMembers: {
        type: Number,
        default: 50,
        min: 1,
        max: 500,
      },
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
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
WorkspaceSchema.index({ 'members.wallet': 1 });
WorkspaceSchema.index({ createdBy: 1 });
WorkspaceSchema.index({ createdAt: -1 });

// Instance methods
WorkspaceSchema.methods.hasMember = function (walletAddress: string): boolean {
  return this.members.some(
    (member: IWorkspaceMember) =>
      member.wallet.toLowerCase() === walletAddress.toLowerCase()
  );
};

WorkspaceSchema.methods.getMemberRole = function (walletAddress: string): string | null {
  const member = this.members.find(
    (m: IWorkspaceMember) => m.wallet.toLowerCase() === walletAddress.toLowerCase()
  );
  return member ? member.role : null;
};

WorkspaceSchema.methods.addMember = function (
  walletAddress: string,
  role: 'admin' | 'editor' | 'viewer' = 'viewer'
): void {
  if (!this.hasMember(walletAddress)) {
    this.members.push({
      wallet: walletAddress.toLowerCase(),
      role,
      joinedAt: new Date(),
    });
  }
};

WorkspaceSchema.methods.removeMember = function (walletAddress: string): void {
  this.members = this.members.filter(
    (member: IWorkspaceMember) =>
      member.wallet.toLowerCase() !== walletAddress.toLowerCase()
  );
};

WorkspaceSchema.methods.updateMemberRole = function (
  walletAddress: string,
  newRole: 'admin' | 'editor' | 'viewer'
): void {
  const member = this.members.find(
    (m: IWorkspaceMember) => m.wallet.toLowerCase() === walletAddress.toLowerCase()
  );
  if (member) {
    member.role = newRole;
  }
};

WorkspaceSchema.methods.canEdit = function (walletAddress: string): boolean {
  const role = this.getMemberRole(walletAddress);
  return role === 'owner' || role === 'admin' || role === 'editor';
};

WorkspaceSchema.methods.isOwner = function (walletAddress: string): boolean {
  const role = this.getMemberRole(walletAddress);
  return role === 'owner';
};

// Static methods
WorkspaceSchema.statics.findByMember = function (walletAddress: string) {
  return this.find({
    'members.wallet': walletAddress.toLowerCase(),
  });
};

WorkspaceSchema.statics.findByCreator = function (creatorId: mongoose.Types.ObjectId) {
  return this.find({ createdBy: creatorId });
};

const Workspace: Model<IWorkspace> = mongoose.model<IWorkspace>(
  'Workspace',
  WorkspaceSchema
);

export default Workspace;

