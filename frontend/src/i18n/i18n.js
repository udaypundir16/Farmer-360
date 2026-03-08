import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import enTranslations from './locales/en/translation.json';
import hiTranslations from './locales/hi/translation.json';
import taTranslations from './locales/ta/translation.json';
import paTranslations from './locales/pa/translation.json';

const resources = {
  en: { translation: enTranslations },
  hi: { translation: hiTranslations },
  ta: { translation: taTranslations },
  pa: { translation: paTranslations },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    debug: import.meta.env.DEV,
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;