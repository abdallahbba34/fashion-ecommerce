'use client';

import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import Button from '@/components/ui/Button';
import toast from 'react-hot-toast';
import { WILAYA_MAPPING } from '@/lib/yalidine-wilayas';

interface Order {
  _id: string;
  orderNumber: string;
  shippingAddress: {
    fullName: string;
    phone: string;
    address: string;
    city: string;
    wilaya: string;
  };
  items: Array<{
    name: string;
    price: number;
    quantity: number;
    size: string;
    color: string;
  }>;
  total: number;
  stopDeskId?: string;
}

interface YalidineParcelFormProps {
  order: Order;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

interface Commune {
  id: number;
  name: string;
  wilaya_id: number;
}

interface StopDesk {
  id: number;
  name: string;
  address: string;
  commune_id: number;
  commune_name: string;
  wilaya_id: number;
  wilaya_name: string;
}

export default function YalidineParcelForm({ order, isOpen, onClose, onSuccess }: YalidineParcelFormProps) {
  const [loading, setLoading] = useState(false);
  const [loadingCommunes, setLoadingCommunes] = useState(false);
  const [loadingStopDesks, setLoadingStopDesks] = useState(false);
  const [communes, setCommunes] = useState<Commune[]>([]);
  const [stopDesks, setStopDesks] = useState<StopDesk[]>([]);

  // Split fullName into first and last name
  const nameParts = order.shippingAddress.fullName.trim().split(' ');
  const defaultFirstname = nameParts[0];
  const defaultLastname = nameParts.slice(1).join(' ') || nameParts[0];

  // Prepare product list
  const defaultProductList = order.items
    .map((item) => `${item.name} (${item.size}, ${item.color}) x${item.quantity}`)
    .join(', ');

  // Get default wilaya_id from order
  const defaultWilayaId = WILAYA_MAPPING[order.shippingAddress.wilaya] || '';

  const [formData, setFormData] = useState({
    // Informations client
    firstname: defaultFirstname,
    familyname: defaultLastname,
    contact_phone: order.shippingAddress.phone,
    address: order.shippingAddress.address,

    // Localisation
    wilaya_id: defaultWilayaId.toString(),
    commune_id: '',
    to_commune_name: order.shippingAddress.city,

    // Produits et prix
    product_list: defaultProductList,
    price: order.total.toString(),

    // Options d'expédition
    freeshipping: false,
    is_stopdesk: !!order.stopDeskId,
    stopdesk_id: order.stopDeskId || '',
    has_exchange: false,
    do_insurance: false,

    // Dimensions (optionnelles)
    height: '',
    width: '',
    length: '',
    weight: '',

    // Référence
    order_id: order.orderNumber,
  });

  // Load communes when wilaya changes
  useEffect(() => {
    if (!formData.wilaya_id) {
      setCommunes([]);
      return;
    }

    const loadCommunes = async () => {
      setLoadingCommunes(true);
      try {
        const response = await fetch(`/api/yalidine/communes?wilaya_id=${formData.wilaya_id}`);
        if (response.ok) {
          const data = await response.json();
          // L'API Yalidine retourne { data: [...] }
          setCommunes(data.communes?.data || []);
        }
      } catch (error) {
        console.error('Error loading communes:', error);
        toast.error('Erreur lors du chargement des communes');
      } finally {
        setLoadingCommunes(false);
      }
    };

    loadCommunes();
  }, [formData.wilaya_id]);

  // Load stop desks when wilaya changes and is_stopdesk is checked
  useEffect(() => {
    if (!formData.wilaya_id || !formData.is_stopdesk) {
      setStopDesks([]);
      return;
    }

    const loadStopDesks = async () => {
      setLoadingStopDesks(true);
      try {
        const response = await fetch(`/api/yalidine/centers?wilaya_id=${formData.wilaya_id}`);
        if (response.ok) {
          const data = await response.json();
          setStopDesks(data.centers || []);
        }
      } catch (error) {
        console.error('Error loading stop desks:', error);
        toast.error('Erreur lors du chargement des stop desks');
      } finally {
        setLoadingStopDesks(false);
      }
    };

    loadStopDesks();
  }, [formData.wilaya_id, formData.is_stopdesk]);

  // Reset form when order changes
  useEffect(() => {
    const nameParts = order.shippingAddress.fullName.trim().split(' ');
    const firstname = nameParts[0];
    const lastname = nameParts.slice(1).join(' ') || nameParts[0];

    const productList = order.items
      .map((item) => `${item.name} (${item.size}, ${item.color}) x${item.quantity}`)
      .join(', ');

    const wilayaId = WILAYA_MAPPING[order.shippingAddress.wilaya] || '';

    setFormData({
      firstname,
      familyname: lastname,
      contact_phone: order.shippingAddress.phone,
      address: order.shippingAddress.address,
      wilaya_id: wilayaId.toString(),
      commune_id: '',
      to_commune_name: order.shippingAddress.city,
      product_list: productList,
      price: order.total.toString(),
      freeshipping: false,
      is_stopdesk: !!order.stopDeskId,
      stopdesk_id: order.stopDeskId || '',
      has_exchange: false,
      do_insurance: false,
      height: '',
      width: '',
      length: '',
      weight: '',
      order_id: order.orderNumber,
    });
  }, [order]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validate required fields
      if (!formData.wilaya_id) {
        toast.error('Veuillez sélectionner une wilaya');
        setLoading(false);
        return;
      }

      if (formData.is_stopdesk && !formData.stopdesk_id) {
        toast.error('Veuillez sélectionner un Stop Desk');
        setLoading(false);
        return;
      }

      // Préparer les données en convertissant les booléens et en nettoyant les champs vides
      const parcelData: any = {
        orderId: order._id,
        firstname: formData.firstname.trim(),
        familyname: formData.familyname.trim(),
        contact_phone: formData.contact_phone.trim(),
        address: formData.address.trim(),
        wilaya_id: parseInt(formData.wilaya_id),
        product_list: formData.product_list.trim(),
        price: parseFloat(formData.price),
        freeshipping: formData.freeshipping,
        is_stopdesk: formData.is_stopdesk,
        has_exchange: formData.has_exchange,
        do_insurance: formData.do_insurance,
        order_id: formData.order_id.trim(),
      };

      // Add commune_id if provided
      if (formData.commune_id) {
        parcelData.commune_id = parseInt(formData.commune_id);
      } else if (formData.to_commune_name.trim()) {
        // Si pas de commune_id mais on a un nom de commune
        parcelData.to_commune_name = formData.to_commune_name.trim();
      }

      // Ajouter stopdesk_id si is_stopdesk est true (CORRECTION: pas de .trim() sur les nombres!)
      if (formData.is_stopdesk && formData.stopdesk_id) {
        // stopdesk_id peut être une chaîne ou un nombre, on s'assure qu'il est envoyé correctement
        parcelData.stopdesk_id = typeof formData.stopdesk_id === 'string'
          ? parseInt(formData.stopdesk_id)
          : formData.stopdesk_id;
      }

      // Ajouter les dimensions si fournies
      if (formData.height) parcelData.height = parseFloat(formData.height);
      if (formData.width) parcelData.width = parseFloat(formData.width);
      if (formData.length) parcelData.length = parseFloat(formData.length);
      if (formData.weight) parcelData.weight = parseFloat(formData.weight);

      const response = await fetch('/api/yalidine/create-parcel', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(parcelData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erreur lors de la création du colis');
      }

      toast.success(`Colis créé avec succès ! N° de suivi: ${data.trackingNumber}`);
      onSuccess();
      onClose();
    } catch (error: any) {
      console.error('Error creating Yalidine parcel:', error);
      toast.error(error.message || 'Erreur lors de la création du colis Yalidine');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold">Créer un colis Yalidine</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Informations client */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Informations client</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Prénom <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.firstname}
                  onChange={(e) => setFormData({ ...formData, firstname: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Nom de famille <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.familyname}
                  onChange={(e) => setFormData({ ...formData, familyname: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Téléphone <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  required
                  value={formData.contact_phone}
                  onChange={(e) => setFormData({ ...formData, contact_phone: e.target.value })}
                  placeholder="0XXXXXXXXX"
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1">
                  Adresse <span className="text-red-500">*</span>
                </label>
                <textarea
                  required
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  rows={2}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Localisation */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Localisation</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Wilaya <span className="text-red-500">*</span>
                </label>
                <select
                  required
                  value={formData.wilaya_id}
                  onChange={(e) => {
                    setFormData({
                      ...formData,
                      wilaya_id: e.target.value,
                      commune_id: '', // Reset commune when wilaya changes
                      stopdesk_id: '' // Reset stop desk when wilaya changes
                    });
                  }}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                >
                  <option value="">Sélectionnez une wilaya</option>
                  {Object.entries(WILAYA_MAPPING)
                    .filter(([name, id], index, arr) => arr.findIndex(([n, i]) => i === id) === index)
                    .sort(([a], [b]) => a.localeCompare(b))
                    .map(([name, id]) => (
                      <option key={id} value={id}>
                        {name}
                      </option>
                    ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Commune {!formData.is_stopdesk && <span className="text-red-500">*</span>}
                </label>
                {loadingCommunes ? (
                  <div className="w-full px-4 py-2 border rounded-lg bg-gray-50">
                    Chargement des communes...
                  </div>
                ) : communes.length > 0 ? (
                  <select
                    required={!formData.is_stopdesk}
                    value={formData.commune_id}
                    onChange={(e) => setFormData({ ...formData, commune_id: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                  >
                    <option value="">Sélectionnez une commune</option>
                    {communes.map((commune) => (
                      <option key={commune.id} value={commune.id}>
                        {commune.name}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    type="text"
                    required={!formData.is_stopdesk}
                    value={formData.to_commune_name}
                    onChange={(e) => setFormData({ ...formData, to_commune_name: e.target.value })}
                    placeholder={formData.wilaya_id ? "Aucune commune trouvée, saisir manuellement" : "Sélectionnez d'abord une wilaya"}
                    disabled={!formData.wilaya_id}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-black focus:border-transparent disabled:bg-gray-100"
                  />
                )}
              </div>
            </div>
          </div>

          {/* Produits et prix */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Produits et prix</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Liste des produits <span className="text-red-500">*</span>
                </label>
                <textarea
                  required
                  value={formData.product_list}
                  onChange={(e) => setFormData({ ...formData, product_list: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Prix (DZD) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    max="150000"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                  />
                  <p className="text-xs text-gray-500 mt-1">Maximum: 150,000 DZD</p>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Référence commande <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.order_id}
                    onChange={(e) => setFormData({ ...formData, order_id: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Options d'expédition */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Options d'expédition</h3>
            <div className="space-y-3">
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.freeshipping}
                  onChange={(e) => setFormData({ ...formData, freeshipping: e.target.checked })}
                  className="w-5 h-5 rounded border-gray-300 text-black focus:ring-black"
                />
                <span className="text-sm font-medium">Livraison gratuite</span>
              </label>

              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.is_stopdesk}
                  onChange={(e) => setFormData({ ...formData, is_stopdesk: e.target.checked })}
                  className="w-5 h-5 rounded border-gray-300 text-black focus:ring-black"
                />
                <span className="text-sm font-medium">Livraison en point relais (Stop Desk)</span>
              </label>

              {formData.is_stopdesk && (
                <div className="ml-8">
                  <label className="block text-sm font-medium mb-1">
                    Stop Desk <span className="text-red-500">*</span>
                  </label>
                  {!formData.wilaya_id ? (
                    <div className="w-full px-4 py-2 border rounded-lg bg-gray-100 text-gray-500">
                      Veuillez d'abord sélectionner une wilaya
                    </div>
                  ) : loadingStopDesks ? (
                    <div className="w-full px-4 py-2 border rounded-lg bg-gray-50">
                      Chargement des stop desks...
                    </div>
                  ) : stopDesks.length > 0 ? (
                    <select
                      required={formData.is_stopdesk}
                      value={formData.stopdesk_id}
                      onChange={(e) => setFormData({ ...formData, stopdesk_id: e.target.value })}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                    >
                      <option value="">Sélectionnez un stop desk</option>
                      {stopDesks.map((desk) => (
                        <option key={desk.id} value={desk.id}>
                          {desk.name} - {desk.address} ({desk.commune_name})
                        </option>
                      ))}
                    </select>
                  ) : (
                    <div className="w-full px-4 py-2 border rounded-lg bg-yellow-50 text-yellow-800">
                      Aucun stop desk disponible dans cette wilaya
                    </div>
                  )}
                </div>
              )}

              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.has_exchange}
                  onChange={(e) => setFormData({ ...formData, has_exchange: e.target.checked })}
                  className="w-5 h-5 rounded border-gray-300 text-black focus:ring-black"
                />
                <span className="text-sm font-medium">Possibilité d'échange</span>
              </label>

              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.do_insurance}
                  onChange={(e) => setFormData({ ...formData, do_insurance: e.target.checked })}
                  className="w-5 h-5 rounded border-gray-300 text-black focus:ring-black"
                />
                <span className="text-sm font-medium">Assurance</span>
              </label>
            </div>
          </div>

          {/* Dimensions (optionnelles) */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Dimensions du colis (Optionnel)</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Hauteur (cm)</label>
                <input
                  type="number"
                  min="0"
                  step="0.1"
                  value={formData.height}
                  onChange={(e) => setFormData({ ...formData, height: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Largeur (cm)</label>
                <input
                  type="number"
                  min="0"
                  step="0.1"
                  value={formData.width}
                  onChange={(e) => setFormData({ ...formData, width: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Longueur (cm)</label>
                <input
                  type="number"
                  min="0"
                  step="0.1"
                  value={formData.length}
                  onChange={(e) => setFormData({ ...formData, length: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Poids (kg)</label>
                <input
                  type="number"
                  min="0"
                  step="0.1"
                  value={formData.weight}
                  onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Boutons d'action */}
          <div className="flex justify-end space-x-3 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={loading}
            >
              Annuler
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="bg-green-600 hover:bg-green-700"
            >
              {loading ? 'Création en cours...' : 'Créer le colis Yalidine'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
