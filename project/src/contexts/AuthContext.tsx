/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';

// Small helper to call backend API (if VITE_API_URL is configured)
const apiBase = (import.meta as any).env?.VITE_API_URL || '/api';

async function apiFetch(path: string, opts: RequestInit = {}) {
  const token = localStorage.getItem('token');
  const headers: Record<string, string> = { 'Content-Type': 'application/json', ...(opts.headers as any) };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  
  const url = `${apiBase}${path}`;
  console.log('🌐 Making API request to:', url);
  console.log('📝 Request options:', { ...opts, headers });
  
  const res = await fetch(url, { ...opts, headers });
  console.log('📡 Response status:', res.status, res.statusText);
  
  if (!res.ok) {
    const txt = await res.text().catch(() => '');
    console.log('❌ API Error response:', txt);
    throw new Error(txt || res.statusText || 'API error');
  }
  const data = await res.json().catch(() => null);
  console.log('✅ API Success response:', data);
  return data;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  resetPassword: (token: string, email: string, newPassword: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
  updateProfile?: (updates: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [passwordResetTokens, setPasswordResetTokens] = useState<{[key: string]: {email: string, expires: number}}>({});

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    if (storedUser && token) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    console.log('🔵 Login attempt for:', email);
    setLoading(true);
    try {
      // Try real backend login first
      console.log('🌐 Attempting backend login...');
      const resp = await apiFetch('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) });
      console.log('✅ Backend login response:', resp);
      const { token, user: u } = resp as any;
      if (token && u) {
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(u));
        setUser(u);
        console.log('✅ Login successful, user set:', u);
        return;
      }
      
      // If we get here, backend login failed
      console.log('❌ Backend login failed - no token or user');
      throw new Error('Backend login failed');
    } catch (err) {
      console.log('❌ Login error:', err);
      // Only fall back to mock users if backend is completely unavailable (connection error)
      const isConnectionError = err instanceof Error && (
        err.message.includes('fetch') || 
        err.message.includes('NetworkError') ||
        err.message.includes('Failed to fetch')
      );
      
      if (isConnectionError) {
        console.warn('Backend unavailable, falling back to mock users');
        
        // Fallback mock login for offline/demo mode
        const mockUsers: User[] = [
          {
            id: '1',
            email: 'admin@craftfactory.com',
            name: 'Admin User',
            role: 'admin',
            createdAt: '2024-01-01T00:00:00Z'
          },
          {
            id: '10',
            email: 'hyderabad@craftfactory.com',
            name: 'Hyderabad Branch Manager',
            role: 'branch_manager',
            branchId: 'hyderabad',
            createdAt: '2024-01-01T00:00:00Z'
          },
          {
            id: '11',
            email: 'vijayawada@craftfactory.com',
            name: 'Vijayawada Branch Manager',
            role: 'branch_manager',
            branchId: 'vijayawada',
            createdAt: '2024-01-01T00:00:00Z'
          },
          {
            id: '12',
            email: 'bangalore@craftfactory.com',
            name: 'Bangalore Branch Manager',
            role: 'branch_manager',
            branchId: 'bangalore',
            createdAt: '2024-01-01T00:00:00Z'
          },
          {
            id: '4',
            email: 'customer@example.com',
            name: 'John Doe',
            phone: '+91 98765 43210',
            address: {
              street: '12 MG Road',
              city: 'Hyderabad',
              state: 'Telangana',
              zipCode: '500081',
              country: 'India'
            },
            role: 'customer',
            createdAt: '2024-01-01T00:00:00Z'
          }
        ];

        const foundUser = mockUsers.find(u => u.email === email);
        if (foundUser && password === 'password') {
          setUser(foundUser);
          localStorage.setItem('user', JSON.stringify(foundUser));
          localStorage.setItem('token', 'mock_token');
          console.log('✅ Mock login successful:', foundUser);
        } else {
          throw new Error('Invalid credentials');
        }
      } else {
        // Re-throw the original error for proper handling
        throw err;
      }
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = (updates: Partial<User>) => {
    // Try backend update but keep local copy in sync for offline/demo
    (async () => {
      try {
        await apiFetch('/auth/profile', { method: 'PUT', body: JSON.stringify(updates) });
      } catch (err) {
        // ignore backend errors and continue with local update
      }
    })();

    setUser(prev => {
      const next = prev ? { ...prev, ...updates } : null;
      if (next) localStorage.setItem('user', JSON.stringify(next));
      return next;
    });
  };

  const resetPassword = async (token: string, email: string) => {
    setLoading(true);
    try {
      // Validate reset token
      const tokenData = passwordResetTokens[token];
      if (!tokenData || tokenData.email !== email || Date.now() > tokenData.expires) {
        throw new Error('Invalid or expired reset token');
      }

      // In a real app, this would update the password in the database
      // For demo purposes, we'll just simulate success
      console.log('Password reset successful for:', email);
      
      // Remove used token
      setPasswordResetTokens(prev => {
        const newTokens = { ...prev };
        delete newTokens[token];
        return newTokens;
      });
      
      // Show success notification
      const notification = document.createElement('div');
      notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #10b981;
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 10000;
        font-family: Arial, sans-serif;
      `;
      notification.innerHTML = '✅ Password reset successful!';
      document.body.appendChild(notification);
      
      setTimeout(() => {
        if (notification.parentNode) {
          notification.parentNode.removeChild(notification);
        }
      }, 3000);
      
  } finally {
      setLoading(false);
    }
  };
  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ user, login, resetPassword, logout, loading, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
};