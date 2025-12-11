'use client';

import { useState } from 'react';
import Card from '@/components/ui/Card';
import { Search, Eye } from 'lucide-react';
import { formatPrice } from '@/lib/utils';

export default function AdminOrdersPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Mock orders - will be replaced with API call
  const orders = [
    {
      _id: '1',
      orderNumber: 'ORD-001',
      customer: 'Ahmed Benali',
      date: '09/12/2025',
      total: 4500,
      status: 'pending',
      wilaya: 'Alger',
    },
    {
      _id: '2',
      orderNumber: 'ORD-002',
      customer: 'Sarah Amara',
      date: '09/12/2025',
      total: 8200,
      status: 'confirmed',
      wilaya: 'Oran',
    },
    {
      _id: '3',
      orderNumber: 'ORD-003',
      customer: 'Karim Meziane',
      date: '08/12/2025',
      total: 6750,
      status: 'shipped',
      wilaya: 'Constantine',
    },
  ];

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

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Commandes</h1>

      <Card className="p-6">
        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Rechercher une commande..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
          >
            <option value="all">Tous les statuts</option>
            <option value="pending">En attente</option>
            <option value="confirmed">Confirmées</option>
            <option value="preparing">En préparation</option>
            <option value="shipped">Expédiées</option>
            <option value="delivered">Livrées</option>
            <option value="cancelled">Annulées</option>
          </select>
        </div>

        {/* Orders Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b">
              <tr className="text-left text-sm text-gray-600">
                <th className="pb-3">N° Commande</th>
                <th className="pb-3">Client</th>
                <th className="pb-3">Date</th>
                <th className="pb-3">Wilaya</th>
                <th className="pb-3">Montant</th>
                <th className="pb-3">Statut</th>
                <th className="pb-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {orders.map((order) => (
                <tr key={order._id} className="border-b hover:bg-gray-50">
                  <td className="py-4 font-medium">{order.orderNumber}</td>
                  <td className="py-4">{order.customer}</td>
                  <td className="py-4">{order.date}</td>
                  <td className="py-4">{order.wilaya}</td>
                  <td className="py-4 font-semibold">{formatPrice(order.total)}</td>
                  <td className="py-4">
                    <span className={`px-2 py-1 rounded text-xs ${statusColors[order.status]}`}>
                      {statusLabels[order.status]}
                    </span>
                  </td>
                  <td className="py-4 text-right">
                    <button className="p-2 hover:bg-gray-200 rounded">
                      <Eye size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
