import React, { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import { useCart } from '../../contexts/CartContext';
import { LogOut } from 'lucide-react';
import DiscountBar from './DiscountBar';

const Header: React.FC = () => {
  const { user, logout } = useAuth();
  useData(); // keep for future needs

  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  // separated dropdown state for activities
  const [desktopDropdownOpen, setDesktopDropdownOpen] = useState(false);
  const [mobileDropdownOpen, setMobileDropdownOpen] = useState(false);
  const location = useLocation();
  const desktopDropdownRef = useRef<HTMLDivElement | null>(null);
  const { totalItems, isLoading } = useCart();

  // simple class helpers
  // make nav option text use the requested purple color and a slightly darker hover
  // Added uppercase so all nav options display in capital letters
  const linkBase = 'text-black hover:text-[#6B4396] px-3 py-2 rounded-md uppercase';
  const activeLink = 'text-[#7F55B1] font-semibold';
  const isActive = (paths: string[]) => paths.includes(location.pathname);

  // close menus on route change
  useEffect(() => {
    setOpen(false);
    setDesktopDropdownOpen(false);
    setMobileDropdownOpen(false);
  }, [location.pathname]);

  // click outside handler to close desktop dropdown
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (desktopDropdownRef.current && !desktopDropdownRef.current.contains(e.target as Node)) {
        setDesktopDropdownOpen(false);
      }
    };
    document.addEventListener('click', handler);
    return () => document.removeEventListener('click', handler);
  }, []);

  // Show cart icon for all users (guest + logged-in)
  const showCartIcon = true;
  const cartCount = totalItems;

  return (
    <>
      <DiscountBar />
      <nav id="universalNavbar" className="sticky top-0 inset-x-0 z-[1030]  shadow-sm" style={{ backgroundColor: '#fdf7f6' }}>
      <div className="mx-auto max-w-7xl px-4">
    <div className="flex items-center justify-between h-16 sm:h-[86px]">
          <div className="flex items-center gap-4">
            <Link to="/" className="flex items-center no-underline">
              <img src="https://res.cloudinary.com/dwb3vztcv/image/upload/v1755159745/ARTGRAM_LOGO_zdhftc.png" alt="ArtGram Logo" className="h-10 sm:h-14 w-auto" />
              {/* Show name also on mobile (slightly smaller) */}
              <span className="ml-3 font-bold text-xl sm:text-2xl" style={{ color: '#7F55B1' }}>Artgram</span>
            </Link>
            
          </div>
          <div className="hidden md:flex md:items-center md:gap-4">
            <Link to="/" className={`${linkBase} ${isActive(['/', '/index.html']) ? activeLink : ''}`}>HOME</Link>
            <div className="relative" ref={desktopDropdownRef}>
              <button
                type="button"
                aria-haspopup="true"
                aria-expanded={desktopDropdownOpen}
                onClick={() => setDesktopDropdownOpen((v) => !v)}
                className={`${linkBase} inline-flex items-center`}
              >
                ACTIVITIES
                <svg className="ml-1 h-4 w-4 transition-transform" style={{ transform: desktopDropdownOpen ? 'rotate(180deg)' : 'none' }} viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 12a1 1 0 0 1-.707-.293l-4-4A1 1 0 1 1 6.707 6.293L10 9.586l3.293-3.293A1 1 0 1 1 14.707 7.707l-4 4A1 1 0 0 1 10 12z" clipRule="evenodd" />
                </svg>
              </button>
              {desktopDropdownOpen && (
                <div className="absolute left-0 top-full mt-2 w-72 rounded-lg bg-white shadow-xl ring-1 ring-black/5 p-2">
  <Link to="/slime-play.html" className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-purple-600 hover:text-white transition-colors no-underline">
    <div className="w-9 h-9 rounded-full bg-yellow-400 flex items-center justify-center text-lg">🌈</div>
    <div className="min-w-0">
      <h5 className="font-semibold text-lg">Slime</h5>
      <p className="text-sm opacity-80">Create colorful, stretchy slime</p>
    </div>
  </Link>

  <Link to="/art-making-activity.html" className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-purple-600 hover:text-white transition-colors no-underline">
    <div className="w-9 h-9 rounded-full bg-yellow-400 flex items-center justify-center text-lg">🎨</div>
    <div className="min-w-0">
      <h6 className="font-semibold text-lg">Art Making</h6>
      <p className="text-sm opacity-80">Express creativity through painting</p>
    </div>
  </Link>

  <Link to="/tufting-activity.html" className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-purple-600 hover:text-white transition-colors no-underline">
    <div className="w-9 h-9 rounded-full bg-yellow-400 flex items-center justify-center text-lg">🧶</div>
    <div className="min-w-0">
      <h6 className="font-semibold text-lg">Tufting Experience</h6>
      <p className="text-sm opacity-80">Create rugs & wall hangings</p>
    </div>
  </Link>

</div>
              )}
            </div>
            <Link to="/events" className={`${linkBase} ${isActive(['/events']) ? activeLink : ''}`}>EVENTS</Link>
            <Link to="/store" className={`${linkBase} ${isActive(['/store']) ? activeLink : ''}`}>STORE</Link>
            <Link to="/ourstory" className={`${linkBase} ${isActive(['/ourstory']) ? activeLink : ''}`}>OUR STORY</Link>
            <Link to="/contact" className={`${linkBase} ${isActive(['/contact']) ? activeLink : ''}`}>CONTACT</Link>
          </div>

          <div className="flex items-center gap-3">

      {/* Cart Icon - visible for guests and logged users */}
      {showCartIcon && (
        <Link to="/cart" className="ml-0 sm:ml-2 inline-flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1 sm:py-2 rounded-md text-slate-900 hover:text-rose-600 no-underline">
          <span className="text-lg" role="img" aria-label="cart">🛒</span>
          {!isLoading && (
            <span className="text-xs font-medium text-gray-700">
              {cartCount > 0 ? cartCount : 0}
            </span>
          )}
        </Link>
      )}

            {!user && (
              <Link to="/login" className="ml-2 inline-block rounded-full text-white px-3 py-1 text-sm sm:px-4 sm:py-2 font-semibold transition-all no-underline bg-[#7F55B1] hover:bg-[#6B4396]">LOGIN</Link>
            )}

            {/* Mobile menu toggle moved to right side (after Login / Dashboard) */}
            <button
              aria-label="Toggle menu"
              onClick={() => setOpen(v => !v)}
              className="md:hidden ml-1 inline-flex items-center justify-center p-2 rounded-md text-[#7F55B1] hover:bg-gray-100 focus:outline-none"
            >
              <span className="text-2xl leading-none">⋮</span>
            </button>


            {user && (
  <>
    <Link
      to={
        user.role === 'admin'
          ? '/admin'
          : user.role === 'branch_manager'
          ? '/manager'
          : '/dashboard'
      }
      className="ml-2 inline-block rounded-full text-white px-4 py-2 font-semibold transition-all no-underline"
      style={{ backgroundColor: '#7F55B1' }}
      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#6B4396')}
      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#7F55B1')}
    >
  DASHBOARD
    </Link>

    <button
      onClick={() => {
        logout();
        navigate('/');
      }}
      className="ml-2 inline-flex items-center gap-2 rounded-full bg-white border border-gray-200 text-gray-700 px-3 py-2 font-semibold hover:bg-gray-100 transition-all"
    >
      <LogOut className="w-4 h-4" />
  <span className="uppercase">LOGOUT</span>
    </button>
  </>
)}

          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div id="mobile-menu" className="md:hidden border-t border-gray-100 bg-white">
          <div className="px-4 py-3 space-y-1">
            <Link to="/" className={`${linkBase} block ${isActive(['/', '/index.html']) ? activeLink : ''}`}>HOME</Link>
            <div className="pt-2">
              <button
                aria-haspopup="true"
                aria-expanded={mobileDropdownOpen}
                aria-controls="mobile-activities-submenu"
                onClick={() => setMobileDropdownOpen((v) => !v)}
                className={`${linkBase} inline-flex items-center w-full justify-between`}
              >
                ACTIVITIES
                <svg className="ml-1 h-4 w-4 transition-transform" style={{ transform: mobileDropdownOpen ? 'rotate(180deg)' : 'none' }} viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 12a1 1 0 0 1-.707-.293l-4-4A1 1 0 1 1 6.707 6.293L10 9.586l3.293-3.293A1 1 0 1 1 14.707 7.707l-4 4A1 1 0 0 1 10 12z" clipRule="evenodd" />
                </svg>
              </button>
              {mobileDropdownOpen && (
                <div id="mobile-activities-submenu" className="mt-2 space-y-1 rounded-md border border-gray-200 p-2">
                  <Link to="/slime-play.html" className="block px-3 py-2 rounded-md hover:bg-gray-50 no-underline">🌈 Slime</Link>
                  <Link to="/art-making-activity.html" className="block px-3 py-2 rounded-md hover:bg-gray-50 no-underline">🎨 Art Making</Link>
                  <Link to="/tufting-activity.html" className="block px-3 py-2 rounded-md hover:bg-gray-50 no-underline">🧶 Tufting Experience</Link>
                </div>
              )}
            </div>
            <Link to="/events" className={`${linkBase} block ${isActive(['/events']) ? activeLink : ''}`}>EVENTS</Link>
            <Link to="/store" className={`${linkBase} block ${isActive(['/store']) ? activeLink : ''}`}>STORE</Link>
            <Link to="/ourstory" className={`${linkBase} block ${isActive(['/ourstory']) ? activeLink : ''}`}>OUR STORY</Link>
            <Link to="/contact" className={`${linkBase} block ${isActive(['/contact']) ? activeLink : ''}`}>CONTACT</Link>

            {/* Dashboard / Auth Actions */}
            {!user && (
              <Link to="/login" className={`${linkBase} block ${isActive(['/login']) ? activeLink : ''}`}>LOGIN</Link>
            )}
            {user && (
              <>
                <Link
                  to={user.role === 'admin' ? '/admin' : user.role === 'branch_manager' ? '/manager' : '/dashboard'}
                  className={`${linkBase} block ${isActive(['/admin','/manager','/dashboard']) ? activeLink : ''}`}
                >
                  DASHBOARD
                </Link>
                {/* Quick role specific shortcuts */}
                {user.role === 'admin' && (
                  <div className="mt-2 pl-3 space-y-1 text-sm border-l border-purple-200">
                    <Link to="/admin#sessions" className="block hover:text-[#6B4396] no-underline">Manage Sessions</Link>
                    <Link to="/admin#products" className="block hover:text-[#6B4396] no-underline">Products</Link>
                    <Link to="/admin#analytics" className="block hover:text-[#6B4396] no-underline">Analytics</Link>
                  </div>
                )}
                {user.role === 'branch_manager' && (
                  <div className="mt-2 pl-3 space-y-1 text-sm border-l border-purple-200">
                    <Link to="/manager#sessions" className="block hover:text-[#6B4396] no-underline">Sessions</Link>
                    <Link to="/manager#qr" className="block hover:text-[#6B4396] no-underline">QR Verify</Link>
                  </div>
                )}
                <button
                  onClick={() => { logout(); setOpen(false); navigate('/'); }}
                  className="mt-3 w-full text-left px-3 py-2 rounded-md bg-gray-50 hover:bg-gray-100 text-gray-700 text-sm font-medium"
                ><span className="uppercase">LOGOUT</span></button>
              </>
            )}
            
            {/* Mobile Cart Link */}
            {showCartIcon && (
              <div className="mt-3">
                <Link to="/cart" className="block text-sm text-gray-700">
                  CART {!isLoading && <span className="ml-1 text-xs text-red-600">({cartCount > 0 ? cartCount : 0})</span>}
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
    </>
  );
};

export default Header;