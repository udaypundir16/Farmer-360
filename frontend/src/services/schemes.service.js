import api from './api';

export const getSchemes = async (filters = {}) => {
  const response = await api.get('/schemes', { params: filters });
  return response.data;
};

export const getSchemeNews = async () => {
  const response = await api.get('/schemes/news');
  return response.data;
};

export const getSchemeById = async (id) => {
  const response = await api.get(`/schemes/${id}`);
  return response.data;
};

export const applyToScheme = async (schemeId) => {
  const response = await api.post(`/schemes/${schemeId}/apply`);
  return response.data;
};

export const getUserApplications = async () => {
  const response = await api.get('/users/applications');
  return response.data;
};
