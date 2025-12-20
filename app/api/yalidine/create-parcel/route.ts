import { NextRequest, NextResponse } from 'next/server';
import { verifyAdmin } from '@/lib/auth';
import { connectDB } from '@/lib/db';
import OrderModel from '@/models/Order';
import { getWilayaId } from '@/lib/yalidine-wilayas';

export async function POST(request: NextRequest) {
  try {
    // Verify admin authentication
    const user = verifyAdmin(request);
    if (!user) {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 401 }
      );
    }

    const { orderId } = await request.json();

    if (!orderId) {
      return NextResponse.json(
        { error: 'ID de commande requis' },
        { status: 400 }
      );
    }

    // Connect to database
    await connectDB();

    // Get order details
    const order = await OrderModel.findById(orderId);

    if (!order) {
      return NextResponse.json(
        { error: 'Commande non trouvée' },
        { status: 404 }
      );
    }

    // Check if already sent to Yalidine
    if (order.trackingNumber) {
      return NextResponse.json(
        { error: 'Cette commande a déjà été remise au livreur Yalidine', trackingNumber: order.trackingNumber },
        { status: 400 }
      );
    }

    // Prepare Yalidine API request
    const yalidineApiId = process.env.YALIDINE_API_ID;
    const yalidineApiToken = process.env.YALIDINE_API_TOKEN;

    if (!yalidineApiId || !yalidineApiToken) {
      return NextResponse.json(
        { error: 'Configuration Yalidine manquante. Veuillez configurer YALIDINE_API_ID et YALIDINE_API_TOKEN.' },
        { status: 500 }
      );
    }

    // Split fullName into first and last name
    const nameParts = order.shippingAddress.fullName.trim().split(' ');
    const firstname = nameParts[0];
    const lastname = nameParts.slice(1).join(' ') || firstname;

    // Prepare product list
    const productList = order.items
      .map((item: any) => `${item.name} (${item.size}, ${item.color}) x${item.quantity}`)
      .join(', ');

    // Get wilaya_id from wilaya name
    const wilayaId = getWilayaId(order.shippingAddress.wilaya);

    if (!wilayaId) {
      return NextResponse.json(
        {
          error: `Wilaya "${order.shippingAddress.wilaya}" non reconnue. Veuillez vérifier le nom de la wilaya.`,
          wilayaReceived: order.shippingAddress.wilaya
        },
        { status: 400 }
      );
    }

    // Prepare Yalidine parcel data
    const parcelData = {
      firstname,
      lastname,
      address: order.shippingAddress.address,
      phone: order.shippingAddress.phone,
      commune_id: 0, // Yalidine permet 0 si commune non spécifiée
      wilaya_id: wilayaId,
      product_list: productList,
      order_id: order.orderNumber,
      is_stop_desk: false,
      // Optional fields
      price: order.total,
      do_insurance: false,
      freeshipping: false,
      has_exchange: false,
    };

    // Call Yalidine API
    const yalidineResponse = await fetch('https://api.yalidine.app/v1/parcels/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-ID': yalidineApiId,
        'X-API-TOKEN': yalidineApiToken,
      },
      body: JSON.stringify(parcelData),
    });

    if (!yalidineResponse.ok) {
      const errorData = await yalidineResponse.json().catch(() => ({}));
      console.error('Yalidine API Error:', errorData);
      return NextResponse.json(
        {
          error: 'Erreur lors de la création du colis Yalidine',
          details: errorData
        },
        { status: yalidineResponse.status }
      );
    }

    const yalidineData = await yalidineResponse.json();

    // Update order with tracking number
    order.trackingNumber = yalidineData.tracking || yalidineData.tracking_number;
    order.status = 'shipped';
    await order.save();

    return NextResponse.json({
      success: true,
      message: 'Colis créé avec succès sur Yalidine',
      trackingNumber: order.trackingNumber,
      yalidineData,
    });

  } catch (error) {
    console.error('Error creating Yalidine parcel:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}
