import React, { useState } from 'react';
import { useData } from '../../contexts/DataContext';
import { sendManagerInvite } from '../../utils/emailService';
import { 
  Users, 
  Mail, 
  MapPin, 
  Plus, 
  Edit, 
  Trash2, 
  Save, 
  X,
  User,
  Shield,
  CheckCircle,
  XCircle
} from 'lucide-react';

const ManagerManagement: React.FC = () => {
  const { 
    managers, 
    branches,
    addManager, 
    updateManager, 
    deleteManager 
  } = useData();

  const [showAddModal, setShowAddModal] = useState(false);
  const [editingManager, setEditingManager] = useState<any>(null);
  const [newManager, setNewManager] = useState({
    name: '',
    email: '',
    password: '',
    role: 'branch_manager' as const,
    branchId: ''
  });

  const handleAddManager = async () => {
    if (newManager.name && newManager.email && newManager.password && newManager.branchId) {
      try {
        // Add manager with provided password
        await addManager(newManager);
        
        // Send invitation email
        const branch = branches.find(b => b.id === newManager.branchId);
        const emailSent = await sendManagerInvite({
          name: newManager.name,
          email: newManager.email,
          branchName: branch?.name || 'Unknown Branch',
          temporaryPassword: newManager.password,
          loginUrl: `${window.location.origin}/login`
        });
        
        if (emailSent) {
          // Show success notification
          const notification = document.createElement('div');
          notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #10b981;
            color: white;
            padding: 15px 20px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 10000;
            font-family: Arial, sans-serif;
            max-width: 350px;
          `;
          notification.innerHTML = `
            <div style="display: flex; align-items: center;">
              <span style="margin-right: 10px;">✅</span>
              <div>
                <div style="font-weight: bold;">Manager Added Successfully!</div>
                <div style="font-size: 14px; opacity: 0.9;">Login credentials sent to ${newManager.email}</div>
              </div>
            </div>
          `;
          
          document.body.appendChild(notification);
          
          setTimeout(() => {
            if (notification.parentNode) {
              notification.parentNode.removeChild(notification);
            }
          }, 5000);
        }
        
        setNewManager({
          name: '',
          email: '',
          password: '',
          role: 'branch_manager',
          branchId: ''
        });
        setShowAddModal(false);
      } catch (error) {
        console.error('Error adding manager:', error);
        // Show error notification
        const notification = document.createElement('div');
        notification.style.cssText = `
          position: fixed;
          top: 20px;
          right: 20px;
          background: #ef4444;
          color: white;
          padding: 15px 20px;
          border-radius: 8px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
          z-index: 10000;
          font-family: Arial, sans-serif;
          max-width: 350px;
        `;
        notification.innerHTML = `
          <div style="display: flex; align-items: center;">
            <span style="margin-right: 10px;">❌</span>
            <div>
              <div style="font-weight: bold;">Failed to Add Manager</div>
              <div style="font-size: 14px; opacity: 0.9;">${error instanceof Error ? error.message : 'Please try again'}</div>
            </div>
          </div>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
          if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
          }
        }, 5000);
      }
    }
  };

  const handleUpdateManager = async () => {
    if (editingManager) {
      await updateManager(editingManager);
      setEditingManager(null);
    }
  };

  const handleDeleteManager = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this manager? This action cannot be undone.')) {
      await deleteManager(id);
    }
  };

  const getBranchName = (branchId: string) => {
    const branch = branches.find(b => b.id === branchId);
    return branch ? branch.name : 'No Branch Assigned';
  };

  const getBranchLocation = (branchId: string) => {
    const branch = branches.find(b => b.id === branchId);
    return branch ? branch.location : '';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-2xl font-bold text-gray-800">Manager Management</h3>
          <p className="text-gray-600">Manage branch managers and their assignments</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>Add Manager</span>
        </button>
      </div>

      {/* Manager Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {managers.map(manager => (
          <div key={manager.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="bg-gradient-to-r from-green-500 to-blue-600 p-4 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <User className="h-6 w-6" />
                  <h4 className="text-lg font-bold">{manager.name}</h4>
                </div>
                <Shield className="h-5 w-5 text-green-300" />
              </div>
              <p className="text-sm opacity-90">{manager.role.replace('_', ' ').toUpperCase()}</p>
            </div>

            <div className="p-4 space-y-3">
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-600">{manager.email}</span>
              </div>

              <div className="flex items-start space-x-2">
                <MapPin className="h-4 w-4 text-gray-500 mt-1 flex-shrink-0" />
                <div>
                  <span className="text-sm text-gray-600 block">{getBranchName(manager.branchId || '')}</span>
                  <span className="text-xs text-gray-500">{getBranchLocation(manager.branchId || '')}</span>
                </div>
              </div>

              <div className="pt-3 border-t border-gray-200">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-500">
                    Joined: {new Date(manager.createdAt).toLocaleDateString()}
                  </span>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setEditingManager(manager)}
                      className="text-blue-600 hover:text-blue-800 transition-colors"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteManager(manager.id)}
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

      {/* Add Manager Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-900">Add New Manager</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
                <input
                  type="text"
                  value={newManager.name}
                  onChange={(e) => setNewManager({ ...newManager, name: e.target.value })}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Enter manager's full name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email Address *</label>
                <input
                  type="email"
                  value={newManager.email}
                  onChange={(e) => setNewManager({ ...newManager, email: e.target.value })}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="manager@artgram.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Password *</label>
                <input
                  type="password"
                  value={newManager.password}
                  onChange={(e) => setNewManager({ ...newManager, password: e.target.value })}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Enter secure password"
                  minLength={6}
                />
                <p className="text-xs text-gray-500 mt-1">Minimum 6 characters</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Assign Branch *</label>
                <select
                  value={newManager.branchId}
                  onChange={(e) => setNewManager({ ...newManager, branchId: e.target.value })}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="">Select Branch</option>
                  {branches.map(branch => (
                    <option key={branch.id} value={branch.id}>
                      {branch.name} - {branch.location}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
                <select
                  value={newManager.role}
                  onChange={(e) => setNewManager({ ...newManager, role: e.target.value as 'branch_manager' })}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="branch_manager">Branch Manager</option>
                </select>
              </div>
              
              <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
                <h4 className="font-semibold text-blue-800 mb-2">📧 Email Notification</h4>
                <p className="text-sm text-blue-700">
                  The manager will receive an email with login credentials and instructions to access their dashboard.
                </p>
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
                onClick={handleAddManager}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
              >
                Add Manager
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Manager Modal */}
      {editingManager && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-900">Edit Manager</h3>
              <button
                onClick={() => setEditingManager(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
                <input
                  type="text"
                  value={editingManager.name}
                  onChange={(e) => setEditingManager({ ...editingManager, name: e.target.value })}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email Address *</label>
                <input
                  type="email"
                  value={editingManager.email}
                  onChange={(e) => setEditingManager({ ...editingManager, email: e.target.value })}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Assign Branch *</label>
                <select
                  value={editingManager.branchId || ''}
                  onChange={(e) => setEditingManager({ ...editingManager, branchId: e.target.value })}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="">Select Branch</option>
                  {branches.map(branch => (
                    <option key={branch.id} value={branch.id}>
                      {branch.name} - {branch.location}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
                <select
                  value={editingManager.role}
                  onChange={(e) => setEditingManager({ ...editingManager, role: e.target.value })}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="branch_manager">Branch Manager</option>
                </select>
              </div>
              
              <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
                <h4 className="font-semibold text-yellow-800 mb-2">⚠️ Password Reset</h4>
                <p className="text-sm text-yellow-700">
                  If the manager needs to reset their password, they can use the "Forgot Password" option on the login page.
                </p>
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setEditingManager(null)}
                className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateManager}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors flex items-center space-x-2"
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

export default ManagerManagement;