import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User';
import Order from '../models/Order';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || '';
const HYDERABAD_BRANCH_ID = '68adcc1ff2f6cbbd8802c518';
const HYDERABAD_MANAGER_EMAIL = 'hyderabad@craftfactory.com';

const run = async () => {
  if (!MONGO_URI) {
    console.error('MONGO_URI not set');
    process.exit(1);
  }
  await mongoose.connect(MONGO_URI);
  console.log('Connected to MongoDB');

  const user = await User.findOne({ email: HYDERABAD_MANAGER_EMAIL }).lean();
  console.log('\n=== Hyderabad Manager ===');
  console.log(user || 'Manager not found');

  const orders = await Order.find({ branchId: HYDERABAD_BRANCH_ID }).lean();
  console.log(`\n=== Orders for branch ${HYDERABAD_BRANCH_ID} (count: ${orders.length}) ===`);
  orders.slice(0, 10).forEach((o, i) => {
    console.log(`Order ${i + 1}: id=${o._id}, customer=${o.customerEmail || o.customerName}, total=${o.totalAmount}, branchId=${o.branchId}`);
  });

  await mongoose.disconnect();
  process.exit(0);
};

run().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
