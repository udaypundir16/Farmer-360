import api from './api';

export const getUserProfile = async () => {
  const response = await api.get('/users/profile');
  return response.data;
};

export const updateProfile = async (profileData) => {
  const response = await api.put('/users/profile', profileData);
  return response.data;
};

export const changePassword = async (oldPassword, newPassword) => {
  const response = await api.post('/users/change-password', {
    oldPassword,
    newPassword,
  });
  return response.data;
};

export const getNotificationPrefs = async () => {
  const response = await api.get('/users/notification-preferences');
  return response.data;
};

export const updateNotificationPrefs = async (preferences) => {
  const response = await api.put('/users/notification-preferences', preferences);
  return response.data;
};

export const getUserApplications = async () => {
  const response = await api.get('/users/applications');
  return response.data;
};

export const getUserAlerts = async () => {
  const response = await api.get('/users/alerts');
  return response.data;
};

export const deleteAccount = async (password) => {
  const response = await api.post('/users/delete-account', { password });
  return response.data;
};
