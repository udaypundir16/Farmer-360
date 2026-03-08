import api from './api';

export const getCropCalendar = async (filters = {}) => {
  const response = await api.get('/crop/calendar', { params: filters });
  return response.data;
};

export const getCropCalendarByMonth = async (month) => {
  const response = await api.get('/crop/calendar', { params: { month } });
  return response.data;
};

export const getCropCalendarByCrop = async (crop) => {
  const response = await api.get('/crop/calendar', { params: { crop } });
  return response.data;
};

export const getCropActivities = async (cropId, month) => {
  const response = await api.get(`/crop/activities/${cropId}/${month}`);
  return response.data;
};

export const getCropRecommendations = async (state, season) => {
  const response = await api.get('/crop/recommendations', { params: { state, season } });
  return response.data;
};
