import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  let user = null;
  try {
    user = JSON.parse(localStorage.getItem('userInfo'));
  } catch (error) {
    localStorage.removeItem('userInfo'); // clear bad data
  }

  const handleLogout = (e) => {
    e.preventDefault();
    localStorage.removeItem('userInfo');
    window.location.href = '/'; // Safely redirects to home and reloads to update the UI
  };

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">🛍️ IndustryEcom</Link>
      <div className="navbar-links">
        {user ? (
          <>
            {user?.user?.role === 'admin' && (
              <Link to="/admin" className="nav-badge">Admin Dashboard</Link>
            )}
            <Link to="/">Store</Link>
            <Link to="/cart" className="nav-cart-btn">🛒 Cart</Link>
            <Link to="/orders">My Orders</Link>
            
            <span className="greeting">Hi, {user?.user?.name}</span>
            <a href="#" onClick={handleLogout}>Logout</a>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
};
export default Navbar;