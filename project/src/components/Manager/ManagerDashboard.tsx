import React, { useState, useEffect, useRef } from 'react';
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
  AlertCircle
} from 'lucide-react';
import type { Order, Booking, Branch, Event as CustomEvent } from '../../types';

const ManagerDashboard: React.FC = () => {
  const { user } = useAuth();
  const {
    orders: contextOrders,
    events: contextEvents,
    bookings: contextBookings,
    branches: contextBranches,
    updateOrderStatus: contextUpdateOrderStatus,
    addTrackingUpdate: contextAddTrackingUpdate
  } = useData();

  // Local state that mirrors context, without mock fallbacks
  const [orders, setOrders] = useState<Order[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [customEvents, setCustomEvents] = useState<CustomEvent[]>([]);

  // Sync with context data and persist locally
  useEffect(() => {
    setOrders(contextOrders);
  }, [contextOrders]);

  useEffect(() => {
    setBookings(contextBookings);
  }, [contextBookings]);

  useEffect(() => {
    if (contextBranches.length > 0) {
      setBranches(contextBranches);
    }
  }, [contextBranches]);

  useEffect(() => {
    if (contextEvents.length > 0) {
      setCustomEvents(contextEvents);
    }
  }, [contextEvents]);

  // Debug: Track data changes and persist state
  useEffect(() => {
    console.log('🔄 ManagerDashboard - Data updated:', {
      ordersCount: orders.length,
      bookingsCount: bookings.length,
      branchesCount: branches.length,
      eventsCount: customEvents.length,
      timestamp: new Date().toISOString()
    });
  }, [orders.length, bookings.length, branches.length, customEvents.length]);
 
  const [tokenWarning, setTokenWarning] = useState(false);
  useEffect(() => {
    const checkTokenExpiry = () => {
      const token = localStorage.getItem('token');
      if (!token) return;

      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const now = Date.now() / 1000;
        const timeUntilExpiry = payload.exp - now;

        // Show warning if token expires in less than 1 hour
        if (timeUntilExpiry < 3600 && timeUntilExpiry > 0) {
          setTokenWarning(true);
        } else if (timeUntilExpiry <= 0) {
          // Token expired, force logout
          localStorage.removeItem('user');
          localStorage.removeItem('token');
          window.location.reload();
        }
      } catch (error) {
        console.error('Error checking token expiry:', error);
      }
    };

    checkTokenExpiry();
    const interval = setInterval(checkTokenExpiry, 60000); // Check every minute
    return () => clearInterval(interval);
  }, []);

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
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [scannerActive, setScannerActive] = useState(false);
  const scannerActiveRef = useRef(false);
  const scanIntervalRef = React.useRef<number | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  // Set initial loading to false and provide immediate data
  const [isDataLoading, setIsDataLoading] = useState(false);  // Track when data is initially loaded
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsDataLoading(false);
    }, 3000); // Give data 3 seconds to load

    return () => clearTimeout(timer);
  }, []);

  // Reset loading state when data arrives
  useEffect(() => {
    if (orders.length > 0 || bookings.length > 0) {
      setIsDataLoading(false);
    }
  }, [orders.length, bookings.length]);

  // Get API base URL
  const apiBase = (import.meta as any).env?.VITE_API_URL || '/api';

  // Determine manager branchId even if branches haven't loaded yet
  const effectiveBranchId = user?.branchId || branches.find(b => b.managerId === user?.id)?.id || undefined;

  // Filter data for manager's branch using effectiveBranchId
  const branchOrders = effectiveBranchId ? orders.filter(order => order.branchId === effectiveBranchId) : orders;
  const branchBookings = effectiveBranchId ? bookings.filter(booking => booking.branchId === effectiveBranchId) : bookings;
  const branchEvents = effectiveBranchId ? customEvents.filter((event: CustomEvent) => event.branchId === effectiveBranchId) : customEvents;

  // Calculate analytics
  const totalRevenue = branchOrders.reduce((sum, order) => sum + order.totalAmount, 0);
  const totalBookings = branchBookings.length;
  const pendingOrders = branchOrders.filter(order => order.orderStatus === 'pending').length;

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const updateOrderStatus = async (orderId: string, status: string) => {
    await contextUpdateOrderStatus(orderId, status);
    showToast('Order status updated', 'success');
  };

  const addTrackingUpdate = async (orderId: string, update: any) => {
    await contextAddTrackingUpdate(orderId, update);
    showToast('Tracking update added', 'success');
  };

  const verifyQRCode = async (qrCodeValue: string) => {
    try {
      console.log('🔍 Verifying QR code:', qrCodeValue);

      // First try to parse if it's a JSON string
      let codeToVerify = qrCodeValue;
      try {
        const parsed = JSON.parse(qrCodeValue);
        if (parsed.type === 'booking' && parsed.qrCode) {
          codeToVerify = parsed.qrCode;
          console.log('📋 Extracted QR code from JSON:', codeToVerify);
        }
      } catch {
        // Not JSON, use as is
      }

      // Check if this is our test QR code or matches any booking
      const matchingBooking = bookings.find(booking => booking.qrCode === codeToVerify);

      if (matchingBooking) {
        // Local verification successful
        const result = {
          success: true,
          booking: {
            customerName: matchingBooking.customerName,
            activity: matchingBooking.activity,
            date: matchingBooking.date,
            time: matchingBooking.time,
            seats: matchingBooking.seats,
            status: matchingBooking.status,
            verifiedAt: new Date().toISOString()
          }
        };

        setQrResult(result);
        showToast('QR Code verified successfully!', 'success');
        console.log('✅ QR verification successful:', result);

        // Update booking status locally and persist
        setBookings(prevBookings => {
          const updatedBookings = prevBookings.map(booking =>
            booking.qrCode === codeToVerify
              ? { ...booking, isVerified: true, verifiedAt: new Date().toISOString(), verifiedBy: user?.name || 'Manager' }
              : booking
          );

          // Save to localStorage for persistence
          try {
            localStorage.setItem('manager_bookings', JSON.stringify(updatedBookings));
            console.log('📅 Updated booking verification and cached locally');
          } catch (error) {
            console.warn('Failed to cache updated bookings:', error);
          }

          return updatedBookings;
        });

        return;
      }

      // Try backend verification as fallback (bookings route supports verify-qr)
      const token = localStorage.getItem('token');
      const response = await fetch(`${apiBase}/bookings/verify-qr`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` })
        },
        body: JSON.stringify({ qrCode: codeToVerify })
      });

      if (response.ok) {
        const result = await response.json();
        setQrResult(result);
        showToast('QR Code verified successfully via backend!', 'success');
        console.log('✅ Backend QR verification successful:', result);

        // Persist verification into local bookings state using returned booking id or qr
        setBookings(prevBookings => {
          const bookingIdFromResult = result?.booking?.id;
          const updated = prevBookings.map(b =>
            (bookingIdFromResult ? b.id === bookingIdFromResult : b.qrCode === codeToVerify)
              ? { ...b, isVerified: true, verifiedAt: result?.booking?.verifiedAt || new Date().toISOString(), verifiedBy: user?.name || 'Manager' }
              : b
          );
          try { localStorage.setItem('bookings', JSON.stringify(updated)); } catch { /* ignore */ }
          try { window.dispatchEvent(new Event('app_data_updated')); } catch { /* ignore */ }
          return updated;
        });
      } else {
        const error = await response.json();
        console.error('❌ QR verification failed:', error);
        showToast(error.message || 'Invalid QR Code.', 'error');
        setQrResult(null);
      }
    } catch (error) {
      console.error('Error verifying QR code:', error);
      showToast('Error verifying QR code. Try the test QR: QR-1756191881137-1', 'error');
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

  // Enhanced QR scanner with jsQR implementation like i.html
  useEffect(() => {
    let stream: MediaStream | null = null;
    let animationFrame: number | null = null;
    
    const startScanner = async () => {
      if (!qrScannerOpen || scannerActiveRef.current) return;

      try {
        console.log('🎥 Starting QR scanner...');

        // Load jsQR library if not already loaded
        if (!(window as any).jsQR) {
          await new Promise<void>((resolve, reject) => {
            const script = document.createElement('script');
            script.src = 'https://cdn.jsdelivr.net/npm/jsqr@1.4.0/dist/jsQR.js';
            script.onload = () => resolve();
            script.onerror = () => reject(new Error('Failed to load jsQR'));
            document.head.appendChild(script);
          });
        }

        // Request camera access
        const constraints = {
          video: {
            facingMode: 'environment', // Use back camera if available
            width: { ideal: 640 },
            height: { ideal: 480 },
          },
        };

        console.log('📱 Requesting camera access...');
        stream = await navigator.mediaDevices.getUserMedia(constraints);
        const videoElement = videoRef.current;
        const canvas = canvasRef.current;

        if (videoElement && canvas && stream) {
          videoElement.srcObject = stream;
          
          // Ensure mobile browsers allow autoplay by muting and using playsinline
          videoElement.muted = true;
          videoElement.setAttribute('playsinline', '');
          
          await videoElement.play();
          console.log('✅ Video playing');
          setScannerActive(true);
          scannerActiveRef.current = true;

            const scanQRCode = () => {
            if (!scannerActiveRef.current || !videoElement || !canvas) return;

            const context = canvas.getContext('2d');
            if (context && videoElement.readyState === videoElement.HAVE_ENOUGH_DATA) {
              // Only set sizes when we have video dimensions
              if (videoElement.videoWidth && videoElement.videoHeight) {
                canvas.width = videoElement.videoWidth;
                canvas.height = videoElement.videoHeight;
                
                try {
                  context.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
                  const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
                  
                  const jsQR = (window as any).jsQR;
                  if (jsQR) {
                    const code = jsQR(imageData.data, imageData.width, imageData.height);

                    if (code && code.data) {
                      console.log('📱 QR Code detected:', code.data);
                      
                      // Process the QR code
                      let qrCodeToVerify = code.data.trim();

                      // Try to parse as JSON first
                      try {
                        const parsed = JSON.parse(code.data);
                        if (parsed.type === 'booking' && parsed.qrCode) {
                          qrCodeToVerify = parsed.qrCode;
                        }
                      } catch {
                        // If not JSON, use the code directly
                      }

                      // Verify the QR code and close scanner
                      verifyQRCode(qrCodeToVerify);
                      setQrScannerOpen(false);
                      return;
                    }
                  }
                } catch (e) {
                  // Some browsers may throw when reading image data before ready; ignore and continue
                  console.warn('scanQRCode: read image error', e);
                }
              }
            }

            if (scannerActiveRef.current) {
              animationFrame = requestAnimationFrame(scanQRCode);
            }
          };

          // Start scanning loop
          animationFrame = requestAnimationFrame(scanQRCode);
        }
      } catch (error) {
        console.error('❌ Camera initialization failed:', error);
        let errorMessage = 'Failed to access camera. ';

        if (error instanceof Error) {
          if (error.name === 'NotAllowedError') {
            errorMessage += 'Please allow camera access in your browser settings and try again.';
          } else if (error.name === 'NotFoundError') {
            errorMessage += 'No camera found on this device.';
          } else if (error.name === 'NotReadableError') {
            errorMessage += 'Camera is already in use by another application.';
          } else if (error.name === 'OverconstrainedError') {
            errorMessage += 'Camera constraints not supported.';
          } else {
            errorMessage += error.message;
          }
        }

        showToast(errorMessage, 'error');
        setQrScannerOpen(false);
      }
    };

  const stopScanner = () => {
      console.log('🛑 Stopping camera scanner...');

      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
        animationFrame = null;
      }

      if (stream) {
        stream.getTracks().forEach(track => {
          track.stop();
          console.log('🎥 Camera track stopped:', track.kind);
        });
        stream = null;
      }

      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }

      setScannerActive(false);
      scannerActiveRef.current = false;
    };

    if (qrScannerOpen) {
      startScanner();
    } else {
      stopScanner();
    }

    return () => stopScanner();
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
          {branches.find(b => b.id === effectiveBranchId)?.name || 'Branch Manager Dashboard'}
        </h2>
        <p className="opacity-90">{branches.find(b => b.id === effectiveBranchId)?.location}</p>
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
                  placeholder="Scan or type QR code here (e.g., QR-1756191881137-1)"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <div className="mt-2 text-xs text-gray-500">
                  <p><strong>Test QR Code:</strong> QR-1756191881137-1</p>
                  <p>Or paste the full JSON booking data</p>
                </div>
              </div>
              <button
                type="submit"
                disabled={!qrCode.trim()}
                className="w-full bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                Verify QR Code
              </button>
              <button
                type="button"
                onClick={() => setQrCode('QR-1756191881137-1')}
                className="w-full bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition-colors text-sm"
              >
                Use Test QR Code
              </button>
            </form>
          </div>

          {/* Camera Scanner */}
          <div>
            <h4 className="text-md font-semibold text-gray-700 mb-3">Camera Scanner</h4>
            {!qrScannerOpen ? (
              <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
                <Camera className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-600 mb-4">Use your device camera to scan QR codes</p>
                <button
                  onClick={() => setQrScannerOpen(true)}
                  className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
                >
                  🎥 Start Scanner
                </button>
                <div className="text-xs text-gray-500 mt-3 space-y-1">
                  <p>• Ensure camera permissions are enabled</p>
                  <p>• Point QR code within the scanning area</p>
                  <p>• Use manual entry if camera scanning fails</p>
                </div>
              </div>
            ) : (
              <div className="text-center">
                <div className="relative inline-block mb-4">
                  <video
                    ref={videoRef}
                    className="mx-auto w-full max-w-xs rounded border bg-black"
                    muted
                    playsInline
                    style={{ aspectRatio: '4/3' }}
                  />
                  
                  {/* Hidden canvas used by jsQR */}
                  <canvas ref={canvasRef} style={{ display: 'none' }} />
                  
                  {/* Scanner overlay with professional styling like i.html */}
                  {scannerActive && (
                    <div className="absolute inset-0 pointer-events-none">
                      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                        <div className="w-32 h-32 border-2 border-green-400 rounded-lg animate-pulse relative">
                          {/* Corner decorations */}
                          <div className="absolute -top-1 -left-1 w-6 h-6 border-l-4 border-t-4 border-green-400"></div>
                          <div className="absolute -top-1 -right-1 w-6 h-6 border-r-4 border-t-4 border-green-400"></div>
                          <div className="absolute -bottom-1 -left-1 w-6 h-6 border-l-4 border-b-4 border-green-400"></div>
                          <div className="absolute -bottom-1 -right-1 w-6 h-6 border-r-4 border-b-4 border-green-400"></div>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* Loading state */}
                  {!scannerActive && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded">
                      <div className="text-white text-center">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mx-auto mb-2"></div>
                        <p className="text-sm">Starting camera...</p>
                      </div>
                    </div>
                  )}
                </div>
                
                <button
                  onClick={() => setQrScannerOpen(false)}
                  className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
                >
                  ⏹️ Stop Scanner
                </button>
                
                <div className="text-xs text-gray-500 mt-2 space-y-1">
                  <p>📱 Position QR code within the highlighted area</p>
                  <p>🔍 Scanner will automatically detect and process the code</p>
                  <p>💡 If automatic scanning fails, use manual entry above</p>
                </div>
              </div>
            )}
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

        {/* Token Expiry Warning */}
        {tokenWarning && (
          <div className="mb-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-center">
              <AlertCircle className="h-5 w-5 text-yellow-600 mr-3" />
              <div>
                <p className="text-yellow-800 font-medium">Session Expiring Soon</p>
                <p className="text-yellow-700 text-sm">Your session will expire soon. Please save your work and refresh the page to continue.</p>
              </div>
              <button
                onClick={() => window.location.reload()}
                className="ml-auto bg-yellow-600 text-white px-3 py-1 rounded text-sm hover:bg-yellow-700"
              >
                Refresh Now
              </button>
            </div>
          </div>
        )}

        {/* Loading Indicator */}
        {isDataLoading && (
          <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600 mr-3"></div>
              <p className="text-blue-800">Loading dashboard data...</p>
            </div>
          </div>
        )}

        {/* Data Summary for Debug */}
        {!isDataLoading && (
          <div className="mb-6 bg-gray-100 border border-gray-200 rounded-lg p-4 text-sm text-gray-600">
            <div className="flex justify-between items-center">
              <p>📊 Data Status: {orders.length} orders, {bookings.length} bookings, {branches.length} branches available</p>
              <button
                onClick={() => window.location.reload()}
                className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 transition-colors"
              >
                🔄 Force Refresh
              </button>
            </div>
          </div>
        )}

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
      {/* Removed legacy placeholder modal to avoid conflicts with live scanner UI */}
    </div>
  );
};

export default ManagerDashboard;