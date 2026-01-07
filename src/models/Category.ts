import mongoose, { Document, Schema } from 'mongoose';

export interface ICategory extends Document {
  userId: mongoose.Types.ObjectId;
  name: string;
  jobIds: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const categorySchema = new Schema<ICategory>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  jobIds: [{
    type: Schema.Types.ObjectId,
    ref: 'Job'
  }]
}, {
  timestamps: true
});

// Compound index for user + category name uniqueness
categorySchema.index({ userId: 1, name: 1 }, { unique: true });

export const Category = mongoose.model<ICategory>('Category', categorySchema);
