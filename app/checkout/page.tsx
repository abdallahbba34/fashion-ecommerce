'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/store/cart';
import { formatPrice, calculateShippingCost } from '@/lib/utils';
import { WILAYAS } from '@/types';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import toast from 'react-hot-toast';

export default function CheckoutPage() {
  const router = useRouter();
  const { items, getTotal, clearCart } = useCart();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    wilaya: '',
    postalCode: '',
    notes: '',
  });

  const subtotal = getTotal();
  const shippingCost = formData.wilaya ? calculateShippingCost(formData.wilaya, subtotal) : 500;
  const total = subtotal + shippingCost;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Validate form
      if (!formData.fullName || !formData.phone || !formData.address || !formData.wilaya) {
        toast.error('Veuillez remplir tous les champs obligatoires');
        setIsSubmitting(false);
        return;
      }

      // Create order (API call will be added)
      const orderData = {
        items,
        shippingAddress: {
          fullName: formData.fullName,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          wilaya: formData.wilaya,
          postalCode: formData.postalCode,
        },
        guestEmail: formData.email,
        subtotal,
        shippingCost,
        total,
        paymentMethod: 'cash_on_delivery',
        notes: formData.notes,
      };

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Clear cart
      clearCart();

      toast.success('Commande passée avec succès !');
      router.push('/order-confirmation');
    } catch (error) {
      toast.error('Une erreur est survenue. Veuillez réessayer.');
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (items.length === 0) {
      router.push('/cart');
    }
  }, [items.length, router]);

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <p className="text-gray-600">Redirection...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Finaliser la commande</h1>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 mb-6">
              <h2 className="text-xl font-semibold mb-4">Informations de livraison</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Nom complet *"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  required
                />

                <Input
                  label="Email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="exemple@email.com"
                />

                <Input
                  label="Téléphone *"
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="0555 12 34 56"
                  required
                />

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Wilaya *
                  </label>
                  <select
                    name="wilaya"
                    value={formData.wilaya}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                  >
                    <option value="">Sélectionnez une wilaya</option>
                    {WILAYAS.map((wilaya) => (
                      <option key={wilaya} value={wilaya}>
                        {wilaya}
                      </option>
                    ))}
                  </select>
                </div>

                <Input
                  label="Ville"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                />

                <Input
                  label="Code postal"
                  name="postalCode"
                  value={formData.postalCode}
                  onChange={handleInputChange}
                />

                <div className="md:col-span-2">
                  <Input
                    label="Adresse complète *"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder="Rue, numéro, bâtiment..."
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Notes de commande (optionnel)
                  </label>
                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                    placeholder="Instructions spéciales pour la livraison..."
                  />
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <h2 className="text-xl font-semibold mb-4">Mode de paiement</h2>
              <div className="border rounded-lg p-4 bg-gray-50">
                <div className="flex items-start gap-3">
                  <input
                    type="radio"
                    checked
                    readOnly
                    className="mt-1"
                  />
                  <div>
                    <h3 className="font-medium">Paiement à la livraison</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      Payez en espèces lors de la réception de votre commande
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div>
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 sticky top-4">
              <h2 className="text-xl font-bold mb-4">Récapitulatif</h2>

              {/* Items */}
              <div className="space-y-3 mb-4 max-h-60 overflow-y-auto">
                {items.map((item) => (
                  <div
                    key={`${item.productId}-${item.size}-${item.color}`}
                    className="flex justify-between text-sm"
                  >
                    <div className="flex-1">
                      <p className="font-medium">{item.name}</p>
                      <p className="text-gray-600">
                        {item.size} • {item.color} × {item.quantity}
                      </p>
                    </div>
                    <span className="font-medium">
                      {formatPrice(item.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="border-t pt-4 space-y-3">
                <div className="flex justify-between text-gray-600">
                  <span>Sous-total</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Livraison</span>
                  <span>{formatPrice(shippingCost)}</span>
                </div>
                <div className="border-t pt-3 flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>{formatPrice(total)}</span>
                </div>
              </div>

              <Button
                type="submit"
                size="lg"
                className="w-full mt-6"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Traitement...' : 'Confirmer la commande'}
              </Button>

              <p className="mt-4 text-xs text-gray-600 text-center">
                En confirmant votre commande, vous acceptez nos{' '}
                <a href="/terms" className="underline">conditions générales</a>
              </p>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
