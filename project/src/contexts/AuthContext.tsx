import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  resetPassword: (token: string, email: string, newPassword: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
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
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      // Mock login - in real app, this would be an API call
      const mockUsers: User[] = [
        {
          id: '1',
          email: 'admin@craftfactory.com',
          name: 'Admin User',
          role: 'admin',
          createdAt: '2024-01-01T00:00:00Z'
        },
        {
          id: '2',
          email: 'pune@craftfactory.com',
          name: 'Pune Branch Manager',
          role: 'branch_manager',
          branchId: 'pune',
          createdAt: '2024-01-01T00:00:00Z'
        },
        {
          id: '3',
          email: 'mumbai@craftfactory.com',
          name: 'Mumbai Branch Manager',
          role: 'branch_manager',
          branchId: 'mumbai',
          createdAt: '2024-01-01T00:00:00Z'
        },
        {
          id: '4',
          email: 'customer@example.com',
          name: 'John Doe',
          role: 'customer',
          createdAt: '2024-01-01T00:00:00Z'
        }
      ];

      const foundUser = mockUsers.find(u => u.email === email);
      if (foundUser && password === 'password') {
        setUser(foundUser);
        localStorage.setItem('user', JSON.stringify(foundUser));
      } else {
        throw new Error('Invalid credentials');
      }
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (token: string, email: string, newPassword: string) => {
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
      
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };
  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, login, resetPassword, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};