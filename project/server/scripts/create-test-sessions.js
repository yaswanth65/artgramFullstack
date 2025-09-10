const mongoose = require('mongoose');

// Define Session schema since we can't import ES modules
const sessionSchema = new mongoose.Schema({
  branchId: { type: mongoose.Schema.Types.ObjectId, ref: 'Branch', required: true },
  date: { type: String, required: true },
  activity: { type: String, enum: ['slime', 'tufting'], required: true },
  time: { type: String, required: true },
  label: { type: String },
  totalSeats: { type: Number, required: true },
  bookedSeats: { type: Number, default: 0 },
  availableSeats: { type: Number, required: true },
  type: { type: String },
  ageGroup: { type: String },
  price: { type: Number },
  isActive: { type: Boolean, default: true },
  notes: { type: String },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, {
  timestamps: true
});

const Session = mongoose.model('Session', sessionSchema);

// Define Branch schema
const branchSchema = new mongoose.Schema({
  name: { type: String, required: true },
  location: { type: String, required: true },
  allowSlime: { type: Boolean, default: true },
  allowTufting: { type: Boolean, default: true },
  allowMonday: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true }
}, {
  timestamps: true
});

const Branch = mongoose.model('Branch', branchSchema);

// Connection URI - update with your MongoDB connection string
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/artgram';

async function createTestSessions() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Get all branches
    const branches = await Branch.find({});
    console.log(`Found ${branches.length} branches`);

    // Get the next 10 days
    const today = new Date();
    const dates = [];
    for (let i = 0; i < 10; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      dates.push(date.toISOString().split('T')[0]);
    }

    // Clear existing sessions for the next 10 days
    await Session.deleteMany({
      date: { $in: dates }
    });
    console.log('Cleared existing sessions');

    const sessionsToCreate = [];

    for (const branch of branches) {
      for (const date of dates) {
        const dateObj = new Date(date);
        const isMonday = dateObj.getDay() === 1;
        
        // Skip Monday if branch doesn't allow it
        if (isMonday && !branch.allowMonday) {
          console.log(`Skipping Monday ${date} for ${branch.name} (no Monday sessions)`);
          continue;
        }

        // Create slime sessions if branch allows slime
        if (branch.allowSlime) {
          const slimeSessions = [
            {
              branchId: branch._id,
              date: date,
              activity: 'slime',
              time: '10:00',
              label: '10:00 AM',
              totalSeats: 15,
              bookedSeats: Math.floor(Math.random() * 8), // Random bookings
              type: 'Slime Play & Demo',
              ageGroup: '3+ years',
              price: 750,
              isActive: true
            },
            {
              branchId: branch._id,
              date: date,
              activity: 'slime',
              time: '11:30',
              label: '11:30 AM',
              totalSeats: 15,
              bookedSeats: Math.floor(Math.random() * 10),
              type: 'Slime Play & Making',
              ageGroup: '8+ years',
              price: 750,
              isActive: true
            },
            {
              branchId: branch._id,
              date: date,
              activity: 'slime',
              time: '13:00',
              label: '1:00 PM',
              totalSeats: 15,
              bookedSeats: Math.floor(Math.random() * 12),
              type: 'Slime Play & Demo',
              ageGroup: '3+ years',
              price: 750,
              isActive: true
            },
            {
              branchId: branch._id,
              date: date,
              activity: 'slime',
              time: '14:30',
              label: '2:30 PM',
              totalSeats: 15,
              bookedSeats: Math.floor(Math.random() * 5),
              type: 'Slime Play & Demo',
              ageGroup: '3+ years',
              price: 750,
              isActive: true
            },
            {
              branchId: branch._id,
              date: date,
              activity: 'slime',
              time: '16:00',
              label: '4:00 PM',
              totalSeats: 15,
              bookedSeats: Math.floor(Math.random() * 13),
              type: 'Slime Play & Making',
              ageGroup: '8+ years',
              price: 750,
              isActive: true
            },
            {
              branchId: branch._id,
              date: date,
              activity: 'slime',
              time: '17:30',
              label: '5:30 PM',
              totalSeats: 15,
              bookedSeats: 15, // Sold out session
              type: 'Slime Play & Demo',
              ageGroup: '3+ years',
              price: 750,
              isActive: true
            }
          ];

          // Calculate available seats
          slimeSessions.forEach(session => {
            session.availableSeats = session.totalSeats - session.bookedSeats;
          });

          sessionsToCreate.push(...slimeSessions);
        }

        // Create tufting sessions if branch allows tufting
        if (branch.allowTufting) {
          const tuftingSessions = [
            {
              branchId: branch._id,
              date: date,
              activity: 'tufting',
              time: '09:00',
              label: '9:00 AM',
              totalSeats: 8,
              bookedSeats: Math.floor(Math.random() * 4),
              type: 'Small Tufting (8x8)',
              ageGroup: '15+ years',
              price: 2000,
              isActive: true
            },
            {
              branchId: branch._id,
              date: date,
              activity: 'tufting',
              time: '11:30',
              label: '11:30 AM',
              totalSeats: 6,
              bookedSeats: Math.floor(Math.random() * 3),
              type: 'Medium Tufting (12x12)',
              ageGroup: '15+ years',
              price: 3500,
              isActive: true
            },
            {
              branchId: branch._id,
              date: date,
              activity: 'tufting',
              time: '14:00',
              label: '2:00 PM',
              totalSeats: 8,
              bookedSeats: Math.floor(Math.random() * 5),
              type: 'Small Tufting (8x8)',
              ageGroup: '15+ years',
              price: 2000,
              isActive: true
            },
            {
              branchId: branch._id,
              date: date,
              activity: 'tufting',
              time: '16:30',
              label: '4:30 PM',
              totalSeats: 4,
              bookedSeats: Math.floor(Math.random() * 2),
              type: 'Big Tufting (14x14)',
              ageGroup: '15+ years',
              price: 4500,
              isActive: true
            },
            {
              branchId: branch._id,
              date: date,
              activity: 'tufting',
              time: '19:00',
              label: '7:00 PM',
              totalSeats: 6,
              bookedSeats: 5, // Almost full
              type: 'Medium Tufting (12x12)',
              ageGroup: '15+ years',
              price: 3500,
              isActive: true
            }
          ];

          // Calculate available seats
          tuftingSessions.forEach(session => {
            session.availableSeats = session.totalSeats - session.bookedSeats;
          });

          sessionsToCreate.push(...tuftingSessions);
        }
      }
    }

    // Insert all sessions
    if (sessionsToCreate.length > 0) {
      await Session.insertMany(sessionsToCreate);
      console.log(`Created ${sessionsToCreate.length} test sessions`);
      
      // Group by branch and activity for summary
      const summary = {};
      sessionsToCreate.forEach(session => {
        const key = `${session.branchId}_${session.activity}`;
        if (!summary[key]) summary[key] = 0;
        summary[key]++;
      });
      
      console.log('\nSessions created by branch and activity:');
      for (const [key, count] of Object.entries(summary)) {
        const [branchId, activity] = key.split('_');
        const branch = branches.find(b => b._id.toString() === branchId);
        console.log(`${branch?.name || 'Unknown'} - ${activity}: ${count} sessions`);
      }
    }

    console.log('\nTest sessions created successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error creating test sessions:', error);
    process.exit(1);
  }
}

createTestSessions();
