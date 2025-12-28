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

    const body = await request.json();
    const { orderId } = body;

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

    // Check if form data is provided (from modal), otherwise use order data (fallback)
    let parcelData: any;

    if (body.firstname && body.familyname) {
      // Using form data from YalidineParcelForm modal
      parcelData = {
        firstname: body.firstname,
        familyname: body.familyname,
        contact_phone: body.contact_phone,
        address: body.address,
        product_list: body.product_list,
        order_id: body.order_id,
        price: body.price,
        freeshipping: body.freeshipping || false,
        is_stopdesk: body.is_stopdesk || false,
        has_exchange: body.has_exchange || false,
        do_insurance: body.do_insurance || false,
      };

      // Add wilaya_id (required)
      if (body.wilaya_id) {
        parcelData.wilaya_id = body.wilaya_id;
      }

      // Add commune_id or to_commune_name
      if (body.commune_id) {
        parcelData.commune_id = body.commune_id;
      } else if (body.to_commune_name) {
        parcelData.to_commune_name = body.to_commune_name;
      }

      // Add optional fields if provided
      if (body.stopdesk_id && body.is_stopdesk) {
        parcelData.stopdesk_id = body.stopdesk_id;
      }
      if (body.height) parcelData.height = body.height;
      if (body.width) parcelData.width = body.width;
      if (body.length) parcelData.length = body.length;
      if (body.weight) parcelData.weight = body.weight;
    } else {
      // Fallback: Using order data (old behavior)
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

      // Check if order uses a stop desk
      let centerInfo = null;
      if (order.stopDeskId) {
        // Récupérer les infos du centre depuis l'API Yalidine
        try {
          const centerResponse = await fetch(`https://api.yalidine.app/v1/centers/?center_id=${order.stopDeskId}`, {
            method: 'GET',
            headers: {
              'X-API-ID': yalidineApiId,
              'X-API-TOKEN': yalidineApiToken,
            },
          });

          if (centerResponse.ok) {
            const centerData = await centerResponse.json();
            if (centerData.data && centerData.data.length > 0) {
              centerInfo = centerData.data[0];
            }
          }
        } catch (error) {
          console.error('Error fetching center info:', error);
          // Continue sans center info - utilisera l'adresse de la commande
        }
      }

      // Prepare Yalidine parcel data
      parcelData = {
        firstname,
        lastname,
        address: order.shippingAddress.address,
        phone: order.shippingAddress.phone,
        wilaya_id: wilayaId,
        product_list: productList,
        order_id: order.orderNumber,
        price: order.total,
        do_insurance: false,
        freeshipping: false,
        has_exchange: false,
      };

      // Si un stop desk est sélectionné, ajouter les infos
      if (order.stopDeskId && centerInfo) {
        parcelData.is_stop_desk = true;
        parcelData.center_id = centerInfo.center_id;
        parcelData.commune_id = centerInfo.commune_id;
      } else {
        parcelData.is_stop_desk = false;
        parcelData.commune_id = 0; // 0 pour livraison à domicile sans commune spécifiée
      }
    }

    // Log des données envoyées pour debug
    console.log('=== YALIDINE PARCEL DATA ===');
    console.log('order_id:', parcelData.order_id);
    console.log('Full parcelData:', JSON.stringify(parcelData, null, 2));

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
