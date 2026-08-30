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
            <img
              src="/images/farmer360_logo.png"
              alt="Farmer-360"
              className="h-10 w-auto object-contain"
            />
          </div>
          <p className="text-sm text-soil-light md:col-span-3 max-w-md">
            {t('footer.empower_note')}
          </p>
          <div>
            <h4 className="font-heading font-semibold text-soil mb-3">{t('footer.title_quick_links')}</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/markets" className="text-soil-light hover:text-primary-600 transition-colors">{t('common.market_prices')}</Link></li>
              <li><Link to="/schemes" className="text-soil-light hover:text-primary-600 transition-colors">{t('common.schemes')}</Link></li>
              <li><Link to="/crop-calendar" className="text-soil-light hover:text-primary-600 transition-colors">{t('nav.crop_calendar')}</Link></li>
              <li><Link to="/market-trends" className="text-soil-light hover:text-primary-600 transition-colors">{t('nav.trends')}</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-heading font-semibold text-soil mb-3">{t('footer.title_features')}</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/ai-chat" className="text-soil-light hover:text-primary-600 transition-colors">{t('common.ai_chat')}</Link></li>
              <li><Link to="/weather-forecast" className="text-soil-light hover:text-primary-600 transition-colors">{t('nav.weather')}</Link></li>
              <li><Link to="/alerts" className="text-soil-light hover:text-primary-600 transition-colors">{t('common.alerts')}</Link></li>
              <li><Link to="/profile" className="text-soil-light hover:text-primary-600 transition-colors">{t('common.profile')}</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-heading font-semibold text-soil mb-3">{t('footer.title_support')}</h4>
            <ul className="space-y-2 text-sm text-soil-light">
              <li>{t('footer.help_center')}</li>
              <li>{t('footer.contact_us')}</li>
              <li>{t('footer.privacy_policy')}</li>
              <li>{t('footer.terms_of_service')}</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-primary-100 pt-6 text-center text-sm text-soil-light">
          <p>{t('footer.copyright')}</p>
          <p className="mt-2">{t('footer.built_with_love')}</p>
        </div>
      </div>
    </footer>
  );
}
