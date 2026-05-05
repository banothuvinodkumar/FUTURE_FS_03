import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';
import { toast } from 'react-toastify';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError('');
      
      // POST request to login API
     const { data } = await API.post('/auth/login', { email, password });
      
      // Save JWT token and user info in localStorage
      localStorage.setItem('userInfo', JSON.stringify(data));
      
      // Redirect to home/store and refresh to update navbar
      window.location.href = '/';
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Invalid email or password';
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card checkout-card" style={{ maxWidth: '400px', margin: '2rem auto' }}>
      <h2 style={{ marginBottom: '1rem' }}>Welcome Back</h2>
      {error && <p style={{ color: '#ef4444', marginBottom: '1rem' }}>{error}</p>}
      <form onSubmit={submitHandler}>
        <div className="form-group"><input type="email" placeholder="Email Address" value={email} onChange={e => setEmail(e.target.value)} required /></div>
        <div className="form-group"><input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required /></div>
        <button type="submit" className="btn btn-success btn-block" disabled={loading}>
          {loading ? 'Logging in...' : 'Sign In'}
        </button>
      </form>
    </div>
  );
};
export default Login;
