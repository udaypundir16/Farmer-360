import api from './api';

export const getAnalytics = async () => {
  const response = await api.get('/admin/analytics');
  return response.data;
};

export const getAllUsers = async (filters = {}) => {
  const response = await api.get('/admin/users', { params: filters });
  return response.data;
};

export const getUserById = async (userId) => {
  const response = await api.get(`/admin/users/${userId}`);
  return response.data;
};

export const updateUserStatus = async (userId, status) => {
  const response = await api.put(`/admin/users/${userId}`, { status });
  return response.data;
};

export const getAllSchemes = async (filters = {}) => {
  const response = await api.get('/admin/schemes', { params: filters });
  return response.data;
};

export const createScheme = async (schemeData) => {
  const response = await api.post('/admin/schemes', schemeData);
  return response.data;
};

export const updateScheme = async (schemeId, schemeData) => {
  const response = await api.put(`/admin/schemes/${schemeId}`, schemeData);
  return response.data;
};

export const deleteScheme = async (schemeId) => {
  const response = await api.delete(`/admin/schemes/${schemeId}`);
  return response.data;
};

export const getApplications = async (filters = {}) => {
  const response = await api.get('/admin/applications', { params: filters });
  return response.data;
};

export const updateApplicationStatus = async (applicationId, status) => {
  const response = await api.put(`/admin/applications/${applicationId}`, { status });
  return response.data;
};

export const getAlertStatistics = async () => {
  const response = await api.get('/admin/alert-stats');
  return response.data;
};

export const getPriceHistory = async (filters = {}) => {
  const response = await api.get('/admin/price-history', { params: filters });
  return response.data;
};

export const getSystemHealth = async () => {
  const response = await api.get('/admin/health');
  return response.data;
};

export const getLogsReport = async (filters = {}) => {
  const response = await api.get('/admin/logs', { params: filters });
  return response.data;
};
