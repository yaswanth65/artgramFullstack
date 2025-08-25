import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import User from '../models/User';
import Branch from '../models/Branch';
import Product from '../models/Product';
import Booking from '../models/Booking';
import Order from '../models/Order';
import Session from '../models/Session';

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
    await Session.deleteMany({});
    console.log('Cleared existing data');
    
    // Create branches first
    const branches = [
      {
        _id: new mongoose.Types.ObjectId(),
        name: 'Craft Factory Hyderabad',
        location: 'Hyderabad',
        managerId: null, // Will be set after creating managers
        razorpayKey: 'rzp_test_hyderabad_key'
      },
      {
        _id: new mongoose.Types.ObjectId(),
        name: 'Craft Factory Vijayawada',
        location: 'Vijayawada',
        managerId: null, // Will be set after creating managers
        razorpayKey: 'rzp_test_vijayawada_key'
      },
      {
        _id: new mongoose.Types.ObjectId(),
        name: 'Craft Factory Bangalore',
        location: 'Bangalore',
        managerId: null, // Will be set after creating managers
        razorpayKey: 'rzp_test_bangalore_key'
      }
    ];

    const savedBranches = await Branch.insertMany(branches);
    console.log('Branches created successfully');

    // Create users (admin, 3 managers, multiple customers)
    const users = [
      // Admin
      {
        name: 'Admin User',
        email: 'admin@craftfactory.com',
        password: await bcrypt.hash('password', 10),
        role: 'admin',
        phone: '+91 99999 99999'
      },
      // Branch Managers
      {
        name: 'Rajesh Kumar',
        email: 'hyderabad@craftfactory.com',
        password: await bcrypt.hash('password', 10),
        role: 'branch_manager',
        branchId: savedBranches[0]._id.toString(),
        phone: '+91 98765 11111',
        address: {
          street: 'Hi-Tech City Road',
          city: 'Hyderabad',
          state: 'Telangana',
          zipCode: '500081',
          country: 'India'
        }
      },
      {
        name: 'Priya Sharma',
        email: 'vijayawada@craftfactory.com',
        password: await bcrypt.hash('password', 10),
        role: 'branch_manager',
        branchId: savedBranches[1]._id.toString(),
        phone: '+91 98765 22222',
        address: {
          street: 'Gandhi Road',
          city: 'Vijayawada',
          state: 'Andhra Pradesh',
          zipCode: '520001',
          country: 'India'
        }
      },
      {
        name: 'Arjun Nair',
        email: 'bangalore@craftfactory.com',
        password: await bcrypt.hash('password', 10),
        role: 'branch_manager',
        branchId: savedBranches[2]._id.toString(),
        phone: '+91 98765 33333',
        address: {
          street: 'Koramangala',
          city: 'Bangalore',
          state: 'Karnataka',
          zipCode: '560038',
          country: 'India'
        }
      },
      // Customers
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
      },
      {
        name: 'Anita Patel',
        email: 'anita@example.com',
        password: await bcrypt.hash('password', 10),
        role: 'customer',
        phone: '+91 98765 43213',
        address: {
          street: '15 Jubilee Hills',
          city: 'Hyderabad',
          state: 'Telangana',
          zipCode: '500033',
          country: 'India'
        }
      },
      {
        name: 'Rohit Gupta',
        email: 'rohit@example.com',
        password: await bcrypt.hash('password', 10),
        role: 'customer',
        phone: '+91 98765 43214',
        address: {
          street: '28 Benz Circle',
          city: 'Vijayawada',
          state: 'Andhra Pradesh',
          zipCode: '520010',
          country: 'India'
        }
      }
    ];
    
    const savedUsers = await User.insertMany(users);
    console.log('Users created successfully');

    // Update branches with manager IDs
    await Branch.findByIdAndUpdate(savedBranches[0]._id, { managerId: savedUsers[1]._id.toString() });
    await Branch.findByIdAndUpdate(savedBranches[1]._id, { managerId: savedUsers[2]._id.toString() });
    await Branch.findByIdAndUpdate(savedBranches[2]._id, { managerId: savedUsers[3]._id.toString() });
    console.log('Branch managers assigned successfully');

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

    const savedProducts = await Product.insertMany(products);
    console.log('Products created successfully');

    // Create sessions for each branch (use branch _id strings)
    const sessionTemplates = [
      { activity: 'slime', time: '10:00', label: '10:00 AM', totalSeats: 18, bookedSeats: 3, type: 'Slime Play & Demo', ageGroup: '3+' },
      { activity: 'slime', time: '13:00', label: '1:00 PM', totalSeats: 18, bookedSeats: 8, type: 'Slime Play & Making', ageGroup: '8+' },
      { activity: 'tufting', time: '11:00', label: '11:00 AM', totalSeats: 8, bookedSeats: 1, type: 'Small Tufting', ageGroup: '15+' }
    ];

    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    const dayAfter = new Date(today);
    dayAfter.setDate(today.getDate() + 2);

    const dates = [tomorrow.toISOString().split('T')[0], dayAfter.toISOString().split('T')[0]];
    const sessionsToCreate: any[] = [];

    for (const branch of savedBranches) {
      for (const dt of dates) {
        for (const tmpl of sessionTemplates) {
          sessionsToCreate.push({
            branchId: branch._id.toString(),
            date: dt,
            activity: tmpl.activity,
            time: tmpl.time,
            label: tmpl.label,
            totalSeats: tmpl.totalSeats,
            bookedSeats: tmpl.bookedSeats,
            availableSeats: Math.max(0, tmpl.totalSeats - tmpl.bookedSeats),
            type: tmpl.type,
            ageGroup: tmpl.ageGroup,
            price: tmpl.activity === 'slime' ? 300 : 800,
            isActive: true,
            createdBy: 'seed-script'
          });
        }
      }
    }

    const savedSessions = await Session.insertMany(sessionsToCreate);
    console.log(`Created ${savedSessions.length} sessions`);

    // Create sample bookings with proper session references
    const bookings: any[] = [];
    
    // Get some sessions for creating bookings
    const hyderabadSlimeSession = savedSessions.find(s => 
      s.branchId === savedBranches[0]._id.toString() && s.activity === 'slime'
    );
    const vijayawadaTuftingSession = savedSessions.find(s => 
      s.branchId === savedBranches[1]._id.toString() && s.activity === 'tufting'
    );
    const bangaloreSlimeSession = savedSessions.find(s => 
      s.branchId === savedBranches[2]._id.toString() && s.activity === 'slime'
    );

    if (hyderabadSlimeSession) {
      bookings.push({
        sessionId: hyderabadSlimeSession._id.toString(),
        activity: hyderabadSlimeSession.activity,
        branchId: hyderabadSlimeSession.branchId,
        customerId: savedUsers[4]._id.toString(), // John Doe
        customerName: 'John Doe',
        customerEmail: 'customer@example.com',
        customerPhone: '+91 98765 43210',
        date: hyderabadSlimeSession.date,
        time: hyderabadSlimeSession.time,
        seats: 2,
        totalAmount: (hyderabadSlimeSession.price || 300) * 2,
        paymentStatus: 'completed',
        packageType: 'base',
        qrCodeData: `QR-${Date.now()}-1`,
        status: 'active',
        isVerified: false
      });
    }

    if (vijayawadaTuftingSession) {
      bookings.push({
        sessionId: vijayawadaTuftingSession._id.toString(),
        activity: vijayawadaTuftingSession.activity,
        branchId: vijayawadaTuftingSession.branchId,
        customerId: savedUsers[5]._id.toString(), // Jane Smith
        customerName: 'Jane Smith',
        customerEmail: 'jane@example.com',
        customerPhone: '+91 98765 43211',
        date: vijayawadaTuftingSession.date,
        time: vijayawadaTuftingSession.time,
        seats: 1,
        totalAmount: (vijayawadaTuftingSession.price || 800) * 1,
        paymentStatus: 'completed',
        packageType: 'premium',
        qrCodeData: `QR-${Date.now()}-2`,
        status: 'active',
        isVerified: true,
        verifiedAt: new Date(),
        verifiedBy: savedUsers[2]._id.toString() // Priya Sharma
      });
    }

    if (bangaloreSlimeSession) {
      bookings.push({
        sessionId: bangaloreSlimeSession._id.toString(),
        activity: bangaloreSlimeSession.activity,
        branchId: bangaloreSlimeSession.branchId,
        customerId: savedUsers[6]._id.toString(), // Mike Johnson
        customerName: 'Mike Johnson',
        customerEmail: 'mike@example.com',
        customerPhone: '+91 98765 43212',
        date: bangaloreSlimeSession.date,
        time: bangaloreSlimeSession.time,
        seats: 3,
        totalAmount: (bangaloreSlimeSession.price || 300) * 3,
        paymentStatus: 'pending',
        packageType: 'base',
        qrCodeData: `QR-${Date.now()}-3`,
        status: 'active',
        isVerified: false,
        specialRequests: 'Birthday party for 8-year-old'
      });
    }

    // Add more bookings for other customers
    const additionalSessions = savedSessions.slice(0, 3);
    
    if (additionalSessions.length > 0) {
      bookings.push({
        sessionId: additionalSessions[0]._id.toString(),
        activity: additionalSessions[0].activity,
        branchId: additionalSessions[0].branchId,
        customerId: savedUsers[7]._id.toString(), // Anita Patel
        customerName: 'Anita Patel',
        customerEmail: 'anita@example.com',
        customerPhone: '+91 98765 43213',
        date: additionalSessions[0].date,
        time: additionalSessions[0].time,
        seats: 1,
        totalAmount: (additionalSessions[0].price || 300) * 1,
        paymentStatus: 'completed',
        packageType: 'base',
        qrCodeData: `QR-${Date.now()}-4`,
        status: 'completed',
        isVerified: true,
        verifiedAt: new Date(Date.now() - 86400000) // Yesterday
      });
    }

    if (additionalSessions.length > 1) {
      bookings.push({
        sessionId: additionalSessions[1]._id.toString(),
        activity: additionalSessions[1].activity,
        branchId: additionalSessions[1].branchId,
        customerId: savedUsers[8]._id.toString(), // Rohit Gupta
        customerName: 'Rohit Gupta',
        customerEmail: 'rohit@example.com',
        customerPhone: '+91 98765 43214',
        date: additionalSessions[1].date,
        time: additionalSessions[1].time,
        seats: 2,
        totalAmount: (additionalSessions[1].price || 300) * 2,
        paymentStatus: 'failed',
        packageType: 'base',
        qrCodeData: `QR-${Date.now()}-5`,
        status: 'cancelled',
        isVerified: false
      });
    }

    await Booking.insertMany(bookings);
    console.log('Bookings created successfully');

    // Create sample orders (products bought)
    const orders: any[] = [];
    if (savedProducts.length > 0) {
      orders.push({
        products: [
          { productId: savedProducts[0]._id.toString(), quantity: 1, price: savedProducts[0].price, name: savedProducts[0].name }
        ],
        totalAmount: savedProducts[0].price,
        branchId: savedBranches[0]._id.toString(),
        customerId: savedUsers[4]._id.toString(),
        customerName: 'John Doe',
        customerEmail: 'customer@example.com',
        customerPhone: '+91 98765 43210',
        shippingAddress: {
          street: '12 MG Road', 
          city: 'Hyderabad', 
          state: 'Telangana', 
          zipCode: '500081', 
          country: 'India'
        },
        paymentStatus: 'completed',
        orderStatus: 'delivered',
        trackingNumber: `TRK-${Date.now()}`,
        trackingUpdates: [
          {
            status: 'Order Placed',
            description: 'Your order has been placed successfully',
            createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) // 3 days ago
          },
          {
            status: 'Processing',
            description: 'Your order is being processed',
            createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) // 2 days ago
          },
          {
            status: 'Shipped',
            location: 'Hyderabad Warehouse',
            description: 'Your order has been shipped',
            createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000) // 1 day ago
          },
          {
            status: 'Delivered',
            location: 'Hyderabad',
            description: 'Your order has been delivered successfully',
            createdAt: new Date()
          }
        ]
      });

      // Multi-product order for another customer
      if (savedProducts.length > 2) {
        orders.push({
          products: [
            { productId: savedProducts[2]._id.toString(), quantity: 1, price: savedProducts[2].price, name: savedProducts[2].name },
            { productId: savedProducts[3]._id.toString(), quantity: 2, price: savedProducts[3].price, name: savedProducts[3].name }
          ],
          totalAmount: (savedProducts[2].price || 0) + 2 * (savedProducts[3].price || 0),
          branchId: savedBranches[1]._id.toString(),
          customerId: savedUsers[5]._id.toString(),
          customerName: 'Jane Smith',
          customerEmail: 'jane@example.com',
          customerPhone: '+91 98765 43211',
          shippingAddress: {
            street: '24 Gandhi Road',
            city: 'Vijayawada',
            state: 'Andhra Pradesh',
            zipCode: '520001',
            country: 'India'
          },
          paymentStatus: 'completed',
          orderStatus: 'shipped',
          trackingNumber: `TRK-${Date.now()}-2`,
          trackingUpdates: [
            {
              status: 'Order Placed',
              description: 'Your order has been placed successfully',
              createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) // 2 days ago
            },
            {
              status: 'Processing',
              description: 'Your order is being processed',
              createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000) // 1 day ago
            },
            {
              status: 'Shipped',
              location: 'Vijayawada Warehouse',
              description: 'Your order has been shipped',
              createdAt: new Date()
            }
          ]
        });
      }

      // Add a pending order
      if (savedProducts.length > 4) {
        orders.push({
          products: [
            { productId: savedProducts[4]._id.toString(), quantity: 3, price: savedProducts[4].price, name: savedProducts[4].name }
          ],
          totalAmount: savedProducts[4].price * 3,
          branchId: savedBranches[2]._id.toString(),
          customerId: savedUsers[6]._id.toString(),
          customerName: 'Mike Johnson',
          customerEmail: 'mike@example.com',
          customerPhone: '+91 98765 43212',
          shippingAddress: {
            street: '36 Indiranagar',
            city: 'Bangalore',
            state: 'Karnataka',
            zipCode: '560038',
            country: 'India'
          },
          paymentStatus: 'pending',
          orderStatus: 'pending',
          trackingUpdates: [
            {
              status: 'Order Placed',
              description: 'Your order has been placed and is awaiting payment',
              createdAt: new Date()
            }
          ]
        });
      }
    }

    if (orders.length > 0) {
      await Order.insertMany(orders);
      console.log('Orders created successfully');
    }

    console.log('\n=== SEED DATA SUMMARY ===');
    console.log(`✅ Created ${savedBranches.length} branches`);
    console.log(`✅ Created ${savedUsers.length} users`);
    console.log(`✅ Created ${savedProducts.length} products`);
    console.log(`✅ Created ${savedSessions.length} sessions`);
    console.log(`✅ Created ${bookings.length} bookings`);
    console.log(`✅ Created ${orders.length} orders`);
    console.log('\n=== BRANCH DETAILS ===');
    savedBranches.forEach(branch => {
      const branchProducts = savedProducts.filter(p => p.branchId === branch._id.toString());
      console.log(`📍 ${branch.name} (${branch.location}): ${branchProducts.length} products`);
    });
    console.log('\n=== LOGIN CREDENTIALS ===');
    console.log('Admin: admin@craftfactory.com / password');
    console.log('Hyderabad Manager: hyderabad@craftfactory.com / password');
    console.log('Vijayawada Manager: vijayawada@craftfactory.com / password');
    console.log('Bangalore Manager: bangalore@craftfactory.com / password');
    console.log('Customer: customer@example.com / password');
    console.log('Jane: jane@example.com / password');
    console.log('Mike: mike@example.com / password');
    console.log('Anita: anita@example.com / password');
    console.log('Rohit: rohit@example.com / password');
    
    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedData();
