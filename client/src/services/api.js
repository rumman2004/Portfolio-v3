import axios from 'axios';

// Create an Axios instance with base URL from environment variables
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  timeout: 60000,
  headers: {
    Accept: 'application/json',
  },
});

// Request interceptor: Attach JWT token to headers if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('portfolio_auth_token');
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor: Handle global 401 Unauthorized errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      // If unauthorized, clear the token and optionally trigger a logout event
      localStorage.removeItem('portfolio_auth_token');
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
