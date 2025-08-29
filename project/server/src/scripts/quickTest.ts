import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Import models
import Branch from '../models/Branch';
import User from '../models/User';
import Product from '../models/Product';
import Session from '../models/Session';
import Booking from '../models/Booking';
import Order from '../models/Order';

dotenv.config();

async function quickTest() {
  try {
    console.log('🔗 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/artgram');
    console.log('✅ Connected successfully!');

    // Quick counts
    const counts = await Promise.all([
      Branch.countDocuments(),
      User.countDocuments(),
      Product.countDocuments(),
      Session.countDocuments(),
      Booking.countDocuments(),
      Order.countDocuments()
    ]);

    console.log('\n📊 Database Summary:');
    console.log(`🏢 Branches: ${counts[0]}`);
    console.log(`👥 Users: ${counts[1]}`);
    console.log(`🛍️ Products: ${counts[2]}`);
    console.log(`📅 Sessions: ${counts[3]}`);
    console.log(`🎫 Bookings: ${counts[4]}`);
    console.log(`📦 Orders: ${counts[5]}`);

    // Show branch names
    console.log('\n🏢 Branches:');
    const branches = await Branch.find({}, 'name location');
    branches.forEach(branch => {
      console.log(`   • ${branch.name} - ${branch.location}`);
    });

    // Show user roles
    console.log('\n👥 User Roles:');
    const roleStats = await User.aggregate([
      { $group: { _id: '$role', count: { $sum: 1 } } }
    ]);
    roleStats.forEach(stat => {
      console.log(`   • ${stat._id}: ${stat.count}`);
    });

    // Show sample login credentials
    console.log('\n🔑 Sample Login Credentials:');
    console.log('   Admin: admin@artgram.com / password123');
    const managers = await User.find({ role: 'branch_manager' }, 'email');
    managers.forEach((manager, index) => {
      console.log(`   Manager ${index + 1}: ${manager.email} / password123`);
    });
    console.log('   Customer: customer1@example.com / password123');

    console.log('\n✅ Database is ready for testing!');

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔗 Disconnected from MongoDB');
  }
}

quickTest();
