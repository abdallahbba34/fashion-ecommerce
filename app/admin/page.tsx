'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Package, ShoppingCart, Users, TrendingUp } from 'lucide-react';
import Card from '@/components/ui/Card';
import SourceStatistics from '@/components/admin/SourceStatistics';
import { formatPrice } from '@/lib/utils';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import toast from 'react-hot-toast';

interface Stats {
  orders: { total: number; change: number; positive: boolean };
  products: { total: number; change: number; positive: boolean };
  customers: { total: number; change: number; positive: boolean };
  revenue: { total: number; change: number; positive: boolean };
}

interface RecentOrder {
  _id: string;
  orderNumber: string;
  shippingAddress: {
    fullName: string;
  };
  createdAt: string;
  total: number;
  status: string;
}

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  confirmed: 'bg-blue-100 text-blue-800',
  preparing: 'bg-purple-100 text-purple-800',
  shipped: 'bg-indigo-100 text-indigo-800',
  delivered: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
};

const statusLabels: Record<string, string> = {
  pending: 'En attente',
  confirmed: 'Confirmée',
  preparing: 'En préparation',
  shipped: 'Expédiée',
  delivered: 'Livrée',
  cancelled: 'Annulée',
};

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/stats');

      if (!response.ok) {
        throw new Error('Erreur lors du chargement des statistiques');
      }

      const data = await response.json();
      setStats(data.stats);
      setRecentOrders(data.recentOrders || []);
    } catch (error) {
      console.error('Error fetching stats:', error);
      toast.error('Erreur lors du chargement des statistiques');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-gray-500">Chargement des statistiques...</p>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-gray-500">Impossible de charger les statistiques</p>
      </div>
    );
  }

  const statCards = [
    {
      icon: ShoppingCart,
      label: 'Commandes',
      value: stats.orders.total.toString(),
      change: `${stats.orders.change >= 0 ? '+' : ''}${stats.orders.change}%`,
      positive: stats.orders.positive,
    },
    {
      icon: Package,
      label: 'Produits',
      value: stats.products.total.toString(),
      change: `+${stats.products.change}`,
      positive: stats.products.positive,
    },
    {
      icon: Users,
      label: 'Clients',
      value: stats.customers.total.toLocaleString('fr-DZ'),
      change: `${stats.customers.change >= 0 ? '+' : ''}${stats.customers.change}%`,
      positive: stats.customers.positive,
    },
    {
      icon: TrendingUp,
      label: 'Revenus',
      value: formatPrice(stats.revenue.total),
      change: `${stats.revenue.change >= 0 ? '+' : ''}${stats.revenue.change}%`,
      positive: stats.revenue.positive,
    },
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat) => (
          <Card key={stat.label} className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className={`text-sm mt-2 ${stat.positive ? 'text-green-600' : 'text-red-600'}`}>
                  {stat.change} ce mois
                </p>
              </div>
              <div className="p-3 bg-gray-100 rounded-lg">
                <stat.icon size={24} />
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Source Statistics */}
      <div className="mb-8">
        <SourceStatistics />
      </div>

      {/* Recent Orders */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Commandes récentes</h2>
          <Link href="/admin/orders" className="text-sm text-gray-600 hover:text-black">
            Voir tout →
          </Link>
        </div>
        <div className="overflow-x-auto">
          {recentOrders.length === 0 ? (
            <p className="text-gray-500 text-center py-8">Aucune commande récente</p>
          ) : (
            <table className="w-full">
              <thead className="border-b">
                <tr className="text-left text-sm text-gray-600">
                  <th className="pb-3">N° Commande</th>
                  <th className="pb-3">Client</th>
                  <th className="pb-3">Date</th>
                  <th className="pb-3">Montant</th>
                  <th className="pb-3">Statut</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {recentOrders.map((order) => (
                  <tr key={order._id} className="border-b hover:bg-gray-50">
                    <td className="py-3 font-medium">
                      <Link href={`/admin/orders/${order._id}`} className="hover:underline">
                        {order.orderNumber}
                      </Link>
                    </td>
                    <td className="py-3">
                      {order.shippingAddress.fullName}
                    </td>
                    <td className="py-3">
                      {format(new Date(order.createdAt), 'dd/MM/yyyy', { locale: fr })}
                    </td>
                    <td className="py-3">{formatPrice(order.total)}</td>
                    <td className="py-3">
                      <span className={`px-2 py-1 rounded text-xs ${statusColors[order.status] || 'bg-gray-100 text-gray-800'}`}>
                        {statusLabels[order.status] || order.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </Card>
    </div>
  );
}
