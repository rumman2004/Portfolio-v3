import api from './api';

export const educationServices = {
  getAll: async () => {
    const response = await api.get('/education');
    return response.data.data;
  },
  getAdminAll: async () => {
    const response = await api.get('/education/admin/all');
    return response.data.data;
  },
  getById: async (id) => {
    const response = await api.get(`/education/${id}`);
    return response.data.data;
  },
  create: async (data) => {
    const response = await api.post('/education', data);
    return response.data.data;
  },
  update: async (id, data) => {
    const response = await api.patch(`/education/${id}`, data);
    return response.data.data;
  },
  delete: async (id) => {
    const response = await api.delete(`/education/${id}`);
    return response.data.data;
  }
};
