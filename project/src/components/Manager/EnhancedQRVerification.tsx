import React, { useState, useEffect, useRef } from 'react';
import { useData } from '../../contexts/DataContext';
import { useAuth } from '../../contexts/AuthContext';
import { 
  QrCode,
  Camera,
  Search,
  Calendar,
  CheckCircle,
  AlertCircle,
  Download,
  Filter,
  RefreshCw,
  Clock,
  User,
  MapPin
} from 'lucide-react';

const EnhancedQRVerification: React.FC = () => {
  const { user } = useAuth();
  const { bookings: contextBookings, branches } = useData();

  const [bookings, setBookings] = useState(contextBookings);
  const [filteredBookings, setFilteredBookings] = useState(contextBookings);
  const [qrCode, setQrCode] = useState('');
  const [qrScannerOpen, setQrScannerOpen] = useState(false);
  const [qrResult, setQrResult] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('date_desc');
  const [selectedDate, setSelectedDate] = useState('');
  const [alreadyVerifiedMessage, setAlreadyVerifiedMessage] = useState('');

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [scannerActive, setScannerActive] = useState(false);
  const scannerActiveRef = useRef(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Get API base URL
  const apiBase = (import.meta as any).env?.VITE_API_URL || '/api';

  // Determine manager branchId
  const effectiveBranchId = user?.branchId || branches.find(b => b.managerId === user?.id)?.id;

  // Filter bookings for manager's branch
  const branchBookings = effectiveBranchId ? 
    bookings.filter(booking => booking.branchId === effectiveBranchId) : 
    bookings;

  // Update bookings when context changes
  useEffect(() => {
    setBookings(contextBookings);
  }, [contextBookings]);

  // Filter and search bookings
  useEffect(() => {
    let filtered = [...branchBookings];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(booking => 
        booking.qrCode?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.customerEmail?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.activity?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter === 'verified') {
      filtered = filtered.filter(booking => booking.isVerified);
    } else if (statusFilter === 'unverified') {
      filtered = filtered.filter(booking => !booking.isVerified);
    }

    // Date filter
    if (dateFilter !== 'all') {
      if (dateFilter === 'custom' && selectedDate) {
        filtered = filtered.filter(booking => {
          if (booking.verifiedAt) {
            return new Date(booking.verifiedAt).toISOString().split('T')[0] === selectedDate;
          }
          return false;
        });
      } else {
        const now = new Date();
        const filterDate = new Date();
        
        switch (dateFilter) {
          case 'today':
            filterDate.setHours(0, 0, 0, 0);
            filtered = filtered.filter(booking => {
              if (booking.verifiedAt) {
                return new Date(booking.verifiedAt) >= filterDate;
              }
              return false;
            });
            break;
          case 'week':
            filterDate.setDate(now.getDate() - 7);
            filtered = filtered.filter(booking => {
              if (booking.verifiedAt) {
                return new Date(booking.verifiedAt) >= filterDate;
              }
              return false;
            });
            break;
          case 'month':
            filterDate.setMonth(now.getMonth() - 1);
            filtered = filtered.filter(booking => {
              if (booking.verifiedAt) {
                return new Date(booking.verifiedAt) >= filterDate;
              }
              return false;
            });
            break;
        }
      }
    }

    // Sort bookings
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'date_desc':
          return new Date(b.verifiedAt || b.createdAt).getTime() - new Date(a.verifiedAt || a.createdAt).getTime();
        case 'date_asc':
          return new Date(a.verifiedAt || a.createdAt).getTime() - new Date(b.verifiedAt || b.createdAt).getTime();
        case 'customer':
          return (a.customerName || '').localeCompare(b.customerName || '');
        case 'activity':
          return (a.activity || '').localeCompare(b.activity || '');
        case 'status':
          return (a.isVerified ? 1 : 0) - (b.isVerified ? 1 : 0);
        default:
          return 0;
      }
    });

    setFilteredBookings(filtered);
  }, [branchBookings, searchTerm, dateFilter, statusFilter, sortBy, selectedDate]);

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
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

      // Check if this QR code was already verified
      const matchingBooking = bookings.find(booking => booking.qrCode === codeToVerify);

      if (matchingBooking && matchingBooking.isVerified) {
        setAlreadyVerifiedMessage(`This QR code was already verified on ${new Date(matchingBooking.verifiedAt).toLocaleString()} by ${matchingBooking.verifiedBy || 'Manager'}`);
        setQrResult({
          alreadyVerified: true,
          booking: {
            customerName: matchingBooking.customerName,
            activity: matchingBooking.activity,
            date: matchingBooking.date,
            time: matchingBooking.time,
            seats: matchingBooking.seats,
            status: matchingBooking.status,
            verifiedAt: matchingBooking.verifiedAt
          }
        });
        showToast('QR Code already verified!', 'success');
        return;
      }

      // Try backend verification
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
        setAlreadyVerifiedMessage('');
        showToast('QR Code verified successfully!', 'success');
        console.log('✅ QR verification successful:', result);

        // Update local bookings state
        setBookings(prevBookings => {
          const updated = prevBookings.map(b =>
            b.qrCode === codeToVerify
              ? { ...b, isVerified: true, verifiedAt: new Date().toISOString(), verifiedBy: user?.name || 'Manager' }
              : b
          );
          return updated;
        });

      } else if (response.status === 409) {
        // Handle already verified case
        const result = await response.json();
        if (result.alreadyVerified) {
          setQrResult(result);
          setAlreadyVerifiedMessage(`This QR code was already verified on ${new Date(result.booking.verifiedAt).toLocaleString()}`);
          showToast('QR Code already verified!', 'success');
          console.log('⚠️ QR Code already verified:', result);
        } else {
          const error = await response.json();
          console.error('❌ QR verification failed:', error);
          showToast(error.message || 'Invalid QR Code.', 'error');
          setQrResult(null);
        }
      } else {
        const error = await response.json();
        console.error('❌ QR verification failed:', error);
        showToast(error.message || 'Invalid QR Code.', 'error');
        setQrResult(null);
      }
    } catch (error) {
      console.error('Error verifying QR code:', error);
      showToast('Error verifying QR code. Please try again.', 'error');
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

  // Enhanced QR scanner with jsQR implementation
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
            facingMode: 'environment',
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
                      
                      let qrCodeToVerify = code.data.trim();

                      try {
                        const parsed = JSON.parse(code.data);
                        if (parsed.type === 'booking' && parsed.qrCode) {
                          qrCodeToVerify = parsed.qrCode;
                        }
                      } catch {
                        // If not JSON, use the code directly
                      }

                      verifyQRCode(qrCodeToVerify);
                      setQrScannerOpen(false);
                      return;
                    }
                  }
                } catch (e) {
                  console.warn('scanQRCode: read image error', e);
                }
              }
            }

            if (scannerActiveRef.current) {
              animationFrame = requestAnimationFrame(scanQRCode);
            }
          };

          animationFrame = requestAnimationFrame(scanQRCode);
        }
      } catch (error) {
        console.error('❌ Camera initialization failed:', error);
        showToast('Failed to access camera. Please check permissions.', 'error');
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

  const exportVerifications = () => {
    const verifiedBookings = filteredBookings.filter(b => b.isVerified);
    const csvContent = [
      ['QR Code', 'Customer', 'Activity', 'Date', 'Time', 'Seats', 'Verified At', 'Verified By'].join(','),
      ...verifiedBookings.map(booking => [
        booking.qrCode || '',
        booking.customerName || '',
        booking.activity || '',
        booking.date || '',
        booking.time || '',
        booking.seats || '',
        booking.verifiedAt ? new Date(booking.verifiedAt).toLocaleString() : '',
        booking.verifiedBy || ''
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `qr-verifications-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const getVerifiedBookings = () => filteredBookings.filter(booking => booking.isVerified);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h3 className="text-2xl font-bold text-gray-800">QR Code Verification</h3>
          <p className="text-gray-600">Scan and verify booking QR codes</p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => window.location.reload()}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <RefreshCw className="h-4 w-4" />
            <span>Refresh</span>
          </button>
          <button
            onClick={exportVerifications}
            className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <Download className="h-4 w-4" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

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
                  
                  <canvas ref={canvasRef} style={{ display: 'none' }} />
                  
                  {scannerActive && (
                    <div className="absolute inset-0 pointer-events-none">
                      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                        <div className="w-32 h-32 border-2 border-green-400 rounded-lg animate-pulse relative">
                          <div className="absolute -top-1 -left-1 w-6 h-6 border-l-4 border-t-4 border-green-400"></div>
                          <div className="absolute -top-1 -right-1 w-6 h-6 border-r-4 border-t-4 border-green-400"></div>
                          <div className="absolute -bottom-1 -left-1 w-6 h-6 border-l-4 border-b-4 border-green-400"></div>
                          <div className="absolute -bottom-1 -right-1 w-6 h-6 border-r-4 border-b-4 border-green-400"></div>
                        </div>
                      </div>
                    </div>
                  )}
                  
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
              </div>
            )}
          </div>
        </div>

        {/* QR Verification Result */}
        {qrResult && (
          <div className={`mt-6 p-4 border rounded-lg ${
            qrResult.alreadyVerified ? 'bg-yellow-50 border-yellow-200' : 'bg-green-50 border-green-200'
          }`}>
            <div className="flex items-start">
              <CheckCircle className={`h-5 w-5 mt-0.5 mr-3 flex-shrink-0 ${
                qrResult.alreadyVerified ? 'text-yellow-600' : 'text-green-600'
              }`} />
              <div>
                <h4 className={`font-medium ${
                  qrResult.alreadyVerified ? 'text-yellow-800' : 'text-green-800'
                }`}>
                  {qrResult.alreadyVerified ? 'Booking Already Verified' : 'Booking Verified Successfully!'}
                </h4>
                <div className={`mt-2 text-sm ${
                  qrResult.alreadyVerified ? 'text-yellow-700' : 'text-green-700'
                }`}>
                  <p><strong>Customer:</strong> {qrResult.booking.customerName}</p>
                  <p><strong>Activity:</strong> {qrResult.booking.activity}</p>
                  <p><strong>Date:</strong> {qrResult.booking.date}</p>
                  <p><strong>Time:</strong> {qrResult.booking.time}</p>
                  <p><strong>Seats:</strong> {qrResult.booking.seats}</p>
                  <p><strong>Verified at:</strong> {new Date(qrResult.booking.verifiedAt).toLocaleString()}</p>
                  {alreadyVerifiedMessage && (
                    <p className="text-yellow-600 font-medium mt-1">{alreadyVerifiedMessage}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h4 className="text-lg font-semibold text-gray-800 mb-4">Verification History</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-4">
          {/* Search */}
          <div className="lg:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by QR, customer, activity..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Status Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Bookings</option>
              <option value="verified">Verified Only</option>
              <option value="unverified">Unverified Only</option>
            </select>
          </div>

          {/* Date Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Date Range</label>
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Time</option>
              <option value="today">Today</option>
              <option value="week">Last 7 Days</option>
              <option value="month">Last 30 Days</option>
              <option value="custom">Custom Date</option>
            </select>
          </div>

          {/* Sort */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="date_desc">Latest First</option>
              <option value="date_asc">Oldest First</option>
              <option value="customer">Customer Name</option>
              <option value="activity">Activity</option>
              <option value="status">Verification Status</option>
            </select>
          </div>
        </div>

        {/* Custom Date Picker */}
        {dateFilter === 'custom' && (
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Select Date</label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        )}

        {/* Results Summary */}
        <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
          <span>
            Showing {filteredBookings.length} of {branchBookings.length} bookings
            ({getVerifiedBookings().length} verified)
          </span>
        </div>
      </div>

      {/* Verifications Table */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  QR Code
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Activity
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Session
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Verified
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredBookings.map((booking) => (
                <tr key={booking.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <QrCode className="h-4 w-4 text-gray-400 mr-2" />
                      <span className="text-sm font-mono text-gray-900">{booking.qrCode}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {booking.customerName || `Customer #${booking.customerId?.slice(0, 6)}`}
                      </div>
                      <div className="text-sm text-gray-500">{booking.customerEmail}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                      {booking.activity}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div>
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 text-gray-400 mr-1" />
                        {booking.date}
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 text-gray-400 mr-1" />
                        {booking.time}
                      </div>
                      <div className="text-xs text-gray-500">
                        {booking.seats} seat{booking.seats !== 1 ? 's' : ''}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {booking.isVerified ? (
                      <span className="inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Verified
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">
                        <AlertCircle className="h-3 w-3 mr-1" />
                        Pending
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {booking.isVerified ? (
                      <div>
                        <div className="flex items-center">
                          <User className="h-4 w-4 mr-1" />
                          {booking.verifiedBy || 'Manager'}
                        </div>
                        <div className="text-xs">
                          {booking.verifiedAt ? new Date(booking.verifiedAt).toLocaleString() : ''}
                        </div>
                      </div>
                    ) : (
                      <span className="text-gray-400">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredBookings.length === 0 && (
          <div className="text-center py-12">
            <QrCode className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No bookings found matching your criteria</p>
          </div>
        )}
      </div>

      {/* Toast Notifications */}
      {toast && (
        <div className={`fixed bottom-6 right-6 px-4 py-3 rounded-lg shadow-lg z-50 ${
          toast.type === 'success' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
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
    </div>
  );
};

export default EnhancedQRVerification;
