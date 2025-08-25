import express from 'express';
import asyncHandler from 'express-async-handler';
import Order from '../models/Order';
import Booking from '../models/Booking';
import { protect } from '../middleware/auth';

const router = express.Router();

router.get('/', protect, asyncHandler(async (req, res) => {
  const user = req.user;
  const { branchId } = req.query;
  
  if (user.role === 'admin') {
    const filter = branchId ? { branchId } : {};
    const orders = await Order.find(filter).sort({ createdAt: -1 }).lean();
    res.json(orders);
    return;
  }
  
  if (user.role === 'manager' || user.role === 'branch_manager') {
    // Manager can only see orders from their branch
    const managerBranchId = user.branchId || branchId;
    if (!managerBranchId) {
      res.status(400).json({ message: 'Branch ID required for manager' });
      return;
    }
    const orders = await Order.find({ branchId: managerBranchId }).sort({ createdAt: -1 }).lean();
    res.json(orders);
    return;
  }
  
  // Customer can only see their own orders
  const orders = await Order.find({ customerId: user._id }).sort({ createdAt: -1 }).lean();
  res.json(orders);
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

// Update order status (Manager/Admin only)
router.patch('/:id/status', protect, asyncHandler(async (req, res) => {
  const { status } = req.body;
  const user = req.user;
  
  const order = await Order.findById(req.params.id);
  if (!order) {
    res.status(404).json({ message: 'Order not found' });
    return;
  }
  
  // Check permissions
  if (user.role === 'manager' || user.role === 'branch_manager') {
    const managerBranchId = user.branchId;
    if (order.branchId !== managerBranchId) {
      res.status(403).json({ message: 'Not authorized to update this order' });
      return;
    }
  } else if (user.role !== 'admin') {
    res.status(403).json({ message: 'Not authorized to update order status' });
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
    location: user.branchId || 'Branch Location',
    description: `Order status updated to ${status}`,
    createdAt: new Date()
  });
  
  await order.save();
  res.json(order);
}));

router.post('/:id/tracking', protect, asyncHandler(async (req, res) => {
  const { status, location, description } = req.body;
  const order = await Order.findById(req.params.id);
  if (!order) return res.status(404).json({ message: 'Order not found' });
  order.trackingUpdates.push({ status, location, description, createdAt: new Date() });
  await order.save();
  res.json(order);
}));

// QR Code verification endpoint for bookings
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
    res.status(400).json({ 
      message: 'Booking already verified',
      verifiedAt: booking.verifiedAt,
      verifiedBy: booking.verifiedBy
    });
    return;
  }
  
  // Update booking verification
  booking.isVerified = true;
  booking.verifiedAt = new Date();
  booking.verifiedBy = user._id;
  
  await booking.save();
  
  res.json({
    message: 'Booking verified successfully',
    booking: {
      id: booking._id,
      customerName: booking.customerName,
      activity: booking.activity,
      date: booking.date,
      time: booking.time,
      seats: booking.seats,
      verifiedAt: booking.verifiedAt,
      verifiedBy: booking.verifiedBy
    }
  });
}));

export default router;
