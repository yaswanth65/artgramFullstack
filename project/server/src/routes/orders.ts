import express from 'express';
import asyncHandler from 'express-async-handler';
import Order from '../models/Order';
import Booking from '../models/Booking';
import { protect } from '../middleware/auth';

const router = express.Router();

router.get('/', protect, asyncHandler(async (req, res) => {
  const user = req.user;
  const queryBranchId = req.query.branchId as string;

  console.log('=== GET /api/orders DEBUG ===');
  console.log('User ID:', user._id);
  console.log('User Role:', user.role);
  console.log('User branchId (raw):', user.branchId);
  console.log('Query branchId:', queryBranchId);

  // Extract branchId from user (handle populated vs string)
  let userBranchId: string | undefined;
  if (user.branchId) {
    if (typeof user.branchId === 'string') {
      userBranchId = user.branchId;
    } else if (user.branchId._id) {
      userBranchId = user.branchId._id.toString();
    } else {
      userBranchId = user.branchId.toString();
    }
  }

  console.log('Normalized user branchId:', userBranchId);

  if (user.role === 'admin') {
    // Admin sees all orders, or filtered by queryBranchId
    const filter = queryBranchId ? { branchId: queryBranchId } : {};
    console.log('Admin filter:', filter);
    const orders = await Order.find(filter).sort({ createdAt: -1 }).lean();
    console.log('Found orders:', orders.length);
    return res.json(orders);
  }

  if (user.role === 'manager' || user.role === 'branch_manager') {
    // Manager sees orders for their branch or queryBranchId (if they match)
    let targetBranchId = queryBranchId || userBranchId;
    
    // Security: if user has branchId, they can only see their own branch
    if (userBranchId && queryBranchId && queryBranchId !== userBranchId) {
      console.log('Security: Manager trying to access different branch');
      return res.status(403).json({ message: 'Cannot access other branch orders' });
    }
    
    if (!targetBranchId) {
      console.log('No target branchId for manager');
      return res.status(400).json({ message: 'Branch ID required for manager' });
    }

    console.log('Manager target branchId:', targetBranchId);
    const orders = await Order.find({ branchId: targetBranchId }).sort({ createdAt: -1 }).lean();
    console.log('Found orders for manager:', orders.length);
    
    if (orders.length > 0) {
      console.log('Sample order branchIds:', orders.slice(0, 3).map(o => o.branchId));
    }
    
    return res.json(orders);
  }

  // Customer sees only their own orders
  console.log('Customer filter: customerId =', user._id);
  const orders = await Order.find({ customerId: user._id.toString() }).sort({ createdAt: -1 }).lean();
  console.log('Found customer orders:', orders.length);
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
