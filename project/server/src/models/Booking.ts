import mongoose from 'mongoose';

export interface IBooking extends mongoose.Document {
  // Legacy fields (keep for backward compatibility)
  eventId?: string;
  sessionDate?: string;
  
  // New session-based fields
  sessionId?: string; // Reference to Session model
  activity?: 'slime' | 'tufting'; // slime or tufting
  
  // Branch and customer info
  branchId?: string;
  customerId?: string;
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  
  // Booking details
  date?: string; // YYYY-MM-DD
  time?: string; // HH:MM
  seats?: number; // Number of seats booked
  totalAmount?: number;
  
  // Payment info
  paymentStatus?: 'pending' | 'completed' | 'failed' | 'refunded';
  paymentIntentId?: string;
  
  // QR and verification
  qrCode?: string;
  qrCodeData?: string;
  isVerified?: boolean;
  verifiedAt?: Date;
  verifiedBy?: string; // Manager who verified
  
  // Additional info
  packageType?: string; // 'base', 'premium', etc.
  specialRequests?: string;
  status?: 'active' | 'cancelled' | 'completed';
}

const BookingSchema = new mongoose.Schema<IBooking>({
  // Legacy fields
  eventId: String,
  sessionDate: String,
  
  // New session-based fields
  sessionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Session' },
  activity: { type: String, enum: ['slime', 'tufting'] },
  
  // Branch and customer info
  branchId: { type: String, required: true },
  customerId: { type: String, required: true },
  customerName: { type: String, required: true },
  customerEmail: { type: String, required: true },
  customerPhone: String,
  
  // Booking details
  date: String, // YYYY-MM-DD
  time: String, // HH:MM
  seats: { type: Number, default: 1, min: 1 },
  totalAmount: { type: Number, min: 0 },
  
  // Payment info
  paymentStatus: { 
    type: String, 
    enum: ['pending', 'completed', 'failed', 'refunded'], 
    default: 'pending' 
  },
  paymentIntentId: String,
  
  // QR and verification
  qrCode: String,
  qrCodeData: String,
  isVerified: { type: Boolean, default: false },
  verifiedAt: Date,
  verifiedBy: String,
  
  // Additional info
  packageType: String,
  specialRequests: String,
  status: { 
    type: String, 
    enum: ['active', 'cancelled', 'completed'], 
    default: 'active' 
  }
}, { 
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for efficient queries
BookingSchema.index({ customerId: 1, status: 1 });
BookingSchema.index({ branchId: 1, date: 1 });
BookingSchema.index({ sessionId: 1 });
BookingSchema.index({ qrCode: 1 });
BookingSchema.index({ paymentStatus: 1 });

export default mongoose.model<IBooking>('Booking', BookingSchema);
