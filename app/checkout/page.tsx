'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCart } from '@/store/cart';
import { formatPrice, calculateShippingCost } from '@/lib/utils';
import { WILAYAS, OrderSource } from '@/types';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import toast from 'react-hot-toast';
import { useLanguage } from '@/contexts/LanguageContext';
import { useYalidineStopDesks } from '@/hooks/useYalidineStopDesks';
import { getWilayaId } from '@/lib/yalidine-wilayas';
import { User, Phone, MapPin, Building2, Package, CreditCard, ShoppingCart, Facebook, Instagram, MessageCircle, HelpCircle } from 'lucide-react';
import { trackInitiateCheckout, trackPurchase } from '@/components/FacebookPixel';

export default function CheckoutPage() {
  const { t } = useLanguage();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { items, getTotal, clearCart } = useCart();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Détecter la source depuis l'URL (ex: ?source=facebook)
  const sourceFromUrl = searchParams.get('source') as OrderSource | null;
  const refFromUrl = searchParams.get('ref') || '';

  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    address: '',
    city: '',
    wilaya: '',
    stopDeskId: undefined as number | undefined,
    source: sourceFromUrl || 'website' as OrderSource,
    referralInfo: refFromUrl,
  });

  // Charger les stop desks Yalidine pour la wilaya sélectionnée
  const wilayaId = formData.wilaya ? getWilayaId(formData.wilaya) : undefined;
  const { stopDesks, loading: loadingStopDesks } = useYalidineStopDesks(wilayaId || undefined);

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
      if (!formData.fullName || !formData.phone || !formData.wilaya) {
        toast.error(t('checkout.errors.requiredFields'));
        setIsSubmitting(false);
        return;
      }

      // Stop desktop est requis
      if (!formData.stopDeskId) {
        toast.error('Veuillez sélectionner un Stop Desktop Yalidine');
        setIsSubmitting(false);
        return;
      }

      // Verify stock availability before creating order
      const stockErrors: string[] = [];

      // Load all products to check stock
      const response = await fetch('/api/products?limit=100');
      const data = await response.json();
      const products = data.products;

      for (const item of items) {
        const product = products.find((p: any) => p._id === item.productId);
        if (!product) {
          stockErrors.push(`${item.name}: ${t('checkout.errors.productNotFound')}`);
          continue;
        }

        const variant = product.variants?.find(
          (v: any) => v.size === item.size && v.color === item.color
        );

        if (!variant) {
          stockErrors.push(`${item.name} (${item.size}, ${item.color}): ${t('checkout.errors.variantNotFound')}`);
          continue;
        }

        if (variant.stock < item.quantity) {
          stockErrors.push(
            `${item.name} (${item.size}, ${item.color}): ${t('checkout.errors.insufficientStock')} (${t('checkout.errors.available')}: ${variant.stock})`
          );
        }
      }

      if (stockErrors.length > 0) {
        toast.error(
          <div>
            <strong>{t('checkout.errors.stockIssues')}</strong>
            <ul className="mt-2 text-sm">
              {stockErrors.map((error, index) => (
                <li key={index}>• {error}</li>
              ))}
            </ul>
          </div>,
          { duration: 6000 }
        );
        setIsSubmitting(false);
        return;
      }

      // Create order
      // Si stop desktop sélectionné, utiliser son adresse
      const stopDesk = formData.stopDeskId
        ? stopDesks.find(desk => desk.id === formData.stopDeskId)
        : null;

      const orderData = {
        items,
        shippingAddress: {
          fullName: formData.fullName,
          phone: formData.phone,
          address: stopDesk ? stopDesk.address : formData.address,
          city: stopDesk ? (stopDesk.commune_name || 'Stop Desktop Yalidine') : (formData.city || ''),
          wilaya: formData.wilaya,
          postalCode: '',
        },
        guestEmail: '',
        subtotal,
        shippingCost,
        total,
        paymentMethod: 'cash_on_delivery',
        notes: '',
        stopDeskId: formData.stopDeskId,
        source: formData.source,
        referralInfo: formData.referralInfo,
      };

      // Call API to create order
      const orderResponse = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });

      if (!orderResponse.ok) {
        const errorData = await orderResponse.json();
        throw new Error(errorData.error || 'Failed to create order');
      }

      const order = await orderResponse.json();

      // Track Purchase event for Facebook Pixel
      trackPurchase(total, 'DZD', order.orderNumber || order._id);

      // Clear cart
      clearCart();

      toast.success(t('checkout.success'));
      router.push('/order-confirmation');
    } catch (error: any) {
      console.error('Erreur checkout:', error);
      const errorMessage = error.message || t('checkout.errors.error');
      toast.error(errorMessage);
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (items.length === 0) {
      router.push('/cart');
    } else {
      // Track InitiateCheckout event for Facebook Pixel
      trackInitiateCheckout(total);
    }
  }, [items.length, router]);

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <p className="text-gray-600">{t('checkout.redirecting')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">{t('checkout.title')}</h1>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 mb-6">
              <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                <Package className="text-gray-600" size={24} />
                {t('checkout.shippingInfo.title')}
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <User size={16} className="text-gray-500" />
                    Nom et Prénom *
                  </label>
                  <Input
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    placeholder="Ex: Mohammed Benali"
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <Phone size={16} className="text-gray-500" />
                    Téléphone *
                  </label>
                  <Input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="Ex: 0555 12 34 56"
                    required
                  />
                </div>


                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <MapPin size={16} className="text-gray-500" />
                    Wilaya *
                  </label>
                  <select
                    name="wilaya"
                    value={formData.wilaya}
                    onChange={(e) => {
                      setFormData(prev => ({
                        ...prev,
                        wilaya: e.target.value,
                        stopDeskId: undefined, // Réinitialiser le stop desk
                        address: '', // Réinitialiser l'adresse
                      }));
                    }}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                  >
                    <option value="">Sélectionnez votre wilaya</option>
                    {WILAYAS.map((wilaya) => (
                      <option key={wilaya} value={wilaya}>
                        {wilaya}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Stop Desktop Yalidine - TOUJOURS VISIBLE */}
                <div className="md:col-span-2">
                  <label htmlFor="stopDesk" className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <Building2 size={16} className="text-gray-500" />
                    Stop Desktop le plus proche *
                  </label>
                  <select
                    id="stopDesk"
                    name="stopDesk"
                    value={formData.stopDeskId || ''}
                    onChange={(e) => {
                      const value = e.target.value;
                      const deskId = value ? parseInt(value) : undefined;
                      const selectedDesk = deskId ? stopDesks.find(d => d.id === deskId) : null;

                      setFormData(prev => ({
                        ...prev,
                        stopDeskId: deskId,
                        address: selectedDesk ? selectedDesk.address : '',
                        city: selectedDesk ? (selectedDesk.commune_name || '') : '',
                      }));
                    }}
                    required
                    disabled={!formData.wilaya || loadingStopDesks}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                  >
                    <option value="">
                      {!formData.wilaya
                        ? 'Sélectionnez d\'abord une wilaya'
                        : loadingStopDesks
                          ? 'Chargement des Stop Desks...'
                          : stopDesks.length > 0
                            ? 'Choisir parmi les desktop de wilaya le plus proche'
                            : 'Aucun Stop Desktop disponible pour cette wilaya'}
                    </option>
                    {stopDesks.map(desk => (
                      <option key={desk.id} value={desk.id}>
                        {desk.name} - {desk.address}
                      </option>
                    ))}
                  </select>
                  <p className="text-xs text-gray-500 mt-1">
                    {!formData.wilaya
                      ? 'Veuillez sélectionner une wilaya pour voir les Stop Desks disponibles.'
                      : stopDesks.length > 0
                        ? 'Sélectionnez un Stop Desktop Yalidine pour récupérer votre commande.'
                        : 'Aucun Stop Desktop disponible pour cette wilaya. Veuillez sélectionner une autre wilaya.'}
                  </p>
                </div>

                {/* Comment nous avez-vous connu? */}
                <div className="md:col-span-2">
                  <label htmlFor="source" className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <HelpCircle size={16} className="text-gray-500" />
                    Comment nous avez-vous connu? *
                  </label>
                  <div className="relative">
                    <select
                      id="source"
                      name="source"
                      value={formData.source}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent appearance-none"
                    >
                      <option value="website">🌐 Site web</option>
                      <option value="facebook">📘 Facebook</option>
                      <option value="instagram">📸 Instagram</option>
                      <option value="whatsapp">💬 WhatsApp</option>
                      <option value="other">❓ Autre</option>
                    </select>
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      {formData.source === 'facebook' && <Facebook size={16} className="text-blue-600" />}
                      {formData.source === 'instagram' && <Instagram size={16} className="text-pink-600" />}
                      {formData.source === 'whatsapp' && <MessageCircle size={16} className="text-green-600" />}
                      {formData.source === 'website' && <ShoppingCart size={16} className="text-gray-600" />}
                      {formData.source === 'other' && <HelpCircle size={16} className="text-gray-600" />}
                    </div>
                  </div>
                </div>

                {/* Informations supplémentaires (optionnel) */}
                {formData.source !== 'website' && (
                  <div className="md:col-span-2">
                    <label htmlFor="referralInfo" className="block text-sm font-medium text-gray-700 mb-1">
                      Plus de détails (optionnel)
                    </label>
                    <input
                      id="referralInfo"
                      name="referralInfo"
                      type="text"
                      value={formData.referralInfo}
                      onChange={handleInputChange}
                      placeholder="Ex: Nom de la page, ami qui vous a recommandé..."
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <CreditCard className="text-gray-600" size={24} />
                {t('checkout.payment.title')}
              </h2>
              <div className="border rounded-lg p-4 bg-gray-50">
                <div className="flex items-start gap-3">
                  <input
                    type="radio"
                    checked
                    readOnly
                    className="mt-1"
                  />
                  <div>
                    <h3 className="font-medium">{t('checkout.payment.cashOnDelivery')}</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      {t('checkout.payment.cashDescription')}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div>
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 sticky top-4">
              <h2 className="text-xl font-bold mb-4">{t('checkout.summary.title')}</h2>

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
                  <span>{t('checkout.summary.subtotal')}</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>{t('checkout.summary.shipping')}</span>
                  <span>{formatPrice(shippingCost)}</span>
                </div>
                <div className="border-t pt-3 flex justify-between font-bold text-lg">
                  <span>{t('checkout.summary.total')}</span>
                  <span>{formatPrice(total)}</span>
                </div>
              </div>

              <Button
                type="submit"
                size="lg"
                className="w-full mt-6"
                disabled={isSubmitting}
              >
                {isSubmitting ? t('checkout.submit.processing') : t('checkout.submit.confirm')}
              </Button>

              <p className="mt-4 text-xs text-gray-600 text-center">
                {t('checkout.submit.terms')}{' '}
                <a href="/terms" className="underline">{t('checkout.submit.termsLink')}</a>
              </p>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
