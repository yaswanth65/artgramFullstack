import React, { useState, useEffect } from 'react';
import { useData } from '../../contexts/DataContext';
import { useAuth } from '../../contexts/AuthContext';
import {
  QrCode,
  Package,
  TrendingUp,
  Calendar,
  DollarSign,
  Eye,
  Truck,
  CheckCircle,
  Camera,
  X,
  AlertCircle
} from 'lucide-react';
import type { Order } from '../../types';

const ManagerDashboard: React.FC = () => {
  const { user } = useAuth();
  const {
    orders,
    events,
    bookings,
    branches
  } = useData();

  const [activeTab, setActiveTab] = useState('overview');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [trackingUpdate, setTrackingUpdate] = useState({
    status: '',
    location: '',
    description: ''
  });
  const [qrCode, setQrCode] = useState('');
  const [qrScannerOpen, setQrScannerOpen] = useState(false);
  const [qrResult, setQrResult] = useState<any>(null);
  const videoRef = React.useRef<HTMLVideoElement | null>(null);
  const [scannerActive, setScannerActive] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Get API base URL
  const apiBase = (import.meta as any).env?.VITE_API_URL || '/api';

  // Get manager's branch (Branch.managerId is the manager user id)
  const managerBranch = branches.find(branch => (
    branch.managerId === user?.id || branch.id === user?.branchId
  ));

  // Filter data for manager's branch
  const branchOrders = orders.filter(order => order.branchId === managerBranch?.id);
  const branchBookings = bookings.filter(booking => booking.branchId === managerBranch?.id);
  const branchEvents = events.filter(event => event.branchId === managerBranch?.id);

  // Calculate analytics
  const totalRevenue = branchOrders.reduce((sum, order) => sum + order.totalAmount, 0);
  const totalBookings = branchBookings.length;
  const pendingOrders = branchOrders.filter(order => order.orderStatus === 'pending').length;

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const updateOrderStatus = async (orderId: string, status: string) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${apiBase}/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` })
        },
        body: JSON.stringify({ status })
      });

      if (response.ok) {
        showToast('Order status updated successfully', 'success');
        // Refresh the page to update the orders
        window.location.reload();
      } else {
        const error = await response.json();
        showToast(error.message || 'Failed to update order status', 'error');
      }
    } catch (error) {
      console.error('Error updating order status:', error);
      showToast('Error updating order status', 'error');
    }
  };

  const addTrackingUpdate = async (orderId: string, update: any) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${apiBase}/orders/${orderId}/tracking`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` })
        },
        body: JSON.stringify(update)
      });

      if (response.ok) {
        showToast('Tracking update added successfully', 'success');
        window.location.reload();
      } else {
        const error = await response.json();
        showToast(error.message || 'Failed to add tracking update', 'error');
      }
    } catch (error) {
      console.error('Error adding tracking update:', error);
      showToast('Error adding tracking update', 'error');
    }
  };

  const verifyQRCode = async (qrCodeValue: string) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${apiBase}/orders/verify-qr`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` })
        },
        body: JSON.stringify({ qrCode: qrCodeValue })
      });

      if (response.ok) {
        const result = await response.json();
        setQrResult(result);
        showToast('QR Code verified successfully!', 'success');
      } else {
        const error = await response.json();
        showToast(error.message || 'Invalid QR Code', 'error');
        setQrResult(null);
      }
    } catch (error) {
      console.error('Error verifying QR code:', error);
      showToast('Error verifying QR code', 'error');
      setQrResult(null);
    }
  };

  const handleQRSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (qrCode.trim()) {
      verifyQRCode(qrCode.trim());
      setQrCode('');
    }
  };

  // Simple camera-based QR scanner using BarcodeDetector if available
  useEffect(() => {
    let stream: MediaStream | null = null;
    let rafId: number | null = null;
    let detector: any = null;
    const start = async () => {
      if (!qrScannerOpen || scannerActive) return;
      try {
        // @ts-ignore: experimental API
        const Supported = 'BarcodeDetector' in window;
        if (!Supported) return;
        // @ts-ignore
        detector = new (window as any).BarcodeDetector({ formats: ['qr_code'] });
        stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
          setScannerActive(true);
          const scan = async () => {
            try {
              if (!videoRef.current) return;
              // @ts-ignore
              const detections = await detector.detect(videoRef.current);
              if (detections && detections.length > 0) {
                const code = detections[0].rawValue || detections[0].rawValue;
                if (code) {
                  verifyQRCode(code);
                }
              }
            } catch { }
            rafId = requestAnimationFrame(scan);
          };
          rafId = requestAnimationFrame(scan);
        }
      } catch (e) {
        // Fallback: no-op
      }
    };
    const stop = () => {
      if (rafId) cancelAnimationFrame(rafId);
      if (stream) {
        stream.getTracks().forEach(t => t.stop());
      }
      setScannerActive(false);
    };
    if (qrScannerOpen) start();
    return () => stop();
  }, [qrScannerOpen]);

  const handleStatusUpdate = (orderId: string, status: string) => {
    updateOrderStatus(orderId, status);
  };

  const handleAddTracking = (orderId: string) => {
    if (trackingUpdate.status && trackingUpdate.location) {
      addTrackingUpdate(orderId, {
        ...trackingUpdate,
        timestamp: new Date().toISOString()
      });
      setTrackingUpdate({ status: '', location: '', description: '' });
      setSelectedOrder(null);
    }
  };

  const orderStatusOptions = [
    { value: 'pending', label: 'Pending' },
    { value: 'payment_confirmed', label: 'Payment Confirmed' },
    { value: 'processing', label: 'Processing' },
    { value: 'packed', label: 'Packed' },
    { value: 'shipped', label: 'Shipped' },
    { value: 'in_transit', label: 'In Transit' },
    { value: 'out_for_delivery', label: 'Out for Delivery' },
    { value: 'delivered', label: 'Delivered' },
    { value: 'cancelled', label: 'Cancelled' }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'out_for_delivery': return 'bg-blue-100 text-blue-800';
      case 'in_transit': return 'bg-indigo-100 text-indigo-800';
      case 'shipped': return 'bg-purple-100 text-purple-800';
      case 'packed': return 'bg-cyan-100 text-cyan-800';
      case 'processing': return 'bg-yellow-100 text-yellow-800';
      case 'payment_confirmed': return 'bg-emerald-100 text-emerald-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Branch Info */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-2">
          {managerBranch?.name || 'Branch Manager Dashboard'}
        </h2>
        <p className="opacity-90">{managerBranch?.location}</p>
      </div>

      {/* Analytics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900">${totalRevenue.toFixed(2)}</p>
            </div>
            <DollarSign className="h-8 w-8 text-green-600" />
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
              <p className="text-sm font-medium text-gray-600">Pending Orders</p>
              <p className="text-2xl font-bold text-gray-900">{pendingOrders}</p>
            </div>
            <Package className="h-8 w-8 text-orange-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Events</p>
              <p className="text-2xl font-bold text-gray-900">{branchEvents.length}</p>
            </div>
            <TrendingUp className="h-8 w-8 text-purple-600" />
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4">Recent Orders</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Order ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {branchOrders.slice(0, 5).map((order) => (
                <tr key={order.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    #{order.id.slice(0, 8)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="font-medium text-gray-900">{order.customerName || `Customer #${order.customerId.slice(0, 6)}`}</div>
                    <div className="text-xs text-gray-600">{order.customerEmail || '—'}</div>
                    <div className="text-xs text-gray-600">{order.customerPhone || '—'}</div>
                    <div className="text-xs text-gray-500 mt-1">
                      {order.shippingAddress ? `${order.shippingAddress.street}, ${order.shippingAddress.city}, ${order.shippingAddress.state} - ${order.shippingAddress.zipCode}` : '—'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    ₹{order.totalAmount.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(order.orderStatus)}`}>
                      {orderStatusOptions.find(opt => opt.value === order.orderStatus)?.label || order.orderStatus}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => setSelectedOrder(order)}
                      className="text-indigo-600 hover:text-indigo-900 mr-3"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Customer Details (branch scoped) */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4">Customer Details</h3>
        <div className="space-y-3">
          {[
            ...branchOrders.map(o => ({ id: o.customerId, name: o.customerName, email: o.customerEmail, phone: o.customerPhone })),
            ...branchBookings.map(b => ({ id: b.customerId, name: b.customerName, email: b.customerEmail, phone: b.customerPhone }))
          ]
            .filter((v, i, arr) => v.id && arr.findIndex(x => x.id === v.id) === i)
            .slice(0, 8)
            .map(c => (
              <div key={c.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{c.name || `Customer #${c.id?.slice(0, 6)}`}</p>
                  <p className="text-xs text-gray-600">{c.email || '—'}</p>
                </div>
                <div className="text-sm text-gray-600">{c.phone || '—'}</div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );

  const renderOrderManagement = () => (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h3 className="text-lg font-bold text-gray-800 mb-4">Order Management</h3>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Order ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Customer
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Items
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {branchOrders.map((order) => (
              <tr key={order.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  #{order.id.slice(0, 8)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div className="font-medium text-gray-900">{order.customerName || `Customer #${order.customerId.slice(0, 6)}`}</div>
                  <div className="text-xs text-gray-600">{order.customerEmail || '—'}</div>
                  <div className="text-xs text-gray-600">{order.customerPhone || '—'}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {order.products.length} items
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  ₹{order.totalAmount.toFixed(2)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <select
                    value={order.orderStatus}
                    onChange={(e) => handleStatusUpdate(order.id, e.target.value)}
                    className={`text-sm border-none rounded-md focus:ring-indigo-500 focus:border-indigo-500 px-2 py-1 ${getStatusColor(order.orderStatus)}`}
                  >
                    {orderStatusOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={() => setSelectedOrder(order)}
                    className="text-indigo-600 hover:text-indigo-900 mr-3"
                    title="Add tracking update"
                  >
                    <Truck className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setSelectedOrder(order)}
                    className="text-gray-600 hover:text-gray-900"
                    title="View details"
                  >
                    <Eye className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderQRVerification = () => (
    <div className="space-y-6">
      {/* QR Scanner Section */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4">QR Code Scanner</h3>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Manual QR Input */}
          <div>
            <h4 className="text-md font-semibold text-gray-700 mb-3">Manual QR Code Entry</h4>
            <form onSubmit={handleQRSubmit} className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Enter QR Code
                </label>
                <input
                  type="text"
                  value={qrCode}
                  onChange={(e) => setQrCode(e.target.value)}
                  placeholder="Scan or type QR code here"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <button
                type="submit"
                disabled={!qrCode.trim()}
                className="w-full bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                Verify QR Code
              </button>
            </form>
          </div>

          {/* Camera Scanner */}
          <div>
            <h4 className="text-md font-semibold text-gray-700 mb-3">Camera Scanner</h4>
            <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
              <Camera className="h-12 w-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-600 mb-4">Use your device camera to scan QR codes</p>
              {!qrScannerOpen ? (
                <button
                  onClick={() => setQrScannerOpen(true)}
                  className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
                >
                  Open Camera Scanner
                </button>
              ) : (
                <div>
                  <video ref={videoRef} className="mx-auto w-full max-w-xs rounded border" muted playsInline></video>
                  <button
                    onClick={() => setQrScannerOpen(false)}
                    className="mt-3 bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700"
                  >
                    Close Scanner
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* QR Verification Result */}
        {qrResult && (
          <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-start">
              <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 mr-3 flex-shrink-0" />
              <div>
                <h4 className="text-green-800 font-medium">Booking Verified Successfully!</h4>
                <div className="mt-2 text-sm text-green-700">
                  <p><strong>Customer:</strong> {qrResult.booking.customerName}</p>
                  <p><strong>Activity:</strong> {qrResult.booking.activity}</p>
                  <p><strong>Date:</strong> {qrResult.booking.date}</p>
                  <p><strong>Time:</strong> {qrResult.booking.time}</p>
                  <p><strong>Seats:</strong> {qrResult.booking.seats}</p>
                  <p><strong>Verified at:</strong> {new Date(qrResult.booking.verifiedAt).toLocaleString()}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Recent Verifications */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h4 className="text-md font-semibold text-gray-800 mb-4">Recent Verifications</h4>
        <div className="space-y-3">
          {branchBookings
            .filter(booking => booking.isVerified)
            .slice(0, 10)
            .map((booking) => (
              <div key={booking.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{booking.customerName || `Customer #${booking.customerId.slice(0, 6)}`}</p>
                  <p className="text-sm text-gray-600">
                    {booking.activity} • {booking.date} • {booking.time}
                  </p>
                  <p className="text-xs text-gray-500">
                    QR: {booking.qrCode}
                  </p>
                </div>
                <div className="flex items-center text-green-600">
                  <CheckCircle className="h-5 w-5 mr-2" />
                  <div className="text-right">
                    <span className="text-sm font-medium">Verified</span>
                    <p className="text-xs text-gray-500">
                      {booking.verifiedAt ? new Date(booking.verifiedAt).toLocaleDateString() : ''}
                    </p>
                  </div>
                </div>
              </div>
            ))}

          {branchBookings.filter(booking => booking.isVerified).length === 0 && (
            <div className="text-center py-6 text-gray-500">
              <QrCode className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>No verified bookings yet</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Manager Dashboard</h1>
          <p className="text-gray-600">Welcome back, {user?.name}</p>
        </div>

        {/* Navigation Tabs */}
        <div className="mb-8">
          <nav className="flex space-x-8 overflow-x-auto">
            {[
              { id: 'overview', label: 'Overview', icon: TrendingUp },
              { id: 'orders', label: 'Orders', icon: Package },
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

        {/* Tab Content */}
        <div>
          {activeTab === 'overview' && renderOverview()}
          {activeTab === 'orders' && renderOrderManagement()}
          {activeTab === 'qr' && renderQRVerification()}
        </div>

        {/* Tracking Update Modal */}
        {selectedOrder && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                Add Tracking Update - Order #{selectedOrder.id.slice(0, 8)}
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <select
                    value={trackingUpdate.status}
                    onChange={(e) => setTrackingUpdate({ ...trackingUpdate, status: e.target.value })}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="">Select Status</option>
                    {orderStatusOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Location
                  </label>
                  <input
                    type="text"
                    value={trackingUpdate.location}
                    onChange={(e) => setTrackingUpdate({ ...trackingUpdate, location: e.target.value })}
                    placeholder="e.g., Warehouse, Transit Hub, Local Facility"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description (Optional)
                  </label>
                  <textarea
                    value={trackingUpdate.description}
                    onChange={(e) => setTrackingUpdate({ ...trackingUpdate, description: e.target.value })}
                    placeholder="Additional details about this update"
                    rows={3}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleAddTracking(selectedOrder.id)}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
                >
                  Add Update
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Toast Notifications */}
      {toast && (
        <div className={`fixed bottom-6 right-6 px-4 py-3 rounded-lg shadow-lg z-50 ${toast.type === 'success' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
          }`}>
          <div className="flex items-center">
            {toast.type === 'success' ? (
              <CheckCircle className="h-5 w-5 mr-2" />
            ) : (
              <AlertCircle className="h-5 w-5 mr-2" />
            )}
            {toast.message}
          </div>
        </div>
      )}

      {/* Camera Scanner Modal (Placeholder) */}
      {qrScannerOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Camera QR Scanner</h3>
              <button onClick={() => setQrScannerOpen(false)}>
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="text-center py-8">
              <Camera className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-4">
                Camera scanner integration would go here.
                For now, use the manual QR code entry field.
              </p>
              <button
                onClick={() => setQrScannerOpen(false)}
                className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManagerDashboard;