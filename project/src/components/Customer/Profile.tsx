import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const Profile: React.FC = () => {
  const { user, updateProfile } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [street, setStreet] = useState(user?.address?.street || '');
  const [city, setCity] = useState(user?.address?.city || '');
  const [stateVal, setStateVal] = useState(user?.address?.state || '');
  const [zipCode, setZipCode] = useState(user?.address?.zipCode || '');
  const [country, setCountry] = useState(user?.address?.country || '');
  const [saving, setSaving] = useState(false);

  const handleSave = () => {
    if (!updateProfile) return;
    setSaving(true);
    updateProfile({
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      address: {
        street: street.trim(),
        city: city.trim(),
        state: stateVal.trim(),
        zipCode: zipCode.trim(),
        country: country.trim() || 'India'
      }
    });
    setSaving(false);
    navigate('/dashboard');
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold mb-4">Your Profile</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input value={name} onChange={e => setName(e.target.value)} className="mt-1 block w-full rounded-md border-gray-200 shadow-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input value={email} onChange={e => setEmail(e.target.value)} className="mt-1 block w-full rounded-md border-gray-200 shadow-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Phone</label>
            <input value={phone} onChange={e => setPhone(e.target.value)} className="mt-1 block w-full rounded-md border-gray-200 shadow-sm" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700">Street</label>
              <input value={street} onChange={e => setStreet(e.target.value)} className="mt-1 block w-full rounded-md border-gray-200 shadow-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">City</label>
              <input value={city} onChange={e => setCity(e.target.value)} className="mt-1 block w-full rounded-md border-gray-200 shadow-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">State</label>
              <input value={stateVal} onChange={e => setStateVal(e.target.value)} className="mt-1 block w-full rounded-md border-gray-200 shadow-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">ZIP</label>
              <input value={zipCode} onChange={e => setZipCode(e.target.value)} className="mt-1 block w-full rounded-md border-gray-200 shadow-sm" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700">Country</label>
              <input value={country} onChange={e => setCountry(e.target.value)} className="mt-1 block w-full rounded-md border-gray-200 shadow-sm" />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button onClick={handleSave} disabled={saving} className="bg-orange-600 text-white px-4 py-2 rounded-md">{saving ? 'Saving...' : 'Save'}</button>
            <button onClick={() => navigate('/dashboard')} className="px-4 py-2 rounded-md border">Cancel</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
