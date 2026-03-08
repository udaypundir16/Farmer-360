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
      location: { lat: parseFloat(lat), lon: parseFloat(lon) }
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
    
    const forecast = await weatherService.getForecast(parseFloat(lat), parseFloat(lon));
    res.json({
      success: true,
      location: { lat: parseFloat(lat), lon: parseFloat(lon) },
      current: forecast[0] || {},
      forecast: forecast.slice(1) || []
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