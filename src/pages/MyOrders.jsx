import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api';
import { toast } from 'react-toastify';

export default function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.myOrders()
      .then(data => setOrders(data || []))
      .catch((err) => {
        console.error(err);
        toast.error('Failed to load orders');
      })
      .finally(() => setLoading(false));
  }, []);

  const statusStyles = {
    PENDING:   { bg: '#fef3c7', color: '#92400e', icon: '⏳' },
    SHIPPED:   { bg: '#dbeafe', color: '#1e40af', icon: '🚚' },
    DELIVERED: { bg: '#dcfce7', color: '#166534', icon: '✅' },
    CANCELLED: { bg: '#fee2e2', color: '#991b1b', icon: '❌' }
  };

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '30px 20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
        <h1 style={{ color: '#1f2937', margin: 0 }}>📦 My Orders</h1>
        <Link to="/" style={{
          color: '#2563eb', textDecoration: 'none', fontWeight: '600', fontSize: '14px'
        }}>
          ← Continue Shopping
        </Link>
      </div>

      {loading ? (
        <div style={{ padding: '60px 20px', textAlign: 'center', color: '#6b7280' }}>
          <p style={{ fontSize: '32px', margin: 0 }}>⏳</p>
          <p>Loading your orders...</p>
        </div>
      ) : orders.length === 0 ? (
        <div style={{
          background: 'white', padding: '60px 20px', borderRadius: '16px',
          textAlign: 'center', marginTop: '20px'
        }}>
          <p style={{ fontSize: '64px', margin: 0 }}>📭</p>
          <h2 style={{ color: '#6b7280', marginTop: '10px' }}>No orders yet</h2>
          <p style={{ color: '#9ca3af' }}>Your placed orders will appear here.</p>
          <Link to="/" style={{
            display: 'inline-block', marginTop: '16px', background: '#2563eb',
            color: 'white', padding: '12px 24px', borderRadius: '10px',
            textDecoration: 'none', fontWeight: '600'
          }}>
            Start Shopping
          </Link>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '16px', marginTop: '20px' }}>
          {orders.map(o => {
            const sc = statusStyles[o.status] || {
              bg: '#f3f4f6', color: '#4b5563', icon: '❔'
            };

            return (
              <div key={o.id} style={{
                background: 'white', borderRadius: '16px', padding: '20px',
                boxShadow: '0 2px 10px rgba(0,0,0,0.05)'
              }}>
                {/* Header: order id + date + status */}
                <div style={{
                  display: 'flex', justifyContent: 'space-between',
                  alignItems: 'flex-start', flexWrap: 'wrap', gap: '10px'
                }}>
                  <div>
                    <h3 style={{ margin: 0, color: '#1f2937' }}>Order #{o.id}</h3>
                    <p style={{ margin: '4px 0', color: '#6b7280', fontSize: '13px' }}>
                      Placed on {new Date(o.createdAt).toLocaleString('en-IN', {
                        dateStyle: 'medium', timeStyle: 'short'
                      })}
                    </p>
                  </div>
                  <span style={{
                    background: sc.bg, color: sc.color,
                    padding: '6px 16px', borderRadius: '50px',
                    fontWeight: '700', fontSize: '13px',
                    display: 'flex', alignItems: 'center', gap: '6px'
                  }}>
                    {sc.icon} {o.status}
                  </span>
                </div>

                {/* Items */}
                <div style={{
                  marginTop: '16px', borderTop: '1px solid #f3f4f6',
                  paddingTop: '12px'
                }}>
                  {o.items?.map((item, i) => (
                    <div key={i} style={{
                      display: 'flex', justifyContent: 'space-between',
                      padding: '8px 0',
                      borderBottom: i < o.items.length - 1 ? '1px solid #fafafa' : 'none'
                    }}>
                      <span style={{ color: '#4b5563', fontSize: '14px' }}>
                        {item.productName} <b>× {item.quantity}</b>
                      </span>
                      <span style={{ color: '#6b7280', fontSize: '14px' }}>
                        ₹{(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Footer: address + total */}
                <div style={{
                  display: 'flex', justifyContent: 'space-between',
                  alignItems: 'center', marginTop: '16px',
                  paddingTop: '12px', borderTop: '2px solid #f3f4f6',
                  flexWrap: 'wrap', gap: '10px'
                }}>
                  <div style={{ color: '#6b7280', fontSize: '13px' }}>
                    <p style={{ margin: '2px 0' }}>📍 {o.shippingAddress}</p>
                    <p style={{ margin: '2px 0' }}>📞 {o.phone}</p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <p style={{ margin: 0, color: '#6b7280', fontSize: '12px' }}>Total</p>
                    <b style={{ color: '#2563eb', fontSize: '22px' }}>
                      ₹{o.totalAmount}
                    </b>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}