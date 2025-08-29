import express from 'express';
import asyncHandler from '../utils/asyncHandler';
import Order from '../models/Order';
import Booking from '../models/Booking';
import { protect } from '../middleware/auth';

const router = express.Router();

router.get('/', protect, asyncHandler(async (req, res, next) => {
  const user = req.user;
  const queryBranchId = req.query.branchId as string;

  console.log('=== GET /api/orders DEBUG ===');
  console.log('User ID:', user._id);
  console.log('User Role:', user.role);
  console.log('User branchId (raw):', user.branchId);
  console.log('Query branchId:', queryBranchId);

  // ADMIN ONLY: Only admin can access order management
  if (user.role !== 'admin') {
    console.log('Access denied: Order management is admin-only');
    return res.status(403).json({ message: 'Order management is restricted to administrators only' });
  }

  // Admin sees all orders, or filtered by queryBranchId
  const filter = queryBranchId ? { branchId: queryBranchId } : {};
  console.log('Admin filter:', filter);
  const orders = await Order.find(filter).sort({ createdAt: -1 }).lean();
  console.log('Found orders:', orders.length);
  return res.json(orders);
}));

router.post('/', protect, asyncHandler(async (req, res) => {
  const { items, amount, branchId, shippingAddress } = req.body;
  const order = await Order.create({ 
    products: items, 
    totalAmount: amount, 
    branchId, 
    customerId: req.user._id, 
    customerName: req.user.name, 
    customerEmail: req.user.email, 
    customerPhone: req.user.phone, 
    shippingAddress, 
    trackingUpdates: [] 
  });
  res.json(order);
}));

// Update order status (Admin only)
router.patch('/:id/status', protect, asyncHandler(async (req, res) => {
  const { status } = req.body;
  const user = req.user;
  
  // ADMIN ONLY: Only admin can update order status
  if (user.role !== 'admin') {
    res.status(403).json({ message: 'Order status updates are restricted to administrators only' });
    return;
  }
  
  const order = await Order.findById(req.params.id);
  if (!order) {
    res.status(404).json({ message: 'Order not found' });
    return;
  }
  
  const validStatuses = ['pending', 'payment_confirmed', 'processing', 'packed', 'shipped', 'in_transit', 'out_for_delivery', 'delivered', 'cancelled'];
  if (!validStatuses.includes(status)) {
    res.status(400).json({ message: 'Invalid status' });
    return;
  }
  
  order.orderStatus = status;
  
  // Add tracking update
  order.trackingUpdates.push({
    status: status,
    location: 'Admin Update',
    description: `Order status updated to ${status} by admin`,
    createdAt: new Date()
  });
  
  await order.save();
  res.json(order);
}));

router.post('/:id/tracking', protect, asyncHandler(async (req, res) => {
  const { status, location, description } = req.body;
  const user = req.user;
  
  // ADMIN ONLY: Only admin can add tracking updates
  if (user.role !== 'admin') {
    res.status(403).json({ message: 'Tracking updates are restricted to administrators only' });
    return;
  }
  
  const order = await Order.findById(req.params.id);
  if (!order) return res.status(404).json({ message: 'Order not found' });
  
  order.trackingUpdates.push({ status, location, description, createdAt: new Date() });
  await order.save();
  res.json(order);
}));

// QR Code verification endpoint for bookings (updated to handle already verified)
router.post('/verify-qr', protect, asyncHandler(async (req, res) => {
  const { qrCode } = req.body;
  const user = req.user;
  
  if (!qrCode) {
    res.status(400).json({ message: 'QR code is required' });
    return;
  }
  
  // Only managers and admins can verify QR codes
  if (user.role !== 'admin' && user.role !== 'manager' && user.role !== 'branch_manager') {
    res.status(403).json({ message: 'Not authorized to verify QR codes' });
    return;
  }
  
  const booking = await Booking.findOne({ qrCode: qrCode.trim() });
  if (!booking) {
    res.status(404).json({ message: 'Invalid QR code or booking not found' });
    return;
  }
  
  // Check if manager is verifying for their branch
  if ((user.role === 'manager' || user.role === 'branch_manager') && user.branchId) {
    if (booking.branchId !== user.branchId) {
      res.status(403).json({ message: 'Cannot verify booking for different branch' });
      return;
    }
  }
  
  if (booking.isVerified) {
    // Return 409 for already verified with additional data
    res.status(409).json({ 
      alreadyVerified: true,
      message: 'Booking already verified',
      booking: {
        id: booking._id,
        customerName: booking.customerName,
        activity: booking.activity,
        date: booking.date,
        time: booking.time,
        seats: booking.seats,
        status: booking.status,
        verifiedAt: booking.verifiedAt,
        verifiedBy: booking.verifiedBy
      }
    });
    return;
  }
  
  // Update booking verification
  booking.isVerified = true;
  booking.verifiedAt = new Date();
  booking.verifiedBy = user._id;
  
  await booking.save();
  
  res.json({
    success: true,
    message: 'Booking verified successfully',
    booking: {
      id: booking._id,
      customerName: booking.customerName,
      activity: booking.activity,
      date: booking.date,
      time: booking.time,
      seats: booking.seats,
      status: booking.status,
      verifiedAt: booking.verifiedAt,
      verifiedBy: booking.verifiedBy
    }
  });
}));

export default router;
