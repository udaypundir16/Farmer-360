import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Wheat } from 'lucide-react';

export default function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="bg-white border-t border-primary-100 mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-6">
          <div className="flex items-center gap-2">
            <Wheat className="text-primary-600" size={24} />
            <h3 className="font-heading font-bold text-soil">SmartAgri</h3>
          </div>
          <p className="text-sm text-soil-light md:col-span-3 max-w-md">
            Empowering farmers with intelligent agricultural solutions.
          </p>
          <div>
            <h4 className="font-heading font-semibold text-soil mb-3">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/markets" className="text-soil-light hover:text-primary-600 transition-colors">Market Prices</Link></li>
              <li><Link to="/schemes" className="text-soil-light hover:text-primary-600 transition-colors">Schemes</Link></li>
              <li><Link to="/crop-calendar" className="text-soil-light hover:text-primary-600 transition-colors">Crop Calendar</Link></li>
              <li><Link to="/market-trends" className="text-soil-light hover:text-primary-600 transition-colors">Market Trends</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-heading font-semibold text-soil mb-3">Features</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/ai-chat" className="text-soil-light hover:text-primary-600 transition-colors">AI Assistant</Link></li>
              <li><Link to="/weather-forecast" className="text-soil-light hover:text-primary-600 transition-colors">Weather Forecast</Link></li>
              <li><Link to="/alerts" className="text-soil-light hover:text-primary-600 transition-colors">Price Alerts</Link></li>
              <li><Link to="/profile" className="text-soil-light hover:text-primary-600 transition-colors">Profile</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-heading font-semibold text-soil mb-3">Support</h4>
            <ul className="space-y-2 text-sm text-soil-light">
              <li>Help Center</li>
              <li>Contact Us</li>
              <li>Privacy Policy</li>
              <li>Terms of Service</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-primary-100 pt-6 text-center text-sm text-soil-light">
          <p>&copy; 2025 Smart Agricultural Intelligence Platform. All rights reserved.</p>
          <p className="mt-2">Built for farmers</p>
        </div>
      </div>
    </footer>
  );
}
