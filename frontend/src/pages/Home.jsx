import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../services/api';
import { toast } from 'react-toastify';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

useEffect(() => {
  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError('');

      const { data } = await API.get('/api/products');
      setProducts(data);

    } catch (err) {
      console.log("First attempt failed, retrying in 3s...");

      // 🔁 Retry after 3 seconds (Render wakes up)
      setTimeout(async () => {
        try {
          const { data } = await API.get('/products');
          setProducts(data);
          setError('');
        } catch (error) {
          console.error('Retry failed:', error);
          setError('Failed to load products. Please try again later.');
        } finally {
          setLoading(false);
        }
      }, 3000);

      return;
    }

    setLoading(false);
  };

  // 🔥 Wake up backend instantly
  fetch("https://ecommarce-b7lq.onrender.com");

  fetchProducts();
}, []);
  const addToCart = async (productId) => {
    try {
      await API.post('/cart', { productId, quantity: 1 });
      toast.success('Added to cart!');
    } catch (error) {
      console.error(error);
      toast.error('Please login to add items to your cart.');
    }
  };

  // Get unique categories
  const categories = [...new Set(products.map(p => p.category))];

  // Apply filters
  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(search.toLowerCase()) && 
    (category ? p.category === category : true)
  );

  return (
    <div className="page-wrapper">
      <div className="hero">
        <h1>Discover Your Next Favorite Thing</h1>
        <p>Shop the best industry-level products at unbeatable prices.</p>
      </div>

      <div className="filters card">
        <input type="text" placeholder="🔍 Search for products..." value={search} onChange={e => setSearch(e.target.value)} className="search-input" />
        <div className="category-pills">
          <button className={`pill ${category === '' ? 'active' : ''}`} onClick={() => setCategory('')}>All</button>
          {categories.map(c => (
            <button key={c} className={`pill ${category === c ? 'active' : ''}`} onClick={() => setCategory(c)}>{c}</button>
          ))}
        </div>
      </div>

      {loading && (
        <div className="empty-state" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
          <svg width="40" height="40" viewBox="0 0 50 50" stroke="#4f46e5">
            <g fill="none" fillRule="evenodd" strokeWidth="4">
              <circle cx="25" cy="25" r="20" strokeOpacity=".3" />
              <path d="M25 5c0 0 0 0 0 0a20 20 0 0 1 20 20">
                <animateTransform attributeName="transform" type="rotate" from="0 25 25" to="360 25 25" dur="1s" repeatCount="indefinite" />
              </path>
            </g>
          </svg>
          Loading products...
        </div>
      )}
      {error && <div className="empty-state" style={{ color: '#ef4444' }}>{error}</div>}
      
      {!loading && !error && (
      <div className="products-grid">
        {filteredProducts.length === 0 && <div className="empty-state">No products found</div>}
        {filteredProducts.map(product => (
          <div key={product._id} className="product-card">
            <Link to={`/product/${product._id}`}><img src={product.imageUrl} alt={product.name} className="product-image" /></Link>
            <div className="product-info">
              <Link to={`/product/${product._id}`}><h3 className="product-title">{product.name}</h3></Link>
              <p className="product-price">₹{product.price.toFixed(2)}</p>
              <button className="btn" disabled={product.stock <= 0} onClick={() => addToCart(product._id)}>{product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}</button>
            </div>
          </div>
        ))}
      </div>
      )}
    </div>
  );
};
export default Home;
