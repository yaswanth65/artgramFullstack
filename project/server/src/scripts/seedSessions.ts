import mongoose from 'mongoose';
import Session from '../models/Session';
import dotenv from 'dotenv';

dotenv.config();

const sessions = [
  // Hyderabad Branch - Slime Sessions
  {
    branchId: 'hyderabad',
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
    branchId: 'hyderabad',
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
    branchId: 'hyderabad',
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
    branchId: 'hyderabad',
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
    branchId: 'hyderabad',
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
    branchId: 'vijayawada',
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
    branchId: 'vijayawada',
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
    branchId: 'bangalore',
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
    branchId: 'bangalore',
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
    branchId: 'bangalore',
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
    branchId: 'bangalore',
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
        if (isMonday && session.branchId !== 'vijayawada') {
          continue;
        }
        
        const sessionData = {
          ...session,
          date: dateStr,
          // Reset seat counts for future dates
          bookedSeats: dayOffset === 0 ? session.bookedSeats : Math.floor(Math.random() * session.totalSeats * 0.3),
        };
        sessionData.availableSeats = sessionData.totalSeats - sessionData.bookedSeats;
        
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
