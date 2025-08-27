import React, { useState, useEffect } from 'react';
import { useData } from '../../contexts/DataContext';
import { useAuth } from '../../contexts/AuthContext';
import { initiatePayment, createRazorpayOrder, RazorpayResponse } from '../../utils/razorpay';
import { ShoppingCart, Plus, Minus } from 'lucide-react';

const Store: React.FC = () => {
  const { products, createOrder } = useData();
  const { user } = useAuth();
  const [cart, setCart] = useState<{ [productId: string]: number }>({});
  const [filter, setFilter] = useState('all');
  const [searchTerm] = useState('');
  const [showCheckout, setShowCheckout] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [priceRange, setPriceRange] = useState(3000);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const availableProducts = products.filter(product => 
    product.isActive && 
    product.stock > 0 &&
    (filter === 'all' || product.category === filter) &&
    (searchTerm === '' || product.name.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (product.price <= priceRange)
  );

  const categories = [
    { id: 'all', name: 'All Products', icon: '🎨', count: products.length },
    ...Array.from(new Set(products.map(p => p.category))).map(cat => ({
      id: cat,
      name: cat.charAt(0).toUpperCase() + cat.slice(1) + ' Kits',
      icon: cat === 'slime' ? '🌈' : cat === 'art' ? '🎨' : cat === 'tufting' ? '🧶' : '🛍️',
      count: products.filter(p => p.category === cat).length
    }))
  ];

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
    if (!user) {
      alert('Please login to checkout');
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

      // Create Razorpay order (server-side recommended)
      const order = await createRazorpayOrder(totalAmount);
      // Initiate Razorpay payment
      await initiatePayment({
        amount: order.amount / 100,
        currency: order.currency,
        name: 'Artgram',
        description: 'Purchase from Artgram Store',
        order_id: order.id,
        key: 'rzp_test_default_key', // Default key for global orders
        handler: async (response: RazorpayResponse) => {
          try {
            // Payment successful, create order
            await createOrder({
              customerId: user.id,
              customerName: user.name,
              customerEmail: user.email,
              customerPhone: user?.phone || '',
              branchId: 'online', // Online orders not tied to specific branch
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
          } catch {
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

      } catch {
      alert('Payment failed. Please try again.');
      setProcessing(false);
    } finally {
      // Processing state will be reset in payment handler or modal dismiss
    }
  };

  return (
    <div className="bg-gradient-to-br from-slate-50 via-purple-50 to-rose-50 ">
      {/* Hero Header */}
      <section className="relative  overflow-hidden" style={{backgroundColor: '#7F55B1'}}>
        {/* Background Elements */}
        <div className="absolute inset-0">
          {[...Array(6)].map((_, i) => (
            <div 
              key={i}
              className="absolute w-24 h-24 rounded-full bg-white/5 backdrop-blur-sm animate-pulse"
              style={{
                left: `${15 + (i * 15)}%`,
                top: `${20 + (i % 2) * 40}%`,
                animationDelay: `${i * 0.5}s`,
                animationDuration: `${3 + i}s`
              }}
            />
          ))}
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-6 py-20">
          <div className={`text-center transition-all duration-1000 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}>
            <div className="mb-4">
              <h1 className="text-6xl md:text-7xl font-bold bg-gradient-to-r from-white via-purple-200 to-rose-200 bg-clip-text text-transparent mb-1">
                Art & Slime DIY Kits
              </h1>
              <div className="w-32 h-1 bg-gradient-to-r from-purple-400 to-pink-200 mx-auto rounded-full mb-6" />
            </div>
            <p className="text-xl md:text-2xl text-white/90 max-w-4xl mx-auto leading-relaxed">
              Curated premium kits and materials to bring your creativity to life at home!
            </p>
          </div>
        </div>
      </section>
      {/* Main Content */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-4 gap-8">
            {/* Filters Sidebar */}
            <aside className="lg:col-span-1">
              <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100 sticky top-32">
                <h2 className="text-2xl font-bold mb-8 flex items-center gap-3">
                  <span className="text-2xl">🔍</span>
                  Filters
                </h2>
                <div className="space-y-8">
                  {/* Categories */}
                  <div>
                    <h3 className="font-bold text-lg mb-4 text-gray-800">Categories</h3>
                    <div className="space-y-3">
                      {categories.map((category) => (
                        <button
                          key={category.id}
                          onClick={() => setFilter(category.id)}
                          className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all duration-300 text-left
                            ${filter === category.id 
                              ? 'bg-gradient-to-r from-purple-600 to-pink-300 text-white shadow-lg' 
                              : 'bg-gray-50 text-gray-700 hover:bg-purple-50 hover:text-purple-600'
                            }`}
                        >
                          <span className="text-xl">{category.icon}</span>
                          <div className="flex-1">
                            <div className="font-semibold">{category.name}</div>
                            <div className={`text-sm ${filter === category.id ? 'text-white/80' : 'text-gray-500'}`}>
                              {category.count} items
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                  {/* Price Range */}
                  <div>
                    <h3 className="font-bold text-lg mb-4 text-gray-800">Price Range</h3>
                    <div className="space-y-4">
                      <div className="flex justify-between text-sm text-gray-600">
                        <span>₹0</span>
                        <span className="font-semibold text-purple-600">₹{priceRange}</span>
                        <span>₹3000</span>
                      </div>
                      <input 
                        type="range" 
                        min="0" 
                        max="3000" 
                        value={priceRange}
                        onChange={(e) => setPriceRange(Number(e.target.value))}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-purple-600" 
                      />
                    </div>
                  </div>
                  {/* Quick Stats */}
                  <div className="bg-gradient-to-br from-purple-50 to-rose-50 p-6 rounded-2xl">
                    <div className="text-center">
                      <div className="text-3xl mb-2">🎯</div>
                      <div className="text-lg font-bold text-purple-600">{availableProducts.length} Products</div>
                      <div className="text-sm text-gray-600">Match your filters</div>
                    </div>
                  </div>
                </div>
              </div>
            </aside>
            {/* Products Grid */}
            <main className="lg:col-span-3">
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-gray-800 mb-2">
                  {filter === 'all' ? 'All Products' : categories.find(c => c.id === filter)?.name}
                </h2>
                <p className="text-gray-600">
                  Showing {availableProducts.length} of {products.length} products
                </p>
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
                        disabled={!user}
                        className="bg-orange-600 text-white px-6 py-2 rounded-md hover:bg-orange-700 disabled:opacity-50 transition-colors"
                      >
                        Checkout
                      </button>
                    </div>
                  </div>
                </div>
              )}
              {/* Products Grid */}
              <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-8 mb-16">
                {availableProducts.length === 0 ? (
                  <div className="col-span-full text-center py-20">
                    <div className="text-gray-400 text-6xl mb-4">🛍️</div>
                    <h3 className="text-2xl font-bold text-gray-800 mb-2">No Products Found</h3>
                    <p className="text-gray-600 max-w-md mx-auto">
                      No products match your current filters. Try adjusting your search criteria.
                    </p>
                  </div>
                ) : (
                  availableProducts.map((product, index) => {
                    const cartQuantity = cart[product.id] || 0;
                    return (
                      <div
                        key={product.id}
                        className="group relative bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden cursor-pointer transform hover:scale-105"
                        style={{ animationDelay: `${index * 0.1}s` }}
                      >
                        {/* Product Image */}
                        <div className="relative h-80 w-full overflow-hidden">
                          <div
                            className="h-full w-full bg-center bg-cover transition-transform duration-500 group-hover:scale-110"
                            style={{ backgroundImage: `url('${product.images?.[0] || ''}')` }}
                          />
                          {/* Hover Overlay */}
                          <div className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                            {/* You can add a details link here if needed */}
                          </div>
                          {/* Optional Badge (Top Left) */}
                          {product.badge && (
                            <div className={`absolute top-4 left-4 px-3 py-1 rounded-full text-white text-xs font-bold shadow-lg bg-purple-600`}>
                              {product.badge}
                            </div>
                          )}
                          {/* Optional Discount Badge (Top Right) */}
                          {product.originalPrice && (
                            <div className="absolute top-4 right-4 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold shadow-lg">
                              -{Math.round((1 - product.price / product.originalPrice) * 100)}%
                            </div>
                          )}
                          {/* Shop Icon (Bottom Right) */}
                          <div 
                            className="absolute bottom-4 right-4 bg-white/90 p-2 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-white cursor-pointer"
                            onClick={() => addToCart(product.id)}
                          >
                            <ShoppingCart className="h-6 w-6 text-gray-800" />
                          </div>
                        </div>
                        {/* Product Info */}
                        <div className="p-6">
                          <div className="flex justify-between items-start mb-2">
                            <h3 className="text-xl font-bold text-gray-800">{product.name}</h3>
                          </div>
                          {/* Removed description and rating as requested */}
                          <div className="flex items-center justify-between mb-3">
                            <span className="text-2xl font-bold text-orange-600">₹{product.price}</span>
                          </div>
                          {/* Removed 'Includes' (materials) section as requested */}
                          <div className="flex justify-between items-center mb-4">
                            <span className={`text-sm px-2 py-1 rounded ${
                              product.stock > 10 ? 'bg-green-100 text-green-800' :
                              product.stock > 0 ? 'bg-yellow-100 text-yellow-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              Stock: {product.stock}
                            </span>
                            <span className="text-sm text-gray-600">Available Nationwide</span>
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
                  })
                )}
              </div>
              {/* Bulk Orders Section */}
              <div className="bg-gradient-to-br from-white via-purple-50 to-rose-50 p-12 rounded-3xl shadow-xl border border-purple-100 mt-12">
                <div className="text-center max-w-2xl mx-auto">
                  <div className="text-6xl mb-6">📦</div>
                  <h3 className="text-3xl font-bold  bg-clip-text text-transparent mb-4" style={{backgroundColor: '#7F55B1'}}>
                    Looking for Bulk Orders?
                  </h3>
                  <p className="text-gray-600 mb-8 text-lg leading-relaxed">
                    We offer special discounts on bulk purchases for parties, corporate events, and gifting. 
                    Get in touch with us for a custom quote and exclusive deals!
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button className="group  text-white font-semibold px-8 py-4 rounded-full hover:shadow-2xl transition-all duration-300 transform hover:scale-105" style={{backgroundColor: '#7F55B1'}}>
                      <span className="flex items-center justify-center gap-3">
                        📞 Get Custom Quote
                        <div className="w-0 group-hover:w-4 h-0.5 bg-white rounded transition-all duration-300" />
                      </span>
                    </button>
                    <button className="bg-white text-purple-600 border-2 border-purple-600 font-semibold px-8 py-4 rounded-full hover:bg-purple-50 transition-all duration-300">
                      Learn More
                    </button>
                  </div>
                  <div className="mt-8 grid grid-cols-3 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600">10%+</div>
                      <div className="text-sm text-gray-600">Bulk Discounts</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600">24h</div>
                      <div className="text-sm text-gray-600">Quick Response</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600">🎁</div>
                      <div className="text-sm text-gray-600">Custom Packaging</div>
                    </div>
                  </div>
                </div>
              </div>
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
            </main>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Store;