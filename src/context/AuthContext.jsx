import { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const login = async (username, password) => {
    const res = await api.login({ username, password, email: '' });
    localStorage.setItem('token', res.token);
    localStorage.setItem('user', JSON.stringify({ username: res.username, role: res.role }));
    setToken(res.token);
    setUser({ username: res.username, role: res.role });
    return res;
  };

  const register = async (username, password, email) => {
    const res = await api.register({ username, password, email });
    localStorage.setItem('token', res.token);
    localStorage.setItem('user', JSON.stringify({ username: res.username, role: res.role }));
    setToken(res.token);
    setUser({ username: res.username, role: res.role });
    return res;
  };

    const logout = () => {
    // Don't delete the cart — it's already keyed by user, so switching users auto-separates carts
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}