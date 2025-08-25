import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import { Calendar, ShoppingBag, Download, QrCode, Package, Eye, Truck } from 'lucide-react';

const CustomerDashboard: React.FC = () => {
  const { user } = useAuth();
  const { bookings, orders, events, branches } = useData();

  const [trackOrder, setTrackOrder] = React.useState<null | typeof orders[0]>(null);

  const userBookings = bookings.filter(b => b.customerId === user?.id);
  const userOrders = orders.filter(o => o.customerId === user?.id);

  // Responsive grid classes
  const gridClasses = "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-8";
  const cardClasses = "bg-white rounded-lg shadow-lg p-4 md:p-6";
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const downloadTicket = (booking: any) => {
    const event = events.find(e => e.id === booking.eventId);
    const branch = branches.find(b => b.id === booking.branchId);
    
    const ticketData = {
      ticketId: booking.id,
      eventTitle: event?.title,
      eventDescription: event?.description,
      date: event?.date,
      time: event?.time,
      duration: event?.duration,
      venue: branch?.name,
      address: branch?.address,
      qrCode: booking.qrCode,
      seats: booking.seats,
      totalAmount: booking.totalAmount,
      customerName: user?.name,
  customerId: user?.id,
  customerPhone: user?.phone || '',
  customerAddress: user?.address || null,
      bookingDate: booking.createdAt,
      status: booking.isVerified ? 'Verified' : 'Pending Verification'
    };
    
    const blob = new Blob([JSON.stringify(ticketData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ticket-${booking.id}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const downloadInvoice = (order: any) => {
    const branch = branches.find(b => b.id === order.branchId);
    
    const invoiceData = {
      invoiceId: order.id,
      orderDate: order.createdAt,
      customerName: user?.name,
  customerId: user?.id,
  customerPhone: user?.phone || '',
  customerAddress: user?.address || null,
      customerEmail: user?.email,
      branch: branch?.name,
      branchAddress: branch?.address,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  products: order.products.map((p: any) => ({
        name: p.name,
        quantity: p.quantity,
        price: p.price,
        total: p.quantity * p.price
      })),
      subtotal: order.totalAmount,
      tax: 0,
      totalAmount: order.totalAmount,
      paymentStatus: order.paymentStatus,
      orderStatus: order.orderStatus,
      trackingNumber: order.trackingNumber,
      shippingAddress: order.shippingAddress
    };
    
    const blob = new Blob([JSON.stringify(invoiceData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `invoice-${order.id}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const getOrderStatusColor = (status: string) => {
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

  const getOrderStatusLabel = (status: string) => {
    const statusLabels: { [key: string]: string } = {
      'pending': 'Pending',
      'payment_confirmed': 'Payment Confirmed',
      'processing': 'Processing',
      'packed': 'Packed',
      'shipped': 'Shipped',
      'in_transit': 'In Transit',
      'out_for_delivery': 'Out for Delivery',
      'delivered': 'Delivered',
      'cancelled': 'Cancelled'
    };
    return statusLabels[status] || status;
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'failed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="container mx-auto px-4 py-6 md:py-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6 md:mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl md:text-4xl font-bold text-gray-800 mb-2">Welcome back, {user?.name}!</h1>
            <p className="text-sm md:text-base text-gray-600">Manage your bookings, orders, and account settings</p>
          </div>
          <div>
            <Link to="/profile" className="inline-flex items-center gap-2 bg-white border border-gray-200 px-3 py-2 rounded-md shadow-sm text-sm">Edit Profile</Link>
          </div>
        </div>

        {/* Customer Info Card */}
        <div className="mb-6">
          <div className="bg-white rounded-lg shadow p-4 md:p-6 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">Your Information</h3>
              <div className="mt-2 text-sm text-gray-700">
                <div><span className="font-medium">Name:</span> {user?.name}</div>
                <div><span className="font-medium">Customer ID:</span> {user?.id}</div>
                <div><span className="font-medium">Email:</span> {user?.email}</div>
                <div><span className="font-medium">Phone:</span> {user?.phone || '—'}</div>
                <div><span className="font-medium">Address:</span> {user?.address ? `${user.address.street}, ${user.address.city}, ${user.address.state} - ${user.address.zipCode}` : '—'}</div>
              </div>
            </div>
            <div className="text-sm text-gray-500">This information is included in your bookings and orders for tracking purposes.</div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className={gridClasses}>
          <div className={cardClasses}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs md:text-sm text-gray-600">Total Bookings</p>
                <p className="text-xl md:text-2xl font-bold text-blue-600">{userBookings.length}</p>
              </div>
              <Calendar className="h-6 w-6 md:h-8 md:w-8 text-blue-600" />
            </div>
          </div>
          
          <div className={cardClasses}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs md:text-sm text-gray-600">Total Orders</p>
                <p className="text-xl md:text-2xl font-bold text-purple-600">{userOrders.length}</p>
              </div>
              <ShoppingBag className="h-6 w-6 md:h-8 md:w-8 text-purple-600" />
            </div>
          </div>
          
          <div className={cardClasses}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs md:text-sm text-gray-600">Total Spent</p>
                <p className="text-xl md:text-2xl font-bold text-green-600">
                  ₹{[...userBookings, ...userOrders].reduce((sum, item) => sum + item.totalAmount, 0).toLocaleString()}
                </p>
              </div>
              <Package className="h-6 w-6 md:h-8 md:w-8 text-green-600" />
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
          {/* Event Bookings */}
          <div className="bg-white rounded-lg shadow-lg p-4 md:p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <Calendar className="h-6 w-6 text-orange-600 mr-2" />
                <h2 className="text-xl md:text-2xl font-bold text-gray-800">My Bookings</h2>
              </div>
              <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                {userBookings.length} total
              </span>
            </div>
            
            {userBookings.length === 0 ? (
              <div className="text-center py-8">
                <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-4">No bookings yet</p>
                <Link
                  to="/activities"
                  className="inline-flex items-center space-x-2 bg-orange-600 text-white px-4 py-2 rounded-md hover:bg-orange-700 transition-colors"
                >
                  <Calendar className="h-4 w-4" />
                  <span>Book a Session</span>
                </Link>
              </div>
            ) : (
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {userBookings.map(booking => {
                  const event = events.find(e => e.id === booking.eventId);
                  const branch = branches.find(b => b.id === booking.branchId);
                  return (
                    <div key={booking.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="font-semibold text-gray-800">{event?.title}</h3>
                          <p className="text-sm text-gray-600">{branch?.name}</p>
                        </div>
                        <div className="flex space-x-2">
                          <span className={`px-2 py-1 rounded text-xs font-medium ${getPaymentStatusColor(booking.paymentStatus)}`}>
                            {booking.paymentStatus}
                          </span>
                          <span className={`px-2 py-1 rounded text-xs font-medium ${
                            booking.isVerified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {booking.isVerified ? 'Verified' : 'Pending'}
                          </span>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 mb-3">
                        <div>
                          <span className="font-medium">Date:</span> {event?.date}
                        </div>
                        <div>
                          <span className="font-medium">Time:</span> {event?.time}
                        </div>
                        <div>
                          <span className="font-medium">Seats:</span> {booking.seats}
                        </div>
                        <div>
                          <span className="font-medium">Amount:</span> ₹{booking.totalAmount}
                        </div>
                        {booking.paymentIntentId && (
                          <div className="col-span-2">
                            <span className="font-medium">Payment ID:</span> 
                            <span className="font-mono text-xs ml-1">{booking.paymentIntentId}</span>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <QrCode className="h-4 w-4" />
                          <span className="font-mono">{booking.qrCode}</span>
                        </div>
                        <button
                          onClick={() => downloadTicket(booking)}
                          className="flex items-center space-x-1 px-3 py-1 bg-orange-600 text-white rounded text-sm hover:bg-orange-700 transition-colors"
                        >
                          <Download className="h-4 w-4" />
                          <span>Ticket</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
          
          {/* Product Orders */}
          <div className="bg-white rounded-lg shadow-lg p-4 md:p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <ShoppingBag className="h-6 w-6 text-orange-600 mr-2" />
                <h2 className="text-2xl font-bold text-gray-800">My Orders</h2>
              </div>
              <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium">
                {userOrders.length} total
              </span>
            </div>
            
            {userOrders.length === 0 ? (
              <div className="text-center py-8">
                <ShoppingBag className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-4">No orders yet</p>
                <Link
                  to="/store" 
                  className="inline-flex items-center space-x-2 bg-orange-600 text-white px-4 py-2 rounded-md hover:bg-orange-700 transition-colors"
                >
                  <ShoppingBag className="h-4 w-4" />
                  <span>Shop Now</span>
                </Link>
              </div>
            ) : (
              <div className="space-y-4 max-h-[500px] overflow-y-auto">
                {userOrders.map(order => {
                  const branch = branches.find(b => b.id === order.branchId);
                  return (
                    <div key={order.id} className="border border-gray-200 rounded-lg p-3 md:p-4 hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="font-semibold text-gray-800 text-sm md:text-base">Order #{order.id.slice(-6)}</h3>
                          <p className="text-xs md:text-sm text-gray-600">{branch?.name}</p>
                        </div>
                        <div className="flex space-x-2">
                          <span className={`px-2 py-1 rounded text-xs font-medium ${getPaymentStatusColor(order.paymentStatus)}`}>
                            {order.paymentStatus}
                          </span>
                          <span className={`px-2 py-1 rounded text-xs font-medium ${getOrderStatusColor(order.orderStatus)}`}>
                            {getOrderStatusLabel(order.orderStatus)}
                          </span>
                        </div>
                      </div>
                      
                      <div className="mb-3">
                        <p className="text-xs md:text-sm text-gray-600 mb-1">
                          <span className="font-medium">Items:</span> {order.products.length} products
                        </p>
                        <div className="text-xs text-gray-500">
                          {order.products.slice(0, 2).map(p => p.name).join(', ')}
                          {order.products.length > 2 && ` +${order.products.length - 2} more`}
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-4 text-xs md:text-sm text-gray-600 mb-3">
                        <div>
                          <span className="font-medium">Amount:</span> ₹{order.totalAmount}
                        </div>
                        <div>
                          <span className="font-medium">Date:</span> {new Date(order.createdAt).toLocaleDateString()}
                        </div>
                        {order.paymentIntentId && (
                          <div className="md:col-span-2">
                            <span className="font-medium">Payment ID:</span> 
                            <span className="font-mono text-xs ml-1">{order.paymentIntentId}</span>
                          </div>
                        )}
                        {order.trackingNumber && (
                          <div className="md:col-span-2">
                            <span className="font-medium">Tracking:</span> {order.trackingNumber}
                          </div>
                        )}
                      </div>
                      
                      {/* Enhanced Order Status Timeline */}
                      {order.orderStatus !== 'pending' && (
                        <div className="mb-4 bg-gray-50 p-3 rounded-lg">
                          <h4 className="font-medium text-gray-800 mb-3 text-sm">Order Progress</h4>
                          <div className="space-y-2">
                            {/* Status Progress Indicator */}
                            <div className="flex items-center space-x-2 text-xs">
                              {['payment_confirmed', 'processing', 'packed', 'shipped', 'in_transit', 'out_for_delivery', 'delivered'].map((status, index) => {
                                const statusLabels = {
                                  'payment_confirmed': 'Payment Confirmed',
                                  'processing': 'Processing',
                                  'packed': 'Packed',
                                  'shipped': 'Shipped',
                                  'in_transit': 'In Transit',
                                  'out_for_delivery': 'Out for Delivery',
                                  'delivered': 'Delivered'
                                };
                                
                                const statusOrder = ['pending', 'payment_confirmed', 'processing', 'packed', 'shipped', 'in_transit', 'out_for_delivery', 'delivered'];
                                const currentIndex = statusOrder.indexOf(order.orderStatus);
                                const isCompleted = index <= currentIndex - 1; // -1 because we skip 'pending'
                                const isCurrent = status === order.orderStatus;
                                
                                return (
                                  <div key={status} className="flex items-center">
                                    <div className={`w-3 h-3 rounded-full flex-shrink-0 ${
                                      isCompleted || isCurrent ? 'bg-green-500' : 'bg-gray-300'
                                    }`}></div>
                                    <span className={`ml-2 ${
                                      isCompleted || isCurrent ? 'text-green-700 font-medium' : 'text-gray-500'
                                    }`}>
                                      {statusLabels[status as keyof typeof statusLabels]}
                                    </span>
                                    {index < 6 && <div className={`w-4 h-0.5 mx-1 ${
                                      isCompleted ? 'bg-green-500' : 'bg-gray-300'
                                    }`}></div>}
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Product Tracking Timeline */}
                      {order.trackingUpdates && order.trackingUpdates.length > 0 && (
                        <div className="mb-4 bg-gray-50 p-3 rounded-lg">
                          <h4 className="font-medium text-gray-800 mb-2 text-sm">Tracking Updates</h4>
                          <div className="space-y-2 max-h-32 overflow-y-auto">
                            {order.trackingUpdates.map((update, index) => (
                              <div key={update.id || index} className="flex justify-between items-start text-xs">
                                <div className="flex-1">
                                  <div className="flex items-center space-x-2">
                                    <div className={`w-2 h-2 rounded-full ${
                                      update.status === 'delivered' || update.status === 'Delivered' ? 'bg-green-500' :
                                      update.status === 'shipped' || update.status === 'Shipped' || update.status === 'out_for_delivery' || update.status === 'Out for Delivery' ? 'bg-blue-500' :
                                      update.status === 'processing' || update.status === 'Processing' || update.status === 'packed' || update.status === 'Packed' ? 'bg-yellow-500' :
                                      'bg-gray-500'
                                    }`}></div>
                                    <span className="font-medium">{getOrderStatusLabel(update.status) || update.status}</span>
                                  </div>
                                  <p className="text-gray-600 ml-4">{update.description}</p>
                                  <p className="text-gray-500 ml-4">{update.location}</p>
                                </div>
                                <span className="text-gray-500 ml-2">
                                  {new Date(update.createdAt || update.timestamp).toLocaleDateString()}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      <div className="flex flex-wrap gap-2">
                        <button
                          onClick={() => downloadInvoice(order)}
                          className="flex items-center space-x-1 px-2 md:px-3 py-1 bg-orange-600 text-white rounded text-xs md:text-sm hover:bg-orange-700 transition-colors"
                        >
                          <Download className="h-4 w-4" />
                          <span>Invoice</span>
                        </button>
                        {order.trackingNumber && (
                          <button onClick={() => setTrackOrder(order)} className="flex items-center space-x-1 px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition-colors">
                            <Truck className="h-4 w-4" />
                            <span>Track</span>
                          </button>
                        )}
                        <button className="flex items-center space-x-1 px-2 md:px-3 py-1 bg-gray-600 text-white rounded text-xs md:text-sm hover:bg-gray-700 transition-colors">
                          <Eye className="h-4 w-4" />
                          <span>Details</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
      {trackOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-lg">
            <h3 className="text-lg font-bold text-gray-900 mb-3">Order Tracking - #{trackOrder.id.slice(-8)}</h3>
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {(trackOrder.trackingUpdates || []).map((u, index) => (
                <div key={u.id || index} className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center space-x-2">
                      <div className={`w-2 h-2 rounded-full ${
                        u.status === 'delivered' || u.status === 'Delivered' ? 'bg-green-500' : 
                        u.status === 'shipped' || u.status === 'Shipped' || u.status === 'out_for_delivery' || u.status === 'Out for Delivery' ? 'bg-blue-500' : 
                        u.status === 'processing' || u.status === 'Processing' || u.status === 'packed' || u.status === 'Packed' ? 'bg-yellow-500' :
                        'bg-gray-500'
                      }`}></div>
                      <span className="font-medium">{getOrderStatusLabel(u.status) || u.status}</span>
                    </div>
                    <p className="text-sm text-gray-600 ml-4">{u.description}</p>
                    <p className="text-xs text-gray-500 ml-4">{u.location}</p>
                  </div>
                  <div className="text-xs text-gray-500">{new Date(u.createdAt || u.timestamp).toLocaleString()}</div>
                </div>
              ))}
              {(!trackOrder.trackingUpdates || trackOrder.trackingUpdates.length === 0) && (
                <div className="text-gray-600">No tracking updates yet.</div>
              )}
            </div>
            <div className="flex justify-end mt-4">
              <button onClick={() => setTrackOrder(null)} className="px-4 py-2 bg-gray-200 rounded-md">Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerDashboard;