import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import { Palette, LogOut, User, ShoppingCart, Calendar, Settings, ChevronDown, Menu, X } from 'lucide-react';

const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const { branches, selectedBranch, setSelectedBranch } = useData();
  const [activitiesDropdown, setActivitiesDropdown] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setMobileMenu(false);
  };

  return (
    <header className="bg-white shadow-lg border-b-2 border-orange-200 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
             <img
      src="https://res.cloudinary.com/dwb3vztcv/image/upload/v1755159745/ARTGRAM_LOGO_zdhftc.png"
      alt="ArtGram Logo"
      className="h-20 w-auto pt-3"
    />
            
            <span className="text-4xl font-bold text-orange-600">Artgram</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-6">
            <Link to="/" className="text-gray-700 hover:text-orange-600 transition-colors">
              Home
            </Link>
            <div className="relative">
              <button
                onClick={() => setActivitiesDropdown(!activitiesDropdown)}
                className="flex items-center space-x-0 text-gray-700 hover:text-orange-600 transition-colors"
              >
                <span>Activities</span>
                <ChevronDown className="h-4 w-4" />
              </button>
              {activitiesDropdown && (
                <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 py-2 z-50">
                  <Link
                    to="/slime-play.html"
                    className="block px-4 py-2 text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors"
                    onClick={() => setActivitiesDropdown(false)}
                  >
                    Slime 
                  </Link>
                  <Link
                    to="/art-making-activity.html"
                    className="block px-4 py-2 text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors"
                    onClick={() => setActivitiesDropdown(false)}
                  >
                    Art Making
                  </Link>
                 
                  <Link
                    to="/tufting-activity.html"
                    className="block px-4 py-2 text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors"
                    onClick={() => setActivitiesDropdown(false)}
                  >
                    Tufting
                  </Link>
                </div>
              )}
            </div>
             <Link to="/events" className="text-gray-700 hover:text-orange-600 transition-colors">
              Events
            </Link>

                   <Link to="/" className="text-gray-700 hover:text-orange-600 transition-colors">
              Our Story
            </Link>
            
           
            
            {/* Activities Dropdown */}
            

            <Link to="/store" className="text-gray-700 hover:text-orange-600 transition-colors">
              Store
            </Link>

            <Link to="/contact" className="text-gray-700 hover:text-orange-600 transition-colors">
              Contact
            </Link>
            
        
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenu(!mobileMenu)}
            className="lg:hidden p-2 text-gray-700 hover:text-orange-600"
          >
            {mobileMenu ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>

          {/* User Actions */}
          <div className="hidden lg:flex items-center space-x-4">
            {user?.role === 'customer' && (
              <>
                <select
                  value={selectedBranch || ''}
                  onChange={(e) => setSelectedBranch(e.target.value || null)}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  <option value="">Select Branch</option>
                  {branches.map(branch => (
                    <option key={branch.id} value={branch.id}>
                      {branch.name}
                    </option>
                  ))}
                </select>
                <Link to="/store" className="text-gray-700 hover:text-orange-600 transition-colors">
                  <ShoppingCart className="h-6 w-6" />
                </Link>
              </>
            )}

            {user ? (
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <User className="h-5 w-5 text-gray-600" />
                  <span className="text-gray-700">{user.name}</span>
                </div>
                
                {user.role === 'admin' && (
                  <Link
                    to="/admin"
                    className="flex items-center space-x-1 px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                  >
                    <Settings className="h-4 w-4" />
                    <span>Admin</span>
                  </Link>
                )}
                
                {user.role === 'branch_manager' && (
                  <Link
                    to="/manager"
                    className="flex items-center space-x-1 px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                  >
                    <Calendar className="h-4 w-4" />
                    <span>Manager</span>
                  </Link>
                )}
                
                {user.role === 'customer' && (
                  <Link
                    to="/dashboard"
                    className="flex items-center space-x-1 px-3 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 transition-colors"
                  >
                    <User className="h-4 w-4" />
                    <span>Dashboard</span>
                  </Link>
                )}
                
                <button
                  onClick={logout}
                  className="flex items-center space-x-1 px-3 py-2 text-gray-700 hover:text-red-600 transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 transition-colors"
              >
                Login
              </Link>
            )}
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenu && (
          <div className="lg:hidden mt-4 pb-4 border-t border-gray-200">
            <div className="flex flex-col space-y-4 pt-4">
              <Link 
                to="/" 
                className="text-gray-700 hover:text-orange-600 transition-colors"
                onClick={() => setMobileMenu(false)}
              >
                Home
              </Link>
              <button 
                onClick={() => scrollToSection('about')}
                className="text-left text-gray-700 hover:text-orange-600 transition-colors"
              >
                About
              </button>
              <button 
                onClick={() => scrollToSection('products')}
                className="text-left text-gray-700 hover:text-orange-600 transition-colors"
              >
                Products
              </button>
              <Link 
                to="/events" 
                className="text-gray-700 hover:text-orange-600 transition-colors"
                onClick={() => setMobileMenu(false)}
              >
                Classes
              </Link>
              <button 
                onClick={() => scrollToSection('events')}
                className="text-left text-gray-700 hover:text-orange-600 transition-colors"
              >
                Events
              </button>
              <button 
                onClick={() => scrollToSection('studios')}
                className="text-left text-gray-700 hover:text-orange-600 transition-colors"
              >
                Studios
              </button>
              <Link 
                to="/store" 
                className="text-gray-700 hover:text-orange-600 transition-colors"
                onClick={() => setMobileMenu(false)}
              >
                Store
              </Link>
              <button 
                onClick={() => scrollToSection('testimonials')}
                className="text-left text-gray-700 hover:text-orange-600 transition-colors"
              >
                Testimonials
              </button>
              <button 
                onClick={() => scrollToSection('gallery')}
                className="text-left text-gray-700 hover:text-orange-600 transition-colors"
              >
                Gallery
              </button>
              <button 
                onClick={() => scrollToSection('contact')}
                className="text-left text-gray-700 hover:text-orange-600 transition-colors"
              >
                Contact
              </button>

              {/* Mobile User Actions */}
              {user?.role === 'customer' && (
                <div className="pt-4 border-t border-gray-200">
                  <select
                    value={selectedBranch || ''}
                    onChange={(e) => setSelectedBranch(e.target.value || null)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 mb-4"
                  >
                    <option value="">Select Branch</option>
                    {branches.map(branch => (
                      <option key={branch.id} value={branch.id}>
                        {branch.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {user ? (
                <div className="pt-4 border-t border-gray-200 space-y-4">
                  <div className="flex items-center space-x-2">
                    <User className="h-5 w-5 text-gray-600" />
                    <span className="text-gray-700">{user.name}</span>
                  </div>
                  
                  {user.role === 'admin' && (
                    <Link
                      to="/admin"
                      className="flex items-center space-x-1 px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                      onClick={() => setMobileMenu(false)}
                    >
                      <Settings className="h-4 w-4" />
                      <span>Admin Dashboard</span>
                    </Link>
                  )}
                  
                  {user.role === 'branch_manager' && (
                    <Link
                      to="/manager"
                      className="flex items-center space-x-1 px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                      onClick={() => setMobileMenu(false)}
                    >
                      <Calendar className="h-4 w-4" />
                      <span>Manager Dashboard</span>
                    </Link>
                  )}
                  
                  {user.role === 'customer' && (
                    <Link
                      to="/dashboard"
                      className="flex items-center space-x-1 px-3 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 transition-colors"
                      onClick={() => setMobileMenu(false)}
                    >
                      <User className="h-4 w-4" />
                      <span>My Dashboard</span>
                    </Link>
                  )}
                  
                  <button
                    onClick={() => {
                      logout();
                      setMobileMenu(false);
                    }}
                    className="flex items-center space-x-1 px-3 py-2 text-gray-700 hover:text-red-600 transition-colors"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Logout</span>
                  </button>
                </div>
              ) : (
                <div className="pt-4 border-t border-gray-200">
                  <Link
                    to="/login"
                    className="block w-full text-center px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 transition-colors"
                    onClick={() => setMobileMenu(false)}
                  >
                    Login
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;