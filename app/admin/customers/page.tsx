'use client';

import { useState, useEffect } from 'react';
import Card from '@/components/ui/Card';
import { Users, Mail, Phone, MapPin } from 'lucide-react';

interface Customer {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  orderCount: number;
  totalSpent: number;
  createdAt: string;
}

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Fetch customers from API when implemented
    setLoading(false);
  }, []);

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Clients</h1>
          <p className="text-gray-600 mt-2">Gérez vos clients et consultez leur historique</p>
        </div>
      </div>

      <Card className="p-6">
        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Chargement des clients...</p>
          </div>
        ) : customers.length === 0 ? (
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
                  <th className="pb-3">Commandes</th>
                  <th className="pb-3">Total dépensé</th>
                  <th className="pb-3">Membre depuis</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {customers.map((customer) => (
                  <tr key={customer._id} className="border-b hover:bg-gray-50">
                    <td className="py-4">
                      <div className="font-medium">{customer.name}</div>
                      {customer.address && (
                        <div className="text-gray-500 text-xs flex items-center gap-1 mt-1">
                          <MapPin size={12} />
                          {customer.address}
                        </div>
                      )}
                    </td>
                    <td className="py-4">
                      <div className="flex items-center gap-1 text-gray-600">
                        <Mail size={14} />
                        {customer.email}
                      </div>
                      {customer.phone && (
                        <div className="flex items-center gap-1 text-gray-600 mt-1">
                          <Phone size={14} />
                          {customer.phone}
                        </div>
                      )}
                    </td>
                    <td className="py-4">{customer.orderCount} commande(s)</td>
                    <td className="py-4 font-semibold">{customer.totalSpent} DA</td>
                    <td className="py-4 text-gray-500">
                      {new Date(customer.createdAt).toLocaleDateString('fr-FR')}
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
