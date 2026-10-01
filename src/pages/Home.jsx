import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api';
import { toast } from 'react-toastify';

export default function Home() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [priceRange, setPriceRange] = useState('all');

  const load = async () => {
    try {
      const [p, c] = await Promise.all([api.getProducts(), api.getCategories()]);
      setProducts(p || []);
      setCategories(c || []);
    } catch (err) {
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const filtered = products.filter(p => {
    const matchesSearch = p.name?.toLowerCase().includes(search.toLowerCase());
    const matchesCategory =
      selectedCategory === 'all' || p.category?.id === Number(selectedCategory);

    let matchesPrice = true;
    if (priceRange === 'low') matchesPrice = p.price < 500;
    else if (priceRange === 'mid') matchesPrice = p.price >= 500 && p.price <= 5000;
    else if (priceRange === 'high') matchesPrice = p.price > 5000;

    return matchesSearch && matchesCategory && matchesPrice;
  });

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '30px 20px' }}>
      <h1 style={{ color: '#1f2937', margin: 0 }}>🛍️ Shop All Products</h1>
      <p style={{ color: '#6b7280' }}>{filtered.length} product{filtered.length !== 1 ? 's' : ''} found</p>

      {/* Filters */}
      <div style={{
        background: 'white',
        padding: '20px',
        borderRadius: '16px',
        marginBottom: '24px',
        display: 'grid',
        gridTemplateColumns: '2fr 1fr 1fr',
        gap: '14px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
      }}>
        <input
          type="text"
          placeholder="🔍 Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            padding: '12px 16px', fontSize: '15px', borderRadius: '10px',
            border: '1px solid #d1d5db', outline: 'none'
          }}
        />

        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          style={{
            padding: '12px 16px', fontSize: '15px', borderRadius: '10px',
            border: '1px solid #d1d5db', outline: 'none', background: 'white'
          }}
        >
          <option value="all">All Categories</option>
          {categories.map(c => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>

        <select
          value={priceRange}
          onChange={(e) => setPriceRange(e.target.value)}
          style={{
            padding: '12px 16px', fontSize: '15px', borderRadius: '10px',
            border: '1px solid #d1d5db', outline: 'none', background: 'white'
          }}
        >
          <option value="all">All Prices</option>
          <option value="low">Under ₹500</option>
          <option value="mid">₹500 – ₹5000</option>
          <option value="high">Above ₹5000</option>
        </select>
      </div>

      {/* Product Grid */}
      {loading ? (
        <p>Loading products...</p>
      ) : filtered.length === 0 ? (
        <div style={{
          background: 'white', padding: '60px 20px', borderRadius: '16px',
          textAlign: 'center', color: '#6b7280'
        }}>
          <h2>😕 No products found</h2>
          <p>Try a different search, category, or price filter.</p>
          {products.length === 0 && (
            <p style={{ color: '#2563eb', fontWeight: '600' }}>
              Psst — log in as <b>ADMIN</b> and go to <b>/admin</b> to add products!
            </p>
          )}
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
          gap: '24px'
        }}>
          {filtered.map((p) => (
            <Link
              key={p.id}
              to={`/product/${p.id}`}
              style={{
                background: 'white',
                borderRadius: '16px',
                overflow: 'hidden',
                textDecoration: 'none',
                color: 'inherit',
                boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
                transition: 'transform 0.2s, box-shadow 0.2s',
                display: 'flex',
                flexDirection: 'column'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.12)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.06)';
              }}
            >
              {p.imageBase64 ? (
                <img
                  src={p.imageBase64}
                  alt={p.name}
                  style={{ width: '100%', height: '200px', objectFit: 'cover' }}
                />
              ) : (
                <div style={{
                  height: '200px', background: '#f3f4f6', display: 'flex',
                  alignItems: 'center', justifyContent: 'center', fontSize: '64px'
                }}>📦</div>
              )}

              <div style={{ padding: '16px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                <p style={{
                  margin: 0, color: '#6b7280', fontSize: '12px',
                  textTransform: 'uppercase', letterSpacing: '0.5px'
                }}>
                  {p.category?.name || 'Uncategorized'}
                </p>

                <h3 style={{
                  margin: '6px 0 8px', color: '#1f2937', fontSize: '16px',
                  fontWeight: '600', lineHeight: 1.3
                }}>
                  {p.name}
                </h3>

                <p style={{
                  margin: 0, color: '#9ca3af', fontSize: '13px',
                  flex: 1, overflow: 'hidden',
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical'
                }}>
                  {p.description}
                </p>

                <div style={{
                  display: 'flex', justifyContent: 'space-between',
                  alignItems: 'center', marginTop: '12px'
                }}>
                  <span style={{ color: '#2563eb', fontWeight: '700', fontSize: '18px' }}>
                    ₹{p.price}
                  </span>
                  {p.stock > 0 ? (
                    <span style={{ color: '#16a34a', fontSize: '12px', fontWeight: '600' }}>
                      In stock
                    </span>
                  ) : (
                    <span style={{ color: '#dc2626', fontSize: '12px', fontWeight: '600' }}>
                      Out of stock
                    </span>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}