import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';
import { toast } from 'react-toastify';

const Admin = () => {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [tab, setTab] = useState('products');
  
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
        API.get('/orders')
      ]);
      setProducts(prodRes.data);
      setOrders(ordRes.data);
    } catch (error) {
      console.error('Error fetching admin data', error);
    }
  };

  const handleEditProduct = (p) => {
    setEditId(p._id);
    setProdForm({ name: p.name, price: p.price, description: p.description, category: p.category, imageUrl: p.imageUrl, stock: p.stock });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAddOrUpdateProduct = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        await API.put(`/products/${editId}`, prodForm);
        toast.success('Product updated!');
        setEditId(null);
      } else {
        await API.post('/products', prodForm);
        toast.success('Product added!');
      }
      
      setProdForm({ name: '', price: '', description: '', category: '', imageUrl: '', stock: '' });
      fetchData();
    } catch (err) {
      toast.error('Failed to save product');
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
      toast.success(`Successfully restocked ${p.name} by ${amount} units!`);
      fetchData();
    } catch (err) {
      toast.error('Failed to restock product');
    }
  };

  const handleQuickRestock = (p) => {
    const toastId = toast.info(
      <div>
        <p style={{ margin: '0 0 10px 0', color: '#374151' }}>
          How many units of "{p.name}" would you like to add to the current stock of {p.stock}?
        </p>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <input type="number" id={`restock-input-${p._id}`} defaultValue="10" min="1" style={{ width: '70px', padding: '0.3rem', border: '1px solid #d1d5db', borderRadius: '4px' }} />
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

  const processDeleteProduct = async (id) => {
    try {
      await API.delete(`/products/${id}`);
      toast.info('Product deleted');
      fetchData();
    } catch (err) {
      toast.error('Failed to delete');
    }
  };

  const handleDeleteProduct = (id) => {
    const toastId = toast.warn(
      <div>
        <p style={{ margin: '0 0 10px 0', color: '#374151' }}>Are you sure you want to delete this product?</p>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button className="btn btn-danger btn-sm" onClick={() => { toast.dismiss(toastId); processDeleteProduct(id); }}>Yes, Delete</button>
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

  return (
    <div className="page-wrapper">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <h2 className="page-title" style={{ marginBottom: 0 }}>Admin Dashboard</h2>
        <div className="card" style={{ padding: '1rem', display: 'flex', gap: '1rem', alignItems: 'center', margin: 0, boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
          <div style={{ width: '45px', height: '45px', background: '#4f46e5', color: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '1.4rem' }}>
            {user?.user?.name?.charAt(0).toUpperCase()}
          </div>
          <div>
            <div style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>{user?.user?.name} <span className="badge delivered" style={{ marginLeft: '0.5rem', fontSize: '0.7rem' }}>Admin Role</span></div>
            <div style={{ fontSize: '0.9rem', color: '#6b7280' }}>{user?.user?.email}</div>
          </div>
        </div>
      </div>

      <div className="admin-tabs">
        <button className={`btn ${tab === 'products' ? 'btn-primary' : 'btn-outline'}`} onClick={() => setTab('products')}>Manage Products</button>
        <button className={`btn ${tab === 'orders' ? 'btn-primary' : 'btn-outline'}`} onClick={() => setTab('orders')}>Manage Orders</button>
      </div>

      {tab === 'products' && (
        <div className="admin-section">
          <form className="card mb-2 form-grid" onSubmit={handleAddOrUpdateProduct}>
            <h3>{editId ? 'Edit Product' : 'Add New Product'}</h3>
            <input type="text" placeholder="Name" value={prodForm.name} onChange={e => setProdForm({...prodForm, name: e.target.value})} required />
            <input type="number" placeholder="Price" value={prodForm.price} onChange={e => setProdForm({...prodForm, price: e.target.value})} required />
            <input type="text" placeholder="Category" value={prodForm.category} onChange={e => setProdForm({...prodForm, category: e.target.value})} required />
            <input type="text" placeholder="Image URL" value={prodForm.imageUrl} onChange={e => setProdForm({...prodForm, imageUrl: e.target.value})} required />
            <input type="number" placeholder="Stock" value={prodForm.stock} onChange={e => setProdForm({...prodForm, stock: e.target.value})} required />
            <textarea placeholder="Description" value={prodForm.description} onChange={e => setProdForm({...prodForm, description: e.target.value})} required className="full-width" />
            <button type="submit" className="btn btn-success">{editId ? 'Update Product' : 'Add Product'}</button>
            {editId && <button type="button" className="btn btn-outline" onClick={() => { setEditId(null); setProdForm({ name: '', price: '', description: '', category: '', imageUrl: '', stock: '' }); }}>Cancel Edit</button>}
          </form>

          <div className="table-responsive card">
            <table>
              <thead>
                <tr>
                  <th>Image</th><th>Name</th><th>Price</th><th>Stock</th><th>Action</th>
                </tr>
              </thead>
              <tbody>
                {products.map(p => (
                  <tr key={p._id}>
                    <td><img src={p.imageUrl} alt={p.name} width="50" style={{borderRadius:'4px'}} /></td>
                    <td>{p.name}</td><td>₹{p.price}</td><td>{p.stock}</td>
                    <td style={{display: 'flex', gap: '0.5rem'}}>
                      <button className="btn btn-success btn-sm" onClick={() => handleQuickRestock(p)}>Restock</button>
                      <button className="btn btn-primary btn-sm" onClick={() => handleEditProduct(p)}>Edit</button>
                      <button className="btn btn-danger btn-sm" onClick={() => handleDeleteProduct(p._id)}>Delete</button>
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
          <h3>All Orders</h3>
          <div className="table-responsive">
            <table>
              <thead>
                <tr>
                  <th>Order ID</th><th>User</th><th>Total</th><th>Status</th><th>Action</th>
                </tr>
              </thead>
              <tbody>
                {orders.map(o => (
                  <tr key={o._id}>
                    <td>{o._id.substring(o._id.length - 8)}</td>
                    <td>{o.user?.email ?? 'N/A'}</td>
                    <td>₹{o.totalAmount.toFixed(2)}</td>
                    <td><span className={`badge ${o.status.toLowerCase()}`}>{o.status}</span></td>
                    <td>
                      <select value={o.status} onChange={(e) => handleUpdateOrderStatus(o._id, e.target.value)} className="status-select">
                        <option value="Pending">Pending</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Delivered">Delivered</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
export default Admin;
