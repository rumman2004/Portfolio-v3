import api from './api';

export const hackathonServices = {
  getAll: async () => {
    const response = await api.get('/hackathon');
    return response.data.data;
  },
  getFeatured: async () => {
    const response = await api.get('/hackathon/featured');
    return response.data.data;
  },
  getAdminAll: async () => {
    const response = await api.get('/hackathon/admin/all');
    return response.data.data;
  },
  getBySlug: async (slug) => {
    const response = await api.get(`/hackathon/${slug}`);
    return response.data.data;
  },
  create: async (data) => {
    const response = await api.post('/hackathon', data);
    return response.data.data;
  },
  update: async (id, data) => {
    const response = await api.patch(`/hackathon/${id}`, data);
    return response.data.data;
  },
  delete: async (id) => {
    const response = await api.delete(`/hackathon/${id}`);
    return response.data.data;
  }
};
