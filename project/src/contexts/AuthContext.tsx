/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, useEffect } from 'react';
import type { User } from '../types';

const apiBase = import.meta.env.VITE_API_URL || '/api';

async function defaultApiFetch(path: string, opts: RequestInit = {}) {
  const token = localStorage.getItem('token');
  const headers: Record<string, string> = { 'Content-Type': 'application/json', ...(opts.headers as any) };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  const url = `${apiBase}${path}`;
  const res = await fetch(url, { ...opts, headers });
  if (!res.ok) {
    const txt = await res.text().catch(() => '');
    throw new Error(txt || res.statusText || 'API error');
  }
  return await res.json().catch(() => null);
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  resetPassword: (token: string, email: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
  updateProfile?: (updates: Partial<User>) => void;
  apiFetch?: (path: string, opts?: RequestInit) => Promise<any>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [passwordResetTokens, setPasswordResetTokens] = useState<{ [key: string]: { email: string; expires: number } }>({});

  const apiFetch = async (path: string, opts: RequestInit = {}) => {
    const token = localStorage.getItem('token');
    const headers = { 'Content-Type': 'application/json', ...(opts.headers as any), ...(token ? { Authorization: `Bearer ${token}` } : {}) } as Record<string, string>;
    const res = await fetch(`${apiBase}${path}`, { ...opts, headers });
    if (res.status === 401 && token) {
      try {
        const vRes = await fetch(`${apiBase}/auth/verify`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token })
        });
        if (vRes.ok) {
          const vData = await vRes.json().catch(() => null);
          if (vData?.token) {
            localStorage.setItem('token', vData.token);
            const retryHeaders = { ...headers, Authorization: `Bearer ${vData.token}` };
            return fetch(`${apiBase}${path}`, { ...opts, headers: retryHeaders }).then(r => r.json().catch(() => null));
          }
        }
      } catch {}
      setUser(null);
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      throw new Error('Unauthorized');
    }
    if (!res.ok) {
      const txt = await res.text().catch(() => '');
      throw new Error(txt || res.statusText || 'API error');
    }
    return await res.json().catch(() => null);
  };

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const keys = Object.keys(localStorage || {});
        console.log('🔐 localStorage keys at auth init:', keys);
      } catch (e) {
        console.warn('⚠️ Could not read localStorage keys at auth init:', e);
      }
      const storedUser = localStorage.getItem('user');
      const token = localStorage.getItem('token');
      console.log('🔍 storedUser present:', !!storedUser, 'token present:', !!token);
      if (!storedUser || !token) {
        setUser(null);
        setLoading(false);
        return;
      }
      try {
        const parsedUser = JSON.parse(storedUser);
        const normalizedUser = {
          ...parsedUser,
          id: parsedUser.id || parsedUser._id,
          branchId: typeof parsedUser?.branchId === 'object' ? (parsedUser?.branchId?._id || parsedUser?.branchId?.id || '') : parsedUser?.branchId
        } as User;
        setUser(normalizedUser);
        (async (t: string) => {
          try {
            const res = await fetch(`${apiBase}/auth/verify`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ token: t })
            });
            if (res.ok) {
              const data = await res.json().catch(() => null);
              if (data?.user) {
                const updatedUser = {
                  ...data.user,
                  id: data.user.id || data.user._id,
                  branchId: typeof data.user?.branchId === 'object' ? (data.user?.branchId?._id || data.user?.branchId?.id || '') : data.user?.branchId
                } as User;
                localStorage.setItem('user', JSON.stringify(updatedUser));
                setUser(updatedUser);
              }
              if (data?.token && data.token !== t) {
                localStorage.setItem('token', data.token);
                try {
                  const n = document.createElement('div');
                  n.style.cssText = 'position: fixed; top: 20px; right: 20px; background: #10b981; color: white; padding: 10px 15px; border-radius: 6px; font-size: 14px; z-index: 10000; font-family: Arial, sans-serif;';
                  n.textContent = '🔄 Session refreshed';
                  document.body.appendChild(n);
                  setTimeout(() => { if (n.parentNode) n.parentNode.removeChild(n); }, 2500);
                } catch {}
              }
            } else if (res.status === 401) {
              setUser(null);
              localStorage.removeItem('user');
              localStorage.removeItem('token');
            }
          } catch (e) {
            console.warn('⚠️ Background token verify failed, keeping local user', e);
          }
        })(token);
      } catch (e) {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    initializeAuth();
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const resp = await defaultApiFetch('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) });
      const { token, user: u } = resp as any;
      if (token && u) {
        const normalizedUser: User = { ...(u as User), id: u.id || u._id, branchId: typeof (u as any)?.branchId === 'object' ? ((u as any)?.branchId?._id || (u as any)?.branchId?.id || '') : (u as any)?.branchId };
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(normalizedUser));
        setUser(normalizedUser);
        return;
      }
      throw new Error('Login failed');
    } catch (err) {
      const isConnectionError = err instanceof Error && (err.message.includes('fetch') || err.message.includes('Failed to fetch'));
      if (isConnectionError) {
        const mockUsers: User[] = [
          { id: '1', email: 'admin@artgram.com', name: 'Admin User', role: 'admin', createdAt: '2024-01-01T00:00:00Z' } as any,
          { id: '10', email: 'hyderabad@artgram.com', name: 'Hyderabad Branch Manager', role: 'branch_manager', branchId: 'hyderabad', createdAt: '2024-01-01T00:00:00Z' } as any,
          { id: '11', email: 'vijayawada@artgram.com', name: 'Vijayawada Branch Manager', role: 'branch_manager', branchId: 'vijayawada', createdAt: '2024-01-01T00:00:00Z' } as any,
          { id: '12', email: 'bangalore@artgram.com', name: 'Bangalore Branch Manager', role: 'branch_manager', branchId: 'bangalore', createdAt: '2024-01-01T00:00:00Z' } as any,
          { id: '4', email: 'customer@example.com', name: 'John Doe', phone: '+91 98765 43210', address: { street: '12 MG Road', city: 'Hyderabad', state: 'Telangana', zipCode: '500081', country: 'India' }, role: 'customer', createdAt: '2024-01-01T00:00:00Z' } as any
        ];
        const found = mockUsers.find(m => m.email === email);
        if (found && password === 'password') {
          localStorage.setItem('token', 'mock_token');
          localStorage.setItem('user', JSON.stringify(found));
          setUser(found);
          return;
        }
      }
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = (updates: Partial<User>) => {
    (async () => {
      try {
        await apiFetch?.('/auth/profile', { method: 'PUT', body: JSON.stringify(updates) });
      } catch {}
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
      const tokenData = passwordResetTokens[token];
      if (!tokenData || tokenData.email !== email || Date.now() > tokenData.expires) throw new Error('Invalid or expired reset token');
      setPasswordResetTokens(prev => { const n = { ...prev }; delete n[token]; return n; });
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    try { localStorage.setItem('cart_items_guest', JSON.stringify([])); window.dispatchEvent(new Event('cart_updated')); } catch {}
  };

  const value: AuthContextType = { user, login, resetPassword, logout, loading, updateProfile, apiFetch };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
  }