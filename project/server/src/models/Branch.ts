import mongoose from 'mongoose';

export interface IBranch extends mongoose.Document {
  name: string;
  location?: string;
  managerId?: string;
  razorpayKey?: string;
}

const BranchSchema = new mongoose.Schema<IBranch>({
  name: { type: String, required: true },
  location: String,
  managerId: String,
  razorpayKey: String
}, { timestamps: true });

export default mongoose.model<IBranch>('Branch', BranchSchema);
