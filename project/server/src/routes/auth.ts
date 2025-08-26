import express from 'express';
import asyncHandler from 'express-async-handler';
import bcrypt from 'bcryptjs';
import User from '../models/User';
import { protect } from '../middleware/auth';
import { sign, verify } from '../utils/jwt';
import { userValidationRules, loginValidationRules, validate } from '../middleware/validation';

const router = express.Router();

router.post('/register', userValidationRules(), validate(userValidationRules()), asyncHandler(async (req, res) => {
  console.log('🔵 Registration request received:', { email: req.body.email, role: req.body.role });
  const { name, email, password, role, branchId, phone, address } = req.body;
  
  console.log('🔍 Checking if user exists:', email);
  const exists = await User.findOne({ email });
  if (exists) {
    console.log('❌ Email already exists');
    return res.status(400).json({ message: 'Email already registered' });
  }
  
  console.log('🔐 Hashing password...');
  const hashed = await bcrypt.hash(password, 12); // Increased salt rounds
  
  console.log('💾 Creating user...');
  const user = await User.create({ 
    name, 
    email, 
    password: hashed, 
    role: role || 'customer', 
    branchId, 
    phone, 
    address 
  });
  
  console.log('🔑 Generating token...');
  const tokenPayload = {
    id: user._id.toString(),
    email: user.email,
    role: user.role
  };
  const token = sign(tokenPayload);
  
  console.log('✅ Registration successful for:', email);
  res.status(201).json({ 
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

router.post('/login', loginValidationRules(), validate(loginValidationRules()), asyncHandler(async (req, res) => {
  console.log('🔵 Login request received:', { email: req.body.email });
  const { email, password } = req.body;
  
  console.log('🔍 Looking for user:', email);
  const user = await User.findOne({ email }).populate('branchId');
  if (!user) {
    console.log('❌ User not found:', email);
    return res.status(401).json({ message: 'Invalid email or password' });
  }
  
  console.log('🔐 Comparing password...');
  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    console.log('❌ Password mismatch for:', email);
    return res.status(401).json({ message: 'Invalid email or password' });
  }
  
  console.log('🔑 Generating token...');
  const tokenPayload = {
    id: user._id.toString(),
    email: user.email,
    role: user.role
  };
  const token = sign(tokenPayload);
  
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

// Verify token endpoint
router.post('/verify', asyncHandler(async (req, res) => {
  const { token } = req.body;
  
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    const decoded = verify(token);
    const user = await User.findById(decoded.id).populate('branchId').select('-password');
    
    if (!user) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    res.json({ 
      valid: true, 
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        branchId: user.branchId,
        phone: user.phone,
        address: user.address
      }
    });
  } catch (error: any) {
    console.error('Token verification error:', error);
    res.status(401).json({ 
      valid: false, 
      error: 'Invalid token' 
    });
  }
}));

router.put('/profile', protect, asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (!user) return res.status(404).json({ message: 'User not found' });
  
  const { name, phone, address } = req.body;
  
  // Validate input
  if (name) user.name = name;
  if (phone) user.phone = phone;
  if (address) user.address = address;
  
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
