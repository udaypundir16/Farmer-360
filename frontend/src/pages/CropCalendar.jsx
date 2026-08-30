import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Calendar, Sprout, Droplets, Sun, Wind, Loader } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import * as cropService from '../services/crop.service';

export default function CropCalendar() {
  const { t } = useTranslation();
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedCrop, setSelectedCrop] = useState('all');
  const [crops, setCrops] = useState([]);
  const [weatherData, setWeatherData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  // Fetch crop calendar data from API
  useEffect(() => {
    const fetchCropData = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await cropService.getCropCalendar();
        setCrops(data.crops || []);
        setWeatherData(data.allMonthsWeather || []);
      } catch (err) {
        console.error('Error fetching crop calendar:', err);
        setError('Failed to load crop calendar data');
        // Fallback to default crops if API fails
        setCrops([
          { id: 'wheat', name: 'Wheat', season: 'Rabi', months: [10, 11, 0, 1, 2, 3], activities: {} },
          { id: 'rice', name: 'Rice', season: 'Kharif', months: [5, 6, 7, 8, 9], activities: {} },
          { id: 'cotton', name: 'Cotton', season: 'Kharif', months: [5, 6, 7, 8, 9, 10], activities: {} },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchCropData();
  }, []);

  return (
    <div className="min-h-screen bg-transparent py-8">
      <div className="container mx-auto p-4">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 rounded-full bg-gradient-to-br from-green-500 to-emerald-600">
              <Calendar size={24} className="text-white" />
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                🌾 Crop Calendar
              </h1>
              <p className="text-gray-600 text-lg">Plan your farming activities month by month</p>
            </div>
          </div>
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-red-700 text-sm">
              {error}
            </div>
          )}
        </div>

        {loading ? (
          <div className="flex items-center justify-center min-h-64">
            <div className="text-center">
              <Loader size={40} className="text-green-600 animate-spin mx-auto mb-4" />
              <p className="text-gray-600">Loading crop calendar data...</p>
            </div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Month Selector */}
              <Card className="lg:col-span-1">
                <CardHeader>
                  <CardTitle>Select Month</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-2">
                    {months.map((month, idx) => (
                      <button
                        key={idx}
                        onClick={() => setSelectedMonth(idx)}
                        className={`p-3 rounded-lg text-sm font-medium transition-all ${
                          selectedMonth === idx
                            ? 'bg-green-600 text-white shadow-lg scale-105'
                            : 'bg-gray-100 hover:bg-gray-200'
                        }`}
                      >
                        {month.slice(0, 3)}
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Crop Filter */}
              <Card className="lg:col-span-1">
                <CardHeader>
                  <CardTitle>Filter by Crop</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <button
                      onClick={() => setSelectedCrop('all')}
                      className={`w-full p-3 rounded-lg text-left transition-all ${
                        selectedCrop === 'all'
                          ? 'bg-green-600 text-white'
                          : 'bg-gray-100 hover:bg-gray-200'
                      }`}
                    >
                      All Crops
                    </button>
                    {crops.map(crop => (
                      <button
                        key={crop.id}
                        onClick={() => setSelectedCrop(crop.id)}
                        className={`w-full p-3 rounded-lg text-left transition-all ${
                          selectedCrop === crop.id
                            ? 'bg-green-600 text-white'
                            : 'bg-gray-100 hover:bg-gray-200'
                        }`}
                      >
                        {crop.name} <Badge className="ml-2">{crop.season}</Badge>
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Current Month Info */}
              <Card className="lg:col-span-1">
                <CardHeader>
                  <CardTitle>Current Month: {months[selectedMonth]}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {weatherData.length > 0 && weatherData[selectedMonth] ? (
                      <>
                        <div className="flex items-center gap-2">
                          <Sun size={20} className="text-yellow-500" />
                          <span className="text-sm">Temperature: {weatherData[selectedMonth].temp}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Droplets size={20} className="text-blue-500" />
                          <span className="text-sm">Rainfall: {weatherData[selectedMonth].rainfall}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Wind size={20} className="text-gray-500" />
                          <span className="text-sm">Humidity: {weatherData[selectedMonth].humidity}</span>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="flex items-center gap-2">
                          <Sun size={20} className="text-yellow-500" />
                          <span className="text-sm">Average Temperature: 25-30°C</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Droplets size={20} className="text-blue-500" />
                          <span className="text-sm">Rainfall: Moderate</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Wind size={20} className="text-gray-500" />
                          <span className="text-sm">Humidity: 60-70%</span>
                        </div>
                      </>
                    )}
                  </div>
            </CardContent>
          </Card>
            </div>

            {/* Activities for Selected Month */}
            <div className="mt-8">
              <h2 className="text-2xl font-bold mb-4">Activities for {months[selectedMonth]}</h2>
              {(() => {
                const filteredCrops = selectedCrop === 'all' 
                  ? crops 
                  : crops.filter(c => c.id === selectedCrop);

                const currentMonthActivities = filteredCrops
                  .filter(crop => crop.months.includes(selectedMonth))
                  .map(crop => ({
                    crop: crop.name,
                    season: crop.season,
                    activities: crop.activities?.[selectedMonth] || { general: 'Regular maintenance activities' }
                  }));

                return currentMonthActivities.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {currentMonthActivities.map((item, idx) => (
                      <Card key={idx} className="border-green-200">
                        <CardHeader>
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-lg">{item.crop}</CardTitle>
                            <Badge className="bg-green-100 text-green-800">{item.season}</Badge>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-2">
                            {Object.entries(item.activities).map(([key, value]) => (
                              <div key={key} className="flex items-start gap-2">
                                <Sprout size={16} className="text-green-600 mt-1" />
                                <div>
                                  <span className="font-semibold capitalize">{key}:</span>
                                  <span className="ml-2 text-gray-700">{value}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <Card>
                    <CardContent className="py-8 text-center text-gray-500">
                      No active crops for {months[selectedMonth]}. Select a different month or crop.
                    </CardContent>
                  </Card>
                );
              })()}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
