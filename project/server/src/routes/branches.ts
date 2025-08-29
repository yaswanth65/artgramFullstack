import express from 'express';
import asyncHandler from '../utils/asyncHandler';
import Branch from '../models/Branch';

const router = express.Router();

router.get('/', asyncHandler(async (req, res) => {
  const branches = await Branch.find().lean();
  res.json(branches);
}));

router.post('/', asyncHandler(async (req, res) => {
  const { name, location, managerId, razorpayKey } = req.body;
  const b = await Branch.create({ name, location, managerId, razorpayKey });
  res.json(b);
}));

export default router;
