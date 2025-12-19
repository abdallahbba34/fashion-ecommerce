'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import ProductCard from '@/components/ProductCard';
import { ProductGridSkeleton } from '@/components/ui/Skeleton';
import { Filter, X } from 'lucide-react';
import Button from '@/components/ui/Button';
import { useLanguage } from '@/contexts/LanguageContext';

export default function ProductsPage() {
  const { t } = useLanguage();
  const searchParams = useSearchParams();
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('tous');
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const [selectedSize, setSelectedSize] = useState<string>('all');
  const [priceRange, setPriceRange] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('newest');
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Apply URL filters on mount
  useEffect(() => {
    const category = searchParams.get('category');
    const filter = searchParams.get('filter');

    if (category) {
      setSelectedCategory(category);
    }
    if (filter) {
      setSelectedFilter(filter);
    }
  }, [searchParams]);

  // Load products from API
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/products?limit=100');

      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }

      const data = await response.json();
      setProducts(data.products || []);
    } catch (error) {
      console.error('Error fetching products:', error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  // Filter and sort products
  const filteredProducts = products.filter((product) => {
    // Category filter
    if (selectedCategory !== 'all' && selectedCategory !== 'tous') {
      if (product.category !== selectedCategory) return false;
    }

    // Special filters (new, sale)
    if (selectedFilter !== 'all') {
      if (selectedFilter === 'new' && !product.newArrival) return false;
      if (selectedFilter === 'sale' && (!product.compareAtPrice || product.compareAtPrice <= product.price)) return false;
    }

    // Size filter
    if (selectedSize !== 'all') {
      if (!product.sizes?.includes(selectedSize)) return false;
    }

    // Price filter
    if (priceRange !== 'all') {
      const price = product.price;
      if (priceRange === '0-3000' && price >= 3000) return false;
      if (priceRange === '3000-5000' && (price < 3000 || price >= 5000)) return false;
      if (priceRange === '5000-10000' && (price < 5000 || price >= 10000)) return false;
      if (priceRange === '10000+' && price < 10000) return false;
    }

    return true;
  }).sort((a, b) => {
    // Sort products
    if (sortBy === 'newest') {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    } else if (sortBy === 'price-asc') {
      return a.price - b.price;
    } else if (sortBy === 'price-desc') {
      return b.price - a.price;
    }
    return 0;
  });

  const categories = [
    { label: t('products.category.all'), value: 'tous' },
    { label: t('products.category.femmes'), value: 'femmes' },
    { label: t('products.category.enfants'), value: 'enfants' },
    { label: t('products.category.accessoires'), value: 'accessoires' },
  ];
  const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
  const priceRanges = [
    { label: t('products.price.all'), value: 'all' },
    { label: t('products.price.under3000'), value: '0-3000' },
    { label: t('products.price.range3000'), value: '3000-5000' },
    { label: t('products.price.range5000'), value: '5000-10000' },
    { label: t('products.price.over10000'), value: '10000+' },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Page Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">{t('products.title')}</h1>
          <p className="text-gray-600">
            {loading ? t('products.loading') : `${filteredProducts.length} ${t('products.productsAvailable')}`}
          </p>
        </div>

        {/* Mobile Filter Toggle */}
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="lg:hidden flex items-center gap-2 px-4 py-2 border rounded-lg"
        >
          <Filter size={20} />
          {t('products.filters')}
        </button>
      </div>

      <div className="flex gap-8">
        {/* Sidebar Filters */}
        <aside
          className={`
            ${showFilters ? 'block' : 'hidden'} lg:block
            fixed lg:relative inset-0 lg:inset-auto z-50 lg:z-auto
            bg-white lg:bg-transparent p-4 lg:p-0
            overflow-y-auto lg:overflow-visible
            w-full lg:w-64 flex-shrink-0
          `}
        >
          <div className="lg:sticky lg:top-4">
            {/* Mobile Close Button */}
            <div className="lg:hidden flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">{t('products.filters')}</h2>
              <button onClick={() => setShowFilters(false)}>
                <X size={24} />
              </button>
            </div>

            {/* Category Filter */}
            <div className="mb-6">
              <h3 className="font-semibold mb-3">{t('products.category.title')}</h3>
              <div className="space-y-2">
                {categories.map((category) => (
                  <label key={category.value} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="category"
                      value={category.value}
                      checked={selectedCategory === category.value}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="w-4 h-4"
                    />
                    <span className="text-sm">{category.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Size Filter */}
            <div className="mb-6">
              <h3 className="font-semibold mb-3">{t('products.size.title')}</h3>
              <div className="grid grid-cols-3 gap-2">
                {/* Bouton Toutes les tailles */}
                <button
                  onClick={() => setSelectedSize('all')}
                  className={`
                    px-3 py-2 rounded border text-sm font-medium transition-colors col-span-3
                    ${selectedSize === 'all'
                      ? 'bg-black text-white border-black'
                      : 'bg-white text-gray-900 border-gray-300 hover:border-black'
                    }
                  `}
                >
                  {t('products.size.allSizes')}
                </button>
                {sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(selectedSize === size ? 'all' : size)}
                    className={`
                      px-3 py-2 rounded border text-sm font-medium transition-colors
                      ${selectedSize === size
                        ? 'bg-black text-white border-black'
                        : 'bg-white text-gray-900 border-gray-300 hover:border-black'
                      }
                    `}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Filter */}
            <div className="mb-6">
              <h3 className="font-semibold mb-3">{t('products.price.title')}</h3>
              <div className="space-y-2">
                {priceRanges.map((range) => (
                  <label key={range.value} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="price"
                      value={range.value}
                      checked={priceRange === range.value}
                      onChange={(e) => setPriceRange(e.target.value)}
                      className="w-4 h-4"
                    />
                    <span className="text-sm">{range.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Clear Filters */}
            <Button
              variant="outline"
              className="w-full"
              onClick={() => {
                setSelectedCategory('tous');
                setSelectedFilter('all');
                setSelectedSize('all');
                setPriceRange('all');
              }}
            >
              {t('products.reset')}
            </Button>
          </div>
        </aside>

        {/* Products Grid */}
        <div className="flex-1">
          {/* Sort Options */}
          <div className="flex items-center justify-between mb-6">
            <p className="text-sm text-gray-600">
              {t('products.showing')} {filteredProducts.length} {t('products.results')}
            </p>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
            >
              <option value="newest">{t('products.sort.newest')}</option>
              <option value="price-asc">{t('products.sort.priceAsc')}</option>
              <option value="price-desc">{t('products.sort.priceDesc')}</option>
              <option value="popular">{t('products.sort.popular')}</option>
            </select>
          </div>

          {/* Products Grid */}
          {loading ? (
            <ProductGridSkeleton count={9} />
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-16 animate-fadeIn">
              <div className="inline-block p-6 bg-gray-50 rounded-full mb-4">
                <Filter size={48} className="text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">{t('products.empty.title')}</h3>
              <p className="text-gray-500 mb-6">
                {t('products.empty.description')}
              </p>
              <Button
                variant="outline"
                onClick={() => {
                  setSelectedCategory('tous');
                  setSelectedFilter('all');
                  setSelectedSize('all');
                  setPriceRange('all');
                }}
              >
                {t('products.resetFilters')}
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product, index) => (
                <div
                  key={product._id}
                  className="stagger-item"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          )}

          {/* Load More */}
          <div className="mt-12 text-center">
            <Button variant="outline" size="lg">
              {t('products.loadMore')}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
