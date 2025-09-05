import React, { useState } from 'react';
import { useData } from '../../contexts/DataContext';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  ShoppingCart,
  Calendar,
  Users,
  Download,
  Filter,
  BarChart3,
  PieChart as PieChartIcon
} from 'lucide-react';

const SalesAnalytics: React.FC = () => {
  const { orders, bookings, branches, events, products, sessions } = useData();
  const [dateRange, setDateRange] = useState('30'); // days
  const [selectedBranch, setSelectedBranch] = useState('all');
  const [reportType, setReportType] = useState('overview');

  // Calculate date range
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(endDate.getDate() - parseInt(dateRange));

  // Filter data by date range and branch
  const filteredOrders = orders.filter(order => {
    const orderDate = new Date(order.createdAt);
    const dateInRange = orderDate >= startDate && orderDate <= endDate;
    const branchMatch = selectedBranch === 'all' || order.branchId === selectedBranch;
    return dateInRange && branchMatch;
  });

  const filteredBookings = bookings.filter(booking => {
    const bookingDate = new Date(booking.createdAt);
    const dateInRange = bookingDate >= startDate && bookingDate <= endDate;
    const branchMatch = selectedBranch === 'all' || booking.branchId === selectedBranch;
    return dateInRange && branchMatch;
  });

  // Calculate metrics
  const totalRevenue = [...filteredOrders, ...filteredBookings].reduce((sum, item) => sum + item.totalAmount, 0);
  const totalOrders = filteredOrders.length;
  const totalBookings = filteredBookings.length;
  const averageOrderValue = totalOrders > 0 ? totalRevenue / (totalOrders + totalBookings) : 0;

  // Previous period comparison
  const prevStartDate = new Date(startDate);
  prevStartDate.setDate(prevStartDate.getDate() - parseInt(dateRange));
  const prevEndDate = new Date(startDate);

  const prevOrders = orders.filter(order => {
    const orderDate = new Date(order.createdAt);
    return orderDate >= prevStartDate && orderDate < prevEndDate;
  });
  const prevBookings = bookings.filter(booking => {
    const bookingDate = new Date(booking.createdAt);
    return bookingDate >= prevStartDate && bookingDate < prevEndDate;
  });

  const prevRevenue = [...prevOrders, ...prevBookings].reduce((sum, item) => sum + item.totalAmount, 0);
  const revenueGrowth = prevRevenue > 0 ? ((totalRevenue - prevRevenue) / prevRevenue) * 100 : 0;

  // Daily revenue data for line chart
  const dailyRevenueData = [];
  for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
    const dateStr = d.toISOString().split('T')[0];
    const dayOrders = filteredOrders.filter(order => order.createdAt.startsWith(dateStr));
    const dayBookings = filteredBookings.filter(booking => booking.createdAt.startsWith(dateStr));
    const dayRevenue = [...dayOrders, ...dayBookings].reduce((sum, item) => sum + item.totalAmount, 0);
    
    dailyRevenueData.push({
      date: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      revenue: dayRevenue,
      orders: dayOrders.length,
      bookings: dayBookings.length
    });
  }

  // Branch revenue data for pie chart
  const branchRevenueData = branches.map(branch => {
    const branchOrders = filteredOrders.filter(order => order.branchId === branch.id);
    const branchBookings = filteredBookings.filter(booking => booking.branchId === branch.id);
    const branchRevenue = [...branchOrders, ...branchBookings].reduce((sum, item) => sum + item.totalAmount, 0);
    
    return {
      name: branch.name,
      value: branchRevenue,
      orders: branchOrders.length,
      bookings: branchBookings.length
    };
  });

  // Product performance data
  const productPerformance = products.map(product => {
    const productOrders = filteredOrders.filter(order => 
      order.products.some(p => p.productId === product.id)
    );
    const totalSold = productOrders.reduce((sum, order) => {
      const productInOrder = order.products.find(p => p.productId === product.id);
      return sum + (productInOrder?.quantity || 0);
    }, 0);
    const revenue = productOrders.reduce((sum, order) => {
      const productInOrder = order.products.find(p => p.productId === product.id);
      return sum + ((productInOrder?.quantity || 0) * (productInOrder?.price || 0));
    }, 0);

    return {
      name: product.name,
      sold: totalSold,
      revenue: revenue,
      category: product.category
    };
  }).sort((a, b) => b.revenue - a.revenue).slice(0, 10);

  // Event performance data
  const eventPerformance = events.map(event => {
    const eventBookings = filteredBookings.filter(booking => booking.eventId === event.id);
    const totalSeats = eventBookings.reduce((sum, booking) => sum + booking.seats, 0);
    const revenue = eventBookings.reduce((sum, booking) => sum + booking.totalAmount, 0);

    return {
      name: event.title,
      bookings: eventBookings.length,
      seats: totalSeats,
      revenue: revenue,
      date: event.date
    };
  }).sort((a, b) => b.revenue - a.revenue).slice(0, 10);

  // Activity (slime / tufting) performance
  const activityMetrics = (activity: string) => {
    const activitySessions = sessions.filter((s: any) => s.activity === activity && new Date(s.date) >= startDate && new Date(s.date) <= endDate && (selectedBranch === 'all' || s.branchId === selectedBranch));
    const activityBookings = filteredBookings.filter((b: any) => b.activity === activity);

    const totalSessions = activitySessions.length;
    const totalBookingsActivity = activityBookings.length;
    const seatsSold = activityBookings.reduce((sum: number, b: any) => sum + (b.seats || 0), 0);
    const totalSeats = activitySessions.reduce((sum: number, s: any) => sum + (s.totalSeats || 0), 0);
    const activityRevenue = activityBookings.reduce((sum: number, b: any) => sum + (b.totalAmount || 0), 0);
    const occupancy = totalSeats > 0 ? (seatsSold / totalSeats) * 100 : 0;
    const avgPricePerSeat = seatsSold > 0 ? activityRevenue / seatsSold : 0;

    // daily series for this activity
    const daily: any[] = [];
    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
      const dateStr = d.toISOString().split('T')[0];
      const dayBookings = activityBookings.filter(b => (b.createdAt || b.date || '').toString().startsWith(dateStr));
      const dayRevenue = dayBookings.reduce((sum: number, b: any) => sum + (b.totalAmount || 0), 0);
      daily.push({ date: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }), revenue: dayRevenue, bookings: dayBookings.length });
    }

    return { totalSessions, totalBookingsActivity, seatsSold, totalSeats, activityRevenue, occupancy, avgPricePerSeat, daily };
  };

  const slime = activityMetrics('slime');
  const tufting = activityMetrics('tufting');

  const COLORS = ['#ea580c', '#f97316', '#fb923c', '#fdba74', '#fed7aa', '#fff7ed'];

  const downloadReport = () => {
    const reportData = {
      period: `${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()}`,
      branch: selectedBranch === 'all' ? 'All Branches' : branches.find(b => b.id === selectedBranch)?.name,
      summary: {
        totalRevenue,
        totalOrders,
        totalBookings,
        averageOrderValue,
        revenueGrowth
      },
      dailyRevenue: dailyRevenueData,
      branchPerformance: branchRevenueData,
      topProducts: productPerformance,
      topEvents: eventPerformance
    };

    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sales-report-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Header with Filters */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Sales Analytics</h2>
          <p className="text-gray-600">Comprehensive sales and revenue analysis</p>
        </div>
        
        <div className="flex flex-wrap gap-4">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
          >
            <option value="7">Last 7 days</option>
            <option value="30">Last 30 days</option>
            <option value="90">Last 90 days</option>
            <option value="365">Last year</option>
          </select>
          
          <select
            value={selectedBranch}
            onChange={(e) => setSelectedBranch(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
          >
            <option value="all">All Branches</option>
            {branches.map(branch => (
              <option key={branch.id} value={branch.id}>{branch.name}</option>
            ))}
          </select>
          
          <button
            onClick={downloadReport}
            className="flex items-center space-x-2 bg-orange-600 text-white px-4 py-2 rounded-md hover:bg-orange-700 transition-colors"
          >
            <Download className="h-4 w-4" />
            <span>Export Report</span>
          </button>
        </div>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900">₹{totalRevenue.toLocaleString()}</p>
              <div className="flex items-center mt-2">
                {revenueGrowth >= 0 ? (
                  <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-red-600 mr-1" />
                )}
                <span className={`text-sm font-medium ${revenueGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {Math.abs(revenueGrowth).toFixed(1)}%
                </span>
              </div>
            </div>
            <DollarSign className="h-8 w-8 text-green-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Orders</p>
              <p className="text-2xl font-bold text-gray-900">{totalOrders}</p>
              <p className="text-sm text-gray-500 mt-2">Product orders</p>
            </div>
            <ShoppingCart className="h-8 w-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Bookings</p>
              <p className="text-2xl font-bold text-gray-900">{totalBookings}</p>
              <p className="text-sm text-gray-500 mt-2">Event bookings</p>
            </div>
            <Calendar className="h-8 w-8 text-purple-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg Order Value</p>
              <p className="text-2xl font-bold text-gray-900">₹{averageOrderValue.toFixed(0)}</p>
              <p className="text-sm text-gray-500 mt-2">Per transaction</p>
            </div>
            <Users className="h-8 w-8 text-orange-600" />
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Trend Chart */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-gray-800">Revenue Trend</h3>
            <BarChart3 className="h-5 w-5 text-gray-600" />
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={dailyRevenueData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip formatter={(value) => [`₹${value}`, 'Revenue']} />
              <Area type="monotone" dataKey="revenue" stroke="#ea580c" fill="#ea580c" fillOpacity={0.3} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Branch Performance Pie Chart */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-gray-800">Branch Performance</h3>
            <PieChartIcon className="h-5 w-5 text-gray-600" />
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={branchRevenueData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {branchRevenueData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [`₹${value}`, 'Revenue']} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Orders vs Bookings Chart */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-6">Orders vs Bookings Trend</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={dailyRevenueData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="orders" stroke="#3b82f6" strokeWidth={2} name="Orders" />
            <Line type="monotone" dataKey="bookings" stroke="#8b5cf6" strokeWidth={2} name="Bookings" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Activity Analytics: Slime & Tufting */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Slime Analytics */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-800">Slime Sessions Analytics</h3>
            <Filter className="h-5 w-5 text-gray-600" />
          </div>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="p-3 bg-gray-50 rounded">
              <p className="text-sm text-gray-600">Sessions</p>
              <p className="text-xl font-bold">{slime.totalSessions}</p>
            </div>
            <div className="p-3 bg-gray-50 rounded">
              <p className="text-sm text-gray-600">Bookings</p>
              <p className="text-xl font-bold">{slime.totalBookingsActivity}</p>
            </div>
            <div className="p-3 bg-gray-50 rounded">
              <p className="text-sm text-gray-600">Seats Sold</p>
              <p className="text-xl font-bold">{slime.seatsSold}</p>
            </div>
            <div className="p-3 bg-gray-50 rounded">
              <p className="text-sm text-gray-600">Occupancy</p>
              <p className="text-xl font-bold">{slime.occupancy.toFixed(0)}%</p>
            </div>
          </div>
          <div style={{ width: '100%', height: 180 }}>
            <ResponsiveContainer>
              <AreaChart data={slime.daily}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip formatter={(value) => [`₹${value}`, 'Revenue']} />
                <Area type="monotone" dataKey="revenue" stroke="#f97316" fill="#f97316" fillOpacity={0.2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Tufting Analytics */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-800">Tufting Sessions Analytics</h3>
            <Filter className="h-5 w-5 text-gray-600" />
          </div>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="p-3 bg-gray-50 rounded">
              <p className="text-sm text-gray-600">Sessions</p>
              <p className="text-xl font-bold">{tufting.totalSessions}</p>
            </div>
            <div className="p-3 bg-gray-50 rounded">
              <p className="text-sm text-gray-600">Bookings</p>
              <p className="text-xl font-bold">{tufting.totalBookingsActivity}</p>
            </div>
            <div className="p-3 bg-gray-50 rounded">
              <p className="text-sm text-gray-600">Seats Sold</p>
              <p className="text-xl font-bold">{tufting.seatsSold}</p>
            </div>
            <div className="p-3 bg-gray-50 rounded">
              <p className="text-sm text-gray-600">Occupancy</p>
              <p className="text-xl font-bold">{tufting.occupancy.toFixed(0)}%</p>
            </div>
          </div>
          <div style={{ width: '100%', height: 180 }}>
            <ResponsiveContainer>
              <AreaChart data={tufting.daily}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip formatter={(value) => [`₹${value}`, 'Revenue']} />
                <Area type="monotone" dataKey="revenue" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Performance Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Products */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-6">Top Performing Products</h3>
          <div className="space-y-4">
            {productPerformance.map((product, index) => (
              <div key={product.name} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                    <span className="text-sm font-bold text-orange-600">#{index + 1}</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{product.name}</p>
                    <p className="text-sm text-gray-600">{product.sold} sold</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-gray-900">₹{product.revenue.toLocaleString()}</p>
                  <p className="text-sm text-gray-600">{product.category}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Events */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-6">Top Performing Events</h3>
          <div className="space-y-4">
            {eventPerformance.map((event, index) => (
              <div key={event.name} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                    <span className="text-sm font-bold text-purple-600">#{index + 1}</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{event.name}</p>
                    <p className="text-sm text-gray-600">{event.bookings} bookings, {event.seats} seats</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-gray-900">₹{event.revenue.toLocaleString()}</p>
                  <p className="text-sm text-gray-600">{new Date(event.date).toLocaleDateString()}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SalesAnalytics;