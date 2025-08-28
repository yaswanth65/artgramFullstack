import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Booking from '../models/Booking';
import Session from '../models/Session';
import Branch from '../models/Branch';
import User from '../models/User';

dotenv.config();

const MONGO = process.env.MONGO_URI || '';

const TARGET_DATE = '2025-08-30';
const ACTIVITY = 'tufting';
const CUSTOMER_EMAIL = 'customer@example.com';

const run = async () => {
  try {
    await mongoose.connect(MONGO);
    console.log('Connected to MongoDB');

    const branch = await Branch.findOne({ $or: [ { location: /hyderabad/i }, { name: /hyderabad/i } ] });
    if (!branch) {
      throw new Error('Hyderabad branch not found. Run seedData first.');
    }

    // Try to find an existing tufting session on the target date
    let session = await Session.findOne({ branchId: branch._id, date: TARGET_DATE, activity: ACTIVITY });

    const admin = await User.findOne({ role: 'admin' });

    if (!session) {
      console.log('No existing tufting session found on', TARGET_DATE, '— creating one');
      const s = {
        branchId: branch._id,
        date: TARGET_DATE,
        activity: ACTIVITY,
        time: '12:00',
        label: '12:00 PM',
        totalSeats: 8,
        bookedSeats: 0,
        availableSeats: 8,
        type: 'Small Tufting',
        ageGroup: '15+',
        isActive: true,
        createdBy: admin?._id || undefined
      } as any;
      session = await Session.create(s);
      console.log('Created session:', session._id.toString());
    } else {
      console.log('Found session:', session._id.toString(), session.label || session.time);
    }

    const customer = await User.findOne({ email: CUSTOMER_EMAIL });
    if (!customer) {
      throw new Error(`Customer ${CUSTOMER_EMAIL} not found. Run seedUsers first.`);
    }

    // Create a booking for this session
    const existing = await Booking.findOne({ sessionId: session._id, customerId: customer._id });
    if (existing) {
      console.log('Booking already exists for this customer and session:', existing._id.toString());
      process.exit(0);
    }

    const qr = `TESTQR-${Date.now().toString(36)}`;

    const bookingData: any = {
      sessionId: session._id,
      activity: ACTIVITY,
      branchId: branch._id,
      customerId: customer._id,
      customerName: customer.name || 'Test Customer',
      customerEmail: customer.email,
      customerPhone: customer.phone || '',
      date: TARGET_DATE,
      time: session.time || '12:00',
      seats: 5,
      totalAmount: 0,
      paymentStatus: 'completed',
      qrCode: qr,
      qrCodeData: JSON.stringify({ bookingFor: 'tufting', date: TARGET_DATE, email: customer.email }),
      isVerified: false,
      status: 'active'
    };

    const booking = await Booking.create(bookingData);
    console.log('Created booking:', booking._id.toString());

    // Update session counts
  const seatsAdded = Number(booking.seats || 1);
  session.bookedSeats = (session.bookedSeats || 0) + seatsAdded;
  session.availableSeats = Math.max(0, (session.totalSeats || 0) - session.bookedSeats);
    await session.save();
    console.log('Updated session counts: bookedSeats=', session.bookedSeats, 'availableSeats=', session.availableSeats);

    console.log('Seeding complete.');
    process.exit(0);
  } catch (err) {
    console.error('Error seeding tufting booking:', err);
    process.exit(1);
  }
};

run();
