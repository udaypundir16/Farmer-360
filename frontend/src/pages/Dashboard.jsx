import { useAuth } from '../context/AuthContext';
import WeatherWidget from '../components/dashboard/WeatherWidget';
import PriceSummary from '../components/dashboard/PriceSummary';
import ActiveAlerts from '../components/dashboard/ActiveAlerts';
import RecommendedSchemes from '../components/dashboard/RecommendedSchemes';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { TrendingUp, AlertCircle, Sprout, Wind, BarChart3, Calendar, Truck, DollarSign, MessageSquare } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function Dashboard() {
  const { user } = useAuth();
  const { t } = useTranslation();

  if (!user) {
    return (
      <div className="min-h-screen bg-cream-100 relative overflow-hidden">
        {/* Subtle background pattern */}
        <div
          className="absolute inset-0 opacity-[0.06] pointer-events-none bg-cover bg-center"
          style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1920)' }}
        />
        <div className="container mx-auto p-4 py-16 relative z-10">
          {/* Hero */}
          <section className="text-center mb-16 animate-fade-in-up">
            <h1 className="font-heading text-4xl md:text-6xl font-bold mb-4 text-primary-800">
              {t('dashboard.smart_agri_title')}
            </h1>
            <p className="text-lg text-soil-light max-w-2xl mx-auto mb-10 leading-relaxed">
              {t('dashboard.smart_agri_subtitle')}
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                to="/login"
                className="px-8 py-4 rounded-lg font-semibold bg-gradient-to-r from-primary-700 to-primary-600 text-white shadow-agri hover:shadow-agri-lg hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
              >
                {t('dashboard.get_started')}
              </Link>
              <Link
                to="/register"
                className="px-8 py-4 rounded-lg font-semibold border-2 border-earth-500 text-earth-600 hover:bg-earth-50 transition-all duration-300"
              >
                {t('dashboard.sign_up')}
              </Link>
            </div>
          </section>

          {/* Feature cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 md:gap-6 max-w-6xl mx-auto">
            {[
              { icon: TrendingUp, title: t('dashboard.feature_market_prices'), desc: t('dashboard.feature_market_desc') },
              { icon: Sprout, title: t('dashboard.feature_schemes'), desc: t('dashboard.feature_schemes_desc') },
              { icon: Wind, title: t('dashboard.feature_ai'), desc: t('dashboard.feature_ai_desc') },
              { icon: Truck, title: 'Shipment Tracking', desc: 'Track agricultural logistics' },
              { icon: DollarSign, title: 'Profit Calculator', desc: 'Estimate crop profitability' },
              { icon: MessageSquare, title: 'Community Forum', desc: 'Connect with other farmers' },
            ].map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <div
                  key={idx}
                  className="card-agri p-4 sm:p-5 md:p-6 animate-fade-in-up group"
                  style={{ animationDelay: `${idx * 0.1}s`, animationFillMode: 'both' }}
                >
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-agri-lg bg-gradient-to-br from-primary-500 to-gold-300 flex items-center justify-center mb-3 sm:mb-4 text-white shadow-agri group-hover:scale-110 transition-transform duration-300">
                    <Icon size={20} className="sm:w-6 sm:h-6" strokeWidth={2} />
                  </div>
                  <h3 className="font-heading text-xs sm:text-sm font-bold text-soil mb-1 sm:mb-2 line-clamp-2">{feature.title}</h3>
                  <p className="text-soil-light text-xs leading-snug line-clamp-2">{feature.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream-100 py-8 relative">
      {/* Very faint wheat/field background */}
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none bg-cover bg-center"
        style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1920)' }}
      />
      <div className="container mx-auto p-4 relative z-10">
        <div className="mb-8 animate-fade-in-up">
          <div className="inline-block px-6 py-3 rounded-agri-lg bg-white/80 backdrop-blur-sm border border-primary-100 shadow-agri">
            <h1 className="font-heading text-2xl md:text-3xl font-bold text-primary-800">
              {t('dashboard.welcome_farmer', { name: user?.fullName || 'Farmer' })}
            </h1>
          </div>
        </div>



        {/* Quick Actions */}
        <Card className="mb-8 bg-white/90 border-primary-100 shadow-agri-lg">
          <CardContent className="pt-8 pb-8">
            <h3 className="font-heading font-bold text-xl text-soil mb-6">Quick Actions</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-4 sm:gap-6">
              {[
                { to: '/markets', icon: BarChart3, label: 'View Prices' },
                { to: '/schemes', icon: Sprout, label: 'Browse Schemes' },
                { to: '/ai-chat', icon: Wind, label: 'Ask AI Assistant' },
                { to: '/crop-calendar', icon: Calendar, label: 'Crop Calendar' },
                { to: '/shipments', icon: Truck, label: 'Track Shipments' },
                { to: '/profit-calculator', icon: DollarSign, label: 'Profit Calculator' },
                { to: '/community-forum', icon: MessageSquare, label: 'Community Forum' },
              ].map((action) => (
                <Link
                  key={action.to}
                  to={action.to}
                  className="flex flex-col items-center justify-center p-6 rounded-agri-xl bg-gradient-to-br from-cream-50 to-white border border-primary-100 hover:border-primary-400 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 text-center min-h-[140px]"
                >
                  <div className="p-4 rounded-full bg-primary-50 text-primary-600 mb-3 group-hover:bg-primary-100 transition-colors">
                    <action.icon className="w-8 h-8" size={32} strokeWidth={1.5} />
                  </div>
                  <span className="text-sm font-semibold text-soil-dark line-clamp-2">{action.label}</span>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="rounded-agri-lg overflow-hidden bg-white/95 border-primary-100 hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg text-soil">
                Weather in {user?.village || t('dashboard.your_area')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <WeatherWidget location={{ lat: user?.latitude, lon: user?.longitude }} />
            </CardContent>
          </Card>

          <Card className="rounded-agri-lg overflow-hidden bg-white/95 border-primary-100 hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg text-soil">{t('dashboard.today_prices')}</CardTitle>
            </CardHeader>
            <CardContent>
              <PriceSummary state={user?.state} />
            </CardContent>
          </Card>

          <Card className="rounded-agri-lg overflow-hidden bg-white/95 border-primary-100 hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg text-soil">{t('dashboard.active_alerts')}</CardTitle>
            </CardHeader>
            <CardContent>
              <ActiveAlerts />
            </CardContent>
          </Card>

          <Card className="md:col-span-2 lg:col-span-3 rounded-agri-lg overflow-hidden bg-white/95 border-primary-100">
            <CardHeader className="pb-3 flex flex-wrap items-center justify-between gap-2">
              <CardTitle className="text-lg text-soil">{t('dashboard.recommended_schemes')}</CardTitle>
              <Link to="/schemes">
                <Button variant="outline" size="sm">View All</Button>
              </Link>
            </CardHeader>
            <CardContent>
              <RecommendedSchemes state={user?.state} crops={user?.crops_grown} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
