import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import API from '../services/api';
import { toast } from 'react-toastify';
import logo from '../assets/logo.png';

const Navbar = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  let user = null;
  try {
    user = JSON.parse(localStorage.getItem('userInfo'));
  } catch (error) {
    localStorage.removeItem('userInfo'); // clear bad data
  }

  useEffect(() => {
    const fetchCartCount = async () => {
      if (user) {
        try {
          const { data } = await API.get('/cart');
          const count = data.items?.reduce((acc, item) => acc + item.quantity, 0) || 0;
          setCartCount(count);
        } catch (error) {
          console.error("Failed to fetch cart count", error);
        }
      }
    };
    fetchCartCount();
  }, [user]);

  const handleLogout = (e) => {
    e.preventDefault();
    localStorage.removeItem('userInfo');
    toast.info('Logged out successfully 👋');
    setTimeout(() => {
      window.location.href = '/'; // Safely redirects to home and reloads to update the UI
    }, 1000);
  };

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">
        <img src={logo} alt="Emerald Bites Logo" className="navbar-logo" />
        Emerald Bites
      </Link>

      <div className="hamburger" onClick={() => setIsMenuOpen(!isMenuOpen)}>
        <span></span>
        <span></span>
        <span></span>
      </div>

      <div className={`navbar-links ${isMenuOpen ? 'active' : ''}`}>
        {user ? (
          <>
            <Link to="/">Menu</Link>
            <Link to="/orders">My Orders</Link>
            {user?.user?.role === 'admin' && (
              <Link to="/admin" className="nav-badge">Admin Dashboard</Link>
            )}
            
            <Link to="/cart" className="nav-cart-btn">
              🛒 Cart {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
            </Link>

            {/* Desktop: Avatar Dropdown */}
            <div className="profile-dropdown-container desktop-only">
              <button
                className="profile-avatar-btn"
                onClick={() => setIsProfileOpen(!isProfileOpen)}
              >
                {user?.user?.name?.charAt(0).toUpperCase()}
              </button>
              {isProfileOpen && (
                <div className="profile-dropdown">
                  <div className="dropdown-header">
                    <strong>{user?.user?.name}</strong>
                    <small>{user?.user?.email}</small>
                  </div>
                  <a href="#" onClick={handleLogout}>Logout</a>
                </div>
              )}
            </div>
            {/* Mobile: User Info Card */}
            <div className="mobile-user-profile mobile-only">
              <div className="mobile-user-info">
                <div className="profile-avatar-btn" style={{ flexShrink: 0 }}>
                  {user?.user?.name?.charAt(0).toUpperCase()}
                </div>
                <div className="mobile-user-details">
                  <strong>{user?.user?.name}</strong>
                  <small>{user?.user?.email}</small>
                </div>
              </div>
              <button onClick={handleLogout} className="btn btn-outline btn-block mobile-logout-btn">
                Logout
              </button>
            </div>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register" className="btn btn-sm">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
};
export default Navbar;