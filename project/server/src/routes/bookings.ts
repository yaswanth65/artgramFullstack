import express from 'express';
import asyncHandler from '../utils/asyncHandler';
import Booking from '../models/Booking';
import Session from '../models/Session';
import { protect } from '../middleware/auth';

const router = express.Router();

router.get('/', protect, asyncHandler(async (req, res) => {
  const user = req.user;
  const { branchId } = req.query as { branchId?: string };

  // Admin can see all, optional branch filter
  if (user.role === 'admin') {
    const filter = branchId ? { branchId } : {};
    const bookings = await Booking.find(filter).populate('sessionId').lean();
    return res.json(bookings);
  }

  // Managers can see bookings for their own branch (or provided branchId if same)
  if (user.role === 'manager' || user.role === 'branch_manager') {
    const managerBranchId = (user as any).branchId || branchId;
    if (!managerBranchId) {
      return res.status(400).json({ message: 'Branch ID required for manager' });
    }
    const bookings = await Booking.find({ branchId: managerBranchId }).populate('sessionId').lean();
    return res.json(bookings);
  }

  // Customers only see their own bookings
  const bookings = await Booking.find({ customerId: user._id }).populate('sessionId').lean();
  res.json(bookings);
}));

router.post('/', protect, asyncHandler(async (req, res) => {
  const {
    sessionId,
    seats = 1,
    packageType,
    specialRequests,
    // Legacy support
    eventId,
    sessionDate,
    branchId,
    qrCodeData
  } = req.body;

  let bookingData: any = {
    customerId: req.user._id,
    customerName: req.user.name,
    customerEmail: req.user.email,
    customerPhone: req.user.phone,
    seats,
    packageType,
    specialRequests,
    qrCode: `QR-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    paymentStatus: 'completed' // Assuming payment is handled before booking creation
  };

  if (sessionId) {
    // New session-based booking
    const session = await Session.findById(sessionId);
    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }

    if (!session.isActive) {
      return res.status(400).json({ message: 'Session is not active' });
    }

    if (session.availableSeats < seats) {
      return res.status(400).json({ message: 'Not enough seats available' });
    }

    // Update session seat count
    session.bookedSeats += seats;
    session.availableSeats = session.totalSeats - session.bookedSeats;
    await session.save();

    bookingData = {
      ...bookingData,
      sessionId,
      activity: session.activity,
      branchId: session.branchId,
      date: session.date,
      time: session.time
    };
  } else {
    // Legacy booking support
    bookingData = {
      ...bookingData,
      eventId,
      sessionDate,
      branchId,
      qrCodeData
    };
  }

  const booking = await Booking.create(bookingData);
  const populatedBooking = await Booking.findById(booking._id).populate('sessionId');

  res.status(201).json(populatedBooking);
}));

// Cancel booking
router.patch('/:id/cancel', protect, asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id);
  if (!booking) {
    return res.status(404).json({ message: 'Booking not found' });
  }

  // Check ownership (users can only cancel their own bookings, admins can cancel any)
  if (req.user.role !== 'admin' && booking.customerId !== req.user._id.toString()) {
    return res.status(403).json({ message: 'Not authorized to cancel this booking' });
  }

  if (booking.status === 'cancelled') {
    return res.status(400).json({ message: 'Booking is already cancelled' });
  }

  // Update booking status
  booking.status = 'cancelled';
  await booking.save();

  // If booking has sessionId, update session seat count
  if (booking.sessionId) {
    const session = await Session.findById(booking.sessionId);
    if (session) {
      session.bookedSeats = Math.max(0, session.bookedSeats - (booking.seats || 1));
      session.availableSeats = session.totalSeats - session.bookedSeats;
      await session.save();
    }
  }

  res.json({ message: 'Booking cancelled successfully', booking });
}));

// Verify QR code (for managers)
router.post('/verify-qr', protect, asyncHandler(async (req, res) => {
  const { qrCode } = req.body;

  const booking = await Booking.findOne({ qrCode }).populate('sessionId');
  if (!booking) {
    return res.status(404).json({ message: 'Invalid QR code' });
  }

  if (booking.isVerified) {
    return res.status(409).json({ 
      message: 'Booking already verified', 
      booking,
      alreadyVerified: true,
      verifiedAt: booking.verifiedAt,
      verifiedBy: booking.verifiedBy
    });
  }

  booking.isVerified = true;
  booking.verifiedAt = new Date();
  booking.verifiedBy = req.user._id;
  await booking.save();

  res.json({ 
    message: 'Booking verified successfully', 
    booking,
    alreadyVerified: false
  });
}));

// Get booking by QR code
router.get('/qr/:qrCode', protect, asyncHandler(async (req, res) => {
  const booking = await Booking.findOne({ qrCode: req.params.qrCode }).populate('sessionId');
  if (!booking) {
    return res.status(404).json({ message: 'Booking not found' });
  }

  res.json(booking);
}));

export default router;
