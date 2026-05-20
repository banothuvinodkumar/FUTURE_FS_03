import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';
import { toast } from 'react-toastify';

const Admin = () => {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [tab, setTab] = useState('overview');
  const [orderPage, setOrderPage] = useState(1);
  const [orderFilter, setOrderFilter] = useState('All');
  
  const [prodForm, setProdForm] = useState({ name: '', price: '', description: '', category: '', imageUrl: '', stock: '' });
  const [editId, setEditId] = useState(null);

  const navigate = useNavigate();
  let user = null;
  try {
    user = JSON.parse(localStorage.getItem('userInfo'));
  } catch (error) {
    // safely fallback if corrupted
  }

  useEffect(() => {
    if (!user || user?.user?.role !== 'admin') return navigate('/');
    fetchData();
  }, [navigate]);

  const fetchData = async () => {
    try {
      const [prodRes, ordRes] = await Promise.all([
        API.get('/products'),
        API.get('/orders/all')
      ]);
      setProducts(prodRes.data);
      // Sort orders to show newest first
      setOrders(ordRes.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
    } catch (error) {
      console.error('Error fetching admin data', error);
    }
  };

  const handleEditDish = (p) => {
    setEditId(p._id);
    setProdForm({ name: p.name, price: p.price, description: p.description, category: p.category, imageUrl: p.imageUrl, stock: p.stock });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAddOrUpdateDish = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        await API.put(`/products/${editId}`, prodForm);
        toast.success('Dish updated!');
        setEditId(null);
      } else {
        await API.post('/products', prodForm);
        toast.success('New dish added to menu!');
      }
      
      setProdForm({ name: '', price: '', description: '', category: '', imageUrl: '', stock: '' });
      fetchData();
    } catch (err) {
      toast.error('Failed to save dish');
    }
  };

  const processQuickRestock = async (p, amountStr) => {
    if (!amountStr) return;
    
    const amount = parseInt(amountStr, 10);
    if (isNaN(amount) || amount <= 0) {
      return toast.error('Please enter a valid positive number');
    }
    try {
      await API.put(`/products/${p._id}`, { stock: p.stock + amount });
      toast.success(`Successfully restocked ${p.name} by ${amount} portions!`);
      fetchData();
    } catch (err) {
      toast.error('Failed to restock dish');
    }
  };

  const handleQuickRestock = (p) => {
    const toastId = toast.info(
      <div>
        <p style={{ margin: '0 0 10px 0', color: '#374151' }}>
          How many portions of "{p.name}" would you like to add to the current stock of {p.stock}?
        </p>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <input type="number" id={`restock-input-${p._id}`} defaultValue="10" min="1" style={{ width: '70px', padding: '0.3rem', border: '1px solid rgba(5, 56, 107, 0.2)', borderRadius: '4px' }} />
          <button className="btn btn-success btn-sm" onClick={() => {
            const val = document.getElementById(`restock-input-${p._id}`).value;
            toast.dismiss(toastId);
            processQuickRestock(p, val);
          }}>Restock</button>
          <button className="btn btn-outline btn-sm" style={{ background: 'white' }} onClick={() => toast.dismiss(toastId)}>Cancel</button>
        </div>
      </div>,
      { autoClose: false, closeOnClick: false, closeButton: false }
    );
  };

  const processDeleteDish = async (id) => {
    try {
      await API.delete(`/products/${id}`);
      toast.info('Dish removed from menu');
      fetchData();
    } catch (err) {
      toast.error('Failed to delete dish');
    }
  };

  const handleDeleteDish = (id) => {
    const toastId = toast.warn(
      <div>
        <p style={{ margin: '0 0 10px 0', color: '#374151' }}>Are you sure you want to remove this dish from the menu?</p>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button className="btn btn-danger btn-sm" onClick={() => { toast.dismiss(toastId); processDeleteDish(id); }}>Yes, Remove</button>
          <button className="btn btn-outline btn-sm" style={{ background: 'white' }} onClick={() => toast.dismiss(toastId)}>Cancel</button>
        </div>
      </div>,
      { autoClose: false, closeOnClick: false, closeButton: false }
    );
  };

  const handleUpdateOrderStatus = async (id, status) => {
    try {
      await API.put(`/orders/${id}`, { status });
      toast.success('Order status updated');
      fetchData();
    } catch (err) {
      toast.error('Failed to update status');
    }
  };

  // Filtering & Pagination logic for orders
  const ordersPerPage = 10;
  const filteredOrders = orderFilter === 'All' ? orders : orders.filter(o => o.status === orderFilter);
  const totalOrderPages = Math.ceil(filteredOrders.length / ordersPerPage);
  const currentOrders = filteredOrders.slice((orderPage - 1) * ordersPerPage, orderPage * ordersPerPage);

  return (
    <div className="page-wrapper animate-fade-in">
      <div className="admin-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <h2 className="page-title" style={{ marginBottom: 0, color: '#05386b', fontWeight: '800' }}>Restaurant POS Dashboard</h2>
        <div  className="card admin-user-card" style={{ padding: '1rem', display: 'flex', gap: '1rem', alignItems: 'center', margin: 0, boxShadow: '0 8px 32px 0 rgba(5, 56, 107, 0.08)' }}>
          <div style={{ width: '45px', height: '45px', background: '#05386b', color: '#5cdb95', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '1.4rem' }}>
            {user?.user?.name?.charAt(0).toUpperCase()}
          </div>
          <div>
            <div style={{ fontWeight: 'bold', fontSize: '1.1rem', color: '#05386b' }}>{user?.user?.name} <span className="badge delivered" style={{ marginLeft: '0.5rem', fontSize: '0.7rem' }}>Manager</span></div>
            <div style={{ fontSize: '0.9rem', color: '#379683' }}>{user?.user?.email}</div>
          </div>
        </div>
      </div>

      <div className="admin-tabs">
        <button className={`btn ${tab === 'overview' ? '' : 'btn-outline'}`} onClick={() => setTab('overview')}>Overview</button>
        <button className={`btn ${tab === 'menu' ? '' : 'btn-outline'}`} onClick={() => setTab('menu')}>Manage Menu</button>
        <button className={`btn ${tab === 'orders' ? '' : 'btn-outline'}`} onClick={() => setTab('orders')}>Manage Orders</button>
      </div>

      {tab === 'overview' && (
        <div className="admin-section">
          <div className="stats-section" style={{ marginBottom: '2rem' }}>
            <div className="stat-card">
              <div className="stat-num">₹{orders.filter(o => o.status !== 'Pending').reduce((acc, o) => acc + o.totalAmount, 0).toFixed(2)}</div>
              <div className="stat-label">Total Revenue</div>
            </div>
            <div className="stat-card">
              <div className="stat-num">{orders.length}</div>
              <div className="stat-label">Total Orders</div>
            </div>
            <div className="stat-card">
              <div className="stat-num">{products.length}</div>
              <div className="stat-label">Active Dishes</div>
            </div>
            <div className="stat-card">
              <div className="stat-num">{orders.filter(o => o.status === 'Pending' || o.status === 'Preparing').length}</div>
              <div className="stat-label">Active Orders</div>
            </div>
          </div>

          <div className="card">
            <h3 style={{ color: '#05386b', marginBottom: '1.5rem', fontWeight: '800' }}>Recent Orders</h3>
            <div className="table-responsive">
              <table>
                <thead>
                  <tr>
                    <th>Order ID</th><th>User</th><th>Total</th><th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.slice(0, 5).map(o => (
                    <tr key={o._id}>
                      <td style={{ fontWeight: '700', color: '#379683' }}>{o._id.substring(o._id.length - 8)}</td>
                      <td style={{ fontWeight: '600' }}>{o.user?.name ?? o.user?.email ?? 'Unknown Customer'}</td>
                      <td style={{ fontWeight: '600' }}>₹{o.totalAmount.toFixed(2)}</td>
                      <td><span className={`badge ${o.status.toLowerCase().replace(/\s+/g, '-')}`}>{o.status}</span></td>
                    </tr>
                  ))}
                  {orders.length === 0 && (
                    <tr><td colSpan="4" style={{ textAlign: 'center', padding: '2rem', color: '#6b7280' }}>No recent orders.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {tab === 'menu' && (
        <div className="admin-section">
          <form className="card mb-2 form-grid" onSubmit={handleAddOrUpdateDish}>
            <h3 style={{ color: '#05386b', marginBottom: '1.5rem', fontWeight: '800', gridColumn: '1 / -1' }}>{editId ? 'Edit Dish' : 'Add New Dish'}</h3>
            <div className="form-group"><input type="text" placeholder="Dish Name" value={prodForm.name} onChange={e => setProdForm({...prodForm, name: e.target.value})} required /></div>
            <div className="form-group"><input type="number" placeholder="Price (₹)" value={prodForm.price} onChange={e => setProdForm({...prodForm, price: e.target.value})} required /></div>
            <div className="form-group"><input type="text" placeholder="Category (e.g. Starters)" value={prodForm.category} onChange={e => setProdForm({...prodForm, category: e.target.value})} required /></div>
            <div className="form-group"><input type="text" placeholder="Image URL" value={prodForm.imageUrl} onChange={e => setProdForm({...prodForm, imageUrl: e.target.value})} required /></div>
            <div className="form-group"><input type="number" placeholder="Stock / Portions" value={prodForm.stock} onChange={e => setProdForm({...prodForm, stock: e.target.value})} required /></div>
            <div className="form-group full-width"><textarea placeholder="Dish Description" value={prodForm.description} onChange={e => setProdForm({...prodForm, description: e.target.value})} required /></div>
            <div className="form-group full-width" style={{ display: 'flex', gap: '1rem' }}>
              <button type="submit" className="btn btn-emerald-gradient" style={{ flex: 1 }}>{editId ? 'Update Dish' : 'Add Dish to Menu'}</button>
              {editId && <button type="button" className="btn btn-outline" style={{ flex: 1 }} onClick={() => { setEditId(null); setProdForm({ name: '', price: '', description: '', category: '', imageUrl: '', stock: '' }); }}>Cancel Edit</button>}
            </div>
          </form>

          <div className="table-responsive card">
            <h3 style={{ color: '#05386b', marginBottom: '1.5rem', fontWeight: '800' }}>Menu Items</h3>
            <table>
              <thead>
                <tr>
                  <th>Dish</th><th>Name</th><th>Price</th><th>Portions</th><th>Action</th>
                </tr>
              </thead>
              <tbody>
                {products.map(p => (
                  <tr key={p._id}>
                    <td><img src={p.imageUrl} alt={p.name} width="60" style={{borderRadius:'8px', objectFit: 'cover', height: '60px', boxShadow: '0 2px 10px rgba(5,56,107,0.1)'}} /></td>
                    <td style={{ fontWeight: '600', color: '#05386b' }}>{p.name}</td>
                    <td style={{ fontWeight: '600', color: '#379683' }}>₹{p.price}</td>
                    <td>{p.stock}</td>
                    <td>
                      <div className="action-buttons" style={{display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap'}}>
                        <button className="btn btn-success btn-sm" onClick={() => handleQuickRestock(p)}>Restock</button>
                        <button className="btn btn-sm" style={{ background: '#05386b', color: 'white' }} onClick={() => handleEditDish(p)}>Edit</button>
                        <button className="btn btn-danger btn-sm" onClick={() => handleDeleteDish(p._id)}>Remove</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === 'orders' && (
        <div className="admin-section card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
            <h3 style={{ color: '#05386b', margin: 0, fontWeight: '800' }}>Live Order Management</h3>
            <select 
              value={orderFilter} 
              onChange={(e) => { setOrderFilter(e.target.value); setOrderPage(1); }}
              style={{ padding: '0.6rem 1rem', borderRadius: '8px', border: '1px solid rgba(5, 56, 107, 0.2)', color: '#05386b', fontWeight: '600', backgroundColor: '#edf5e1', cursor: 'pointer', width: 'auto' }}
            >
              <option value="All">All Orders</option>
              <option value="Pending">Pending</option>
              <option value="Preparing">Preparing</option>
              <option value="Out for Delivery">Out for Delivery</option>
              <option value="Delivered">Delivered</option>
            </select>
          </div>
          <div className="table-responsive">
            <table>
              <thead>
                <tr>
                  <th>Order ID</th><th>Customer</th><th>Total Bill</th><th>Status</th><th>Action</th>
                </tr>
              </thead>
              <tbody>
              {currentOrders.map(o => (
                  <tr key={o._id}>
                    <td style={{ fontWeight: '700', color: '#379683' }}>{o._id.substring(o._id.length - 8)}</td>
                    <td style={{ fontWeight: '600' }}>{o.user?.name ?? o.user?.email ?? 'Unknown Customer'}</td>
                    <td style={{ fontWeight: '600' }}>₹{o.totalAmount.toFixed(2)}</td>
                    <td><span className={`badge ${o.status.toLowerCase().replace(/\s+/g, '-')}`}>{o.status}</span></td>
                    <td>
                      <select value={o.status} onChange={(e) => handleUpdateOrderStatus(o._id, e.target.value)} className="status-select">
                        <option value="Pending">Pending</option>
                        <option value="Preparing">Preparing</option>
                        <option value="Out for Delivery">Out for Delivery</option>
                        <option value="Delivered">Delivered</option>
                      </select>
                    </td>
                  </tr>
                ))}
              {currentOrders.length === 0 && (
                  <tr><td colSpan="5" style={{ textAlign: 'center', padding: '2rem', color: '#6b7280' }}>No orders found.</td></tr>
                )}
              </tbody>
            </table>
          
          {filteredOrders.length > ordersPerPage && (
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.5rem 1rem 0.5rem' }}>
              <button className="btn btn-sm btn-outline" disabled={orderPage === 1} onClick={() => setOrderPage(orderPage - 1)}>Previous</button>
              <span style={{ fontWeight: '600', color: '#05386b' }}>Page {orderPage} of {totalOrderPages}</span>
              <button className="btn btn-sm btn-outline" disabled={orderPage === totalOrderPages} onClick={() => setOrderPage(orderPage + 1)}>Next</button>
            </div>
          )}
          </div>
        </div>
      )}
    </div>
  );
};
export default Admin;
