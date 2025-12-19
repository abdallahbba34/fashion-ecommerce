import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Tajawal } from 'next/font/google';
import './globals.css';
import '@/styles/animations.css';
import ClientHeader from '@/components/layout/ClientHeader';
import Footer from '@/components/layout/Footer';
import ScrollToTop from '@/components/ui/ScrollToTop';
import { Toaster } from 'react-hot-toast';
import { LanguageProvider } from '@/contexts/LanguageContext';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const tajawal = Tajawal({
  subsets: ['arabic'],
  weight: ['400', '500', '700'],
  variable: '--font-tajawal'
});

export const metadata: Metadata = {
  title: 'FASHION - Boutique Mode en Algérie',
  description: 'Découvrez les dernières tendances mode pour femmes et enfants. Livraison dans toute l\'Algérie.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html suppressHydrationWarning>
      <body className={`${inter.variable} ${tajawal.variable} font-sans`} suppressHydrationWarning>
        <LanguageProvider>
          <div className="flex flex-col min-h-screen">
            <ClientHeader />
            <main className="flex-1">
              {children}
            </main>
            <Footer />
          </div>
          <ScrollToTop />
          <Toaster position="top-center" />
        </LanguageProvider>
      </body>
    </html>
  );
}
