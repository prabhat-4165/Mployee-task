import mongoose from 'mongoose';

const ItemSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    status: { type: String, enum: ['active', 'inactive'], required: true },
    tags: { type: [String], default: [] },
  },
  { timestamps: true }
);

export default mongoose.model('Item', ItemSchema);
