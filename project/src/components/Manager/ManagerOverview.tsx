import React, { useState, useEffect } from 'react';
import { Calendar, Users, Clock, CheckCircle, QrCode, TrendingUp } from 'lucide-react';

interface ManagerOverviewProps {
  effectiveBranchId?: string;
  branches: any[];
  setActiveTab: (tab: string) => void;
}

const ManagerOverview: React.FC<ManagerOverviewProps> = ({ 
  effectiveBranchId, 
  branches, 
  setActiveTab 
}) => {
  // Get today's date for filtering
  const today = new Date().toISOString().split('T')[0];
  
  // State for today's data
  const [todaySessions, setTodaySessions] = useState<any[]>([]);
  const [todaysCustomers, setTodaysCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch today's sessions and bookings
  useEffect(() => {
    const fetchTodayData = async () => {
      if (!effectiveBranchId) return;
      
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        const headers: Record<string, string> = {};
        if (token) headers['Authorization'] = `Bearer ${token}`;

        const apiBase = (import.meta as any).env?.VITE_API_URL || '/api';

        // Fetch today's sessions
        const sessionsResponse = await fetch(
          `${apiBase}/sessions/branch/${effectiveBranchId}?startDate=${today}&endDate=${today}`,
          { headers }
        );

        if (sessionsResponse.ok) {
          const sessions = await sessionsResponse.json();
          setTodaySessions(sessions);

          // Fetch bookings for today's sessions
          const customersData = [];
          for (const session of sessions) {
            try {
              const resp = await fetch(`${apiBase}/sessions/${session._id}`);
              if (resp.ok) {
                const info = await resp.json();
                const users = info.users || info.registeredUsers || [];
                customersData.push(...users.map((user: any) => ({
                  ...user,
                  sessionTime: session.time,
                  sessionLabel: session.label,
                  activity: session.activity
                })));
              }
            } catch (error) {
              console.warn('Failed to fetch session users:', error);
            }
          }
          setTodaysCustomers(customersData);
        }
      } catch (error) {
        console.error('Error fetching today\'s data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTodayData();
    // Refresh every 5 minutes
    const interval = setInterval(fetchTodayData, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [effectiveBranchId]);

  // Calculate stats
  const totalTodayEvents = todaySessions.length;
  const totalTodayCustomers = todaysCustomers.length;
  const verifiedCustomers = todaysCustomers.filter(c => c.isVerified).length;
  const pendingCustomers = totalTodayCustomers - verifiedCustomers;

  // Group sessions by activity
  const slimeSessions = todaySessions.filter(s => s.activity === 'slime');
  const tuftingSessions = todaySessions.filter(s => s.activity === 'tufting');

  return (
    <div className="space-y-6">
      {/* Branch Info */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-2">
          {branches.find(b => b.id === effectiveBranchId)?.name || 'Branch Manager Dashboard'}
        </h2>
        <p className="opacity-90">{branches.find(b => b.id === effectiveBranchId)?.location}</p>
        <p className="opacity-75 text-sm mt-1">Today: {new Date().toLocaleDateString()}</p>
      </div>

      {/* Today's Event Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Today's Events</p>
              <p className="text-2xl font-bold text-gray-900">{totalTodayEvents}</p>
              <p className="text-xs text-gray-500">
                {slimeSessions.length} Slime • {tuftingSessions.length} Tufting
              </p>
            </div>
            <Calendar className="h-8 w-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Today's Customers</p>
              <p className="text-2xl font-bold text-gray-900">{totalTodayCustomers}</p>
              <p className="text-xs text-gray-500">Total bookings</p>
            </div>
            <Users className="h-8 w-8 text-green-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Verified Check-ins</p>
              <p className="text-2xl font-bold text-green-600">{verifiedCustomers}</p>
              <p className="text-xs text-gray-500">Confirmed arrivals</p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pending Check-ins</p>
              <p className="text-2xl font-bold text-orange-600">{pendingCustomers}</p>
              <p className="text-xs text-gray-500">Awaiting arrival</p>
            </div>
            <Clock className="h-8 w-8 text-orange-600" />
          </div>
        </div>
      </div>

      {/* Today's Session Schedule */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4">Today's Session Schedule</h3>
        {loading ? (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mb-4"></div>
            <p className="text-gray-600">Loading today's events...</p>
          </div>
        ) : todaySessions.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No events scheduled for today</p>
          </div>
        ) : (
          <div className="space-y-3">
            {todaySessions
              .sort((a, b) => a.time.localeCompare(b.time))
              .map((session, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className={`w-3 h-3 rounded-full ${
                      session.activity === 'slime' ? 'bg-green-500' : 'bg-purple-500'
                    }`}></div>
                    <div>
                      <p className="font-medium text-gray-900">
                        {session.label || session.time} - {session.activity.charAt(0).toUpperCase() + session.activity.slice(1)}
                      </p>
                      <p className="text-sm text-gray-600">{session.type} • {session.ageGroup}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">
                      {session.bookedSeats}/{session.totalSeats} booked
                    </p>
                    <p className={`text-xs ${
                      session.availableSeats === 0 ? 'text-red-600' :
                      session.availableSeats <= 3 ? 'text-orange-600' : 'text-green-600'
                    }`}>
                      {session.availableSeats} available
                    </p>
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>

      {/* Today's Customer List */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4">Today's Expected Customers</h3>
        {loading ? (
          <div className="text-center py-4">
            <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-purple-600"></div>
          </div>
        ) : todaysCustomers.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No customers booked for today</p>
          </div>
        ) : (
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {todaysCustomers
              .sort((a, b) => a.sessionTime.localeCompare(b.sessionTime))
              .map((customer, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className={`w-2 h-2 rounded-full ${
                      customer.activity === 'slime' ? 'bg-green-500' : 'bg-purple-500'
                    }`}></div>
                    <div>
                      <p className="font-medium text-gray-900">{customer.customerName}</p>
                      <p className="text-sm text-gray-600">{customer.customerEmail}</p>
                      <p className="text-xs text-gray-500">
                        {customer.sessionLabel} • {customer.seats} seat{customer.seats > 1 ? 's' : ''}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    {customer.isVerified ? (
                      <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                        ✓ Checked In
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-orange-100 text-orange-800 rounded-full">
                        ⏳ Pending
                      </span>
                    )}
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={() => setActiveTab('sessions')}
            className="flex items-center justify-center p-4 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors"
          >
            <Calendar className="h-5 w-5 mr-2" />
            Manage Sessions
          </button>
          <button
            onClick={() => setActiveTab('qr')}
            className="flex items-center justify-center p-4 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors"
          >
            <QrCode className="h-5 w-5 mr-2" />
            QR Verification
          </button>
          <button
            onClick={() => window.location.reload()}
            className="flex items-center justify-center p-4 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition-colors"
          >
            <TrendingUp className="h-5 w-5 mr-2" />
            Refresh Data
          </button>
        </div>
      </div>
    </div>
  );
};

export default ManagerOverview;
