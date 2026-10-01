import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import { api } from '../api';

// Cart key is unique per user (or 'guest')
function getCartKey(username) {
  return `cart_${username || 'guest'}`;
}

export default function Cart() {
  const [cart, setCart] = useState([]);
  const [showCheckout, setShowCheckout] = useState(false);
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [placing, setPlacing] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  // Load the cart when the user changes
  useEffect(() => {
    const key = getCartKey(user?.username);
    setCart(JSON.parse(localStorage.getItem(key) || '[]'));
  }, [user]);

  const updateCart = (newCart) => {
    const key = getCartKey(user?.username);
    setCart(newCart);
    localStorage.setItem(key, JSON.stringify(newCart));
  };

  const changeQty = (id, delta) => {
    const updated = cart.map(item =>
      item.id === id ? { ...item, qty: Math.max(1, item.qty + delta) } : item
    );
    updateCart(updated);
  };

  const removeItem = (id) => {
    updateCart(cart.filter(item => item.id !== id));
    toast.info('Removed from cart');
  };

  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  const openCheckout = () => {
    if (!user) {
      toast.error('Please log in first');
      navigate('/login');
      return;
    }
    if (cart.length === 0) {
      toast.error('Cart is empty');
      return;
    }
    setShowCheckout(true);
  };

  const placeOrder = async (e) => {
    e.preventDefault();
    setPlacing(true);
    try {
      const payload = {
        shippingAddress: address,
        phone: phone,
        items: cart.map(item => ({
          productId: item.id,
          quantity: item.qty
        }))
      };
      await api.placeOrder(payload);
      toast.success('✅ Order placed successfully!');
      updateCart([]);
      navigate('/orders');
    } catch (err) {
      toast.error(err.message || 'Failed to place order');
    } finally {
      setPlacing(false);
    }
  };

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '30px 20px' }}>
      <h1 style={{ color: '#1f2937' }}>🛍️ Your Cart</h1>

      {cart.length === 0 ? (
        <div style={{ background: 'white', padding: '60px 20px', borderRadius: '16px', textAlign: 'center' }}>
          <p style={{ fontSize: '48px', margin: 0 }}>🛒</p>
          <h2 style={{ color: '#6b7280' }}>Your cart is empty</h2>
          <Link to="/" style={{
            display: 'inline-block', marginTop: '16px', background: '#2563eb',
            color: 'white', padding: '12px 24px', borderRadius: '10px',
            textDecoration: 'none', fontWeight: '600'
          }}>Browse Products</Link>
        </div>
      ) : (
        <>
          <div style={{ background: 'white', borderRadius: '16px', padding: '20px' }}>
            {cart.map(item => (
              <div key={item.id} style={{
                display: 'flex', alignItems: 'center', gap: '16px',
                padding: '16px 0', borderBottom: '1px solid #f3f4f6'
              }}>
                {item.imageBase64 ? (
                  <img src={item.imageBase64} alt={item.name}
                    style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '10px' }} />
                ) : (
                  <div style={{
                    width: '80px', height: '80px', background: '#f3f4f6',
                    borderRadius: '10px', display: 'flex', alignItems: 'center',
                    justifyContent: 'center', fontSize: '32px'
                  }}>📦</div>
                )}
                <div style={{ flex: 1 }}>
                  <h3 style={{ margin: 0, color: '#1f2937' }}>{item.name}</h3>
                  <p style={{ margin: '4px 0', color: '#2563eb', fontWeight: '700' }}>₹{item.price}</p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <button onClick={() => changeQty(item.id, -1)}
                    style={{ width: '32px', height: '32px', border: '1px solid #d1d5db', background: 'white', borderRadius: '6px', cursor: 'pointer' }}>−</button>
                  <span style={{ minWidth: '24px', textAlign: 'center', fontWeight: '600' }}>{item.qty}</span>
                  <button onClick={() => changeQty(item.id, 1)}
                    style={{ width: '32px', height: '32px', border: '1px solid #d1d5db', background: 'white', borderRadius: '6px', cursor: 'pointer' }}>+</button>
                </div>
                <button onClick={() => removeItem(item.id)}
                  style={{ background: 'transparent', color: '#dc2626', border: 'none', cursor: 'pointer', fontWeight: '600' }}>
                  Remove
                </button>
              </div>
            ))}
          </div>

          <div style={{
            background: 'white', marginTop: '20px', padding: '24px',
            borderRadius: '16px', display: 'flex', justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <h2 style={{ margin: 0, color: '#1f2937' }}>Total: ₹{total.toFixed(2)}</h2>
            <button onClick={openCheckout} style={{
              background: '#16a34a', color: 'white', border: 'none',
              padding: '14px 32px', borderRadius: '10px', fontSize: '16px',
              fontWeight: '700', cursor: 'pointer'
            }}>
              ✅ Proceed to Checkout
            </button>
          </div>
        </>
      )}

      {showCheckout && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200
        }}>
          <div style={{
            background: 'white', padding: '32px', borderRadius: '16px',
            width: '90%', maxWidth: '480px'
          }}>
            <h2 style={{ marginTop: 0, color: '#1f2937' }}>📍 Shipping Details</h2>
            <form onSubmit={placeOrder}>
              <label style={{ display: 'block', fontSize: '13px', color: '#4b5563', marginBottom: '4px' }}>
                Shipping Address
              </label>
              <textarea
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
                rows={3}
                placeholder="Street, city, pincode"
                style={{
                  width: '100%', padding: '12px', borderRadius: '8px',
                  border: '1px solid #d1d5db', marginBottom: '16px',
                  boxSizing: 'border-box', fontFamily: 'inherit'
                }}
              />

              <label style={{ display: 'block', fontSize: '13px', color: '#4b5563', marginBottom: '4px' }}>
                Phone Number
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                placeholder="10-digit phone"
                style={{
                  width: '100%', padding: '12px', borderRadius: '8px',
                  border: '1px solid #d1d5db', marginBottom: '24px',
                  boxSizing: 'border-box'
                }}
              />

              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                <button type="button" onClick={() => setShowCheckout(false)} disabled={placing}
                  style={{
                    background: 'white', border: '1px solid #d1d5db', padding: '12px 24px',
                    borderRadius: '8px', fontWeight: '600', cursor: placing ? 'not-allowed' : 'pointer'
                  }}>Cancel</button>
                <button type="submit" disabled={placing} style={{
                  background: '#16a34a', color: 'white', border: 'none',
                  padding: '12px 24px', borderRadius: '8px', fontWeight: '700',
                  cursor: placing ? 'not-allowed' : 'pointer', opacity: placing ? 0.6 : 1
                }}>{placing ? 'Placing...' : '✅ Place Order'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}