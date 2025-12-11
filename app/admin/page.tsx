import { Package, ShoppingCart, Users, TrendingUp } from 'lucide-react';
import Card from '@/components/ui/Card';

export default function AdminDashboard() {
  const stats = [
    {
      icon: ShoppingCart,
      label: 'Commandes',
      value: '156',
      change: '+12%',
      positive: true,
    },
    {
      icon: Package,
      label: 'Produits',
      value: '89',
      change: '+5',
      positive: true,
    },
    {
      icon: Users,
      label: 'Clients',
      value: '1,234',
      change: '+23%',
      positive: true,
    },
    {
      icon: TrendingUp,
      label: 'Revenus',
      value: '145,000 DA',
      change: '+18%',
      positive: true,
    },
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => (
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

      {/* Recent Orders */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Commandes récentes</h2>
        <div className="overflow-x-auto">
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
              <tr className="border-b">
                <td className="py-3 font-medium">#ORD-001</td>
                <td className="py-3">Ahmed Benali</td>
                <td className="py-3">09/12/2025</td>
                <td className="py-3">4,500 DA</td>
                <td className="py-3">
                  <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded text-xs">
                    En attente
                  </span>
                </td>
              </tr>
              <tr className="border-b">
                <td className="py-3 font-medium">#ORD-002</td>
                <td className="py-3">Sarah Amara</td>
                <td className="py-3">09/12/2025</td>
                <td className="py-3">8,200 DA</td>
                <td className="py-3">
                  <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs">
                    Confirmée
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
