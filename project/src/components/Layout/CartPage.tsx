import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../../contexts/CartContext";
import {
  createRazorpayOrder,
  initiatePayment,
  RazorpayResponse,
} from "../../utils/razorpay";
import { useAuth } from "../../contexts/AuthContext";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";

export default function CartPage() {
  const { items, updateQty, removeItem, clear, totalPrice, isLoading } =
    useCart();
  const [customer, setCustomer] = useState({ name: "", email: "", phone: "" });
  const [address, setAddress] = useState("");
  const navigate = useNavigate();
  const { user } = useAuth();
  const [processing, setProcessing] = useState(false);

  // Pre-fill customer details if user is logged in
  useEffect(() => {
    if (user) {
      setCustomer({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
      });
    }
  }, [user]);

  const handleUpdateQty = (id: string, newQty: number) => {
    if (newQty <= 0) {
      removeItem(id);
    } else {
      updateQty(id, newQty);
    }
  };

  const checkout = async () => {
    if (!user) {
      alert("Please login to checkout");
      navigate("/login");
      return;
    }

    if (items.length === 0) {
      alert("Your cart is empty");
      return;
    }

    setProcessing(true);
    try {
      const amount = totalPrice;
      const order = await createRazorpayOrder(amount);
      await initiatePayment({
        amount: order.amount / 100,
        currency: order.currency,
        name: "Artgram",
        description: "Purchase from Artgram Store",
        order_id: order.id,
        key: "rzp_test_default_key",
        handler: async (response: RazorpayResponse) => {
          try {
            // Save order locally as demo
            const orders = JSON.parse(
              localStorage.getItem("admin_orders") || "[]"
            );
            const orderId = orders.length
              ? Math.max(...orders.map((o: any) => o.id)) + 1
              : 1;
            const newOrder = {
              id: orderId,
              customer: user.name,
              contact: user,
              total: amount,
              items: items.map((i) => ({
                productId: i.id,
                name: i.title,
                qty: i.qty,
                price: i.price,
              })),
              status: "Pending",
              paymentId: response.razorpay_payment_id,
              createdAt: new Date().toISOString(),
            };
            orders.push(newOrder);
            localStorage.setItem("admin_orders", JSON.stringify(orders));

            // Clear cart
            clear();
            setProcessing(false);
            alert("Payment successful! Order placed successfully.");
            navigate("/dashboard");
          } catch (err) {
            console.error(err);
            alert("Order save failed after payment. Please contact support.");
            setProcessing(false);
          }
        },
        prefill: {
          name: customer.name || user.name,
          email: customer.email || user.email,
          contact: customer.phone || user?.phone || "",
        },
        theme: { color: "#7F55B1" },
        modal: {
          ondismiss: () => setProcessing(false),
        },
      });
    } catch (err) {
      console.error(err);
      alert("Payment failed to start. Please try again.");
      setProcessing(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-rose-50 py-12">
        <div className="max-w-4xl mx-auto bg-white p-8 rounded-2xl shadow-xl">
          <div className="text-center py-12">
            <ShoppingBag className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Login Required
            </h2>
            <p className="text-gray-600 mb-6">
              Please login to view your cart and make purchases.
            </p>
            <Link
              to="/login"
              className="inline-block bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors"
            >
              Login to Continue
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-rose-50 py-12">
        <div className="max-w-4xl mx-auto bg-white p-8 rounded-2xl shadow-xl">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
            <p className="text-gray-600 mt-4">Loading your cart...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-rose-50 py-12">
      <div className="max-w-6xl mx-auto px-4">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-6">
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <ShoppingBag className="w-8 h-8" />
              Your Shopping Cart
            </h1>
            <p className="mt-2 text-purple-100">
              {items.length} {items.length === 1 ? "item" : "items"} in your
              cart
            </p>
          </div>

          <div className="p-6">
            {items.length === 0 ? (
              <div className="text-center py-16">
                <ShoppingBag className="w-24 h-24 text-gray-300 mx-auto mb-6" />
                <h3 className="text-2xl font-bold text-gray-800 mb-4">
                  Your cart is empty
                </h3>
                <p className="text-gray-600 mb-8">
                  Discover amazing products in our store!
                </p>
                <Link
                  to="/store"
                  className="inline-block bg-purple-600 text-white px-8 py-3 rounded-lg hover:bg-purple-700 transition-colors font-semibold"
                >
                  Browse Products
                </Link>
              </div>
            ) : (
              <div className="grid lg:grid-cols-3 gap-8">
                {/* Cart Items */}
                <div className="lg:col-span-2">
                  <div className="space-y-4">
                    {items.map((item) => (
                      <div
                        key={item.id}
                        className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                            {item.image ? (
                              <img
                                src={item.image}
                                alt={item.title}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-gray-400">
                                <ShoppingBag className="w-8 h-8" />
                              </div>
                            )}
                          </div>

                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-gray-800 truncate">
                              {item.title}
                            </h3>
                            <p className="text-gray-600">
                              ₹{item.price.toFixed(2)} each
                            </p>
                          </div>

                          <div className="flex items-center gap-3">
                            <button
                              onClick={() =>
                                handleUpdateQty(item.id, item.qty - 1)
                              }
                              className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition-colors"
                              disabled={processing}
                            >
                              <Minus className="w-4 h-4" />
                            </button>

                            <span className="w-12 text-center font-semibold">
                              {item.qty}
                            </span>

                            <button
                              onClick={() =>
                                handleUpdateQty(item.id, item.qty + 1)
                              }
                              className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition-colors"
                              disabled={processing}
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>

                          <div className="text-right">
                            <p className="font-bold text-lg">
                              ₹{(item.price * item.qty).toFixed(2)}
                            </p>
                            <button
                              onClick={() => removeItem(item.id)}
                              className="text-red-500 hover:text-red-700 transition-colors mt-1"
                              disabled={processing}
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Checkout Section */}
                <div className="lg:col-span-1">
                  <div className="bg-gray-50 rounded-xl p-6 sticky top-6">
                    <h3 className="text-xl font-bold mb-6">Order Summary</h3>

                    {/* Customer Details */}
                    <div className="space-y-4 mb-6">
                      <h4 className="text-lg font-semibold text-gray-800 mb-4">
                        📍 Delivery Address
                      </h4>
                      <p className="text-sm text-gray-600 mb-4">
                        Please provide your complete delivery address including
                        house number, street, area, and landmark for accurate
                        delivery.
                      </p>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Full Name
                        </label>
                        <input
                          type="text"
                          value={customer.name}
                          onChange={(e) =>
                            setCustomer({ ...customer, name: e.target.value })
                          }
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          disabled={processing}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Email
                        </label>
                        <input
                          type="email"
                          value={customer.email}
                          onChange={(e) =>
                            setCustomer({ ...customer, email: e.target.value })
                          }
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          disabled={processing}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Phone
                        </label>
                        <input
                          type="tel"
                          value={customer.phone}
                          onChange={(e) =>
                            setCustomer({ ...customer, phone: e.target.value })
                          }
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          disabled={processing}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Delivery Address
                        </label>
                        <textarea
                          value={address}
                          onChange={(e) => setAddress(e.target.value)}
                          rows={3}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          placeholder="Enter your complete address..."
                          disabled={processing}
                        />
                      </div>
                    </div>

                    {/* Order Total */}
                    <div className="border-t border-gray-200 pt-4 mb-6">
                      <div className="flex justify-between items-center">
                        <span className="text-lg font-semibold">
                          Total Amount:
                        </span>
                        <span className="text-2xl font-bold text-purple-600">
                          ₹{totalPrice.toFixed(2)}
                        </span>
                      </div>
                    </div>

                    {/* Checkout Button */}
                    <button
                      onClick={checkout}
                      disabled={processing || items.length === 0}
                      className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {processing ? (
                        <div className="flex items-center justify-center gap-2">
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                          Processing...
                        </div>
                      ) : (
                        "Proceed to Payment"
                      )}
                    </button>

                    <p className="text-xs text-gray-500 text-center mt-4">
                      Secure payment powered by Razorpay
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
