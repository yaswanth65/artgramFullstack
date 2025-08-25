import express from 'express';
import asyncHandler from 'express-async-handler';
import Session from '../models/Session';
import Booking from '../models/Booking';
import { protect, adminOrBranchManager } from '../middleware/auth';

const router = express.Router();

// Get sessions for a specific branch and date range
router.get('/', asyncHandler(async (req, res) => {
  const { branchId, startDate, endDate, activity } = req.query;
  
  const filter: any = {};
  if (branchId) filter.branchId = branchId;
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
router.get('/next-10-days/:branchId', asyncHandler(async (req, res) => {
  const { branchId } = req.params;
  const { activity } = req.query;
  
  // Generate next 10 days
  const dates = [];
  for (let i = 0; i < 10; i++) {
    const date = new Date();
    date.setDate(date.getDate() + i);
    dates.push(date.toISOString().split('T')[0]);
  }
  
  // Check which dates already have sessions
  const existingSessions = await Session.find({
    branchId,
    date: { $in: dates },
    ...(activity && { activity })
  });
  
  const existingDates = new Set(existingSessions.map(s => s.date));
  const missingDates = dates.filter(date => !existingDates.has(date));
  
  // Create default sessions for missing dates
  const defaultSessions = [];
  for (const date of missingDates) {
    // Skip Mondays for certain branches (this should come from branch settings)
    const dayOfWeek = new Date(date).getDay();
    const isMonday = dayOfWeek === 1;
    
    // Create default slime sessions
    if (!activity || activity === 'slime') {
      defaultSessions.push(
        {
          branchId,
          date,
          activity: 'slime',
          time: '10:00',
          label: '10:00 AM',
          totalSeats: 15,
          bookedSeats: 0,
          availableSeats: 15,
          type: 'Slime Play & Demo',
          ageGroup: '3+',
          isActive: !isMonday, // Disable Mondays for some branches
          createdBy: 'system'
        },
        {
          branchId,
          date,
          activity: 'slime',
          time: '11:30',
          label: '11:30 AM',
          totalSeats: 15,
          bookedSeats: 0,
          availableSeats: 15,
          type: 'Slime Play & Making',
          ageGroup: '8+',
          isActive: !isMonday,
          createdBy: 'system'
        },
        {
          branchId,
          date,
          activity: 'slime',
          time: '16:00',
          label: '4:00 PM',
          totalSeats: 15,
          bookedSeats: 0,
          availableSeats: 15,
          type: 'Slime Play & Making',
          ageGroup: '8+',
          isActive: !isMonday,
          createdBy: 'system'
        }
      );
    }
    
    // Create default tufting sessions (only for branches that support it)
    if ((!activity || activity === 'tufting') && branchId !== 'vijayawada') {
      defaultSessions.push(
        {
          branchId,
          date,
          activity: 'tufting',
          time: '12:00',
          label: '12:00 PM',
          totalSeats: 8,
          bookedSeats: 0,
          availableSeats: 8,
          type: 'Small Tufting',
          ageGroup: '15+',
          isActive: !isMonday,
          createdBy: 'system'
        },
        {
          branchId,
          date,
          activity: 'tufting',
          time: '15:00',
          label: '3:00 PM',
          totalSeats: 8,
          bookedSeats: 0,
          availableSeats: 8,
          type: 'Medium Tufting',
          ageGroup: '15+',
          isActive: !isMonday,
          createdBy: 'system'
        }
      );
    }
  }
  
  // Insert the new sessions
  if (defaultSessions.length > 0) {
    await Session.insertMany(defaultSessions);
  }
  
  // Return all sessions for the next 10 days
  const allSessions = await Session.find({
    branchId,
    date: { $in: dates },
    ...(activity && { activity })
  }).sort({ date: 1, time: 1 });
  
  res.json(allSessions);
}));

// Get specific session by ID
router.get('/:id', asyncHandler(async (req, res) => {
  const session = await Session.findById(req.params.id);
  if (!session) {
    return res.status(404).json({ message: 'Session not found' });
  }
  res.json(session);
}));

// Create new session (Admin/Manager only)
router.post('/', protect, adminOrBranchManager, asyncHandler(async (req, res) => {
  const sessionData = {
    ...req.body,
    createdBy: req.user._id,
    availableSeats: req.body.totalSeats - (req.body.bookedSeats || 0)
  };
  
  const session = await Session.create(sessionData);
  res.status(201).json(session);
}));

// Update session (Admin/Manager only)
router.put('/:id', protect, adminOrBranchManager, asyncHandler(async (req, res) => {
  const session = await Session.findById(req.params.id);
  if (!session) {
    return res.status(404).json({ message: 'Session not found' });
  }
  
  // Update fields
  Object.assign(session, req.body);
  
  // Recalculate available seats
  session.availableSeats = Math.max(0, session.totalSeats - session.bookedSeats);
  
  await session.save();
  res.json(session);
}));

// Update session seat count (for booking/cancellation)
router.patch('/:id/seats', protect, asyncHandler(async (req, res) => {
  const { seatsChange } = req.body; // positive for booking, negative for cancellation
  
  const session = await Session.findById(req.params.id);
  if (!session) {
    return res.status(404).json({ message: 'Session not found' });
  }
  
  const newBookedSeats = session.bookedSeats + seatsChange;
  
  // Check if we have enough seats
  if (newBookedSeats > session.totalSeats) {
    return res.status(400).json({ message: 'Not enough seats available' });
  }
  
  if (newBookedSeats < 0) {
    return res.status(400).json({ message: 'Invalid seat count' });
  }
  
  session.bookedSeats = newBookedSeats;
  session.availableSeats = session.totalSeats - session.bookedSeats;
  
  await session.save();
  res.json(session);
}));

// Delete session (Admin/Manager only)
router.delete('/:id', protect, adminOrBranchManager, asyncHandler(async (req, res) => {
  const session = await Session.findById(req.params.id);
  if (!session) {
    return res.status(404).json({ message: 'Session not found' });
  }
  
  // Check if there are any bookings for this session
  const bookingsCount = await Booking.countDocuments({ sessionId: session._id, status: 'active' });
  if (bookingsCount > 0) {
    return res.status(400).json({ 
      message: `Cannot delete session with ${bookingsCount} active bookings. Cancel bookings first.` 
    });
  }
  
  await Session.findByIdAndDelete(req.params.id);
  res.json({ message: 'Session deleted successfully' });
}));

// Bulk update sessions for a date (Admin/Manager only)
router.post('/bulk-update', protect, adminOrBranchManager, asyncHandler(async (req, res) => {
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
