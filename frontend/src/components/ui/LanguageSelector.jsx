import { useTranslation } from 'react-i18next';
import { Button } from './button';
import { Languages } from 'lucide-react';

export default function LanguageSelector() {
  const { i18n } = useTranslation();

  const currentLang = (i18n.language || 'en').split('-')[0];

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    localStorage.setItem('i18nextLng', lng);
  };

  return (
    <div className="flex items-center space-x-2">
      <Languages size={18} />
      <select
        value={currentLang}
        onChange={(e) => changeLanguage(e.target.value)}
        className="border rounded px-2 py-1 text-sm bg-white"
      >
        <option value="en">English</option>
        <option value="hi">हिन्दी</option>
        <option value="pa">ਪੰਜਾਬੀ</option>
        <option value="ta">தமிழ்</option>
      </select>
    </div>
  );
}