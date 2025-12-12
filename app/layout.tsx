import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import '@/styles/animations.css';
import ClientHeader from '@/components/layout/ClientHeader';
import Footer from '@/components/layout/Footer';
import ScrollToTop from '@/components/ui/ScrollToTop';
import { Toaster } from 'react-hot-toast';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'FASHION - Boutique Mode en Algérie',
  description: 'Découvrez les dernières tendances mode pour hommes et femmes. Livraison dans toute l\'Algérie.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body className={inter.className}>
        <div className="flex flex-col min-h-screen">
          <ClientHeader />
          <main className="flex-1">
            {children}
          </main>
          <Footer />
        </div>
        <ScrollToTop />
        <Toaster position="top-center" />
      </body>
    </html>
  );
}
