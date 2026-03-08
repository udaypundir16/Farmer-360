import api from './api';

export const register = async (userData) => {
  const response = await api.post('/auth/register', userData);
  localStorage.setItem('token', response.data.token);
  return response.data;
};

export const login = async (phone, password) => {
  const response = await api.post('/auth/login', { phone, password });
  localStorage.setItem('token', response.data.token);
  return response.data;
};

export const logout = () => {
  localStorage.removeItem('token');
};

export const verifyOTP = async (phone, otp) => {
  const response = await api.post('/auth/verify-otp', { phone, otp });
  localStorage.setItem('token', response.data.token);
  return response.data;
};

export const resendOTP = async (phone) => {
  const response = await api.post('/auth/resend-otp', { phone });
  return response.data;
};

export const resetPassword = async (phone, newPassword) => {
  const response = await api.post('/auth/reset-password', { phone, newPassword });
  return response.data;
};

export const refreshToken = async () => {
  const response = await api.post('/auth/refresh-token');
  localStorage.setItem('token', response.data.token);
  return response.data;
};

export const getCurrentUser = async () => {
  const response = await api.get('/auth/me');
  return response.data;
};
