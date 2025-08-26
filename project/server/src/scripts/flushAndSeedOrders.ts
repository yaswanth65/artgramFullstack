import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Order from '../models/Order';
import User from '../models/User';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || '';
const HYDERABAD_BRANCH_ID = '68adcc1ff2f6cbbd8802c518';

const run = async () => {
  if (!MONGO_URI) {
    console.error('MONGO_URI not set');
    process.exit(1);
  }
  
  await mongoose.connect(MONGO_URI);
  console.log('Connected to MongoDB');

  // Clear all existing orders
  await Order.deleteMany({});
  console.log('Cleared all existing orders');

  // Get some user IDs for customers
  const users = await User.find({ role: 'customer' }).limit(3).lean();
  const customers = users.length > 0 ? users : [
    { _id: new mongoose.Types.ObjectId(), name: 'Test Customer 1', email: 'test1@example.com' },
    { _id: new mongoose.Types.ObjectId(), name: 'Test Customer 2', email: 'test2@example.com' }
  ];

  // Create fresh orders for Hyderabad branch
  const hyderabadOrders = [
    {
      products: [
        { productId: '68adcc22f2f6cbbd8802c52f', name: 'Craft Kit', quantity: 1, price: 25 }
      ],
      totalAmount: 25,
      branchId: HYDERABAD_BRANCH_ID,
      customerId: customers[0]._id.toString(),
      customerName: customers[0].name || 'Customer 1',
      customerEmail: customers[0].email || 'customer1@example.com',
      customerPhone: '+919000000001',
      shippingAddress: {
        street: '123 Test Street',
        city: 'Hyderabad',
        state: 'Telangana',
        zipCode: '500001',
        country: 'India'
      },
      paymentStatus: 'completed',
      orderStatus: 'processing',
      trackingUpdates: [
        {
          status: 'Order Placed',
          description: 'Your order has been placed successfully',
          createdAt: new Date()
        }
      ]
    },
    {
      products: [
        { productId: '68adcc22f2f6cbbd8802c530', name: 'Slime Kit', quantity: 2, price: 50 },
        { productId: '68adcc22f2f6cbbd8802c531', name: 'Art Supplies', quantity: 1, price: 30 }
      ],
      totalAmount: 130,
      branchId: HYDERABAD_BRANCH_ID,
      customerId: customers[1] ? customers[1]._id.toString() : new mongoose.Types.ObjectId().toString(),
      customerName: customers[1]?.name || 'Customer 2',
      customerEmail: customers[1]?.email || 'customer2@example.com',
      customerPhone: '+919000000002',
      shippingAddress: {
        street: '456 Another Street',
        city: 'Hyderabad',
        state: 'Telangana',
        zipCode: '500002',
        country: 'India'
      },
      paymentStatus: 'completed',
      orderStatus: 'shipped',
      trackingNumber: 'HYD123456',
      trackingUpdates: [
        {
          status: 'Order Placed',
          description: 'Your order has been placed successfully',
          createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) // 2 days ago
        },
        {
          status: 'Shipped',
          location: 'Hyderabad Warehouse',
          description: 'Your order has been shipped',
          createdAt: new Date()
        }
      ]
    },
    {
      products: [
        { productId: '68adcc22f2f6cbbd8802c532', name: 'Premium Kit', quantity: 1, price: 100 }
      ],
      totalAmount: 100,
      branchId: HYDERABAD_BRANCH_ID,
      customerId: customers[2] ? customers[2]._id.toString() : new mongoose.Types.ObjectId().toString(),
      customerName: customers[2]?.name || 'Customer 3',
      customerEmail: customers[2]?.email || 'customer3@example.com',
      customerPhone: '+919000000003',
      shippingAddress: {
        street: '789 Third Street',
        city: 'Hyderabad',
        state: 'Telangana',
        zipCode: '500003',
        country: 'India'
      },
      paymentStatus: 'completed',
      orderStatus: 'delivered',
      trackingNumber: 'HYD789012',
      trackingUpdates: [
        {
          status: 'Order Placed',
          description: 'Your order has been placed successfully',
          createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000) // 5 days ago
        },
        {
          status: 'Delivered',
          location: 'Hyderabad',
          description: 'Your order has been delivered successfully',
          createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000) // 1 day ago
        }
      ]
    }
  ];

  // Create some orders for other branches too (for testing)
  const otherBranchOrders = [
    {
      products: [
        { productId: '68adcc22f2f6cbbd8802c533', name: 'Test Product', quantity: 1, price: 40 }
      ],
      totalAmount: 40,
      branchId: '68adcc1ff2f6cbbd8802c519', // Different branch
      customerId: new mongoose.Types.ObjectId().toString(),
      customerName: 'Other Branch Customer',
      customerEmail: 'other@example.com',
      customerPhone: '+919000000004',
      shippingAddress: {
        street: '999 Other Street',
        city: 'Bangalore',
        state: 'Karnataka',
        zipCode: '560001',
        country: 'India'
      },
      paymentStatus: 'completed',
      orderStatus: 'pending',
      trackingUpdates: []
    }
  ];

  // Insert all orders
  const allOrders = [...hyderabadOrders, ...otherBranchOrders];
  const insertedOrders = await Order.insertMany(allOrders);
  
  console.log(`\n=== ORDERS CREATED ===`);
  console.log(`Total orders inserted: ${insertedOrders.length}`);
  console.log(`Hyderabad branch orders: ${hyderabadOrders.length}`);
  console.log(`Other branch orders: ${otherBranchOrders.length}`);
  
  console.log(`\n=== HYDERABAD ORDERS SUMMARY ===`);
  hyderabadOrders.forEach((order, i) => {
    console.log(`Order ${i + 1}: ${order.customerName} - $${order.totalAmount} - ${order.orderStatus}`);
  });
  
  console.log(`\n=== VERIFICATION ===`);
  const hyderabadCount = await Order.countDocuments({ branchId: HYDERABAD_BRANCH_ID });
  console.log(`Orders in database for Hyderabad branch: ${hyderabadCount}`);

  await mongoose.disconnect();
  console.log('\nDisconnected from MongoDB');
  process.exit(0);
};

run().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
