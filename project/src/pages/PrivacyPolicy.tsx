import React from 'react';

const PrivacyPolicy: React.FC = () => (
  <div className="min-h-screen bg-gradient-to-br from-green-50 to-purple-50 py-16 px-4">
    <div className="max-w-3xl mx-auto bg-white rounded-3xl shadow-2xl p-8 border-4 border-orange-200">
      <h1 className="text-4xl font-bold text-center text-red-600 mb-8">Privacy Policy</h1>
      <p className="mb-4 text-gray-700">Your privacy is important to us. This Privacy Policy explains how we collect, use, and protect your information when you use our website and services.</p>
      <h2 className="text-2xl font-bold text-orange-600 mt-8 mb-2">Information We Collect</h2>
      <ul className="list-disc list-inside text-gray-700 mb-4">
        <li>Personal information you provide (name, email, phone, etc.)</li>
        <li>Booking and purchase details</li>
        <li>Usage data and cookies</li>
      </ul>
      <h2 className="text-2xl font-bold text-orange-600 mt-8 mb-2">How We Use Your Information</h2>
      <ul className="list-disc list-inside text-gray-700 mb-4">
        <li>To process bookings and orders</li>
        <li>To improve our services and user experience</li>
        <li>To send updates, offers, and important information</li>
      </ul>
      <h2 className="text-2xl font-bold text-orange-600 mt-8 mb-2">Data Security</h2>
      <p className="mb-4 text-gray-700">We use industry-standard security measures to protect your data. Your information is never sold or shared with third parties except as required by law or to fulfill your requests.</p>
      <h2 className="text-2xl font-bold text-orange-600 mt-8 mb-2">Contact Us</h2>
      <p className="text-gray-700">If you have any questions about our Privacy Policy, please contact us at <a href="mailto:info@artgram.com" className="text-purple-600 underline">info@artgram.com</a>.</p>
    </div>
  </div>
);

export default PrivacyPolicy;
