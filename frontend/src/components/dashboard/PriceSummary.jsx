import { useEffect, useState } from 'react';
import { getLatestPrices } from '../../services/market.service';
import { Link } from 'react-router-dom';
import { TrendingUp, TrendingDown, ArrowRight } from 'lucide-react';
import { Button } from '../ui/button';

export default function PriceSummary({ state }) {
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
      <ul className="space-y-3 mb-3">
        {prices.map(p => (
          <li key={p.id} className="flex items-center justify-between p-2 rounded-lg bg-white/60 hover:bg-white transition-colors">
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-sm">{p.commodity}</span>
                {p.trend === 'up' ? (
                  <TrendingUp size={14} className="text-green-600" />
                ) : (
                  <TrendingDown size={14} className="text-red-600" />
                )}
              </div>
              <span className="text-xs text-gray-600">{p.market}</span>
            </div>
            <span className="font-bold text-sm">₹{p.modal_price}</span>
          </li>
        ))}
      </ul>
      <Link to="/markets">
        <Button size="sm" variant="outline" className="w-full text-xs flex items-center justify-center gap-1">
          View All Prices <ArrowRight size={12} />
        </Button>
      </Link>
    </div>
  );
}
