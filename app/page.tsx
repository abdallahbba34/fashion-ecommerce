'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Button from '@/components/ui/Button';
import ProductCard from '@/components/ProductCard';
import { ProductGridSkeleton } from '@/components/ui/Skeleton';
import { ArrowRight, TruckIcon, ShieldCheck, HeadphonesIcon, Sparkles, TrendingUp, Tag, Star } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

export default function HomePage() {
  const { t } = useLanguage();
  const [allProducts, setAllProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('🚀 HomePage mounted, starting fetch...');
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      console.log('🔄 Fetching products for homepage...');
      const response = await fetch('/api/products?limit=100');
      console.log('📡 Response status:', response.status);

      if (response.ok) {
        const data = await response.json();
        console.log('✅ Products fetched:', data.products?.length || 0);
        console.log('📦 Products data:', data.products);
        setAllProducts(data.products || []);
      } else {
        console.error('❌ Failed to fetch products:', response.status, response.statusText);
      }
    } catch (error) {
      console.error('❌ Error fetching products:', error);
    } finally {
      console.log('✨ Setting loading to false');
      setLoading(false);
    }
  };

  // Get different product sections
  const featuredProducts = allProducts
    .filter(p => p.featured || p.bestseller)
    .slice(0, 4);

  const newProducts = allProducts
    .filter(p => p.newArrival)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 4);

  const allDisplayProducts = allProducts.slice(0, 8);

  // Debug logs - runs on every render
  useEffect(() => {
    console.log('🏪 Shop Display:', {
      total: allProducts.length,
      featured: featuredProducts.length,
      new: newProducts.length,
      display: allDisplayProducts.length,
      loading
    });
  }, [allProducts, loading]);
  const featuredCategories = [
    {
      name: t('categories.women'),
      image: '/images/women-collection.jpg',
      href: '/products?category=femmes&filter=new',
    },
    {
      name: t('categories.kids'),
      image: '/images/men-collection.jpg',
      href: '/products?category=enfants',
    },
    {
      name: t('categories.accessories'),
      image: '/images/accessories.jpg',
      href: '/products?category=accessoires',
    },
  ];

  const features = [
    {
      icon: TruckIcon,
      title: t('features.shipping.title'),
      description: t('features.shipping.description'),
    },
    {
      icon: ShieldCheck,
      title: t('features.payment.title'),
      description: t('features.payment.description'),
    },
    {
      icon: HeadphonesIcon,
      title: t('features.support.title'),
      description: t('features.support.description'),
    },
  ];

  return (
    <div>
      {/* Hero Section - Compact */}
      <section className="relative bg-gradient-to-r from-gray-900 to-gray-700 text-white">
        <div className="container mx-auto px-4 py-8 md:py-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            {/* Texte à gauche */}
            <div className="flex-1">
              <h1 className="text-3xl md:text-5xl font-bold mb-4 animate-fade-in">
                {t('hero.title')}
                <br />
                {t('hero.subtitle')}
              </h1>
              <p className="text-base md:text-lg text-gray-300 animate-slide-up">
                {t('hero.description')}
              </p>
            </div>

            {/* Boutons à droite */}
            <div className="flex flex-col sm:flex-row gap-4 md:flex-shrink-0">
              <Link href="/products?filter=new">
                <Button size="lg" className="w-full sm:w-auto whitespace-nowrap">
                  {t('hero.discover')}
                  <ArrowRight className="ml-2" size={20} />
                </Button>
              </Link>
              <Link href="/products?filter=sale">
                <Button variant="outline" size="lg" className="w-full sm:w-auto bg-white whitespace-nowrap">
                  {t('hero.sales')}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Shop Window - Vitrine de la Boutique */}
      <section className="py-16 bg-gradient-to-b from-white to-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-3">
              <Star className="text-yellow-500" size={32} fill="currentColor" />
              <h2 className="text-4xl font-bold">{t('shopWindow.title')}</h2>
              <Star className="text-yellow-500" size={32} fill="currentColor" />
            </div>
            <p className="text-gray-600 text-lg">{t('shopWindow.description')}</p>
          </div>

          {loading ? (
            <ProductGridSkeleton count={8} />
          ) : allDisplayProducts.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {allDisplayProducts.map((product, index) => (
                <div
                  key={product._id}
                  className="stagger-item"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg mb-4">{t('shopWindow.noProducts')}</p>
              <Link href="/products">
                <Button>{t('shopWindow.exploreAll')}</Button>
              </Link>
            </div>
          )}

          {!loading && allProducts.length > 8 && (
            <div className="text-center mt-8">
              <Link href="/products">
                <Button size="lg" className="gap-2">
                  {t('shopWindow.viewAll')} ({allProducts.length})
                  <ArrowRight size={20} />
                </Button>
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Featured Categories */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">{t('categories.title')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredCategories.map((category) => (
              <Link
                key={category.name}
                href={category.href}
                className="group relative overflow-hidden rounded-lg aspect-[3/4] bg-gray-200"
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
                <div className="absolute bottom-0 left-0 right-0 p-6 z-20">
                  <h3 className="text-2xl font-bold text-white mb-2">
                    {category.name}
                  </h3>
                  <span className="text-white underline group-hover:translate-x-2 transition-transform inline-block">
                    {t('categories.explore')}
                  </span>
                </div>
                {/* Placeholder for image - replace with actual images */}
                <div className="w-full h-full bg-gradient-to-br from-gray-300 to-gray-400 group-hover:scale-110 transition-transform duration-300" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-gray-100">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature) => (
              <div key={feature.title} className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-black text-white rounded-full flex items-center justify-center mb-4">
                  <feature.icon size={32} />
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* New Arrivals Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div className="animate-slideInLeft">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="text-yellow-500" size={24} />
                <h2 className="text-3xl font-bold">{t('newArrivals.title')}</h2>
              </div>
              <p className="text-gray-600">{t('newArrivals.description')}</p>
            </div>
            <Link href="/products?filter=new" className="animate-slideInRight">
              <Button variant="outline" className="gap-2">
                {t('newArrivals.viewAll')} <ArrowRight size={16} />
              </Button>
            </Link>
          </div>

          {loading ? (
            <ProductGridSkeleton count={4} />
          ) : newProducts.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {newProducts.map((product, index) => (
                <div
                  key={product._id}
                  className="stagger-item"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              {t('newArrivals.noProducts')}
            </div>
          )}
        </div>
      </section>

      {/* Featured Products Section */}
      {featuredProducts.length > 0 && (
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-8">
              <div className="animate-slideInLeft">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="text-blue-500" size={24} />
                  <h2 className="text-3xl font-bold">{t('featured.title')}</h2>
                </div>
                <p className="text-gray-600">{t('featured.description')}</p>
              </div>
              <Link href="/products" className="animate-slideInRight">
                <Button variant="outline" className="gap-2">
                  {t('featured.browse')} <ArrowRight size={16} />
                </Button>
              </Link>
            </div>

            {loading ? (
              <ProductGridSkeleton count={4} />
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {featuredProducts.map((product, index) => (
                  <div
                    key={product._id}
                    className="stagger-item"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <ProductCard product={product} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* Promotional Banner */}
      <section className="py-16 bg-gradient-to-r from-purple-600 to-pink-600 text-white animate-gradient">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto animate-scaleIn">
            <Tag size={48} className="mx-auto mb-4 animate-bounce-gentle" />
            <h2 className="text-4xl font-bold mb-4">{t('promo.title')}</h2>
            <p className="text-xl mb-8 text-white/90">
              {t('promo.description')}
            </p>
            <Link href="/products?filter=sale">
              <Button size="lg" className="bg-white text-purple-600 hover:bg-gray-100 font-bold">
                {t('promo.cta')}
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-black text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">{t('newsletter.title')}</h2>
          <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
            {t('newsletter.description')}
          </p>
          <div className="max-w-md mx-auto flex gap-4">
            <input
              type="email"
              placeholder={t('newsletter.placeholder')}
              className="flex-1 px-4 py-3 rounded-lg text-black"
            />
            <Button variant="outline" className="bg-white text-black hover:bg-gray-100">
              {t('newsletter.subscribe')}
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
