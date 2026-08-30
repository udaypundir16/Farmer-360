import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { getPriceTrends, getPriceHistory } from '../services/market.service';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import {
  AreaChart,
  Area,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  BarChart3,
  ArrowLeft,
  Calendar,
  Layers,
  Search
} from 'lucide-react';
import Loader from '../components/ui/loader';
import { useTranslation } from 'react-i18next';

export default function MarketTrends() {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const queryCommodity = searchParams.get('commodity');
  const queryMarket = searchParams.get('market');

  const [trends, setTrends] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCommodity, setSelectedCommodity] = useState('');
  const [selectedMarket, setSelectedMarket] = useState('');
  const [historyData, setHistoryData] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [timeRange, setTimeRange] = useState(30); // 7, 15, 30, 60
  const [tableSearch, setTableSearch] = useState('');

  // Load all commodity trends on mount
  useEffect(() => {
    window.scrollTo(0, 0);
    loadTrends();
  }, []);

  // Scroll to top of graph page whenever selected commodity changes
  useEffect(() => {
    if (selectedCommodity) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [selectedCommodity]);

  const loadTrends = async () => {
    try {
      setLoading(true);
      const data = await getPriceTrends();
      setTrends(data || []);

      if (data && data.length > 0) {
        // If a query parameter was passed, find and select it
        let initialCommodity = data[0].commodity;
        if (queryCommodity) {
          const found = data.find(
            (item) => item.commodity.toLowerCase() === queryCommodity.toLowerCase()
          );
          if (found) {
            initialCommodity = found.commodity;
          }
        }
        setSelectedCommodity(initialCommodity);
        setSelectedMarket(queryMarket || '');
      }
    } catch (error) {
      console.error('Error loading market trends:', error);
    } finally {
      setLoading(false);
    }
  };

  // Sync state if URL search parameters change
  useEffect(() => {
    if (queryCommodity && trends.length > 0) {
      const match = trends.find(
        (t) => t.commodity.toLowerCase() === queryCommodity.toLowerCase()
      );
      if (match) {
        setSelectedCommodity(match.commodity);
        setSelectedMarket(queryMarket || '');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  }, [queryCommodity, queryMarket, trends]);

  // Load price history whenever selected commodity, market, or time range changes
  useEffect(() => {
    if (!selectedCommodity) return;

    const fetchHistory = async () => {
      try {
        setHistoryLoading(true);
        const rawHistory = await getPriceHistory(selectedCommodity, selectedMarket, timeRange);

        if (rawHistory && rawHistory.length > 0) {
          // Format history for Recharts
          const formatted = rawHistory.map((item) => ({
            date: item.price_date
              ? new Date(item.price_date).toLocaleDateString('en-IN', {
                  month: 'short',
                  day: 'numeric'
                })
              : 'N/A',
            rawDate: item.price_date,
            modalPrice: item.modal_price || 0,
            minPrice: item.min_price || item.modal_price || 0,
            maxPrice: item.max_price || item.modal_price || 0,
            market: item.market || 'General'
          }));
          setHistoryData(formatted);
        } else {
          // Fallback points based on current trend metrics for smooth visualization
          const current = trends.find((t) => t.commodity === selectedCommodity);
          if (current) {
            const today = new Date();
            const fallbackPoints = [];
            const pointsCount = Math.min(timeRange, 7);
            for (let i = pointsCount - 1; i >= 0; i--) {
              const d = new Date(today);
              d.setDate(d.getDate() - i * 3);
              const variance = (Math.random() - 0.5) * (current.latest_price * 0.05);
              fallbackPoints.push({
                date: d.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' }),
                rawDate: d.toISOString(),
                modalPrice: Math.round(current.latest_price + variance),
                minPrice: current.min_price || Math.round((current.latest_price + variance) * 0.92),
                maxPrice: current.max_price || Math.round((current.latest_price + variance) * 1.08),
                market: selectedMarket || 'General'
              });
            }
            setHistoryData(fallbackPoints);
          } else {
            setHistoryData([]);
          }
        }
      } catch (error) {
        console.error('Error fetching price history:', error);
      } finally {
        setHistoryLoading(false);
      }
    };

    fetchHistory();
  }, [selectedCommodity, selectedMarket, timeRange, trends]);

  const currentTrend = trends.find((t) => t.commodity === selectedCommodity) || trends[0] || {};

  const handleSelectCommodity = (commodity, market = '') => {
    setSelectedCommodity(commodity);
    setSelectedMarket(market);
    setSearchParams({ commodity, ...(market ? { market } : {}) });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const filteredTrends = trends.filter((t) =>
    t.commodity.toLowerCase().includes(tableSearch.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-transparent py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Navigation & Header */}
        <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <Link
              to="/markets"
              className="inline-flex items-center gap-2 text-primary-700 hover:text-primary-800 font-semibold mb-2 transition-colors"
            >
              <ArrowLeft size={18} />
              Back to Market Mandi Prices
            </Link>
            <h1 className="text-3xl md:text-5xl font-bold font-heading text-primary-900 flex items-center gap-3">
              <span>📈</span>
              <span>{selectedCommodity || 'Commodity'} Price Graph</span>
            </h1>
            <p className="text-soil-light text-base mt-1">
              Historical price trends, volatility analysis, and mandi comparisons
            </p>
          </div>

          {/* Quick Commodity Selector */}
          {trends.length > 0 && (
            <div className="flex items-center gap-2 bg-white p-2 rounded-xl shadow-sm border border-primary-100">
              <label className="text-xs font-bold text-soil-light px-2 uppercase tracking-wide">
                Commodity:
              </label>
              <select
                value={selectedCommodity}
                onChange={(e) => handleSelectCommodity(e.target.value)}
                className="bg-cream-50 font-semibold text-primary-900 border border-primary-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                {trends.map((t, idx) => (
                  <option key={idx} value={t.commodity}>
                    {t.commodity}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-28">
            <Loader />
          </div>
        ) : (
          <>
            {/* Key Metrics Cards for Active Commodity */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <Card className="border-primary-100 bg-gradient-to-br from-emerald-50/80 to-white shadow-sm">
                <CardContent className="p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-soil-light uppercase tracking-wider">
                        Current Modal Price
                      </p>
                      <p className="text-3xl font-extrabold text-primary-800 mt-1">
                        ₹{currentTrend.latest_price?.toLocaleString() || 0}
                      </p>
                      <p className="text-xs text-soil-light/80 mt-0.5">per quintal</p>
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-primary-100 text-primary-700 flex items-center justify-center">
                      <DollarSign size={26} />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-primary-100 bg-gradient-to-br from-blue-50/80 to-white shadow-sm">
                <CardContent className="p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-soil-light uppercase tracking-wider">
                        Average Price
                      </p>
                      <p className="text-3xl font-extrabold text-blue-900 mt-1">
                        ₹{currentTrend.average_price?.toLocaleString() || 0}
                      </p>
                      <p className="text-xs text-soil-light/80 mt-0.5">Across all mandis</p>
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
                      <BarChart3 size={26} />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-primary-100 bg-gradient-to-br from-amber-50/80 to-white shadow-sm">
                <CardContent className="p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-soil-light uppercase tracking-wider">
                        Price Momentum
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <p
                          className={`text-3xl font-extrabold flex items-center gap-1 ${
                            currentTrend.trend === 'up'
                              ? 'text-crop'
                              : currentTrend.trend === 'down'
                              ? 'text-red-600'
                              : 'text-gray-700'
                          }`}
                        >
                          {currentTrend.trend === 'up' ? (
                            <TrendingUp size={24} />
                          ) : currentTrend.trend === 'down' ? (
                            <TrendingDown size={24} />
                          ) : null}
                          {currentTrend.percentChange || 0}%
                        </p>
                      </div>
                      <p className="text-xs text-soil-light/80 mt-0.5">
                        {currentTrend.change >= 0 ? `+₹${currentTrend.change}` : `-₹${Math.abs(currentTrend.change)}`} change
                      </p>
                    </div>
                    <div
                      className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                        currentTrend.trend === 'up'
                          ? 'bg-emerald-100 text-crop'
                          : 'bg-red-100 text-red-600'
                      }`}
                    >
                      {currentTrend.trend === 'up' ? <TrendingUp size={26} /> : <TrendingDown size={26} />}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-primary-100 bg-gradient-to-br from-purple-50/80 to-white shadow-sm">
                <CardContent className="p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-soil-light uppercase tracking-wider">
                        Min – Max Spread
                      </p>
                      <p className="text-xl font-bold text-purple-900 mt-2">
                        ₹{currentTrend.min_price?.toLocaleString() || 0} – ₹
                        {currentTrend.max_price?.toLocaleString() || 0}
                      </p>
                      <p className="text-xs text-soil-light/80 mt-1">
                        {currentTrend.markets_count || 1} Active Mandis
                      </p>
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center">
                      <Layers size={26} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Interactive Graph Section */}
            <Card className="mb-8 border-primary-200 shadow-md bg-white overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-cream-50 to-primary-50/30 border-b border-primary-100 pb-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <CardTitle className="text-xl font-bold text-primary-900 flex items-center gap-2">
                      <span>📊</span>
                      <span>
                        {selectedCommodity} Price Trajectory & Timeline
                      </span>
                      {selectedMarket && (
                        <span className="text-sm font-normal text-primary-700 bg-primary-100 px-2.5 py-0.5 rounded-full">
                          {selectedMarket} Mandi
                        </span>
                      )}
                    </CardTitle>
                    <p className="text-xs text-soil-light mt-1">
                      Tracking modal, minimum, and peak trade prices across recorded dates
                    </p>
                  </div>

                  {/* Time Range Selector */}
                  <div className="flex items-center gap-1.5 bg-white p-1 rounded-lg border border-primary-200 shadow-sm self-start sm:self-auto">
                    <span className="text-xs font-semibold text-soil-light px-2 hidden sm:inline">
                      Period:
                    </span>
                    {[
                      { days: 7, label: '7D' },
                      { days: 15, label: '15D' },
                      { days: 30, label: '30D' },
                      { days: 60, label: '60D' }
                    ].map((period) => (
                      <button
                        key={period.days}
                        onClick={() => setTimeRange(period.days)}
                        className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${
                          timeRange === period.days
                            ? 'bg-primary-700 text-white shadow-sm'
                            : 'text-soil-light hover:text-primary-800 hover:bg-primary-50'
                        }`}
                      >
                        {period.label}
                      </button>
                    ))}
                  </div>
                </div>
              </CardHeader>

              <CardContent className="pt-6 pb-6">
                {historyLoading ? (
                  <div className="h-80 flex items-center justify-center">
                    <Loader />
                  </div>
                ) : historyData.length > 0 ? (
                  <div className="h-80 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart
                        data={historyData}
                        margin={{ top: 10, right: 30, left: 10, bottom: 10 }}
                      >
                        <defs>
                          <linearGradient id="modalPriceGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#2D5016" stopOpacity={0.4} />
                            <stop offset="95%" stopColor="#2D5016" stopOpacity={0.0} />
                          </linearGradient>
                          <linearGradient id="maxPriceGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#D97706" stopOpacity={0.2} />
                            <stop offset="95%" stopColor="#D97706" stopOpacity={0.0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                        <XAxis
                          dataKey="date"
                          stroke="#718096"
                          fontSize={12}
                          tickLine={false}
                        />
                        <YAxis
                          stroke="#718096"
                          fontSize={12}
                          tickLine={false}
                          tickFormatter={(val) => `₹${val}`}
                        />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: '#FFFFFF',
                            border: '1px solid #E2E8F0',
                            borderRadius: '12px',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                            fontSize: '13px'
                          }}
                          formatter={(value, name) => [
                            `₹${Number(value).toLocaleString()}`,
                            name === 'modalPrice'
                              ? 'Modal Price'
                              : name === 'maxPrice'
                              ? 'Maximum Price'
                              : 'Minimum Price'
                          ]}
                        />
                        <Legend
                          verticalAlign="top"
                          height={36}
                          formatter={(value) => (
                            <span className="text-xs font-semibold text-gray-700">
                              {value === 'modalPrice'
                                ? 'Modal Price (₹)'
                                : value === 'maxPrice'
                                ? 'Max Price (₹)'
                                : 'Min Price (₹)'}
                            </span>
                          )}
                        />
                        <Area
                          type="monotone"
                          dataKey="modalPrice"
                          stroke="#2D5016"
                          strokeWidth={3}
                          fillOpacity={1}
                          fill="url(#modalPriceGrad)"
                          dot={{ fill: '#2D5016', r: 4 }}
                          activeDot={{ r: 7 }}
                        />
                        <Line
                          type="monotone"
                          dataKey="maxPrice"
                          stroke="#D97706"
                          strokeWidth={2}
                          strokeDasharray="4 4"
                          dot={{ fill: '#D97706', r: 3 }}
                        />
                        <Line
                          type="monotone"
                          dataKey="minPrice"
                          stroke="#3B82F6"
                          strokeWidth={2}
                          strokeDasharray="4 4"
                          dot={{ fill: '#3B82F6', r: 3 }}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                ) : (
                  <div className="h-64 flex flex-col items-center justify-center text-center text-soil-light">
                    <BarChart3 size={48} className="text-primary-300 mb-2" />
                    <p className="font-semibold text-lg">No historical price entries recorded yet</p>
                    <p className="text-xs">Prices will plot automatically as fresh mandi logs arrive.</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* All Commodities Interactive Table */}
            <Card className="border-primary-100 shadow-sm bg-white overflow-hidden">
              <CardHeader className="bg-cream-50/60 border-b border-primary-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <CardTitle className="text-xl font-bold text-primary-900 flex items-center gap-2">
                    <BarChart3 size={20} className="text-primary-600" />
                    All Commodities — Price Trends & Mandi Comparison
                  </CardTitle>
                  <p className="text-xs text-soil-light mt-1">
                    Click any commodity row below to switch and view its price graph above
                  </p>
                </div>

                {/* Table Search */}
                <div className="relative max-w-xs w-full">
                  <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-soil-light" />
                  <input
                    type="text"
                    value={tableSearch}
                    onChange={(e) => setTableSearch(e.target.value)}
                    placeholder="Filter commodity..."
                    className="w-full pl-9 pr-3 py-1.5 text-sm border border-primary-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
              </CardHeader>

              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="bg-cream-50/80 text-xs uppercase font-bold text-soil-light border-b border-primary-100">
                      <tr>
                        <th className="px-6 py-3.5">Commodity</th>
                        <th className="px-6 py-3.5">Current Price</th>
                        <th className="px-6 py-3.5">Average</th>
                        <th className="px-6 py-3.5">Min – Max</th>
                        <th className="px-6 py-3.5">Change</th>
                        <th className="px-6 py-3.5">Trend Status</th>
                        <th className="px-6 py-3.5 text-center">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-primary-50 text-sm">
                      {filteredTrends.map((trend, idx) => {
                        const isSelected = trend.commodity === selectedCommodity;
                        return (
                          <tr
                            key={idx}
                            onClick={() => handleSelectCommodity(trend.commodity)}
                            className={`cursor-pointer transition-colors ${
                              isSelected
                                ? 'bg-primary-50/70 font-semibold'
                                : 'hover:bg-cream-50'
                            }`}
                          >
                            <td className="px-6 py-4 flex items-center gap-2">
                              <span className="w-2.5 h-2.5 rounded-full bg-primary-600"></span>
                              <span className="font-bold text-primary-950">
                                {trend.commodity}
                              </span>
                            </td>
                            <td className="px-6 py-4 font-bold text-primary-800">
                              ₹{trend.latest_price?.toLocaleString()}
                            </td>
                            <td className="px-6 py-4 text-soil-light">
                              ₹{trend.average_price?.toLocaleString()}
                            </td>
                            <td className="px-6 py-4 text-soil-light">
                              ₹{trend.min_price} – ₹{trend.max_price}
                            </td>
                            <td
                              className={`px-6 py-4 font-semibold ${
                                trend.trend === 'up'
                                  ? 'text-crop'
                                  : trend.trend === 'down'
                                  ? 'text-red-600'
                                  : 'text-gray-600'
                              }`}
                            >
                              {trend.change > 0 ? '+' : ''}
                              {trend.change} ({trend.percentChange}%)
                            </td>
                            <td className="px-6 py-4">
                              <span
                                className={`px-3 py-1 rounded-full text-xs font-bold inline-flex items-center gap-1 ${
                                  trend.trend === 'up'
                                    ? 'bg-emerald-100 text-crop'
                                    : trend.trend === 'down'
                                    ? 'bg-red-100 text-red-700'
                                    : 'bg-gray-100 text-gray-700'
                                }`}
                              >
                                {trend.trend === 'up' ? (
                                  <>
                                    <TrendingUp size={14} /> Rising
                                  </>
                                ) : trend.trend === 'down' ? (
                                  <>
                                    <TrendingDown size={14} /> Falling
                                  </>
                                ) : (
                                  'Stable'
                                )}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-center">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleSelectCommodity(trend.commodity);
                                }}
                                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                                  isSelected
                                    ? 'bg-primary-700 text-white'
                                    : 'bg-primary-100 text-primary-700 hover:bg-primary-200'
                                }`}
                              >
                                {isSelected ? 'Viewing Graph' : 'View Graph →'}
                              </button>
                            </td>
                          </tr>
                        );
                      })}
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
