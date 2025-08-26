import mongoose from 'mongoose';

export interface IProduct extends mongoose.Document {
  name: string;
  description?: string;
  price: number;
  stock: number;
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
  stock: { type: Number, required: true, min: 0 },
  category: { type: String },
  imageUrl: { type: String },
  isActive: { type: Boolean, default: true },
  sku: { type: String, unique: true, sparse: true },
  weight: { type: Number, min: 0 },
  dimensions: {
    length: { type: Number, min: 0 },
    width: { type: Number, min: 0 },
    height: { type: Number, min: 0 }
  },
  tags: [{ type: String }]
}, { timestamps: true });

// Index for efficient queries
ProductSchema.index({ isActive: 1 });
ProductSchema.index({ category: 1 });

export default mongoose.model<IProduct>('Product', ProductSchema);
