import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { DataProvider } from './contexts/DataContext';
import Header from './components/Layout/Header';
import Footer from './components/Layout/Footer';
import Home from './pages/Home';
import ArtMakingActivityPage from './components/Layout/ArtMakingActivityPage';
import SlimePlayPage from './components/Layout/SlimePlayPage';
import TuftingActivityPage from './components/Layout/TuftingActivityPage';
import Login from './components/Auth/Login';
import PasswordReset from './components/Auth/PasswordReset';
import EventBooking from './components/Customer/EventBooking';
import Store from './components/Customer/Store';
import CustomerDashboard from './components/Customer/Dashboard';
import AdminDashboard from './components/Admin/AdminDashboard';
import ManagerDashboard from './components/Manager/ManagerDashboard';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <Router>
          <div className="min-h-screen bg-gray-50">
            <Header />
            <main className="min-h-screen">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/reset-password" element={<PasswordReset />} />
                <Route path="/events" element={<EventBooking />} />
                <Route path="/store" element={<Store />} />
                <Route path="/art-making-activity.html" element={<ArtMakingActivityPage />} />
            <Route path="/slime-play.html" element={<SlimePlayPage />} />
            <Route path="/tufting-activity.html" element={<TuftingActivityPage />} />
                <Route 
                  path="/dashboard" 
                  element={
                    <ProtectedRoute requiredRole="customer">
                      <CustomerDashboard />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/admin" 
                  element={
                    <ProtectedRoute requiredRole="admin">
                      <AdminDashboard />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/manager" 
                  element={
                    <ProtectedRoute requiredRole="branch_manager">
                      <ManagerDashboard />
                    </ProtectedRoute>
                  } 
                />
              </Routes>
            </main>
            <Footer />
          </div>
        </Router>
      </DataProvider>
    </AuthProvider>
  );
}

export default App;