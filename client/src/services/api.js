import axios from 'axios';
import { clearClientCache } from '../utils/storage';

// Create an Axios instance with base URL from environment variables
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  timeout: 60000,
  withCredentials: true,
  headers: {
    Accept: 'application/json',
  },
});

// Response interceptor: Handle global 401 Unauthorized errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      // If unauthorized, clear local cache and notify AuthContext.
      localStorage.removeItem('portfolio_auth_token');
      clearClientCache();
      // A custom event can be dispatched here to notify AuthContext to update its state
      window.dispatchEvent(new Event('auth_unauthorized'));
    }
    if (!error.response) {
      error.message = 'Unable to reach the server. Please check the API URL or network connection.';
    }
    return Promise.reject(error);
  }
);

export default api;
