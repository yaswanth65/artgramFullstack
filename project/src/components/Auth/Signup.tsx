import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const Signup: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    // Validation
    if (!name || !email || !password || !confirmPassword) {
      setError('All fields are required');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    // Server requires a stronger password: min 8 chars, uppercase, lowercase, number and special char
    const pwdRegex = /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}/;
    if (!pwdRegex.test(password)) {
      setError('Password must be at least 8 characters and include uppercase, lowercase, a number and a special character');
      return;
    }
    
    setLoading(true);
    console.log('🔵 Starting signup process for:', email);
    
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
      const registerUrl = `${apiUrl}/auth/register`;
      
      console.log('📡 Sending registration request to:', registerUrl);
      console.log('📋 Registration data:', { name, email, role: 'customer' });
      
      const res = await fetch(registerUrl, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ 
          name, 
          email, 
          password,
          role: 'customer'
        })
      });
      
      console.log('📊 Registration response status:', res.status);
      
      if (!res.ok) {
        let errorMessage = 'Registration failed';
        try {
          const data = await res.json();
          errorMessage = data.message || data.error || errorMessage;
          console.error('❌ Registration error response:', data);
        } catch (parseError) {
          console.error('❌ Failed to parse error response:', parseError);
          errorMessage = `Registration failed with status ${res.status}`;
        }
        setError(errorMessage);
        return;
      }
      
      const data = await res.json();
      console.log('✅ Registration successful:', { userId: data.user?.id, email: data.user?.email });
      
      // Auto-login with the response token and user data
      if (data.token && data.user) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        console.log('🔑 Auto-login successful, redirecting to home');
        navigate('/');
        return;
      }
      
      // If no token returned, try manual login
      console.log('🔄 No token in response, attempting manual login');
      try {
        await login(email, password);
        console.log('✅ Manual login successful');
        navigate('/');
        return;
      } catch (loginError) {
        console.error('❌ Manual login failed:', loginError);
        console.log('🔄 Redirecting to login page');
        navigate('/login');
      }
      
    } catch (e: unknown) {
      console.error('❌ Network/fetch error during signup:', e);
      let msg = 'Network error - please check your connection';
      if (e instanceof Error) {
        msg = e.message;
        if (e.message.includes('fetch')) {
          msg = 'Unable to connect to server. Please check if the server is running.';
        }
      }
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Create Account</h2>
        {error && <div className="mb-4 text-red-600 text-sm">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Name</label>
            <input type="text" className="w-full border rounded px-3 py-2" value={name} onChange={e => setName(e.target.value)} required />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input type="email" className="w-full border rounded px-3 py-2" value={email} onChange={e => setEmail(e.target.value)} required />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <input type="password" className="w-full border rounded px-3 py-2" value={password} onChange={e => setPassword(e.target.value)} required />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Confirm Password</label>
            <input type="password" className="w-full border rounded px-3 py-2" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required />
          </div>
          <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded font-semibold hover:bg-blue-700 transition-colors" disabled={loading}>
            {loading ? 'Creating...' : 'Sign Up'}
          </button>
        </form>
        <div className="mt-4 text-center text-sm">
          Already have an account? <Link to="/login" className="text-blue-600 hover:underline">Login</Link>
        </div>
      </div>
    </div>
  );
};

export default Signup;
