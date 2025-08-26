import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import User from '../models/User';
import Branch from '../models/Branch';

dotenv.config();

const seedUsers = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || '');
    console.log('Connected to MongoDB');

    // Clear existing users
    await User.deleteMany({});
    console.log('Cleared existing users');

    // Map human branch keys to ObjectIds
    const branches = await Branch.find().lean();
    if (!branches.length) {
      throw new Error('No branches found. Run seedData.ts first to create branches.');
    }
    const keyToBranchId: Record<string, any> = {};
    for (const b of branches) {
      const key = (b.location || b.name || '').toLowerCase();
      if (key.includes('hyderabad')) keyToBranchId['hyderabad'] = b._id;
      if (key.includes('vijayawada')) keyToBranchId['vijayawada'] = b._id;
      if (key.includes('bangalore')) keyToBranchId['bangalore'] = b._id;
    }

    // Create seed users
    const users = [
      {
        name: 'Admin User',
        email: 'admin@craftfactory.com',
        password: await bcrypt.hash('password', 10),
        role: 'admin'
      },
      {
        name: 'Hyderabad Branch Manager',
        email: 'hyderabad@craftfactory.com',
        password: await bcrypt.hash('password', 10),
        role: 'branch_manager',
        branchId: keyToBranchId['hyderabad']
      },
      {
        name: 'Vijayawada Branch Manager',
        email: 'vijayawada@craftfactory.com',
        password: await bcrypt.hash('password', 10),
        role: 'branch_manager',
        branchId: keyToBranchId['vijayawada']
      },
      {
        name: 'Bangalore Branch Manager',
        email: 'bangalore@craftfactory.com',
        password: await bcrypt.hash('password', 10),
        role: 'branch_manager',
        branchId: keyToBranchId['bangalore']
      },
      {
        name: 'John Doe',
        email: 'customer@example.com',
        password: await bcrypt.hash('password', 10),
        role: 'customer',
        phone: '+91 98765 43210',
        address: {
          street: '12 MG Road',
          city: 'Hyderabad',
          state: 'Telangana',
          zipCode: '500081',
          country: 'India'
        }
      }
    ];

    await User.insertMany(users);
    console.log('Seed users created successfully');
    console.log('Users created:');
    users.forEach(user => console.log(`- ${user.email} (${user.role})`));

    process.exit(0);
  } catch (error) {
    console.error('Error seeding users:', error);
    process.exit(1);
  }
};

seedUsers();
