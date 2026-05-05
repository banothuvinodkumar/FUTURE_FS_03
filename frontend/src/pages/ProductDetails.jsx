import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../services/api';
import { toast } from 'react-toastify';

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await API.get(`/products/${id}`);
        setProduct(data);
      } catch (error) {
        console.error('Error fetching product details', error);
      }
    };
    fetchProduct();
  }, [id]);

  const addToCart = async () => {
    try {
      await API.post('/cart', { productId: product._id, quantity: 1 });
      toast.success('Added to cart!');
      navigate('/cart');
    } catch (error) {
      console.error(error);
      toast.error('Please login to add items to your cart.');
    }
  };

  if (!product) return <div>Loading...</div>;

  return (
    <div className="product-details-container card">
      <img src={product.imageUrl} alt={product.name} className="details-image" />
      <div className="details-info">
        <h2>{product.name}</h2>
        <span className="badge category-badge">{product.category}</span>
        <h3 className="price details-price">₹{product.price.toFixed(2)}</h3>
        <p className="description">{product.description}</p>
        <p className="stock">{product.stock > 0 ? `In Stock: ${product.stock}` : 'Out of Stock'}</p>
        <button className="btn btn-success btn-block" disabled={product.stock <= 0} onClick={addToCart}>Add to Cart</button>
      </div>
    </div>
  );
};
export default ProductDetails;