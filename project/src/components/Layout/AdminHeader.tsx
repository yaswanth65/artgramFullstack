import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import DiscountBar from './DiscountBar';
import { LogOut } from 'lucide-react';

const AdminHeader: React.FC = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const isActive = (paths: string[]) => paths.includes(location.pathname);
  // Uppercase nav option styling added
  const linkBase = 'text-black hover:text-[#6B4396] px-3 py-2 rounded-md uppercase';
  const activeLink = 'text-[#7F55B1] font-semibold';

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <>
      <DiscountBar />
      <nav className="sticky top-0 inset-x-0 z-[1030] shadow-sm" style={{ backgroundColor: '#fdf7f6' }}>
        <div className="mx-auto max-w-7xl px-4">
          <div className="flex items-center justify-between h-16 sm:h-[86px]">
            {/* Left: Logo */}
            <div className="flex items-center gap-4">
              <Link to="/" className="flex items-center no-underline">
                <img src="https://res.cloudinary.com/dwb3vztcv/image/upload/v1755159745/ARTGRAM_LOGO_zdhftc.png" alt="ArtGram Logo" className="h-10 sm:h-14 w-auto" />
                <span className="ml-3 font-bold text-xl sm:text-2xl" style={{ color: '#7F55B1' }}>ArtGram</span>
              </Link>
            </div>

            {/* Desktop Nav */}
            <div className="hidden md:flex md:items-center md:gap-4">
              <Link to="/" className={`${linkBase} ${isActive(['/', '/index.html']) ? activeLink : ''}`}>HOME</Link>
              <Link to="/admin" className={`${linkBase} ${isActive(['/admin']) ? activeLink : ''}`}>DASHBOARD</Link>
            </div>

            {/* Right actions */}
            <div className="flex items-center gap-2">
              {user && (
                <button
                  onClick={handleLogout}
                  className="hidden md:inline-flex items-center gap-2 rounded-full bg-white border border-gray-200 text-gray-700 px-3 py-2 font-semibold hover:bg-gray-100 transition-all"
                >
                  <LogOut className="w-4 h-4" /> <span className="uppercase">LOGOUT</span>
                </button>
              )}
              <button
                aria-label="Toggle menu"
                onClick={() => setOpen(v => !v)}
                className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-[#7F55B1] hover:bg-gray-100 focus:outline-none"
              >
                <span className="text-2xl leading-none">⋮</span>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {open && (
          <div className="md:hidden border-t border-gray-100 bg-white">
            <div className="px-4 py-3 space-y-1">
              <Link onClick={() => setOpen(false)} to="/" className={`${linkBase} block ${isActive(['/', '/index.html']) ? activeLink : ''}`}>HOME</Link>
              <Link onClick={() => setOpen(false)} to="/admin" className={`${linkBase} block ${isActive(['/admin']) ? activeLink : ''}`}>DASHBOARD</Link>
              {user && (
                <button
                  onClick={() => { handleLogout(); setOpen(false); }}
                  className="mt-2 w-full text-left px-3 py-2 rounded-md bg-gray-50 hover:bg-gray-100 text-gray-700 text-sm font-medium"
                ><span className="uppercase">LOGOUT</span></button>
              )}
            </div>
          </div>
        )}
      </nav>
    </>
  );
};

export default AdminHeader;
