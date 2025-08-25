import React, { useState } from 'react';
import { useData } from '../../contexts/DataContext';
import type { Event } from '../../types';
import { Plus, X, Save } from 'lucide-react';

const SessionManagement: React.FC = () => {
  const { branches, addEvent, updateEvent, selectedBranch, setSelectedBranch, updateSlotsForDate, getSlotsForDate, getBranchAvailability, updateBranchAvailability, verifyQRCode } = useData();

  // Types for slots and activity state
  type Slot = {
    time: string;
    label: string;
    available: number;
    total: number;
    type: string;
    age: string;
    // price removed: admin does not set price; it's defined by customer's selected plan
    price?: number;
  };

  type ActivitySlots = Record<string, { slime: Slot[]; tufting: Slot[] }>;

  const [showAddModal, setShowAddModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
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

  // 9-day calendar view for Slime and Tufting sessions
  const today = new Date();
  const nineDays = Array.from({ length: 9 }, (_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    return d;
  });

  // Example: session slots state (should be fetched/synced with backend in real app)
  const [activitySlots, setActivitySlots] = useState<ActivitySlots>(() => {
    // Example structure: { 'YYYY-MM-DD': { slime: [slotObj], tufting: [slotObj] } }
    const slots: ActivitySlots = {};
    nineDays.forEach(date => {
      const key = date.toISOString().split('T')[0];
      slots[key] = {
        slime: [
          { time: '10:00', label: '10:00 AM', available: 12, total: 15, type: 'Slime Play', age: '3+' },
          { time: '11:30', label: '11:30 AM', available: 8, total: 15, type: 'Slime Making', age: '8+' },
        ],
        tufting: [
          { time: '12:00', label: '12:00 PM', available: 5, total: 8, type: 'Small', age: 'All' },
          { time: '15:00', label: '3:00 PM', available: 2, total: 8, type: 'Medium', age: 'All' },
        ]
      };
    });
    return slots;
  });

  const [isSaving, setIsSaving] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState<'slime' | 'tufting'>('slime');
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // Admin UI state
  const [selectedBranchId, setSelectedBranchId] = useState<string>(selectedBranch || (branches.length ? branches[0].id : ''));
  const [selectedDate, setSelectedDate] = useState<string>(nineDays[0].toISOString().split('T')[0]);
  const [preview, setPreview] = useState(false);

  // Load saved slots for branch+date if present
  React.useEffect(() => {
    const saved = getSlotsForDate(selectedBranchId, selectedDate);
    if (saved) {
      setActivitySlots(prev => ({ ...prev, [selectedDate]: saved }));
    }
  }, [selectedBranchId, selectedDate, getSlotsForDate]);

  // Prefill activitySlots for all nineDays from DataContext when branch changes
  React.useEffect(() => {
    const fill: ActivitySlots = { ...activitySlots };
    nineDays.forEach(date => {
      const key = date.toISOString().split('T')[0];
      const saved = getSlotsForDate(selectedBranchId, key);
      if (saved) {
        fill[key] = saved;
      } else if (!fill[key]) {
        // keep existing default if present
        fill[key] = activitySlots[key] || { slime: [], tufting: [] };
      }
    });
    setActivitySlots(fill);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedBranchId]);

  // branch availability state (allowMonday)
  const [allowMonday, setAllowMonday] = React.useState<boolean>(() => {
    const av = getBranchAvailability(selectedBranchId);
    return av ? av.allowMonday : false;
  });

  React.useEffect(() => {
    const av = getBranchAvailability(selectedBranchId);
    setAllowMonday(av ? av.allowMonday : false);
  }, [selectedBranchId, getBranchAvailability]);

  // Handler to update slot details
  const updateSlot = (dateKey: string, activity: 'slime' | 'tufting', slotIdx: number, field: keyof Slot, value: string | number) => {
    setActivitySlots((prev: ActivitySlots) => {
      const updated: ActivitySlots = { ...prev };
      updated[dateKey] = { ...updated[dateKey] };
      updated[dateKey][activity] = updated[dateKey][activity].map((slot: Slot, idx: number) =>
        idx === slotIdx ? { ...slot, [field]: value } as Slot : slot
      );
      return updated;
    });
  };

  // Handler to add a new slot
  const addSlot = (dateKey: string, activity: 'slime' | 'tufting') => {
    setActivitySlots((prev: ActivitySlots) => {
      const updated: ActivitySlots = { ...prev };
      updated[dateKey] = { ...updated[dateKey] };
      updated[dateKey][activity] = [
  ...updated[dateKey][activity],
  { time: '', label: '', available: 0, total: 0, type: '', age: '' }
      ];
      return updated;
    });
  };

  // Handler to remove a slot
  const removeSlot = (dateKey: string, activity: 'slime' | 'tufting', slotIdx: number) => {
    setActivitySlots((prev: ActivitySlots) => {
      const updated: ActivitySlots = { ...prev };
      updated[dateKey] = { ...updated[dateKey] };
      updated[dateKey][activity] = updated[dateKey][activity].filter((_, idx: number) => idx !== slotIdx);
      return updated;
    });
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

  // Deletion and branch name helpers are available via DataContext as needed.

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
      const newMaterials = editingEvent.materials.filter((_: string, i: number) => i !== index);
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


          // Branch selector + 9-Day Date Picker + Preview
          <div className="mb-8 bg-white rounded-2xl p-6 shadow">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
              <div className="flex items-center gap-3">
                  <label className="text-sm font-medium text-gray-600">Manage Branch:</label>
                  <select value={selectedBranchId} onChange={(e) => { setSelectedBranchId(e.target.value); setSelectedBranch(e.target.value); }} className="border rounded px-3 py-2">
                    {branches.map(b => (
                      <option key={b.id} value={b.id}>{b.name}</option>
                    ))}
                  </select>
                </div>
                <div className="flex items-center gap-3">
                  <label className="text-sm font-medium text-gray-600">Allow Monday Sessions:</label>
                  <input type="checkbox" checked={allowMonday} onChange={async (e) => {
                    const val = e.target.checked;
                    setAllowMonday(val);
                    try {
                      await updateBranchAvailability(selectedBranchId, { allowMonday: val });
                    } catch (err) {
                      console.error('Failed to update branch availability', err);
                    }
                  }} className="w-4 h-4" />
                </div>
              <div className="flex items-center gap-4">
                <label className="text-sm font-medium text-gray-600">Preview as customer</label>
                <input type="checkbox" checked={preview} onChange={(e) => setPreview(e.target.checked)} className="w-4 h-4" />
              </div>
            </div>

            <div className="overflow-x-auto">
              <div className="flex gap-4 min-w-[720px]">
                {nineDays.map((date) => {
                  const value = date.toISOString().split('T')[0];
                  const isMonday = date.getDay() === 1 && !allowMonday;
                  const selected = selectedDate === value;
                  return (
                    <div key={value} onClick={() => !isMonday && setSelectedDate(value)} className={`border-2 rounded-lg p-4 text-center cursor-pointer transition-all min-w-24 ${isMonday ? 'bg-gray-100 opacity-60 cursor-not-allowed' : selected ? 'border-green-400 bg-green-100 -translate-y-1 shadow-lg' : 'hover:border-green-400 hover:bg-green-50'}`}>
                      <div className="text-sm font-semibold">{date.toLocaleDateString(undefined, { weekday: 'short' })}</div>
                      <div className="text-xl font-bold my-1">{date.getDate()}</div>
                      <div className="text-xs">{date.toLocaleDateString(undefined, { month: 'short' })}</div>
                      {isMonday && <div className="text-xs text-red-500 mt-1">No Sessions</div>}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

      {/* Slots for selected date (editable) */}
      <div className="mb-10">
        <h4 className="text-2xl font-bold text-red-600 mb-4 text-center">Manage Slots for {new Date(selectedDate).toLocaleDateString()}</h4>

        {/* Activity selector */}
        <div className="flex justify-center gap-3 mb-4">
          <button onClick={() => setSelectedActivity('slime')} className={`px-4 py-2 rounded ${selectedActivity === 'slime' ? 'bg-green-600 text-white' : 'bg-white border'}`}>
            Slime
          </button>
          <button
            onClick={() => setSelectedActivity('tufting')}
            className={`px-4 py-2 rounded ${selectedActivity === 'tufting' ? 'bg-purple-600 text-white' : 'bg-white border'}`}
            disabled={(() => {
              const branch = branches.find(b => b.id === selectedBranchId);
              return branch ? branch.supportsTufting === false : false;
            })()}
          >
            Tufting
          </button>
        </div>

        {/* If tufting not supported show hint */}
        {selectedActivity === 'tufting' && (() => {
          const branch = branches.find(b => b.id === selectedBranchId);
          if (branch && branch.supportsTufting === false) {
            return <div className="text-center text-sm text-red-600 mb-4">Tufting is not available for the selected branch ({branch.name}).</div>;
          }
          return null;
        })()}

        <div className="grid grid-cols-1 gap-6">
          {/* Single activity editor */}
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className="flex justify-between items-center mb-3">
              <div className="font-semibold text-lg">{selectedActivity === 'slime' ? 'Slime Sessions' : 'Tufting Sessions'}</div>
              <button onClick={() => addSlot(selectedDate, selectedActivity)} className="text-sm text-green-600">+ Add Slot</button>
            </div>
            <div className="space-y-3">
              {(() => {
                const day = activitySlots[selectedDate];
                const slots = day ? (selectedActivity === 'slime' ? day.slime : day.tufting) : [];
                return slots.map((slot: Slot, idx: number) => (
                  <div key={idx} className="flex items-center gap-2 bg-gray-50 rounded-md p-2">
                    <input type="time" value={slot.time} onChange={(e) => updateSlot(selectedDate, selectedActivity, idx, 'time', e.target.value)} className="w-24 border rounded px-1 py-0.5 text-sm" />
                    <input type="text" value={slot.label} onChange={(e) => updateSlot(selectedDate, selectedActivity, idx, 'label', e.target.value)} className="w-28 border rounded px-2 py-1 text-sm" placeholder="Label" />
                    <input type="number" value={slot.available} min={0} max={slot.total} onChange={(e) => updateSlot(selectedDate, selectedActivity, idx, 'available', Number(e.target.value))} className="w-14 border rounded px-1 py-0.5 text-sm" />
                    <input type="number" value={slot.total} min={1} onChange={(e) => updateSlot(selectedDate, selectedActivity, idx, 'total', Number(e.target.value))} className="w-14 border rounded px-1 py-0.5 text-sm" />
                    <input type="text" value={slot.type} onChange={(e) => updateSlot(selectedDate, selectedActivity, idx, 'type', e.target.value)} className="w-20 border rounded px-1 py-0.5 text-sm" placeholder="Type" />
                    <input type="text" value={slot.age} onChange={(e) => updateSlot(selectedDate, selectedActivity, idx, 'age', e.target.value)} className="w-12 border rounded px-1 py-0.5 text-sm" placeholder="Age" />
                    <button onClick={() => removeSlot(selectedDate, selectedActivity, idx)} className="text-red-500">✕</button>
                  </div>
                ));
              })()}
            </div>
          </div>
        </div>

        <div className="flex justify-end mt-4">
          <button onClick={async () => {
            setIsSaving(true);
            try {
              // preserve the other activity when saving only one
              const existing = getSlotsForDate(selectedBranchId, selectedDate) || { slime: [], tufting: [] };
              const toSave = {
                slime: selectedActivity === 'slime' ? activitySlots[selectedDate].slime : (existing.slime || activitySlots[selectedDate].slime),
                tufting: selectedActivity === 'tufting' ? activitySlots[selectedDate].tufting : (existing.tufting || activitySlots[selectedDate].tufting)
              };
              await updateSlotsForDate(selectedBranchId, selectedDate, toSave);
              console.log('Saved slots for', selectedBranchId, selectedDate, 'activity', selectedActivity);
              setToastMessage('Slots saved');
              setShowToast(true);
              setTimeout(() => setShowToast(false), 3000);
            } catch (e) {
              console.error('Failed to save slots', e);
            } finally {
              setIsSaving(false);
            }
          }} className="bg-purple-600 text-white px-4 py-2 rounded-md flex items-center gap-2">
            {isSaving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>

      {/* Toast / Snackbar */}
      {showToast && (
        <div className="fixed bottom-6 right-6 bg-gray-900 text-white px-4 py-2 rounded shadow-lg z-50 flex items-center gap-3">
          <div className="font-medium">{toastMessage}</div>
          <button onClick={() => setShowToast(false)} className="text-gray-300 hover:text-white">✕</button>
        </div>
      )}

        {/* Manager QR Verification Panel */}
        <div className="bg-white rounded-xl p-4 shadow-sm mt-6">
          <h4 className="text-lg font-semibold mb-2">Manager: Verify Booking QR</h4>
          <div className="flex gap-2 items-center">
            <input id="qr-input" placeholder="Enter QR code" className="border rounded px-3 py-2 w-64" />
            <button onClick={async () => {
              const el = document.getElementById('qr-input') as HTMLInputElement | null;
              if (!el || !el.value) return alert('Enter QR code');
              const ok = await verifyQRCode(el.value.trim());
              if (ok) alert('Booking verified'); else alert('QRCode not found or already verified');
            }} className="bg-green-600 text-white px-3 py-2 rounded">Verify</button>
          </div>
          <div className="mt-3 text-sm text-gray-600">You can paste the customer's QR from their ticket to verify entry.</div>
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
                  <div className="text-sm text-gray-600">Price is determined by the customer's selected plan and is not set here.</div>
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
                  <div className="text-sm text-gray-600">Price is determined by the customer's selected plan and is not set here.</div>
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