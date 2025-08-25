import React from 'react';

const ShippingPolicy: React.FC = () => (
  <div className="min-h-screen bg-gradient-to-br from-green-50 to-purple-50 py-16 px-4">
    <div className="max-w-3xl mx-auto bg-white rounded-3xl shadow-2xl p-8 border-4 border-pink-200">
      <h1 className="text-4xl font-bold text-center text-red-600 mb-8">Shipping Policy</h1>
      <p className="mb-4 text-gray-700">We strive to deliver your orders quickly and safely. Please review our shipping policy below.</p>
      <h2 className="text-2xl font-bold text-pink-600 mt-8 mb-2">Order Processing</h2>
      <ul className="list-disc list-inside text-gray-700 mb-4">
        <li>Orders are processed within 1-2 business days after payment confirmation.</li>
        <li>Shipping times may vary based on your location and product availability.</li>
      </ul>
      <h2 className="text-2xl font-bold text-pink-600 mt-8 mb-2">Delivery</h2>
      <ul className="list-disc list-inside text-gray-700 mb-4">
        <li>We deliver across India using trusted courier partners.</li>
        <li>Estimated delivery time is 3-7 business days after dispatch.</li>
        <li>Tracking details will be provided once your order is shipped.</li>
      </ul>
      <h2 className="text-2xl font-bold text-pink-600 mt-8 mb-2">Shipping Charges</h2>
      <ul className="list-disc list-inside text-gray-700 mb-4">
        <li>Shipping charges are calculated at checkout based on your order value and location.</li>
        <li>Free shipping may be available for select products or promotions.</li>
      </ul>
      <h2 className="text-2xl font-bold text-pink-600 mt-8 mb-2">Contact Us</h2>
      <p className="text-gray-700">For shipping-related queries, contact us at <a href="mailto:info@artgram.com" className="text-purple-600 underline">info@artgram.com</a>.</p>
    </div>
  </div>
);

export default ShippingPolicy;
