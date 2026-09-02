import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import LanguageSelector from './LanguageSelector';
import {
  Menu,
  X,
  LogOut,
  User,
  Store,
  Sprout,
  Bell,
  CloudSun,
  TrendingUp,
  Truck,
  DollarSign,
  MessageSquare,
  ShoppingBag,
  Bot,
  LayoutDashboard,
  Calendar
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { useTranslation } from 'react-i18next';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close mobile drawer whenever route changes
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navLinks = [
    { to: '/', label: t('common.dashboard') },
    { to: '/ai-chat', label: t('common.ai_chat') },
  ];

  const allFeatures = [
    { to: '/ai-chat', label: t('common.ai_chat'), icon: Bot, highlight: true },
    { to: '/markets', label: t('common.market_prices'), icon: Store },
    { to: '/schemes', label: t('common.schemes'), icon: Sprout },
    { to: '/alerts', label: t('common.alerts'), icon: Bell },
    { to: '/weather-forecast', label: t('nav.weather'), icon: CloudSun },
    { to: '/crop-market', label: t('nav.crop_market'), icon: ShoppingBag },
    { to: '/shipments', label: t('nav.shipments'), icon: Truck },
    { to: '/profit-calculator', label: t('nav.profit_calculator'), icon: DollarSign },
    { to: '/community-forum', label: t('nav.forum'), icon: MessageSquare },
    { to: '/crop-calendar', label: t('nav.crop_calendar'), icon: Calendar },
  ];


  return (
    <nav
      className="sticky top-0 z-50 w-full bg-white shadow-sm border-b border-gray-200 transition-all duration-300"
    >
      <div className="w-[98%] max-w-[1400px] mx-auto px-2 sm:px-4">
        <div className="flex justify-between items-center h-16 sm:h-20">
          {/* Logo -> Always navigates to Dashboard */}
          <Link
            to="/"
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-2.5 sm:gap-3 group transition-transform duration-300 hover:scale-[1.02] py-1"
          >
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-tr from-primary-900 via-primary-800 to-emerald-600 flex items-center justify-center text-white shadow-md shadow-primary-950/15 ring-2 ring-primary-500/20 group-hover:shadow-primary-700/25 transition-all duration-300 shrink-0">
              <Sprout size={22} className="text-yellow-300 transform group-hover:rotate-6 transition-transform duration-300" />
            </div>
            <div className="flex flex-col">
              <span className="font-heading text-2xl sm:text-[26px] font-black tracking-tight text-primary-950 leading-none">
                Farmer<span className="text-primary-600">-360</span>
              </span>
              <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-soil-light mt-1 leading-none">
                Agricultural Intelligence
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-8 flex-1 ml-10">
            <div className="flex items-center gap-6">
              {navLinks.map((link) => {
                const isActive = location.pathname === link.to || (link.to !== '/' && location.pathname.startsWith(link.to));
                return (
                  <Link
                    key={link.to}
                    to={link.to}
                    className={`relative px-2 py-2 text-lg font-medium transition-all duration-300 rounded-lg whitespace-nowrap tracking-wide ${isActive
                      ? 'text-primary-700 font-semibold'
                      : 'text-soil-light hover:text-primary-600'
                      }`}
                  >
                    {link.label}
                    {isActive && (
                      <span
                        className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full bg-gold-400"
                        aria-hidden
                      />
                    )}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Desktop Right section */}
          <div className="hidden lg:flex items-center gap-4 ml-4 h-20">
            <LanguageSelector />
            {user ? (
              <>
                <Link to="/profile" className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-primary-50/80 border border-primary-100 hover:bg-primary-100 transition-colors cursor-pointer">
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-primary-600 to-primary-700 flex items-center justify-center">
                    <User size={14} className="text-gold-200" strokeWidth={2} />
                  </div>
                  <span className="text-xs font-semibold text-soil">
                    {user?.fullName?.split(' ')[0]}
                  </span>
                </Link>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                  className="text-earth-600 hover:bg-earth-50 hover:text-earth-700 rounded-lg px-2"
                >
                  <LogOut size={18} strokeWidth={2} />
                </Button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-base font-bold px-5 py-2.5 rounded-xl border-2 border-earth-400 text-earth-700 hover:bg-earth-50 transition-all duration-300 h-fit tracking-wide"
                >
                  {t('common.login')}
                </Link>
                <Link
                  to="/register"
                  className="text-base font-bold px-5 py-2.5 rounded-xl bg-gradient-to-r from-primary-700 to-primary-600 text-white hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 h-fit tracking-wide shadow-agri"
                >
                  {t('common.register')}
                </Link>
              </>
            )}
          </div>

          {/* Mobile Right Controls: Top AI Chat Icon Button + 3-Bar Menu */}
          <div className="flex items-center gap-2 lg:hidden">
            {/* Pinned Top AI Chat Action */}
            <Link
              to="/ai-chat"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-emerald-600 to-primary-700 text-white text-xs font-bold shadow-sm active:scale-95 transition-all"
            >
              <Bot size={15} className="text-yellow-300" />
              <span>AI Chat</span>
            </Link>


            {/* 3-Bar Hamburger Menu Toggle */}
            <button
              type="button"
              className="p-2 rounded-xl text-primary-900 hover:bg-primary-50 active:bg-primary-100 transition-colors min-h-[40px] min-w-[40px] flex items-center justify-center border border-gray-200"
              onClick={() => setIsOpen(!isOpen)}
              aria-expanded={isOpen}
              aria-label="Toggle Navigation Menu"
            >
              {isOpen ? <X size={22} className="text-primary-800" /> : <Menu size={22} className="text-primary-800" />}
            </button>
          </div>
        </div>

        {/* Mobile 3-Bar Slide-down Navigation Hub */}
        {isOpen && (
          <div className="lg:hidden pb-6 animate-in fade-in slide-in-from-top-3 duration-300 border-t border-primary-100 max-h-[80vh] overflow-y-auto">
            {/* Header with Dashboard shortcut & Language */}
            <div className="flex items-center justify-between pt-4 pb-3 border-b border-gray-100 px-1">
              <Link
                to="/"
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider ${
                  location.pathname === '/'
                    ? 'bg-primary-100 text-primary-900 border border-primary-200'
                    : 'bg-gray-50 text-soil-dark border border-gray-200'
                }`}
              >
                <LayoutDashboard size={15} className="text-primary-700" />
                <span>Dashboard</span>
              </Link>
              <LanguageSelector />
            </div>

            {/* Full Features Grid for Mobile */}
            <div className="pt-3">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider px-2 mb-2.5">
                Agricultural Services
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {allFeatures.map((feature) => {
                  const Icon = feature.icon;
                  const isActive = location.pathname === feature.to;
                  return (
                    <Link
                      key={feature.to}
                      to={feature.to}
                      onClick={() => setIsOpen(false)}
                      className={`flex items-center justify-between p-3 rounded-xl border transition-all ${
                        isActive
                          ? 'bg-primary-50 border-primary-300 text-primary-900 font-bold shadow-sm'
                          : feature.highlight
                          ? 'bg-emerald-50/80 border-emerald-200 text-emerald-950 font-bold'
                          : 'bg-white border-gray-200 hover:bg-gray-50 text-gray-800 font-medium'
                      }`}
                    >
                      <span className="text-sm font-bold text-soil-dark leading-tight pr-2">
                        {feature.label}
                      </span>
                      <div
                        className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 shadow-inner ${
                          isActive
                            ? 'bg-primary-700 text-white'
                            : feature.highlight
                            ? 'bg-emerald-600 text-white'
                            : 'bg-primary-50 text-primary-800'
                        }`}
                      >
                        <Icon size={18} />
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* User Profile / Auth Actions */}
            <div className="mt-4 pt-4 border-t border-gray-200">
              {user ? (
                <div className="flex items-center justify-between bg-primary-50/80 p-3.5 rounded-xl border border-primary-100">
                  <Link
                    to="/profile"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-3"
                  >
                    <div className="w-10 h-10 rounded-full bg-primary-700 text-white flex items-center justify-center font-bold text-sm shadow-sm">
                      {user?.fullName ? user.fullName[0].toUpperCase() : 'U'}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-soil-dark">{user?.fullName || 'Farmer User'}</p>
                      <p className="text-xs text-gray-500 font-medium">{user?.phone || 'Profile Settings'}</p>
                    </div>
                  </Link>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setIsOpen(false);
                      handleLogout();
                    }}
                    className="text-earth-700 hover:bg-earth-100/50 rounded-lg px-3 py-1.5 text-xs font-bold flex items-center gap-1.5"
                  >
                    <LogOut size={16} />
                    <span>Logout</span>
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3 pt-1">
                  <Link
                    to="/login"
                    onClick={() => setIsOpen(false)}
                    className="text-center font-bold px-4 py-3 rounded-xl border-2 border-earth-400 text-earth-700 hover:bg-earth-50 transition-all text-sm"
                  >
                    {t('common.login')}
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setIsOpen(false)}
                    className="text-center font-bold px-4 py-3 rounded-xl bg-gradient-to-r from-primary-700 to-primary-600 text-white shadow-agri transition-all text-sm"
                  >
                    {t('common.register')}
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

