import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('edutools_token') || '');
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      // Verify token & fetch user profile
      api.get('/auth/me')
        .then((res) => {
          if (res.data && res.data.user) {
            setUser(res.data.user);
          }
        })
        .catch(() => {
          logout();
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [token]);

  const login = async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    if (response.data && response.data.token) {
      const newToken = response.data.token;
      const userData = response.data.user;
      
      localStorage.setItem('edutools_token', newToken);
      setToken(newToken);
      setUser(userData);
      return response.data;
    }
  };

  const logout = () => {
    localStorage.removeItem('edutools_token');
    setToken('');
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        loading,
        isAuthenticated: !!token && !!user,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
