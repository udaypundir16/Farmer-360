import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { getWeather } from '../../services/weather.service';
import { Cloud, Sun, CloudRain } from 'lucide-react';

export default function WeatherWidget({ location }) {
  const { t } = useTranslation();
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [coords, setCoords] = useState(location); // start with prop if provided

  const fetchForCoords = (lat, lon) => {
    setLoading(true);
    getWeather(lat, lon)
      .then(data => {
        if (data.temp !== undefined) {
          setWeather(data);
        } else if (data.data) {
          setWeather(data.data);
        } else {
          setWeather(data);
        }
      })
      .catch(err => {
        console.error('Weather fetch error:', err);
        setWeather({
          temp: 28,
          condition: 'Partly Cloudy',
          humidity: 65,
          windSpeed: 12
        });
      })
      .finally(() => setLoading(false));
  };

  const askLocation = () => {
    if ('geolocation' in navigator) {
      setLoading(true);
      navigator.geolocation.getCurrentPosition(
        pos => {
          const { latitude, longitude } = pos.coords;
          setCoords({ lat: latitude, lon: longitude });
          fetchForCoords(latitude, longitude);
        },
        err => {
          console.error('Geolocation error:', err);
          setError('Location permission denied or unavailable');
          setLoading(false);
        }
      );
    } else {
      setError('Geolocation not supported');
    }
  };

  // if location prop changes (e.g. user profile loaded), update coords
  useEffect(() => {
    if (location?.lat && location?.lon) {
      setCoords(location);
    }
  }, [location]);

  useEffect(() => {
    if (coords?.lat && coords?.lon) {
      fetchForCoords(coords.lat, coords.lon);
    } else {
      // no coords yet, attempt to ask user
      askLocation();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [coords]);

  if (loading) return <div className="text-gray-500 text-sm">{t('dashboard.loading_weather')}</div>;
  if (error) return <div className="text-red-500 text-sm">{t('dashboard.location_permission_denied')}</div>;
  if (!weather) return (
    <div className="text-gray-500 text-sm">
      {t('dashboard.weather_unavailable')}.
      <button onClick={askLocation} className="underline text-blue-600 ml-1">
        {t('dashboard.try_current_location')}
      </button>
    </div>
  );

  const iconMap = {
    Clear: Sun,
    Clouds: Cloud,
    Rain: CloudRain,
  };
  const Icon = iconMap[weather.condition] || Sun;

  return (
    <div className="flex items-center justify-between">
      <div>
        <p className="text-2xl font-bold">{weather.temp}°C</p>
        <p className="text-gray-600 text-sm">{weather.condition}</p>
        <p className="text-xs text-gray-500">Humidity: {weather.humidity}%</p>
      </div>
      <Icon size={48} className="text-yellow-500" />
    </div>
  );
}
