import api from './api';

export const certificateServices = {
  getAll: async () => {
    const response = await api.get('/certificates');
    return response.data.data;
  },
  getAdminAll: async () => {
    const response = await api.get('/certificates/admin/all');
    return response.data.data;
  },
  getBySlug: async (slug) => {
    const response = await api.get(`/certificates/${slug}`);
    return response.data.data;
  },
  create: async (data) => {
    const response = await api.post('/certificates', data);
    return response.data.data;
  },
  update: async (id, data) => {
    const response = await api.patch(`/certificates/${id}`, data);
    return response.data.data;
  },
  delete: async (id) => {
    const response = await api.delete(`/certificates/${id}`);
    return response.data.data;
  }
};
