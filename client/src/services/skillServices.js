import api from './api';

export const skillServices = {
  getAll: async () => {
    const response = await api.get('/skills');
    return response.data.data;
  },
  getFeatured: async () => {
    const response = await api.get('/skills/featured');
    return response.data.data;
  },
  getAdminAll: async () => {
    const response = await api.get('/skills/admin/all');
    return response.data.data;
  },
  create: async (data) => {
    const response = await api.post('/skills', data);
    return response.data.data;
  },
  update: async (id, data) => {
    const response = await api.patch(`/skills/${id}`, data);
    return response.data.data;
  },
  delete: async (id) => {
    const response = await api.delete(`/skills/${id}`);
    return response.data.data;
  }
};
