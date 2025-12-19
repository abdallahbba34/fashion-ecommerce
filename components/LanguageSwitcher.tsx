'use client';

import { useLanguage } from '@/contexts/LanguageContext';
import { Globe } from 'lucide-react';

export default function LanguageSwitcher() {
  const { locale, setLocale, t } = useLanguage();

  const toggleLanguage = () => {
    setLocale(locale === 'fr' ? 'ar' : 'fr');
  };

  return (
    <button
      onClick={toggleLanguage}
      className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-lg transition-colors"
      aria-label={locale === 'fr' ? 'Switch to Arabic' : 'Switch to French'}
    >
      <Globe size={20} />
      <span className="text-sm font-medium">
        {locale === 'fr' ? t('language.arabic') : t('language.french')}
      </span>
    </button>
  );
}
