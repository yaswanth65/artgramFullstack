import React, { useState, useEffect } from 'react';
import { useData } from '../../contexts/DataContext';
import { useAuth } from '../../contexts/AuthContext';
import { Plus, X, Trash2, Edit2, Users, Clock, Calendar, AlertCircle } from 'lucide-react';

interface Session {
  _id?: string;
  branchId: string;
  date: string;
  activity: 'slime' | 'tufting';
  time: string;
  label?: string;
  totalSeats: number;
  bookedSeats: number;
  availableSeats: number;
  type: string;
  ageGroup: string;
  price?: number;
  isActive: boolean;
  createdBy?: string;
  notes?: string;
  registeredUsers?: Array<{
    customerName: string;
    customerEmail: string;
    seats: number;
    isVerified: boolean;
    verifiedAt?: string;
  }>;
}

const ManagerSessionManagement: React.FC = () => {
  const { user } = useAuth();
  const { branches } = useData();
  
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState<'slime' | 'tufting'>('slime');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingSession, setEditingSession] = useState<Session | null>(null);
  const [toastMessage, setToastMessage] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [expandedSessions, setExpandedSessions] = useState<Set<string>>(new Set());
  const [showUserModal, setShowUserModal] = useState(false);
  const [modalSession, setModalSession] = useState<Session | null>(null);
  const [modalLoading, setModalLoading] = useState(false);
  
  // Manager's branch
  const managerBranch = branches.find(b => b.id === user?.branchId || b.managerId === user?.id);
  const branchId = managerBranch?.id;
  
  // Generate next 10 days
  const generateNext10Days = () => {
    const days = [];
    for (let i = 0; i < 10; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);
      days.push(date.toISOString().split('T')[0]);
    }
    return days;
  };

  const [next10Days] = useState(generateNext10Days());
  const [selectedDate, setSelectedDate] = useState(next10Days[0]);

  const [newSession, setNewSession] = useState<Partial<Session>>({
    branchId: branchId,
    date: selectedDate,
    activity: 'slime',
    time: '10:00',
    label: '10:00 AM',
    totalSeats: 15,
    type: 'Slime Play & Demo',
    ageGroup: '3+',
    isActive: true,
    notes: ''
  });

  // API base URL
  const apiBase = (import.meta as any).env?.VITE_API_URL || '/api';

  const showToastMessage = (message: string) => {
    setToastMessage(message);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  // Fetch sessions for next 10 days for manager's branch only
  const fetchNext10DaysSessions = async () => {
    if (!branchId) return;
    
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const headers: Record<string, string> = {};
      if (token) headers['Authorization'] = `Bearer ${token}`;

      console.log(`🔄 Manager fetching sessions for branch ${branchId}, activity ${selectedActivity}`);
      
      // Use the same endpoint as admin for consistency and live updates
      const startDate = next10Days[0];
      const endDate = next10Days[next10Days.length - 1];
      const response = await fetch(
        `${apiBase}/sessions/branch/${branchId}?startDate=${startDate}&endDate=${endDate}&activity=${selectedActivity}`,
        { headers }
      );
      
      if (response.ok) {
        const data = await response.json();
        console.log('✅ Manager sessions fetched:', data?.length || 0);
        
        // Fetch registered users for each session using the public session endpoint.
        // The server provides two shapes: { users: [...] } for the protected route
        // and { registeredUsers: [...] } for the public session route. Handle both.
        const sessionsWithUsers = await Promise.all(
          data.map(async (session: Session) => {
            try {
              const id = (session as any)._id || (session as any).id;
              console.log('Fetching session users for id=', id);
              if (!id) return session;
              const resp = await fetch(`${apiBase}/sessions/${id}`);
              if (resp.ok) {
                const info = await resp.json();
                const users = info.users || info.registeredUsers || [];
                return { ...session, registeredUsers: users };
              }
            } catch (error) {
              console.warn('Failed to fetch users for session:', (session as any)._id || (session as any).id, error);
            }
            return session;
          })
        );
        
        setSessions(sessionsWithUsers);
        
        // Cache sessions data
        try {
          localStorage.setItem(`manager_sessions_${branchId}_${selectedActivity}`, JSON.stringify(sessionsWithUsers));
        } catch (error) {
          console.warn('Failed to cache sessions:', error);
        }
      } else {
        console.error('❌ Failed to fetch sessions:', response.status, response.statusText);
        
        // Try to load from cache if backend fails
        try {
          const cached = localStorage.getItem(`manager_sessions_${branchId}_${selectedActivity}`);
          if (cached) {
            const cachedData = JSON.parse(cached);
            setSessions(cachedData);
            showToastMessage('Loaded cached sessions data');
            console.log('📦 Loaded sessions from cache');
          } else {
            showToastMessage('Failed to fetch sessions and no cached data available');
          }
        } catch (error) {
          showToastMessage('Failed to fetch sessions');
        }
      }
    } catch (error) {
      console.error('Error fetching sessions:', error);
      
      // Try to load from cache on network error
      try {
        const cached = localStorage.getItem(`manager_sessions_${branchId}_${selectedActivity}`);
        if (cached) {
          const cachedData = JSON.parse(cached);
          setSessions(cachedData);
          showToastMessage('Network error - loaded cached sessions');
          console.log('📦 Network error, loaded sessions from cache');
        } else {
          showToastMessage('Network error and no cached data available');
        }
      } catch (cacheError) {
        showToastMessage('Error fetching sessions');
      }
    } finally {
      setLoading(false);
    }
  };

  // Create session
  const createSession = async (sessionData: Partial<Session>) => {
    try {
      const token = localStorage.getItem('token');
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const response = await fetch(`${apiBase}/sessions`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ ...sessionData, branchId })
      });

      if (response.ok) {
        showToastMessage('Session created successfully');
        fetchNext10DaysSessions();
        return true;
      } else {
        const error = await response.json();
        showToastMessage(error.message || 'Failed to create session');
        return false;
      }
    } catch (error) {
      console.error('Error creating session:', error);
      showToastMessage('Error creating session');
      return false;
    }
  };

  // Update session
  const updateSession = async (sessionId: string, sessionData: Partial<Session>) => {
    try {
      const token = localStorage.getItem('token');
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const response = await fetch(`${apiBase}/sessions/${sessionId}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify(sessionData)
      });

      if (response.ok) {
        showToastMessage('Session updated successfully');
        fetchNext10DaysSessions();
        return true;
      } else {
        const error = await response.json();
        showToastMessage(error.message || 'Failed to update session');
        return false;
      }
    } catch (error) {
      console.error('Error updating session:', error);
      showToastMessage('Error updating session');
      return false;
    }
  };

  // Delete session
  const deleteSession = async (sessionId: string) => {
    if (!confirm('Are you sure you want to delete this session?')) return;

    try {
      const token = localStorage.getItem('token');
      const headers: Record<string, string> = {};
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const response = await fetch(`${apiBase}/sessions/${sessionId}`, {
        method: 'DELETE',
        headers
      });

      if (response.ok) {
        showToastMessage('Session deleted successfully');
        fetchNext10DaysSessions();
      } else {
        const error = await response.json();
        showToastMessage(error.message || 'Failed to delete session');
      }
    } catch (error) {
      console.error('Error deleting session:', error);
      showToastMessage('Error deleting session');
    }
  };

  // Handle form submissions
  const handleAddSession = async () => {
    if (await createSession(newSession)) {
      setNewSession({
        branchId: branchId,
        date: selectedDate,
        activity: selectedActivity,
        time: '10:00',
        label: '10:00 AM',
        totalSeats: 15,
        type: selectedActivity === 'slime' ? 'Slime Play & Demo' : 'Small Tufting',
        ageGroup: selectedActivity === 'slime' ? '3+' : '15+',
        isActive: true,
        notes: ''
      });
      setShowAddModal(false);
    }
  };

  const handleUpdateSession = async () => {
    if (editingSession && editingSession._id) {
      if (await updateSession(editingSession._id, editingSession)) {
        setEditingSession(null);
      }
    }
  };

  // Effect hooks
  useEffect(() => {
    if (branchId) {
      fetchNext10DaysSessions();
    }
  }, [branchId, selectedActivity]);

  // Auto-refresh sessions every 30 seconds for live updates
  useEffect(() => {
    if (!branchId) return;
    
    const interval = setInterval(() => {
      console.log('🔄 Auto-refreshing manager sessions...');
      fetchNext10DaysSessions();
    }, 30000); // Refresh every 30 seconds

    return () => clearInterval(interval);
  }, [branchId, selectedActivity]);

  useEffect(() => {
    setNewSession(prev => ({
      ...prev,
      branchId: branchId,
      date: selectedDate,
      activity: selectedActivity
    }));
  }, [branchId, selectedDate, selectedActivity]);

  // Filter sessions for selected date
  const sessionsForDate = sessions.filter(s => s.date === selectedDate && s.activity === selectedActivity);

  // Check if branch supports activity
  const branchSupportsActivity = (activity: 'slime' | 'tufting') => {
    if (!managerBranch) return false;
    return activity === 'slime' ? managerBranch.supportsSlime : managerBranch.supportsTufting;
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString(undefined, { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const toggleSessionExpansion = (sessionId: string) => {
    const newExpanded = new Set(expandedSessions);
    if (newExpanded.has(sessionId)) {
      newExpanded.delete(sessionId);
    } else {
      newExpanded.add(sessionId);
    }
    setExpandedSessions(newExpanded);
  };

  const openUserModal = async (session: Session) => {
    const id = (session as any)._id || (session as any).id;
    if (!id) {
      showToastMessage('Session id not available');
      return;
    }

    setModalLoading(true);
    setShowUserModal(true);
    try {
      const resp = await fetch(`${apiBase}/sessions/${id}`);
      if (!resp.ok) {
        showToastMessage('Failed to fetch session users');
        setModalSession(session);
        return;
      }
      const info = await resp.json();
      const users = info.users || info.registeredUsers || [];
      setModalSession({ ...session, registeredUsers: users });
      if (!users || users.length === 0) {
        showToastMessage('No registered users for this session');
      }
    } catch (err) {
      console.warn('Error fetching session users', err);
      showToastMessage('Network error fetching session users');
      setModalSession(session);
    } finally {
      setModalLoading(false);
    }
  };

  const closeUserModal = () => {
    setModalSession(null);
    setShowUserModal(false);
  };

  if (!managerBranch) {
    return (
      <div className="p-6 text-center">
        <AlertCircle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No Branch Assigned</h3>
        <p className="text-gray-600">You are not assigned to any branch. Please contact an administrator.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-2xl font-bold text-gray-800">Session Management</h3>
          <p className="text-gray-600">Manage sessions for {managerBranch.name}</p>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={fetchNext10DaysSessions}
            disabled={loading}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center space-x-2"
          >
            <div className={`h-4 w-4 ${loading ? 'animate-spin rounded-full border-2 border-white border-t-transparent' : ''}`}>
              {!loading && '🔄'}
            </div>
            <span>Refresh</span>
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center space-x-2"
          >
            <Plus className="h-4 w-4" />
            <span>Add Session</span>
          </button>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Activity Selector */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Activity</label>
            <div className="flex space-x-2">
              <button
                onClick={() => setSelectedActivity('slime')}
                disabled={!branchSupportsActivity('slime')}
                className={`flex-1 py-2 px-4 rounded-md transition-colors ${
                  selectedActivity === 'slime'
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                } ${!branchSupportsActivity('slime') ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                Slime
              </button>
              <button
                onClick={() => setSelectedActivity('tufting')}
                disabled={!branchSupportsActivity('tufting')}
                className={`flex-1 py-2 px-4 rounded-md transition-colors ${
                  selectedActivity === 'tufting'
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                } ${!branchSupportsActivity('tufting') ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                Tufting
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Date Selector */}
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <h4 className="text-lg font-semibold mb-4">Select Date</h4>
        <div className="grid grid-cols-5 md:grid-cols-10 gap-2">
          {next10Days.map((date) => {
            const dateObj = new Date(date);
            const isMonday = dateObj.getDay() === 1;
            const isSelected = selectedDate === date;
            const branch = managerBranch;
            const allowMonday = (branch?.location || branch?.name || '').toLowerCase().includes('vijayawada');
            
            return (
              <button
                key={date}
                onClick={() => setSelectedDate(date)}
                className={`p-3 rounded-lg text-center transition-all ${
                  isSelected
                    ? 'bg-purple-600 text-white'
                    : (isMonday && !allowMonday)
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-gray-50 hover:bg-gray-100'
                }`}
                disabled={isMonday && !allowMonday}
              >
                <div className="text-xs font-medium">
                  {formatDate(date)}
                </div>
                <div className="text-lg font-bold">
                  {dateObj.getDate()}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Sessions Display */}
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <h4 className="text-lg font-semibold">
            {selectedActivity.charAt(0).toUpperCase() + selectedActivity.slice(1)} Sessions - {formatDate(selectedDate)}
          </h4>
          {!branchSupportsActivity(selectedActivity) && (
            <div className="flex items-center text-amber-600">
              <AlertCircle className="h-4 w-4 mr-1" />
              <span className="text-sm">This branch doesn't support {selectedActivity}</span>
            </div>
          )}
        </div>

        {loading ? (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mb-4"></div>
            <p className="text-gray-600 mb-2">Loading sessions...</p>
            <p className="text-sm text-gray-500">
              Fetching {selectedActivity} sessions for {managerBranch.name}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {sessionsForDate.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Calendar className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>No sessions found for this date</p>
                <button
                  onClick={() => setShowAddModal(true)}
                  className="mt-3 text-purple-600 hover:underline"
                >
                  Add Session for {formatDate(selectedDate)}
                </button>
              </div>
            ) : (
              <>
                {sessionsForDate.map((session) => (
                  <div
                    key={session._id}
                    className="border rounded-lg hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => openUserModal(session)}
                  >
                    <div className="p-4">
                      <div className="flex justify-between items-center">
                        <div className="flex-1">
                          <div className="flex items-center space-x-4">
                            <div className="flex items-center text-gray-600">
                              <Clock className="h-4 w-4 mr-1" />
                              <span className="font-medium">{session.label || session.time}</span>
                            </div>
                            <div className="text-sm text-gray-500">
                              {session.type} • {session.ageGroup}
                            </div>
                            <div className="flex items-center">
                              <Users className="h-4 w-4 mr-1 text-gray-400" />
                              <span className={`text-sm font-medium ${
                                session.availableSeats === 0 ? 'text-red-600' :
                                session.availableSeats <= 3 ? 'text-amber-600' : 'text-green-600'
                              }`}>
                                {session.availableSeats}/{session.totalSeats} available
                              </span>
                            </div>
                            <div className="text-sm text-gray-500">
                              {session.bookedSeats} booked
                            </div>
                            {!session.isActive && (
                              <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                                Inactive
                              </span>
                            )}
                          </div>
                          {session.notes && (
                            <p className="text-sm text-gray-600 mt-1">{session.notes}</p>
                          )}
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          {session.registeredUsers && session.registeredUsers.length > 0 && (
                            <button
                              onClick={(e) => { e.stopPropagation(); toggleSessionExpansion(session._id!); }}
                              className="text-blue-600 hover:text-blue-800 transition-colors text-sm"
                            >
                              {expandedSessions.has(session._id!) ? 'Hide Users' : 'Show Users'}
                            </button>
                          )}
                          <button
                            onClick={(e) => { e.stopPropagation(); setEditingSession(session); }}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                            title="Edit session"
                          >
                            <Edit2 className="h-4 w-4" />
                          </button>
                          <button
                            onClick={(e) => { e.stopPropagation(); session._id && deleteSession(session._id); }}
                            className="p-2 text-red-600 hover:bg-red-50 rounded"
                            title="Delete session"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                    
                    {/* Expanded User List */}
                    {expandedSessions.has(session._id!) && session.registeredUsers && (
                      <div className="border-t bg-gray-50 p-4">
                        <h5 className="text-sm font-semibold text-gray-700 mb-3">
                          Registered Users ({session.registeredUsers.length})
                        </h5>
                        <div className="space-y-2">
                          {session.registeredUsers.map((user, index) => (
                            <div key={index} className="flex justify-between items-center bg-white p-2 rounded">
                              <div>
                                <span className="font-medium text-gray-900">{user.customerName}</span>
                                <span className="text-gray-600 text-sm ml-2">({user.customerEmail})</span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <span className="text-sm text-gray-500">{user.seats} seat{user.seats > 1 ? 's' : ''}</span>
                                {user.isVerified ? (
                                  <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                                    Verified
                                  </span>
                                ) : (
                                  <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                                    Pending
                                  </span>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </>
            )}
          </div>
        )}
      </div>

      {/* Add Session Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Add New Session</h3>
              <button onClick={() => setShowAddModal(false)}>
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Time</label>
                <input
                  type="time"
                  value={newSession.time || ''}
                  onChange={(e) => setNewSession({ ...newSession, time: e.target.value })}
                  className="w-full border rounded-md px-3 py-2"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Label</label>
                <input
                  type="text"
                  value={newSession.label || ''}
                  onChange={(e) => setNewSession({ ...newSession, label: e.target.value })}
                  placeholder="e.g., 10:00 AM"
                  className="w-full border rounded-md px-3 py-2"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Total Seats</label>
                <input
                  type="number"
                  value={newSession.totalSeats || ''}
                  onChange={(e) => setNewSession({ ...newSession, totalSeats: parseInt(e.target.value) })}
                  min="1"
                  className="w-full border rounded-md px-3 py-2"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Type</label>
                <input
                  type="text"
                  value={newSession.type || ''}
                  onChange={(e) => setNewSession({ ...newSession, type: e.target.value })}
                  placeholder="e.g., Slime Play & Demo"
                  className="w-full border rounded-md px-3 py-2"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Age Group</label>
                <input
                  type="text"
                  value={newSession.ageGroup || ''}
                  onChange={(e) => setNewSession({ ...newSession, ageGroup: e.target.value })}
                  placeholder="e.g., 3+, 8+, 15+"
                  className="w-full border rounded-md px-3 py-2"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Notes (optional)</label>
                <textarea
                  value={newSession.notes || ''}
                  onChange={(e) => setNewSession({ ...newSession, notes: e.target.value })}
                  className="w-full border rounded-md px-3 py-2"
                  rows={2}
                />
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={newSession.isActive || false}
                  onChange={(e) => setNewSession({ ...newSession, isActive: e.target.checked })}
                  className="mr-2"
                />
                <label className="text-sm">Active (visible to customers)</label>
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 text-gray-600 border rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleAddSession}
                className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
              >
                Add Session
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Session Modal */}
      {editingSession && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Edit Session</h3>
              <button onClick={() => setEditingSession(null)}>
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Time</label>
                <input
                  type="time"
                  value={editingSession.time}
                  onChange={(e) => setEditingSession({ ...editingSession, time: e.target.value })}
                  className="w-full border rounded-md px-3 py-2"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Label</label>
                <input
                  type="text"
                  value={editingSession.label || ''}
                  onChange={(e) => setEditingSession({ ...editingSession, label: e.target.value })}
                  className="w-full border rounded-md px-3 py-2"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Total Seats</label>
                <input
                  type="number"
                  value={editingSession.totalSeats}
                  onChange={(e) => setEditingSession({ ...editingSession, totalSeats: parseInt(e.target.value) })}
                  min={editingSession.bookedSeats}
                  className="w-full border rounded-md px-3 py-2"
                />
                {editingSession.bookedSeats > 0 && (
                  <p className="text-xs text-gray-500 mt-1">
                    Minimum: {editingSession.bookedSeats} (current bookings)
                  </p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Type</label>
                <input
                  type="text"
                  value={editingSession.type}
                  onChange={(e) => setEditingSession({ ...editingSession, type: e.target.value })}
                  className="w-full border rounded-md px-3 py-2"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Age Group</label>
                <input
                  type="text"
                  value={editingSession.ageGroup}
                  onChange={(e) => setEditingSession({ ...editingSession, ageGroup: e.target.value })}
                  className="w-full border rounded-md px-3 py-2"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Notes</label>
                <textarea
                  value={editingSession.notes || ''}
                  onChange={(e) => setEditingSession({ ...editingSession, notes: e.target.value })}
                  className="w-full border rounded-md px-3 py-2"
                  rows={2}
                />
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={editingSession.isActive}
                  onChange={(e) => setEditingSession({ ...editingSession, isActive: e.target.checked })}
                  className="mr-2"
                />
                <label className="text-sm">Active (visible to customers)</label>
              </div>
              
              {editingSession.bookedSeats > 0 && (
                <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
                  <p className="text-sm text-blue-700">
                    This session has {editingSession.bookedSeats} confirmed bookings.
                  </p>
                </div>
              )}
            </div>
            
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setEditingSession(null)}
                className="px-4 py-2 text-gray-600 border rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateSession}
                className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Registered Users Modal */}
      {showUserModal && modalSession && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Registered Users - {modalSession.label || modalSession.time}</h3>
              <button onClick={closeUserModal}>
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-3 max-h-96 overflow-y-auto">
              {modalLoading ? (
                <div className="text-center py-8">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mb-4"></div>
                  <p className="text-gray-600">Loading users...</p>
                </div>
              ) : modalSession?.registeredUsers && modalSession.registeredUsers.length > 0 ? (
                modalSession.registeredUsers.map((u, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                    <div>
                      <p className="font-medium text-gray-900">{u.customerName}</p>
                      <p className="text-xs text-gray-600">{u.customerEmail} • {u.seats} seat{u.seats > 1 ? 's' : ''}</p>
                      {u.verifiedAt && <p className="text-xs text-green-600">Verified at {new Date(u.verifiedAt).toLocaleString()}</p>}
                    </div>
                    <div className="text-sm text-gray-600">
                      {u.isVerified ? (
                        <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Verified</span>
                      ) : (
                        <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">Pending</span>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center text-gray-500 p-6">No registered users for this session.</div>
              )}
            </div>

            <div className="flex justify-end mt-6">
              <button onClick={closeUserModal} className="px-4 py-2 bg-gray-200 rounded-md">Close</button>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {showToast && (
        <div className="fixed bottom-6 right-6 bg-gray-900 text-white px-4 py-2 rounded shadow-lg z-50">
          {toastMessage}
        </div>
      )}
    </div>
  );
};

export default ManagerSessionManagement;
