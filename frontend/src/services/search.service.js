import api from './api';

export const globalSearch = async (query) => {
  const response = await api.get('/search/global', { params: { q: query } });
  return response.data;
};

export const searchSchemes = async (query, filters = {}) => {
  const response = await api.get('/search/schemes', { 
    params: { q: query, ...filters } 
  });
  return response.data;
};

export const searchCommodities = async (query) => {
  const response = await api.get('/search/commodities', { params: { q: query } });
  return response.data;
};

export const searchMarkets = async (query, state = '') => {
  const response = await api.get('/search/markets', { 
    params: { q: query, state } 
  });
  return response.data;
};

export const getSearchSuggestions = async (query, type = 'all') => {
  const response = await api.get('/search/suggestions', { 
    params: { q: query, type } 
  });
  return response.data;
};

export const getTrendingSearches = async () => {
  const response = await api.get('/search/trending');
  return response.data;
};
