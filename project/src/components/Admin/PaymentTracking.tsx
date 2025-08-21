import React, { useState } from 'react';
import { useData } from '../../contexts/DataContext';
import { 
  CreditCard, 
  DollarSign, 
  Calendar,
  User,
  MapPin,
  Filter,
  Download,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle
} from 'lucide-react';

const PaymentTracking: React.FC = () => {
  const { orders, bookings, branches, events, products } = useData();
  const [filter, setFilter] = useState('all');
  const [dateRange, setDateRange] = useState('30');
  const [selectedBranch, setSelectedBranch] = useState('all');

  // Combine orders and bookings for payment tracking
  const allPayments = [
    ...orders.map(order => ({
      id: order.id,
      type: 'order' as const,
      customerId: order.customerId,
      branchId: order.branchId,
      amount: order.totalAmount,
      paymentStatus: order.paymentStatus,
      paymentIntentId: order.paymentIntentId,
      createdAt: order.createdAt,
      items: order.products.map(p => p.name).join(', '),
      itemCount: order.products.length
    })),
    ...bookings.map(booking => ({
      id: booking.id,
      type: 'booking' as const,
      customerId: booking.customerId,
      branchId: booking.branchId,
      amount: booking.totalAmount,
      paymentStatus: booking.paymentStatus,
      paymentIntentId: booking.paymentIntentId,
      createdAt: booking.createdAt,
      items: events.find(e => e.id === booking.eventId)?.title || 'Event',
      itemCount: booking.seats
    }))
  ];

  // Filter payments
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(endDate.getDate() - parseInt(dateRange));

  const filteredPayments = allPayments.filter(payment => {
    const paymentDate = new Date(payment.createdAt);
    const dateInRange = paymentDate >= startDate && paymentDate <= endDate;
    const branchMatch = selectedBranch === 'all' || payment.branchId === selectedBranch;
    const statusMatch = filter === 'all' || payment.paymentStatus === filter;
    
    return dateInRange && branchMatch && statusMatch;
  }).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  // Calculate metrics
  const totalPayments = filteredPayments.length;
  const completedPayments = filteredPayments.filter(p => p.paymentStatus === 'completed').length;
  const pendingPayments = filteredPayments.filter(p => p.paymentStatus === 'pending').length;
  const failedPayments = filteredPayments.filter(p => p.paymentStatus === 'failed').length;
  const totalRevenue = filteredPayments
    .filter(p => p.paymentStatus === 'completed')
    .reduce((sum, p) => sum + p.amount, 0);

  const getBranchName = (branchId: string) => {
    const branch = branches.find(b => b.id === branchId);
    return branch ? branch.name : 'Unknown Branch';
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'failed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPaymentStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'pending': return <Clock className="h-4 w-4 text-yellow-600" />;
      case 'failed': return <XCircle className="h-4 w-4 text-red-600" />;
      default: return <AlertTriangle className="h-4 w-4 text-gray-600" />;
    }
  };

  const downloadReport = () => {
    const reportData = {
      period: `${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()}`,
      branch: selectedBranch === 'all' ? 'All Branches' : branches.find(b => b.id === selectedBranch)?.name,
      filter: filter === 'all' ? 'All Payments' : filter,
      summary: {
        totalPayments,
        completedPayments,
        pendingPayments,
        failedPayments,
        totalRevenue,
        successRate: totalPayments > 0 ? ((completedPayments / totalPayments) * 100).toFixed(2) : 0
      },
      payments: filteredPayments.map(payment => ({
        id: payment.id,
        type: payment.type,
        amount: payment.amount,
        status: payment.paymentStatus,
        paymentId: payment.paymentIntentId,
        branch: getBranchName(payment.branchId),
        items: payment.items,
        date: payment.createdAt
      }))
    };

    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `payment-report-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h3 className="text-2xl font-bold text-gray-800">Payment Tracking</h3>
          <p className="text-gray-600">Monitor all customer payments and transactions</p>
        </div>
        
        <div className="flex flex-wrap gap-4">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="7">Last 7 days</option>
            <option value="30">Last 30 days</option>
            <option value="90">Last 90 days</option>
            <option value="365">Last year</option>
          </select>
          
          <select
            value={selectedBranch}
            onChange={(e) => setSelectedBranch(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Branches</option>
            {branches.map(branch => (
              <option key={branch.id} value={branch.id}>{branch.name}</option>
            ))}
          </select>

          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Payments</option>
            <option value="completed">Completed</option>
            <option value="pending">Pending</option>
            <option value="failed">Failed</option>
          </select>
          
          <button
            onClick={downloadReport}
            className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            <Download className="h-4 w-4" />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* Payment Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Payments</p>
              <p className="text-2xl font-bold text-gray-900">{totalPayments}</p>
            </div>
            <CreditCard className="h-8 w-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Completed</p>
              <p className="text-2xl font-bold text-green-600">{completedPayments}</p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-yellow-600">{pendingPayments}</p>
            </div>
            <Clock className="h-8 w-8 text-yellow-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Failed</p>
              <p className="text-2xl font-bold text-red-600">{failedPayments}</p>
            </div>
            <XCircle className="h-8 w-8 text-red-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-green-600">₹{totalRevenue.toLocaleString()}</p>
            </div>
            <DollarSign className="h-8 w-8 text-green-600" />
          </div>
        </div>
      </div>

      {/* Payment Success Rate */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h4 className="text-lg font-bold text-gray-800 mb-4">Payment Success Rate</h4>
        <div className="flex items-center space-x-4">
          <div className="flex-1 bg-gray-200 rounded-full h-4">
            <div 
              className="bg-green-500 h-4 rounded-full transition-all duration-300"
              style={{ width: `${totalPayments > 0 ? (completedPayments / totalPayments) * 100 : 0}%` }}
            ></div>
          </div>
          <span className="text-lg font-bold text-gray-900">
            {totalPayments > 0 ? ((completedPayments / totalPayments) * 100).toFixed(1) : 0}%
          </span>
        </div>
        <div className="flex justify-between text-sm text-gray-600 mt-2">
          <span>Success Rate</span>
          <span>{completedPayments} of {totalPayments} payments successful</span>
        </div>
      </div>

      {/* Payment List */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h4 className="text-lg font-bold text-gray-800">Payment Transactions</h4>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Transaction
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Items
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Branch
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Payment ID
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredPayments.map((payment) => (
                <tr key={`${payment.type}-${payment.id}`} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
                        payment.type === 'order' ? 'bg-blue-100' : 'bg-purple-100'
                      }`}>
                        {payment.type === 'order' ? (
                          <CreditCard className={`h-4 w-4 ${payment.type === 'order' ? 'text-blue-600' : 'text-purple-600'}`} />
                        ) : (
                          <Calendar className="h-4 w-4 text-purple-600" />
                        )}
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {payment.type === 'order' ? 'Product Order' : 'Event Booking'}
                        </div>
                        <div className="text-sm text-gray-500">#{payment.id.slice(-8)}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <User className="h-4 w-4 text-gray-400 mr-2" />
                      <span className="text-sm text-gray-900">#{payment.customerId.slice(-6)}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{payment.items}</div>
                    <div className="text-sm text-gray-500">
                      {payment.type === 'order' ? `${payment.itemCount} items` : `${payment.itemCount} seats`}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 text-gray-400 mr-2" />
                      <span className="text-sm text-gray-900">{getBranchName(payment.branchId)}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">₹{payment.amount.toLocaleString()}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {getPaymentStatusIcon(payment.paymentStatus)}
                      <span className={`ml-2 inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPaymentStatusColor(payment.paymentStatus)}`}>
                        {payment.paymentStatus}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(payment.createdAt).toLocaleDateString()}
                    <div className="text-xs text-gray-400">
                      {new Date(payment.createdAt).toLocaleTimeString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {payment.paymentIntentId ? (
                      <div className="text-xs font-mono text-gray-600 bg-gray-100 px-2 py-1 rounded">
                        {payment.paymentIntentId.slice(-12)}
                      </div>
                    ) : (
                      <span className="text-xs text-gray-400">No payment ID</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredPayments.length === 0 && (
          <div className="text-center py-12">
            <CreditCard className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 text-lg">No payments found for the selected criteria</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentTracking;