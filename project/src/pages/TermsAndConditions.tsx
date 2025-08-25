import React from 'react';

const TermsAndConditions: React.FC = () => (
  <div className="min-h-screen bg-gradient-to-br from-green-50 to-purple-50 py-16 px-4">
    <div className="max-w-3xl mx-auto bg-white rounded-3xl shadow-2xl p-8 border-4 border-purple-200">
      <h1 className="text-4xl font-bold text-center text-red-600 mb-8">Terms &amp; Conditions</h1>
      <p className="mb-4 text-gray-700">By using our website and services, you agree to the following terms and conditions. Please read them carefully.</p>
      <h2 className="text-2xl font-bold text-purple-600 mt-8 mb-2">Bookings &amp; Payments</h2>
      <ul className="list-disc list-inside text-gray-700 mb-4">
        <li>All bookings are subject to availability and confirmation.</li>
        <li>Full payment is required to confirm your booking.</li>
        <li>Prices are subject to change without prior notice.</li>
      </ul>
      <h2 className="text-2xl font-bold text-purple-600 mt-8 mb-2">User Responsibilities</h2>
      <ul className="list-disc list-inside text-gray-700 mb-4">
        <li>Provide accurate information during booking and checkout.</li>
        <li>Follow all safety and participation guidelines at our events and studios.</li>
        <li>Respect our staff, property, and other guests.</li>
      </ul>
      <h2 className="text-2xl font-bold text-purple-600 mt-8 mb-2">Changes &amp; Cancellations</h2>
      <ul className="list-disc list-inside text-gray-700 mb-4">
        <li>We reserve the right to reschedule or cancel events due to unforeseen circumstances.</li>
        <li>Customers will be notified promptly and offered alternatives or refunds as per our policy.</li>
      </ul>
      <h2 className="text-2xl font-bold text-purple-600 mt-8 mb-2">Contact Us</h2>
      <p className="text-gray-700">For any questions regarding these terms, please contact us at <a href="mailto:info@artgram.com" className="text-purple-600 underline">info@artgram.com</a>.</p>
    </div>
  </div>
);

export default TermsAndConditions;
