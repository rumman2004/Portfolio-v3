import api from './api';

export const experienceServices = {
  getAll: async () => {
    const response = await api.get('/experience');
    return response.data.data;
  },
  getAdminAll: async () => {
    const response = await api.get('/experience/admin/all');
    return response.data.data;
  },
  getById: async (id) => {
    const response = await api.get(`/experience/${id}`);
    return response.data.data;
  },
  create: async (data) => {
    const response = await api.post('/experience', data);
    return response.data.data;
  },
  update: async (id, data) => {
    const response = await api.patch(`/experience/${id}`, data);
    return response.data.data;
  },
  delete: async (id) => {
    const response = await api.delete(`/experience/${id}`);
    return response.data.data;
  }
};
