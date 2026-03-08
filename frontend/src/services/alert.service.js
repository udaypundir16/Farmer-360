import api from './api';

export const getUserAlerts = async () => {
  const response = await api.get('/alerts');
  return response.data;
};

export const createAlert = async (alertData) => {
  const response = await api.post('/alerts', alertData);
  return response.data;
};

export const deleteAlert = async (id) => {
  const response = await api.delete(`/alerts/${id}`);
  return response.data;
};

export const updateAlert = async (id, data) => {
  const response = await api.put(`/alerts/${id}`, data);
  return response.data;
};
