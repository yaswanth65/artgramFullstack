import mongoose from 'mongoose';

export type Role = 'admin' | 'branch_manager' | 'customer';

export interface IUser extends mongoose.Document {
  name: string;
  email: string;
  password: string;
  role: Role;
  branchId?: string;
  phone?: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
  };
  createdAt?: Date;
  updatedAt?: Date;
}

const UserSchema = new mongoose.Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['admin','branch_manager','customer'], default: 'customer' },
  branchId: { type: String },
  phone: { type: String },
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String
  }
}, { timestamps: true });

export default mongoose.model<IUser>('User', UserSchema);
