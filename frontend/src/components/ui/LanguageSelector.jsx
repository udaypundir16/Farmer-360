import { useTranslation } from 'react-i18next';
import { Button } from './button';
import { Languages } from 'lucide-react';

export default function LanguageSelector() {
  const { i18n } = useTranslation();

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  return (
    <div className="flex items-center space-x-2">
      <Languages size={18} />
      <select
        value={i18n.language}
        onChange={(e) => changeLanguage(e.target.value)}
        className="border rounded px-2 py-1 text-sm"
      >
        <option value="en">English</option>
        <option value="hi">हिन्दी</option>
        <option value="ta">தமிழ்</option>
      </select>
    </div>
  );
}