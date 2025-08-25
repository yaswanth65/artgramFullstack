import mongoose from 'mongoose';

export interface IBooking extends mongoose.Document {
  eventId?: string;
  sessionDate?: string;
  branchId?: string;
  customerId?: string;
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  qrCodeData?: string;
}

const BookingSchema = new mongoose.Schema<IBooking>({
  eventId: String,
  sessionDate: String,
  branchId: String,
  customerId: String,
  customerName: String,
  customerEmail: String,
  customerPhone: String,
  qrCodeData: String
}, { timestamps: true });

export default mongoose.model<IBooking>('Booking', BookingSchema);
