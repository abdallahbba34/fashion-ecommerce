'use client';

import Link from 'next/link';
import Button from '@/components/ui/Button';
import { CheckCircle } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

export default function OrderConfirmationPage() {
  const { t } = useLanguage();
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-2xl mx-auto text-center">
        <CheckCircle size={64} className="mx-auto text-green-600 mb-4" />

        <h1 className="text-3xl font-bold mb-4">{t('orderConfirmation.title')}</h1>

        <p className="text-gray-600 mb-8">
          {t('orderConfirmation.thankYou')}
        </p>

        <div className="bg-gray-50 rounded-lg p-6 mb-8">
          <h2 className="font-semibold mb-2">{t('orderConfirmation.nextSteps.title')}</h2>
          <ul className="text-sm text-gray-600 space-y-2">
            <li>{t('orderConfirmation.nextSteps.step1')}</li>
            <li>{t('orderConfirmation.nextSteps.step2')}</li>
            <li>{t('orderConfirmation.nextSteps.step3')}</li>
            <li>{t('orderConfirmation.nextSteps.step4')}</li>
          </ul>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/products">
            <Button variant="outline" size="lg">
              {t('orderConfirmation.continueShopping')}
            </Button>
          </Link>
          <Link href="/account/orders">
            <Button size="lg">
              {t('orderConfirmation.trackOrder')}
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
