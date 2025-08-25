import express from 'express';
import asyncHandler from 'express-async-handler';
import Booking from '../models/Booking';
import { protect } from '../middleware/auth';

const router = express.Router();

router.get('/', protect, asyncHandler(async (req, res) => {
  const user = req.user;
  if (user.role === 'admin') {
    const bookings = await Booking.find().lean();
    return res.json(bookings);
  }
  const bookings = await Booking.find({ customerId: user._id }).lean();
  res.json(bookings);
}));

router.post('/', protect, asyncHandler(async (req, res) => {
  const { eventId, sessionDate, branchId, qrCodeData } = req.body;
  const booking = await Booking.create({ eventId, sessionDate, branchId, qrCodeData, customerId: req.user._id, customerName: req.user.name, customerEmail: req.user.email, customerPhone: req.user.phone });
  res.json(booking);
}));

export default router;
