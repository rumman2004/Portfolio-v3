import React, { createContext, useState, useEffect } from 'react';
import { adminServices } from '../services/adminServices';

// Create the context
export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('portfolio_auth_token'));
  const [loading, setLoading] = useState(true);

  // Function to handle login
  const login = async (credentials) => {
    const data = await adminServices.login(credentials);
    
    // Assuming the backend returns { token, user: {...} }
    if (data.token) {
      setToken(data.token);
      localStorage.setItem('portfolio_auth_token', data.token);
      setUser(data.user || { role: 'admin' }); // Fallback user object if backend doesn't return one
    }
    return data;
  };

  // Function to handle logout
  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('portfolio_auth_token');
  };

  // Listen for the custom unauthorized event triggered by axios interceptor
  useEffect(() => {
    const handleUnauthorized = () => {
      logout();
    };
    window.addEventListener('auth_unauthorized', handleUnauthorized);
    return () => window.removeEventListener('auth_unauthorized', handleUnauthorized);
  }, []);

  // Check auth status on mount if a token exists
  useEffect(() => {
    const verifyAuth = async () => {
      if (token) {
        try {
          const userData = await adminServices.checkAuth();
          setUser(userData.user || userData || { role: 'admin' });
        } catch (error) {
          console.error("Token verification failed:", error);
          logout();
        }
      }
      setLoading(false);
    };

    verifyAuth();
  }, [token]);

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
