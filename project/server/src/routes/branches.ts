import express from 'express';
import asyncHandler from '../utils/asyncHandler';
import Branch from '../models/Branch';
import { protect } from '../middleware/auth';

const router = express.Router();

router.get('/', asyncHandler(async (req, res) => {
  const branches = await Branch.find().lean();
  res.json(branches);
}));

router.post('/', protect, asyncHandler(async (req, res) => {
  // Only admins can create branches
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Only admins can create branches' });
  }
  
  const { 
    name, 
    location, 
    address,
    phone,
    email,
    managerId, 
    razorpayKey, 
    allowSlime = true, 
    allowTufting = true, 
    allowMonday = false,
    isActive = true
  } = req.body;
  
  const b = await Branch.create({ 
    name, 
    location, 
    address,
    phone,
    email,
    managerId, 
    razorpayKey, 
    allowSlime, 
    allowTufting, 
    allowMonday,
    isActive
  });
  
  res.json(b);
}));

// Update branch permissions
router.put('/:id', protect, asyncHandler(async (req, res) => {
  // Only admins can update branches
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Only admins can update branches' });
  }
  
  const { id } = req.params;
  const updates = req.body;
  
  const branch = await Branch.findByIdAndUpdate(id, updates, { 
    new: true, 
    runValidators: true 
  });
  
  if (!branch) {
    return res.status(404).json({ message: 'Branch not found' });
  }
  
  res.json(branch);
}));

export default router;
