import { useState, useEffect } from 'react';
import { getPriceTrends } from '../services/market.service';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { TrendingUp, TrendingDown, DollarSign, BarChart3 } from 'lucide-react';
import Loader from '../components/ui/loader';
import { useTranslation } from 'react-i18next';

export default function MarketTrends() {
  const { t } = useTranslation();
  const [trends, setTrends] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTrend, setSelectedTrend] = useState(0);

  useEffect(() => {
    loadTrends();
  }, []);

  const loadTrends = async () => {
    try {
      setLoading(true);
      const data = await getPriceTrends();
      setTrends(data);
      if (data.length > 0) {
        setSelectedTrend(0);
      }
    } catch (error) {
      console.error('Error loading trends:', error);
    } finally {
      setLoading(false);
    }
  };

  const currentTrend = trends[selectedTrend] || {};

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-8">
      <div className="container mx-auto p-4">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600">
              <BarChart3 size={24} className="text-white" />
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                📈 Market Trends & Analysis
              </h1>
              <p className="text-gray-600 text-lg">Analyze price trends and market patterns</p>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <Card>
            <CardContent className="pt-6">
              <label className="block text-sm font-medium mb-2">Select Commodity to View Details</label>
              <select
                value={selectedTrend}
                onChange={(e) => setSelectedTrend(Number(e.target.value))}
                className="w-full p-2 border rounded-lg"
              >
                {trends.map((t, idx) => (
                  <option key={idx} value={idx}>{t.commodity}</option>
                ))}
              </select>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <label className="block text-sm font-medium mb-2">All Commodities Trends</label>
              <div className="text-sm text-gray-600 pt-2">
                Showing {trends.length} commodities with price analysis
              </div>
            </CardContent>
          </Card>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader />
          </div>
        ) : (
          <>
            {/* Stats Cards for Selected Commodity */}
            {trends.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <Card className="bg-gradient-to-br from-green-50 to-emerald-50">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Current Price</p>
                        <p className="text-2xl font-bold text-green-700">₹{currentTrend.latest_price}</p>
                      </div>
                      <DollarSign size={32} className="text-green-500 opacity-50" />
                    </div>
                  </CardContent>
                </Card>
                <Card className="bg-gradient-to-br from-blue-50 to-indigo-50">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Average Price</p>
                        <p className="text-2xl font-bold text-blue-700">₹{currentTrend.average_price}</p>
                      </div>
                      <BarChart3 size={32} className="text-blue-500 opacity-50" />
                    </div>
                  </CardContent>
                </Card>
                <Card className="bg-gradient-to-br from-yellow-50 to-amber-50">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Price Change</p>
                        <p className={`text-2xl font-bold flex items-center gap-1 ${currentTrend.trend === 'up' ? 'text-green-700' : 'text-red-700'}`}>
                          {currentTrend.trend === 'up' ? <TrendingUp size={20} /> : <TrendingDown size={20} />}
                          {currentTrend.percentChange}%
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card className="bg-gradient-to-br from-purple-50 to-pink-50">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Price Range</p>
                        <p className="text-2xl font-bold text-purple-700">₹{currentTrend.min_price} - ₹{currentTrend.max_price}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* All Commodities Trends Table */}
            <Card>
              <CardHeader>
                <CardTitle>All Commodities - Price Trends & Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="px-4 py-2 text-left">Commodity</th>
                        <th className="px-4 py-2 text-left">Current</th>
                        <th className="px-4 py-2 text-left">Average</th>
                        <th className="px-4 py-2 text-left">Min</th>
                        <th className="px-4 py-2 text-left">Max</th>
                        <th className="px-4 py-2 text-left">Change</th>
                        <th className="px-4 py-2 text-left">Trend</th>
                        <th className="px-4 py-2 text-left">Markets</th>
                      </tr>
                    </thead>
                    <tbody>
                      {trends.map((trend, idx) => (
                        <tr 
                          key={idx} 
                          className="border-b hover:bg-gray-50 cursor-pointer"
                          onClick={() => setSelectedTrend(idx)}
                        >
                          <td className="px-4 py-3 font-semibold">{trend.commodity}</td>
                          <td className="px-4 py-3 font-bold text-green-700">₹{trend.latest_price}</td>
                          <td className="px-4 py-3">₹{trend.average_price}</td>
                          <td className="px-4 py-3 text-blue-600">₹{trend.min_price}</td>
                          <td className="px-4 py-3 text-red-600">₹{trend.max_price}</td>
                          <td className={`px-4 py-3 font-semibold ${trend.trend === 'up' ? 'text-green-600' : trend.trend === 'down' ? 'text-red-600' : 'text-gray-600'}`}>
                            {trend.change > 0 ? '+' : ''}{trend.change} ({trend.percentChange}%)
                          </td>
                          <td className="px-4 py-3">
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              trend.trend === 'up' ? 'bg-green-100 text-green-700' : 
                              trend.trend === 'down' ? 'bg-red-100 text-red-700' : 
                              'bg-gray-100 text-gray-700'
                            }`}>
                              {trend.trend === 'up' ? '📈 Up' : trend.trend === 'down' ? '📉 Down' : '➡️ Stable'}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-center">{trend.markets_count}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  );
}
