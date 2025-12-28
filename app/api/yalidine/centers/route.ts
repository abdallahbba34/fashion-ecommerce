import { NextRequest, NextResponse } from 'next/server';

/**
 * API pour récupérer la liste des centres Yalidine (Stop Desks)
 * Endpoint: GET /api/yalidine/centers?wilaya_id=16
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const wilayaId = searchParams.get('wilaya_id');

    const yalidineApiId = process.env.YALIDINE_API_ID;
    const yalidineApiToken = process.env.YALIDINE_API_TOKEN;

    if (!yalidineApiId || !yalidineApiToken) {
      return NextResponse.json(
        { error: 'Configuration Yalidine manquante' },
        { status: 500 }
      );
    }

    // Construire l'URL de l'API Yalidine
    let url = 'https://api.yalidine.app/v1/centers/';
    if (wilayaId) {
      url += `?wilaya_id=${wilayaId}`;
    }

    // Récupérer les centres depuis l'API Yalidine
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'X-API-ID': yalidineApiId,
        'X-API-TOKEN': yalidineApiToken,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('Yalidine API Error:', errorData);
      return NextResponse.json(
        {
          error: 'Erreur lors de la récupération des centres Yalidine',
          details: errorData
        },
        { status: response.status }
      );
    }

    const yalidineData = await response.json();

    // Extraire et transformer les données
    // L'API Yalidine retourne: { data: [...], has_more: ..., total_data: ... }
    const centersArray = yalidineData.data || [];

    // Transformer center_id en id pour compatibilité avec le frontend
    const transformedCenters = centersArray.map((center: any) => ({
      id: center.center_id,
      name: center.name,
      address: center.address,
      commune_id: center.commune_id,
      commune_name: center.commune_name,
      wilaya_id: center.wilaya_id,
      wilaya_name: center.wilaya_name,
    }));

    return NextResponse.json({
      success: true,
      centers: transformedCenters,
    });

  } catch (error) {
    console.error('Error fetching Yalidine centers:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}
