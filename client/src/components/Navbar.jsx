import { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useSearchParams, useNavigate } from 'react-router-dom';
import { ShoppingBag, User as UserIcon, Search, Heart, X, Menu } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useUser } from '../context/UserContext';
import api from '../api/client';


const Navbar = () => {
  const { user } = useUser();
  const { cartCount, toggleCart } = useCart();
  const { wishlist } = useWishlist();
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [localSearch, setLocalSearch] = useState(searchParams.get('search') || '');
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [suggestions, setSuggestions] = useState([]);

  // Sync local search with URL ONLY when searchParams change from outside (like back button)
  useEffect(() => {
    const urlSearch = searchParams.get('search') || '';
    if (urlSearch !== localSearch) {
      setLocalSearch(urlSearch);
    }
  }, [searchParams]);

  // Loading Bar Logic
  useEffect(() => {
    setLoadingProgress(30);
    const timer = setTimeout(() => setLoadingProgress(100), 400);
    const resetTimer = setTimeout(() => setLoadingProgress(0), 700);
    return () => {
      clearTimeout(timer);
      clearTimeout(resetTimer);
    };
  }, [location.pathname]);

  // Autocomplete Logic
  useEffect(() => {
    const timer = setTimeout(() => {
      if (localSearch && localSearch.length >= 2) {
        api.get(`/products?search=${localSearch}`)
          .then(res => setSuggestions(res.data.slice(0, 5)))
          .catch(console.error);
      } else {
        setSuggestions([]);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [localSearch]);

  const firstName = (user?.username || 'Customer').split(' ')[0].toUpperCase();

  // Close menu on route change
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  const handleSearchChange = (e) => {
    setLocalSearch(e.target.value);
  };

  const handleSearchSubmit = (e) => {
    if (e) e.preventDefault();
    if (location.pathname !== '/') {
      navigate(localSearch ? `/?search=${encodeURIComponent(localSearch)}` : '/');
    } else {
      const params = Object.fromEntries(searchParams.entries());
      if (localSearch) params.search = localSearch;
      else delete params.search;
      setSearchParams(params);
    }
    setIsSearchFocused(false);
  };

  const clearSearch = () => {
    setLocalSearch('');
    if (location.pathname !== '/') {
      navigate('/');
      return;
    }

    const nextParams = new URLSearchParams(searchParams);
    nextParams.delete('search');
    setSearchParams(nextParams);
  };

  return (
    <header style={{ position: 'sticky', top: 0, zIndex: 1000, background: 'var(--bg-primary)' }}>
      {/* Loading Bar */}
      {loadingProgress > 0 && (
        <div className="loading-bar" style={{ width: `${loadingProgress}%` }} />
      )}

      {/* Announcement Ticker */}
      {location.pathname === '/' && (
        <div className="announcement-bar">
          <div className="ticker-wrapper">
            <div className="ticker-item">FREE SHIPPING ON ALL ORDERS</div>
            <div className="ticker-item">NEW DROP: URBAN WINTER COLLECTION</div>
            <div className="ticker-item">USE CODE AURA10 FOR 10% OFF</div>
            {/* Duplicate for seamless loop */}
            <div className="ticker-item">FREE SHIPPING ON ALL ORDERS</div>
            <div className="ticker-item">NEW DROP: URBAN WINTER COLLECTION</div>
            <div className="ticker-item">USE CODE AURA10 FOR 10% OFF</div>
            {/* Triplicate to be safe on ultra-wide screens */}
            <div className="ticker-item">FREE SHIPPING ON ALL ORDERS</div>
            <div className="ticker-item">NEW DROP: URBAN WINTER COLLECTION</div>
            <div className="ticker-item">USE CODE AURA10 FOR 10% OFF</div>
          </div>
        </div>
      )}

      {/* Main Navbar */}
      <nav className="navbar" style={{ borderBottom: '1px solid var(--border-color)', background: 'var(--bg-primary)' }}>
        <div className="container nav-content">
          {/* Hamburger (Mobile Only) */}
          <button className="hamburger" onClick={() => setIsMenuOpen(true)} aria-label="Open menu">
            <Menu size={24} color="var(--text-primary)" />
          </button>

          {/* Logo Section */}
          <div className="logo-left">
            <Link to="/" style={{ fontSize: '28px', fontWeight: '900', color: '#e11b23', letterSpacing: '-1.5px', textDecoration: 'none' }}>
              AURA STORE
            </Link>
          </div>

          {/* Desktop Search Bar - Hidden on Mobile */}
          <form onSubmit={handleSearchSubmit} className={`search-pill ${isSearchFocused ? 'focused' : ''}`} style={{ background: 'var(--ss-light-grey)' }}>
            <button type="submit" className="icon-button-plain" style={{ padding: 0 }}>
              <Search size={18} color={isSearchFocused ? "var(--text-primary)" : "#888"} />
            </button>
            <input
              type="text"
              name="global_search"
              autoComplete="off"
              spellCheck="false"
              value={localSearch}
              onChange={handleSearchChange}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
              placeholder="Search for products..."
              style={{ background: 'none', border: 'none', outline: 'none', width: '100%', fontSize: '13px', fontWeight: '500', color: 'var(--text-primary)' }}
            />
            {localSearch && (
              <button type="button" className="icon-button-plain" onClick={clearSearch} aria-label="Clear search">
                <X size={17} color="var(--text-primary)" />
              </button>
            )}

            {/* Search Suggestions Dropdown */}
            {isSearchFocused && suggestions.length > 0 && (
              <div className="search-suggestions">
                {suggestions.map(p => (
                  <Link
                    key={p.id}
                    to={`/product/${p.id}`}
                    className="suggestion-item"
                    onClick={() => {
                      setSuggestions([]);
                      setIsSearchFocused(false);
                    }}
                  >
                    <img src={p.image || FALLBACK_IMAGE} alt={p.name} />
                    <div>
                      <p className="suggestion-name">{p.name}</p>
                      <p className="suggestion-price">{formatPrice(p.price)}</p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Right Icons row */}
          <div className="nav-icons" style={{ color: 'var(--text-primary)' }}>
            <Link to={user ? "/profile" : "/login"} title="Account" style={{ color: 'inherit', textDecoration: 'none' }}>
              {user ? (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', lineHeight: 1 }}>
                  <span style={{ fontSize: '10px', fontWeight: '800', color: '#e11b23' }}>HELLO,</span>
                  <span style={{ fontSize: '11px', fontWeight: '800' }}>{firstName}</span>
                </div>
              ) : (
                <UserIcon size={24} strokeWidth={1.5} />
              )}
            </Link>

            <Link to="/wishlist" title="Wishlist" className="cart-icon-wrapper">
              <Heart size={24} strokeWidth={1.5} fill={wishlist.length > 0 ? "rgba(225, 27, 35, 0.1)" : "none"} color={wishlist.length > 0 ? "#e11b23" : "currentColor"} />
              {wishlist.length > 0 && <span className="cart-count" style={{ background: '#212121' }}>{wishlist.length}</span>}
            </Link>

            <div onClick={() => toggleCart(true)} className="cart-icon-wrapper" title="Shopping Bag" style={{ cursor: 'pointer' }}>
              <ShoppingBag size={24} strokeWidth={1.5} />
              <span className="cart-count">{cartCount}</span>
            </div>
          </div>
        </div>
      </nav>

      {/* Search Overlay removed */}

      {/* Mobile Sidebar Menu */}
      <div className={`mobile-overlay ${isMenuOpen ? 'active' : ''}`} onClick={() => setIsMenuOpen(false)} />
      <div className={`mobile-menu ${isMenuOpen ? 'active' : ''}`}>
        <button className="mobile-menu-close" onClick={() => setIsMenuOpen(false)} aria-label="Close menu">
          <X size={22} />
        </button>

        <div className="mobile-nav-links">
          <Link to="/">HOME</Link>
          <Link to="/?gender=Men">MEN</Link>
          <Link to="/?gender=Women">WOMEN</Link>
          <hr style={{ border: 'none', borderTop: '1px solid #eee', margin: '10px 0' }} />
          <Link to={user ? "/profile" : "/login"}>{user ? "MY PROFILE" : "SIGN IN"}</Link>
          <Link to="/wishlist">WISHLIST ({wishlist.length})</Link>
          {user && <Link to="/settings">SETTINGS</Link>}
          <div onClick={() => toggleCart(true)} style={{ color: '#111', fontWeight: '800', fontSize: '18px', cursor: 'pointer' }}>SHOPPING BAG ({cartCount})</div>
          <Link to="/track-order">TRACK ORDER</Link>
        </div>

        {/* Search in Mobile Menu - Moved to bottom */}
        <form onSubmit={handleSearchSubmit} className="search-pill" style={{ display: 'flex', marginTop: 'auto', padding: '12px 24px', flex: 'none', width: '100%', minWidth: 'auto', height: '48px' }}>
          <button type="submit" className="icon-button-plain" style={{ padding: 0 }}>
            <Search size={18} color="#888" />
          </button>
          <input
            type="text"
            value={localSearch}
            onChange={handleSearchChange}
            placeholder="Search products..."
            style={{ background: 'none', border: 'none', outline: 'none', width: '100%', fontSize: '14px' }}
          />
        </form>
      </div>
    </header>
  );
};

export default Navbar;
