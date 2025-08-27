import React, { useState } from 'react';
import { useData } from '../../contexts/DataContext';
import { 
  MapPin, 
  Phone, 
  Mail, 
  Plus, 
  Edit, 
  Trash2, 
  Save, 
  X,
  Building,
  Users,
  CheckCircle,
  XCircle
} from 'lucide-react';

const BranchManagement: React.FC = () => {
  const { 
    branches, 
    managers,
    addBranch, 
    updateBranch, 
    deleteBranch 
  } = useData();

  const [showAddModal, setShowAddModal] = useState(false);
  const [editingBranch, setEditingBranch] = useState<any>(null);
  const [newBranch, setNewBranch] = useState({
    name: '',
    location: '',
    address: '',
    phone: '',
    email: '',
    managerId: '',
    isActive: true
  });

  const handleAddBranch = async () => {
    if (newBranch.name && newBranch.location && newBranch.address) {
      await addBranch({
        ...newBranch,
        stripeAccountId: `acct_${Date.now()}`
      });
      setNewBranch({
        name: '',
        location: '',
        address: '',
        phone: '',
        email: '',
        managerId: '',
        isActive: true
      });
      setShowAddModal(false);
    }
  };

  const handleUpdateBranch = async () => {
    if (editingBranch) {
      await updateBranch(editingBranch);
      setEditingBranch(null);
    }
  };

  const handleDeleteBranch = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this branch? This action cannot be undone.')) {
      await deleteBranch(id);
    }
  };

  const getManagerName = (managerId: string) => {
    const manager = managers.find(m => m.id === managerId);
    return manager ? manager.name : 'No Manager Assigned';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-2xl font-bold text-gray-800">Branch Management</h3>
          <p className="text-gray-600">Manage all branch locations and their details</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>Add Branch</span>
        </button>
      </div>

      {/* Branch Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {branches.map(branch => (
          <div key={branch.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-4 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Building className="h-6 w-6" />
                  <h4 className="text-lg font-bold">{branch.name}</h4>
                </div>
                <div className="flex items-center space-x-1">
                  {branch.isActive ? (
                    <CheckCircle className="h-5 w-5 text-green-300" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-300" />
                  )}
                </div>
              </div>
              <p className="text-sm opacity-90">{branch.location}</p>
            </div>

            <div className="p-4 space-y-3">
              <div className="flex items-start space-x-2">
                <MapPin className="h-4 w-4 text-gray-500 mt-1 flex-shrink-0" />
                <span className="text-sm text-gray-600">{branch.address}</span>
              </div>

              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-600">{branch.phone}</span>
              </div>

              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-600">{branch.email}</span>
              </div>

              <div className="flex items-center space-x-2">
                <Users className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-600">{getManagerName(branch.managerId)}</span>
              </div>

              <div className="pt-3 border-t border-gray-200">
                <div className="flex justify-between items-center">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    branch.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {branch.isActive ? 'Active' : 'Inactive'}
                  </span>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setEditingBranch(branch)}
                      className="text-blue-600 hover:text-blue-800 transition-colors"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteBranch(branch.id)}
                      className="text-red-600 hover:text-red-800 transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Branch Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-900">Add New Branch</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Branch Name *</label>
                <input
                  type="text"
                  value={newBranch.name}
                  onChange={(e) => setNewBranch({ ...newBranch, name: e.target.value })}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Artgram Mumbai"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Location *</label>
                <input
                  type="text"
                  value={newBranch.location}
                  onChange={(e) => setNewBranch({ ...newBranch, location: e.target.value })}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Mumbai"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Address *</label>
                <textarea
                  value={newBranch.address}
                  onChange={(e) => setNewBranch({ ...newBranch, address: e.target.value })}
                  rows={3}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Full address with pincode"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                <input
                  type="tel"
                  value={newBranch.phone}
                  onChange={(e) => setNewBranch({ ...newBranch, phone: e.target.value })}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="+91 98765 43210"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  value={newBranch.email}
                  onChange={(e) => setNewBranch({ ...newBranch, email: e.target.value })}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="branch@craftfactory.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Manager</label>
                <select
                  value={newBranch.managerId}
                  onChange={(e) => setNewBranch({ ...newBranch, managerId: e.target.value })}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Manager</option>
                  {managers.map(manager => (
                    <option key={manager.id} value={manager.id}>
                      {manager.name} ({manager.email})
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={newBranch.isActive}
                  onChange={(e) => setNewBranch({ ...newBranch, isActive: e.target.checked })}
                  className="mr-2"
                />
                <label htmlFor="isActive" className="text-sm font-medium text-gray-700">
                  Active Branch
                </label>
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
                onClick={handleAddBranch}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Add Branch
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Branch Modal */}
      {editingBranch && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-900">Edit Branch</h3>
              <button
                onClick={() => setEditingBranch(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Branch Name *</label>
                <input
                  type="text"
                  value={editingBranch.name}
                  onChange={(e) => setEditingBranch({ ...editingBranch, name: e.target.value })}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Location *</label>
                <input
                  type="text"
                  value={editingBranch.location}
                  onChange={(e) => setEditingBranch({ ...editingBranch, location: e.target.value })}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Address *</label>
                <textarea
                  value={editingBranch.address}
                  onChange={(e) => setEditingBranch({ ...editingBranch, address: e.target.value })}
                  rows={3}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                <input
                  type="tel"
                  value={editingBranch.phone}
                  onChange={(e) => setEditingBranch({ ...editingBranch, phone: e.target.value })}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  value={editingBranch.email}
                  onChange={(e) => setEditingBranch({ ...editingBranch, email: e.target.value })}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Manager</label>
                <select
                  value={editingBranch.managerId}
                  onChange={(e) => setEditingBranch({ ...editingBranch, managerId: e.target.value })}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Manager</option>
                  {managers.map(manager => (
                    <option key={manager.id} value={manager.id}>
                      {manager.name} ({manager.email})
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="editIsActive"
                  checked={editingBranch.isActive}
                  onChange={(e) => setEditingBranch({ ...editingBranch, isActive: e.target.checked })}
                  className="mr-2"
                />
                <label htmlFor="editIsActive" className="text-sm font-medium text-gray-700">
                  Active Branch
                </label>
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setEditingBranch(null)}
                className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateBranch}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center space-x-2"
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

export default BranchManagement;