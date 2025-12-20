'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/store/cart';
import { formatPrice, calculateShippingCost } from '@/lib/utils';
import { WILAYAS } from '@/types';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import toast from 'react-hot-toast';
import { useLanguage } from '@/contexts/LanguageContext';

export default function CheckoutPage() {
  const { t } = useLanguage();
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
        toast.error(t('checkout.errors.requiredFields'));
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

      // Clear cart
      clearCart();

      toast.success(t('checkout.success'));
      router.push('/order-confirmation');
    } catch (error) {
      toast.error(t('checkout.errors.error'));
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
              <h2 className="text-xl font-semibold mb-4">{t('checkout.shippingInfo.title')}</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label={`${t('checkout.shippingInfo.fullName')} ${t('checkout.shippingInfo.required')}`}
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  required
                />

                <Input
                  label={t('checkout.shippingInfo.email')}
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder={t('checkout.shippingInfo.emailPlaceholder')}
                />

                <Input
                  label={`${t('checkout.shippingInfo.phone')} ${t('checkout.shippingInfo.required')}`}
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder={t('checkout.shippingInfo.phonePlaceholder')}
                  required
                />

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('checkout.shippingInfo.wilaya')} {t('checkout.shippingInfo.required')}
                  </label>
                  <select
                    name="wilaya"
                    value={formData.wilaya}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                  >
                    <option value="">{t('checkout.shippingInfo.selectWilaya')}</option>
                    {WILAYAS.map((wilaya) => (
                      <option key={wilaya} value={wilaya}>
                        {wilaya}
                      </option>
                    ))}
                  </select>
                </div>

                <Input
                  label={t('checkout.shippingInfo.city')}
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                />

                <Input
                  label={t('checkout.shippingInfo.postalCode')}
                  name="postalCode"
                  value={formData.postalCode}
                  onChange={handleInputChange}
                />

                <div className="md:col-span-2">
                  <Input
                    label={`${t('checkout.shippingInfo.address')} ${t('checkout.shippingInfo.required')}`}
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder={t('checkout.shippingInfo.addressPlaceholder')}
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('checkout.shippingInfo.notes')}
                  </label>
                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                    placeholder={t('checkout.shippingInfo.notesPlaceholder')}
                  />
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <h2 className="text-xl font-semibold mb-4">{t('checkout.payment.title')}</h2>
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
