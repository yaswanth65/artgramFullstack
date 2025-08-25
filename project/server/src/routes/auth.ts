import express from 'express';
import asyncHandler from 'express-async-handler';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import { protect } from '../middleware/auth';

const router = express.Router();

router.post('/register', asyncHandler(async (req, res) => {
  console.log('🔵 Registration request received:', req.body);
  const { name, email, password, role, branchId, phone, address } = req.body;
  if (!name || !email || !password) {
    console.log('❌ Missing required fields');
    return res.status(400).json({ message: 'Missing fields' });
  }
  
  console.log('🔍 Checking if user exists:', email);
  const exists = await User.findOne({ email });
  if (exists) {
    console.log('❌ Email already exists');
    return res.status(400).json({ message: 'Email taken' });
  }
  
  console.log('🔐 Hashing password...');
  const hashed = await bcrypt.hash(password, 10);
  
  console.log('💾 Creating user...');
  const user = await User.create({ name, email, password: hashed, role: role || 'customer', branchId, phone, address });
  
  console.log('🔑 Generating token...');
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'secret', { expiresIn: '30d' });
  
  console.log('✅ Registration successful for:', email);
  res.json({ 
    token, 
    user: { 
      id: user._id, 
      name: user.name, 
      email: user.email, 
      role: user.role, 
      branchId: user.branchId,
      phone: user.phone,
      address: user.address,
      createdAt: user.createdAt
    } 
  });
}));

router.post('/login', asyncHandler(async (req, res) => {
  console.log('🔵 Login request received:', { email: req.body.email });
  const { email, password } = req.body;
  
  console.log('🔍 Looking for user:', email);
  const user = await User.findOne({ email });
  if (!user) {
    console.log('❌ User not found:', email);
    return res.status(401).json({ message: 'Invalid creds' });
  }
  
  console.log('🔐 Comparing password...');
  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    console.log('❌ Password mismatch for:', email);
    return res.status(401).json({ message: 'Invalid creds' });
  }
  
  console.log('🔑 Generating token...');
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'secret', { expiresIn: '30d' });
  
  console.log('✅ Login successful for:', email);
  res.json({ 
    token, 
    user: { 
      id: user._id, 
      name: user.name, 
      email: user.email, 
      role: user.role, 
      branchId: user.branchId, 
      phone: user.phone, 
      address: user.address,
      createdAt: user.createdAt
    } 
  });
}));

router.put('/profile', protect, asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (!user) return res.status(404).json({ message: 'Not found' });
  const { name, phone, address } = req.body;
  user.name = name || user.name;
  user.phone = phone || user.phone;
  user.address = address || user.address;
  await user.save();
  res.json({ 
    id: user._id, 
    name: user.name, 
    email: user.email, 
    role: user.role, 
    branchId: user.branchId, 
    phone: user.phone, 
    address: user.address,
    createdAt: user.createdAt
  });
}));

export default router;
