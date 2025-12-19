import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import SettingsModel from '@/models/Settings';

// GET /api/settings - Get settings (create default if not exists)
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    let settings = await SettingsModel.findOne();

    // Si aucun settings n'existe, créer les settings par défaut
    if (!settings) {
      settings = await SettingsModel.create({
        siteName: 'La Suite Chic',
        contactEmail: 'contact@lasuitechic.online',
        contactPhone: '',
        address: 'Bordj Bou Arreridj',
        city: 'Bordj Bou Arreridj',
        country: 'Algérie',
        description: 'Boutique de mode en ligne en Algérie',

        freeShippingThreshold: 5000,
        shippingCostLow: 400,
        shippingCostMedium: 300,
        shippingCostThresholdLow: 2000,
        shippingCostThresholdHigh: 5000,
        deliveryTime: '48-72h',

        returnEnabled: true,
        returnPeriodHours: 48,
        returnConditions: 'Produit dans son état d\'origine avec étiquettes',

        bannerText: 'Livraison gratuite pour toute commande supérieure à 5000 DA',
        bannerEnabled: true,
        maintenanceMode: false,
        maintenanceMessage: 'Site en maintenance. Nous revenons bientôt!',
        promotionEnabled: false,

        metaTitle: 'La Suite Chic - Boutique Mode Algérie',
        metaDescription: 'Boutique de mode en ligne en Algérie. Livraison rapide dans les 58 wilayas.',

        onlinePaymentEnabled: false,
      });

      console.log('✓ Settings par défaut créés');
    }

    return NextResponse.json(settings);
  } catch (error) {
    console.error('Error fetching settings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch settings' },
      { status: 500 }
    );
  }
}

// PUT /api/settings - Update settings (Admin only)
export async function PUT(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();
    console.log('[Settings] Mise à jour des paramètres:', Object.keys(body));

    // Récupérer les settings existants ou créer
    let settings = await SettingsModel.findOne();

    if (!settings) {
      // Créer avec les nouvelles valeurs
      settings = await SettingsModel.create(body);
      console.log('✓ Settings créés');
    } else {
      // Mettre à jour
      settings = await SettingsModel.findByIdAndUpdate(
        settings._id,
        body,
        { new: true, runValidators: true }
      );
      console.log('✓ Settings mis à jour');
    }

    return NextResponse.json({
      message: 'Settings updated successfully',
      settings
    });
  } catch (error) {
    console.error('Error updating settings:', error);
    return NextResponse.json(
      { error: 'Failed to update settings' },
      { status: 500 }
    );
  }
}
