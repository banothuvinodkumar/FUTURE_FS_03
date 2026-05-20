import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';
import { toast } from 'react-toastify';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const { data } = await API.get('/orders');
        setOrders(data);
      } catch (err) {
        console.error(err);
        if (err.response?.status === 401) {
          toast.error('Session expired. Please log in again.');
          navigate('/login');
        } else {
          setError('Failed to load your orders. Please try again later.');
          toast.error('Failed to load orders');
        }
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [navigate]);

  const getTrackingStep = (status) => {
    if (status === 'Delivered') return 4;
    if (status === 'Out for Delivery') return 3;
    if (status === 'Preparing') return 2;
    return 1; // Pending
  };

  const processDeleteOrder = async (id) => {
    try {
      await API.delete(`/orders/${id}`);
      setOrders(prev => prev.filter(order => order._id !== id));
      toast.success('Order deleted and stock restored!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete order');
    }
  };

  const handleDeleteOrder = (id) => {
    const toastId = toast.warn(
      <div>
        <p style={{ margin: '0 0 10px 0', color: '#374151' }}>Are you sure you want to cancel and delete this order?</p>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button className="btn btn-danger btn-sm" onClick={() => { toast.dismiss(toastId); processDeleteOrder(id); }}>Yes, Delete</button>
          <button className="btn btn-outline btn-sm" style={{ background: 'white' }} onClick={() => toast.dismiss(toastId)}>Cancel</button>
        </div>
      </div>,
      { autoClose: false, closeOnClick: false, closeButton: false }
    );
  };

  return (
    <div className="page-wrapper">
      <h2 className="page-title">My Orders</h2>
      
      {loading && <p>Loading your orders...</p>}
      {error && <p style={{ color: '#ef4444' }}>{error}</p>}
      
      {!loading && !error && orders.length === 0 ? (
        <p className="empty-state">You have no orders yet.</p>
      ) : (
        <div className="grid-stack">
          {orders.map(order => (
            <div key={order._id} className="card order-card">
              <div className="order-header">
                <span className="order-id">Order ID: {order._id.substring(order._id.length - 8)}</span>
                <span className={`badge ${order.status.toLowerCase().replace(/\s+/g, '-')}`}>{order.status}</span>
              </div>
              
              <div className="tracking-wrapper">
                <div className="tracking-background-line"></div>
                <div className="tracking-progress-line" style={{ width: getTrackingStep(order.status) === 1 ? '0%' : getTrackingStep(order.status) === 2 ? '33.33%' : getTrackingStep(order.status) === 3 ? '66.66%' : '100%' }}></div>
                <div className="tracking-step">
                  <div className={`step-circle ${getTrackingStep(order.status) >= 1 ? 'active' : ''}`}>1</div>
                  <span className="step-label">Pending</span>
                </div>
                <div className="tracking-step">
                  <div className={`step-circle ${getTrackingStep(order.status) >= 2 ? 'active' : ''}`}>2</div>
                  <span className="step-label">Preparing</span>
                </div>
                <div className="tracking-step">
                  <div className={`step-circle ${getTrackingStep(order.status) >= 3 ? 'active' : ''}`}>3</div>
                  <span className="step-label">Out for Delivery</span>
                </div>
                <div className="tracking-step">
                  <div className={`step-circle ${getTrackingStep(order.status) === 4 ? 'active' : ''}`}>4</div>
                  <span className="step-label">Delivered</span>
                </div>
              </div>

              <div className="order-body">
                <ul>
                  {order.products.map(p => (
                    <li key={p._id}>{p.name || p.product?.name || 'Product Unavailable'} (x{p.quantity})</li>
                  ))}
                </ul>
              </div>
              <div className="order-footer" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem' }}>
                {order.status === 'Pending' ? (
                  <button className="btn btn-danger btn-sm" onClick={() => handleDeleteOrder(order._id)}>Delete Order</button>
                ) : (
                  <span style={{ fontSize: '0.85rem', color: '#6b7280' }}>Order {order.status}</span>
                )}
                <strong>Total: ₹{order.totalAmount.toFixed(2)}</strong>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;