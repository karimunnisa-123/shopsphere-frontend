import { useEffect, useState } from 'react';
import { api } from '../api';
import { toast } from 'react-toastify';

export default function Admin() {
  const [tab, setTab] = useState('products');
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [orders, setOrders] = useState([]);

  const [newCatName, setNewCatName] = useState('');
  const [newCatDesc, setNewCatDesc] = useState('');
  const [form, setForm] = useState({
    name: '', description: '', price: '', stock: '', categoryId: '', imageBase64: null
  });
  const [editingId, setEditingId] = useState(null);

  const load = async () => {
    try {
      const [p, c, o] = await Promise.all([
        api.getProducts(),
        api.getCategories(),
        api.request('/api/orders')
      ]);
      setProducts(p || []);
      setCategories(c || []);
      setOrders(o || []);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load data');
    }
  };

  useEffect(() => { load(); }, []);

  const addCategory = async (e) => {
    e.preventDefault();
    try {
      await api.createCategory({ name: newCatName, description: newCatDesc });
      toast.success('✅ Category added');
      setNewCatName(''); setNewCatDesc('');
      load();
    } catch (err) { toast.error(err.message); }
  };

  const deleteCategory = async (id) => {
    if (!window.confirm('Delete this category?')) return;
    try {
      await api.deleteCategory(id);
      toast.success('Category deleted');
      load();
    } catch { toast.error('Cannot delete — products may use it'); }
  };

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => setForm({ ...form, imageBase64: reader.result });
    reader.readAsDataURL(file);
  };

  const submitProduct = async (e) => {
    e.preventDefault();
    try {
      const data = {
        name: form.name,
        description: form.description,
        price: parseFloat(form.price),
        stock: parseInt(form.stock),
        categoryId: parseInt(form.categoryId),
        imageBase64: form.imageBase64
      };
      if (editingId) {
        await api.updateProduct(editingId, data);
        toast.success('✅ Product updated');
      } else {
        await api.createProduct(data);
        toast.success('✅ Product created');
      }
      setForm({ name: '', description: '', price: '', stock: '', categoryId: '', imageBase64: null });
      setEditingId(null);
      load();
    } catch (err) { toast.error(err.message); }
  };

  const editProduct = (p) => {
    setEditingId(p.id);
    setForm({
      name: p.name, description: p.description,
      price: p.price, stock: p.stock,
      categoryId: p.category?.id || '',
      imageBase64: p.imageBase64
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const deleteProduct = async (id) => {
    if (!window.confirm('Delete this product?')) return;
    try {
      await api.deleteProduct(id);
      toast.success('Product deleted');
      load();
    } catch { toast.error('Failed to delete'); }
  };

  const updateOrderStatus = async (id, status) => {
    try {
      await api.request(`/api/orders/${id}/status`, {
        method: 'PUT',
        body: JSON.stringify({ status })
      });
      toast.success('Status updated');
      load();
    } catch { toast.error('Failed to update status'); }
  };

  const inputStyle = {
    width: '100%', padding: '10px 12px', borderRadius: '8px',
    border: '1px solid #d1d5db', fontSize: '14px', boxSizing: 'border-box'
  };

  const tabBtn = (name, label) => (
    <button
      onClick={() => setTab(name)}
      style={{
        padding: '10px 24px', borderRadius: '50px', border: 'none',
        background: tab === name ? '#2563eb' : 'white',
        color: tab === name ? 'white' : '#4b5563',
        fontWeight: '600', cursor: 'pointer', fontSize: '14px',
        boxShadow: tab === name ? '0 4px 12px rgba(37,99,235,0.3)' : '0 2px 6px rgba(0,0,0,0.06)'
      }}
    >{label}</button>
  );

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '30px 20px' }}>
      <h1 style={{ color: '#1f2937' }}>⚙️ Admin Panel</h1>

      <div style={{ display: 'flex', gap: '10px', marginBottom: '24px' }}>
        {tabBtn('products', '📦 Products')}
        {tabBtn('orders', '🧾 Orders')}
      </div>

      {tab === 'products' && (
        <>
          {/* Categories */}
          <div style={{ background: 'white', padding: '24px', borderRadius: '16px', marginBottom: '24px' }}>
            <h2 style={{ marginTop: 0 }}>📁 Categories</h2>
            <form onSubmit={addCategory} style={{ display: 'flex', gap: '10px', marginBottom: '16px', flexWrap: 'wrap' }}>
              <input placeholder="Name" value={newCatName}
                onChange={(e) => setNewCatName(e.target.value)} required
                style={{ ...inputStyle, flex: 1, minWidth: '150px' }} />
              <input placeholder="Description" value={newCatDesc}
                onChange={(e) => setNewCatDesc(e.target.value)}
                style={{ ...inputStyle, flex: 2, minWidth: '200px' }} />
              <button type="submit" style={{
                background: '#2563eb', color: 'white', border: 'none',
                padding: '10px 20px', borderRadius: '8px', fontWeight: '600', cursor: 'pointer'
              }}>Add Category</button>
            </form>

            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              {categories.map(c => (
                <div key={c.id} style={{
                  background: '#eff6ff', padding: '8px 14px', borderRadius: '50px',
                  display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px'
                }}>
                  <b>{c.name}</b>
                  <button onClick={() => deleteCategory(c.id)}
                    style={{ background: 'transparent', border: 'none', color: '#dc2626', cursor: 'pointer', fontWeight: '700' }}>×</button>
                </div>
              ))}
            </div>
          </div>

          {/* Product form */}
          <div style={{ background: 'white', padding: '24px', borderRadius: '16px', marginBottom: '24px' }}>
            <h2 style={{ marginTop: 0 }}>{editingId ? '✏️ Edit Product' : '➕ Add Product'}</h2>
            <form onSubmit={submitProduct} style={{ display: 'grid', gap: '14px' }}>
              <input placeholder="Name" value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })} required style={inputStyle} />
              <textarea placeholder="Description" rows={3} value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })} style={inputStyle} />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <input type="number" step="0.01" placeholder="Price" value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })} required style={inputStyle} />
                <input type="number" placeholder="Stock" value={form.stock}
                  onChange={(e) => setForm({ ...form, stock: e.target.value })} required style={inputStyle} />
              </div>
              <select value={form.categoryId}
                onChange={(e) => setForm({ ...form, categoryId: e.target.value })} required style={inputStyle}>
                <option value="">Select Category</option>
                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
              <input type="file" accept="image/*" onChange={handleImage} style={{ padding: '8px' }} />

              <div style={{ display: 'flex', gap: '10px' }}>
                <button type="submit" style={{
                  background: editingId ? '#eab308' : '#2563eb', color: 'white',
                  border: 'none', padding: '12px 24px', borderRadius: '8px',
                  fontWeight: '700', cursor: 'pointer'
                }}>{editingId ? 'Update' : 'Create'}</button>
                {editingId && (
                  <button type="button" onClick={() => {
                    setEditingId(null);
                    setForm({ name: '', description: '', price: '', stock: '', categoryId: '', imageBase64: null });
                  }} style={{
                    background: '#6b7280', color: 'white', border: 'none',
                    padding: '12px 24px', borderRadius: '8px', fontWeight: '600', cursor: 'pointer'
                  }}>Cancel</button>
                )}
              </div>
            </form>
          </div>

          {/* Product list */}
          <div style={{ background: 'white', padding: '24px', borderRadius: '16px' }}>
            <h2 style={{ marginTop: 0 }}>📦 All Products ({products.length})</h2>
            <div style={{ display: 'grid', gap: '10px' }}>
              {products.map(p => (
                <div key={p.id} style={{
                  display: 'flex', alignItems: 'center', gap: '14px',
                  padding: '12px', border: '1px solid #f3f4f6', borderRadius: '10px'
                }}>
                  {p.imageBase64 ? (
                    <img src={p.imageBase64} alt={p.name}
                      style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '8px' }} />
                  ) : (
                    <div style={{
                      width: '50px', height: '50px', background: '#f3f4f6',
                      borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}>📦</div>
                  )}
                  <div style={{ flex: 1 }}>
                    <b>{p.name}</b>
                    <p style={{ margin: 0, color: '#6b7280', fontSize: '13px' }}>
                      {p.category?.name} • ₹{p.price} • Stock: {p.stock}
                    </p>
                  </div>
                  <button onClick={() => editProduct(p)} style={{
                    background: '#eab308', color: 'white', border: 'none',
                    padding: '6px 14px', borderRadius: '6px', cursor: 'pointer', fontWeight: '600'
                  }}>Edit</button>
                  <button onClick={() => deleteProduct(p.id)} style={{
                    background: '#dc2626', color: 'white', border: 'none',
                    padding: '6px 14px', borderRadius: '6px', cursor: 'pointer', fontWeight: '600'
                  }}>Delete</button>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {tab === 'orders' && (
        <div style={{ background: 'white', padding: '24px', borderRadius: '16px' }}>
          <h2 style={{ marginTop: 0 }}>🧾 All Orders ({orders.length})</h2>
          {orders.length === 0 ? (
            <p style={{ color: '#6b7280' }}>No orders yet.</p>
          ) : (
            <div style={{ display: 'grid', gap: '14px' }}>
              {orders.map(o => (
                <div key={o.id} style={{
                  border: '1px solid #e5e7eb', borderRadius: '12px', padding: '16px'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
                    <div>
                      <b>Order #{o.id}</b>
                      <p style={{ margin: '4px 0', color: '#6b7280', fontSize: '13px' }}>
                        {o.user?.username} • {new Date(o.createdAt).toLocaleString()}
                      </p>
                      <p style={{ margin: '4px 0', color: '#6b7280', fontSize: '13px' }}>
                        📍 {o.shippingAddress} • 📞 {o.phone}
                      </p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <p style={{ margin: 0, color: '#2563eb', fontWeight: '700', fontSize: '18px' }}>
                        ₹{o.totalAmount}
                      </p>
                      <select value={o.status}
                        onChange={(e) => updateOrderStatus(o.id, e.target.value)}
                        style={{
                          marginTop: '6px', padding: '6px 12px', borderRadius: '6px',
                          border: '1px solid #d1d5db', fontWeight: '600', fontSize: '13px',
                          background:
                            o.status === 'DELIVERED' ? '#dcfce7' :
                            o.status === 'SHIPPED' ? '#dbeafe' :
                            o.status === 'CANCELLED' ? '#fee2e2' : '#fef3c7'
                        }}>
                        <option value="PENDING">PENDING</option>
                        <option value="SHIPPED">SHIPPED</option>
                        <option value="DELIVERED">DELIVERED</option>
                        <option value="CANCELLED">CANCELLED</option>
                      </select>
                    </div>
                  </div>
                  <div style={{ marginTop: '12px', borderTop: '1px solid #f3f4f6', paddingTop: '10px' }}>
                    {o.items?.map((item, i) => (
                      <p key={i} style={{ margin: '4px 0', color: '#4b5563', fontSize: '13px' }}>
                        • {item.productName} — {item.quantity} × ₹{item.price}
                      </p>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}