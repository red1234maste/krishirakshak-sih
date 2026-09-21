import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';
import i18n from '../i18n/i18n';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('krishi_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('krishi_token') || null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (token) {
      fetchCurrentUser();
    }
  }, [token]);

  const fetchCurrentUser = async () => {
    try {
      const res = await api.get('/auth/me');
      if (res.data && res.data.user) {
        setUser(res.data.user);
        localStorage.setItem('krishi_user', JSON.stringify(res.data.user));
        if (res.data.user.preferredLanguage) {
          i18n.changeLanguage(res.data.user.preferredLanguage);
        }
      }
    } catch (err) {
      console.error('Error fetching current user:', err);
    }
  };

  const login = async (phone, password) => {
    setLoading(true);
    try {
      const res = await api.post('/auth/login', { phone, password });
      const { token, user } = res.data;
      setToken(token);
      setUser(user);
      localStorage.setItem('krishi_token', token);
      localStorage.setItem('krishi_user', JSON.stringify(user));
      if (user.preferredLanguage) {
        i18n.changeLanguage(user.preferredLanguage);
      }
      return { success: true, user };
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || 'Login failed. Please check credentials.'
      };
    } finally {
      setLoading(false);
    }
  };

  const switchDemoRole = async (role) => {
    setLoading(true);
    try {
      const res = await api.post('/auth/demo-login', { role });
      const { token, user } = res.data;
      setToken(token);
      setUser(user);
      localStorage.setItem('krishi_token', token);
      localStorage.setItem('krishi_user', JSON.stringify(user));
      if (user.preferredLanguage) {
        i18n.changeLanguage(user.preferredLanguage);
      }
      return { success: true, user };
    } catch (err) {
      return { success: false, message: err.message };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('krishi_token');
    localStorage.removeItem('krishi_user');
  };

  const updatePreferredLanguage = async (lng) => {
    i18n.changeLanguage(lng);
    if (token) {
      try {
        await api.put('/auth/language', { preferredLanguage: lng });
        if (user) {
          const updated = { ...user, preferredLanguage: lng };
          setUser(updated);
          localStorage.setItem('krishi_user', JSON.stringify(updated));
        }
      } catch (e) {
        console.error('Failed to sync language to backend:', e);
      }
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        logout,
        switchDemoRole,
        updatePreferredLanguage,
        isAuthenticated: Boolean(user && token)
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
