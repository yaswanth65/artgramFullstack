import React, { useState, useEffect } from 'react';
import { useData } from '../../contexts/DataContext';
import { useAuth } from '../../contexts/AuthContext';
import ManagerSessionManagement from './ManagerSessionManagement';
import EnhancedQRVerification from './EnhancedQRVerification';
import {
  QrCode,
  Package,
  TrendingUp,
  Calendar,
  Eye,
  // CheckCircle,
  // AlertCircle
} from 'lucide-react';
import type { Order, Booking, Branch, Event as CustomEvent } from '../../types';

const ManagerDashboard: React.FC = () => {
  const { user } = useAuth();
  const {
    orders: contextOrders,
    events: contextEvents,
    bookings: contextBookings,
    branches: contextBranches
  } = useData();

  // Local state that mirrors context, without mock fallbacks
  const [orders, setOrders] = useState<Order[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [customEvents, setCustomEvents] = useState<CustomEvent[]>([]);

  // Sync with context data and persist locally
  useEffect(() => {
    setOrders(contextOrders);
  }, [contextOrders]);

  useEffect(() => {
    setBookings(contextBookings);
  }, [contextBookings]);

  useEffect(() => {
    if (contextBranches.length > 0) {
      setBranches(contextBranches);
    }
  }, [contextBranches]);

  useEffect(() => {
    if (contextEvents.length > 0) {
      setCustomEvents(contextEvents);
    }
  }, [contextEvents]);

  // Debug: Track data changes and persist state
  useEffect(() => {
    console.log('🔄 ManagerDashboard - Data updated:', {
      ordersCount: orders.length,
      bookingsCount: bookings.length,
      branchesCount: branches.length,
      eventsCount: customEvents.length,
      timestamp: new Date().toISOString()
    });
  }, [orders.length, bookings.length, branches.length, customEvents.length]);
 
  const [tokenWarning, setTokenWarning] = useState(false);
  const { logout } = useAuth();

  useEffect(() => {
    const checkTokenExpiry = () => {
      const token = localStorage.getItem('token');
      if (!token) return;

      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const now = Date.now() / 1000;
        const timeUntilExpiry = payload.exp - now;

        // Show warning if token expires in less than 1 hour
        if (timeUntilExpiry < 3600 && timeUntilExpiry > 0) {
          setTokenWarning(true);
        } else if (timeUntilExpiry <= 0) {
          // Token expired - use central logout to clean up state
          logout();
        }
      } catch (error) {
        console.error('Error checking token expiry:', error);
      }
    };

    checkTokenExpiry();
    const interval = setInterval(checkTokenExpiry, 60000); // Check every minute
    return () => clearInterval(interval);
  }, [logout]);

  const [activeTab, setActiveTab] = useState('overview');
  // Set initial loading to false and provide immediate data
  const [isDataLoading, setIsDataLoading] = useState(false);  // Track when data is initially loaded
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsDataLoading(false);
    }, 3000); // Give data 3 seconds to load

    return () => clearTimeout(timer);
  }, []);

  // Reset loading state when data arrives
  useEffect(() => {
    if (orders.length > 0 || bookings.length > 0) {
      setIsDataLoading(false);
    }
  }, [orders.length, bookings.length]);

  // Determine manager branchId even if branches haven't loaded yet
  const effectiveBranchId = user?.branchId || branches.find(b => b.managerId === user?.id)?.id || undefined;

  // Filter data for manager's branch using effectiveBranchId
  const branchOrders = effectiveBranchId ? orders.filter(order => order.branchId === effectiveBranchId) : orders;
  const branchBookings = effectiveBranchId ? bookings.filter(booking => booking.branchId === effectiveBranchId) : bookings;
  const branchEvents = effectiveBranchId ? customEvents.filter((event: CustomEvent) => event.branchId === effectiveBranchId) : customEvents;

  // Calculate analytics (removed revenue calculation for manager dashboard)
  const totalBookings = branchBookings.length;
  const pendingOrders = branchOrders.filter(order => order.orderStatus === 'pending').length;

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Branch Info */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-2">
          {branches.find(b => b.id === effectiveBranchId)?.name || 'Branch Manager Dashboard'}
        </h2>
        <p className="opacity-90">{branches.find(b => b.id === effectiveBranchId)?.location}</p>
      </div>

      {/* Analytics Cards - Removed revenue for manager */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Bookings</p>
              <p className="text-2xl font-bold text-gray-900">{totalBookings}</p>
            </div>
            <Calendar className="h-8 w-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pending Orders</p>
              <p className="text-2xl font-bold text-gray-900">{pendingOrders}</p>
            </div>
            <Package className="h-8 w-8 text-orange-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Events</p>
              <p className="text-2xl font-bold text-gray-900">{branchEvents.length}</p>
            </div>
            <TrendingUp className="h-8 w-8 text-purple-600" />
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4">Recent Orders</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Order ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {branchOrders.slice(0, 5).map((order) => {
                const getStatusColor = (status: string) => {
                  switch (status) {
                    case 'delivered': return 'bg-green-100 text-green-800';
                    case 'out_for_delivery': return 'bg-blue-100 text-blue-800';
                    case 'in_transit': return 'bg-indigo-100 text-indigo-800';
                    case 'shipped': return 'bg-purple-100 text-purple-800';
                    case 'packed': return 'bg-cyan-100 text-cyan-800';
                    case 'processing': return 'bg-yellow-100 text-yellow-800';
                    case 'payment_confirmed': return 'bg-emerald-100 text-emerald-800';
                    case 'cancelled': return 'bg-red-100 text-red-800';
                    default: return 'bg-gray-100 text-gray-800';
                  }
                };

                const orderStatusOptions = [
                  { value: 'pending', label: 'Pending' },
                  { value: 'payment_confirmed', label: 'Payment Confirmed' },
                  { value: 'processing', label: 'Processing' },
                  { value: 'packed', label: 'Packed' },
                  { value: 'shipped', label: 'Shipped' },
                  { value: 'in_transit', label: 'In Transit' },
                  { value: 'out_for_delivery', label: 'Out for Delivery' },
                  { value: 'delivered', label: 'Delivered' },
                  { value: 'cancelled', label: 'Cancelled' }
                ];
                
                return (
                  <tr key={order.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      #{order.id.slice(0, 8)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="font-medium text-gray-900">{order.customerName || `Customer #${order.customerId.slice(0, 6)}`}</div>
                      <div className="text-xs text-gray-600">{order.customerEmail || '—'}</div>
                      <div className="text-xs text-gray-600">{order.customerPhone || '—'}</div>
                      <div className="text-xs text-gray-500 mt-1">
                        {order.shippingAddress ? `${order.shippingAddress.street}, ${order.shippingAddress.city}, ${order.shippingAddress.state} - ${order.shippingAddress.zipCode}` : '—'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      ₹{order.totalAmount.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(order.orderStatus)}`}>
                        {orderStatusOptions.find(opt => opt.value === order.orderStatus)?.label || order.orderStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        className="text-indigo-600 hover:text-indigo-900 mr-3"
                        title="View Only - Order management moved to Admin"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Customer Details (branch scoped) */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4">Customer Details</h3>
        <div className="space-y-3">
          {[
            ...branchOrders.map(o => ({ id: o.customerId, name: o.customerName, email: o.customerEmail, phone: o.customerPhone })),
            ...branchBookings.map(b => ({ id: b.customerId, name: b.customerName, email: b.customerEmail, phone: b.customerPhone }))
          ]
            .filter((v, i, arr) => v.id && arr.findIndex(x => x.id === v.id) === i)
            .slice(0, 8)
            .map(c => (
              <div key={c.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{c.name || `Customer #${c.id?.slice(0, 6)}`}</p>
                  <p className="text-xs text-gray-600">{c.email || '—'}</p>
                </div>
                <div className="text-sm text-gray-600">{c.phone || '—'}</div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Manager Dashboard</h1>
          <p className="text-gray-600">Welcome back, {user?.name}</p>
        </div>

        {/* Token Expiry Warning */}
        {tokenWarning && (
          <div className="mb-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-center">
              {/* <AlertCircle className="h-5 w-5 text-yellow-600 mr-3" /> */}
              <div>
                <p className="text-yellow-800 font-medium">Session Expiring Soon</p>
                <p className="text-yellow-700 text-sm">Your session will expire soon. Please save your work and refresh the page to continue.</p>
              </div>
              <button
                onClick={() => window.location.reload()}
                className="ml-auto bg-yellow-600 text-white px-3 py-1 rounded text-sm hover:bg-yellow-700"
              >
                Refresh Now
              </button>
            </div>
          </div>
        )}

        {/* Loading Indicator */}
        {isDataLoading && (
          <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600 mr-3"></div>
              <p className="text-blue-800">Loading dashboard data...</p>
            </div>
          </div>
        )}

        {/* Data Summary for Debug */}
        {!isDataLoading && (
          <div className="mb-6 bg-gray-100 border border-gray-200 rounded-lg p-4 text-sm text-gray-600">
            <div className="flex justify-between items-center">
              <p>📊 Data Status: {orders.length} orders, {bookings.length} bookings, {branches.length} branches available</p>
              <button
                onClick={() => window.location.reload()}
                className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 transition-colors"
              >
                🔄 Force Refresh
              </button>
            </div>
          </div>
        )}

        {/* Navigation Tabs - Removed order management for managers */}
        <div className="mb-8">
          <nav className="flex space-x-8 overflow-x-auto">
            {[
              { id: 'overview', label: 'Overview', icon: TrendingUp },
              { id: 'sessions', label: 'Sessions', icon: Calendar },
              { id: 'qr', label: 'QR Verification', icon: QrCode }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center px-3 py-2 border-b-2 font-medium text-sm whitespace-nowrap ${activeTab === tab.id
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
              >
                <tab.icon className="h-4 w-4 mr-2" />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content - Updated to use enhanced QR verification */}
        <div>
          {activeTab === 'overview' && renderOverview()}
          {activeTab === 'sessions' && <ManagerSessionManagement />}
          {activeTab === 'qr' && <EnhancedQRVerification />}
        </div>
      </div>

    </div>
  );
};

export default ManagerDashboard;