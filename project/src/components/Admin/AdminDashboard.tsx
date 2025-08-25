import React, { useState } from 'react';
import type { CMSContent } from '../../types';
import { useData } from '../../contexts/DataContext';
import { useAuth } from '../../contexts/AuthContext';
import SalesAnalytics from './SalesAnalytics';
import BranchManagement from './BranchManagement';
import ManagerManagement from './ManagerManagement';
import ProductManagement from './ProductManagement';
import SessionManagement from './SessionManagement';
import EnhancedSessionManagement from './EnhancedSessionManagement';
import PaymentTracking from './PaymentTracking';
import { 
  Users,
  Edit,
  MapPin, 
  Calendar, 
  Package, 
  TrendingUp, 
  Settings,
  BarChart3,
  CreditCard,
  Plus,
  Trash2,
  Save,
  X,
  Eye,
  EyeOff
} from 'lucide-react';

const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const { 
    branches, 
    events, 
    orders, 
    bookings, 
    cmsContent,
    updateCMSContent,
    addCMSContent,
    deleteCMSContent,
  addTrackingUpdate
  } = useData();

  const [activeTab, setActiveTab] = useState('overview');
  const [filterBranch, setFilterBranch] = useState<string>('all');
  const [selectedOrderForTracking, setSelectedOrderForTracking] = useState<null | { id: string; orderId: string }>(null);
  const [adminTrackingUpdate, setAdminTrackingUpdate] = useState({ status: '', location: '', description: '' });
  const [editingContent, setEditingContent] = useState<null | CMSContent>(null);
  const [newContent, setNewContent] = useState<Omit<CMSContent, 'id' | 'updatedAt'>>({
    type: 'carousel',
    title: '',
    content: '',
    images: [''],
    isActive: true
  });
  const [showAddContent, setShowAddContent] = useState(false);

  // Analytics calculations
  const totalRevenue = orders.reduce((sum, order) => sum + order.totalAmount, 0);
  const totalBookings = bookings.length;

  const contentTypes = [
    { value: 'carousel', label: 'Carousel Slide', color: 'bg-purple-100 text-purple-800' },
    { value: 'hero', label: 'Hero Section', color: 'bg-blue-100 text-blue-800' },
    { value: 'about', label: 'About Section', color: 'bg-green-100 text-green-800' },
    { value: 'services', label: 'Services', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'testimonials', label: 'Testimonials', color: 'bg-pink-100 text-pink-800' },
    { value: 'contact', label: 'Contact', color: 'bg-indigo-100 text-indigo-800' },
    { value: 'gallery', label: 'Gallery', color: 'bg-red-100 text-red-800' },
    { value: 'studios', label: 'Studios', color: 'bg-teal-100 text-teal-800' },
    { value: 'events', label: 'Special Events', color: 'bg-orange-100 text-orange-800' }
  ];

  const handleSaveContent = async () => {
    if (editingContent) {
      const filteredImages = editingContent.images.filter((img: string) => img.trim() !== '');
      await updateCMSContent({ ...editingContent, images: filteredImages });
      setEditingContent(null);
    }
  };

  const handleAddContent = async () => {
    if (newContent.title && newContent.content) {
      // Filter out empty image URLs
      const filteredImages = newContent.images.filter((img: string) => img.trim() !== '');
      await addCMSContent({ ...newContent, images: filteredImages });
      setNewContent({
        type: 'carousel',
        title: '',
        content: '',
        images: [''],
        isActive: true
      });
      setShowAddContent(false);
    }
  };

  const handleDeleteContent = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this content?')) {
      await deleteCMSContent(id);
    }
  };

  const addImageField = (isEditing = false) => {
    if (isEditing && editingContent) {
      setEditingContent({
        ...editingContent,
        images: [...editingContent.images, '']
      });
    } else {
      setNewContent({
        ...newContent,
        images: [...newContent.images, '']
      });
    }
  };

  const removeImageField = (index: number, isEditing = false) => {
    if (isEditing && editingContent) {
  const newImages = editingContent.images.filter((_: string, i: number) => i !== index);
      setEditingContent({
        ...editingContent,
        images: newImages.length > 0 ? newImages : ['']
      });
    } else {
      const newImages = newContent.images.filter((_, i) => i !== index);
      setNewContent({
        ...newContent,
        images: newImages.length > 0 ? newImages : ['']
      });
    }
  };

  const updateImageField = (index: number, value: string, isEditing = false) => {
    if (isEditing && editingContent) {
      const newImages = [...editingContent.images];
      newImages[index] = value;
      setEditingContent({
        ...editingContent,
        images: newImages
      });
    } else {
      const newImages = [...newContent.images];
      newImages[index] = value;
      setNewContent({
        ...newContent,
        images: newImages
      });
    }
  };

  const getContentTypeInfo = (type: string) => {
    return contentTypes.find(ct => ct.value === type) || contentTypes[0];
  };

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Analytics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900">₹{totalRevenue.toLocaleString()}</p>
            </div>
            <TrendingUp className="h-8 w-8 text-green-600" />
          </div>
        </div>

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
              <p className="text-sm font-medium text-gray-600">Total Orders</p>
              <p className="text-2xl font-bold text-gray-900">{orders.length}</p>
            </div>
            <Package className="h-8 w-8 text-purple-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Branches</p>
              <p className="text-2xl font-bold text-gray-900">{branches.length}</p>
            </div>
            <MapPin className="h-8 w-8 text-orange-600" />
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Recent Bookings</h3>
          <div className="space-y-3">
            {bookings.slice(0, 5).map(booking => {
              const event = events.find(e => e.id === booking.eventId);
              return (
                <div key={booking.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{event?.title}</p>
                    <p className="text-sm text-gray-600">₹{booking.totalAmount}</p>
                  </div>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    booking.paymentStatus === 'completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {booking.paymentStatus}
                  </span>
                </div>
              );

            })}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Recent Orders</h3>
          <div className="space-y-3">
            {orders.slice(0, 5).map(order => (
              <div key={order.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">Order #{order.id.slice(-6)}</p>
                  <p className="text-sm text-gray-600">₹{order.totalAmount}</p>
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-xs text-gray-600">{order.customerName || `Customer #${order.customerId.slice(0,6)}`}</span>
                  <span className="text-xs text-gray-600">{order.customerEmail || '—'}</span>
                  <span className="text-xs text-gray-600">{order.customerPhone || '—'}</span>
                </div>
                <span className={`px-2 py-1 rounded text-xs font-medium ${
                  order.orderStatus === 'delivered' ? 'bg-green-100 text-green-800' :
                  order.orderStatus === 'shipped' ? 'bg-blue-100 text-blue-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  {order.orderStatus}
                </span>
                <div className="ml-3">
                  <button
                    onClick={() => setSelectedOrderForTracking({ id: order.id, orderId: order.id })}
                    className="text-sm text-indigo-600 hover:text-indigo-900 ml-2"
                  >
                    Track
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Customer Details - All branches with branch filter */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-800">Customer Details</h3>
          <select
            onChange={(e) => setFilterBranch(e.target.value)}
            className="text-sm border-gray-300 rounded-md"
            value={filterBranch}
          >
            <option value="all">All Branches</option>
            {branches.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
          </select>
        </div>
        <div className="space-y-3">
          {[
            ...orders.map(o => ({ id: o.customerId, name: o.customerName, email: o.customerEmail, phone: o.customerPhone, branchId: o.branchId })),
            ...bookings.map(b => ({ id: b.customerId, name: b.customerName, email: b.customerEmail, phone: b.customerPhone, branchId: b.branchId }))
          ]
            .filter((v, i, arr) => v.id && arr.findIndex(x => x.id === v.id) === i)
            .filter(v => filterBranch === 'all' ? true : v.branchId === filterBranch)
            .slice(0, 20)
            .map(c => (
              <div key={c.id + (c.branchId||'')} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{c.name || `Customer #${c.id?.slice(0,6)}`}</p>
                  <p className="text-xs text-gray-600">{c.email || '—'}</p>
                </div>
                <div className="text-sm text-gray-600">{c.phone || '—'}</div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );

  // Admin: Tracking modal
  const renderAdminTrackingModal = () => (
    selectedOrderForTracking ? (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-md">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Add Tracking Update - Order #{selectedOrderForTracking.orderId.slice(0,8)}</h3>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select value={adminTrackingUpdate.status} onChange={(e) => setAdminTrackingUpdate({...adminTrackingUpdate, status: e.target.value})} className="w-full border border-gray-300 rounded-md px-3 py-2">
                <option value="">Select Status</option>
                <option value="Order Confirmed">Order Confirmed</option>
                <option value="Processing">Processing</option>
                <option value="Shipped">Shipped</option>
                <option value="Out for Delivery">Out for Delivery</option>
                <option value="Delivered">Delivered</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
              <input type="text" value={adminTrackingUpdate.location} onChange={(e) => setAdminTrackingUpdate({...adminTrackingUpdate, location: e.target.value})} className="w-full border border-gray-300 rounded-md px-3 py-2" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea value={adminTrackingUpdate.description} onChange={(e) => setAdminTrackingUpdate({...adminTrackingUpdate, description: e.target.value})} rows={3} className="w-full border border-gray-300 rounded-md px-3 py-2" />
            </div>
          </div>
          <div className="flex justify-end space-x-3 mt-4">
            <button onClick={() => setSelectedOrderForTracking(null)} className="px-4 py-2 bg-gray-200 rounded-md">Cancel</button>
            <button onClick={() => handleAdminAddTracking(selectedOrderForTracking.orderId)} className="px-4 py-2 bg-indigo-600 text-white rounded-md">Add Update</button>
          </div>
        </div>
      </div>
    ) : null
  );

  // Admin: handle adding tracking updates
  const handleAdminAddTracking = async (orderId: string) => {
    if (adminTrackingUpdate.status && adminTrackingUpdate.location) {
      await addTrackingUpdate(orderId, { ...adminTrackingUpdate, timestamp: new Date().toISOString() });
      setAdminTrackingUpdate({ status: '', location: '', description: '' });
      setSelectedOrderForTracking(null);
    }
  };

  const renderCMSManagement = () => (
    <div className="space-y-6">
      {/* Header with Add Button */}
      <div className="flex justify-between items-center">
        <h3 className="text-2xl font-bold text-gray-800">Content Management System</h3>
        <button
          onClick={() => setShowAddContent(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>Add Content</span>
        </button>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cmsContent.map(content => {
          const typeInfo = getContentTypeInfo(content.type);
          return (
            <div key={content.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
              {/* Content Images */}
              {content.images && content.images.length > 0 && (
                <div className="relative h-48 bg-gray-200">
                  <img
                    src={content.images[0]}
                    alt={content.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://images.pexels.com/photos/1148998/pexels-photo-1148998.jpeg';
                    }}
                  />
                  {content.images.length > 1 && (
                    <div className="absolute top-2 right-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-xs">
                      +{content.images.length - 1} more
                    </div>
                  )}
                </div>
              )}

              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${typeInfo.color}`}>
                    {typeInfo.label}
                  </span>
                  <div className="flex items-center space-x-1">
                    {content.isActive ? (
                      <Eye className="h-4 w-4 text-green-600" />
                    ) : (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    )}
                  </div>
                </div>

                <h4 className="font-bold text-gray-800 mb-2">{content.title}</h4>
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">{content.content}</p>

                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-500">
                    Updated: {new Date(content.updatedAt).toLocaleDateString()}
                  </span>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setEditingContent(content)}
                      className="text-blue-600 hover:text-blue-800 transition-colors"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteContent(content.id)}
                      className="text-red-600 hover:text-red-800 transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Content Modal */}
      {showAddContent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-900">Add New Content</h3>
              <button
                onClick={() => setShowAddContent(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Content Type</label>
                <select
                  value={newContent.type}
                  onChange={(e) => setNewContent({ ...newContent, type: e.target.value as CMSContent['type'] })}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {contentTypes.map(type => (
                    <option key={type.value} value={type.value}>{type.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                <input
                  type="text"
                  value={newContent.title}
                  onChange={(e) => setNewContent({ ...newContent, title: e.target.value })}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter content title"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Content</label>
                <textarea
                  value={newContent.content}
                  onChange={(e) => setNewContent({ ...newContent, content: e.target.value })}
                  rows={4}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter content description"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium text-gray-700">Images</label>
                  <button
                    onClick={() => addImageField(false)}
                    className="text-blue-600 hover:text-blue-800 text-sm flex items-center space-x-1"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Add Image</span>
                  </button>
                </div>
                <div className="space-y-2">
                  {newContent.images.map((image, index) => (
                    <div key={index} className="flex space-x-2">
                      <input
                        type="url"
                        value={image}
                        onChange={(e) => updateImageField(index, e.target.value, false)}
                        className="flex-1 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter image URL"
                      />
                      {newContent.images.length > 1 && (
                        <button
                          onClick={() => removeImageField(index, false)}
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
                  checked={newContent.isActive}
                  onChange={(e) => setNewContent({ ...newContent, isActive: e.target.checked })}
                  className="mr-2"
                />
                <label htmlFor="isActive" className="text-sm font-medium text-gray-700">
                  Active (visible on website)
                </label>
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowAddContent(false)}
                className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAddContent}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Add Content
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Content Modal */}
      {editingContent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-900">Edit Content</h3>
              <button
                onClick={() => setEditingContent(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Content Type</label>
                <select
                  value={editingContent.type}
                  onChange={(e) => setEditingContent({ ...editingContent, type: e.target.value as CMSContent['type'] })}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {contentTypes.map(type => (
                    <option key={type.value} value={type.value}>{type.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                <input
                  type="text"
                  value={editingContent.title}
                  onChange={(e) => setEditingContent({ ...editingContent, title: e.target.value })}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Content</label>
                <textarea
                  value={editingContent.content}
                  onChange={(e) => setEditingContent({ ...editingContent, content: e.target.value })}
                  rows={4}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium text-gray-700">Images</label>
                  <button
                    onClick={() => addImageField(true)}
                    className="text-blue-600 hover:text-blue-800 text-sm flex items-center space-x-1"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Add Image</span>
                  </button>
                </div>
                <div className="space-y-2">
                  {editingContent.images.map((image: string, index: number) => (
                    <div key={index} className="flex space-x-2">
                      <input
                        type="url"
                        value={image}
                        onChange={(e) => updateImageField(index, e.target.value, true)}
                        className="flex-1 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter image URL"
                      />
                      {editingContent.images.length > 1 && (
                        <button
                          onClick={() => removeImageField(index, true)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <X className="h-5 w-5" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
                
                {/* Image Preview */}
                {editingContent.images.filter((img: string) => img.trim() !== '').length > 0 && (
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Image Preview</label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {editingContent.images
                        .filter((img: string) => img.trim() !== '')
                        .map((image: string, index: number) => (
                          <div key={index} className="relative">
                            <img
                              src={image}
                              alt={`Preview ${index + 1}`}
                              className="w-full h-20 object-cover rounded border"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = 'https://images.pexels.com/photos/1148998/pexels-photo-1148998.jpeg';
                              }}
                            />
                          </div>
                        ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="editIsActive"
                  checked={editingContent.isActive}
                  onChange={(e) => setEditingContent({ ...editingContent, isActive: e.target.checked })}
                  className="mr-2"
                />
                <label htmlFor="editIsActive" className="text-sm font-medium text-gray-700">
                  Active (visible on website)
                </label>
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setEditingContent(null)}
                className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveContent}
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

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600">Welcome back, {user?.name}</p>
        </div>

        {/* Navigation Tabs */}
        <div className="mb-8">
          <nav className="flex space-x-8 overflow-x-auto">
            {[
              { id: 'overview', label: 'Overview', icon: TrendingUp },
              { id: 'analytics', label: 'Sales Analytics', icon: BarChart3 },
              { id: 'products', label: 'Products', icon: Package },
              { id: 'sessions', label: 'Sessions', icon: Calendar },
              { id: 'payments', label: 'Payments', icon: CreditCard },
              { id: 'cms', label: 'Content Management', icon: Settings },
              { id: 'branches', label: 'Branches', icon: MapPin },
              { id: 'managers', label: 'Managers', icon: Users }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center px-3 py-2 border-b-2 font-medium text-sm whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <tab.icon className="h-4 w-4 mr-2" />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div>
          {activeTab === 'overview' && renderOverview()}
          {activeTab === 'analytics' && <SalesAnalytics />}
          {activeTab === 'products' && <ProductManagement />}
          {activeTab === 'sessions' && <EnhancedSessionManagement />}
          {activeTab === 'payments' && <PaymentTracking />}
          {activeTab === 'cms' && renderCMSManagement()}
          {activeTab === 'branches' && <BranchManagement />}
          {activeTab === 'managers' && <ManagerManagement />}
        </div>
  {renderAdminTrackingModal()}
      </div>
    </div>
  );
};

export default AdminDashboard;