import React from 'react';

const RefundPolicy: React.FC = () => (
  <div className="min-h-screen bg-gradient-to-br from-green-50 to-purple-50 py-16 px-4">
    <div className="max-w-3xl mx-auto bg-white rounded-3xl shadow-2xl p-8 border-4 border-green-300">
      <h1 className="text-4xl font-bold text-center text-red-600 mb-8">Refund Policy</h1>
      <p className="mb-4 text-gray-700">We want you to have a great experience with Artgram. Please read our refund policy below.</p>
      <h2 className="text-2xl font-bold text-green-600 mt-8 mb-2">Cancellations &amp; Refunds</h2>
      <ul className="list-disc list-inside text-gray-700 mb-4">
        <li>Refunds are available for cancellations made at least 24 hours before your scheduled session or event.</li>
        <li>No refunds for cancellations within 24 hours of the event or for no-shows.</li>
        <li>For store purchases, refunds are processed for defective or damaged products reported within 48 hours of delivery.</li>
      </ul>
      <h2 className="text-2xl font-bold text-green-600 mt-8 mb-2">How to Request a Refund</h2>
      <ul className="list-disc list-inside text-gray-700 mb-4">
        <li>Contact us at <a href="mailto:info@artgram.com" className="text-purple-600 underline">info@artgram.com</a> with your order or booking details.</li>
        <li>Refunds will be processed to your original payment method within 7-10 business days after approval.</li>
      </ul>
      <h2 className="text-2xl font-bold text-green-600 mt-8 mb-2">Contact Us</h2>
      <p className="text-gray-700">For any refund-related questions, please email <a href="mailto:info@artgram.com" className="text-purple-600 underline">info@artgram.com</a>.</p>
    </div>
  </div>
);

export default RefundPolicy;
