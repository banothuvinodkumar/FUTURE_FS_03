import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';
import { toast } from 'react-toastify';

const Checkout = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [address, setAddress] = useState({ name: '', phone: '', street: '', city: '' });

  const navigate = useNavigate();

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const { data } = await API.get('/cart');
        setCartItems(data.items || []);
      } catch (error) {
        console.error(error);
        if (error.response && error.response.status === 401) {
          toast.info('Please log in to access checkout');
          navigate('/login');
        }
      }
    };
    fetchCart();
  }, [navigate]);

  const subtotal = cartItems.reduce((acc, item) => acc + ((item.product?.price || 0) * item.quantity), 0);
  const tax = subtotal * 0.05;
  const deliveryFee = subtotal > 0 ? 40 : 0;
  const total = subtotal + tax + deliveryFee;

  const placeOrder = async (e) => {
    if(e) e.preventDefault();
    if(!address.name || !address.phone || !address.street || !address.city) {
      return toast.error("Please fill in all delivery details.");
    }
    try {
      setLoading(true);
      // The backend securely fetches cart data and clears the cart automatically.
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
    <div className="page-wrapper animate-slide-up">
      <h2 className="page-title">Checkout</h2>
      
      {cartItems.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
          <p style={{ color: '#6b7280', fontSize: '1.2rem' }}>Your cart is empty. Please add items before checking out.</p>
        </div>
      ) : (
        <div className="checkout-wrapper">
          <div className="checkout-form-section">
            <form className="card mb-2" onSubmit={placeOrder}>
              <h3 style={{ color: '#05386b', marginBottom: '1.5rem', fontWeight: '800' }}>Delivery Details</h3>
              <div className="form-grid">
                <div className="form-group">
                  <input type="text" placeholder="Full Name" value={address.name} onChange={e => setAddress({...address, name: e.target.value})} required />
                </div>
                <div className="form-group">
                  <input type="tel" placeholder="Phone Number" value={address.phone} onChange={e => setAddress({...address, phone: e.target.value})} required />
                </div>
                <div className="form-group full-width">
                  <input type="text" placeholder="Street Address / Flat No." value={address.street} onChange={e => setAddress({...address, street: e.target.value})} required />
                </div>
                <div className="form-group full-width">
                  <input type="text" placeholder="City / Landmark" value={address.city} onChange={e => setAddress({...address, city: e.target.value})} required />
                </div>
              </div>
            </form>

            <div className="card">
              <h3 style={{ color: '#05386b', marginBottom: '1.5rem', fontWeight: '800' }}>Payment Method</h3>
              <div className="radio-options">
                <label className={`radio-option ${paymentMethod === 'cod' ? 'active' : ''}`}>
                  <input type="radio" name="payment" value="cod" checked={paymentMethod === 'cod'} onChange={() => setPaymentMethod('cod')} />
                  <span>💵 Cash on Delivery</span>
                </label>
                <label className={`radio-option ${paymentMethod === 'card' ? 'active' : ''}`}>
                  <input type="radio" name="payment" value="card" checked={paymentMethod === 'card'} onChange={() => setPaymentMethod('card')} />
                  <span>💳 Credit / Debit Card</span>
                </label>
              </div>
            </div>
          </div>

          <div className="checkout-summary-section card">
            <h3 style={{ color: '#05386b', marginBottom: '1.5rem', fontWeight: '800' }}>Order Summary</h3>
            
            <div className="mini-cart-list">
              {cartItems.map(item => (
                <div key={item._id} className="mini-cart-item">
                  <span>{item.quantity}x {item.product?.name || 'Item'}</span>
                  <span>₹{((item.product?.price || 0) * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>

            <div className="summary-divider"></div>
            <div className="summary-row"><span>Item Total</span> <span>₹{subtotal.toFixed(2)}</span></div>
            <div className="summary-row"><span>Taxes (5%)</span> <span>₹{tax.toFixed(2)}</span></div>
            <div className="summary-row"><span>Delivery Fee</span> <span>₹{deliveryFee.toFixed(2)}</span></div>
            <div className="summary-divider"></div>
            <div className="summary-row total"><span>To Pay</span> <span>₹{total.toFixed(2)}</span></div>
            
            <div className="delivery-time-badge">🕒 Estimated Delivery: 30-45 mins</div>

            <button className="btn btn-emerald-gradient btn-block" onClick={placeOrder} disabled={loading} style={{ marginTop: '1.5rem' }}>
              {loading ? 'Processing...' : `Place Order • ₹${total.toFixed(2)}`}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Checkout;