import express from 'express';
import asyncHandler from '../utils/asyncHandler';
import User from '../models/User';
import { protect } from '../middleware/auth';

const router = express.Router();

// GET /api/users?role=branch_manager
// Only admin can fetch full user lists. Branch managers may fetch limited info about themselves.
router.get('/', protect, asyncHandler(async (req, res) => {
  const roleFilter = typeof req.query.role === 'string' ? req.query.role : undefined;

  // Only allow admins to list users. Branch managers may request their own data via /auth/verify.
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Forbidden' });
  }

  const filter: any = {};
  if (roleFilter) filter.role = roleFilter;

  const users = await User.find(filter).select('-password');
  res.json(users);
}));

export default router;
