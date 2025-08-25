import express from 'express';
import asyncHandler from 'express-async-handler';
import Order from '../models/Order';
import { protect } from '../middleware/auth';

const router = express.Router();

router.get('/', protect, asyncHandler(async (req, res) => {
  const user = req.user;
  if (user.role === 'admin') {
    const orders = await Order.find().lean();
    return res.json(orders);
  }
  const orders = await Order.find({ customerId: user._id }).lean();
  res.json(orders);
}));

router.post('/', protect, asyncHandler(async (req, res) => {
  const { items, amount, branchId, shippingAddress } = req.body;
  const order = await Order.create({ items, amount, branchId, customerId: req.user._id, customerName: req.user.name, customerEmail: req.user.email, customerPhone: req.user.phone, shippingAddress, trackingUpdates: [] });
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

export default router;
