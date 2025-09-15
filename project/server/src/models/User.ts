import mongoose from 'mongoose';

export type Role = 'admin' | 'branch_manager' | 'customer';

export interface CartItem {
  productId: string;
  title: string;
  price: number;
  qty: number;
  image?: string;
}

export interface IUser extends mongoose.Document {
  name: string;
  email: string;
  password: string;
  role: Role;
  branchId?: mongoose.Types.ObjectId; // Changed to ObjectId
  phone?: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
  };
  cart?: CartItem[]; // Add cart to user model
  passwordResetCode?: string;
  passwordResetExpires?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

const UserSchema = new mongoose.Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, minlength: 6 }, // Added password minimum length
  role: { type: String, enum: ['admin', 'branch_manager', 'customer'], default: 'customer' },
  branchId: { type: mongoose.Schema.Types.ObjectId, ref: 'Branch' },
  phone: { type: String },
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String
  },
  cart: [{
    productId: { type: String, required: true },
    title: { type: String, required: true },
    price: { type: Number, required: true },
    qty: { type: Number, required: true, min: 1 },
    image: { type: String }
  }],
  passwordResetCode: { type: String },
  passwordResetExpires: { type: Date }
}, { timestamps: true });

export default mongoose.model<IUser>('User', UserSchema);
