'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useCart } from '@/store/cart';
import { formatPrice } from '@/lib/utils';
import Button from '@/components/ui/Button';
import { ShoppingBag, Heart, Share2, TruckIcon } from 'lucide-react';
import toast from 'react-hot-toast';
import Image from 'next/image';

interface Product {
  _id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  compareAtPrice?: number;
  category: string;
  images: string[];
  variants: { size: string; color: string; stock: number }[];
  sizes: string[];
  colors: string[];
  material: string;
  care: string;
  featured: boolean;
  newArrival: boolean;
  bestseller: boolean;
}

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const addItem = useCart((state) => state.addItem);

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);

  // Load product data
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`/api/products/${params.slug}`);
        if (!response.ok) {
          throw new Error('Produit non trouvé');
        }
        const data = await response.json();
        setProduct(data);
      } catch (error) {
        console.error('Error loading product:', error);
        toast.error('Produit non trouvé');
        router.push('/products');
      } finally {
        setLoading(false);
      }
    };

    if (params.slug) {
      fetchProduct();
    }
  }, [params.slug, router]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Chargement...</div>
      </div>
    );
  }

  if (!product) {
    return null;
  }

  const selectedVariant = product.variants.find(
    (v) => v.size === selectedSize && v.color === selectedColor
  );

  const handleAddToCart = () => {
    if (!selectedSize || !selectedColor) {
      toast.error('Veuillez sélectionner une taille et une couleur');
      return;
    }

    if (!selectedVariant || selectedVariant.stock < quantity) {
      toast.error('Stock insuffisant');
      return;
    }

    addItem({
      productId: product._id,
      name: product.name,
      price: product.price,
      image: product.images[0],
      size: selectedSize,
      color: selectedColor,
      quantity,
    });

    toast.success('Produit ajouté au panier');
  };

  const hasDiscount = product.compareAtPrice && product.compareAtPrice > product.price;
  const discountPercent = hasDiscount
    ? Math.round(((product.compareAtPrice! - product.price) / product.compareAtPrice!) * 100)
    : 0;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Product Images */}
        <div>
          {/* Main Image */}
          <div className="aspect-[3/4] bg-gray-100 rounded-lg mb-4 overflow-hidden relative">
            {product.images && product.images.length > 0 ? (
              <Image
                src={product.images[selectedImage] || product.images[0]}
                alt={product.name}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                <span className="text-gray-400">Pas d'image</span>
              </div>
            )}
          </div>

          {/* Thumbnail Images */}
          <div className="grid grid-cols-4 gap-4">
            {product.images && product.images.slice(0, 4).map((image, index) => (
              <button
                key={index}
                onClick={() => setSelectedImage(index)}
                className={`
                  aspect-square bg-gray-100 rounded-lg overflow-hidden relative
                  ${selectedImage === index ? 'ring-2 ring-black' : ''}
                `}
              >
                <Image
                  src={image}
                  alt={`${product.name} ${index + 1}`}
                  fill
                  className="object-cover"
                  sizes="150px"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div>
          {/* Title & Price */}
          <div className="mb-6">
            {product.newArrival && (
              <span className="inline-block bg-black text-white text-xs px-2 py-1 rounded mb-2">
                Nouveau
              </span>
            )}
            <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
            <div className="flex items-baseline gap-3">
              <span className="text-2xl font-bold">{formatPrice(product.price)}</span>
              {hasDiscount && (
                <>
                  <span className="text-lg text-gray-500 line-through">
                    {formatPrice(product.compareAtPrice!)}
                  </span>
                  <span className="text-red-600 font-medium">-{discountPercent}%</span>
                </>
              )}
            </div>
          </div>

          {/* Color Selection */}
          <div className="mb-6">
            <label className="block font-medium mb-3">
              Couleur: {selectedColor && <span className="font-normal text-gray-600">{selectedColor}</span>}
            </label>
            <div className="flex gap-2">
              {product.colors.map((color) => (
                <button
                  key={color}
                  onClick={() => setSelectedColor(color)}
                  className={`
                    w-10 h-10 rounded-full border-2 transition-all
                    ${selectedColor === color ? 'border-black scale-110' : 'border-gray-300'}
                  `}
                  style={{ backgroundColor: color.toLowerCase() }}
                  title={color}
                />
              ))}
            </div>
          </div>

          {/* Size Selection */}
          <div className="mb-6">
            <label className="block font-medium mb-3">
              Taille: {selectedSize && <span className="font-normal text-gray-600">{selectedSize}</span>}
            </label>
            <div className="flex flex-wrap gap-2">
              {/* Option Toute */}
              <button
                onClick={() => setSelectedSize('Toute')}
                className={`
                  px-6 py-3 rounded-lg border-2 font-medium transition-all
                  ${selectedSize === 'Toute'
                    ? 'bg-black text-white border-black'
                    : 'bg-white text-gray-900 border-gray-300 hover:border-black'
                  }
                `}
              >
                Toute
              </button>
              {/* Tailles du produit */}
              {product.sizes.map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`
                    px-6 py-3 rounded-lg border-2 font-medium transition-all
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

          {/* Quantity */}
          <div className="mb-6">
            <label className="block font-medium mb-3">Quantité</label>
            <div className="flex items-center gap-4">
              <div className="flex items-center border rounded-lg">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-4 py-2 hover:bg-gray-100"
                >
                  -
                </button>
                <span className="px-6 py-2 border-x">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-4 py-2 hover:bg-gray-100"
                >
                  +
                </button>
              </div>
              {selectedVariant && (
                <span className="text-sm text-gray-600">
                  {selectedVariant.stock} en stock
                </span>
              )}
            </div>
          </div>

          {/* Add to Cart */}
          <div className="flex gap-4 mb-8">
            <Button
              onClick={handleAddToCart}
              size="lg"
              className="flex-1"
            >
              <ShoppingBag className="mr-2" size={20} />
              Ajouter au Panier
            </Button>
            <button className="p-3 border rounded-lg hover:bg-gray-100">
              <Heart size={24} />
            </button>
            <button className="p-3 border rounded-lg hover:bg-gray-100">
              <Share2 size={24} />
            </button>
          </div>

          {/* Shipping Info */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <div className="flex items-start gap-3">
              <TruckIcon size={24} className="text-gray-600 mt-1" />
              <div>
                <h3 className="font-medium mb-1">Livraison Gratuite</h3>
                <p className="text-sm text-gray-600">
                  Pour les commandes supérieures à 5000 DA. Livraison sous 48-72h.
                </p>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="border-t pt-6">
            <h2 className="font-semibold text-lg mb-3">Description</h2>
            <p className="text-gray-600 leading-relaxed mb-4">{product.description}</p>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium">Matière:</span>
                <span className="text-gray-600 ml-2">{product.material}</span>
              </div>
              <div>
                <span className="font-medium">Entretien:</span>
                <span className="text-gray-600 ml-2">{product.care}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
