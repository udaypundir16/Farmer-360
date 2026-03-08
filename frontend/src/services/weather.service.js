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
    // Transform response to match component expectations
    if (response.data.forecast) {
      let loc = response.data.location || 'Your Area';
      // backend may return {lat,lon}; convert to readable string
      if (loc && typeof loc === 'object') {
        const { lat, lon } = loc;
        loc = lat && lon ? `${lat.toFixed(2)}, ${lon.toFixed(2)}` : 'Your Area';
      }
      return {
        location: loc,
        current: response.data.current || {},
        forecast: response.data.forecast || []
      };
    }
    return response.data;
  } catch (error) {
    console.error('Forecast API error:', error);
    // Return mock forecast if API fails
    return {
      location: 'Your Area',
      current: {
        temp: 28,
        condition: 'Partly Cloudy',
        humidity: 65,
        windSpeed: 12,
        pressure: 1013
      },
      forecast: [
        { day: 'Today', temp: 28, condition: 'Partly Cloudy', humidity: 65, windSpeed: 12, rainChance: 20 },
        { day: 'Tomorrow', temp: 30, condition: 'Sunny', humidity: 60, windSpeed: 10, rainChance: 10 },
        { day: 'Day 3', temp: 27, condition: 'Cloudy', humidity: 70, windSpeed: 15, rainChance: 40 },
        { day: 'Day 4', temp: 26, condition: 'Rainy', humidity: 80, windSpeed: 18, rainChance: 70 },
        { day: 'Day 5', temp: 29, condition: 'Sunny', humidity: 55, windSpeed: 8, rainChance: 5 },
      ]
    };
  }
};
