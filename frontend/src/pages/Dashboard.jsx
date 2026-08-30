import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import WeatherWidget from '../components/dashboard/WeatherWidget';
import PriceSummary from '../components/dashboard/PriceSummary';
import ActiveAlerts from '../components/dashboard/ActiveAlerts';
import RecommendedSchemes from '../components/dashboard/RecommendedSchemes';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import {
  TrendingUp,
  Sprout,
  Wind,
  BarChart3,
  Calendar,
  Truck,
  DollarSign,
  MessageSquare,
  Quote,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Award,
  Star,
  ChevronLeft,
  ChevronRight,
  Wheat
} from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function Dashboard() {
  const { user } = useAuth();
  const { t } = useTranslation();
  const [activeQuoteIndex, setActiveQuoteIndex] = useState(0);

  const quotes = [
    {
      text: "Agriculture is the most healthful, most useful and most noble employment of man.",
      author: "George Washington",
      role: "Agricultural Reformer",
      image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80"
    },
    {
      text: "To a farmer, dirt isn't a waste; it is the seedbed of life and the future of human nourishment.",
      author: "Indian Agricultural Wisdom",
      role: "Traditional Proverb",
      image: "https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&w=800&q=80"
    },
    {
      text: "The discovery of agriculture was the first big step toward a civilized life and sustainable communities.",
      author: "Arthur Keith",
      role: "Anthropologist & Historian",
      image: "https://images.unsplash.com/photo-1530507629858-e4977d30e9e0?auto=format&fit=crop&w=800&q=80"
    }
  ];

  const handleNextQuote = () => {
    setActiveQuoteIndex((prev) => (prev + 1) % quotes.length);
  };

  const handlePrevQuote = () => {
    setActiveQuoteIndex((prev) => (prev - 1 + quotes.length) % quotes.length);
  };

  return (
    <div
      className="min-h-screen bg-fixed bg-center bg-no-repeat bg-cover relative"
      style={{ backgroundImage: "url('/images/dashboard_bg.jpg')" }}
    >
      {/* Fully transparent overlay so background artwork displays clearly */}
      <div className="absolute inset-0 bg-white/5 pointer-events-none" />

      <div className="container mx-auto px-4 py-8 relative z-10 max-w-7xl">
        
        {/* ========================================================================= */}
        {/* HERO APP SHOWCASE BANNER */}
        {/* ========================================================================= */}
        <section className="mb-12 rounded-agri-xl overflow-hidden bg-transparent border-none text-soil relative">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center p-2 sm:p-6 relative z-10">
            {/* Hero Content */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary-800/10 border border-primary-800/20 text-primary-900 text-xs font-bold uppercase tracking-wider backdrop-blur-sm">
                <Star size={14} className="text-primary-700 fill-primary-700" />
                <span>Next-Gen Agricultural Intelligence</span>
              </div>

              <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-primary-950 leading-tight">
                {user ? (
                  <>
                    Welcome Back, <span className="text-earth-700">{user?.fullName?.split(' ')[0] || 'Farmer'}</span>! 🌾
                  </>
                ) : (
                  <>
                    Empowering Indian Farmers with <span className="text-earth-700">Farmer-360</span>
                  </>
                )}
              </h1>

              <p className="text-soil-dark text-base sm:text-lg leading-relaxed max-w-2xl font-semibold">
                Your complete 360-degree digital farming platform. Get real-time mandi prices, personalized AI crop advice, freight logistics tracking, and direct access to government schemes.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                {!user ? (
                  <>
                    <Link
                      to="/register"
                      className="px-6 py-3.5 rounded-xl font-bold bg-gradient-to-r from-primary-800 to-primary-700 text-white shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 flex items-center gap-2 text-base"
                    >
                      <span>Join Farmer-360 Free</span>
                      <ArrowRight size={18} />
                    </Link>
                    <Link
                      to="/login"
                      className="px-6 py-3.5 rounded-xl font-bold bg-white/80 border-2 border-primary-800 text-primary-900 hover:bg-white backdrop-blur-sm transition-all duration-300 text-base shadow-sm"
                    >
                      Sign In to Account
                    </Link>
                  </>
                ) : (
                  <div className="flex flex-wrap gap-3">
                    <Link
                      to="/markets"
                      className="px-5 py-3 rounded-xl font-bold bg-gradient-to-r from-primary-800 to-primary-700 text-white hover:bg-primary-900 transition-all flex items-center gap-2 text-sm shadow-md"
                    >
                      <BarChart3 size={18} />
                      <span>Live Mandi Prices</span>
                    </Link>
                    <Link
                      to="/ai-chat"
                      className="px-5 py-3 rounded-xl font-bold bg-white/80 border border-primary-800/30 text-primary-950 hover:bg-white backdrop-blur-sm transition-all flex items-center gap-2 text-sm shadow-sm"
                    >
                      <Wind size={18} className="text-primary-700" />
                      <span>Ask AI Advisor</span>
                    </Link>
                  </div>
                )}
              </div>

              {/* Platform Stats Ticker */}
              <div className="grid grid-cols-3 gap-4 pt-6 border-t border-primary-800/20 max-w-lg">
                <div>
                  <p className="text-2xl font-extrabold text-primary-900">500+</p>
                  <p className="text-xs text-soil-dark font-bold">Mandi Markets</p>
                </div>
                <div>
                  <p className="text-2xl font-extrabold text-primary-900">100%</p>
                  <p className="text-xs text-soil-dark font-bold">Real-Time Data</p>
                </div>
                <div>
                  <p className="text-2xl font-extrabold text-primary-900">24/7</p>
                  <p className="text-xs text-soil-dark font-bold">AI Assistance</p>
                </div>
              </div>
            </div>

            {/* Hero Illustration */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative group max-w-md w-full">
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-primary-400 to-gold-300 blur-lg opacity-30 group-hover:opacity-50 transition-opacity" />
                <img
                  src="/images/farmer360_ecosystem_diagram.jpg"
                  alt="Farmer-360 360 Ecosystem Diagram"
                  className="relative rounded-2xl shadow-xl border-2 border-white/90 object-contain w-full h-[340px] sm:h-[400px] bg-white/95 p-3 hover:scale-[1.01] transition-transform duration-500"
                />
                <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-md p-3 rounded-xl border border-primary-100 text-xs flex items-center justify-between text-soil shadow-md">
                  <span className="font-bold flex items-center gap-1.5 text-primary-800">
                    <Wheat size={16} className="text-primary-600" /> 360° Farming Ecosystem
                  </span>
                  <span className="text-soil-light font-medium">Farmer-360 Platform</span>
                </div>
              </div>
            </div>
          </div>
        </section>


        {/* ========================================================================= */}
        {/* INSPIRATIONAL FARMING QUOTE SPOTLIGHT */}
        {/* ========================================================================= */}
        <section className="mb-12">
          <div className="relative rounded-agri-xl overflow-hidden bg-white shadow-agri border border-primary-100 p-6 sm:p-8">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-primary-700 bg-primary-50 px-3 py-1 rounded-full flex items-center gap-1.5">
                <Quote size={14} /> Agricultural Inspiration
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handlePrevQuote}
                  className="p-2 rounded-full border border-primary-200 text-primary-700 hover:bg-primary-50 transition-colors"
                  aria-label="Previous Quote"
                >
                  <ChevronLeft size={18} />
                </button>
                <button
                  type="button"
                  onClick={handleNextQuote}
                  className="p-2 rounded-full border border-primary-200 text-primary-700 hover:bg-primary-50 transition-colors"
                  aria-label="Next Quote"
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
              <div className="md:col-span-8 space-y-3">
                <blockquote className="text-xl sm:text-2xl font-heading font-semibold text-soil leading-snug italic">
                  "{quotes[activeQuoteIndex].text}"
                </blockquote>
                <div className="pt-2">
                  <p className="font-bold text-primary-800 text-base">
                    {quotes[activeQuoteIndex].author}
                  </p>
                  <p className="text-xs text-soil-light">
                    {quotes[activeQuoteIndex].role}
                  </p>
                </div>
              </div>

              <div className="md:col-span-4 flex justify-center">
                <div className="w-full h-36 rounded-xl overflow-hidden shadow-md relative group">
                  <img
                    src={quotes[activeQuoteIndex].image}
                    alt={quotes[activeQuoteIndex].author}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary-950/60 via-transparent to-transparent" />
                </div>
              </div>
            </div>
          </div>
        </section>


        {/* ========================================================================= */}
        {/* HOW OUR APP WORKS (STEP-BY-STEP WORKFLOW) */}
        {/* ========================================================================= */}
        <section className="mb-12">
          <div className="text-center max-w-3xl mx-auto mb-10">
            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-primary-900 mb-3">
              How <span className="text-primary-600">Farmer-360</span> Empowers Your Harvest
            </h2>
            <p className="text-soil-light text-base">
              A complete digital ecosystem built specifically for Indian farmers — from soil prep to final produce delivery.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                step: "01",
                icon: BarChart3,
                title: "Live Price Intelligence",
                desc: "Track commodity prices across 500+ Indian mandi markets with daily high/low trajectory charts.",
                badge: "Market Trends",
                color: "from-emerald-500 to-teal-600"
              },
              {
                step: "02",
                icon: Wind,
                title: "AI Agronomist Advice",
                desc: "Get 24/7 AI-powered advice on crop protection, soil health, fertilizer scheduling, and weather risks.",
                badge: "AI Advisory",
                color: "from-blue-500 to-indigo-600"
              },
              {
                step: "03",
                icon: Truck,
                title: "Logistics & Freight",
                desc: "Book transport trucks, generate unique AGRI shipment tracking IDs, and monitor deliveries live.",
                badge: "Shipment Tracking",
                color: "from-amber-500 to-orange-600"
              },
              {
                step: "04",
                icon: DollarSign,
                title: "Profit & Subsidy Hub",
                desc: "Calculate harvest profit margins and discover government schemes tailored to your state.",
                badge: "Yield Calculator",
                color: "from-purple-500 to-pink-600"
              }
            ].map((item, idx) => {
              const Icon = item.icon;
              return (
                <div
                  key={idx}
                  className="bg-white rounded-agri-xl p-6 shadow-agri border border-primary-100 hover:border-primary-400 hover:shadow-card-hover hover:-translate-y-1.5 transition-all duration-300 relative group flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-xs font-extrabold text-primary-600 bg-primary-50 px-2.5 py-1 rounded-md">
                        STEP {item.step}
                      </span>
                      <span className="text-xs font-semibold text-soil-light">{item.badge}</span>
                    </div>

                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center text-white shadow-md mb-4 group-hover:scale-110 transition-transform`}>
                      <Icon size={24} />
                    </div>

                    <h3 className="font-heading font-bold text-lg text-soil mb-2">
                      {item.title}
                    </h3>
                    <p className="text-soil-light text-sm leading-relaxed mb-4">
                      {item.desc}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-gray-100 flex items-center gap-1.5 text-xs font-bold text-primary-700">
                    <CheckCircle2 size={14} className="text-crop" />
                    <span>Instant Access</span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>


        {/* ========================================================================= */}
        {/* PLATFORM FEATURES SHOWCASE CARDS */}
        {/* ========================================================================= */}
        <section className="mb-12">
          <div className="bg-transparent rounded-agri-xl p-0 sm:p-2 border-none shadow-none">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
              <div>
                <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-primary-950">
                  Explore Platform Modules
                </h2>
                <p className="text-soil-dark font-bold text-sm mt-1">
                  Everything you need to run an efficient, profitable farm operation
                </p>
              </div>
              <span className="text-xs font-bold text-primary-900 bg-white/80 px-3 py-1.5 rounded-full border border-primary-800/20 backdrop-blur-sm self-start md:self-auto shadow-sm">
                6 Integrated Tools
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  to: "/markets",
                  title: "Mandi Price Intelligence",
                  desc: "Compare real-time prices across state markets & track historical trends.",
                  icon: BarChart3,
                  img: "https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&w=600&q=80"
                },
                {
                  to: "/schemes",
                  title: "Government Subsidy Portal",
                  desc: "Discover subsidies, loans, and financial aid schemes for your crops.",
                  icon: Sprout,
                  img: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=600&q=80"
                },
                {
                  to: "/ai-chat",
                  title: "AI Agronomist Assistant",
                  desc: "Get instant AI answers for pest control, soil testing & weather protection.",
                  icon: Wind,
                  img: "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?auto=format&fit=crop&w=600&q=80"
                },
                {
                  to: "/shipments",
                  title: "Logistics Freight Tracking",
                  desc: "Track freight trucks, status updates, and transport timelines live.",
                  icon: Truck,
                  img: "https://images.unsplash.com/photo-1530507629858-e4977d30e9e0?auto=format&fit=crop&w=600&q=80"
                },
                {
                  to: "/profit-calculator",
                  title: "Crop Profit & Yield Calculator",
                  desc: "Estimate total harvest costs, gross revenue, and net profits.",
                  icon: DollarSign,
                  img: "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=600&q=80"
                },
                {
                  to: "/community-forum",
                  title: "Farmer Knowledge Community",
                  desc: "Discuss farming issues, exchange tips, and connect with peers.",
                  icon: MessageSquare,
                  img: "https://images.unsplash.com/photo-1595974482597-4b8da8879bc5?auto=format&fit=crop&w=600&q=80"
                }
              ].map((module, idx) => {
                const Icon = module.icon;
                return (
                  <Link
                    key={idx}
                    to={module.to}
                    className="group bg-white rounded-xl overflow-hidden border border-primary-100 shadow-sm hover:shadow-card-hover hover:border-primary-400 transition-all duration-300 flex flex-col justify-between"
                  >
                    <div className="h-40 overflow-hidden relative">
                      <img
                        src={module.img}
                        alt={module.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-primary-950/80 via-primary-950/20 to-transparent" />
                      <div className="absolute top-3 left-3 p-2 rounded-lg bg-white/90 backdrop-blur-md text-primary-700 shadow-sm">
                        <Icon size={20} />
                      </div>
                    </div>

                    <div className="p-5 flex-1 flex flex-col justify-between">
                      <div>
                        <h3 className="font-heading font-bold text-base text-soil group-hover:text-primary-700 transition-colors mb-1">
                          {module.title}
                        </h3>
                        <p className="text-soil-light text-xs leading-relaxed">
                          {module.desc}
                        </p>
                      </div>

                      <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs font-bold text-primary-700">
                        <span>Launch Tool</span>
                        <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>


        {/* ========================================================================= */}
        {/* LIVE FARMING OPERATIONAL DASHBOARD WIDGETS */}
        {/* ========================================================================= */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="font-heading text-2xl font-bold text-soil flex items-center gap-2">
              <Star className="text-gold-400 fill-gold-400" size={24} />
              <span>Live Operational Dashboard</span>
            </h2>
            {user && (
              <span className="text-xs font-semibold text-soil-light bg-cream-50 px-3 py-1 rounded-full border border-primary-100">
                Location: {user?.village ? `${user.village}, ${user.state || ''}` : 'Default GPS'}
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Weather Widget */}
            <Card className="rounded-agri-lg overflow-hidden bg-white/95 border-primary-100 hover:shadow-card-hover transition-all duration-300">
              <CardHeader className="pb-3 bg-cream-50/60 border-b border-primary-100">
                <CardTitle className="text-base font-bold text-soil flex items-center gap-2">
                  <Wind size={18} className="text-primary-600" />
                  <span>Weather Forecast & Advisory</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <WeatherWidget location={{ lat: user?.latitude, lon: user?.longitude }} />
              </CardContent>
            </Card>

            {/* Price Summary Widget */}
            <Card className="rounded-agri-lg overflow-hidden bg-white/95 border-primary-100 hover:shadow-card-hover transition-all duration-300">
              <CardHeader className="pb-3 bg-cream-50/60 border-b border-primary-100">
                <CardTitle className="text-base font-bold text-soil flex items-center gap-2">
                  <TrendingUp size={18} className="text-primary-600" />
                  <span>{t('dashboard.today_prices')}</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <PriceSummary state={user?.state} />
              </CardContent>
            </Card>

            {/* Active Alerts Widget */}
            <Card className="rounded-agri-lg overflow-hidden bg-white/95 border-primary-100 hover:shadow-card-hover transition-all duration-300">
              <CardHeader className="pb-3 bg-cream-50/60 border-b border-primary-100">
                <CardTitle className="text-base font-bold text-soil flex items-center gap-2">
                  <ShieldCheck size={18} className="text-primary-600" />
                  <span>{t('dashboard.active_alerts')}</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <ActiveAlerts />
              </CardContent>
            </Card>

            {/* Government Schemes Widget */}
            <Card className="md:col-span-2 lg:col-span-3 rounded-agri-lg overflow-hidden bg-white/95 border-primary-100">
              <CardHeader className="pb-3 bg-cream-50/60 border-b border-primary-100 flex flex-wrap items-center justify-between gap-2">
                <CardTitle className="text-base font-bold text-soil flex items-center gap-2">
                  <Award size={18} className="text-primary-600" />
                  <span>{t('dashboard.recommended_schemes')}</span>
                </CardTitle>
                <Link to="/schemes">
                  <Button variant="outline" size="sm" className="text-xs">
                    Explore All Schemes →
                  </Button>
                </Link>
              </CardHeader>
              <CardContent className="pt-4">
                <RecommendedSchemes state={user?.state} crops={user?.crops_grown} />
              </CardContent>
            </Card>
          </div>
        </section>

      </div>
    </div>
  );
}
