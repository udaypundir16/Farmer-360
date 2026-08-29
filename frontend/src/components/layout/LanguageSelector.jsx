import { useTranslation } from 'react-i18next';
import { Languages } from 'lucide-react';
import { Button } from '../ui/button';

export default function LanguageSelector() {
  const { i18n } = useTranslation();

  const currentLang = (i18n.language || 'en').split('-')[0];

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    localStorage.setItem('i18nextLng', lng);
  };

  return (
    <div className="flex items-center space-x-3 bg-white/50 p-1.5 rounded-lg border border-primary-100/50">
      <Languages size={22} className="text-primary-700" />
      <select
        value={currentLang}
        onChange={(e) => changeLanguage(e.target.value)}
        className="bg-transparent text-base font-medium text-soil-light focus:outline-none cursor-pointer py-1"
      >
        <option value="en">English</option>
        <option value="hi">हिन्दी</option>
        <option value="pa">ਪੰਜਾਬੀ</option>
        <option value="ta">தமிழ்</option>
      </select>
    </div>
  );
}
