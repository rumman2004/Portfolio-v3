import api from './api';

export const adminServices = {
  /**
   * Log in the admin user
   * @param {Object} credentials - { username, password } or { email, password }
   * @returns {Promise<Object>} - Contains the server response and admin data
   */
  login: async (credentials) => {
    try {
      const response = await api.post('/admin/login', credentials);
      return response.data.data;
    } catch (error) {
      throw error.response?.data || new Error(error.message);
    }
  },

  /**
   * End the server-side admin session. The API clears its httpOnly cookie.
   */
  logout: async () => {
    const response = await api.post('/admin/logout');
    return response.data;
  },

  /**
   * Verify the current server-owned session cookie
   * @returns {Promise<Object>} - Admin user data
   */
  checkAuth: async () => {
    try {
      const response = await api.get('/admin/me');
      return response.data.data;
    } catch (error) {
      throw error.response?.data || new Error(error.message);
    }
  },

  // Add more admin specific services below (e.g. updating profile, changing password)
};
