import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';
import { toast } from 'react-toastify';

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const { data } = await API.get('/cart');
        setCartItems(data.items || []);
      } catch (error) {
        console.error(error);
        // If unauthorized, redirect to login
        if (error.response && error.response.status === 401) {
          navigate('/login');
        }
      }
    };
    fetchCart();
  }, [navigate]);

  const removeFromCart = async (id) => {
    try {
      await API.delete(`/cart/${id}`);
      setCartItems(cartItems.filter(item => item._id !== id));
      toast.info('Item removed from cart');
    } catch (error) {
      console.error(error);
      toast.error('Failed to remove item');
    }
  };

  const updateQuantity = async (productId, quantity) => {
    if (quantity < 1) return;
    try {
      await API.post(`/cart`, { productId, quantity, action: 'update' });
      setCartItems(cartItems.map(item => item.product._id === productId ? { ...item, quantity } : item));
    } catch (error) {
      console.error(error);
    }
  };

  const total = cartItems.reduce((acc, item) => acc + ((item.product?.price || 0) * item.quantity), 0);

  return (
    <div className="page-wrapper">
      <h2 className="page-title">Your Cart</h2>
      {cartItems.length === 0 ? <p>Cart is empty</p> : (
        <div className="cart-container">
          <div className="cart-list">
          {cartItems.map(item => (
            <div key={item._id} className="cart-item">
              <div className="cart-item-info">
                <h4>{item.product?.name || 'Product Unavailable'}</h4>
                <div className="qty-controls">
                  <button onClick={() => updateQuantity(item.product?._id, item.quantity - 1)} className="btn btn-sm btn-outline" disabled={!item.product}>-</button>
                  <span className="qty-badge">{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.product?._id, item.quantity + 1)} className="btn btn-sm btn-outline" disabled={!item.product}>+</button>
                </div>
              </div>
              <div className="cart-item-action">
                <span className="price">₹{((item.product?.price || 0) * item.quantity).toFixed(2)}</span>
                <button onClick={() => removeFromCart(item._id)} className="btn btn-danger btn-sm">Remove</button>
              </div>
          </div>
          ))}
          </div>
          <div className="cart-summary card">
            <h3>Order Summary</h3>
            <div className="summary-row"><span>Total Items:</span> <span>{cartItems.reduce((acc, item) => acc + item.quantity, 0)}</span></div>
            <div className="summary-row total"><span>Total:</span> <span>₹{total.toFixed(2)}</span></div>
            <button onClick={() => navigate('/checkout')} className="btn btn-success btn-block" style={{marginTop: '1.5rem'}}>Proceed to Checkout</button>
          </div>
        </div>
      )}
    </div>
  );
};
export default Cart;