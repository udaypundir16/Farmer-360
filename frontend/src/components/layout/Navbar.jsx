import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import LanguageSelector from './LanguageSelector';
import { Menu, X, LogOut, User, Wheat, Truck, DollarSign, MessageSquare } from 'lucide-react';
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

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navLinks = [
    { to: '/', label: t('common.dashboard') },
    { to: '/ai-chat', label: t('common.ai_chat') },
  ];

  return (
    <nav
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${scrolled ? 'glass-navbar shadow-agri' : 'bg-cream-100/90 backdrop-blur-md border-b border-primary-100/40'
        }`}
    >
      <div className="w-[98%] max-w-[1400px] mx-auto px-2 sm:px-4">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-3 group transition-transform duration-300 hover:scale-[1.02]"
          >
            <div className="p-2.5 rounded-agri bg-gradient-to-br from-primary-700 to-primary-600 shadow-agri group-hover:shadow-agri-glow transition-shadow duration-300">
              <Wheat size={26} className="text-gold-200" strokeWidth={2.5} />
            </div>
            <span className="font-heading text-2xl font-bold text-primary-800 tracking-tight">
              SmartAgri
            </span>
          </Link>

          {/* Desktop menu */}
          <div className="hidden lg:flex items-center gap-8 flex-1 ml-10">
            {/* Main navigation links */}
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

          {/* Right section */}
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

          {/* Mobile menu button */}
          <button
            type="button"
            className="md:hidden p-2 rounded-agri text-primary-700 hover:bg-primary-50 transition-all duration-300"
            onClick={() => setIsOpen(!isOpen)}
            aria-expanded={isOpen}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile menu */}
        {isOpen && (
          <div className="md:hidden pb-6 animate-in fade-in slide-in-from-top-4 duration-300 border-t border-primary-100/50">
            <div className="space-y-1 pt-4">
              {/* Main navigation links */}
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`block px-4 py-3 rounded-lg font-medium transition-colors ${location.pathname === link.to
                    ? 'bg-primary-100 text-primary-800'
                    : 'text-soil-light hover:bg-primary-50'
                    }`}
                  onClick={() => setIsOpen(false)}
                >
                  {link.label}
                </Link>
              ))}


            </div>
            <div className="flex items-center justify-between pt-4 mt-4 border-t border-primary-100/50">
              <div className="flex items-center gap-3">
                <LanguageSelector />
              </div>
              {user && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                  className="text-earth-600 hover:bg-earth-50"
                >
                  <LogOut size={18} />
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
