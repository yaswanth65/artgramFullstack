import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'admin' | 'branch_manager' | 'customer';
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requiredRole }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  console.log('🛡️ ProtectedRoute check:', { 
    user: user ? { id: user.id, role: user.role, email: user.email } : null, 
    loading, 
    requiredRole, 
    pathname: location.pathname 
  });

  if (loading) {
    console.log('🔄 ProtectedRoute: Still loading auth...');
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-600"></div>
      </div>
    );
  }

  if (!user) {
    console.log('❌ ProtectedRoute: No user found, redirecting to login');
    // send the attempted path so the login page can return the user here after auth
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  if (requiredRole && user.role !== requiredRole) {
    console.log('🚫 ProtectedRoute: Role mismatch. Required:', requiredRole, 'User has:', user.role);
    return <Navigate to="/" replace />;
  }

  console.log('✅ ProtectedRoute: Access granted for', user.role, 'to', location.pathname);
  return <>{children}</>;
};

export default ProtectedRoute;