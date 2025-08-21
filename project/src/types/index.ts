export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'branch_manager' | 'customer';
  branchId?: string;
  temporaryPassword?: string;
  mustChangePassword?: boolean;
  createdAt: string;
}

export interface Branch {
  id: string;
  name: string;
  location: string;
  address: string;
  phone: string;
  email: string;
  stripeAccountId: string;
  managerId: string;
  isActive: boolean;
  createdAt: string;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  branchId: string;
  date: string;
  time: string;
  duration: number;
  maxSeats: number;
  bookedSeats: number;
  price: number;
  materials: string[];
  isActive: boolean;
  createdAt: string;
}

export interface Booking {
  id: string;
  eventId: string;
  customerId: string;
  branchId: string;
  seats: number;
  totalAmount: number;
  paymentStatus: 'pending' | 'completed' | 'failed';
  paymentIntentId?: string;
  qrCode: string;
  isVerified: boolean;
  createdAt: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  category: string;
  branchId: string;
  stock: number;
  materials: string[];
  isActive: boolean;
  createdAt: string;
}

export interface Order {
  id: string;
  customerId: string;
  branchId: string;
  products: OrderProduct[];
  totalAmount: number;
  paymentStatus: 'pending' | 'completed' | 'failed';
  orderStatus: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  paymentIntentId?: string;
  trackingNumber?: string;
  trackingUpdates?: TrackingUpdate[];
  shippingAddress: Address;
  createdAt: string;
}

export interface TrackingUpdate {
  id: string;
  status: string;
  location: string;
  timestamp: string;
  description: string;
}
export interface OrderProduct {
  productId: string;
  quantity: number;
  price: number;
  name: string;
}

export interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface CMSContent {
  id: string;
  type: 'carousel' | 'hero' | 'about' | 'services' | 'testimonials' | 'contact';
  title: string;
  content: string;
  images: string[];
  isActive: boolean;
  updatedAt: string;
}

export interface Analytics {
  totalRevenue: number;
  totalBookings: number;
  totalOrders: number;
  branchRevenue: { [branchId: string]: number };
  popularEvents: Event[];
  topProducts: Product[];
}