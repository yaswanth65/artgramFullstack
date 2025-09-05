import React, { useState } from 'react';
import { useData } from '../../contexts/DataContext';
import { useAuth } from '../../contexts/AuthContext';
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
  XCircle,
  Calendar,
  Ban,
  AlertCircle
} from 'lucide-react';

const BranchManagement: React.FC = () => {
  const { 
    branches, 
    managers,
    addBranch, 
    updateBranch, 
    deleteBranch,
    addManager,
    getDayRestrictions,
    updateDayRestrictions
  } = useData();

  const { user } = useAuth();

  // Debug logging
  console.log('BranchManagement rendered');
  console.log('User:', user);
  console.log('Branches:', branches);
  console.log('Managers:', managers);
  console.log('AddBranch function:', typeof addBranch);

  const [showAddModal, setShowAddModal] = useState(false);
  console.log('showAddModal state:', showAddModal);
  const [editingBranch, setEditingBranch] = useState<any>(null);
  const [newBranch, setNewBranch] = useState({
    name: '',
    location: '',
    address: '',
    phone: '',
    email: '',
    managerId: '',
    allowSlime: true,
    allowTufting: true,
    allowMonday: false,
    isActive: true
  });

  // Combined manager creation with branch
  const [createManagerWithBranch, setCreateManagerWithBranch] = useState(false);
  const [newManager, setNewManager] = useState({
    name: '',
    email: '',
    password: '',
    phone: ''
  });

  // Day restrictions management
  const [showDayRestrictionsModal, setShowDayRestrictionsModal] = useState(false);
  const [selectedBranchForRestrictions, setSelectedBranchForRestrictions] = useState<string>('');
  const [dayRestrictions, setDayRestrictions] = useState<{[date: string]: {slime: boolean, tufting: boolean}}>({});
  
  // UI state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [serverErrorMsg, setServerErrorMsg] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  // Load day restrictions when component mounts
  React.useEffect(() => {
    if (selectedBranchForRestrictions && getDayRestrictions) {
      const restrictions = getDayRestrictions(selectedBranchForRestrictions);
      setDayRestrictions(restrictions || {});
    }
  }, [selectedBranchForRestrictions, getDayRestrictions]);

  // Client-side validation
  const validateForm = () => {
    const errors: string[] = [];

    // Branch validation
    if (!newBranch.name.trim()) {
      errors.push('Branch name is required');
    } else if (newBranch.name.trim().length < 1) {
      errors.push('Branch name must be at least 1 character');
    }

    if (!newBranch.location.trim()) {
      errors.push('Location is required');
    }

    if (newBranch.email && !isValidEmail(newBranch.email)) {
      errors.push('Branch email format is invalid');
    }

    if (newBranch.phone && !isValidPhone(newBranch.phone)) {
      errors.push('Branch phone number format is invalid');
    }

    // Manager validation (if creating new manager)
    if (createManagerWithBranch) {
      if (!newManager.name.trim()) {
        errors.push('Manager name is required');
      } else if (newManager.name.trim().length < 1) {
        errors.push('Manager name must be at least 1 character');
      }

      if (!newManager.email.trim()) {
        errors.push('Manager email is required');
      } else if (!isValidEmail(newManager.email)) {
        errors.push('Manager email format is invalid');
      }

      if (!newManager.password) {
        errors.push('Manager password is required');
      } else if (newManager.password.length < 8) {
        errors.push('Manager password must be at least 8 characters');
      }

      if (newManager.phone && !isValidPhone(newManager.phone)) {
        errors.push('Manager phone number format is invalid');
      }

      // Check if manager name looks like an email (common mistake)
      if (newManager.name.includes('@')) {
        errors.push('Manager name should not be an email address');
      }
    }

    return errors;
  };

  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const isValidPhone = (phone: string) => {
    // Allow formats like +911234567890, 911234567890, 1234567890, +91 98765 43210
    const cleanPhone = phone.replace(/[\s\-\(\)]/g, ''); // Remove spaces, dashes, parentheses
    const phoneRegex = /^(\+91|91)?[6-9]\d{9}$/;
    const isValid = phoneRegex.test(cleanPhone);
    console.log(`Phone validation: "${phone}" -> "${cleanPhone}" -> ${isValid}`);
    return isValid;
  };

  const parseServerError = (error: any, response?: Response) => {
    console.log('Parsing server error:', error, response?.status);
    
    if (response?.status === 429) {
      return 'Too many requests. Please wait a moment and try again.';
    }
    
    if (response?.status === 400) {
      if (error.details && Array.isArray(error.details)) {
        return error.details.map((d: any) => d.msg || d.message || String(d)).join(', ');
      }
      if (error.message) {
        return error.message;
      }
    }
    
    return error?.message || String(error) || 'An unexpected error occurred';
  };

  const handleAddBranch = async () => {
    console.log('handleAddBranch called');
    console.log('Current user:', user);
    console.log('New branch data:', newBranch);
    console.log('Create manager:', createManagerWithBranch);
    console.log('Manager data:', newManager);

    // Clear previous errors
    setValidationErrors([]);
    setServerErrorMsg(null);
    setSuccessMsg(null);

    // Client-side validation
    const clientErrors = validateForm();
    console.log('Validation errors:', clientErrors);
    if (clientErrors.length > 0) {
      setValidationErrors(clientErrors);
      return;
    }

    // Ensure current user is admin
    if (!user || user.role !== 'admin') {
      setServerErrorMsg('You must be logged in as an admin to create branches');
      return;
    }

    setIsSubmitting(true);

    try {
      // Step 1: Create branch first (server-side)
      console.log('Creating branch:', newBranch.name);
      const token = localStorage.getItem('token');
      const branchPayload = {
        name: newBranch.name.trim(),
        location: newBranch.location.trim(),
        address: newBranch.address.trim(),
        phone: newBranch.phone.trim(),
        email: newBranch.email.trim(),
        allowSlime: newBranch.allowSlime,
        allowTufting: newBranch.allowTufting,
        allowMonday: newBranch.allowMonday
      };

      const branchResponse = await fetch('/api/branches', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(branchPayload)
      });

      if (!branchResponse.ok) {
        let branchError;
        try {
          branchError = await branchResponse.json();
        } catch {
          branchError = { message: `HTTP ${branchResponse.status}` };
        }
        throw { error: branchError, response: branchResponse };
      }

      const createdBranch = await branchResponse.json();
      const branchId = createdBranch._id || createdBranch.id;
      console.log('Branch created successfully:', branchId);

      let managerId = newBranch.managerId;

      // Step 2: Create manager if requested
      if (createManagerWithBranch && newManager.name && newManager.email && newManager.password) {
        const managerData = {
          name: newManager.name.trim(),
          email: newManager.email.trim().toLowerCase(),
          password: newManager.password,
          phone: newManager.phone.trim(),
          role: 'branch_manager',
          branchId: branchId
        };

        console.log('Creating manager for branch:', branchId);
        
        // Add delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const managerResponse = await fetch('/api/auth/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(managerData)
        });

        if (!managerResponse.ok) {
          let managerError;
          try {
            managerError = await managerResponse.json();
          } catch {
            managerError = { message: `HTTP ${managerResponse.status}` };
          }
          throw { error: managerError, response: managerResponse };
        }

        const createdManager = await managerResponse.json();
        managerId = createdManager.user?.id || createdManager.user?._id || createdManager.id || createdManager._id;
        console.log('Manager created successfully:', managerId);

        // Add to local state
        await addManager({
          name: createdManager.user?.name || managerData.name,
          email: createdManager.user?.email || managerData.email,
          role: createdManager.user?.role || managerData.role,
          branchId: createdManager.user?.branchId || branchId,
          phone: createdManager.user?.phone || managerData.phone
        } as any);

        // Step 3: Update branch with manager ID
        if (managerId) {
          const updateResponse = await fetch(`/api/branches/${branchId}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ managerId })
          });

          if (updateResponse.ok) {
            console.log('Branch updated with manager ID');
          } else {
            console.warn('Failed to update branch with manager ID');
          }
        }
      }

      // Update local branch state
      await addBranch({
        name: createdBranch.name,
        location: createdBranch.location,
        address: createdBranch.address || '',
        phone: createdBranch.phone || '',
        email: createdBranch.email || '',
        managerId: managerId || '',
        supportsSlime: createdBranch.allowSlime !== false,
        supportsTufting: createdBranch.allowTufting !== false,
        isActive: createdBranch.isActive !== false,
        stripeAccountId: createdBranch.stripeAccountId || `acct_${Date.now()}`
      });

      // Reset forms
      setNewBranch({
        name: '',
        location: '',
        address: '',
        phone: '',
        email: '',
        managerId: '',
        allowSlime: true,
        allowTufting: true,
        allowMonday: false,
        isActive: true
      });
      setNewManager({ name: '', email: '', password: '', phone: '' });
      setCreateManagerWithBranch(false);

      // Show success and auto-close
      setSuccessMsg('Branch and manager created successfully!');
      setTimeout(() => {
        setShowAddModal(false);
        setSuccessMsg(null);
        setValidationErrors([]);
      }, 2000);

    } catch (error: any) {
      console.error('Error creating branch/manager:', error);
      const errorMessage = parseServerError(error.error || error, error.response);
      setServerErrorMsg(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateBranch = async () => {
    if (!editingBranch) return;

    // Clear previous errors
    setValidationErrors([]);
    setServerErrorMsg(null);
    setSuccessMsg(null);

    // Ensure current user is admin
    if (!user || user.role !== 'admin') {
      setServerErrorMsg('You must be logged in as an admin to update branches');
      return;
    }

    setIsSubmitting(true);

    try {
      const token = localStorage.getItem('token');
      const updatePayload = {
        name: editingBranch.name.trim(),
        location: editingBranch.location.trim(),
        address: editingBranch.address?.trim() || '',
        phone: editingBranch.phone?.trim() || '',
        email: editingBranch.email?.trim() || '',
        managerId: editingBranch.managerId || '',
        allowSlime: editingBranch.allowSlime !== false,
        allowTufting: editingBranch.allowTufting !== false,
        allowMonday: editingBranch.allowMonday === true,
        isActive: editingBranch.isActive !== false
      };

      const response = await fetch(`/api/branches/${editingBranch.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(updatePayload)
      });

      if (!response.ok) {
        let error;
        try {
          error = await response.json();
        } catch {
          error = { message: `HTTP ${response.status}` };
        }
        throw { error, response };
      }

      const updatedBranch = await response.json();
      console.log('Branch updated successfully:', updatedBranch);

      // Update local state through DataContext
      await updateBranch({
        ...editingBranch,
        supportsSlime: updatePayload.allowSlime,
        supportsTufting: updatePayload.allowTufting,
        allowSlime: updatePayload.allowSlime,
        allowTufting: updatePayload.allowTufting,
        allowMonday: updatePayload.allowMonday,
        isActive: updatePayload.isActive
      });

      // Show success and close modal
      setSuccessMsg('Branch updated successfully!');
      setTimeout(() => {
        setEditingBranch(null);
        setSuccessMsg(null);
        setValidationErrors([]);
      }, 2000);

    } catch (error: any) {
      console.error('Error updating branch:', error);
      const errorMessage = parseServerError(error.error || error, error.response);
      setServerErrorMsg(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteBranch = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this branch? This action cannot be undone.')) {
      await deleteBranch(id);
    }
  };

  const handleSaveDayRestrictions = async () => {
    if (selectedBranchForRestrictions && updateDayRestrictions) {
      await updateDayRestrictions(selectedBranchForRestrictions, dayRestrictions);
      setShowDayRestrictionsModal(false);
      setSelectedBranchForRestrictions('');
      setDayRestrictions({});
    }
  };

  const addDateRestriction = () => {
    const today = new Date().toISOString().split('T')[0];
    setDayRestrictions(prev => ({
      ...prev,
      [today]: { slime: false, tufting: false }
    }));
  };

  const removeDateRestriction = (date: string) => {
    setDayRestrictions(prev => {
      const newRestrictions = { ...prev };
      delete newRestrictions[date];
      return newRestrictions;
    });
  };

  const updateDateRestriction = (date: string, activity: 'slime' | 'tufting', disabled: boolean) => {
    setDayRestrictions(prev => ({
      ...prev,
      [date]: {
        ...prev[date],
        [activity]: disabled
      }
    }));
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
        <div className="flex space-x-3">
          <button
            onClick={() => {
              console.log('Add Branch header button clicked');
              setShowAddModal(true);
            }}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
          >
            <Plus className="h-4 w-4" />
            <span>Add Branch</span>
          </button>
          <button
            onClick={() => setShowDayRestrictionsModal(true)}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center space-x-2"
          >
            <Ban className="h-4 w-4" />
            <span>Day Restrictions</span>
          </button>
        </div>
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

              {/* Activity Permissions */}
              <div className="space-y-2">
                <div className="text-xs font-medium text-gray-700">Activities Allowed:</div>
                <div className="flex flex-wrap gap-1">
                  {branch.supportsSlime && (
                    <span className="px-2 py-1 bg-pink-100 text-pink-800 text-xs rounded">Slime</span>
                  )}
                  {branch.supportsTufting && (
                    <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded">Tufting</span>
                  )}
                </div>
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
                onClick={() => {
                  setShowAddModal(false);
                  setValidationErrors([]);
                  setServerErrorMsg(null);
                  setSuccessMsg(null);
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Client-side validation errors */}
            {validationErrors.length > 0 && (
              <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 text-yellow-700 rounded">
                <div className="flex items-start space-x-2">
                  <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  <div>
                    <strong>Please fix the following:</strong>
                    <ul className="text-sm mt-1 space-y-1">
                      {validationErrors.map((error, index) => (
                        <li key={index}>• {error}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}

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
                <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
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
                  placeholder="branch@artgram.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Manager</label>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="createNewManager"
                      checked={createManagerWithBranch}
                      onChange={(e) => setCreateManagerWithBranch(e.target.checked)}
                      className="mr-2"
                    />
                    <label htmlFor="createNewManager" className="text-sm text-gray-700">
                      Create new manager for this branch
                    </label>
                  </div>
                  
                  {!createManagerWithBranch ? (
                    <select
                      value={newBranch.managerId}
                      onChange={(e) => setNewBranch({ ...newBranch, managerId: e.target.value })}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select Existing Manager</option>
                      {managers.map(manager => (
                        <option key={manager.id} value={manager.id}>
                          {manager.name} ({manager.email})
                        </option>
                      ))}
                    </select>
                  ) : (
                    <div className="space-y-3 p-4 bg-green-50 rounded-lg border border-green-200">
                      <h4 className="font-medium text-green-800">Create New Manager</h4>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                        <input
                          type="text"
                          value={newManager.name}
                          onChange={(e) => setNewManager({ ...newManager, name: e.target.value })}
                          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                          placeholder="Manager's full name (not email)"
                        />
                        {newManager.name.includes('@') && (
                          <p className="text-red-500 text-xs mt-1">Please enter a name, not an email address</p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                        <input
                          type="email"
                          value={newManager.email}
                          onChange={(e) => setNewManager({ ...newManager, email: e.target.value })}
                          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                          placeholder="manager@artgram.com"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Temporary Password *</label>
                        <input
                          type="password"
                          value={newManager.password}
                          onChange={(e) => setNewManager({ ...newManager, password: e.target.value })}
                          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                          placeholder="Minimum 8 characters"
                          minLength={8}
                        />
                        {newManager.password && newManager.password.length < 8 && (
                          <p className="text-red-500 text-xs mt-1">Password must be at least 8 characters long</p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                        <input
                          type="tel"
                          value={newManager.phone}
                          onChange={(e) => setNewManager({ ...newManager, phone: e.target.value })}
                          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                          placeholder="+91 98765 43210"
                        />
                      </div>
                      <p className="text-sm text-green-700">
                        The manager will receive login credentials and should change their password on first login.
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Activity Permissions */}
              <div className="space-y-3">
                <label className="block text-sm font-medium text-gray-700">Activity Permissions</label>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="allowSlime"
                    checked={newBranch.allowSlime}
                    onChange={(e) => setNewBranch({ ...newBranch, allowSlime: e.target.checked })}
                    className="mr-2"
                  />
                  <label htmlFor="allowSlime" className="text-sm text-gray-700">
                    Allow Slime Activities
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="allowTufting"
                    checked={newBranch.allowTufting}
                    onChange={(e) => setNewBranch({ ...newBranch, allowTufting: e.target.checked })}
                    className="mr-2"
                  />
                  <label htmlFor="allowTufting" className="text-sm text-gray-700">
                    Allow Tufting Activities
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="allowMonday"
                    checked={newBranch.allowMonday}
                    onChange={(e) => setNewBranch({ ...newBranch, allowMonday: e.target.checked })}
                    className="mr-2"
                  />
                  <label htmlFor="allowMonday" className="text-sm text-gray-700">
                    Open on Mondays
                  </label>
                </div>
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
                onClick={() => {
                  setShowAddModal(false);
                  setValidationErrors([]);
                  setServerErrorMsg(null);
                  setSuccessMsg(null);
                }}
                disabled={isSubmitting}
                className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  console.log('Add Branch button clicked');
                  handleAddBranch();
                }}
                disabled={isSubmitting}
                className={`px-4 py-2 rounded-md transition-colors ${isSubmitting ? 'bg-gray-400 text-gray-800 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
              >
                {isSubmitting ? 'Creating...' : 'Add Branch'}
              </button>
            </div>
            
            {successMsg && (
              <div className="mt-4 p-3 bg-green-50 border border-green-200 text-green-700 rounded">
                <strong>Success:</strong>
                <div className="text-sm mt-1">{successMsg}</div>
              </div>
            )}
            
            {serverErrorMsg && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded">
                <strong>Server Error:</strong>
                <div className="text-sm mt-1">{serverErrorMsg}</div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Edit Branch Modal - Similar structure but for editing existing branches */}
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

              {/* Activity Permissions for Edit */}
              <div className="space-y-3">
                <label className="block text-sm font-medium text-gray-700">Activity Permissions</label>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="editAllowSlime"
                    checked={editingBranch.allowSlime !== false}
                    onChange={(e) => setEditingBranch({ ...editingBranch, allowSlime: e.target.checked, supportsSlime: e.target.checked })}
                    className="mr-2"
                  />
                  <label htmlFor="editAllowSlime" className="text-sm text-gray-700">
                    Allow Slime Activities
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="editAllowTufting"
                    checked={editingBranch.allowTufting !== false}
                    onChange={(e) => setEditingBranch({ ...editingBranch, allowTufting: e.target.checked, supportsTufting: e.target.checked })}
                    className="mr-2"
                  />
                  <label htmlFor="editAllowTufting" className="text-sm text-gray-700">
                    Allow Tufting Activities
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="editAllowMonday"
                    checked={editingBranch.allowMonday === true}
                    onChange={(e) => setEditingBranch({ ...editingBranch, allowMonday: e.target.checked })}
                    className="mr-2"
                  />
                  <label htmlFor="editAllowMonday" className="text-sm text-gray-700">
                    Open on Mondays
                  </label>
                </div>
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
                onClick={() => {
                  setEditingBranch(null);
                  setValidationErrors([]);
                  setServerErrorMsg(null);
                  setSuccessMsg(null);
                }}
                disabled={isSubmitting}
                className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateBranch}
                disabled={isSubmitting}
                className={`px-4 py-2 rounded-md transition-colors flex items-center space-x-2 ${isSubmitting ? 'bg-gray-400 text-gray-800 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
              >
                <Save className="h-4 w-4" />
                <span>{isSubmitting ? 'Saving...' : 'Save Changes'}</span>
              </button>
            </div>
            
            {successMsg && (
              <div className="mt-4 p-3 bg-green-50 border border-green-200 text-green-700 rounded">
                <strong>Success:</strong>
                <div className="text-sm mt-1">{successMsg}</div>
              </div>
            )}
            
            {serverErrorMsg && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded">
                <strong>Server Error:</strong>
                <div className="text-sm mt-1">{serverErrorMsg}</div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Day Restrictions Modal */}
      {showDayRestrictionsModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-900">Manage Day Restrictions</h3>
              <button
                onClick={() => setShowDayRestrictionsModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Select Branch</label>
                <select
                  value={selectedBranchForRestrictions}
                  onChange={(e) => setSelectedBranchForRestrictions(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  <option value="">Select Branch</option>
                  {branches.map(branch => (
                    <option key={branch.id} value={branch.id}>
                      {branch.name} - {branch.location}
                    </option>
                  ))}
                </select>
              </div>

              {selectedBranchForRestrictions && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h4 className="font-medium text-gray-800">Restricted Days</h4>
                    <button
                      onClick={addDateRestriction}
                      className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700 transition-colors flex items-center space-x-1"
                    >
                      <Plus className="h-3 w-3" />
                      <span>Add Date</span>
                    </button>
                  </div>

                  <div className="space-y-3 max-h-60 overflow-y-auto">
                    {Object.entries(dayRestrictions).map(([date, restrictions]) => (
                      <div key={date} className="border border-gray-200 rounded-lg p-3 bg-gray-50">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <input
                              type="date"
                              value={date}
                              onChange={(e) => {
                                const newDate = e.target.value;
                                if (newDate && newDate !== date) {
                                  setDayRestrictions(prev => {
                                    const newRestrictions = { ...prev };
                                    newRestrictions[newDate] = newRestrictions[date];
                                    delete newRestrictions[date];
                                    return newRestrictions;
                                  });
                                }
                              }}
                              className="border border-gray-300 rounded px-2 py-1 text-sm"
                            />
                          </div>
                          <button
                            onClick={() => removeDateRestriction(date)}
                            className="text-red-600 hover:text-red-800"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center">
                            <input
                              type="checkbox"
                              id={`slime-${date}`}
                              checked={restrictions.slime}
                              onChange={(e) => updateDateRestriction(date, 'slime', e.target.checked)}
                              className="mr-2"
                            />
                            <label htmlFor={`slime-${date}`} className="text-sm text-gray-700">
                              Disable Slime Activities
                            </label>
                          </div>
                          <div className="flex items-center">
                            <input
                              type="checkbox"
                              id={`tufting-${date}`}
                              checked={restrictions.tufting}
                              onChange={(e) => updateDateRestriction(date, 'tufting', e.target.checked)}
                              className="mr-2"
                            />
                            <label htmlFor={`tufting-${date}`} className="text-sm text-gray-700">
                              Disable Tufting Activities
                            </label>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {Object.keys(dayRestrictions).length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      <Calendar className="h-12 w-12 mx-auto mb-2 opacity-50" />
                      <p>No day restrictions set for this branch</p>
                      <p className="text-sm">Click "Add Date" to restrict activities on specific days</p>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowDayRestrictionsModal(false)}
                className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveDayRestrictions}
                disabled={!selectedBranchForRestrictions}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Save Restrictions
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BranchManagement;
