import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { api } from '../api';
import { toast } from 'react-toastify';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);

  useEffect(() => {
    api.getProduct(id)
      .then(data => setProduct(data))
      .catch(() => toast.error('Product not found'))
      .finally(() => setLoading(false));
  }, [id]);
    const addToCart = () => {
    const username = localStorage.getItem('user')
      ? JSON.parse(localStorage.getItem('user')).username
      : 'guest';
    const cartKey = `cart_${username}`;

    const cart = JSON.parse(localStorage.getItem(cartKey) || '[]');
    const existing = cart.find(item => item.id === product.id);
    if (existing) {
      existing.qty += qty;
    } else {
      cart.push({
        id: product.id,
        name: product.name,
        price: product.price,
        imageBase64: product.imageBase64,
        qty
      });
    }
    localStorage.setItem(cartKey, JSON.stringify(cart));
    toast.success(`🛒 Added ${qty} × ${product.name} to cart`);
    navigate('/cart');
  };

  if (loading) return <div style={{ padding: '40px' }}>Loading...</div>;
  if (!product) return <div style={{ padding: '40px' }}>Product not found.</div>;

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '30px 20px' }}>
      <Link to="/" style={{ color: '#2563eb', textDecoration: 'none', fontWeight: '600' }}>
        ← Back to products
      </Link>

      <div style={{
        display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px',
        marginTop: '20px', background: 'white', padding: '32px',
        borderRadius: '20px', boxShadow: '0 4px 20px rgba(0,0,0,0.06)'
      }}>
        <div>
          {product.imageBase64 ? (
            <img src={product.imageBase64} alt={product.name}
              style={{ width: '100%', borderRadius: '16px', objectFit: 'cover', maxHeight: '500px' }} />
          ) : (
            <div style={{
              height: '400px', background: '#f3f4f6', borderRadius: '16px',
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '96px'
            }}>📦</div>
          )}
        </div>

        <div>
          <p style={{ color: '#6b7280', margin: 0, textTransform: 'uppercase', fontSize: '13px', letterSpacing: '1px' }}>
            {product.category?.name || 'Uncategorized'}
          </p>
          <h1 style={{ marginTop: '8px', color: '#1f2937', fontSize: '32px' }}>{product.name}</h1>
          <p style={{ color: '#4b5563', lineHeight: '1.6' }}>{product.description}</p>

          <p style={{ fontSize: '36px', color: '#2563eb', fontWeight: '700', margin: '20px 0' }}>
            ₹{product.price}
          </p>

          <p style={{ color: product.stock > 0 ? '#16a34a' : '#dc2626', fontWeight: '600' }}>
            {product.stock > 0 ? `✅ In stock: ${product.stock}` : '❌ Out of stock'}
          </p>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '24px' }}>
            <label style={{ color: '#4b5563', fontWeight: '500' }}>Qty:</label>
            <input
              type="number"
              min="1"
              max={product.stock}
              value={qty}
              onChange={(e) => setQty(Number(e.target.value))}
              style={{
                width: '80px', padding: '10px', borderRadius: '8px',
                border: '1px solid #d1d5db', fontSize: '15px'
              }}
            />
            <button
              onClick={addToCart}
              disabled={product.stock <= 0}
              style={{
                flex: 1, padding: '14px', background: product.stock > 0 ? '#2563eb' : '#9ca3af',
                color: 'white', border: 'none', borderRadius: '10px',
                fontSize: '16px', fontWeight: '700', cursor: product.stock > 0 ? 'pointer' : 'not-allowed'
              }}
            >
              🛒 Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}