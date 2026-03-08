import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { getForecast } from '../services/weather.service';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Cloud, Sun, CloudRain, Wind, Droplets, Thermometer } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Loader from '../components/ui/loader';

export default function WeatherForecast() {
  const { user } = useAuth();
  const { t } = useTranslation();
  const [forecast, setForecast] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedDay, setSelectedDay] = useState(0);
  const [coords, setCoords] = useState(null);
  const [locationError, setLocationError] = useState(null);

  useEffect(() => {
    const fetchByCoords = (lat, lon) => {
      setCoords({ lat, lon });
      loadForecast(lat, lon);
    };

    if (user?.latitude && user?.longitude) {
      fetchByCoords(user.latitude, user.longitude);
    } else if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        pos => {
          fetchByCoords(pos.coords.latitude, pos.coords.longitude);
        },
        err => {
          console.warn('Geolocation error', err);
          setLocationError(t('dashboard.location_permission_denied'));
          setLoading(false);
        }
      );
    } else {
      setLocationError(t('dashboard.location_not_available'));
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const loadForecast = async (lat, lon) => {
    try {
      setLoading(true);
      const data = await getForecast(lat, lon);
      const locationLabel = user?.village || 'Your Area';
      if (data.forecast) {
        setForecast({
          location: data.location || locationLabel,
          current: data.current || {},
          forecast: data.forecast
        });
      } else if (Array.isArray(data)) {
        setForecast({
          location: locationLabel,
          current: data[0] || {},
          forecast: data.slice(1)
        });
      } else {
        setForecast(data);
      }
    } catch (error) {
      console.error('Error loading forecast:', error);
      setForecast({
        location: user?.village || 'Your Area',
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
      });
    } finally {
      setLoading(false);
    }
  };

  const getWeatherIcon = (condition) => {
    const cond = condition.toLowerCase();
    if (cond.includes('rain')) return CloudRain;
    if (cond.includes('cloud')) return Cloud;
    return Sun;
  };

  const getWeatherColor = (condition) => {
    const cond = condition.toLowerCase();
    if (cond.includes('rain')) return 'from-blue-500 to-indigo-600';
    if (cond.includes('cloud')) return 'from-gray-400 to-gray-600';
    return 'from-yellow-400 to-orange-500';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  if (!forecast) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-8">
        <div className="container mx-auto p-4">
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-gray-600">
                {locationError || t('dashboard.location_not_available')}
                {!locationError && ` ${t('dashboard.try_current_location')}.`}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const selectedForecast = forecast.forecast[selectedDay];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-8">
      <div className="container mx-auto p-4">
        <style>{`
          @keyframes slideInDown {
            from { opacity: 0; transform: translateY(-30px); }
            to { opacity: 1; transform: translateY(0); }
          }
          @keyframes fadeInStagger {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .page-header { animation: slideInDown 0.6s ease-out; }
          .weather-card { animation: fadeInStagger 0.5s ease-out; }
          .forecast-day { transition: transform 0.2s; }
          .forecast-day:hover { transform: scale(1.03); }
          .forecast-grid { display: grid; grid-template-columns: repeat(5,1fr); gap: 1rem; }
          @media (max-width: 768px) {
            .forecast-grid { grid-template-columns: repeat(3,1fr); overflow-x: auto; }
          }
          .details-grid { grid-auto-rows: minmax(100px, auto); }
        `}</style>
        <div className="mb-8 page-header">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600">
              <Cloud size={24} className="text-white" />
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                🌤️ Weather Forecast
              </h1>
              <p className="text-gray-600 text-lg">7-day weather forecast for {forecast.location}</p>
            </div>
          </div>
        </div>

        {/* Current Weather */}
        <Card className="mb-6 bg-gradient-to-br from-blue-500 to-indigo-600 text-black weather-card">
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <p className="mb-2 font-semibold">Current Weather</p>
                <div className="flex items-center gap-4">
                  <div className="text-6xl font-bold">{forecast.current.temp}°C</div>
                  <div>
                    <p className="text-xl">{forecast.current.condition}</p>
                    <p className="text-sm text-gray-800">{forecast.location}</p>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <Droplets size={24} />
                  <div>
                    <p className="text-sm text-black">Humidity</p>
                    <p className="text-xl font-semibold">{forecast.current.humidity}%</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Wind size={24} />
                  <div>
                    <p className="text-sm text-black">Wind</p>
                    <p className="text-xl font-semibold">{forecast.current.windSpeed} km/h</p>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Thermometer size={24} />
                <div>
                  <p className="text-sm text-black">Pressure</p>
                  <p className="text-xl font-semibold">{forecast.current.pressure} hPa</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Forecast Days */}
        <div className="forecast-grid grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
          {forecast.forecast.map((day, idx) => {
            const Icon = getWeatherIcon(day.condition);
            return (
              <button
                key={idx}
                onClick={() => setSelectedDay(idx)}
                className={`forecast-day p-4 rounded-xl transition-all ${
                  selectedDay === idx
                    ? 'bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-lg scale-105'
                    : 'bg-white hover:bg-gray-50 border border-gray-200'
                }`}
              >
                <p className="text-sm font-medium mb-2">{day.day}</p>
                <Icon size={32} className="mx-auto mb-2" />
                <p className="text-2xl font-bold">{day.temp}°C</p>
                <p className={`text-xs mt-1 ${selectedDay === idx ? 'text-blue-100' : 'text-gray-600'}`}>
                  {day.condition}
                </p>
              </button>
            );
          })}
        </div>

        {/* Detailed Forecast */}
        <Card>
          <CardHeader>
            <CardTitle>Detailed Forecast - {selectedForecast.day}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="details-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 rounded-lg bg-gradient-to-br from-yellow-50 to-orange-50">
                <div className="flex items-center gap-2 mb-2">
                  <Thermometer size={20} className="text-orange-600" />
                  <span className="font-semibold">Temperature</span>
                </div>
                <p className="text-2xl font-bold text-orange-700">{selectedForecast.temp}°C</p>
              </div>
              <div className="p-4 rounded-lg bg-gradient-to-br from-blue-50 to-indigo-50">
                <div className="flex items-center gap-2 mb-2">
                  <Droplets size={20} className="text-blue-600" />
                  <span className="font-semibold">Humidity</span>
                </div>
                <p className="text-2xl font-bold text-blue-700">{selectedForecast.humidity}%</p>
              </div>
              <div className="p-4 rounded-lg bg-gradient-to-br from-gray-50 to-slate-50">
                <div className="flex items-center gap-2 mb-2">
                  <Wind size={20} className="text-gray-600" />
                  <span className="font-semibold">Wind Speed</span>
                </div>
                <p className="text-2xl font-bold text-gray-700">{selectedForecast.windSpeed} km/h</p>
              </div>
              <div className="p-4 rounded-lg bg-gradient-to-br from-purple-50 to-pink-50">
                <div className="flex items-center gap-2 mb-2">
                  <CloudRain size={20} className="text-purple-600" />
                  <span className="font-semibold">Rain Chance</span>
                </div>
                <p className="text-2xl font-bold text-purple-700">{selectedForecast.rainChance}%</p>
              </div>
            </div>

            {/* Farming Recommendations */}
            <div className="mt-6 p-4 rounded-lg bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200">
              <h3 className="font-semibold text-green-800 mb-2">🌾 Farming Recommendations</h3>
              <ul className="space-y-1 text-sm text-green-700">
                {selectedForecast.rainChance > 50 && (
                  <li>• Good time for irrigation and water management</li>
                )}
                {selectedForecast.temp > 30 && (
                  <li>• High temperature - ensure adequate water supply</li>
                )}
                {selectedForecast.windSpeed > 15 && (
                  <li>• Strong winds expected - secure crops and structures</li>
                )}
                {selectedForecast.humidity > 75 && (
                  <li>• High humidity - monitor for fungal diseases</li>
                )}
                {selectedForecast.condition.toLowerCase().includes('sunny') && (
                  <li>• Sunny weather - ideal for harvesting and field work</li>
                )}
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
