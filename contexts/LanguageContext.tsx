'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import frCommon from '@/messages/fr/common.json';
import arCommon from '@/messages/ar/common.json';
import frHome from '@/messages/fr/home.json';
import arHome from '@/messages/ar/home.json';
import frProducts from '@/messages/fr/products.json';
import arProducts from '@/messages/ar/products.json';
import frProductDetail from '@/messages/fr/product-detail.json';
import arProductDetail from '@/messages/ar/product-detail.json';
import frCart from '@/messages/fr/cart.json';
import arCart from '@/messages/ar/cart.json';
import frCheckout from '@/messages/fr/checkout.json';
import arCheckout from '@/messages/ar/checkout.json';
import frOrderConfirmation from '@/messages/fr/order-confirmation.json';
import arOrderConfirmation from '@/messages/ar/order-confirmation.json';
import frContact from '@/messages/fr/contact.json';
import arContact from '@/messages/ar/contact.json';
import frFAQ from '@/messages/fr/faq.json';
import arFAQ from '@/messages/ar/faq.json';
import frTerms from '@/messages/fr/terms.json';
import arTerms from '@/messages/ar/terms.json';
import frShipping from '@/messages/fr/shipping.json';
import arShipping from '@/messages/ar/shipping.json';
import frReturns from '@/messages/fr/returns.json';
import arReturns from '@/messages/ar/returns.json';
import frLegal from '@/messages/fr/legal.json';
import arLegal from '@/messages/ar/legal.json';

// Merge all translation files
const frTranslations = { ...frCommon, ...frHome, products: frProducts, productDetail: frProductDetail, cart: frCart, checkout: frCheckout, orderConfirmation: frOrderConfirmation, contact: frContact, faq: frFAQ, terms: frTerms, shipping: frShipping, returns: frReturns, legal: frLegal };
const arTranslations = { ...arCommon, ...arHome, products: arProducts, productDetail: arProductDetail, cart: arCart, checkout: arCheckout, orderConfirmation: arOrderConfirmation, contact: arContact, faq: arFAQ, terms: arTerms, shipping: arShipping, returns: arReturns, legal: arLegal };

type Locale = 'fr' | 'ar';

interface LanguageContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string) => string;
  dir: 'ltr' | 'rtl';
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>('fr');
  const [isClient, setIsClient] = useState(false);

  // Detect client-side and load locale from localStorage
  useEffect(() => {
    setIsClient(true);
    const savedLocale = localStorage.getItem('locale') as Locale;
    if (savedLocale && (savedLocale === 'fr' || savedLocale === 'ar')) {
      setLocaleState(savedLocale);
      // Update HTML attributes immediately
      document.documentElement.dir = savedLocale === 'ar' ? 'rtl' : 'ltr';
      document.documentElement.lang = savedLocale;
    }
  }, []);

  // Save locale to localStorage when it changes
  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
    if (typeof window !== 'undefined') {
      localStorage.setItem('locale', newLocale);
      // Update HTML dir attribute
      document.documentElement.dir = newLocale === 'ar' ? 'rtl' : 'ltr';
      document.documentElement.lang = newLocale;
    }
  };

  // Translation function
  const t = (key: string): string => {
    const translations = locale === 'ar' ? arTranslations : frTranslations;
    const keys = key.split('.');
    let value: any = translations;

    for (const k of keys) {
      value = value?.[k];
      if (value === undefined) return key;
    }

    return typeof value === 'string' ? value : key;
  };

  const dir = locale === 'ar' ? 'rtl' : 'ltr';

  return (
    <LanguageContext.Provider value={{ locale, setLocale, t, dir }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
