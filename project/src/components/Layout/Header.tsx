import React, { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import { LogOut } from 'lucide-react';

// localStorage cart key
const CART_KEY = 'cart_items';

const Header: React.FC = () => {
  const { user, logout } = useAuth();
  useData(); // keep for future needs

  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const desktopDropdownRef = useRef<HTMLDivElement | null>(null);
  const [cartCount, setCartCount] = useState(0);

  // simple class helpers
  const linkBase = 'text-gray-700 hover:text-orange-600 px-3 py-2 rounded-md';
  const activeLink = 'text-orange-600 font-semibold';
  const isActive = (paths: string[]) => paths.includes(location.pathname);

  // update cart count from localStorage
  const updateCartCount = () => {
    try {
      const raw = localStorage.getItem(CART_KEY);
      const items = raw ? JSON.parse(raw) : [];
      const count = items.reduce((s: number, i: { qty?: number }) => s + (i.qty || 1), 0);
      setCartCount(count);
    } catch {
      setCartCount(0);
    }
  };

  // close menus on route change
  useEffect(() => {
    setOpen(false);
    updateCartCount();
  }, [location.pathname]);

  // click outside handler to close dropdowns (kept minimal)
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (desktopDropdownRef.current && !desktopDropdownRef.current.contains(e.target as Node)) {
        /* no-op for now */
      }
    };
    document.addEventListener('click', handler);
    return () => document.removeEventListener('click', handler);
  }, []);

  // keep cart count in sync across tabs and via custom events
  useEffect(() => {
    updateCartCount();
    const storageHandler = (e: StorageEvent) => {
      if (e.key === CART_KEY) updateCartCount();
    };
    // custom event dispatched in other parts of the app
  const custom = () => updateCartCount();
    window.addEventListener('storage', storageHandler as EventListener);
    window.addEventListener('app_data_updated', custom as EventListener);
    return () => {
      window.removeEventListener('storage', storageHandler as EventListener);
      window.removeEventListener('app_data_updated', custom as EventListener);
    };
  }, []);

  return (
    <nav id="universalNavbar" className="sticky top-0 inset-x-0 z-[1030] bg-white shadow-sm">
      <div className="mx-auto max-w-7xl px-4">
        <div className="flex items-center justify-between h-[86px]">
          <div className="flex items-center gap-4">
            <Link to="/" className="flex items-center no-underline">
              <img src="https://res.cloudinary.com/dwb3vztcv/image/upload/v1755159745/ARTGRAM_LOGO_zdhftc.png" alt="ArtGram Logo" className="h-14 w-auto" />
              <span className="ml-3 text-2xl font-bold text-orange-600">ArtGram</span>
            </Link>
          </div>

          <div className="hidden md:flex md:items-center md:gap-4">
            <Link to="/" className={`${linkBase} ${isActive(['/', '/index.html']) ? activeLink : ''}`}>Home</Link>
            <Link to="/activities" className={`${linkBase} ${isActive(['/activities']) ? activeLink : ''}`}>Activities</Link>
            <Link to="/events" className={`${linkBase} ${isActive(['/events']) ? activeLink : ''}`}>Events</Link>
            <Link to="/store" className={`${linkBase} ${isActive(['/store']) ? activeLink : ''}`}>Store</Link>
            <Link to="/ourstory" className={`${linkBase} ${isActive(['/ourstory']) ? activeLink : ''}`}>Our Story</Link>
            <Link to="/contact" className={`${linkBase} ${isActive(['/contact']) ? activeLink : ''}`}>Contact</Link>
          </div>

          <div className="flex items-center gap-3">
            <Link to="/cart" className="relative inline-flex items-center no-underline">
              <span className="ml-2 text-gray-600">🛒</span>
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">{cartCount}</span>
              )}
            </Link>

            {!user && (
              <Link to="/login" className="ml-2 inline-block rounded-full bg-orange-600 text-white px-4 py-2 font-semibold hover:bg-orange-700 transition-all no-underline">Login</Link>
            )}

            {user && (
              <>
                <Link to={user.role === 'admin' ? '/admin' : user.role === 'branch_manager' ? '/manager' : '/dashboard'} className="ml-2 inline-block rounded-full bg-orange-600 text-white px-4 py-2 font-semibold hover:bg-orange-700 transition-all no-underline">Dashboard</Link>
                <button onClick={() => { logout(); navigate('/'); }} className="ml-2 inline-flex items-center gap-2 rounded-full bg-white border border-gray-200 text-gray-700 px-3 py-2 font-semibold hover:bg-gray-100 transition-all"><LogOut className="w-4 h-4" />Logout</button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div id="mobile-menu" className="md:hidden border-t border-gray-100 bg-white">
          <div className="px-4 py-3 space-y-1">
            <Link to="/" className={`${linkBase} block ${isActive(['/', '/index.html']) ? activeLink : ''}`}>Home</Link>
            <Link to="/activities" className={`${linkBase} block ${isActive(['/activities']) ? activeLink : ''}`}>Activities</Link>
            <Link to="/events" className={`${linkBase} block ${isActive(['/events']) ? activeLink : ''}`}>Events</Link>
            <Link to="/store" className={`${linkBase} block ${isActive(['/store']) ? activeLink : ''}`}>Store</Link>
            <Link to="/ourstory" className={`${linkBase} block ${isActive(['/ourstory']) ? activeLink : ''}`}>Our Story</Link>
            <Link to="/contact" className={`${linkBase} block ${isActive(['/contact']) ? activeLink : ''}`}>Contact</Link>
            <div className="mt-3">
              <Link to="/cart" className="block text-sm text-gray-700">Cart {cartCount > 0 && <span className="ml-1 text-xs text-red-600">({cartCount})</span>}</Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Header;