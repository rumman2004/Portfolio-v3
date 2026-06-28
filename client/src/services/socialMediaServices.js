import api from './api';

export const socialMediaServices = {
  getAll: async () => {
    const response = await api.get('/social-media');
    return response.data.data;
  },
  getAdminAll: async () => {
    const response = await api.get('/social-media/admin/all');
    return response.data.data;
  },
  create: async (data) => {
    const response = await api.post('/social-media', data);
    return response.data.data;
  },
  update: async (id, data) => {
    const response = await api.patch(`/social-media/${id}`, data);
    return response.data.data;
  },
  delete: async (id) => {
    const response = await api.delete(`/social-media/${id}`);
    return response.data.data;
  }
};
