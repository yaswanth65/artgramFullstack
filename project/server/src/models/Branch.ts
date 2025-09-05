import mongoose from 'mongoose';

export interface IBranch extends mongoose.Document {
  name: string;
  location?: string;
  address?: string;
  phone?: string;
  email?: string;
  managerId?: string;
  razorpayKey?: string;
  allowSlime?: boolean;
  allowTufting?: boolean;
  allowMonday?: boolean;
  isActive?: boolean;
}

const BranchSchema = new mongoose.Schema<IBranch>({
  name: { type: String, required: true },
  location: String,
  address: String,
  phone: String,
  email: String,
  managerId: String,
  razorpayKey: String,
  allowSlime: { type: Boolean, default: true },
  allowTufting: { type: Boolean, default: true },
  allowMonday: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

export default mongoose.model<IBranch>('Branch', BranchSchema);
