import { useEffect, useState } from 'react';
import { getLatestPrices } from '../../services/market.service';
import { Link } from 'react-router-dom';
import { TrendingUp, TrendingDown, ArrowRight } from 'lucide-react';
import { Button } from '../ui/button';
import { useTranslation } from 'react-i18next';

export default function PriceSummary({ state }) {
  const { t } = useTranslation();
  const [prices, setPrices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!state) {
      // Use mock data if no state
      setPrices([
        { id: 1, commodity: 'Wheat', market: 'Delhi', modal_price: 2180, trend: 'up' },
        { id: 2, commodity: 'Rice', market: 'Mumbai', modal_price: 1850, trend: 'down' },
        { id: 3, commodity: 'Cotton', market: 'Ahmedabad', modal_price: 6200, trend: 'up' },
      ]);
      setLoading(false);
      return;
    }
    getLatestPrices({ state, limit: 3 })
      .then(data => {
        setPrices(Array.isArray(data) ? data : (data.prices || []));
      })
      .catch(error => {
        console.error('Error fetching prices:', error);
        // Fallback to mock data
        setPrices([
          { id: 1, commodity: 'Wheat', market: 'Delhi', modal_price: 2180, trend: 'up' },
          { id: 2, commodity: 'Rice', market: 'Mumbai', modal_price: 1850, trend: 'down' },
          { id: 3, commodity: 'Cotton', market: 'Ahmedabad', modal_price: 6200, trend: 'up' },
        ]);
      })
      .finally(() => setLoading(false));
  }, [state]);

  if (loading) return <div className="text-gray-500 text-sm">Loading...</div>;
  if (prices.length === 0) return <div className="text-gray-500 text-sm">No prices available</div>;

  return (
    <div>
      <ul className="space-y-2.5 mb-3">
        {prices.map(p => (
          <li key={p.id} className="flex items-center justify-between p-2.5 rounded-xl bg-primary-50/50 border border-primary-100/50 hover:bg-white transition-colors">
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="font-bold text-base text-soil-dark">{p.commodity}</span>
                {p.trend === 'up' ? (
                  <TrendingUp size={16} className="text-green-600" />
                ) : (
                  <TrendingDown size={16} className="text-red-600" />
                )}
              </div>
              <span className="text-xs sm:text-sm text-gray-500 font-medium">{p.market}</span>
            </div>
            <span className="font-extrabold text-base sm:text-lg text-primary-800">₹{p.modal_price}</span>
          </li>
        ))}
      </ul>
      <Link to="/markets">
        <Button variant="outline" size="sm" className="w-full text-xs sm:text-sm font-semibold text-primary-700 border-primary-200 hover:bg-primary-50">
          <span>{t('dashboard.view_all_prices', 'Explore Mandi Trends')}</span>
          <ArrowRight size={14} className="ml-1" />
        </Button>
      </Link>
    </div>
  );
}
