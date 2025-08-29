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

async function verifyData() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/artgram');
    console.log('Connected to MongoDB');

    console.log('🔍 Verifying Database Data...');
    console.log('='.repeat(60));

    // Get all collections data
    const branches = await Branch.find({});
    const users = await User.find({});
    const products = await Product.find({});
    const sessions = await Session.find({});
    const bookings = await Booking.find({});
    const orders = await Order.find({});

    // Basic counts
    console.log('📊 BASIC COUNTS:');
    console.log(`Branches: ${branches.length}`);
    console.log(`Users: ${users.length}`);
    console.log(`Products: ${products.length}`);
    console.log(`Sessions: ${sessions.length}`);
    console.log(`Bookings: ${bookings.length}`);
    console.log(`Orders: ${orders.length}`);
    console.log('');

    // User role breakdown
    const usersByRole = users.reduce((acc: any, user) => {
      acc[user.role] = (acc[user.role] || 0) + 1;
      return acc;
    }, {});
    
    console.log('👥 USER BREAKDOWN:');
    Object.entries(usersByRole).forEach(([role, count]) => {
      console.log(`${role}: ${count}`);
    });
    console.log('');

    // Branch-wise data verification
    console.log('🏢 BRANCH-WISE ANALYSIS:');
    for (const branch of branches) {
      console.log(`\n${branch.name} (${branch.location}):`);
      
      // Users in this branch
      const branchUsers = users.filter(u => u.branchId?.toString() === branch._id.toString());
      const managers = branchUsers.filter(u => u.role === 'branch_manager');
      const customers = branchUsers.filter(u => u.role === 'customer');
      
      console.log(`  👥 Users: ${branchUsers.length} (${managers.length} managers, ${customers.length} customers)`);
      
      // Sessions in this branch
      const branchSessions = sessions.filter(s => s.branchId.toString() === branch._id.toString());
      const slimeSessions = branchSessions.filter(s => s.activity === 'slime');
      const tuftingSessions = branchSessions.filter(s => s.activity === 'tufting');
      
      console.log(`  📅 Sessions: ${branchSessions.length} (${slimeSessions.length} slime, ${tuftingSessions.length} tufting)`);
      
      // Bookings in this branch
      const branchBookings = bookings.filter(b => b.branchId?.toString() === branch._id.toString());
      const completedBookings = branchBookings.filter(b => b.paymentStatus === 'completed');
      const verifiedBookings = branchBookings.filter(b => b.isVerified);
      
      console.log(`  🎫 Bookings: ${branchBookings.length} (${completedBookings.length} paid, ${verifiedBookings.length} verified)`);
      
      // Orders in this branch
      const branchOrders = orders.filter(o => o.branchId === branch._id.toString());
      const completedOrders = branchOrders.filter(o => o.paymentStatus === 'completed');
      
      console.log(`  📦 Orders: ${branchOrders.length} (${completedOrders.length} paid)`);
      
      // Total revenue calculations
      const bookingRevenue = branchBookings
        .filter(b => b.paymentStatus === 'completed')
        .reduce((sum, b) => sum + (b.totalAmount || 0), 0);
      
      const orderRevenue = branchOrders
        .filter(o => o.paymentStatus === 'completed')
        .reduce((sum, o) => sum + o.totalAmount, 0);
      
      console.log(`  💰 Revenue: ₹${(bookingRevenue + orderRevenue).toLocaleString()} (Bookings: ₹${bookingRevenue.toLocaleString()}, Orders: ₹${orderRevenue.toLocaleString()})`);
    }

    // Data integrity checks
    console.log('\n🔗 DATA INTEGRITY CHECKS:');
    
    // Check if all bookings have valid sessions
    const bookingsWithInvalidSessions = bookings.filter(b => {
      if (!b.sessionId) return false;
      return !sessions.some(s => s._id.toString() === b.sessionId?.toString());
    });
    console.log(`❌ Bookings with invalid sessions: ${bookingsWithInvalidSessions.length}`);
    
    // Check if all bookings have valid customers
    const bookingsWithInvalidCustomers = bookings.filter(b => {
      if (!b.customerId) return false;
      return !users.some(u => u._id.toString() === b.customerId?.toString());
    });
    console.log(`❌ Bookings with invalid customers: ${bookingsWithInvalidCustomers.length}`);
    
    // Check if all sessions have valid branches
    const sessionsWithInvalidBranches = sessions.filter(s => {
      return !branches.some(b => b._id.toString() === s.branchId.toString());
    });
    console.log(`❌ Sessions with invalid branches: ${sessionsWithInvalidBranches.length}`);
    
    // Check if all orders have valid customers
    const ordersWithInvalidCustomers = orders.filter(o => {
      if (!o.customerId) return false;
      return !users.some(u => u._id.toString() === o.customerId);
    });
    console.log(`❌ Orders with invalid customers: ${ordersWithInvalidCustomers.length}`);

    // Product analysis
    console.log('\n🛍️ PRODUCT ANALYSIS:');
    const productsByCategory = products.reduce((acc: any, product) => {
      const category = product.category || 'Uncategorized';
      acc[category] = (acc[category] || 0) + 1;
      return acc;
    }, {});
    
    Object.entries(productsByCategory).forEach(([category, count]) => {
      console.log(`${category}: ${count} products`);
    });
    
    const totalProductValue = products.reduce((sum, p) => sum + (p.price * p.stock), 0);
    console.log(`Total inventory value: ₹${totalProductValue.toLocaleString()}`);

    // Session utilization
    console.log('\n📈 SESSION UTILIZATION:');
    const sessionStats = sessions.reduce((acc: any, session) => {
      const utilization = session.totalSeats > 0 ? (session.bookedSeats / session.totalSeats) * 100 : 0;
      acc.totalSeats += session.totalSeats;
      acc.bookedSeats += session.bookedSeats;
      acc.sessions += 1;
      acc.utilizationSum += utilization;
      return acc;
    }, { totalSeats: 0, bookedSeats: 0, sessions: 0, utilizationSum: 0 });
    
    const avgUtilization = sessionStats.sessions > 0 ? sessionStats.utilizationSum / sessionStats.sessions : 0;
    const overallUtilization = sessionStats.totalSeats > 0 ? (sessionStats.bookedSeats / sessionStats.totalSeats) * 100 : 0;
    
    console.log(`Total seats available: ${sessionStats.totalSeats}`);
    console.log(`Total seats booked: ${sessionStats.bookedSeats}`);
    console.log(`Overall utilization: ${overallUtilization.toFixed(2)}%`);
    console.log(`Average session utilization: ${avgUtilization.toFixed(2)}%`);

    // Cart analysis
    console.log('\n🛒 SHOPPING CART ANALYSIS:');
    const usersWithCarts = users.filter(u => u.cart && u.cart.length > 0);
    const totalCartItems = users.reduce((sum, u) => sum + (u.cart?.length || 0), 0);
    const totalCartValue = users.reduce((sum, u) => {
      return sum + (u.cart?.reduce((cartSum, item) => cartSum + (item.price * item.qty), 0) || 0);
    }, 0);
    
    console.log(`Users with items in cart: ${usersWithCarts.length}`);
    console.log(`Total cart items: ${totalCartItems}`);
    console.log(`Total cart value: ₹${totalCartValue.toLocaleString()}`);

    // Recent activity
    console.log('\n⏰ RECENT ACTIVITY:');
    const recentBookings = bookings.filter(b => {
      const bookingDate = new Date((b as any).createdAt || 0);
      const daysSince = (Date.now() - bookingDate.getTime()) / (1000 * 60 * 60 * 24);
      return daysSince <= 7;
    });
    
    const recentOrders = orders.filter(o => {
      const orderDate = new Date((o as any).createdAt || 0);
      const daysSince = (Date.now() - orderDate.getTime()) / (1000 * 60 * 60 * 24);
      return daysSince <= 7;
    });
    
    console.log(`Bookings in last 7 days: ${recentBookings.length}`);
    console.log(`Orders in last 7 days: ${recentOrders.length}`);

    console.log('\n✅ Data verification completed!');
    console.log('='.repeat(60));

  } catch (error) {
    console.error('Error verifying data:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

// Run the verification function
if (require.main === module) {
  verifyData();
}

export default verifyData;
