import mongoose from 'mongoose';

export interface ISession extends mongoose.Document {
  branchId: mongoose.Types.ObjectId; // Changed to ObjectId
  date: string; // YYYY-MM-DD format
  activity: 'slime' | 'tufting';
  time: string; // HH:MM format
  label?: string; // Display label like "10:00 AM"
  totalSeats: number;
  bookedSeats: number;
  availableSeats: number;
  type: string; // e.g., "Slime Play", "Slime Making", "Small Tufting", etc.
  ageGroup: string; // e.g., "3+", "8+", "All", "15+"
  price?: number; // Base price (can be overridden by packages)
  isActive: boolean;
  createdBy?: mongoose.Types.ObjectId; // Admin/Manager who created this session - changed to ObjectId
  notes?: string; // Additional notes for the session
}

const SessionSchema = new mongoose.Schema<ISession>({
  branchId: { type: mongoose.Schema.Types.ObjectId, ref: 'Branch', required: true },
  date: { type: String, required: true }, // YYYY-MM-DD
  activity: { type: String, required: true, enum: ['slime', 'tufting'] },
  time: { type: String, required: true }, // HH:MM
  label: { type: String }, // "10:00 AM"
  totalSeats: { type: Number, required: true, min: 1 },
  bookedSeats: { type: Number, default: 0, min: 0 },
  availableSeats: { type: Number, required: true, min: 0 },
  type: { type: String, required: true }, // "Slime Play", "Tufting Small", etc.
  ageGroup: { type: String, required: true }, // "3+", "8+", "All", "15+"
  price: { type: Number, min: 0 },
  isActive: { type: Boolean, default: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  notes: { type: String }
}, { 
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for calculated available seats
SessionSchema.virtual('calculatedAvailableSeats').get(function() {
  return Math.max(0, this.totalSeats - this.bookedSeats);
});

// Update availableSeats before save
SessionSchema.pre('save', function() {
  this.availableSeats = Math.max(0, this.totalSeats - this.bookedSeats);
});

// Indexes for efficient queries
SessionSchema.index({ branchId: 1, date: 1, activity: 1 });
SessionSchema.index({ branchId: 1, date: 1, time: 1 });
SessionSchema.index({ date: 1, isActive: 1 });

export default mongoose.model<ISession>('Session', SessionSchema);
