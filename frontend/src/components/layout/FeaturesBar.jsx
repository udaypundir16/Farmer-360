import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
    Store,
    Sprout,
    Bell,
    CloudSun,
    TrendingUp,
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
        { to: '/weather-forecast', label: 'Weather', icon: CloudSun },
        { to: '/prediction', label: 'Yield Prediction', icon: TrendingUp },
        { to: '/crop-market', label: 'Crop Market', icon: ShoppingBag },
        { to: '/shipments', label: 'Shipments', icon: Truck },
        { to: '/profit-calculator', label: 'Profit Calc', icon: DollarSign },
        { to: '/community-forum', label: 'Forum', icon: MessageSquare },
    ];

    return (
        <div className="bg-white border-b border-primary-100/50 py-3 overflow-x-auto shadow-sm">
            <div className="w-[98%] max-w-[1400px] mx-auto px-2 md:px-4">
                <div className="flex items-center gap-2 min-w-max justify-center md:justify-start">
                    <span className="text-sm font-bold text-primary-800 uppercase tracking-wider px-2 border-r-2 border-primary-100 hidden md:flex items-center h-full">
                        Features
                    </span>
                    {features.map((feature) => {
                        const Icon = feature.icon;
                        const isActive = location.pathname === feature.to;
                        return (
                            <Link
                                key={feature.to}
                                to={feature.to}
                                className={`flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-full transition-all duration-200 whitespace-nowrap ${isActive
                                    ? 'bg-primary-100 text-primary-800 ring-1 ring-primary-200 shadow-sm'
                                    : 'text-soil-light hover:bg-cream-100 hover:text-primary-700 hover:shadow-sm'
                                    }`}
                            >
                                <Icon size={18} className={isActive ? 'text-primary-600' : 'text-soil-light/70'} />
                                {feature.label}
                            </Link>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
