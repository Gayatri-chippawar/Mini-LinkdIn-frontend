// src/context/AuthContext.jsx
import { createContext, useEffect, useState } from 'react';
import api from '../api/client';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // overall load (including initial)
  const [authenticating, setAuthenticating] = useState(false); // during login/register

  // On mount: if token exists, fetch user
  useEffect(() => {
    const init = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        try {
          const res = await api.get('/auth/me');
          setUser(res.data.user || res.data);
        } catch (e) {
          console.warn('Auto-fetch user failed', e);
          localStorage.removeItem('token');
          setUser(null);
        }
      }
      setLoading(false);
    };
    init();
  }, []);

  const loginUser = async (token) => {
    setAuthenticating(true);
    try {
      localStorage.setItem('token', token);
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      const res = await api.get('/auth/me');
      setUser(res.data.user || res.data);
    } catch (e) {
      console.error('LoginUser fetch failed', e);
      localStorage.removeItem('token');
      setUser(null);
      throw e;
    } finally {
      setAuthenticating(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    delete api.defaults.headers.common['Authorization'];
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, authenticating, loginUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
