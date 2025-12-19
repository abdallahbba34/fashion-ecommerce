'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useCart } from '@/store/cart';
import { useLanguage } from '@/contexts/LanguageContext';
import { ShoppingBag, Search, Menu, X, User } from 'lucide-react';
import LanguageSwitcher from '@/components/LanguageSwitcher';

export default function ClientHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const itemCount = useCart((state) => state.getItemCount());
  const { t } = useLanguage();

  const categories = [
    { name: t('nav.nouveautes'), href: '/products?filter=new' },
    { name: t('nav.femmes'), href: '/products?category=femmes' },
    { name: t('nav.enfants'), href: '/products?category=enfants' },
    { name: t('nav.accessoires'), href: '/products?category=accessoires' },
    { name: t('nav.soldes'), href: '/products?filter=sale' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
      {/* Top Banner */}
      <div className="bg-black text-white text-center py-2 text-sm">
        {t('banner')}
      </div>

      {/* Main Header */}
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          {/* Logo */}
          <Link href="/" className="text-2xl font-bold tracking-tight">
            FASHION
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            {categories.map((category) => (
              <Link
                key={category.name}
                href={category.href}
                className="text-sm font-medium hover:text-gray-600 transition-colors"
              >
                {category.name}
              </Link>
            ))}
          </nav>

          {/* Right Icons */}
          <div className="flex items-center space-x-4">
            <button className="p-2 hover:bg-gray-100 rounded-lg">
              <Search size={20} />
            </button>
            <LanguageSwitcher />
            <Link href="/account" className="p-2 hover:bg-gray-100 rounded-lg">
              <User size={20} />
            </Link>
            <Link href="/cart" className="p-2 hover:bg-gray-100 rounded-lg relative">
              <ShoppingBag size={20} />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-black text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </Link>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="lg:hidden py-4 border-t border-gray-200">
            {categories.map((category) => (
              <Link
                key={category.name}
                href={category.href}
                className="block py-3 text-sm font-medium hover:bg-gray-50 px-2 rounded-lg"
                onClick={() => setIsMenuOpen(false)}
              >
                {category.name}
              </Link>
            ))}
          </nav>
        )}
      </div>
    </header>
  );
}
