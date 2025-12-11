import Link from 'next/link';
import Image from 'next/image';
import { formatPrice } from '@/lib/utils';
import type { Product } from '@/types';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const hasDiscount = product.compareAtPrice && product.compareAtPrice > product.price;
  const discountPercent = hasDiscount
    ? Math.round(((product.compareAtPrice! - product.price) / product.compareAtPrice!) * 100)
    : 0;

  return (
    <Link href={`/products/${product.slug}`} className="group">
      <div className="relative aspect-[3/4] bg-gray-100 rounded-lg overflow-hidden mb-3">
        {/* Badges */}
        <div className="absolute top-2 left-2 z-10 flex flex-col gap-2">
          {product.newArrival && (
            <span className="bg-black text-white text-xs px-2 py-1 rounded">
              Nouveau
            </span>
          )}
          {hasDiscount && (
            <span className="bg-red-600 text-white text-xs px-2 py-1 rounded">
              -{discountPercent}%
            </span>
          )}
        </div>

        {/* Product Image */}
        {product.images && product.images.length > 0 ? (
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 50vw, 33vw"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
            <span className="text-gray-400 text-sm">Pas d'image</span>
          </div>
        )}

        {/* Quick View Overlay */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <span className="text-white text-sm font-medium">Voir Détails</span>
        </div>
      </div>

      <div>
        <h3 className="font-medium text-gray-900 mb-1 group-hover:underline">
          {product.name}
        </h3>
        <p className="text-sm text-gray-500 mb-2">{product.category}</p>
        <div className="flex items-center gap-2">
          <span className="font-semibold text-gray-900">
            {formatPrice(product.price)}
          </span>
          {hasDiscount && (
            <span className="text-sm text-gray-500 line-through">
              {formatPrice(product.compareAtPrice!)}
            </span>
          )}
        </div>
        {product.colors.length > 0 && (
          <div className="flex gap-1 mt-2">
            {product.colors.slice(0, 5).map((color) => (
              <div
                key={color}
                className="w-4 h-4 rounded-full border border-gray-300"
                style={{ backgroundColor: color.toLowerCase() }}
                title={color}
              />
            ))}
          </div>
        )}
      </div>
    </Link>
  );
}
