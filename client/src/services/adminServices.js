import api from './api';

export const adminServices = {
  /**
   * Log in the admin user
   * @param {Object} credentials - { username, password } or { email, password }
   * @returns {Promise<Object>} - Contains token and user data on success
   */
  login: async (credentials) => {
    try {
      const response = await api.post('/admin/login', credentials);
      return response.data.data; // Returns { token, user }
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * Verify the current stored token
   * @returns {Promise<Object>} - Admin user data
   */
  checkAuth: async () => {
    try {
      const response = await api.get('/admin/me');
      return response.data.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Add more admin specific services below (e.g. updating profile, changing password)
};
