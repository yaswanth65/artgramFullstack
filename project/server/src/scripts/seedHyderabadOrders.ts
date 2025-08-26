import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Order from '../models/Order';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || '';
const HYDERABAD_BRANCH_ID = '68adcc1ff2f6cbbd8802c518';

const seed = async () => {
  if (!MONGO_URI) {
    console.error('MONGO_URI not set in environment');
    process.exit(1);
  }

  await mongoose.connect(MONGO_URI);
  console.log('Connected to MongoDB for seeding Hyderabad orders');

  // Create two sample orders for the Hyderabad branch
  const orders = [
    {
      products: [
        { productId: '68adcc22f2f6cbbd8802c52f', name: 'Craft Kit', quantity: 1, price: 25 }
      ],
      totalAmount: 25,
      branchId: HYDERABAD_BRANCH_ID,
      customerId: new mongoose.Types.ObjectId().toString(),
      customerName: 'Seeded Customer 1',
      customerEmail: 'seed1@example.com',
      customerPhone: '+919000000001',
      shippingAddress: {
        street: '123 Street',
        city: 'Hyderabad',
        state: 'Telangana',
        zipCode: '500001',
        country: 'India'
      },
      paymentStatus: 'completed',
      orderStatus: 'delivered',
      trackingUpdates: []
    },
    {
      products: [
        { productId: '68adcc22f2f6cbbd8802c530', name: 'Slime Kit', quantity: 2, price: 50 }
      ],
      totalAmount: 100,
      branchId: HYDERABAD_BRANCH_ID,
      customerId: new mongoose.Types.ObjectId().toString(),
      customerName: 'Seeded Customer 2',
      customerEmail: 'seed2@example.com',
      customerPhone: '+919000000002',
      shippingAddress: {
        street: '45 Another St',
        city: 'Hyderabad',
        state: 'Telangana',
        zipCode: '500002',
        country: 'India'
      },
      paymentStatus: 'completed',
      orderStatus: 'shipped',
      trackingUpdates: []
    }
  ];

  try {
    const inserted = await Order.insertMany(orders);
    console.log(`Inserted ${inserted.length} Hyderabad orders`);
  } catch (err) {
    console.error('Error inserting orders:', err);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
    process.exit(0);
  }
};

seed();
