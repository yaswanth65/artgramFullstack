import mongoose from 'mongoose';
import Session from '../models/Session';
import Branch from '../models/Branch';
import User from '../models/User';
import dotenv from 'dotenv';

dotenv.config();

// Template sessions (branchId will be replaced with actual ObjectIds)
const sessions = [
  // Hyderabad Branch - Slime Sessions
  {
    branchKey: 'hyderabad',
    date: '2025-08-27',
    activity: 'slime',
    time: '10:00',
    label: '10:00 AM',
    totalSeats: 15,
    bookedSeats: 3,
    availableSeats: 12,
    type: 'Slime Play & Demo',
    ageGroup: '3+',
    isActive: true,
    createdBy: 'system'
  },
  {
    branchKey: 'hyderabad',
    date: '2025-08-27',
    activity: 'slime',
    time: '11:30',
    label: '11:30 AM',
    totalSeats: 15,
    bookedSeats: 7,
    availableSeats: 8,
    type: 'Slime Play & Making',
    ageGroup: '8+',
    isActive: true,
    createdBy: 'system'
  },
  {
    branchKey: 'hyderabad',
    date: '2025-08-27',
    activity: 'slime',
    time: '16:00',
    label: '4:00 PM',
    totalSeats: 15,
    bookedSeats: 12,
    availableSeats: 3,
    type: 'Slime Play & Making',
    ageGroup: '8+',
    isActive: true,
    createdBy: 'system'
  },

  // Hyderabad Branch - Tufting Sessions
  {
    branchKey: 'hyderabad',
    date: '2025-08-27',
    activity: 'tufting',
    time: '12:00',
    label: '12:00 PM',
    totalSeats: 8,
    bookedSeats: 3,
    availableSeats: 5,
    type: 'Small Tufting',
    ageGroup: '15+',
    isActive: true,
    createdBy: 'system'
  },
  {
    branchKey: 'hyderabad',
    date: '2025-08-27',
    activity: 'tufting',
    time: '15:00',
    label: '3:00 PM',
    totalSeats: 8,
    bookedSeats: 6,
    availableSeats: 2,
    type: 'Medium Tufting',
    ageGroup: '15+',
    isActive: true,
    createdBy: 'system'
  },

  // Vijayawada Branch - Slime Sessions only (no tufting)
  {
    branchKey: 'vijayawada',
    date: '2025-08-27',
    activity: 'slime',
    time: '10:00',
    label: '10:00 AM',
    totalSeats: 12,
    bookedSeats: 2,
    availableSeats: 10,
    type: 'Slime Play & Demo',
    ageGroup: '3+',
    isActive: true,
    createdBy: 'system'
  },
  {
    branchKey: 'vijayawada',
    date: '2025-08-27',
    activity: 'slime',
    time: '14:00',
    label: '2:00 PM',
    totalSeats: 12,
    bookedSeats: 8,
    availableSeats: 4,
    type: 'Slime Play & Making',
    ageGroup: '8+',
    isActive: true,
    createdBy: 'system'
  },

  // Bangalore Branch - Both activities
  {
    branchKey: 'bangalore',
    date: '2025-08-27',
    activity: 'slime',
    time: '10:00',
    label: '10:00 AM',
    totalSeats: 18,
    bookedSeats: 5,
    availableSeats: 13,
    type: 'Slime Play & Demo',
    ageGroup: '3+',
    isActive: true,
    createdBy: 'system'
  },
  {
    branchKey: 'bangalore',
    date: '2025-08-27',
    activity: 'slime',
    time: '13:00',
    label: '1:00 PM',
    totalSeats: 18,
    bookedSeats: 14,
    availableSeats: 4,
    type: 'Slime Play & Demo',
    ageGroup: '3+',
    isActive: true,
    createdBy: 'system'
  },
  {
    branchKey: 'bangalore',
    date: '2025-08-27',
    activity: 'tufting',
    time: '11:00',
    label: '11:00 AM',
    totalSeats: 6,
    bookedSeats: 1,
    availableSeats: 5,
    type: 'Small Tufting',
    ageGroup: '15+',
    isActive: true,
    createdBy: 'system'
  },
  {
    branchKey: 'bangalore',
    date: '2025-08-27',
    activity: 'tufting',
    time: '14:30',
    label: '2:30 PM',
    totalSeats: 6,
    bookedSeats: 4,
    availableSeats: 2,
    type: 'Medium Tufting',
    ageGroup: '15+',
    isActive: true,
    createdBy: 'system'
  }
];

const seedSessions = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || '');
    console.log('Connected to MongoDB');

    // Clear existing sessions
    await Session.deleteMany({});
    console.log('Cleared existing sessions');

    // Load branches and admin for references
    const branches = await Branch.find().lean();
    if (!branches.length) {
      throw new Error('No branches found. Run seedData.ts first to create branches.');
    }
    const nameToBranchId: Record<string, mongoose.Types.ObjectId> = {};
    for (const b of branches) {
      const key = (b.location || b.name || '').toLowerCase();
      if (key.includes('hyderabad')) nameToBranchId['hyderabad'] = b._id as unknown as mongoose.Types.ObjectId;
      if (key.includes('vijayawada')) nameToBranchId['vijayawada'] = b._id as unknown as mongoose.Types.ObjectId;
      if (key.includes('bangalore')) nameToBranchId['bangalore'] = b._id as unknown as mongoose.Types.ObjectId;
    }
    const admin = await User.findOne({ role: 'admin' }).lean();

    // Create today and next few days sessions
    const today = new Date();
    const sessionPromises = [];

    for (let dayOffset = 0; dayOffset < 10; dayOffset++) {
      const date = new Date(today);
      date.setDate(today.getDate() + dayOffset);
      const dateStr = date.toISOString().split('T')[0];

      // Skip Mondays for most branches (except Vijayawada)
      const isMonday = date.getDay() === 1;

      for (const session of sessions) {
        // Skip Monday sessions for certain branches
        if (isMonday && session.branchKey !== 'vijayawada') {
          continue;
        }

        const sessionData: any = {
          ...session,
          date: dateStr,
          // Reset seat counts for future dates
          bookedSeats: dayOffset === 0 ? session.bookedSeats : Math.floor(Math.random() * session.totalSeats * 0.3),
        };
        sessionData.availableSeats = sessionData.totalSeats - sessionData.bookedSeats;
        // Replace branchKey with actual ObjectId
        const bId = nameToBranchId[session.branchKey as 'hyderabad' | 'vijayawada' | 'bangalore'];
        if (!bId) continue;
        delete sessionData.branchKey;
        sessionData.branchId = bId;
        if (admin) sessionData.createdBy = admin._id;

        sessionPromises.push(Session.create(sessionData));
      }
    }

    await Promise.all(sessionPromises);
    console.log(`Created ${sessionPromises.length} sessions for next 10 days`);

    console.log('Session seeding completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding sessions:', error);
    process.exit(1);
  }
};

seedSessions();
