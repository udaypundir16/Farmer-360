import api from './api';

export const getWeather = async (lat, lon) => {
  try {
    const response = await api.get('/weather/current', { params: { lat, lon } });
    return response.data;
  } catch (error) {
    console.error('Weather API error:', error);
    // Return mock data if API fails
    return {
      temp: 28,
      condition: 'Partly Cloudy',
      description: 'partly cloudy',
      humidity: 65,
      windSpeed: 12,
      pressure: 1013,
    };
  }
};

export const getForecast = async (lat, lon) => {
  try {
    const response = await api.get('/weather/forecast', { params: { lat, lon } });
    if (response.data) {
      let loc = response.data.location;
      if (!loc || typeof loc === 'object') {
        loc = response.data.city ? `${response.data.city}, ${response.data.country || 'IN'}` : `${lat.toFixed(2)}°, ${lon.toFixed(2)}°`;
      }
      return {
        location: loc,
        city: response.data.city,
        country: response.data.country,
        coordinates: response.data.coordinates || { lat, lon },
        current: response.data.current || (Array.isArray(response.data.forecast) ? response.data.forecast[0] : {}),
        forecast: response.data.forecast || []
      };
    }
    return response.data;
  } catch (error) {
    console.error('Forecast API error:', error);
    throw error;
  }
};
