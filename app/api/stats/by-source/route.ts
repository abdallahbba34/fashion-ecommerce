import { NextRequest, NextResponse } from 'next/server';
import { verifyAdmin } from '@/lib/auth';
import { connectDB } from '@/lib/db';
import OrderModel from '@/models/Order';

export async function GET(request: NextRequest) {
  try {
    // Verify admin authentication
    const user = verifyAdmin(request);
    if (!user) {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 401 }
      );
    }

    await connectDB();

    // Obtenir les statistiques par source
    const statsBySource = await OrderModel.aggregate([
      {
        $group: {
          _id: '$source',
          count: { $sum: 1 },
          totalRevenue: { $sum: '$total' },
          averageOrderValue: { $avg: '$total' },
        },
      },
      {
        $sort: { count: -1 },
      },
    ]);

    // Transformer les résultats pour avoir des noms lisibles
    const sourceLabels: Record<string, string> = {
      website: 'Site Web',
      facebook: 'Facebook',
      instagram: 'Instagram',
      whatsapp: 'WhatsApp',
      other: 'Autre',
    };

    const formattedStats = statsBySource.map((stat) => ({
      source: stat._id || 'website',
      label: sourceLabels[stat._id || 'website'] || stat._id,
      count: stat.count,
      totalRevenue: Math.round(stat.totalRevenue),
      averageOrderValue: Math.round(stat.averageOrderValue),
    }));

    // Calculer les totaux
    const totals = {
      totalOrders: formattedStats.reduce((sum, s) => sum + s.count, 0),
      totalRevenue: formattedStats.reduce((sum, s) => sum + s.totalRevenue, 0),
    };

    return NextResponse.json({
      stats: formattedStats,
      totals,
    });
  } catch (error) {
    console.error('Error fetching stats by source:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}
