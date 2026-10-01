import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav style={{
      background: '#ffffff',
      borderBottom: '1px solid #e5e7eb',
      padding: '14px 32px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      boxShadow: '0 1px 3px rgba(0,0,0,0.04)'
    }}>
      <Link to="/" style={{
        textDecoration: 'none',
        fontSize: '22px',
        fontWeight: '700',
        color: '#1f2937',
        display: 'flex',
        alignItems: 'center',
        gap: '8px'
      }}>
        🛒 ShopSphere
      </Link>

      <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
        <Link to="/" style={{ textDecoration: 'none', color: '#4b5563', fontWeight: '500' }}>
          Products
        </Link>

        <Link to="/cart" style={{ textDecoration: 'none', color: '#4b5563', fontWeight: '500' }}>
          🛍️ Cart
        </Link>

        {user && (
          <Link to="/orders" style={{ textDecoration: 'none', color: '#4b5563', fontWeight: '500' }}>
            📦 My Orders
          </Link>
        )}

        {user?.role === 'ADMIN' && (
          <Link to="/admin" style={{ textDecoration: 'none', color: '#4b5563', fontWeight: '500' }}>
            ⚙️ Admin
          </Link>
        )}

        {user ? (
          <>
            <span style={{ color: '#6b7280', fontSize: '14px' }}>
              Hi, <b>{user.username}</b>
            </span>
            <button
              onClick={handleLogout}
              style={{
                background: '#ef4444',
                color: 'white',
                border: 'none',
                padding: '8px 18px',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: '600',
                fontSize: '14px'
              }}
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" style={{
              textDecoration: 'none',
              color: '#2563eb',
              fontWeight: '600'
            }}>
              Login
            </Link>
            <Link to="/register" style={{
              textDecoration: 'none',
              background: '#2563eb',
              color: 'white',
              padding: '8px 18px',
              borderRadius: '8px',
              fontWeight: '600',
              fontSize: '14px'
            }}>
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}