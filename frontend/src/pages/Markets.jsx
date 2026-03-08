import { useState, useEffect } from 'react';
import { getLatestPrices } from '../services/market.service';
import PriceCard from '../components/market/PriceCard';
import PriceChart from '../components/market/PriceChart';
import FilterBar from '../components/market/FilterBar';
import Loader from '../components/ui/loader';
import { TrendingUp, TrendingDown, RefreshCw } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function Markets() {
  const { t } = useTranslation();
  const [prices, setPrices] = useState([]);
  const [filteredPrices, setFilteredPrices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [selectedCommodity, setSelectedCommodity] = useState(null);
  const [selectedMarket, setSelectedMarket] = useState(null);
  const [filters, setFilters] = useState({ commodity: '', state: '', market: '' });

  useEffect(() => {
    loadPrices();
    // Auto-refresh every 3 minutes
    const interval = setInterval(() => {
      loadPrices(true);
    }, 3 * 60 * 1000); // 3 minutes
    
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    let filtered = prices;
    if (filters.commodity) filtered = filtered.filter(p => p.commodity.toLowerCase().includes(filters.commodity.toLowerCase()));
    if (filters.state) filtered = filtered.filter(p => p.state === filters.state);
    if (filters.market) filtered = filtered.filter(p => p.market.toLowerCase().includes(filters.market.toLowerCase()));
    setFilteredPrices(filtered);
  }, [filters, prices]);

  const loadPrices = async (isAutoRefresh = false) => {
    if (!isAutoRefresh) setRefreshing(true);
    try {
      const data = await getLatestPrices();
      setPrices(data);
      setFilteredPrices(data);
      setLastUpdated(new Date().toLocaleTimeString());
    } catch (error) {
      console.error('Error loading prices:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    loadPrices(false);
  };

  const upTrend = filteredPrices.filter(p => p.trend === 'up').length;
  const downTrend = filteredPrices.filter(p => p.trend === 'down').length;

  return (
    <div className="min-h-screen bg-cream-100 py-8">
      <div className="container mx-auto p-4">
        <div className="mb-8 animate-fade-in-up flex justify-between items-start">
          <div>
            <h1 className="font-heading text-4xl md:text-5xl font-bold mb-2 text-primary-800">
              {t('markets.title')}
            </h1>
            <p className="text-soil-light text-lg">{t('markets.subtitle')}</p>
            {lastUpdated && (
              <p className="text-soil-light/70 text-sm mt-2">Last updated: {lastUpdated}</p>
            )}
          </div>
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition disabled:opacity-50"
          >
            <RefreshCw size={18} className={refreshing ? 'animate-spin' : ''} />
            {refreshing ? 'Refreshing...' : 'Refresh'}
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="card-agri p-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-soil-light">{t('markets.total_commodities')}</p>
              <p className="text-3xl font-bold text-primary-700">{filteredPrices.length}</p>
            </div>
            <div className="w-14 h-14 rounded-agri-lg bg-primary-100 flex items-center justify-center">
              <span className="text-2xl">📦</span>
            </div>
          </div>
          <div className="card-agri p-6 flex items-center justify-between border-crop/30">
            <div>
              <p className="text-sm font-semibold text-soil-light">{t('markets.price_increase')}</p>
              <p className="text-3xl font-bold text-crop flex items-center gap-2">↑ {upTrend}</p>
            </div>
            <TrendingUp size={40} className="text-crop/50" />
          </div>
          <div className="card-agri p-6 flex items-center justify-between border-red-200/50">
            <div>
              <p className="text-sm font-semibold text-soil-light">{t('markets.price_decrease')}</p>
              <p className="text-3xl font-bold text-red-600 flex items-center gap-2">↓ {downTrend}</p>
            </div>
            <TrendingDown size={40} className="text-red-300" />
          </div>
        </div>

        {/* Filter - glassmorphism sidebar style on desktop */}
        <div className="mb-8">
          <FilterBar filters={filters} setFilters={setFilters} />
        </div>

        {selectedCommodity && selectedMarket && (
          <div className="mb-8 p-6 rounded-agri-lg bg-white/90 border border-primary-100 shadow-agri">
            <h2 className="font-heading text-xl font-bold mb-4 text-soil">
              {t('markets.price_trend')}: <span className="text-primary-700">{selectedCommodity}</span> {t('markets.at')} <span className="text-primary-700">{selectedMarket}</span>
            </h2>
            <PriceChart commodity={selectedCommodity} market={selectedMarket} />
          </div>
        )}

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader />
          </div>
        ) : filteredPrices.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPrices.map((price, idx) => (
              <div
                key={price.id}
                className="animate-fade-in-up"
                style={{ animationDelay: `${Math.min(idx * 0.05, 0.3)}s`, animationFillMode: 'both' }}
              >
                <div
                  onClick={() => {
                    setSelectedCommodity(price.commodity);
                    setSelectedMarket(price.market);
                  }}
                  className="cursor-pointer"
                >
                  <PriceCard price={price} />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 rounded-agri-lg bg-cream-50 border border-primary-100">
            <p className="text-xl font-medium text-soil-light mb-2">{t('markets.no_prices_found')}</p>
            <p className="text-soil-light/80">{t('markets.try_adjusting_filters')}</p>
          </div>
        )}
      </div>
    </div>
  );
}
