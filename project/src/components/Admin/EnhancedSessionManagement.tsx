import React, { useState, useEffect } from 'react';
import { useData } from '../../contexts/DataContext';
import { Plus, X, Save, Trash2, Edit2, Users, Clock, Calendar, AlertCircle } from 'lucide-react';

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
}

const EnhancedSessionManagement: React.FC = () => {
  const { branches, selectedBranch, setSelectedBranch } = useData();
  
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedBranchId, setSelectedBranchId] = useState<string>(
    selectedBranch || (branches.length ? branches[0].id : '')
  );
  const [selectedActivity, setSelectedActivity] = useState<'slime' | 'tufting'>('slime');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingSession, setEditingSession] = useState<Session | null>(null);
  const [toastMessage, setToastMessage] = useState('');
  const [showToast, setShowToast] = useState(false);
  
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
    branchId: selectedBranchId,
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

  const [qrCode, setQrCode] = useState('');

  // API base URL
  const apiBase = (import.meta as any).env?.VITE_API_URL || '/api';

  const showToastMessage = (message: string) => {
    setToastMessage(message);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  // Fetch sessions for next 10 days
  const fetchNext10DaysSessions = async () => {
    if (!selectedBranchId) return;
    
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const headers: Record<string, string> = {};
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const response = await fetch(
        `${apiBase}/sessions/next-10-days/${selectedBranchId}?activity=${selectedActivity}`,
        { headers }
      );
      
      if (response.ok) {
        const data = await response.json();
        setSessions(data);
      } else {
        showToastMessage('Failed to fetch sessions');
      }
    } catch (error) {
      console.error('Error fetching sessions:', error);
      showToastMessage('Error fetching sessions');
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
        body: JSON.stringify(sessionData)
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

  // Verify QR code
  const verifyQRCode = async () => {
    if (!qrCode.trim()) {
      showToastMessage('Please enter a QR code');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const response = await fetch(`${apiBase}/bookings/verify-qr`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ qrCode: qrCode.trim() })
      });

      if (response.ok) {
        const result = await response.json();
        showToastMessage('Booking verified successfully');
        setQrCode('');
        fetchNext10DaysSessions(); // Refresh to show updated seat counts
      } else {
        const error = await response.json();
        showToastMessage(error.message || 'Invalid QR code');
      }
    } catch (error) {
      console.error('Error verifying QR code:', error);
      showToastMessage('Error verifying QR code');
    }
  };

  // Handle form submissions
  const handleAddSession = async () => {
    if (await createSession(newSession)) {
      setNewSession({
        branchId: selectedBranchId,
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
    if (selectedBranchId) {
      setSelectedBranch(selectedBranchId);
      fetchNext10DaysSessions();
    }
  }, [selectedBranchId, selectedActivity]);

  useEffect(() => {
    setNewSession(prev => ({
      ...prev,
      branchId: selectedBranchId,
      date: selectedDate,
      activity: selectedActivity
    }));
  }, [selectedBranchId, selectedDate, selectedActivity]);

  // Filter sessions for selected date
  const sessionsForDate = sessions.filter(s => s.date === selectedDate && s.activity === selectedActivity);

  // Check if branch supports activity
  const branchSupportsActivity = (activity: 'slime' | 'tufting') => {
    const branch = branches.find(b => b.id === selectedBranchId);
    if (!branch) return false;
    return activity === 'slime' ? branch.supportsSlime : branch.supportsTufting;
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString(undefined, { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-2xl font-bold text-gray-800">Enhanced Session Management</h3>
          <p className="text-gray-600">Manage all activity sessions with real-time seat tracking</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>Add Session</span>
        </button>
      </div>

      {/* Controls */}
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Branch Selector */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Branch</label>
            <select
              value={selectedBranchId}
              onChange={(e) => setSelectedBranchId(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-purple-500"
            >
              {branches.map(branch => (
                <option key={branch.id} value={branch.id}>{branch.name}</option>
              ))}
            </select>
          </div>

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

          {/* QR Verification */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">QR Verification</label>
            <div className="flex space-x-2">
              <input
                type="text"
                value={qrCode}
                onChange={(e) => setQrCode(e.target.value)}
                placeholder="Enter QR code"
                className="flex-1 border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-purple-500"
              />
              <button
                onClick={verifyQRCode}
                className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
              >
                Verify
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
            
            return (
              <button
                key={date}
                onClick={() => setSelectedDate(date)}
                className={`p-3 rounded-lg text-center transition-all ${
                  isSelected
                    ? 'bg-purple-600 text-white'
                    : isMonday
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-gray-50 hover:bg-gray-100'
                }`}
                disabled={isMonday}
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
            <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-purple-600"></div>
            <p className="mt-2 text-gray-600">Loading sessions...</p>
          </div>
        ) : (
          <div className="space-y-3">
            {sessionsForDate.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Calendar className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>No sessions found for this date</p>
                <button
                  onClick={() => setShowAddModal(true)}
                  className="mt-2 text-purple-600 hover:underline"
                >
                  Create your first session
                </button>
              </div>
            ) : (
              sessionsForDate.map((session) => (
                <div
                  key={session._id}
                  className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                >
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
                    
                    <div className="flex space-x-2">
                      <button
                        onClick={() => setEditingSession(session)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => session._id && deleteSession(session._id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
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

      {/* Toast */}
      {showToast && (
        <div className="fixed bottom-6 right-6 bg-gray-900 text-white px-4 py-2 rounded shadow-lg z-50">
          {toastMessage}
        </div>
      )}
    </div>
  );
};

export default EnhancedSessionManagement;
