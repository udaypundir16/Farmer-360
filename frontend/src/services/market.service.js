import api from './api';

export const getLatestPrices = async (filters = {}) => {
  const response = await api.get('/market/latest', { params: filters });
  return response.data;
};

export const getPriceHistory = async (commodity, market, days = 30) => {
  const response = await api.get('/market/history', { params: { commodity, market, days } });
  return response.data;
};

export const getPriceTrends = async (filters = {}) => {
  const response = await api.get('/market/trends', { params: filters });
  return response.data;
};
