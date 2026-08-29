import { TrendingUp, TrendingDown, LineChart as ChartIcon, ArrowRight } from 'lucide-react';

export default function PriceCard({ price, onClick }) {
  const trend = price.trend || 'up';
  const isUp = trend === 'up';

  return (
    <div
      className={`group rounded-agri-lg p-6 shadow-agri border-2 cursor-pointer transition-all duration-300 hover:-translate-y-1.5 hover:shadow-card-hover ${
        isUp
          ? 'bg-white border-primary-100 hover:border-primary-400'
          : 'bg-white border-red-100 hover:border-red-400'
      }`}
      onClick={onClick}
    >
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className={`font-heading font-bold text-xl mb-1 group-hover:text-primary-600 transition-colors ${isUp ? 'text-primary-700' : 'text-red-700'}`}>
            {price.commodity}
          </h3>
          <p className="text-sm font-medium text-soil-light">{price.market}</p>
          <p className="text-xs text-soil-light/80">{price.state}</p>
        </div>
        <div
          className={`flex items-center justify-center w-12 h-12 rounded-full transition-transform duration-300 group-hover:scale-110 ${
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

      <div className="flex items-center justify-between text-xs text-soil-light mb-3">
        <p>📅 {new Date(price.price_date).toLocaleDateString()}</p>
        <span
          className={`px-2.5 py-1 rounded-full font-semibold text-xs ${
            isUp ? 'bg-primary-100 text-primary-700' : 'bg-red-100 text-red-700'
          }`}
        >
          {isUp ? '↑ Rising' : '↓ Falling'}
        </span>
      </div>

      <div className="pt-3 border-t border-primary-50 flex items-center justify-between text-xs font-semibold text-primary-700 group-hover:text-primary-800">
        <span className="flex items-center gap-1.5">
          <ChartIcon size={14} className="text-primary-600" />
          View Price Graph & Trends
        </span>
        <ArrowRight size={14} className="transform transition-transform duration-200 group-hover:translate-x-1" />
      </div>
    </div>
  );
}
