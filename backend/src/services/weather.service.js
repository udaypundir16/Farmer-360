const axios = require('axios');
const cache = require('../utils/cache');

// Check if OpenWeather API key is available
const hasWeatherKey = process.env.OPENWEATHER_API_KEY && 
                      process.env.OPENWEATHER_API_KEY.length > 20 &&
                      !process.env.OPENWEATHER_API_KEY.includes('your_');

// Generate mock weather data based on location
const getMockWeather = (lat, lon) => {
  // Simple mock data - in production, use real API
  const baseTemp = 25 + Math.sin(Date.now() / 86400000) * 5; // Varies by day
  const conditions = ['Clear', 'Clouds', 'Partly Cloudy'];
  const condition = conditions[Math.floor(Math.random() * conditions.length)];
  
  return {
    temp: Math.round(baseTemp),
    condition: condition,
    description: condition.toLowerCase(),
    humidity: 60 + Math.floor(Math.random() * 20),
    windSpeed: Math.round(10 + Math.random() * 10),
    pressure: 1013 + Math.floor(Math.random() * 10),
  };
};

const getMockForecast = (lat, lon) => {
  const days = ['Today', 'Tomorrow', 'Day 3', 'Day 4', 'Day 5'];
  const conditions = ['Sunny', 'Partly Cloudy', 'Cloudy', 'Rainy'];
  
  return days.map((day, idx) => {
    const baseTemp = 25 + Math.sin((Date.now() + idx * 86400000) / 86400000) * 5;
    return {
      day: day,
      temp: Math.round(baseTemp),
      condition: conditions[Math.floor(Math.random() * conditions.length)],
      humidity: 60 + Math.floor(Math.random() * 20),
      windSpeed: Math.round(10 + Math.random() * 10),
      rainChance: Math.floor(Math.random() * 30),
    };
  });
};

exports.getCurrentWeather = async (lat, lon) => {
  if (!lat || !lon) {
    throw new Error('Latitude and longitude are required');
  }

  const cacheKey = `weather_${lat}_${lon}`;
  
  try {
    // Try to get from cache first
    const cached = await cache.get(cacheKey);
    if (cached) {
      return cached;
    }
  } catch (error) {
    console.warn('Cache get error:', error.message);
  }

  // If API key is available, use real API
  if (hasWeatherKey) {
    try {
      const apiKey = process.env.OPENWEATHER_API_KEY;
      const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
      
      const response = await axios.get(url, { timeout: 5000 });
      const data = {
        temp: Math.round(response.data.main.temp),
        condition: response.data.weather[0].main,
        description: response.data.weather[0].description,
        humidity: response.data.main.humidity,
        windSpeed: Math.round(response.data.wind.speed * 3.6), // Convert m/s to km/h
        pressure: response.data.main.pressure,
      };
      
      // Cache the result
      try {
        await cache.set(cacheKey, data, 1800); // 30 minutes
      } catch (error) {
        console.warn('Cache set error:', error.message);
      }
      
      return data;
    } catch (error) {
      console.error('OpenWeather API Error:', error.message);
      // Fall through to mock data
    }
  }

  // Use mock data if API is not available or fails
  console.log('⚠ Using mock weather data (OpenWeather API not configured or failed)');
  const mockData = getMockWeather(lat, lon);
  
  // Cache mock data for shorter duration
  try {
    await cache.set(cacheKey, mockData, 300); // 5 minutes for mock data
  } catch (error) {
    // Ignore cache errors
  }
  
  return mockData;
};

exports.getForecast = async (lat, lon) => {
  if (!lat || !lon) {
    throw new Error('Latitude and longitude are required');
  }

  const cacheKey = `forecast_${lat}_${lon}`;
  
  try {
    // Try to get from cache first
    const cached = await cache.get(cacheKey);
    if (cached) {
      return cached;
    }
  } catch (error) {
    console.warn('Cache get error:', error.message);
  }

  // If API key is available, use real API
  if (hasWeatherKey) {
    try {
      const apiKey = process.env.OPENWEATHER_API_KEY;
      const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
      
      const response = await axios.get(url, { timeout: 5000 });
      
      // Group forecast by day (OpenWeather returns 3-hour intervals)
      const dailyForecast = {};
      response.data.list.forEach(item => {
        const date = new Date(item.dt * 1000);
        const dayKey = date.toDateString();
        
        if (!dailyForecast[dayKey]) {
          dailyForecast[dayKey] = {
            day: date.toLocaleDateString('en-US', { weekday: 'long' }),
            temp: item.main.temp,
            condition: item.weather[0].main,
            humidity: item.main.humidity,
            windSpeed: Math.round(item.wind.speed * 3.6),
            rainChance: item.pop ? Math.round(item.pop * 100) : 0,
            items: []
          };
        }
        dailyForecast[dayKey].items.push(item);
      });
      
      // Convert to array and take first 5 days
      const forecast = Object.values(dailyForecast).slice(0, 5).map((day, idx) => ({
        day: idx === 0 ? 'Today' : idx === 1 ? 'Tomorrow' : `Day ${idx + 1}`,
        temp: Math.round(day.temp),
        condition: day.condition,
        humidity: day.humidity,
        windSpeed: day.windSpeed,
        rainChance: day.rainChance,
      }));
      
      // Cache the result
      try {
        await cache.set(cacheKey, forecast, 3600); // 1 hour
      } catch (error) {
        console.warn('Cache set error:', error.message);
      }
      
      return forecast;
    } catch (error) {
      console.error('OpenWeather Forecast API Error:', error.message);
      // Fall through to mock data
    }
  }

  // Use mock data if API is not available or fails
  console.log('⚠ Using mock forecast data (OpenWeather API not configured or failed)');
  const mockForecast = getMockForecast(lat, lon);
  
  // Cache mock data for shorter duration
  try {
    await cache.set(cacheKey, mockForecast, 300); // 5 minutes for mock data
  } catch (error) {
    // Ignore cache errors
  }
  
  return mockForecast;
};