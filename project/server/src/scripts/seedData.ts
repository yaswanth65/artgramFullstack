import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import User from '../models/User';
import Branch from '../models/Branch';
import Product from '../models/Product';
import Booking from '../models/Booking';
import Order from '../models/Order';

dotenv.config();

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || '');
    console.log('Connected to MongoDB');
    
    // Clear existing data
    await User.deleteMany({});
    await Branch.deleteMany({});
    await Product.deleteMany({});
    await Booking.deleteMany({});
    await Order.deleteMany({});
    console.log('Cleared existing data');
    
    // Create branches first
    const branches = [
      {
        _id: new mongoose.Types.ObjectId(),
        name: 'Craft Factory Hyderabad',
        location: 'Hyderabad',
        managerId: 'hyderabad-manager',
        razorpayKey: 'rzp_test_hyderabad_key'
      },
      {
        _id: new mongoose.Types.ObjectId(),
        name: 'Craft Factory Vijayawada',
        location: 'Vijayawada',
        managerId: 'vijayawada-manager',
        razorpayKey: 'rzp_test_vijayawada_key'
      },
      {
        _id: new mongoose.Types.ObjectId(),
        name: 'Craft Factory Bangalore',
        location: 'Bangalore',
        managerId: 'bangalore-manager',
        razorpayKey: 'rzp_test_bangalore_key'
      }
    ];

    const savedBranches = await Branch.insertMany(branches);
    console.log('Branches created successfully');

    // Create users
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
        branchId: savedBranches[0]._id.toString()
      },
      {
        name: 'Vijayawada Branch Manager',
        email: 'vijayawada@craftfactory.com',
        password: await bcrypt.hash('password', 10),
        role: 'branch_manager',
        branchId: savedBranches[1]._id.toString()
      },
      {
        name: 'Bangalore Branch Manager',
        email: 'bangalore@craftfactory.com',
        password: await bcrypt.hash('password', 10),
        role: 'branch_manager',
        branchId: savedBranches[2]._id.toString()
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
      },
      {
        name: 'Jane Smith',
        email: 'jane@example.com',
        password: await bcrypt.hash('password', 10),
        role: 'customer',
        phone: '+91 98765 43211',
        address: {
          street: '24 Gandhi Road',
          city: 'Vijayawada',
          state: 'Andhra Pradesh',
          zipCode: '520001',
          country: 'India'
        }
      },
      {
        name: 'Mike Johnson',
        email: 'mike@example.com',
        password: await bcrypt.hash('password', 10),
        role: 'customer',
        phone: '+91 98765 43212',
        address: {
          street: '36 Indiranagar',
          city: 'Bangalore',
          state: 'Karnataka',
          zipCode: '560038',
          country: 'India'
        }
      }
    ];
    
    const savedUsers = await User.insertMany(users);
    console.log('Users created successfully');

    // Create products for each branch
    const products = [
      // Hyderabad Products
      {
        name: 'Hyderabad Slime Making Kit',
        description: 'Complete slime making kit with all essential materials',
        price: 1200,
        quantity: 50,
        branchId: savedBranches[0]._id.toString(),
        category: 'Slime Kits',
        imageUrl: 'https://res.cloudinary.com/df2mieky2/image/upload/q_70/v1754651195/DSC07659_zj2pcc.jpg',
        isActive: true,
        sku: 'HYD-SLIME-001',
        weight: 0.5,
        dimensions: { length: 20, width: 15, height: 8 },
        tags: ['slime', 'kids', 'craft']
      },
      {
        name: 'Hyderabad Art Supply Bundle',
        description: 'Professional art supplies for serious crafters',
        price: 2500,
        quantity: 30,
        branchId: savedBranches[0]._id.toString(),
        category: 'Art Supplies',
        imageUrl: 'https://res.cloudinary.com/df2mieky2/image/upload/q_70/v1755025999/IMG-20250807-WA0003_u999yh.jpg',
        isActive: true,
        sku: 'HYD-ART-001',
        weight: 1.2,
        dimensions: { length: 30, width: 25, height: 5 },
        tags: ['art', 'painting', 'professional']
      },
      {
        name: 'Hyderabad Tufting Starter Kit',
        description: 'Everything needed to start your tufting journey',
        price: 3500,
        quantity: 20,
        branchId: savedBranches[0]._id.toString(),
        category: 'Tufting Kits',
        imageUrl: 'https://images.pexels.com/photos/1109541/pexels-photo-1109541.jpeg',
        isActive: true,
        sku: 'HYD-TUFT-001',
        weight: 2.0,
        dimensions: { length: 40, width: 30, height: 10 },
        tags: ['tufting', 'rug', 'advanced']
      },

      // Vijayawada Products
      {
        name: 'Vijayawada Glitter Slime Kit',
        description: 'Special glitter slime kit exclusive to Vijayawada',
        price: 1100,
        quantity: 45,
        branchId: savedBranches[1]._id.toString(),
        category: 'Slime Kits',
        imageUrl: 'https://images.pexels.com/photos/1148998/pexels-photo-1148998.jpeg',
        isActive: true,
        sku: 'VJA-SLIME-001',
        weight: 0.6,
        dimensions: { length: 22, width: 16, height: 9 },
        tags: ['slime', 'glitter', 'special']
      },
      {
        name: 'Vijayawada Kids Craft Set',
        description: 'Perfect starter kit for young artists in Vijayawada',
        price: 800,
        quantity: 60,
        branchId: savedBranches[1]._id.toString(),
        category: 'Kids Supplies',
        imageUrl: 'https://images.pexels.com/photos/1029141/pexels-photo-1029141.jpeg',
        isActive: true,
        sku: 'VJA-KIDS-001',
        weight: 0.8,
        dimensions: { length: 25, width: 20, height: 6 },
        tags: ['kids', 'craft', 'starter']
      },
      {
        name: 'Vijayawada Premium Paint Set',
        description: 'High-quality acrylic paints for professional results',
        price: 1800,
        quantity: 35,
        branchId: savedBranches[1]._id.toString(),
        category: 'Art Supplies',
        imageUrl: 'https://res.cloudinary.com/df2mieky2/image/upload/q_70/v1755026061/HAR05826_hv05wz.jpg',
        isActive: true,
        sku: 'VJA-PAINT-001',
        weight: 1.0,
        dimensions: { length: 28, width: 22, height: 4 },
        tags: ['paint', 'acrylic', 'premium']
      },

      // Bangalore Products
      {
        name: 'Bangalore Crystal Slime Kit',
        description: 'Make beautiful crystal clear slime with this premium kit',
        price: 1350,
        quantity: 40,
        branchId: savedBranches[2]._id.toString(),
        category: 'Slime Kits',
        imageUrl: 'https://images.pexels.com/photos/6941924/pexels-photo-6941924.jpeg',
        isActive: true,
        sku: 'BLR-SLIME-001',
        weight: 0.7,
        dimensions: { length: 24, width: 18, height: 10 },
        tags: ['slime', 'crystal', 'premium']
      },
      {
        name: 'Bangalore Professional Art Kit',
        description: 'Complete professional art kit for serious artists',
        price: 3200,
        quantity: 25,
        branchId: savedBranches[2]._id.toString(),
        category: 'Art Supplies',
        imageUrl: 'https://images.pexels.com/photos/1047540/pexels-photo-1047540.jpeg',
        isActive: true,
        sku: 'BLR-ART-001',
        weight: 1.5,
        dimensions: { length: 35, width: 28, height: 8 },
        tags: ['art', 'professional', 'complete']
      },
      {
        name: 'Bangalore Advanced Tufting Set',
        description: 'Advanced tufting set with premium materials',
        price: 4200,
        quantity: 15,
        branchId: savedBranches[2]._id.toString(),
        category: 'Tufting Kits',
        imageUrl: 'https://images.pexels.com/photos/1545558/pexels-photo-1545558.jpeg',
        isActive: true,
        sku: 'BLR-TUFT-001',
        weight: 2.5,
        dimensions: { length: 45, width: 35, height: 12 },
        tags: ['tufting', 'advanced', 'premium']
      },
      {
        name: 'Bangalore Craft Combo Pack',
        description: 'Mix of various craft supplies for creative exploration',
        price: 2800,
        quantity: 30,
        branchId: savedBranches[2]._id.toString(),
        category: 'Combo Packs',
        imageUrl: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg',
        isActive: true,
        sku: 'BLR-COMBO-001',
        weight: 1.8,
        dimensions: { length: 32, width: 26, height: 15 },
        tags: ['combo', 'craft', 'variety']
      }
    ];

    await Product.insertMany(products);
    console.log('Products created successfully');

    // Create sample bookings
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    const bookings = [
      {
        eventId: 'sample-event-1',
        sessionDate: tomorrow.toISOString().split('T')[0],
        branchId: savedBranches[0]._id.toString(),
        customerId: savedUsers[4]._id.toString(),
        customerName: 'John Doe',
        customerEmail: 'customer@example.com',
        customerPhone: '+91 98765 43210',
        qrCodeData: `QR-${Date.now()}-1`
      },
      {
        eventId: 'sample-event-2',
        sessionDate: tomorrow.toISOString().split('T')[0],
        branchId: savedBranches[1]._id.toString(),
        customerId: savedUsers[5]._id.toString(),
        customerName: 'Jane Smith',
        customerEmail: 'jane@example.com',
        customerPhone: '+91 98765 43211',
        qrCodeData: `QR-${Date.now()}-2`
      }
    ];

    await Booking.insertMany(bookings);
    console.log('Bookings created successfully');

    console.log('\n=== SEED DATA SUMMARY ===');
    console.log(`✅ Created ${savedBranches.length} branches`);
    console.log(`✅ Created ${savedUsers.length} users`);
    console.log(`✅ Created ${products.length} products`);
    console.log(`✅ Created ${bookings.length} bookings`);
    console.log('\n=== BRANCH DETAILS ===');
    savedBranches.forEach(branch => {
      const branchProducts = products.filter(p => p.branchId === branch._id.toString());
      console.log(`📍 ${branch.name} (${branch.location}): ${branchProducts.length} products`);
    });
    console.log('\n=== LOGIN CREDENTIALS ===');
    console.log('Admin: admin@craftfactory.com / password');
    console.log('Hyderabad Manager: hyderabad@craftfactory.com / password');
    console.log('Vijayawada Manager: vijayawada@craftfactory.com / password');
    console.log('Bangalore Manager: bangalore@craftfactory.com / password');
    console.log('Customer: customer@example.com / password');
    
    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedData();
