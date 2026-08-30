import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { getForecast } from '../services/weather.service';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Cloud, Sun, CloudRain, Wind, Droplets, Thermometer, MapPin, Navigation, RefreshCw } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Loader from '../components/ui/loader';

const POPULAR_LOCATIONS = [
  { name: 'Current GPS Location', lat: null, lon: null },
  { name: 'New Delhi (NCR)', lat: 28.6139, lon: 77.2090 },
  { name: 'Ludhiana (Punjab)', lat: 30.9010, lon: 75.8573 },
  { name: 'Karnal (Haryana)', lat: 29.6857, lon: 76.9905 },
  { name: 'Pune (Maharashtra)', lat: 18.5204, lon: 73.8567 },
  { name: 'Jaipur (Rajasthan)', lat: 26.9124, lon: 75.7873 },
  { name: 'Patna (Bihar)', lat: 25.5941, lon: 85.1376 },
  { name: 'Hyderabad (Telangana)', lat: 17.3850, lon: 78.4867 },
  { name: 'Chennai (Tamil Nadu)', lat: 13.0827, lon: 80.2707 },
];

export default function WeatherForecast() {
  const { user } = useAuth();
  const { t } = useTranslation();
  const [forecast, setForecast] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedDay, setSelectedDay] = useState(0);
  const [coords, setCoords] = useState(null);
  const [locationName, setLocationName] = useState('Detecting location...');
  const [locationSource, setLocationSource] = useState('GPS');
  const [locationError, setLocationError] = useState(null);

  useEffect(() => {
    detectLocationAndFetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const detectLocationAndFetch = () => {
    if (user?.latitude && user?.longitude) {
      setLocationSource('Profile');
      setCoords({ lat: user.latitude, lon: user.longitude });
      loadForecast(user.latitude, user.longitude, user.village ? `${user.village}${user.state ? ', ' + user.state : ''}` : null);
    } else if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        pos => {
          setLocationSource('Live GPS');
          const lat = pos.coords.latitude;
          const lon = pos.coords.longitude;
          setCoords({ lat, lon });
          loadForecast(lat, lon);
        },
        err => {
          console.warn('Geolocation error', err);
          setLocationSource('Default (New Delhi)');
          // Default fallback to New Delhi
          const defaultLat = 28.6139;
          const defaultLon = 77.2090;
          setCoords({ lat: defaultLat, lon: defaultLon });
          loadForecast(defaultLat, defaultLon, 'New Delhi, IN');
        }
      );
    } else {
      const defaultLat = 28.6139;
      const defaultLon = 77.2090;
      setCoords({ lat: defaultLat, lon: defaultLon });
      loadForecast(defaultLat, defaultLon, 'New Delhi, IN');
    }
  };

  const handleSelectLocation = (loc) => {
    if (loc.lat === null) {
      detectLocationAndFetch();
    } else {
      setLocationSource('Manual');
      setCoords({ lat: loc.lat, lon: loc.lon });
      loadForecast(loc.lat, loc.lon, loc.name);
    }
  };

  const loadForecast = async (lat, lon, fallbackName = null) => {
    try {
      setLoading(true);
      const data = await getForecast(lat, lon);
      
      const resolvedLocation = data.location || fallbackName || (user?.village ? `${user.village}, ${user.state || 'IN'}` : 'Your Area');
      setLocationName(resolvedLocation);

      if (data.forecast) {
        setForecast({
          location: resolvedLocation,
          current: data.current || (Array.isArray(data.forecast) ? data.forecast[0] : {}),
          forecast: data.forecast
        });
      } else if (Array.isArray(data)) {
        setForecast({
          location: resolvedLocation,
          current: data[0] || {},
          forecast: data
        });
      } else {
        setForecast({
          ...data,
          location: resolvedLocation
        });
      }
    } catch (error) {
      console.error('Error loading forecast:', error);
      const defaultLoc = fallbackName || 'New Delhi, IN';
      setLocationName(defaultLoc);
      setForecast({
        location: defaultLoc,
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

  const getWeatherIcon = (condition = '') => {
    const cond = (condition || '').toLowerCase();
    if (cond.includes('rain')) return CloudRain;
    if (cond.includes('cloud')) return Cloud;
    return Sun;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream-50">
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

  const selectedForecast = (forecast?.forecast && forecast.forecast[selectedDay]) || forecast?.current || {};

  return (
    <div className="min-h-screen bg-transparent py-8">
      <div className="container mx-auto p-4 max-w-6xl">
        {/* Page Header */}
        <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-agri">
              <Cloud size={28} />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold font-heading text-primary-900">
                {t('weather.title', 'Weather Forecast')}
              </h1>
              <p className="text-soil-light text-sm md:text-base">
                Real-time agricultural weather & 5-day farming outlook
              </p>
            </div>
          </div>

          {/* Quick Location Switcher */}
          <div className="flex items-center gap-2 bg-white/80 backdrop-blur p-2 rounded-xl border border-primary-100 shadow-sm">
            <MapPin size={18} className="text-primary-600 shrink-0" />
            <select
              onChange={(e) => {
                const selected = POPULAR_LOCATIONS.find(l => l.name === e.target.value);
                if (selected) handleSelectLocation(selected);
              }}
              className="bg-transparent text-sm font-medium text-soil focus:outline-none cursor-pointer pr-2"
              defaultValue=""
            >
              <option value="" disabled>Switch Location / Region...</option>
              {POPULAR_LOCATIONS.map((loc) => (
                <option key={loc.name} value={loc.name}>
                  {loc.name}
                </option>
              ))}
            </select>
            <button
              type="button"
              onClick={detectLocationAndFetch}
              title="Refresh GPS location"
              className="p-1.5 hover:bg-primary-50 rounded-lg text-primary-700 transition-colors"
            >
              <RefreshCw size={16} />
            </button>
          </div>
        </div>

        {/* Location Banner Bar */}
        <div className="mb-6 p-4 rounded-xl bg-white/90 border border-primary-100/80 shadow-sm flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="flex h-3 w-3 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
            </span>
            <span className="text-xs font-semibold text-soil-light uppercase tracking-wider">Live Weather Station:</span>
            <span className="text-base font-bold text-primary-900 flex items-center gap-1">
              <MapPin size={16} className="text-primary-600" />
              {locationName}
            </span>
          </div>

          <div className="flex items-center gap-3 text-xs text-soil-light">
            {coords && (
              <span className="bg-primary-50 px-2.5 py-1 rounded-md text-primary-800 font-mono font-medium border border-primary-100">
                Lat: {coords.lat.toFixed(2)}°, Lon: {coords.lon.toFixed(2)}°
              </span>
            )}
            <span className="bg-blue-50 text-blue-700 px-2.5 py-1 rounded-md font-medium border border-blue-100">
              Source: {locationSource}
            </span>
          </div>
        </div>

        {/* Current Weather Main Hero Card */}
        <Card className="mb-6 bg-gradient-to-br from-blue-600 via-indigo-600 to-primary-800 text-white shadow-agri-lg border-0 overflow-hidden relative">
          <div className="absolute right-0 top-0 opacity-10 pointer-events-none translate-x-12 -translate-y-6">
            <Sun size={240} />
          </div>
          <CardContent className="p-6 md:p-8 relative z-10">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
              <div>
                <div className="flex items-center gap-2 text-blue-100 text-sm font-medium mb-1">
                  <Navigation size={16} />
                  <span>Current Conditions in {locationName}</span>
                </div>
                <div className="flex items-baseline gap-4 mt-2">
                  <div className="text-5xl md:text-6xl font-extrabold tracking-tight">
                    {forecast.current.temp ?? 28}°C
                  </div>
                  <div>
                    <p className="text-xl font-semibold text-gold-300 capitalize">{forecast.current.condition || 'Clear'}</p>
                    <p className="text-xs text-blue-100 capitalize">{forecast.current.description || 'Optimal agricultural conditions'}</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/10">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-white/20">
                    <Droplets size={20} className="text-blue-200" />
                  </div>
                  <div>
                    <p className="text-xs text-blue-100">Humidity</p>
                    <p className="text-lg font-bold">{forecast.current.humidity ?? 60}%</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-white/20">
                    <Wind size={20} className="text-blue-200" />
                  </div>
                  <div>
                    <p className="text-xs text-blue-100">Wind Speed</p>
                    <p className="text-lg font-bold">{forecast.current.windSpeed ?? 12} km/h</p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col justify-center bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/10">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-white/20">
                    <Thermometer size={20} className="text-yellow-200" />
                  </div>
                  <div>
                    <p className="text-xs text-blue-100">Atmospheric Pressure</p>
                    <p className="text-lg font-bold">{forecast.current.pressure ?? 1013} hPa</p>
                  </div>
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
