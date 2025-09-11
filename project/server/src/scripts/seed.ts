import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import dotenv from 'dotenv';

// Import models
import Branch from '../models/Branch';
import User from '../models/User';
import Product from '../models/Product';
import Session from '../models/Session';
import Booking from '../models/Booking';
import Order from '../models/Order';

dotenv.config();

// Branch data for Vijayawada, Hyderabad, Bangalore
const branchData = [
  {
    name: 'Artgram Vijayawada',
    location: 'Vijayawada, Andhra Pradesh',
    razorpayKey: 'rzp_test_vijayawada_key_123'
  },
  {
    name: 'Artgram Hyderabad',
    location: 'Hyderabad, Telangana',
    razorpayKey: 'rzp_test_hyderabad_key_456'
  },
  {
    name: 'Artgram Bangalore',
    location: 'Bangalore, Karnataka',
    razorpayKey: 'rzp_test_bangalore_key_789'
  }
];

// Sample products (reduced to 10 essential items)
const productData = [
  {
    name: 'Professional Acrylic Paint Set',
    description: 'High-quality acrylic paints perfect for canvas work and art projects. Includes 24 vibrant colors.',
    price: 2499,
    stock: 50,
    category: 'Paints & Colors',
    media: [
      { url: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0', type: 'image' }
    ],
    sku: 'ART-PAINT-001',
    weight: 2.5,
    dimensions: { length: 30, width: 20, height: 8 },
    tags: ['acrylic', 'paint', 'professional', 'art', 'colors']
  },
  {
    name: 'Canvas Stretched Frame Set',
    description: 'Pre-stretched canvas frames in multiple sizes. Perfect for oil and acrylic painting.',
    price: 1899,
    stock: 30,
    category: 'Canvas & Boards',
    media: [
      { url: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96', type: 'image' }
    ],
    sku: 'ART-CANVAS-001',
    weight: 1.8,
    dimensions: { length: 60, width: 40, height: 2 },
    tags: ['canvas', 'frame', 'stretched', 'painting']
  },
  {
    name: 'Premium Artist Brush Set',
    description: 'Professional brush set with natural and synthetic bristles.',
    price: 1299,
    stock: 25,
    category: 'Brushes & Tools',
    media: [
      { url: 'https://images.unsplash.com/photo-1574053836461-4b6db2b4c25c', type: 'image' }
    ],
    sku: 'ART-BRUSH-001',
    weight: 0.5,
    dimensions: { length: 25, width: 15, height: 3 },
    tags: ['brushes', 'artist', 'premium', 'painting', 'tools']
  },
  {
    name: 'Slime Making Kit - Deluxe',
    description: 'Complete slime making kit with glue, activator, colors, and glitters. Safe and non-toxic.',
    price: 899,
    stock: 40,
    category: 'Slime Kits',
    media: [
      { url: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96', type: 'image' }
    ],
    sku: 'SLIME-KIT-001',
    weight: 1.2,
    dimensions: { length: 25, width: 20, height: 10 },
    tags: ['slime', 'kit', 'kids', 'activity', 'safe']
  },
  {
    name: 'Tufting Gun - Electric',
    description: 'Professional electric tufting gun for carpet and rug making.',
    price: 8999,
    stock: 10,
    category: 'Tufting Supplies',
    media: [
      { url: 'https://images.unsplash.com/photo-1578321272176-b7bbc0679853', type: 'image' }
    ],
    sku: 'TUFT-GUN-001',
    weight: 2.8,
    dimensions: { length: 40, width: 15, height: 25 },
    tags: ['tufting', 'gun', 'electric', 'carpet', 'rug']
  }
];

// Session types
const sessionTypes = {
  slime: [
    { type: 'Slime Making Workshop', ageGroup: '8+', price: 499 }
  ],
  tufting: [
    { type: 'Tufting Basics Workshop', ageGroup: '15+', price: 1299 }
  ]
};

// Session times
const sessionTimes = [
  { time: '10:00', label: '10:00 AM' },
  { time: '14:00', label: '2:00 PM' },
  { time: '16:00', label: '4:00 PM' }
];

// Helper functions
const getRandomElement = <T>(array: T[]): T => {
  return array[Math.floor(Math.random() * array.length)];
};

const getRandomInt = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

// Customer data for each branch
const customerData = [
  {
    name: 'Arjun Sharma',
    email: 'arjun.sharma@example.com',
    phone: '+919876543210',
    address: {
      street: '123 MG Road',
      city: 'Vijayawada',
      state: 'Andhra Pradesh',
      zipCode: '520001',
      country: 'India'
    }
  },
  {
    name: 'Priya Reddy',
    email: 'priya.reddy@example.com',
    phone: '+919876543211',
    address: {
      street: '456 Banjara Hills',
      city: 'Hyderabad',
      state: 'Telangana',
      zipCode: '500034',
      country: 'India'
    }
  },
  {
    name: 'Rahul Kumar',
    email: 'rahul.kumar@example.com',
    phone: '+919876543212',
    address: {
      street: '789 Koramangala',
      city: 'Bangalore',
      state: 'Karnataka',
      zipCode: '560034',
      country: 'India'
    }
  }
];

async function seedDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/artgram');
    console.log('Connected to MongoDB');

    // Clear existing data
    console.log('Clearing existing data...');
    await Promise.all([
      Branch.deleteMany({}),
      User.deleteMany({}),
      Product.deleteMany({}),
      Session.deleteMany({}),
      Booking.deleteMany({}),
      Order.deleteMany({})
    ]);

    console.log('Creating branches...');
    // 1. Create branches
    const branches = await Branch.insertMany(branchData);
    console.log(`Created ${branches.length} branches`);

    console.log('Creating admin and managers...');
    // 2. Create admin and branch managers
    const hashedPassword = await bcrypt.hash('password123', 10);
    
    // Create super admin
    const adminUser = new User({
      name: 'Super Admin',
      email: 'admin@artgram.com',
      password: hashedPassword,
      role: 'admin',
      phone: '+919876543200',
      address: {
        street: 'Admin Office',
        city: 'Hyderabad',
        state: 'Telangana',
        zipCode: '500001',
        country: 'India'
      }
    });
    await adminUser.save();

    // Create branch managers
    const managers: any[] = [];
    const managerNames = ['Vijay Manager', 'Hyderabad Manager', 'Bangalore Manager'];
    
    for (let i = 0; i < branches.length; i++) {
      const manager = new User({
        name: managerNames[i],
        email: `manager${i + 1}@artgram.com`,
        password: hashedPassword,
        role: 'branch_manager',
        branchId: branches[i]._id,
        phone: `+91987654320${i + 1}`,
        address: customerData[i].address
      });
      await manager.save();
      managers.push(manager);
      
      // Update branch with manager ID
      await Branch.findByIdAndUpdate(branches[i]._id, { managerId: manager._id });
    }

    console.log('Creating customers...');
    // 3. Create customers (1 per branch)
    const customers: any[] = [];
    for (let i = 0; i < branches.length; i++) {
      const customer = new User({
        ...customerData[i],
        password: hashedPassword,
        role: 'customer',
        branchId: branches[i]._id,
        cart: []
      });
      await customer.save();
      customers.push(customer);
    }

    console.log('Creating products...');
    // 4. Create products
    const products = await Product.insertMany(productData);
    console.log(`Created ${products.length} products`);

    console.log('Creating sessions...');
    // 5. Create sessions for next 5 days (5 sessions per branch - total 15 sessions)
    const sessions: any[] = [];
    const today = new Date();
    
    for (let branchIndex = 0; branchIndex < branches.length; branchIndex++) {
      const branch = branches[branchIndex];
      const manager = managers[branchIndex];
      
      for (let dayOffset = 0; dayOffset < 5; dayOffset++) {
        const sessionDate = new Date(today);
        sessionDate.setDate(today.getDate() + dayOffset);
        const dateStr = sessionDate.toISOString().split('T')[0];
        
        // Create one session per day per branch
        const activityType = dayOffset % 2 === 0 ? 'slime' : 'tufting'; // Alternate between slime and tufting
        const sessionType = sessionTypes[activityType][0];
        const timeSlot = getRandomElement(sessionTimes);
        
        const session = new Session({
          branchId: branch._id,
          date: dateStr,
          activity: activityType,
          time: timeSlot.time,
          label: timeSlot.label,
          totalSeats: 10,
          bookedSeats: 1, // Will be booked by the customer
          availableSeats: 9,
          type: sessionType.type,
          ageGroup: sessionType.ageGroup,
          price: sessionType.price,
          isActive: true,
          createdBy: manager._id,
          notes: `${sessionType.type} for ${sessionType.ageGroup} age group`
        });
        
        await session.save();
        sessions.push(session);
      }
    }

    console.log('Creating bookings...');
    // 6. Create bookings - each customer books one session
    const bookings: any[] = [];
    for (let i = 0; i < customers.length; i++) {
      const customer = customers[i];
      // Find a session for this customer's branch
      const customerSessions = sessions.filter(s => s.branchId.toString() === customer.branchId?.toString());
      const sessionToBook = customerSessions[0]; // Book the first session
      
      if (sessionToBook) {
        const booking = new Booking({
          sessionId: sessionToBook._id,
          activity: sessionToBook.activity,
          branchId: sessionToBook.branchId,
          customerId: customer._id,
          customerName: customer.name,
          customerEmail: customer.email,
          customerPhone: customer.phone,
          date: sessionToBook.date,
          time: sessionToBook.time,
          seats: 1,
          totalAmount: sessionToBook.price,
          paymentStatus: 'completed',
          paymentIntentId: `pi_${uuidv4().replace(/-/g, '').substring(0, 24)}`,
          qrCode: uuidv4(),
          qrCodeData: JSON.stringify({
            bookingId: 'temp_id',
            sessionId: sessionToBook._id,
            customerName: customer.name,
            seats: 1
          }),
          isVerified: false,
          packageType: 'base',
          status: 'active'
        });
        
        await booking.save();
        bookings.push(booking);
      }
    }

    console.log('Creating orders...');
    // 7. Create orders - each customer buys 2-3 products
    const orders: any[] = [];
    for (let i = 0; i < customers.length; i++) {
      const customer = customers[i];
      const branch = branches[i];
      
      // Select 2-3 products for this customer
      const orderProducts = [];
      const productCount = getRandomInt(2, 3);
      const selectedProducts: string[] = [];
      
      for (let j = 0; j < productCount; j++) {
        let product;
        do {
          product = getRandomElement(products);
        } while (selectedProducts.includes(product._id.toString()));
        
        selectedProducts.push(product._id.toString());
        const quantity = 1; // Keep it simple with quantity 1
        
        orderProducts.push({
          productId: product._id.toString(),
          quantity,
          price: product.price,
          name: product.name
        });
      }
      
      const totalAmount = orderProducts.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      
      const order = new Order({
        products: orderProducts,
        totalAmount,
        branchId: branch._id.toString(),
        customerId: customer._id.toString(),
        customerName: customer.name,
        customerEmail: customer.email,
        customerPhone: customer.phone,
        shippingAddress: customer.address,
        trackingUpdates: [
          {
            status: 'Order Placed',
            location: branch.location,
            description: 'Your order has been placed successfully',
            createdAt: new Date()
          },
          {
            status: 'Processing',
            location: branch.location,
            description: 'Your order is being processed',
            createdAt: new Date()
          }
        ],
        paymentStatus: 'completed',
        orderStatus: 'processing',
        paymentIntentId: `pi_${uuidv4().replace(/-/g, '').substring(0, 24)}`,
        trackingNumber: `TRK${Date.now()}${100 + i}`
      });
      
      await order.save();
      orders.push(order);
    }

    // Print summary
    console.log('\n🎉 Simplified seed data created successfully!');
    console.log('='.repeat(50));
    console.log(`📍 Branches: ${branches.length}`);
    console.log(`👥 Users: ${1 + managers.length + customers.length} (1 admin, ${managers.length} managers, ${customers.length} customers)`);
    console.log(`🛍️  Products: ${products.length}`);
    console.log(`📅 Sessions: ${sessions.length} (5 per branch for next 5 days)`);
    console.log(`🎫 Bookings: ${bookings.length} (1 per customer)`);
    console.log(`📦 Orders: ${orders.length} (1 per customer)`);
    console.log('='.repeat(50));
    
    console.log('\n📧 Login Credentials:');
    console.log('Admin: admin@artgram.com / password123');
    console.log('\nBranch Managers:');
    managers.forEach((manager, index) => {
      console.log(`  ${manager.email} / password123 (${branches[index].name})`);
    });
    console.log('\nCustomers:');
    customers.forEach((customer, index) => {
      console.log(`  ${customer.email} / password123 (${branches[index].name})`);
    });
    
    console.log('\n🏢 Branch Summary:');
    branches.forEach((branch, index) => {
      const branchSessions = sessions.filter(s => s.branchId.toString() === branch._id.toString());
      const branchBookings = bookings.filter(b => b.branchId?.toString() === branch._id.toString());
      const branchOrders = orders.filter(o => o.branchId === branch._id.toString());
      
      console.log(`\n${branch.name}:`);
      console.log(`  📧 Manager: ${managers[index].email}`);
      console.log(`  👤 Customer: ${customers[index].email}`);
      console.log(`  📅 Sessions: ${branchSessions.length}`);
      console.log(`  🎫 Bookings: ${branchBookings.length}`);
      console.log(`  📦 Orders: ${branchOrders.length}`);
    });

  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\nDisconnected from MongoDB');
  }
}

// Run the seed function
if (require.main === module) {
  seedDatabase();
}

export default seedDatabase;