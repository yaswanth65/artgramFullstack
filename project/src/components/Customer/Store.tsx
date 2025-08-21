import React, { useState } from 'react';
import { useData } from '../../contexts/DataContext';
import { useAuth } from '../../contexts/AuthContext';
import { initiatePayment, createRazorpayOrder, RazorpayResponse } from '../../utils/razorpay';
import { ShoppingCart, Star, Filter, Search, Plus, Minus } from 'lucide-react';

const Store: React.FC = () => {
  const { products, branches, selectedBranch, createOrder } = useData();
  const { user } = useAuth();
  const [cart, setCart] = useState<{ [productId: string]: number }>({});
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showCheckout, setShowCheckout] = useState(false);
  const [processing, setProcessing] = useState(false);

  const availableProducts = products.filter(product => 
    product.isActive && 
    product.stock > 0 &&
    (selectedBranch ? product.branchId === selectedBranch : true) &&
    (filter === 'all' || product.category === filter) &&
    (searchTerm === '' || product.name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const categories = ['all', ...Array.from(new Set(products.map(p => p.category)))];

  const addToCart = (productId: string) => {
    const product = products.find(p => p.id === productId);
    if (product && (cart[productId] || 0) < product.stock) {
      setCart(prev => ({ ...prev, [productId]: (prev[productId] || 0) + 1 }));
    }
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => {
      const newCart = { ...prev };
      if (newCart[productId] > 1) {
        newCart[productId]--;
      } else {
        delete newCart[productId];
      }
      return newCart;
    });
  };

  const getTotalItems = () => Object.values(cart).reduce((sum, qty) => sum + qty, 0);
  const getTotalPrice = () => {
    return Object.entries(cart).reduce((sum, [productId, qty]) => {
      const product = products.find(p => p.id === productId);
      return sum + (product?.price || 0) * qty;
    }, 0);
  };

  const handleCheckout = async () => {
    if (!user || !selectedBranch) {
      alert('Please login and select a branch to checkout');
      return;
    }

    setProcessing(true);
    try {
      const totalAmount = getTotalPrice();
      const orderProducts = Object.entries(cart).map(([productId, quantity]) => {
        const product = products.find(p => p.id === productId)!;
        return {
          productId,
          quantity,
          price: product.price,
          name: product.name
        };
      });

      // Create Razorpay order
      const order = await createRazorpayOrder(totalAmount);
      
      // Initiate Razorpay payment
      await initiatePayment({
        amount: order.amount,
        currency: order.currency,
        name: 'Craft Factory',
        description: 'Purchase from Craft Factory Store',
        order_id: order.id,
        handler: async (response: RazorpayResponse) => {
          try {
            // Payment successful, create order
            await createOrder({
              customerId: user.id,
              branchId: selectedBranch,
              products: orderProducts,
              totalAmount,
              paymentStatus: 'completed',
              orderStatus: 'pending',
              paymentIntentId: response.razorpay_payment_id,
              shippingAddress: {
                street: '123 Main St',
                city: 'City',
                state: 'State',
                zipCode: '12345',
                country: 'India'
              }
            });
            
            setCart({});
            setShowCheckout(false);
            setProcessing(false);
            alert('Payment successful! Order placed successfully. Check your dashboard for tracking details.');
          } catch (error) {
            alert('Order failed after payment. Please contact support.');
            setProcessing(false);
          }
        },
        prefill: {
          name: user.name,
          email: user.email,
          contact: '9999999999' // You might want to add phone to user profile
        },
        theme: {
          color: '#ea580c' // Orange color matching your theme
        },
        modal: {
          ondismiss: () => {
            setProcessing(false);
          }
        }
      });

    } catch (error) {
      alert('Payment failed. Please try again.');
      setProcessing(false);
    } finally {
      // Processing state will be reset in payment handler or modal dismiss
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-800 mb-8 text-center">Craft Store</h1>
        
        {!selectedBranch && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <p className="text-yellow-800">Please select a branch from the header to view available products.</p>
          </div>
        )}

        {/* Filters and Search */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>
          
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
          >
            {categories.map(category => (
              <option key={category} value={category}>
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </option>
            ))}
          </select>
        </div>

        {/* Shopping Cart Summary */}
        {getTotalItems() > 0 && (
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-6">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-4">
                <ShoppingCart className="h-5 w-5 text-orange-600" />
                <span className="text-orange-800 font-semibold">
                  Cart: {getTotalItems()} items
                </span>
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-orange-800 font-bold text-lg">₹{getTotalPrice()}</span>
                <button
                  onClick={() => setShowCheckout(true)}
                  disabled={!user || !selectedBranch}
                  className="bg-orange-600 text-white px-6 py-2 rounded-md hover:bg-orange-700 disabled:opacity-50 transition-colors"
                >
                  Checkout
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {availableProducts.map(product => {
            const branch = branches.find(b => b.id === product.branchId);
            const cartQuantity = cart[product.id] || 0;
            
            return (
              <div key={product.id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                <div className="aspect-w-16 aspect-h-9">
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-full h-48 object-cover"
                  />
                </div>
                
                <div className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-bold text-gray-800">{product.name}</h3>
                    <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded-full text-xs">
                      {product.category}
                    </span>
                  </div>
                  
                  <p className="text-gray-600 mb-3">{product.description}</p>
                  
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-2xl font-bold text-orange-600">₹{product.price}</span>
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                      ))}
                    </div>
                  </div>

                  {/* Materials */}
                  <div className="mb-3">
                    <h4 className="font-semibold text-gray-800 mb-1">Includes:</h4>
                    <div className="flex flex-wrap gap-1">
                      {product.materials.slice(0, 3).map((material, index) => (
                        <span key={index} className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs">
                          {material}
                        </span>
                      ))}
                      {product.materials.length > 3 && (
                        <span className="text-gray-500 text-xs">+{product.materials.length - 3} more</span>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center mb-4">
                    <span className={`text-sm px-2 py-1 rounded ${
                      product.stock > 10 ? 'bg-green-100 text-green-800' :
                      product.stock > 0 ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      Stock: {product.stock}
                    </span>
                    <span className="text-sm text-gray-600">{branch?.name}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    {cartQuantity > 0 ? (
                      <div className="flex items-center space-x-3">
                        <button
                          onClick={() => removeFromCart(product.id)}
                          className="bg-gray-300 text-gray-700 p-2 rounded-md hover:bg-gray-400 transition-colors"
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                        <span className="font-semibold text-lg">{cartQuantity}</span>
                        <button
                          onClick={() => addToCart(product.id)}
                          disabled={cartQuantity >= product.stock}
                          className="bg-gray-300 text-gray-700 p-2 rounded-md hover:bg-gray-400 disabled:opacity-50 transition-colors"
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => addToCart(product.id)}
                        disabled={product.stock === 0 || !user}
                        className="flex items-center space-x-2 bg-orange-600 text-white px-4 py-2 rounded-md hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        <ShoppingCart className="h-4 w-4" />
                        <span>{!user ? 'Login to Buy' : 'Add to Cart'}</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {availableProducts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">No products found matching your criteria.</p>
          </div>
        )}

        {/* Checkout Modal */}
        {showCheckout && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-md w-full p-6 max-h-[90vh] overflow-y-auto">
              <h3 className="text-2xl font-bold mb-4">Checkout</h3>
              
              <div className="space-y-4">
                <div className="border-b pb-4">
                  <h4 className="font-semibold text-gray-800 mb-2">Order Summary</h4>
                  {Object.entries(cart).map(([productId, quantity]) => {
                    const product = products.find(p => p.id === productId);
                    return (
                      <div key={productId} className="flex justify-between items-center py-2">
                        <div>
                          <p className="font-medium">{product?.name}</p>
                          <p className="text-sm text-gray-600">Qty: {quantity}</p>
                        </div>
                        <span className="font-semibold">₹{(product?.price || 0) * quantity}</span>
                      </div>
                    );
                  })}
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-lg">Total Amount:</span>
                    <span className="text-2xl font-bold text-orange-600">₹{getTotalPrice()}</span>
                  </div>
                </div>
                
                <div className="text-sm text-gray-600">
                  <p>• Items will be shipped to your registered address</p>
                  <p>• You will receive tracking information via email</p>
                  <p>• Payment will be processed securely</p>
                </div>
                
                <div className="flex space-x-4">
                  <button
                    onClick={() => setShowCheckout(false)}
                    className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-md hover:bg-gray-400 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleCheckout}
                    disabled={processing}
                    className="flex-1 bg-orange-600 text-white py-2 rounded-md hover:bg-orange-700 disabled:opacity-50 transition-colors"
                  >
                    {processing ? 'Processing...' : 'Pay with Razorpay'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Store;