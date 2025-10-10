import mongoose, { Document, Schema } from 'mongoose';

export interface IContact extends Document {
  name: string;
  email: string;
  subject: string;
  message: string;
  status: 'new' | 'read' | 'replied' | 'closed';
  priority: 'low' | 'medium' | 'high';
  source: 'website' | 'api' | 'whatsapp' | 'email';
  ipAddress?: string;
  userAgent?: string;
  autoResponderSent: boolean;
  adminNotes?: string;
  assignedTo?: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

const ContactSchema = new Schema<IContact>({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: [100, 'Name cannot exceed 100 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    trim: true,
    lowercase: true,
    match: [
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      'Please provide a valid email address'
    ]
  },
  subject: {
    type: String,
    required: [true, 'Subject is required'],
    trim: true,
    maxlength: [200, 'Subject cannot exceed 200 characters']
  },
  message: {
    type: String,
    required: [true, 'Message is required'],
    trim: true,
    maxlength: [2000, 'Message cannot exceed 2000 characters']
  },
  status: {
    type: String,
    enum: ['new', 'read', 'replied', 'closed'],
    default: 'new'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  source: {
    type: String,
    enum: ['website', 'api', 'whatsapp', 'email'],
    default: 'website'
  },
  ipAddress: {
    type: String,
    trim: true
  },
  userAgent: {
    type: String,
    trim: true
  },
  autoResponderSent: {
    type: Boolean,
    default: false
  },
  adminNotes: {
    type: String,
    trim: true,
    maxlength: [1000, 'Admin notes cannot exceed 1000 characters']
  },
  assignedTo: {
    type: String,
    trim: true
  },
  tags: [{
    type: String,
    trim: true
  }]
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better query performance
ContactSchema.index({ email: 1, createdAt: -1 });
ContactSchema.index({ status: 1, priority: 1 });
ContactSchema.index({ createdAt: -1 });
ContactSchema.index({ source: 1 });

// Virtual for response time
ContactSchema.virtual('responseTime').get(function() {
  if (this.status === 'replied' && this.updatedAt) {
    return this.updatedAt.getTime() - this.createdAt.getTime();
  }
  return null;
});

// Pre-save middleware to set priority based on keywords
ContactSchema.pre('save', function(next) {
  const urgentKeywords = ['urgent', 'emergency', 'critical', 'asap', 'immediately'];
  const lowPriorityKeywords = ['question', 'info', 'inquiry', 'general'];
  
  const messageText = (this.message + ' ' + this.subject).toLowerCase();
  
  if (urgentKeywords.some(keyword => messageText.includes(keyword))) {
    this.priority = 'high';
  } else if (lowPriorityKeywords.some(keyword => messageText.includes(keyword))) {
    this.priority = 'low';
  }
  
  next();
});

const Contact = mongoose.model<IContact>('Contact', ContactSchema);

export { Contact };
export default Contact;
