'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { ArrowLeft, Package, User, MapPin, CreditCard, Truck } from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import toast from 'react-hot-toast';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface Order {
  _id: string;
  orderNumber: string;
  customerInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };
  shippingAddress: {
    address: string;
    wilaya: string;
    commune: string;
    postalCode: string;
  };
  items: Array<{
    productId: string;
    name: string;
    price: number;
    quantity: number;
    size: string;
    color: string;
  }>;
  subtotal: number;
  shippingCost: number;
  total: number;
  paymentMethod: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

const statusOptions = [
  { value: 'pending', label: 'En attente', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'confirmed', label: 'Confirmée', color: 'bg-blue-100 text-blue-800' },
  { value: 'preparing', label: 'En préparation', color: 'bg-purple-100 text-purple-800' },
  { value: 'shipped', label: 'Expédiée', color: 'bg-indigo-100 text-indigo-800' },
  { value: 'delivered', label: 'Livrée', color: 'bg-green-100 text-green-800' },
  { value: 'cancelled', label: 'Annulée', color: 'bg-red-100 text-red-800' },
  { value: 'returned', label: 'Retournée', color: 'bg-gray-100 text-gray-800' },
];

export default function OrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const orderId = params.id as string;

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchOrder();
  }, [orderId]);

  const fetchOrder = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/orders/${orderId}`);

      if (!response.ok) {
        throw new Error('Commande non trouvée');
      }

      const data = await response.json();
      setOrder(data);
    } catch (error) {
      console.error('Error fetching order:', error);
      toast.error('Erreur lors du chargement de la commande');
      router.push('/admin/orders');
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (newStatus: string) => {
    if (!order) return;

    setUpdating(true);
    try {
      const response = await fetch(`/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la mise à jour');
      }

      const updatedOrder = await response.json();
      setOrder(updatedOrder);
      toast.success('Statut mis à jour avec succès !');
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Erreur lors de la mise à jour du statut');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-500">Chargement de la commande...</p>
      </div>
    );
  }

  if (!order) {
    return null;
  }

  const currentStatus = statusOptions.find(s => s.value === order.status);

  return (
    <div>
      <div className="mb-8">
        <Link
          href="/admin/orders"
          className="inline-flex items-center text-gray-600 hover:text-black mb-4"
        >
          <ArrowLeft size={20} className="mr-2" />
          Retour aux commandes
        </Link>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Commande {order.orderNumber}</h1>
            <p className="text-gray-600 mt-1">
              Créée le {format(new Date(order.createdAt), 'dd MMMM yyyy à HH:mm', { locale: fr })}
            </p>
          </div>
          <div>
            <span className={`px-4 py-2 rounded-lg text-sm font-medium ${currentStatus?.color}`}>
              {currentStatus?.label}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Products */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <Package className="mr-2" size={20} />
              Produits commandés
            </h2>

            <div className="space-y-4">
              {order.items.map((item, index) => (
                <div key={index} className="flex items-center justify-between py-3 border-b last:border-b-0">
                  <div className="flex-1">
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-gray-600">
                      Taille: {item.size} • Couleur: {item.color}
                    </p>
                    <p className="text-sm text-gray-600">Quantité: {item.quantity}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">{formatPrice(item.price * item.quantity)}</p>
                    <p className="text-sm text-gray-600">{formatPrice(item.price)} × {item.quantity}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-4 border-t space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Sous-total</span>
                <span>{formatPrice(order.subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Frais de livraison</span>
                <span>{formatPrice(order.shippingCost)}</span>
              </div>
              <div className="flex justify-between text-lg font-bold pt-2 border-t">
                <span>Total</span>
                <span>{formatPrice(order.total)}</span>
              </div>
            </div>
          </Card>

          {/* Timeline */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <Truck className="mr-2" size={20} />
              Suivi de commande
            </h2>

            <div className="space-y-4">
              {statusOptions.map((status, index) => {
                const statusIndex = statusOptions.findIndex(s => s.value === order.status);
                const isCompleted = index <= statusIndex;
                const isCurrent = status.value === order.status;

                return (
                  <div key={status.value} className="flex items-center">
                    <div className={`
                      w-8 h-8 rounded-full flex items-center justify-center font-semibold
                      ${isCompleted ? 'bg-black text-white' : 'bg-gray-200 text-gray-500'}
                    `}>
                      {index + 1}
                    </div>
                    <div className="ml-4 flex-1">
                      <p className={`font-medium ${isCurrent ? 'text-black' : 'text-gray-600'}`}>
                        {status.label}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Change Status */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Changer le statut</h2>

            <div className="space-y-2">
              {statusOptions.map((status) => (
                <button
                  key={status.value}
                  onClick={() => updateStatus(status.value)}
                  disabled={updating || status.value === order.status}
                  className={`
                    w-full px-4 py-2 rounded-lg text-sm font-medium text-left transition-colors
                    ${status.value === order.status
                      ? 'bg-black text-white cursor-default'
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                    }
                    ${updating ? 'opacity-50 cursor-not-allowed' : ''}
                  `}
                >
                  {status.label}
                  {status.value === order.status && ' (Actuel)'}
                </button>
              ))}
            </div>
          </Card>

          {/* Customer Info */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <User className="mr-2" size={20} />
              Client
            </h2>

            <div className="space-y-3 text-sm">
              <div>
                <p className="text-gray-600">Nom complet</p>
                <p className="font-medium">
                  {order.customerInfo.firstName} {order.customerInfo.lastName}
                </p>
              </div>
              <div>
                <p className="text-gray-600">Email</p>
                <p className="font-medium">{order.customerInfo.email}</p>
              </div>
              <div>
                <p className="text-gray-600">Téléphone</p>
                <p className="font-medium">{order.customerInfo.phone}</p>
              </div>
            </div>
          </Card>

          {/* Shipping Address */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <MapPin className="mr-2" size={20} />
              Adresse de livraison
            </h2>

            <div className="space-y-1 text-sm">
              <p>{order.shippingAddress.address}</p>
              <p>{order.shippingAddress.commune}</p>
              <p>{order.shippingAddress.wilaya} {order.shippingAddress.postalCode}</p>
            </div>
          </Card>

          {/* Payment Method */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <CreditCard className="mr-2" size={20} />
              Paiement
            </h2>

            <p className="text-sm">
              {order.paymentMethod === 'cod' ? 'Paiement à la livraison' : order.paymentMethod}
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}
