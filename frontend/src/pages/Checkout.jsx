import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';
import { toast } from 'react-toastify';

const Checkout = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const { data } = await API.get('/cart');
        setCartItems(data.items || []);
      } catch (error) {
        console.error(error);
        if (error.response && error.response.status === 401) {
          navigate('/login');
        }
      }
    };
    fetchCart();
  }, [navigate]);

  const total = cartItems.reduce((acc, item) => acc + ((item.product?.price || 0) * item.quantity), 0);

  const placeOrder = async () => {
    try {
      setLoading(true);
      // The backend securely fetches cart data and clears the cart automatically
      await API.post('/orders', {});
      toast.success('Order placed successfully! 🎉');
      navigate('/orders'); // Redirect to order tracking page
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card checkout-card" style={{ maxWidth: '500px', margin: '2rem auto', textAlign: 'center' }}>
      <h2 className="page-title">Checkout Summary</h2>
      {cartItems.length > 0 ? (
        <>
          <p className="summary-text" style={{ fontSize: '1.1rem', color: '#4b5563' }}>You have {cartItems.length} items in your cart.</p>
          <h3 className="summary-total" style={{ fontSize: '1.8rem', color: '#10b981', margin: '2rem 0' }}>Total Amount: ₹{total.toFixed(2)}</h3>
          <button className="btn btn-success btn-block" onClick={placeOrder} disabled={loading || cartItems.length === 0} style={{ width: '100%', padding: '1rem', fontSize: '1.1rem' }}>
            {loading ? 'Placing Order...' : 'Place Order'}
          </button>
        </>
      ) : (
        <p style={{ marginTop: '2rem', color: '#6b7280' }}>Your cart is empty. Please add items before checking out.</p>
      )}
    </div>
  );
};

export default Checkout;