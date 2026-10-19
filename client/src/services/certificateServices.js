import api from './api';
import { stripImmutableFields } from '../utils/payload';

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
    const payload = typeof FormData !== 'undefined' && data instanceof FormData
      ? data
      : stripImmutableFields(data);
    const response = await api.patch(`/certificates/${id}`, payload);
    return response.data.data;
  },
  delete: async (id) => {
    const response = await api.delete(`/certificates/${id}`);
    return response.data.data;
  }
};
