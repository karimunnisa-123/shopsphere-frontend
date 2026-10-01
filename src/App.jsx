import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Admin from './pages/Admin';
import MyOrders from './pages/MyOrders';
import { useAuth } from './context/AuthContext';

function App() {
  const { user } = useAuth();

  return (
    <div style={{ minHeight: '100vh', background: '#f6f8fa', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/orders" element={user ? <MyOrders /> : <Navigate to="/login" />} />
        <Route path="/login" element={user ? <Navigate to="/" /> : <Login />} />
        <Route path="/register" element={user ? <Navigate to="/" /> : <Register />} />
        <Route path="/admin" element={user?.role === 'ADMIN' ? <Admin /> : <Navigate to="/" />} />
      </Routes>
    </div>
  );
}

export default App;