import mongoose from 'mongoose';

export interface IProduct extends mongoose.Document {
  name: string;
  description?: string;
  price: number;
  quantity: number;
  branchId: string;
  category?: string;
  imageUrl?: string;
  isActive: boolean;
  sku?: string;
  weight?: number;
  dimensions?: {
    length?: number;
    width?: number;
    height?: number;
  };
  tags?: string[];
  createdAt?: Date;
  updatedAt?: Date;
}

const ProductSchema = new mongoose.Schema<IProduct>({
  name: { type: String, required: true },
  description: { type: String },
  price: { type: Number, required: true, min: 0 },
  quantity: { type: Number, required: true, min: 0 },
  branchId: { type: String, required: true },
  category: { type: String },
  imageUrl: { type: String },
  isActive: { type: Boolean, default: true },
  sku: { type: String, unique: true },
  weight: { type: Number },
  dimensions: {
    length: Number,
    width: Number,
    height: Number
  },
  tags: [{ type: String }]
}, { timestamps: true });

// Index for efficient queries
ProductSchema.index({ branchId: 1, isActive: 1 });
ProductSchema.index({ category: 1, branchId: 1 });

export default mongoose.model<IProduct>('Product', ProductSchema);
