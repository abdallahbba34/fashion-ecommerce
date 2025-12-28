import { NextRequest, NextResponse } from 'next/server';

/**
 * API pour récupérer la liste des communes avec leurs stop desks Yalidine
 * Endpoint: GET /api/yalidine/communes?wilaya_id=16&has_stop_desk=true
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const wilayaId = searchParams.get('wilaya_id');
    const hasStopDesk = searchParams.get('has_stop_desk');

    const yalidineApiId = process.env.YALIDINE_API_ID;
    const yalidineApiToken = process.env.YALIDINE_API_TOKEN;

    if (!yalidineApiId || !yalidineApiToken) {
      return NextResponse.json(
        { error: 'Configuration Yalidine manquante' },
        { status: 500 }
      );
    }

    // Construire l'URL de l'API Yalidine
    const params = new URLSearchParams();
    if (wilayaId) params.append('wilaya_id', wilayaId);
    if (hasStopDesk) params.append('has_stop_desk', hasStopDesk);

    const url = `https://api.yalidine.app/v1/communes/?${params.toString()}`;

    // Récupérer les communes depuis l'API Yalidine
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
          error: 'Erreur lors de la récupération des communes Yalidine',
          details: errorData
        },
        { status: response.status }
      );
    }

    const communes = await response.json();

    return NextResponse.json({
      success: true,
      communes,
    });

  } catch (error) {
    console.error('Error fetching Yalidine communes:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}
