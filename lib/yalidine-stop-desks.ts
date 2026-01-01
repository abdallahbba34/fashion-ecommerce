// Liste des Stop Desktop Yalidine par wilaya
// Source: https://yalidine.com/stop-desks

export interface StopDesk {
  id: number;
  name: string;
  address: string;
  wilaya: string;
  wilaya_id: number;
  commune: string;
  commune_id: number;
}

export const YALIDINE_STOP_DESKS: StopDesk[] = [
  // Alger
  {
    id: 1,
    name: 'Stop Desktop Bab Ezzouar',
    address: 'Cité 1011 Logts, Bab Ezzouar',
    wilaya: 'Alger',
    wilaya_id: 16,
    commune: 'Bab Ezzouar',
    commune_id: 142
  },
  {
    id: 2,
    name: 'Stop Desktop Kouba',
    address: 'Rue Mohamed Boudiaf, Kouba',
    wilaya: 'Alger',
    wilaya_id: 16,
    commune: 'Kouba',
    commune_id: 152
  },
  {
    id: 3,
    name: 'Stop Desktop Hydra',
    address: 'Rue des Frères Bouadou, Hydra',
    wilaya: 'Alger',
    wilaya_id: 16,
    commune: 'Hydra',
    commune_id: 138
  },
  {
    id: 4,
    name: 'Stop Desktop Birtouta',
    address: 'Route Nationale N1, Birtouta',
    wilaya: 'Alger',
    wilaya_id: 16,
    commune: 'Birtouta',
    commune_id: 135
  },
  {
    id: 5,
    name: 'Stop Desktop Baraki',
    address: 'Cité 800 Logts, Baraki',
    wilaya: 'Alger',
    wilaya_id: 16,
    commune: 'Baraki',
    commune_id: 133
  },

  // Oran
  {
    id: 6,
    name: 'Stop Desktop Oran Centre',
    address: 'Boulevard Mohamed V, Oran',
    wilaya: 'Oran',
    wilaya_id: 31,
    commune: 'Oran',
    commune_id: 1031
  },
  {
    id: 7,
    name: 'Stop Desktop Bir El Djir',
    address: 'Hai Essalem, Bir El Djir',
    wilaya: 'Oran',
    wilaya_id: 31,
    commune: 'Bir El Djir',
    commune_id: 1038
  },
  {
    id: 8,
    name: 'Stop Desktop Es Senia',
    address: 'Route de l\'Aéroport, Es Senia',
    wilaya: 'Oran',
    wilaya_id: 31,
    commune: 'Es Senia',
    commune_id: 1039
  },

  // Constantine
  {
    id: 9,
    name: 'Stop Desktop Constantine Centre',
    address: 'Rue Larbi Ben M\'hidi, Constantine',
    wilaya: 'Constantine',
    wilaya_id: 25,
    commune: 'Constantine',
    commune_id: 751
  },
  {
    id: 10,
    name: 'Stop Desktop El Khroub',
    address: 'Cité 20 Août 1955, El Khroub',
    wilaya: 'Constantine',
    wilaya_id: 25,
    commune: 'El Khroub',
    commune_id: 753
  },

  // Blida
  {
    id: 11,
    name: 'Stop Desktop Blida Centre',
    address: 'Boulevard Larbi Tebessi, Blida',
    wilaya: 'Blida',
    wilaya_id: 9,
    commune: 'Blida',
    commune_id: 251
  },
  {
    id: 12,
    name: 'Stop Desktop Boufarik',
    address: 'Rue de la Liberté, Boufarik',
    wilaya: 'Blida',
    wilaya_id: 9,
    commune: 'Boufarik',
    commune_id: 252
  },

  // Sétif
  {
    id: 13,
    name: 'Stop Desktop Sétif Centre',
    address: 'Avenue de l\'ALN, Sétif',
    wilaya: 'Sétif',
    wilaya_id: 19,
    commune: 'Sétif',
    commune_id: 551
  },
  {
    id: 14,
    name: 'Stop Desktop El Eulma',
    address: 'Cité 1000 Logts, El Eulma',
    wilaya: 'Sétif',
    wilaya_id: 19,
    commune: 'El Eulma',
    commune_id: 552
  },

  // Annaba
  {
    id: 15,
    name: 'Stop Desktop Annaba Centre',
    address: 'Cours de la Révolution, Annaba',
    wilaya: 'Annaba',
    wilaya_id: 23,
    commune: 'Annaba',
    commune_id: 691
  },

  // Tizi Ouzou
  {
    id: 16,
    name: 'Stop Desktop Tizi Ouzou Centre',
    address: 'Boulevard Stiti Ali, Tizi Ouzou',
    wilaya: 'Tizi Ouzou',
    wilaya_id: 15,
    commune: 'Tizi Ouzou',
    commune_id: 451
  },

  // Béjaïa
  {
    id: 17,
    name: 'Stop Desktop Béjaïa Centre',
    address: 'Boulevard de la Liberté, Béjaïa',
    wilaya: 'Béjaïa',
    wilaya_id: 6,
    commune: 'Béjaïa',
    commune_id: 151
  },

  // Batna
  {
    id: 18,
    name: 'Stop Desktop Batna Centre',
    address: 'Avenue de l\'Indépendance, Batna',
    wilaya: 'Batna',
    wilaya_id: 5,
    commune: 'Batna',
    commune_id: 131
  },
];

// Get stop desks by wilaya
export function getStopDesksByWilaya(wilaya: string): StopDesk[] {
  return YALIDINE_STOP_DESKS.filter(desk => desk.wilaya === wilaya);
}

// Get stop desk by ID
export function getStopDeskById(id: number): StopDesk | undefined {
  return YALIDINE_STOP_DESKS.find(desk => desk.id === id);
}
