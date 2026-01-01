'use client';

import Link from 'next/link';
import Image from 'next/image';
import { formatPrice } from '@/lib/utils';
import type { Product } from '@/types';
import { useLanguage } from '@/contexts/LanguageContext';
import { Tag, CheckCircle, XCircle } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { t } = useLanguage();
  const hasDiscount = product.compareAtPrice && product.compareAtPrice > product.price;
  const discountPercent = hasDiscount
    ? Math.round(((product.compareAtPrice! - product.price) / product.compareAtPrice!) * 100)
    : 0;

  return (
    <Link href={`/products/${product.slug}`} className="group block">
      <div className="relative aspect-[3/4] bg-gray-100 rounded-lg overflow-hidden mb-3 hover-lift">
        {/* Badges */}
        <div className="absolute top-3 left-3 z-10 flex flex-col gap-2 animate-slideInLeft">
          {product.newArrival && (
            <span className="bg-black text-white text-xs font-semibold px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1.5">
              <span>✨</span>
              <span>{t('products.card.new')}</span>
            </span>
          )}
          {hasDiscount && (
            <span className="bg-gradient-to-r from-red-500 to-red-600 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
              -{discountPercent}%
            </span>
          )}
          {product.bestseller && !product.newArrival && (
            <span className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white text-xs font-semibold px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1.5">
              <span>⭐</span>
              <span>{t('products.card.best')}</span>
            </span>
          )}
        </div>

        {/* Product Image */}
        {product.images && product.images.length > 0 && product.images[0] ? (
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-500 ease-out"
            sizes="(max-width: 768px) 50vw, 33vw"
            loading="lazy"
            unoptimized
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
            <span className="text-gray-400 text-sm">{t('products.card.noImage')}</span>
          </div>
        )}

        {/* Gradient Overlay on Hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-6">
          <span className="text-white text-sm font-semibold px-6 py-2 border-2 border-white rounded-full backdrop-blur-sm bg-white/10 hover-scale">
            {t('products.card.viewMore')}
          </span>
        </div>
      </div>

      <div className="px-1">
        <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-black transition-colors line-clamp-2">
          {product.name}
        </h3>

        <p className="text-xs text-gray-500 uppercase tracking-wide mb-2 font-medium">
          {product.category}
        </p>

        <div className="flex items-center gap-2 mb-2">
          <Tag size={16} className="text-gray-500" />
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-bold text-black">
              {formatPrice(product.price)}
            </span>
            {hasDiscount && (
              <span className="text-sm text-gray-400 line-through">
                {formatPrice(product.compareAtPrice!)}
              </span>
            )}
          </div>
        </div>

        {hasDiscount && (
          <div className="mb-2">
            <span className="inline-block text-xs font-semibold text-green-700 bg-green-50 px-2 py-1 rounded flex items-center gap-1 w-fit">
              <Tag size={12} />
              {t('products.card.save')} {formatPrice(product.compareAtPrice! - product.price)}
            </span>
          </div>
        )}

        {product.colors && product.colors.length > 0 && (
          <div className="flex items-center gap-1.5 mt-2">
            {product.colors.slice(0, 4).map((color, index) => (
              <div
                key={index}
                className="w-5 h-5 rounded-full border-2 border-gray-200 shadow-sm hover:scale-110 transition-transform cursor-pointer"
                style={{ backgroundColor: color.toLowerCase() }}
                title={color}
              />
            ))}
            {product.colors.length > 4 && (
              <span className="text-xs text-gray-500 ml-1">
                +{product.colors.length - 4}
              </span>
            )}
          </div>
        )}

        {/* Stock indicator */}
        {product.variants && product.variants.length > 0 && (
          <div className="mt-2">
            {product.variants.some((v: any) => v.stock > 0) ? (
              <span className="text-xs text-green-600 font-medium flex items-center gap-1">
                <CheckCircle size={14} />
                {t('products.card.inStock')}
              </span>
            ) : (
              <span className="text-xs text-red-600 font-medium flex items-center gap-1">
                <XCircle size={14} />
                {t('products.card.outOfStock')}
              </span>
            )}
          </div>
        )}
      </div>
    </Link>
  );
}
