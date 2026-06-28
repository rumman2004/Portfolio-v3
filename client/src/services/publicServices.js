import api from './api';

export const publicServices = {
  getProfile: async () => {
    const response = await api.get('/public/profile');
    return response.data.data;
  },
  updateProfile: async (data) => {
    // Note: requires protectAdmin on backend
    const response = await api.patch('/public/profile', data);
    return response.data.data;
  }
};
