'use client';

import { useState, useEffect } from 'react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { Users, Phone, MapPin, Package, CheckCircle, Clock, Download, Search, Send } from 'lucide-react';
import toast from 'react-hot-toast';

interface Customer {
  name: string;
  phone: string;
  wilaya: string;
  wilayaCode: number;
  orderCount: number;
  totalSpent: number;
  lastOrderDate: string;
  status: 'pending' | 'delivered';
  pendingOrderId?: string; // ID of pending order for Yalidine
}

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'delivered'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const response = await fetch('/api/admin/customers');
      if (!response.ok) {
        throw new Error('Failed to fetch customers');
      }
      const data = await response.json();
      setCustomers(data.customers || []);
    } catch (error) {
      console.error('Error fetching customers:', error);
    } finally {
      setLoading(false);
    }
  };

  // Export to CSV function
  const exportToCSV = () => {
    const headers = ['Nom', 'Téléphone', 'Wilaya', 'Code Wilaya', 'Commandes', 'Total Dépensé', 'Statut', 'Dernière Commande'];
    const csvData = filteredCustomers.map(customer => [
      customer.name,
      customer.phone,
      customer.wilaya,
      customer.wilayaCode,
      customer.orderCount,
      customer.totalSpent,
      customer.status === 'delivered' ? 'Livré' : 'En attente',
      new Date(customer.lastOrderDate).toLocaleDateString('fr-FR')
    ]);

    const csvContent = [
      headers.join(','),
      ...csvData.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `clients_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success('Export CSV réussi!');
  };

  // Send to Yalidine function
  const sendToYalidine = async (customer: Customer) => {
    if (!customer.pendingOrderId) {
      toast.error('Aucune commande en attente pour ce client');
      return;
    }

    const loadingToast = toast.loading(`Envoi de la commande de ${customer.name} à Yalidine...`);

    try {
      const response = await fetch('/api/yalidine/create-parcel', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ orderId: customer.pendingOrderId }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erreur lors de l\'envoi à Yalidine');
      }

      toast.success(`Commande envoyée à Yalidine! Tracking: ${data.trackingNumber}`, {
        id: loadingToast,
        duration: 5000,
      });

      // Refresh customers list
      fetchCustomers();
    } catch (error: any) {
      toast.error(error.message || 'Erreur lors de l\'envoi à Yalidine', {
        id: loadingToast,
      });
    }
  };

  // Filter customers by search query and status
  const filteredCustomers = customers
    .filter((customer) => {
      if (filter !== 'all' && customer.status !== filter) return false;
      if (searchQuery.trim() === '') return true;

      const query = searchQuery.toLowerCase();
      return (
        customer.name.toLowerCase().includes(query) ||
        customer.phone.includes(query) ||
        customer.wilaya.toLowerCase().includes(query)
      );
    });

  const pendingCount = customers.filter(c => c.status === 'pending').length;
  const deliveredCount = customers.filter(c => c.status === 'delivered').length;

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Clients</h1>
          <p className="text-gray-600 mt-2">Gérez vos clients et consultez leur historique</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Clients</p>
              <p className="text-2xl font-bold">{customers.length}</p>
            </div>
            <Users className="text-blue-500" size={32} />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">En attente de livraison</p>
              <p className="text-2xl font-bold">{pendingCount}</p>
            </div>
            <Clock className="text-orange-500" size={32} />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Livrés</p>
              <p className="text-2xl font-bold">{deliveredCount}</p>
            </div>
            <CheckCircle className="text-green-500" size={32} />
          </div>
        </Card>
      </div>

      {/* Search and Export */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Rechercher par nom, téléphone ou wilaya..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
          />
        </div>
        <Button
          onClick={exportToCSV}
          variant="outline"
          disabled={filteredCustomers.length === 0}
          className="flex items-center gap-2"
        >
          <Download size={18} />
          Exporter CSV ({filteredCustomers.length})
        </Button>
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-lg ${
            filter === 'all'
              ? 'bg-black text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Tous ({customers.length})
        </button>
        <button
          onClick={() => setFilter('pending')}
          className={`px-4 py-2 rounded-lg ${
            filter === 'pending'
              ? 'bg-orange-500 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          En attente ({pendingCount})
        </button>
        <button
          onClick={() => setFilter('delivered')}
          className={`px-4 py-2 rounded-lg ${
            filter === 'delivered'
              ? 'bg-green-500 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Livrés ({deliveredCount})
        </button>
      </div>

      <Card className="p-6">
        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Chargement des clients...</p>
          </div>
        ) : filteredCustomers.length === 0 ? (
          <div className="text-center py-12">
            <Users size={48} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Aucun client pour le moment</h3>
            <p className="text-gray-500">
              Les clients apparaîtront ici après avoir passé leur première commande.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b">
                <tr className="text-left text-sm text-gray-600">
                  <th className="pb-3">Client</th>
                  <th className="pb-3">Contact</th>
                  <th className="pb-3">Wilaya</th>
                  <th className="pb-3">Code Wilaya</th>
                  <th className="pb-3">Commandes</th>
                  <th className="pb-3">Total dépensé</th>
                  <th className="pb-3">Statut</th>
                  <th className="pb-3">Dernière commande</th>
                  <th className="pb-3">Actions</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {filteredCustomers.map((customer, index) => (
                  <tr key={`${customer.phone}-${index}`} className="border-b hover:bg-gray-50">
                    <td className="py-4">
                      <div className="font-medium">{customer.name}</div>
                    </td>
                    <td className="py-4">
                      <div className="flex items-center gap-1 text-gray-600">
                        <Phone size={14} />
                        {customer.phone}
                      </div>
                    </td>
                    <td className="py-4">
                      <div className="flex items-center gap-1 text-gray-600">
                        <MapPin size={14} />
                        {customer.wilaya}
                      </div>
                    </td>
                    <td className="py-4">
                      <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-medium">
                        {customer.wilayaCode}
                      </span>
                    </td>
                    <td className="py-4">
                      <div className="flex items-center gap-1">
                        <Package size={14} />
                        {customer.orderCount}
                      </div>
                    </td>
                    <td className="py-4 font-semibold">{customer.totalSpent.toLocaleString()} DA</td>
                    <td className="py-4">
                      {customer.status === 'delivered' ? (
                        <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-medium">
                          Livré
                        </span>
                      ) : (
                        <span className="px-2 py-1 bg-orange-100 text-orange-700 rounded text-xs font-medium">
                          En attente
                        </span>
                      )}
                    </td>
                    <td className="py-4 text-gray-500">
                      {new Date(customer.lastOrderDate).toLocaleDateString('fr-FR')}
                    </td>
                    <td className="py-4">
                      {customer.status === 'pending' && customer.pendingOrderId ? (
                        <button
                          onClick={() => sendToYalidine(customer)}
                          className="flex items-center gap-1 px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors text-xs"
                        >
                          <Send size={14} />
                          Yalidine
                        </button>
                      ) : customer.status === 'pending' ? (
                        <span className="text-xs text-gray-400">Déjà envoyé</span>
                      ) : (
                        <span className="text-xs text-green-600">Livré</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
