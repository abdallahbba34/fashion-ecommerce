'use client';

import { useState, useEffect } from 'react';
import Card from '@/components/ui/Card';
import { formatPrice } from '@/lib/utils';
import { Facebook, Instagram, Globe, MessageCircle, HelpCircle } from 'lucide-react';

interface SourceStat {
  source: string;
  label: string;
  count: number;
  totalRevenue: number;
  averageOrderValue: number;
}

interface SourceStats {
  stats: SourceStat[];
  totals: {
    totalOrders: number;
    totalRevenue: number;
  };
}

const sourceIcons: Record<string, React.ReactNode> = {
  website: <Globe size={24} />,
  facebook: <Facebook size={24} className="text-blue-600" />,
  instagram: <Instagram size={24} className="text-pink-600" />,
  whatsapp: <MessageCircle size={24} className="text-green-600" />,
  other: <HelpCircle size={24} className="text-gray-600" />,
};

export default function SourceStatistics() {
  const [stats, setStats] = useState<SourceStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/stats/by-source');
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error('Error fetching source stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Card className="p-6">
        <h2 className="text-xl font-bold mb-4">Commandes par source</h2>
        <p className="text-gray-500">Chargement...</p>
      </Card>
    );
  }

  if (!stats || stats.stats.length === 0) {
    return (
      <Card className="p-6">
        <h2 className="text-xl font-bold mb-4">Commandes par source</h2>
        <p className="text-gray-500">Aucune donnée disponible</p>
      </Card>
    );
  }

  const getPercentage = (count: number) => {
    if (stats.totals.totalOrders === 0) return 0;
    return Math.round((count / stats.totals.totalOrders) * 100);
  };

  return (
    <Card className="p-6">
      <h2 className="text-xl font-bold mb-6">Commandes par source</h2>

      <div className="space-y-4">
        {stats.stats.map((stat) => {
          const percentage = getPercentage(stat.count);

          return (
            <div key={stat.source} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {sourceIcons[stat.source] || sourceIcons.other}
                  <div>
                    <p className="font-semibold">{stat.label}</p>
                    <p className="text-sm text-gray-600">
                      {stat.count} commande{stat.count > 1 ? 's' : ''} • {formatPrice(stat.totalRevenue)}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold">{percentage}%</p>
                  <p className="text-xs text-gray-600">
                    Moy: {formatPrice(stat.averageOrderValue)}
                  </p>
                </div>
              </div>

              {/* Barre de progression */}
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full ${
                    stat.source === 'facebook'
                      ? 'bg-blue-600'
                      : stat.source === 'instagram'
                      ? 'bg-pink-600'
                      : stat.source === 'whatsapp'
                      ? 'bg-green-600'
                      : 'bg-gray-600'
                  }`}
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Totaux */}
      <div className="mt-6 pt-6 border-t">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-600">Total des commandes</p>
            <p className="text-2xl font-bold">{stats.totals.totalOrders}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Revenu total</p>
            <p className="text-2xl font-bold">{formatPrice(stats.totals.totalRevenue)}</p>
          </div>
        </div>
      </div>
    </Card>
  );
}
