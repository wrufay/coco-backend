import mongoose, { Document, Schema } from 'mongoose';

export interface IJob extends Document {
  userId: mongoose.Types.ObjectId;
  company: string;
  role: string;
  location: string;
  type: 'Remote' | 'Hybrid' | 'On-site';
  link: string;
  deadline: string;
  notes: string;
  status: 'Wishlist' | 'Applied' | 'Interview' | 'Offer' | 'Rejected';
  createdAt: Date;
  updatedAt: Date;
}

const jobSchema = new Schema<IJob>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  company: {
    type: String,
    required: true,
    trim: true
  },
  role: {
    type: String,
    required: true,
    trim: true
  },
  location: {
    type: String,
    required: true,
    trim: true
  },
  type: {
    type: String,
    enum: ['Remote', 'Hybrid', 'On-site'],
    required: true
  },
  link: {
    type: String,
    trim: true,
    default: ''
  },
  deadline: {
    type: String,
    default: ''
  },
  notes: {
    type: String,
    default: ''
  },
  status: {
    type: String,
    enum: ['Wishlist', 'Applied', 'Interview', 'Offer', 'Rejected'],
    default: 'Wishlist'
  }
}, {
  timestamps: true
});

// Index for faster queries
jobSchema.index({ userId: 1, createdAt: -1 });

export const Job = mongoose.model<IJob>('Job', jobSchema);
