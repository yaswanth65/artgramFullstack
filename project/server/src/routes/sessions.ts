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

// Get sessions for next 10 days for a branch (ensures they exist)
router.get('/next-10-days/:branchId', asyncHandler(async (req, res): Promise<void> => {
  const { branchId } = req.params;
  const { activity } = req.query as { activity?: 'slime' | 'tufting' };

  // Resolve branchId (accepts ObjectId or slug like 'hyderabad')
  const resolveBranch = async (idOrSlug: string) => {
    // If it's a valid ObjectId, try that first
    if (mongoose.isValidObjectId(idOrSlug)) {
      const b = await Branch.findById(idOrSlug).lean();
      if (b) return b;
    }
    // Try to resolve by location or name containing the slug
    const slug = String(idOrSlug).toLowerCase();
    const byLocation = await Branch.findOne({ location: new RegExp(`^${slug}$`, 'i') }).lean();
    if (byLocation) return byLocation;
    const byName = await Branch.findOne({ name: new RegExp(slug, 'i') }).lean();
    if (byName) return byName;
    return null;
  };

  const branch = await resolveBranch(String(branchId));
  if (!branch) {
    res.status(404).json({ message: 'Branch not found' });
    return;
  }
  const branchObjectId = new mongoose.Types.ObjectId(String((branch as any)._id));
  const branchLocation = (branch.location || '').toLowerCase();
  const supportsTufting = branchLocation !== 'vijayawada';
  const allowMonday = branchLocation === 'vijayawada';

  // Generate next 10 days (YYYY-MM-DD in local timezone)
  const dates: string[] = [];
  for (let i = 0; i < 10; i++) {
    const date = new Date();
    date.setHours(12, 0, 0, 0); // avoid TZ boundary issues
    date.setDate(date.getDate() + i);
    dates.push(date.toISOString().split('T')[0]);
  }

  // Find existing sessions for this branch in window
  const existingSessions = await Session.find({
    branchId: branchObjectId,
    date: { $in: dates },
    ...(activity && { activity })
  }).lean();

  const existingByDateActivity = new Set(existingSessions.map(s => `${s.date}::${s.activity}`));

  const defaultSessions: any[] = [];

  for (const date of dates) {
    const dow = new Date(date).getDay();
    const isMonday = dow === 1;
    const active = allowMonday ? true : !isMonday;

    // Slime defaults
    if ((!activity || activity === 'slime') && !existingByDateActivity.has(`${date}::slime`)) {
      defaultSessions.push(
        {
          branchId: branchObjectId,
          date,
          activity: 'slime',
          time: '10:00',
          label: '10:00 AM',
          totalSeats: 15,
          bookedSeats: 0,
          availableSeats: 15,
          type: 'Slime Play & Demo',
          ageGroup: '3+',
          isActive: active,
          notes: 'Auto-created'
        },
        {
          branchId: branchObjectId,
          date,
          activity: 'slime',
          time: '11:30',
          label: '11:30 AM',
          totalSeats: 15,
          bookedSeats: 0,
          availableSeats: 15,
          type: 'Slime Play & Making',
          ageGroup: '8+',
          isActive: active,
          notes: 'Auto-created'
        },
        {
          branchId: branchObjectId,
          date,
          activity: 'slime',
          time: '16:00',
          label: '4:00 PM',
          totalSeats: 15,
          bookedSeats: 0,
          availableSeats: 15,
          type: 'Slime Play & Making',
          ageGroup: '8+',
          isActive: active,
          notes: 'Auto-created'
        }
      );
    }

    // Tufting defaults (branch-dependent)
    if ((!activity || activity === 'tufting') && supportsTufting && !existingByDateActivity.has(`${date}::tufting`)) {
      defaultSessions.push(
        {
          branchId: branchObjectId,
          date,
          activity: 'tufting',
          time: '12:00',
          label: '12:00 PM',
          totalSeats: 8,
          bookedSeats: 0,
          availableSeats: 8,
          type: 'Small Tufting',
          ageGroup: '15+',
          isActive: active,
          notes: 'Auto-created'
        },
        {
          branchId: branchObjectId,
          date,
          activity: 'tufting',
          time: '15:00',
          label: '3:00 PM',
          totalSeats: 8,
          bookedSeats: 0,
          availableSeats: 8,
          type: 'Medium Tufting',
          ageGroup: '15+',
          isActive: active,
          notes: 'Auto-created'
        }
      );
    }
  }

  if (defaultSessions.length) {
    await Session.insertMany(defaultSessions);
  }

  const allSessions = await Session.find({
    branchId: branchObjectId,
    date: { $in: dates },
    ...(activity && { activity })
  }).sort({ date: 1, time: 1 });

  res.json(allSessions);
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

// Create new session (Admin/Manager only)
router.post('/', protect, adminOrBranchManager, asyncHandler(async (req, res): Promise<void> => {
  const { branchId } = req.body;
  const user = req.user;
  
  // If user is a manager, ensure they can only create sessions for their branch
  if (user.role === 'branch_manager' || user.role === 'manager') {
    const managerBranchId = user.branchId?._id?.toString() || user.branchId?.toString();
    
    if (branchId !== managerBranchId) {
      res.status(403).json({ message: 'Managers can only create sessions for their assigned branch' });
      return;
    }
  }
  
  const sessionData = {
    ...req.body,
    createdBy: req.user._id,
    availableSeats: req.body.totalSeats - (req.body.bookedSeats || 0)
  };

  const session = await Session.create(sessionData);
  res.status(201).json(session);
}));

// Update session (Admin/Manager only)
router.put('/:id', protect, adminOrBranchManager, asyncHandler(async (req, res): Promise<void> => {
  const session = await Session.findById(req.params.id);
  if (!session) {
    res.status(404).json({ message: 'Session not found' });
    return;
  }

  const user = req.user;
  
  // If user is a manager, ensure they can only update sessions for their branch
  if (user.role === 'branch_manager' || user.role === 'manager') {
    const managerBranchId = user.branchId?._id?.toString() || user.branchId?.toString();
    const sessionBranchId = session.branchId?.toString();
    
    if (sessionBranchId !== managerBranchId) {
      res.status(403).json({ message: 'Managers can only update sessions for their assigned branch' });
      return;
    }
  }

  // Update fields
  Object.assign(session, req.body);

  // Recalculate available seats
  session.availableSeats = Math.max(0, session.totalSeats - session.bookedSeats);

  await session.save();
  res.json(session);
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

// Delete session (Admin/Manager only)
router.delete('/:id', protect, adminOrBranchManager, asyncHandler(async (req, res): Promise<void> => {
  const session = await Session.findById(req.params.id);
  if (!session) {
    res.status(404).json({ message: 'Session not found' });
    return;
  }

  const user = req.user;
  
  // If user is a manager, ensure they can only delete sessions for their branch
  if (user.role === 'branch_manager' || user.role === 'manager') {
    const managerBranchId = user.branchId?._id?.toString() || user.branchId?.toString();
    const sessionBranchId = session.branchId?.toString();
    
    if (sessionBranchId !== managerBranchId) {
      res.status(403).json({ message: 'Managers can only delete sessions for their assigned branch' });
      return;
    }
  }

  // Check if there are any bookings for this session
  const bookingsCount = await Booking.countDocuments({ sessionId: session._id, status: 'active' });
  if (bookingsCount > 0) {
    res.status(400).json({
      message: `Cannot delete session with ${bookingsCount} active bookings. Cancel bookings first.`
    });
    return;
  }

  await Session.findByIdAndDelete(req.params.id);
  res.json({ message: 'Session deleted successfully' });
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
