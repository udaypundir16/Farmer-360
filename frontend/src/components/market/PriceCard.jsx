import { TrendingUp, TrendingDown } from 'lucide-react';

export default function PriceCard({ price, onClick }) {
  const trend = price.trend || 'up';
  const isUp = trend === 'up';

  return (
    <div
      className={`rounded-agri-lg p-6 shadow-agri border-2 cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover ${
        isUp
          ? 'bg-white border-primary-100 hover:border-primary-200'
          : 'bg-white border-red-100 hover:border-red-200'
      }`}
      onClick={onClick}
    >
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className={`font-heading font-bold text-xl mb-1 ${isUp ? 'text-primary-700' : 'text-red-700'}`}>
            {price.commodity}
          </h3>
          <p className="text-sm text-soil-light">{price.market}</p>
          <p className="text-xs text-soil-light/80">{price.state}</p>
        </div>
        <div
          className={`flex items-center justify-center w-12 h-12 rounded-full ${
            isUp ? 'bg-primary-100 text-primary-600' : 'bg-red-100 text-red-600'
          }`}
        >
          {isUp ? <TrendingUp size={24} /> : <TrendingDown size={24} />}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-4 p-4 rounded-agri bg-cream-50/80 border border-primary-50">
        <div className="text-center">
          <p className="text-xs font-medium text-soil-light mb-1">Min</p>
          <p className="font-bold text-lg text-soil">₹{price.min_price}</p>
        </div>
        <div className="text-center border-l border-r border-primary-100">
          <p className="text-xs font-medium text-soil-light mb-1">Current</p>
          <p className={`font-bold text-lg ${isUp ? 'text-crop' : 'text-red-600'}`}>
            ₹{price.modal_price}
          </p>
        </div>
        <div className="text-center">
          <p className="text-xs font-medium text-soil-light mb-1">Max</p>
          <p className="font-bold text-lg text-soil">₹{price.max_price}</p>
        </div>
      </div>

      <div className="flex items-center justify-between text-xs text-soil-light">
        <p>📅 {new Date(price.price_date).toLocaleDateString()}</p>
        <span
          className={`px-2 py-1 rounded-full font-semibold text-xs ${
            isUp ? 'bg-primary-100 text-primary-700' : 'bg-red-100 text-red-700'
          }`}
        >
          {isUp ? '↑ Up' : '↓ Down'}
        </span>
      </div>
    </div>
  );
}
