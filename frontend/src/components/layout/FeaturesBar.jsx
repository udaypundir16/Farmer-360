import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Store,
  Sprout,
  Bell,
  CloudSun,
  Truck,
  DollarSign,
  MessageSquare,
  ShoppingBag
} from 'lucide-react';

export default function FeaturesBar() {
  const { t } = useTranslation();
  const location = useLocation();

  const features = [
    { to: '/markets', label: t('common.market_prices'), icon: Store },
    { to: '/schemes', label: t('common.schemes'), icon: Sprout },
    { to: '/alerts', label: t('common.alerts'), icon: Bell },
    { to: '/weather-forecast', label: t('nav.weather'), icon: CloudSun },
    { to: '/crop-market', label: t('nav.crop_market'), icon: ShoppingBag },
    { to: '/shipments', label: t('nav.shipments'), icon: Truck },
    { to: '/profit-calculator', label: t('nav.profit_calculator'), icon: DollarSign },
    { to: '/community-forum', label: t('nav.forum'), icon: MessageSquare },
  ];

  return (
    <div className="hidden lg:block bg-white border-b border-primary-100/60 py-2.5 shadow-sm">
      <div className="w-full max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between gap-1.5 xl:gap-2">
          {features.map((feature) => {
            const Icon = feature.icon;
            const isActive = location.pathname === feature.to;
            return (
              <Link
                key={feature.to}
                to={feature.to}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs xl:text-sm font-medium rounded-full transition-all duration-200 whitespace-nowrap ${
                  isActive
                    ? 'bg-primary-100 text-primary-900 font-bold ring-1 ring-primary-300 shadow-sm'
                    : 'text-soil-light hover:bg-cream-100 hover:text-primary-800'
                }`}
              >
                <Icon size={16} className={isActive ? 'text-primary-700' : 'text-soil-light/80'} />
                <span>{feature.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}

