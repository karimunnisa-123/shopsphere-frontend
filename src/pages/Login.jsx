import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(username, password);
      toast.success('🎉 Welcome back!');
      navigate('/');
    } catch (err) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      display: 'flex', justifyContent: 'center', alignItems: 'center',
      minHeight: 'calc(100vh - 70px)', padding: '20px'
    }}>
      <div style={{
        background: 'white', padding: '40px', borderRadius: '16px',
        boxShadow: '0 10px 40px rgba(0,0,0,0.08)', width: '100%', maxWidth: '420px'
      }}>
        <h1 style={{ textAlign: 'center', marginTop: 0, color: '#1f2937' }}>Login</h1>
        <p style={{ textAlign: 'center', color: '#6b7280', marginTop: '-10px' }}>
          Welcome back to ShopSphere
        </p>

        {error && (
          <div style={{
            background: '#fee2e2', color: '#b91c1c', padding: '10px 14px',
            borderRadius: '8px', marginBottom: '16px', fontSize: '14px'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <label style={{ display: 'block', fontSize: '13px', color: '#4b5563', marginBottom: '4px' }}>Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            style={{
              width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #d1d5db',
              marginBottom: '16px', boxSizing: 'border-box', fontSize: '15px'
            }}
          />

          <label style={{ display: 'block', fontSize: '13px', color: '#4b5563', marginBottom: '4px' }}>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{
              width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #d1d5db',
              marginBottom: '24px', boxSizing: 'border-box', fontSize: '15px'
            }}
          />

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%', padding: '13px', background: '#2563eb', color: 'white',
              border: 'none', borderRadius: '8px', fontSize: '16px', fontWeight: '600',
              cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.6 : 1
            }}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <p style={{ textAlign: 'center', color: '#6b7280', fontSize: '14px', marginTop: '20px' }}>
          Need an account? <Link to="/register" style={{ color: '#2563eb' }}>Register</Link>
        </p>
      </div>
    </div>
  );
}