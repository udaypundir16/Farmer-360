const weatherService = require('../services/weather.service');

exports.getCurrentWeather = async (req, res, next) => {
  try {
    const { lat, lon } = req.query;
    if (!lat || !lon) {
      return res.status(400).json({ 
        success: false,
        message: 'Latitude and longitude are required',
        example: '/weather/current?lat=28.6139&lon=77.2090'
      });
    }
    
    const weather = await weatherService.getCurrentWeather(parseFloat(lat), parseFloat(lon));
    res.json({
      success: true,
      ...weather,
      location: weather.location || `${parseFloat(lat).toFixed(2)}, ${parseFloat(lon).toFixed(2)}`
    });
  } catch (error) {
    console.error('Weather controller error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to fetch weather data',
      error: error.message 
    });
  }
};

exports.getForecast = async (req, res, next) => {
  try {
    const { lat, lon } = req.query;
    if (!lat || !lon) {
      return res.status(400).json({ 
        success: false,
        message: 'Latitude and longitude are required',
        example: '/weather/forecast?lat=28.6139&lon=77.2090'
      });
    }
    
    const data = await weatherService.getForecast(parseFloat(lat), parseFloat(lon));
    
    if (data.forecast) {
      return res.json({
        success: true,
        location: data.location || (data.city ? `${data.city}, ${data.country || 'IN'}` : `${parseFloat(lat).toFixed(2)}, ${parseFloat(lon).toFixed(2)}`),
        city: data.city || null,
        country: data.country || 'IN',
        coordinates: data.coordinates || { lat: parseFloat(lat), lon: parseFloat(lon) },
        current: data.current || (Array.isArray(data.forecast) ? data.forecast[0] : {}),
        forecast: data.forecast
      });
    }

    // Fallback if array was returned
    const forecastArray = Array.isArray(data) ? data : [];
    res.json({
      success: true,
      location: `${parseFloat(lat).toFixed(2)}, ${parseFloat(lon).toFixed(2)}`,
      current: forecastArray[0] || {},
      forecast: forecastArray
    });
  } catch (error) {
    console.error('Forecast controller error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to fetch forecast data',
      error: error.message 
    });
  }
};