import express from 'express';
import asyncHandler from '../utils/asyncHandler';
import Session from '../models/Session';
import Branch from '../models/Branch';
import mongoose from 'mongoose';
import Booking from '../models/Booking';
import { protect, adminOrBranchManager } from '../middleware/auth';

const router = express.Router();

// Get sessions for a specific branch and date range
router.get('/', asyncHandler(async (req, res): Promise<void> => {
  const { branchId, startDate, endDate, activity } = req.query;

  const filter: any = {};
  if (branchId) {
    try {
      filter.branchId = new mongoose.Types.ObjectId(String(branchId));
    } catch {
      filter.branchId = branchId; // fallback
    }
  }
  if (startDate && endDate) {
    filter.date = { $gte: startDate, $lte: endDate };
  } else if (startDate) {
    filter.date = { $gte: startDate };
  }
  if (activity) filter.activity = activity;

  const sessions = await Session.find(filter).sort({ date: 1, time: 1 });
  res.json(sessions);
}));

// Create a new session (admin/manager only)
router.post('/', protect, adminOrBranchManager, asyncHandler(async (req, res): Promise<void> => {
  const { 
    branchId, 
    date, 
    activity, 
    time, 
    label, 
    totalSeats, 
    type, 
    ageGroup, 
    price, 
    notes 
  } = req.body;

  // Validate branch permissions
  const branch = await Branch.findById(branchId);
  if (!branch) {
    res.status(404).json({ message: 'Branch not found' });
    return;
  }

  // Check if branch allows this activity
  if (activity === 'slime' && !branch.allowSlime) {
    res.status(400).json({ message: 'This branch does not allow slime activities' });
    return;
  }

  if (activity === 'tufting' && !branch.allowTufting) {
    res.status(400).json({ message: 'This branch does not allow tufting activities' });
    return;
  }

  // Check if session is on Monday and branch allows it
  const sessionDate = new Date(date);
  const dayOfWeek = sessionDate.getDay();
  if (dayOfWeek === 1 && !branch.allowMonday) {
    res.status(400).json({ message: 'This branch is closed on Mondays' });
    return;
  }

  // If user is a branch_manager, ensure they can only create sessions for their branch
  const user = req.user;
  if (user.role === 'branch_manager') {
    const managerBranchId = user.branchId?._id?.toString() || user.branchId?.toString();
    
    if (branchId !== managerBranchId) {
      res.status(403).json({ message: 'Managers can only create sessions for their assigned branch' });
      return;
    }
  }

  const session = await Session.create({
    branchId: new mongoose.Types.ObjectId(String(branchId)),
    date,
    activity,
    time,
    label: label || time,
    totalSeats,
    bookedSeats: 0,
    availableSeats: totalSeats,
    type,
    ageGroup,
    price,
    isActive: true,
    notes,
    createdBy: req.user?.id
  });

  const populatedSession = await Session.findById(session._id)
    .populate('branchId', 'name location allowSlime allowTufting allowMonday');

  res.status(201).json(populatedSession);
}));

// Get sessions for a specific branch with date range (no auto-creation)
router.get('/branch/:branchId', asyncHandler(async (req, res): Promise<void> => {
  const { branchId } = req.params;
  const { startDate, endDate, activity } = req.query;
  
  const filter: any = { branchId: new mongoose.Types.ObjectId(String(branchId)) };
  
  if (startDate && endDate) {
    filter.date = { $gte: startDate, $lte: endDate };
  }
  
  if (activity) {
    filter.activity = activity;
  }
  
  const sessions = await Session.find(filter)
    .sort({ date: 1, time: 1 })
    .populate('branchId', 'name location allowSlime allowTufting allowMonday');
    
  res.json(sessions);
}));

// Get sessions for the next 10 days for a branch (no auto-creation)
router.get('/next-10-days/:branchId', asyncHandler(async (req, res): Promise<void> => {
  const { branchId } = req.params;
  const { activity } = req.query;

  const today = new Date();
  const end = new Date(today.getTime() + 10 * 24 * 60 * 60 * 1000);
  const startDate = today.toISOString().split('T')[0];
  const endDate = end.toISOString().split('T')[0];

  const filter: any = {
    branchId: new mongoose.Types.ObjectId(String(branchId)),
    date: { $gte: startDate, $lte: endDate }
  };
  if (activity) filter.activity = activity;

  const sessions = await Session.find(filter)
    .sort({ date: 1, time: 1 })
    .populate('branchId', 'name location allowSlime allowTufting allowMonday');

  res.json(sessions);
}));

// Update a session (admin/manager only)
router.put('/:id', protect, adminOrBranchManager, asyncHandler(async (req, res): Promise<void> => {
  const { id } = req.params;
  const updates = req.body;
  
  // Validate branch permissions if activity is being changed
  if (updates.activity || updates.branchId) {
    const session = await Session.findById(id);
    if (!session) {
      res.status(404).json({ message: 'Session not found' });
      return;
    }
    
    const branchId = updates.branchId || session.branchId;
    const activity = updates.activity || session.activity;
    
    const branch = await Branch.findById(branchId);
    if (!branch) {
      res.status(404).json({ message: 'Branch not found' });
      return;
    }
    
    if (activity === 'slime' && !branch.allowSlime) {
      res.status(400).json({ message: 'This branch does not allow slime activities' });
      return;
    }
    
    if (activity === 'tufting' && !branch.allowTufting) {
      res.status(400).json({ message: 'This branch does not allow tufting activities' });
      return;
    }
    
    // Check Monday restriction
    const sessionDate = new Date(updates.date || session.date);
    if (sessionDate.getDay() === 1 && !branch.allowMonday) {
      res.status(400).json({ message: 'This branch is closed on Mondays' });
      return;
    }

    // If user is a branch_manager, ensure they can only update sessions for their branch
    const user = req.user;
    if (user.role === 'branch_manager') {
      const managerBranchId = user.branchId?._id?.toString() || user.branchId?.toString();
      const sessionBranchId = session.branchId?.toString();
      
      if (sessionBranchId !== managerBranchId) {
        res.status(403).json({ message: 'Managers can only update sessions for their assigned branch' });
        return;
      }
    }
  }
  
  const updatedSession = await Session.findByIdAndUpdate(id, updates, { 
    new: true, 
    runValidators: true 
  }).populate('branchId', 'name location allowSlime allowTufting allowMonday');
  
  if (!updatedSession) {
    res.status(404).json({ message: 'Session not found' });
    return;
  }
  
  res.json(updatedSession);
}));

// Delete a session (admin/manager only)
router.delete('/:id', protect, adminOrBranchManager, asyncHandler(async (req, res): Promise<void> => {
  const { id } = req.params;
  
  const session = await Session.findById(id);
  if (!session) {
    res.status(404).json({ message: 'Session not found' });
    return;
  }
  
  // If user is a branch_manager, ensure they can only delete sessions for their branch
  const user = req.user;
  if (user.role === 'branch_manager') {
    const managerBranchId = user.branchId?._id?.toString() || user.branchId?.toString();
    const sessionBranchId = session.branchId?.toString();
    
    if (sessionBranchId !== managerBranchId) {
      res.status(403).json({ message: 'Managers can only delete sessions for their assigned branch' });
      return;
    }
  }
  
  // Check if session has bookings
  const bookingCount = await Booking.countDocuments({ sessionId: id });
  if (bookingCount > 0) {
    res.status(400).json({ 
      message: `Cannot delete session with ${bookingCount} existing booking(s)` 
    });
    return;
  }
  
  await Session.findByIdAndDelete(id);
  res.json({ message: 'Session deleted successfully' });
}));

// Get specific session by ID with registered users
router.get('/:id', asyncHandler(async (req, res): Promise<void> => {
  const session = await Session.findById(req.params.id);
  if (!session) {
    res.status(404).json({ message: 'Session not found' });
    return;
  }
  
  // Get registered users for this session
  const bookings = await Booking.find({ 
    sessionId: session._id, 
    status: 'active',
    paymentStatus: 'completed' 
  }).select('customerName customerEmail seats isVerified verifiedAt').lean();

  // Debug logging to help developers see what bookings are returned
  try {
    console.log(`GET /api/sessions/${req.params.id} -> found ${bookings.length} bookings`);
    if (bookings.length) {
      console.log('Booking emails:', bookings.map(b => b.customerEmail));
    }
  } catch (err) {
    console.warn('Failed to log bookings for session', req.params.id, err);
  }
  
  const sessionWithUsers = {
    ...session.toObject(),
    registeredUsers: bookings
  };
  
  res.json(sessionWithUsers);
}));

// Get registered users for a session
router.get('/:id/users', protect, asyncHandler(async (req, res): Promise<void> => {
  const session = await Session.findById(req.params.id);
  if (!session) {
    res.status(404).json({ message: 'Session not found' });
    return;
  }
  
  const bookings = await Booking.find({ 
    sessionId: session._id, 
    status: 'active',
    paymentStatus: 'completed' 
  }).select('customerName customerEmail seats isVerified verifiedAt').lean();
  
  res.json({
    sessionId: session._id,
    totalRegistered: bookings.length,
    totalSeats: bookings.reduce((sum, booking) => sum + (booking.seats || 1), 0),
    users: bookings
  });
}));

// Update session seat count (for booking/cancellation)
router.patch('/:id/seats', protect, asyncHandler(async (req, res): Promise<void> => {
  const { seatsChange } = req.body; // positive for booking, negative for cancellation

  const session = await Session.findById(req.params.id);
  if (!session) {
  res.status(404).json({ message: 'Session not found' });
  return;
  }

  const newBookedSeats = session.bookedSeats + seatsChange;

  // Check if we have enough seats
  if (newBookedSeats > session.totalSeats) {
  res.status(400).json({ message: 'Not enough seats available' });
  return;
  }

  if (newBookedSeats < 0) {
  res.status(400).json({ message: 'Invalid seat count' });
  return;
  }

  session.bookedSeats = newBookedSeats;
  session.availableSeats = session.totalSeats - session.bookedSeats;

  await session.save();
  res.json(session);
}));

// Bulk update sessions for a date (Admin/Manager only)
router.post('/bulk-update', protect, adminOrBranchManager, asyncHandler(async (req, res): Promise<void> => {
  const { branchId, date, sessions } = req.body;

  // Delete existing sessions for this date and branch
  await Session.deleteMany({ branchId, date });

  // Create new sessions
  const sessionData = sessions.map((s: any) => ({
    ...s,
    branchId,
    date,
    createdBy: req.user._id,
    availableSeats: s.totalSeats - (s.bookedSeats || 0)
  }));

  const createdSessions = await Session.insertMany(sessionData);
  res.json(createdSessions);
}));

export default router;
