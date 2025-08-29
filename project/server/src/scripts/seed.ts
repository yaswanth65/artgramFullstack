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

// Product categories and data
const productCategories = [
  'Art Supplies',
  'Canvas & Boards',
  'Brushes & Tools',
  'Paints & Colors',
  'Craft Materials',
  'Slime Kits',
  'Tufting Supplies',
  'DIY Kits',
  'Educational Materials',
  'Gift Sets'
];

const productData = [
  // Art Supplies
  {
    name: 'Professional Acrylic Paint Set',
    description: 'High-quality acrylic paints perfect for canvas work and art projects. Includes 24 vibrant colors in 75ml tubes.',
    price: 2499,
    stock: 150,
    category: 'Paints & Colors',
    media: [
      { url: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0', type: 'image' },
      { url: 'https://images.unsplash.com/photo-1578321272176-b7bbc0679853', type: 'image' }
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
    stock: 200,
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
    description: 'Professional brush set with natural and synthetic bristles. Includes flat, round, and detail brushes.',
    price: 1299,
    stock: 180,
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
    description: 'Complete slime making kit with glue, activator, colors, glitters, and mixing tools. Safe and non-toxic.',
    price: 899,
    stock: 300,
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
    description: 'Professional electric tufting gun for carpet and rug making. Adjustable pile height.',
    price: 8999,
    stock: 50,
    category: 'Tufting Supplies',
    media: [
      { url: 'https://images.unsplash.com/photo-1578321272176-b7bbc0679853', type: 'image' }
    ],
    sku: 'TUFT-GUN-001',
    weight: 2.8,
    dimensions: { length: 40, width: 15, height: 25 },
    tags: ['tufting', 'gun', 'electric', 'carpet', 'rug']
  },
  {
    name: 'Watercolor Paint Set',
    description: 'Professional watercolor set with 36 colors and brushes. Perfect for beginners and professionals.',
    price: 1799,
    stock: 120,
    category: 'Paints & Colors',
    media: [
      { url: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0', type: 'image' }
    ],
    sku: 'ART-WATER-001',
    weight: 1.5,
    dimensions: { length: 35, width: 25, height: 5 },
    tags: ['watercolor', 'paint', 'professional', 'brushes']
  },
  {
    name: 'Clay Modeling Set',
    description: 'Non-toxic clay set with modeling tools. Great for pottery and sculpture activities.',
    price: 1199,
    stock: 100,
    category: 'Craft Materials',
    media: [
      { url: 'https://images.unsplash.com/photo-1574053836461-4b6db2b4c25c', type: 'image' }
    ],
    sku: 'CRAFT-CLAY-001',
    weight: 2.0,
    dimensions: { length: 30, width: 20, height: 12 },
    tags: ['clay', 'modeling', 'pottery', 'sculpture', 'tools']
  },
  {
    name: 'Digital Drawing Tablet',
    description: 'Graphics tablet for digital art and design. Compatible with major design software.',
    price: 12999,
    stock: 30,
    category: 'Art Supplies',
    media: [
      { url: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96', type: 'image' }
    ],
    sku: 'DIGI-TAB-001',
    weight: 1.8,
    dimensions: { length: 35, width: 25, height: 2 },
    tags: ['digital', 'tablet', 'drawing', 'graphics', 'design']
  },
  {
    name: 'Yarn Bundle - Multicolor',
    description: 'Premium yarn bundle for tufting and knitting projects. 20 different colors included.',
    price: 2899,
    stock: 80,
    category: 'Tufting Supplies',
    media: [
      { url: 'https://images.unsplash.com/photo-1578321272176-b7bbc0679853', type: 'image' }
    ],
    sku: 'YARN-BUNDLE-001',
    weight: 3.5,
    dimensions: { length: 40, width: 30, height: 20 },
    tags: ['yarn', 'tufting', 'knitting', 'multicolor', 'premium']
  },
  {
    name: 'Art Storage Organizer',
    description: 'Multi-compartment organizer for art supplies. Portable and stackable design.',
    price: 1599,
    stock: 90,
    category: 'Art Supplies',
    media: [
      { url: 'https://images.unsplash.com/photo-1574053836461-4b6db2b4c25c', type: 'image' }
    ],
    sku: 'ART-STORAGE-001',
    weight: 2.2,
    dimensions: { length: 40, width: 30, height: 15 },
    tags: ['storage', 'organizer', 'art', 'supplies', 'portable']
  },
  // Additional products for variety
  {
    name: 'Glitter Slime Kit',
    description: 'Sparkly slime kit with premium glitters and special effects. Kid-safe formula.',
    price: 699,
    stock: 250,
    category: 'Slime Kits',
    media: [
      { url: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96', type: 'image' }
    ],
    sku: 'SLIME-GLITTER-001',
    weight: 0.8,
    dimensions: { length: 20, width: 15, height: 8 },
    tags: ['slime', 'glitter', 'sparkly', 'kids', 'safe']
  },
  {
    name: 'Tufting Frame - Large',
    description: 'Professional tufting frame for large projects. Adjustable tension system.',
    price: 4999,
    stock: 25,
    category: 'Tufting Supplies',
    media: [
      { url: 'https://images.unsplash.com/photo-1578321272176-b7bbc0679853', type: 'image' }
    ],
    sku: 'TUFT-FRAME-001',
    weight: 8.5,
    dimensions: { length: 100, width: 80, height: 10 },
    tags: ['tufting', 'frame', 'large', 'professional', 'adjustable']
  }
];

// Session types and times
const sessionTypes = {
  slime: [
    { type: 'Slime Play Session', ageGroup: '3+', price: 299 },
    { type: 'Slime Making Workshop', ageGroup: '8+', price: 499 },
    { type: 'Advanced Slime Techniques', ageGroup: '12+', price: 699 },
    { type: 'Parent-Child Slime Fun', ageGroup: 'All', price: 799 }
  ],
  tufting: [
    { type: 'Small Tufting Project', ageGroup: '15+', price: 1299 },
    { type: 'Medium Tufting Workshop', ageGroup: '15+', price: 1899 },
    { type: 'Large Tufting Masterclass', ageGroup: '18+', price: 2999 },
    { type: 'Tufting Basics for Beginners', ageGroup: '12+', price: 999 }
  ]
};

const sessionTimes = [
  { time: '09:00', label: '9:00 AM' },
  { time: '10:30', label: '10:30 AM' },
  { time: '12:00', label: '12:00 PM' },
  { time: '14:00', label: '2:00 PM' },
  { time: '15:30', label: '3:30 PM' },
  { time: '17:00', label: '5:00 PM' },
  { time: '18:30', label: '6:30 PM' }
];

// Helper functions
const getRandomDate = (start: Date, end: Date): string => {
  const date = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
  return date.toISOString().split('T')[0];
};

const getRandomElement = <T>(array: T[]): T => {
  return array[Math.floor(Math.random() * array.length)];
};

const getRandomInt = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

// Generate Indian phone numbers
const generatePhoneNumber = (): string => {
  const prefixes = ['9', '8', '7', '6'];
  const prefix = getRandomElement(prefixes);
  const number = prefix + Math.floor(Math.random() * 1000000000).toString().padStart(9, '0');
  return '+91' + number;
};

// Generate Indian addresses
const indianCities = [
  { city: 'Vijayawada', state: 'Andhra Pradesh', zipCodes: ['520001', '520002', '520003', '520004', '520005'] },
  { city: 'Hyderabad', state: 'Telangana', zipCodes: ['500001', '500002', '500003', '500004', '500005'] },
  { city: 'Bangalore', state: 'Karnataka', zipCodes: ['560001', '560002', '560003', '560004', '560005'] }
];

const streetNames = [
  'MG Road', 'Brigade Road', 'Commercial Street', 'Gandhi Nagar', 'Jubilee Hills',
  'Banjara Hills', 'Kondapur', 'Gachibowli', 'Hitech City', 'Banashankari',
  'Koramangala', 'Indiranagar', 'Whitefield', 'Electronic City', 'Malleswaram'
];

const generateAddress = () => {
  const cityData = getRandomElement(indianCities);
  return {
    street: `${getRandomInt(1, 999)} ${getRandomElement(streetNames)}`,
    city: cityData.city,
    state: cityData.state,
    zipCode: getRandomElement(cityData.zipCodes),
    country: 'India'
  };
};

// Names for seeding
const indianNames = [
  'Arjun Sharma', 'Priya Patel', 'Rahul Kumar', 'Sneha Reddy', 'Vikram Singh',
  'Anita Gupta', 'Ravi Chandra', 'Kavya Nair', 'Amit Agarwal', 'Deepika Joshi',
  'Suresh Rao', 'Meera Iyer', 'Kiran Verma', 'Nisha Pillai', 'Rajesh Menon',
  'Pooja Mishra', 'Sanjay Sinha', 'Rekha Bhatt', 'Manoj Tiwari', 'Sunita Das',
  'Ashok Pandey', 'Geeta Saxena', 'Harish Kapoor', 'Shanti Jain', 'Dinesh Yadav',
  'Laxmi Devi', 'Mohan Lal', 'Saroj Kumari', 'Bhushan Patil', 'Urmila Shah',
  'Prakash Desai', 'Vandana Kulkarni', 'Sachin Joshi', 'Madhuri Shetty', 'Nitin Gowda',
  'Pushpa Hegde', 'Raman Nambiar', 'Shobha Krishnan', 'Govind Rao', 'Kamala Devi'
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
      phone: '+919876543210',
      address: generateAddress()
    });
    await adminUser.save();

    // Create branch managers
  const managers: any[] = [];
    for (let i = 0; i < branches.length; i++) {
      const manager = new User({
        name: `${branches[i].name} Manager`,
        email: `manager${i + 1}@artgram.com`,
        password: hashedPassword,
        role: 'branch_manager',
        branchId: branches[i]._id,
        phone: generatePhoneNumber(),
        address: generateAddress()
      });
      await manager.save();
      managers.push(manager);
      
      // Update branch with manager ID
      await Branch.findByIdAndUpdate(branches[i]._id, { managerId: manager._id });
    }

    console.log('Creating customers...');
    // 3. Create customers (20 per branch)
  const customers: any[] = [];
    for (let branchIndex = 0; branchIndex < branches.length; branchIndex++) {
      for (let i = 0; i < 20; i++) {
        const customer = new User({
          name: getRandomElement(indianNames),
          email: `customer${branchIndex * 20 + i + 1}@example.com`,
          password: hashedPassword,
          role: 'customer',
          branchId: branches[branchIndex]._id,
          phone: generatePhoneNumber(),
          address: generateAddress(),
          cart: [] // Initialize empty cart
        });
        await customer.save();
        customers.push(customer);
      }
    }

    console.log('Creating products...');
    // 4. Create products
  const products = await Product.insertMany(productData);
    console.log(`Created ${products.length} products`);

    console.log('Creating sessions...');
    // 5. Create sessions for next 30 days for each branch
  const sessions: any[] = [];
    const today = new Date();
    const endDate = new Date(today.getTime() + (30 * 24 * 60 * 60 * 1000)); // 30 days from now

    for (let branch of branches) {
      for (let d = new Date(today); d <= endDate; d.setDate(d.getDate() + 1)) {
        const dateStr = d.toISOString().split('T')[0];
        
        // Create slime sessions (3-4 per day)
        const slimeSessionCount = getRandomInt(3, 4);
        for (let i = 0; i < slimeSessionCount; i++) {
          const timeSlot = getRandomElement(sessionTimes);
          const sessionType = getRandomElement(sessionTypes.slime);
          const totalSeats = getRandomInt(8, 15);
          const bookedSeats = getRandomInt(0, Math.floor(totalSeats * 0.7));
          
          const session = new Session({
            branchId: branch._id,
            date: dateStr,
            activity: 'slime',
            time: timeSlot.time,
            label: timeSlot.label,
            totalSeats,
            bookedSeats,
            availableSeats: totalSeats - bookedSeats,
            type: sessionType.type,
            ageGroup: sessionType.ageGroup,
            price: sessionType.price,
            isActive: true,
            createdBy: managers.find(m => m.branchId?.toString() === branch._id.toString())?._id,
            notes: `${sessionType.type} session for ${sessionType.ageGroup} age group`
          });
          await session.save();
          sessions.push(session);
        }
        
        // Create tufting sessions (2-3 per day)
        const tuftingSessionCount = getRandomInt(2, 3);
        for (let i = 0; i < tuftingSessionCount; i++) {
          const timeSlot = getRandomElement(sessionTimes);
          const sessionType = getRandomElement(sessionTypes.tufting);
          const totalSeats = getRandomInt(6, 10); // Smaller groups for tufting
          const bookedSeats = getRandomInt(0, Math.floor(totalSeats * 0.6));
          
          const session = new Session({
            branchId: branch._id,
            date: dateStr,
            activity: 'tufting',
            time: timeSlot.time,
            label: timeSlot.label,
            totalSeats,
            bookedSeats,
            availableSeats: totalSeats - bookedSeats,
            type: sessionType.type,
            ageGroup: sessionType.ageGroup,
            price: sessionType.price,
            isActive: true,
            createdBy: managers.find(m => m.branchId?.toString() === branch._id.toString())?._id,
            notes: `${sessionType.type} workshop for ${sessionType.ageGroup} age group`
          });
          await session.save();
          sessions.push(session);
        }
      }
    }

    console.log('Creating bookings...');
    // 6. Create bookings for sessions with booked seats
  const bookings: any[] = [];
    for (let session of sessions) {
      if (session.bookedSeats > 0) {
        // Create multiple bookings for this session
        const bookingCount = getRandomInt(1, Math.min(3, session.bookedSeats));
        let totalBookedSeats = 0;
        
        for (let i = 0; i < bookingCount && totalBookedSeats < session.bookedSeats; i++) {
          const seatsToBook = Math.min(
            getRandomInt(1, 3),
            session.bookedSeats - totalBookedSeats
          );
          totalBookedSeats += seatsToBook;
          
          const customer = getRandomElement(
            customers.filter(c => c.branchId?.toString() === session.branchId.toString())
          );
          
          const booking = new Booking({
            sessionId: session._id,
            activity: session.activity,
            branchId: session.branchId,
            customerId: customer._id,
            customerName: customer.name,
            customerEmail: customer.email,
            customerPhone: customer.phone,
            date: session.date,
            time: session.time,
            seats: seatsToBook,
            totalAmount: (session.price || 0) * seatsToBook,
            paymentStatus: getRandomElement(['completed', 'pending', 'completed', 'completed']), // 75% completed
            paymentIntentId: `pi_${uuidv4().replace(/-/g, '').substring(0, 24)}`,
            qrCode: uuidv4(),
            qrCodeData: JSON.stringify({
              bookingId: 'temp_id',
              sessionId: session._id,
              customerName: customer.name,
              seats: seatsToBook
            }),
            isVerified: Math.random() > 0.3, // 70% verified
            verifiedAt: Math.random() > 0.3 ? new Date() : undefined,
            verifiedBy: Math.random() > 0.3 ? managers.find(m => m.branchId?.toString() === session.branchId.toString())?._id : undefined,
            packageType: getRandomElement(['base', 'premium', 'deluxe']),
            specialRequests: Math.random() > 0.7 ? 'Please arrange birthday decoration' : undefined,
            status: getRandomElement(['active', 'completed', 'active', 'active']) // 75% active
          });
          
          await booking.save();
          bookings.push(booking);
        }
      }
    }

    console.log('Creating orders...');
    // 7. Create orders with products
  const orders: any[] = [];
    for (let i = 0; i < 100; i++) { // Create 100 orders across all branches
      const customer = getRandomElement(customers);
      const branch = branches.find(b => b._id.toString() === customer.branchId?.toString());
      
      // Select 1-4 random products for this order
      const orderProducts = [];
      const productCount = getRandomInt(1, 4);
  const selectedProducts: string[] = [];
      
      for (let j = 0; j < productCount; j++) {
        let product;
        do {
          product = getRandomElement(products);
        } while (selectedProducts.includes(product._id.toString()));
        
        selectedProducts.push(product._id.toString());
        const quantity = getRandomInt(1, 3);
        
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
        branchId: branch?._id?.toString(),
        customerId: customer._id?.toString(),
        customerName: customer.name,
        customerEmail: customer.email,
        customerPhone: customer.phone,
        shippingAddress: customer.address,
        trackingUpdates: [
          {
            status: 'Order Placed',
            location: branch?.location,
            description: 'Your order has been placed successfully',
            createdAt: new Date(Date.now() - getRandomInt(1, 10) * 24 * 60 * 60 * 1000)
          }
        ],
        paymentStatus: getRandomElement(['completed', 'pending', 'completed', 'completed']), // 75% completed
        orderStatus: getRandomElement([
          'payment_confirmed', 'processing', 'packed', 'shipped', 'in_transit', 'delivered'
        ]),
        paymentIntentId: `pi_${uuidv4().replace(/-/g, '').substring(0, 24)}`,
        trackingNumber: `TRK${Date.now()}${getRandomInt(100, 999)}`
      });
      
      await order.save();
      orders.push(order);
      
      // Add some tracking updates for shipped orders
      if (['shipped', 'in_transit', 'delivered'].includes(order.orderStatus)) {
        const updates = [
          {
            status: 'Packed',
            location: branch?.location,
            description: 'Your order has been packed and ready for shipping'
          },
          {
            status: 'Shipped',
            location: branch?.location,
            description: 'Your order has been shipped'
          }
        ];
        
        if (order.orderStatus === 'delivered') {
          updates.push({
            status: 'Delivered',
            location: customer.address?.city || 'Customer Location',
            description: 'Your order has been delivered successfully'
          });
        }
        
        order.trackingUpdates.push(...updates);
        await order.save();
      }
    }

    console.log('Adding products to customer carts...');
    // 8. Add some products to customer carts
    for (let customer of customers.slice(0, 30)) { // Add to 30 customers' carts
      const cartItems = [];
      const itemCount = getRandomInt(1, 3);
      
      for (let i = 0; i < itemCount; i++) {
        const product = getRandomElement(products);
        cartItems.push({
          productId: product._id.toString(),
          title: product.name,
          price: product.price,
          qty: getRandomInt(1, 2),
          image: product.media?.[0]?.url || ''
        });
      }
      
      customer.cart = cartItems;
      await customer.save();
    }

    // Print summary
    console.log('\n🎉 Seed data created successfully!');
    console.log('='.repeat(50));
    console.log(`📍 Branches: ${branches.length}`);
    console.log(`👥 Users: ${customers.length + managers.length + 1} (1 admin, ${managers.length} managers, ${customers.length} customers)`);
    console.log(`🛍️  Products: ${products.length}`);
    console.log(`📅 Sessions: ${sessions.length}`);
    console.log(`🎫 Bookings: ${bookings.length}`);
    console.log(`📦 Orders: ${orders.length}`);
    console.log('='.repeat(50));
    
    console.log('\n📧 Login Credentials:');
    console.log('Admin: admin@artgram.com / password123');
    console.log('Managers:');
    managers.forEach((manager, index) => {
      console.log(`  ${manager.email} / password123`);
    });
    console.log('Customers: customer1@example.com to customer60@example.com / password123');
    
    console.log('\n🏢 Branch Information:');
    branches.forEach((branch, index) => {
      const branchCustomers = customers.filter(c => c.branchId?.toString() === branch._id.toString());
      const branchSessions = sessions.filter(s => s.branchId.toString() === branch._id.toString());
      const branchBookings = bookings.filter(b => b.branchId?.toString() === branch._id.toString());
      const branchOrders = orders.filter(o => o.branchId === branch._id.toString());
      
      console.log(`\n${branch.name} (${branch.location}):`);
      console.log(`  👥 Customers: ${branchCustomers.length}`);
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
