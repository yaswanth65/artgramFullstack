import mongoose from 'mongoose';

export interface ITrackingUpdate {
  status: string;
  location?: string;
  description?: string;
  createdAt?: Date;
}

export interface IOrderProduct {
  productId: string;
  quantity: number;
  price: number;
  name: string;
}

export interface IShippingAddress {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface IOrder extends mongoose.Document {
  products: IOrderProduct[];
  totalAmount: number;
  branchId?: string;
  customerId?: string;
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  shippingAddress?: IShippingAddress;
  trackingUpdates: ITrackingUpdate[];
  paymentStatus: 'pending' | 'completed' | 'failed';
  orderStatus: 'pending' | 'payment_confirmed' | 'processing' | 'packed' | 'shipped' | 'in_transit' | 'out_for_delivery' | 'delivered' | 'cancelled';
  paymentIntentId?: string;
  trackingNumber?: string;
}

const TrackingSchema = new mongoose.Schema<ITrackingUpdate>({
  status: { type: String, required: true },
  location: String,
  description: String,
  createdAt: { type: Date, default: Date.now }
});

const OrderProductSchema = new mongoose.Schema<IOrderProduct>({
  productId: { type: String, required: true },
  quantity: { type: Number, required: true, min: 1 },
  price: { type: Number, required: true, min: 0 },
  name: { type: String, required: true }
});

const ShippingAddressSchema = new mongoose.Schema<IShippingAddress>({
  street: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  zipCode: { type: String, required: true },
  country: { type: String, required: true }
});

const OrderSchema = new mongoose.Schema<IOrder>({
  products: { type: [OrderProductSchema], default: [] },
  totalAmount: { type: Number, required: true, min: 0 },
  branchId: String,
  customerId: String,
  customerName: String,
  customerEmail: String,
  customerPhone: String,
  shippingAddress: ShippingAddressSchema,
  trackingUpdates: { type: [TrackingSchema], default: [] },
  paymentStatus: { 
    type: String, 
    enum: ['pending', 'completed', 'failed'], 
    default: 'pending' 
  },
  orderStatus: { 
    type: String, 
    enum: ['pending', 'payment_confirmed', 'processing', 'packed', 'shipped', 'in_transit', 'out_for_delivery', 'delivered', 'cancelled'], 
    default: 'pending' 
  },
  paymentIntentId: String,
  trackingNumber: String
}, { timestamps: true });

export default mongoose.model<IOrder>('Order', OrderSchema);
