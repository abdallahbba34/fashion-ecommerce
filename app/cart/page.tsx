'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/store/cart';
import { formatPrice } from '@/lib/utils';
import Button from '@/components/ui/Button';
import { Trash2, ShoppingBag } from 'lucide-react';

export default function CartPage() {
  const { items, removeItem, updateQuantity, getTotal } = useCart();

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto text-center">
          <ShoppingBag size={64} className="mx-auto text-gray-400 mb-4" />
          <h1 className="text-2xl font-bold mb-2">Votre panier est vide</h1>
          <p className="text-gray-600 mb-6">
            Découvrez nos produits et ajoutez-les à votre panier
          </p>
          <Link href="/products">
            <Button size="lg">Continuer mes achats</Button>
          </Link>
        </div>
      </div>
    );
  }

  const subtotal = getTotal();
  const shipping = 500; // This will be calculated based on wilaya
  const total = subtotal + shipping;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Panier ({items.length})</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2">
          <div className="space-y-4">
            {items.map((item) => (
              <div
                key={`${item.productId}-${item.size}-${item.color}`}
                className="bg-white rounded-lg p-4 shadow-sm border border-gray-200"
              >
                <div className="flex gap-4">
                  {/* Product Image */}
                  <div className="w-24 h-24 bg-gray-100 rounded-lg flex-shrink-0">
                    <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 rounded-lg" />
                  </div>

                  {/* Product Info */}
                  <div className="flex-1">
                    <h3 className="font-semibold mb-1">{item.name}</h3>
                    <p className="text-sm text-gray-600 mb-2">
                      Taille: {item.size} | Couleur: {item.color}
                    </p>
                    <p className="font-semibold">{formatPrice(item.price)}</p>
                  </div>

                  {/* Quantity & Remove */}
                  <div className="flex flex-col items-end justify-between">
                    <button
                      onClick={() => removeItem(item.productId, item.size, item.color)}
                      className="text-red-600 hover:text-red-700 p-2"
                    >
                      <Trash2 size={20} />
                    </button>

                    <div className="flex items-center border rounded-lg">
                      <button
                        onClick={() =>
                          updateQuantity(
                            item.productId,
                            item.size,
                            item.color,
                            Math.max(1, item.quantity - 1)
                          )
                        }
                        className="px-3 py-1 hover:bg-gray-100"
                      >
                        -
                      </button>
                      <span className="px-4 py-1 border-x">{item.quantity}</span>
                      <button
                        onClick={() =>
                          updateQuantity(
                            item.productId,
                            item.size,
                            item.color,
                            item.quantity + 1
                          )
                        }
                        className="px-3 py-1 hover:bg-gray-100"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <Link href="/products" className="inline-block mt-6">
            <Button variant="outline">Continuer mes achats</Button>
          </Link>
        </div>

        {/* Order Summary */}
        <div>
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 sticky top-4">
            <h2 className="text-xl font-bold mb-4">Récapitulatif</h2>

            <div className="space-y-3 mb-4">
              <div className="flex justify-between text-gray-600">
                <span>Sous-total</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Livraison</span>
                <span>{formatPrice(shipping)}</span>
              </div>
              <div className="border-t pt-3 flex justify-between font-bold text-lg">
                <span>Total</span>
                <span>{formatPrice(total)}</span>
              </div>
            </div>

            <Link href="/checkout">
              <Button size="lg" className="w-full">
                Passer la commande
              </Button>
            </Link>

            <div className="mt-4 text-sm text-gray-600 text-center">
              Paiement sécurisé à la livraison
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
