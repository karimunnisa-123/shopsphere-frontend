const BASE_URL = 'http://localhost:8081';

function getToken() {
  return localStorage.getItem('token');
}

async function request(path, options = {}) {
  const token = getToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`${BASE_URL}${path}`, { ...options, headers });

  if (!res.ok) {
    let errorMessage = `Error ${res.status}`;
    try {
      const text = await res.text();
      if (text) errorMessage = text;
    } catch {}
    throw new Error(errorMessage);
  }

  if (res.status === 204) return null;
  const text = await res.text();
  return text ? JSON.parse(text) : null;
}

export const api = {
  request,

  // Auth
  register: (data) => request('/api/auth/register', { method: 'POST', body: JSON.stringify(data) }),
  login: (data) => request('/api/auth/login', { method: 'POST', body: JSON.stringify(data) }),

  // Categories
  getCategories: () => request('/api/categories'),
  createCategory: (data) => request('/api/categories', { method: 'POST', body: JSON.stringify(data) }),
  deleteCategory: (id) => request(`/api/categories/${id}`, { method: 'DELETE' }),

  // Products
  getProducts: () => request('/api/products'),
  getProduct: (id) => request(`/api/products/${id}`),
  searchProducts: (name) => request(`/api/products/search?name=${encodeURIComponent(name)}`),
  productsByCategory: (id) => request(`/api/products/category/${id}`),
  createProduct: (data) => request('/api/products', { method: 'POST', body: JSON.stringify(data) }),
  updateProduct: (id, data) => request(`/api/products/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteProduct: (id) => request(`/api/products/${id}`, { method: 'DELETE' }),

  // Orders
  placeOrder: (data) => request('/api/orders', { method: 'POST', body: JSON.stringify(data) }),
  myOrders: () => request('/api/orders/my'),
  allOrders: () => request('/api/orders'),
  updateOrderStatus: (id, status) => request(`/api/orders/${id}/status`, {
    method: 'PUT',
    body: JSON.stringify({ status })
  }),
};

export { BASE_URL };