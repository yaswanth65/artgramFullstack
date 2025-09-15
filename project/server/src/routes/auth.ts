import express from 'express';
import asyncHandler from '../utils/asyncHandler';
import bcrypt from 'bcryptjs';
import User from '../models/User';
import { protect } from '../middleware/auth';
import { sign, verify } from '../utils/jwt';
import { userValidationRules, loginValidationRules, validate } from '../middleware/validation';
import { sendPasswordResetEmail } from '../utils/emailService';

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

    // Check if token needs refresh and provide new one if needed
    const { refreshIfNeeded } = require('../utils/jwt');
    const newToken = refreshIfNeeded(token, {
      id: user._id.toString(),
      email: user.email,
      role: user.role
    });

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
      },
      token: newToken !== token ? newToken : undefined // Only send new token if it was refreshed
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

// Forgot password - send reset code
router.post('/forgot-password', asyncHandler(async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: 'Email is required' });
  }

  console.log('🔵 Forgot password request received:', { email });

  // Check if user exists
  const user = await User.findOne({ email });
  if (!user) {
    // For security, don't reveal if email exists or not
    return res.json({
      message: 'If an account with that email exists, a password reset code has been sent.'
    });
  }

  // Generate fixed reset code: 8888
  const resetCode = '8888';
  const resetExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes from now

  // Save reset code and expiry to user
  user.passwordResetCode = resetCode;
  user.passwordResetExpires = resetExpires;
  await user.save();

  // Send email with reset code
  const emailResult = await sendPasswordResetEmail(email, resetCode);

  if (!emailResult.success) {
    console.error('❌ Failed to send password reset email:', emailResult.error);
    return res.status(500).json({
      message: 'Failed to send password reset email. Please try again.'
    });
  }

  console.log('✅ Password reset code sent to:', email);
  res.json({
    message: 'If an account with that email exists, a password reset code has been sent.'
  });
}));

// Verify reset code
router.post('/verify-reset-code', asyncHandler(async (req, res) => {
  const { email, code } = req.body;

  if (!email || !code) {
    return res.status(400).json({ message: 'Email and code are required' });
  }

  console.log('🔵 Verify reset code request received:', { email, code });

  const user = await User.findOne({
    email,
    passwordResetCode: code,
    passwordResetExpires: { $gt: new Date() }
  });

  if (!user) {
    return res.status(400).json({ message: 'Invalid or expired reset code' });
  }

  console.log('✅ Reset code verified for:', email);
  res.json({
    message: 'Reset code verified successfully',
    verified: true
  });
}));

// Reset password
router.post('/reset-password', asyncHandler(async (req, res) => {
  const { email, code, newPassword, oldPassword } = req.body;

  if (!email || !code || !newPassword) {
    return res.status(400).json({ message: 'Email, code, and new password are required' });
  }

  console.log('🔵 Reset password request received:', { email });

  // Find user with valid reset code
  const user = await User.findOne({
    email,
    passwordResetCode: code,
    passwordResetExpires: { $gt: new Date() }
  });

  if (!user) {
    return res.status(400).json({ message: 'Invalid or expired reset code' });
  }

  // If oldPassword is provided, verify it matches current password
  if (oldPassword) {
    const match = await bcrypt.compare(oldPassword, user.password);
    if (!match) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }
  }

  // Hash new password
  const hashedPassword = await bcrypt.hash(newPassword, 12);

  // Update password and clear reset code
  user.password = hashedPassword;
  user.passwordResetCode = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  console.log('✅ Password reset successfully for:', email);
  res.json({
    message: 'Password reset successfully. You can now login with your new password.'
  });
}));

export default router;
