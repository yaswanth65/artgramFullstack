import React, { useState } from 'react';
import { useData } from '../../contexts/DataContext';
import { 
  Calendar, 
  Clock, 
  Users, 
  MapPin,
  Plus, 
  Edit, 
  Trash2, 
  Save, 
  X,
  Eye,
  EyeOff,
  AlertTriangle
} from 'lucide-react';

const SessionManagement: React.FC = () => {
  const { 
    events, 
    branches,
    addEvent, 
    updateEvent, 
    deleteEvent 
  } = useData();

  const [showAddModal, setShowAddModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState<any>(null);
  const [newEvent, setNewEvent] = useState({
    title: '',
    description: '',
    branchId: '',
    date: '',
    time: '',
    duration: 60,
    maxSeats: 10,
    price: 0,
    materials: [''],
    isActive: true
  });

  // Calculate if event is within one week
  const isWithinOneWeek = (eventDate: string) => {
    const today = new Date();
    const eventDateObj = new Date(eventDate);
    const diffTime = eventDateObj.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 7 && diffDays >= 0;
  };

  const handleAddEvent = async () => {
    if (newEvent.title && newEvent.description && newEvent.branchId && newEvent.date && newEvent.time) {
      const filteredMaterials = newEvent.materials.filter(mat => mat.trim() !== '');
      
      await addEvent({
        ...newEvent,
        bookedSeats: 0,
        materials: filteredMaterials.length > 0 ? filteredMaterials : ['Basic materials']
      });
      
      setNewEvent({
        title: '',
        description: '',
        branchId: '',
        date: '',
        time: '',
        duration: 60,
        maxSeats: 10,
        price: 0,
        materials: [''],
        isActive: true
      });
      setShowAddModal(false);
    }
  };

  const handleUpdateEvent = async () => {
    if (editingEvent) {
      const filteredMaterials = editingEvent.materials.filter((mat: string) => mat.trim() !== '');
      
      await updateEvent({
        ...editingEvent,
        materials: filteredMaterials.length > 0 ? filteredMaterials : ['Basic materials']
      });
      setEditingEvent(null);
    }
  };

  const handleDeleteEvent = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this session? This action cannot be undone.')) {
      await deleteEvent(id);
    }
  };

  const getBranchName = (branchId: string) => {
    const branch = branches.find(b => b.id === branchId);
    return branch ? branch.name : 'Unknown Branch';
  };

  const addMaterialField = (isEditing = false) => {
    if (isEditing && editingEvent) {
      setEditingEvent({
        ...editingEvent,
        materials: [...editingEvent.materials, '']
      });
    } else {
      setNewEvent({
        ...newEvent,
        materials: [...newEvent.materials, '']
      });
    }
  };

  const removeMaterialField = (index: number, isEditing = false) => {
    if (isEditing && editingEvent) {
      const newMaterials = editingEvent.materials.filter((_: any, i: number) => i !== index);
      setEditingEvent({
        ...editingEvent,
        materials: newMaterials.length > 0 ? newMaterials : ['']
      });
    } else {
      const newMaterials = newEvent.materials.filter((_, i) => i !== index);
      setNewEvent({
        ...newEvent,
        materials: newMaterials.length > 0 ? newMaterials : ['']
      });
    }
  };

  const updateMaterialField = (index: number, value: string, isEditing = false) => {
    if (isEditing && editingEvent) {
      const newMaterials = [...editingEvent.materials];
      newMaterials[index] = value;
      setEditingEvent({
        ...editingEvent,
        materials: newMaterials
      });
    } else {
      const newMaterials = [...newEvent.materials];
      newMaterials[index] = value;
      setNewEvent({
        ...newEvent,
        materials: newMaterials
      });
    }
  };

  // Get minimum date (today)
  const getMinDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-2xl font-bold text-gray-800">Session Management</h3>
          <p className="text-gray-600">Manage all classes and workshops across branches</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>Add Session</span>
        </button>
      </div>

      {/* Sessions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map(event => {
          const branch = branches.find(b => b.id === event.branchId);
          const availableSeats = event.maxSeats - event.bookedSeats;
          const isUpcoming = new Date(event.date) > new Date();
          const withinOneWeek = isWithinOneWeek(event.date);
          
          return (
            <div key={event.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className={`p-4 text-white ${
                isUpcoming ? 'bg-gradient-to-r from-purple-500 to-blue-600' : 'bg-gradient-to-r from-gray-500 to-gray-600'
              }`}>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-lg font-bold">{event.title}</h4>
                  <div className="flex items-center space-x-1">
                    {event.isActive ? (
                      <Eye className="h-4 w-4 text-green-300" />
                    ) : (
                      <EyeOff className="h-4 w-4 text-red-300" />
                    )}
                    {withinOneWeek && (
                      <AlertTriangle className="h-4 w-4 text-yellow-300" />
                    )}
                  </div>
                </div>
                <p className="text-sm opacity-90">{event.description}</p>
              </div>

              <div className="p-4 space-y-3">
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-600">
                    {new Date(event.date).toLocaleDateString()}
                  </span>
                  {!isUpcoming && (
                    <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs">Past</span>
                  )}
                </div>

                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-600">{event.time} ({event.duration} min)</span>
                </div>

                <div className="flex items-center space-x-2">
                  <Users className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-600">
                    {availableSeats} / {event.maxSeats} seats available
                  </span>
                </div>

                <div className="flex items-center space-x-2">
                  <MapPin className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-600">{getBranchName(event.branchId)}</span>
                </div>

                {/* Materials */}
                <div className="bg-gray-50 p-3 rounded-lg">
                  <h5 className="font-semibold text-gray-800 mb-2 text-sm">Materials:</h5>
                  <div className="flex flex-wrap gap-1">
                    {event.materials.slice(0, 3).map((material, index) => (
                      <span key={index} className="bg-purple-100 text-purple-800 px-2 py-1 rounded text-xs">
                        {material}
                      </span>
                    ))}
                    {event.materials.length > 3 && (
                      <span className="text-gray-500 text-xs">+{event.materials.length - 3} more</span>
                    )}
                  </div>
                </div>

                {/* Booking Progress */}
                <div>
                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>Bookings</span>
                    <span>{event.bookedSeats}/{event.maxSeats}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${
                        availableSeats > 5 ? 'bg-green-500' :
                        availableSeats > 2 ? 'bg-yellow-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${(event.bookedSeats / event.maxSeats) * 100}%` }}
                    ></div>
                  </div>
                </div>

                <div className="flex justify-between items-center pt-3 border-t border-gray-200">
                  <div className="flex items-center space-x-2">
                    <span className="text-xl font-bold text-purple-600">₹{event.price}</span>
                    {withinOneWeek && (
                      <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs font-medium">
                        Soon
                      </span>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      event.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {event.isActive ? 'Active' : 'Inactive'}
                    </span>
                    <div className="flex space-x-1">
                      <button
                        onClick={() => setEditingEvent(event)}
                        className="text-blue-600 hover:text-blue-800 transition-colors"
                        disabled={withinOneWeek}
                        title={withinOneWeek ? 'Cannot edit sessions within one week' : 'Edit session'}
                      >
                        <Edit className={`h-4 w-4 ${withinOneWeek ? 'opacity-50' : ''}`} />
                      </button>
                      <button
                        onClick={() => handleDeleteEvent(event.id)}
                        className="text-red-600 hover:text-red-800 transition-colors"
                        disabled={withinOneWeek || event.bookedSeats > 0}
                        title={
                          withinOneWeek ? 'Cannot delete sessions within one week' :
                          event.bookedSeats > 0 ? 'Cannot delete sessions with bookings' :
                          'Delete session'
                        }
                      >
                        <Trash2 className={`h-4 w-4 ${(withinOneWeek || event.bookedSeats > 0) ? 'opacity-50' : ''}`} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Session Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-900">Add New Session</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Session Title *</label>
                  <input
                    type="text"
                    value={newEvent.title}
                    onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="e.g., Daily Slime Making Class"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Branch *</label>
                  <select
                    value={newEvent.branchId}
                    onChange={(e) => setNewEvent({ ...newEvent, branchId: e.target.value })}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="">Select Branch</option>
                    {branches.map(branch => (
                      <option key={branch.id} value={branch.id}>{branch.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
                <textarea
                  value={newEvent.description}
                  onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                  rows={3}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Describe what participants will learn and do"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Date *</label>
                  <input
                    type="date"
                    value={newEvent.date}
                    onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                    min={getMinDate()}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Time *</label>
                  <input
                    type="time"
                    value={newEvent.time}
                    onChange={(e) => setNewEvent({ ...newEvent, time: e.target.value })}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Duration (minutes) *</label>
                  <input
                    type="number"
                    value={newEvent.duration}
                    onChange={(e) => setNewEvent({ ...newEvent, duration: parseInt(e.target.value) || 60 })}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    min="30"
                    step="15"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Max Seats *</label>
                  <input
                    type="number"
                    value={newEvent.maxSeats}
                    onChange={(e) => setNewEvent({ ...newEvent, maxSeats: parseInt(e.target.value) || 10 })}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    min="1"
                    max="50"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Price (₹) *</label>
                  <input
                    type="number"
                    value={newEvent.price}
                    onChange={(e) => setNewEvent({ ...newEvent, price: parseFloat(e.target.value) || 0 })}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    min="0"
                    step="50"
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium text-gray-700">Materials Included</label>
                  <button
                    onClick={() => addMaterialField(false)}
                    className="text-purple-600 hover:text-purple-800 text-sm flex items-center space-x-1"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Add Material</span>
                  </button>
                </div>
                <div className="space-y-2">
                  {newEvent.materials.map((material, index) => (
                    <div key={index} className="flex space-x-2">
                      <input
                        type="text"
                        value={material}
                        onChange={(e) => updateMaterialField(index, e.target.value, false)}
                        className="flex-1 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder="e.g., Glue, Colors, Glitter"
                      />
                      {newEvent.materials.length > 1 && (
                        <button
                          onClick={() => removeMaterialField(index, false)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <X className="h-5 w-5" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={newEvent.isActive}
                  onChange={(e) => setNewEvent({ ...newEvent, isActive: e.target.checked })}
                  className="mr-2"
                />
                <label htmlFor="isActive" className="text-sm font-medium text-gray-700">
                  Active Session (visible to customers)
                </label>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
                <h4 className="font-semibold text-yellow-800 mb-2">📅 Session Management Rules</h4>
                <ul className="text-sm text-yellow-700 space-y-1">
                  <li>• Sessions cannot be edited or deleted within one week of the scheduled date</li>
                  <li>• Sessions with existing bookings cannot be deleted</li>
                  <li>• Minimum session duration is 30 minutes</li>
                  <li>• Maximum capacity is 50 participants per session</li>
                </ul>
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAddEvent}
                className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
              >
                Add Session
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Session Modal */}
      {editingEvent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-900">Edit Session</h3>
              <button
                onClick={() => setEditingEvent(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Session Title *</label>
                  <input
                    type="text"
                    value={editingEvent.title}
                    onChange={(e) => setEditingEvent({ ...editingEvent, title: e.target.value })}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Branch *</label>
                  <select
                    value={editingEvent.branchId}
                    onChange={(e) => setEditingEvent({ ...editingEvent, branchId: e.target.value })}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="">Select Branch</option>
                    {branches.map(branch => (
                      <option key={branch.id} value={branch.id}>{branch.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
                <textarea
                  value={editingEvent.description}
                  onChange={(e) => setEditingEvent({ ...editingEvent, description: e.target.value })}
                  rows={3}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Date *</label>
                  <input
                    type="date"
                    value={editingEvent.date}
                    onChange={(e) => setEditingEvent({ ...editingEvent, date: e.target.value })}
                    min={getMinDate()}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Time *</label>
                  <input
                    type="time"
                    value={editingEvent.time}
                    onChange={(e) => setEditingEvent({ ...editingEvent, time: e.target.value })}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Duration (minutes) *</label>
                  <input
                    type="number"
                    value={editingEvent.duration}
                    onChange={(e) => setEditingEvent({ ...editingEvent, duration: parseInt(e.target.value) || 60 })}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    min="30"
                    step="15"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Max Seats *</label>
                  <input
                    type="number"
                    value={editingEvent.maxSeats}
                    onChange={(e) => setEditingEvent({ ...editingEvent, maxSeats: parseInt(e.target.value) || 10 })}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    min={editingEvent.bookedSeats || 1}
                    max="50"
                  />
                  {editingEvent.bookedSeats > 0 && (
                    <p className="text-xs text-gray-500 mt-1">
                      Minimum: {editingEvent.bookedSeats} (current bookings)
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Price (₹) *</label>
                  <input
                    type="number"
                    value={editingEvent.price}
                    onChange={(e) => setEditingEvent({ ...editingEvent, price: parseFloat(e.target.value) || 0 })}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    min="0"
                    step="50"
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium text-gray-700">Materials Included</label>
                  <button
                    onClick={() => addMaterialField(true)}
                    className="text-purple-600 hover:text-purple-800 text-sm flex items-center space-x-1"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Add Material</span>
                  </button>
                </div>
                <div className="space-y-2">
                  {editingEvent.materials.map((material: string, index: number) => (
                    <div key={index} className="flex space-x-2">
                      <input
                        type="text"
                        value={material}
                        onChange={(e) => updateMaterialField(index, e.target.value, true)}
                        className="flex-1 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder="e.g., Glue, Colors, Glitter"
                      />
                      {editingEvent.materials.length > 1 && (
                        <button
                          onClick={() => removeMaterialField(index, true)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <X className="h-5 w-5" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="editIsActive"
                  checked={editingEvent.isActive}
                  onChange={(e) => setEditingEvent({ ...editingEvent, isActive: e.target.checked })}
                  className="mr-2"
                />
                <label htmlFor="editIsActive" className="text-sm font-medium text-gray-700">
                  Active Session (visible to customers)
                </label>
              </div>

              {editingEvent.bookedSeats > 0 && (
                <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
                  <h4 className="font-semibold text-blue-800 mb-2">📋 Current Bookings</h4>
                  <p className="text-sm text-blue-700">
                    This session has {editingEvent.bookedSeats} confirmed bookings. 
                    Be careful when making changes that might affect existing customers.
                  </p>
                </div>
              )}
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setEditingEvent(null)}
                className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateEvent}
                className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors flex items-center space-x-2"
              >
                <Save className="h-4 w-4" />
                <span>Save Changes</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SessionManagement;