'use client';

import Link from 'next/link';
import { Facebook, Instagram, Twitter } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import LanguageSwitcher from '@/components/LanguageSwitcher';

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About */}
          <div>
            <h3 className="text-white text-lg font-bold mb-4">{t('footer.about')}</h3>
            <p className="text-sm">
              {t('footer.aboutText')}
            </p>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="text-white font-semibold mb-4">{t('footer.customerService')}</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/contact" className="hover:text-white transition-colors">{t('footer.contact')}</Link></li>
              <li><Link href="/faq" className="hover:text-white transition-colors">{t('footer.faq')}</Link></li>
              <li><Link href="/shipping" className="hover:text-white transition-colors">{t('footer.shipping')}</Link></li>
              <li><Link href="/returns" className="hover:text-white transition-colors">{t('footer.returns')}</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-white font-semibold mb-4">{t('footer.legal')}</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/terms" className="hover:text-white transition-colors">{t('footer.terms')}</Link></li>
              <li><Link href="/privacy" className="hover:text-white transition-colors">{t('footer.privacy')}</Link></li>
              <li><Link href="/legal" className="hover:text-white transition-colors">{t('footer.legalMentions')}</Link></li>
            </ul>
          </div>

          {/* Newsletter & Social */}
          <div>
            <h4 className="text-white font-semibold mb-4">{t('footer.stayConnected')}</h4>
            <p className="text-sm mb-4">
              {t('footer.newsletter')}
            </p>
            <div className="flex space-x-4 mb-4">
              <a href="#" className="hover:text-white transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" className="hover:text-white transition-colors">
                <Instagram size={20} />
              </a>
              <a href="#" className="hover:text-white transition-colors">
                <Twitter size={20} />
              </a>
            </div>
            <div className="mt-4">
              <LanguageSwitcher />
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm">
          <p>&copy; {new Date().getFullYear()} {t('footer.about')}. {t('footer.allRights')}.</p>
        </div>
      </div>
    </footer>
  );
}
