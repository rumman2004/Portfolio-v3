import api from './api';

export const contactServices = {
  submitContact: async (data) => {
    const response = await api.post('/contact', data);
    return response.data.data;
  },
  getMessages: async () => {
    const response = await api.get('/contact/messages');
    return response.data.data;
  },
  updateMessageStatus: async (id, data) => {
    const response = await api.patch(`/contact/messages/${id}`, data);
    return response.data.data;
  },
  deleteMessage: async (id) => {
    const response = await api.delete(`/contact/messages/${id}`);
    return response.data.data;
  }
};
