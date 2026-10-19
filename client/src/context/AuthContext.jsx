import React, { useState, useEffect, useCallback } from 'react';
import { adminServices } from '../services/adminServices';
import { clearClientCache } from '../utils/storage';
import { AuthContext } from './auth-context';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Function to handle login
  const login = async (credentials) => {
    const data = await adminServices.login(credentials);
    
    // Authentication is kept in the server-owned httpOnly cookie. Do not copy
    // the returned token into browser storage or JavaScript state.
    setUser(data.admin || data.user || { role: 'admin' });
    return data;
  };

  const clearSession = useCallback(() => {
    setUser(null);
    localStorage.removeItem('portfolio_auth_token');
    clearClientCache();
  }, []);

  // Function to handle logout. The server owns the session cookie, so always
  // ask it to clear the session before clearing local client state.
  const logout = useCallback(async () => {
    try {
      await adminServices.logout();
    } catch (error) {
      // Local state is still cleared when the network is unavailable.
      console.error('Server logout failed:', error);
    } finally {
      clearSession();
    }
  }, [clearSession]);

  // Listen for the custom unauthorized event triggered by axios interceptor
  useEffect(() => {
    const handleUnauthorized = () => {
      clearSession();
    };
    window.addEventListener('auth_unauthorized', handleUnauthorized);
    return () => window.removeEventListener('auth_unauthorized', handleUnauthorized);
  }, [clearSession]);

  // Check the server-owned session cookie on mount. Remove the legacy token
  // left by older client versions without ever using it for a request.
  useEffect(() => {
    localStorage.removeItem('portfolio_auth_token');

    const verifyAuth = async () => {
      try {
        const userData = await adminServices.checkAuth();
        setUser(userData.admin || userData.user || userData || { role: 'admin' });
      } catch (error) {
        if (error.response?.status !== 401) {
          console.error("Session verification failed:", error);
        }
        clearSession();
      }
      setLoading(false);
    };

    verifyAuth();
  }, [clearSession]);

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
