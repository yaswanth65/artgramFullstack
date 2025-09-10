import React, { useState, useEffect } from 'react';
import { useData } from '../../contexts/DataContext';
import { useAuth } from '../../contexts/AuthContext';
import ManagerSessionManagement from './ManagerSessionManagement';
import ManagerOverview from './ManagerOverview';
import EnhancedQRVerification from './EnhancedQRVerification';
import {
  QrCode,
  TrendingUp,
  Calendar,
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
          {activeTab === 'overview' && (
            <ManagerOverview 
              effectiveBranchId={effectiveBranchId}
              branches={branches}
              setActiveTab={setActiveTab}
            />
          )}
          {activeTab === 'sessions' && <ManagerSessionManagement />}
          {activeTab === 'qr' && <EnhancedQRVerification />}
        </div>
      </div>

    </div>
  );
};

export default ManagerDashboard;