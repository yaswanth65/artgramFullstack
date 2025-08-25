import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { DataProvider } from './contexts/DataContext';
import Header from './components/Layout/Header';
import Footer from './components/Layout/Footer';
import Home from './pages/Home';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsAndConditions from './pages/TermsAndConditions';
import ShippingPolicy from './pages/ShippingPolicy';
import RefundPolicy from './pages/RefundPolicy';
import ArtMakingActivityPage from './components/Layout/ArtMakingActivityPage';
import SlimePlayPage from './components/Layout/SlimePlayPage';
import TuftingActivityPage from './components/Layout/TuftingActivityPage';
import ContactUsPage from './components/Layout/ContactUsPage';
import Login from './components/Auth/Login';
import Signup from './components/Auth/Signup';
import PasswordReset from './components/Auth/PasswordReset';
import AuthTest from './components/AuthTest';
import EventBooking from './components/Customer/EventBooking';
import Store from './components/Customer/Store';
import CustomerDashboard from './components/Customer/Dashboard';
import Profile from './components/Customer/Profile';
import AdminDashboard from './components/Admin/AdminDashboard';
import ManagerDashboard from './components/Manager/ManagerDashboard';
import ProtectedRoute from './components/ProtectedRoute';
import OurStoryPage from './components/Layout/OurStoryPage';
import ActivitiesPage from './components/Layout/ActivitiesPage';
import CartPage from './components/Layout/CartPage';

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
                <Route path="/signup" element={<Signup />} />
                <Route path="/auth-test" element={<AuthTest />} />
                <Route path="/reset-password" element={<PasswordReset />} />
                <Route path="/events" element={<EventBooking />} />
                <Route path="/store" element={<Store />} />
                <Route path="/ourstory" element={<OurStoryPage />} />
                <Route path="/contact" element={<ContactUsPage />} />
                <Route path="/activities" element={<ActivitiesPage />} />
                <Route path="/cart" element={<CartPage />} />
                <Route path="/art-making-activity.html" element={<ArtMakingActivityPage />} />
            <Route path="/slime-play.html" element={<SlimePlayPage />} />
            <Route path="/tufting-activity.html" element={<TuftingActivityPage />} />
                  <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                  <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
                  <Route path="/shipping-policy" element={<ShippingPolicy />} />
                  <Route path="/refund-policy" element={<RefundPolicy />} />
                <Route 
                  path="/dashboard" 
                  element={
                    <ProtectedRoute requiredRole="customer">
                      <CustomerDashboard />
                    </ProtectedRoute>
                  } 
                />
                <Route
                  path="/profile"
                  element={
                    <ProtectedRoute requiredRole="customer">
                      <Profile />
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