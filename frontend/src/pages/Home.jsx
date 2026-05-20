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

      const { data } = await API.get('/products');
      
      // Attach a stable random rating and review count to each product once on load
      const productsWithRatings = data.map(p => ({
        ...p,
        rating: (Math.random() * (5.0 - 3.8) + 3.8).toFixed(1),
        reviewsCount: Math.floor(Math.random() * 400) + 15
      }));
      setProducts(productsWithRatings);

    } catch (error) {
      console.error('Fetch failed:', error);
      setError('Failed to load menu. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

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
        <h1>Order Delicious Food Online</h1>
        <p>Experience the best and fastest food delivery service in town. Fresh, hot, and incredibly tasty meals delivered straight to your door.</p>
      </div>

      <div className="filters card">
        <input type="text" placeholder="🔍 Search for your favorite food..." value={search} onChange={e => setSearch(e.target.value)} className="search-input" />
        <div className="category-pills">
          <button className={`pill ${category === '' ? 'active' : ''}`} onClick={() => setCategory('')}>All</button>
          {categories.map(c => (
            <button key={c} className={`pill ${category === c ? 'active' : ''}`} onClick={() => setCategory(c)}>{c}</button>
          ))}
        </div>
      </div>

      {loading && (
        <div className="products-grid">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="skeleton-card animate-pulse">
              <div className="skeleton skeleton-img"></div>
              <div className="skeleton skeleton-title"></div>
              <div className="skeleton skeleton-price"></div>
              <div className="skeleton skeleton-btn"></div>
            </div>
          ))}
        </div>
      )}
      {error && <div className="empty-state" style={{ color: '#ef4444' }}>{error}</div>}
      
      {!loading && !error && (
      <div className="products-grid">
        {filteredProducts.length === 0 && <div className="empty-state">No dishes found matching your search.</div>}
        {filteredProducts.map(product => (
          <div key={product._id} className="product-card reveal" style={{ animationDelay: `${Math.random() * 0.2}s` }}>
            <Link to={`/product/${product._id}`}><img src={product.imageUrl} alt={product.name} className="product-image" /></Link>
            <div className="product-info">
              <Link to={`/product/${product._id}`}><h3 className="product-title">{product.name}</h3></Link>
                <div className="product-rating">
                  ⭐ {product.rating} <span>({product.reviewsCount} reviews)</span>
                </div>
              <p className="product-price">₹{product.price.toFixed(2)}</p>
              <button className="btn" disabled={product.stock <= 0} onClick={() => addToCart(product._id)}>{product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}</button>
            </div>
          </div>
        ))}
      </div>
      )}

      {/* 5. Customer Reviews Section */}
      <section className="container reveal">
        <h2 className="section-title">What Our Customers Say</h2>
        <p className="section-subtitle">Don't just take our word for it</p>
        <div className="reviews-section">
          <div className="review-card">
            <p className="review-text">"Absolutely the best food I've had in a long time! The delivery was incredibly fast and the food arrived piping hot."</p>
            <div className="review-author">
              <div className="review-avatar">S</div>
              <div className="author-info">
                <h4>Sarah Jenkins</h4>
                <p>Food Enthusiast</p>
              </div>
            </div>
          </div>
          <div className="review-card">
            <p className="review-text">"The app is so easy to use, and their spicy chicken burger is out of this world. Highly recommend!"</p>
            <div className="review-author">
              <div className="review-avatar">M</div>
              <div className="author-info">
                <h4>Michael Chen</h4>
                <p>Regular Customer</p>
              </div>
            </div>
          </div>
          <div className="review-card">
            <p className="review-text">"I love the variety of categories they offer. From South Indian to Pizzas, everything tastes authentic and premium."</p>
            <div className="review-author">
              <div className="review-avatar">P</div>
              <div className="author-info">
                <h4>Priya Sharma</h4>
                <p>Local Guide</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Footer Section */}
      <footer className="landing-footer reveal">
        <div className="footer-grid">
          <div className="footer-col">
            <h3>Emerald Bites</h3>
            <p>Delivering happiness, one meal at a time. Experience premium dining from the comfort of your home.</p>
          </div>
          <div className="footer-col">
            <h3>Quick Links</h3>
            <ul>
              <li><a href="#menu-section">Our Menu</a></li>
              <li><a href="#">About Us</a></li>
              <li><a href="#">Contact Support</a></li>
              <li><a href="#">Privacy Policy</a></li>
            </ul>
          </div>
          <div className="footer-col">
            <h3>Contact Us</h3>
            <ul>
              <li>📍 123 Culinary Street, Food City</li>
              <li>📞 +1 (555) 123-4567</li>
              <li>✉️ support@emeraldbites.com</li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} Emerald Bites. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};
export default Home;
