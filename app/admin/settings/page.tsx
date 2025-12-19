'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import {
  Settings as SettingsIcon,
  Truck,
  RotateCcw,
  MessageSquare,
  Share2,
  Globe,
  CreditCard,
  Save,
  AlertCircle
} from 'lucide-react';
import toast from 'react-hot-toast';

type TabType = 'general' | 'shipping' | 'returns' | 'messages' | 'social' | 'seo' | 'payment';

export default function SettingsPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabType>('general');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    // Général
    siteName: '',
    contactEmail: '',
    contactPhone: '',
    address: '',
    city: '',
    country: '',
    description: '',

    // Livraison
    freeShippingThreshold: 5000,
    shippingCostLow: 400,
    shippingCostMedium: 300,
    shippingCostThresholdLow: 2000,
    shippingCostThresholdHigh: 5000,
    deliveryTime: '48-72h',

    // Retours
    returnEnabled: true,
    returnPeriodHours: 48,
    returnConditions: '',

    // Messages
    bannerText: '',
    bannerEnabled: true,
    maintenanceMode: false,
    maintenanceMessage: '',
    promotionText: '',
    promotionEnabled: false,

    // Réseaux sociaux
    facebookUrl: '',
    instagramUrl: '',
    tiktokUrl: '',
    whatsappNumber: '',

    // SEO
    metaTitle: '',
    metaDescription: '',
    googleAnalyticsId: '',
    facebookPixelId: '',

    // Paiement
    onlinePaymentEnabled: false,
    cibApiKey: '',
    chargilyApiKey: '',
  });

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const response = await fetch('/api/settings');
      const data = await response.json();

      if (response.ok) {
        setFormData({
          siteName: data.siteName || '',
          contactEmail: data.contactEmail || '',
          contactPhone: data.contactPhone || '',
          address: data.address || '',
          city: data.city || '',
          country: data.country || '',
          description: data.description || '',

          freeShippingThreshold: data.freeShippingThreshold || 5000,
          shippingCostLow: data.shippingCostLow || 400,
          shippingCostMedium: data.shippingCostMedium || 300,
          shippingCostThresholdLow: data.shippingCostThresholdLow || 2000,
          shippingCostThresholdHigh: data.shippingCostThresholdHigh || 5000,
          deliveryTime: data.deliveryTime || '48-72h',

          returnEnabled: data.returnEnabled !== undefined ? data.returnEnabled : true,
          returnPeriodHours: data.returnPeriodHours || 48,
          returnConditions: data.returnConditions || '',

          bannerText: data.bannerText || '',
          bannerEnabled: data.bannerEnabled !== undefined ? data.bannerEnabled : true,
          maintenanceMode: data.maintenanceMode || false,
          maintenanceMessage: data.maintenanceMessage || '',
          promotionText: data.promotionText || '',
          promotionEnabled: data.promotionEnabled || false,

          facebookUrl: data.facebookUrl || '',
          instagramUrl: data.instagramUrl || '',
          tiktokUrl: data.tiktokUrl || '',
          whatsappNumber: data.whatsappNumber || '',

          metaTitle: data.metaTitle || '',
          metaDescription: data.metaDescription || '',
          googleAnalyticsId: data.googleAnalyticsId || '',
          facebookPixelId: data.facebookPixelId || '',

          onlinePaymentEnabled: data.onlinePaymentEnabled || false,
          cibApiKey: data.cibApiKey || '',
          chargilyApiKey: data.chargilyApiKey || '',
        });
      }
    } catch (error) {
      console.error('Error loading settings:', error);
      toast.error('Erreur lors du chargement des paramètres');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast.success('Paramètres enregistrés avec succès!');
      } else {
        throw new Error('Failed to save');
      }
    } catch (error) {
      console.error('Error saving settings:', error);
      toast.error('Erreur lors de l\'enregistrement');
    } finally {
      setSaving(false);
    }
  };

  const tabs = [
    { id: 'general' as TabType, label: 'Général', icon: SettingsIcon },
    { id: 'shipping' as TabType, label: 'Livraison', icon: Truck },
    { id: 'returns' as TabType, label: 'Retours', icon: RotateCcw },
    { id: 'messages' as TabType, label: 'Messages', icon: MessageSquare },
    { id: 'social' as TabType, label: 'Réseaux Sociaux', icon: Share2 },
    { id: 'seo' as TabType, label: 'SEO', icon: Globe },
    { id: 'payment' as TabType, label: 'Paiement', icon: CreditCard },
  ];

  if (loading) {
    return (
      <div className="p-8">
        <div className="text-center">Chargement...</div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Paramètres du Site</h1>
          <p className="text-gray-600 mt-2">Configuration globale de votre boutique</p>
        </div>
        <Button onClick={handleSave} disabled={saving} size="lg">
          <Save size={20} className="mr-2" />
          {saving ? 'Enregistrement...' : 'Enregistrer'}
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                flex items-center gap-2 px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors
                ${activeTab === tab.id
                  ? 'bg-black text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
                }
              `}
            >
              <Icon size={18} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Content */}
      <Card className="p-8">
        {/* GÉNÉRAL */}
        {activeTab === 'general' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold mb-6">Paramètres Généraux</h2>

            <div className="grid md:grid-cols-2 gap-6">
              <Input
                label="Nom du site"
                value={formData.siteName}
                onChange={(e) => setFormData({ ...formData, siteName: e.target.value })}
                placeholder="La Suite Chic"
              />

              <Input
                label="Email de contact"
                type="email"
                value={formData.contactEmail}
                onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                placeholder="contact@lasuitechic.online"
              />

              <Input
                label="Téléphone"
                type="tel"
                value={formData.contactPhone}
                onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                placeholder="0555 12 34 56"
              />

              <Input
                label="Ville"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                placeholder="Bordj Bou Arreridj"
              />

              <Input
                label="Adresse complète"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="Bordj Bou Arreridj"
              />

              <Input
                label="Pays"
                value={formData.country}
                onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                placeholder="Algérie"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description du site
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                placeholder="Boutique de mode en ligne en Algérie"
              />
            </div>
          </div>
        )}

        {/* LIVRAISON */}
        {activeTab === 'shipping' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold mb-6">Paramètres de Livraison</h2>

            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6">
              <p className="text-sm text-gray-700">
                <AlertCircle size={16} className="inline mr-2" />
                Ces paramètres définissent les frais de livraison selon le montant de la commande.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <Input
                label="Seuil livraison gratuite (DA)"
                type="number"
                value={formData.freeShippingThreshold}
                onChange={(e) => setFormData({ ...formData, freeShippingThreshold: parseInt(e.target.value) })}
              />

              <Input
                label="Délai de livraison"
                value={formData.deliveryTime}
                onChange={(e) => setFormData({ ...formData, deliveryTime: e.target.value })}
                placeholder="48-72h"
              />
            </div>

            <div className="border-t pt-6 mt-6">
              <h3 className="font-semibold mb-4">Grille de frais de livraison</h3>

              <div className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Seuil bas (DA)
                    </label>
                    <Input
                      type="number"
                      value={formData.shippingCostThresholdLow}
                      onChange={(e) => setFormData({ ...formData, shippingCostThresholdLow: parseInt(e.target.value) })}
                    />
                    <p className="text-xs text-gray-500 mt-1">Commandes &lt; {formData.shippingCostThresholdLow} DA</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Frais pour seuil bas (DA)
                    </label>
                    <Input
                      type="number"
                      value={formData.shippingCostLow}
                      onChange={(e) => setFormData({ ...formData, shippingCostLow: parseInt(e.target.value) })}
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Seuil haut (DA)
                    </label>
                    <Input
                      type="number"
                      value={formData.shippingCostThresholdHigh}
                      onChange={(e) => setFormData({ ...formData, shippingCostThresholdHigh: parseInt(e.target.value) })}
                    />
                    <p className="text-xs text-gray-500 mt-1">Commandes {formData.shippingCostThresholdLow}-{formData.shippingCostThresholdHigh} DA</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Frais pour seuil moyen (DA)
                    </label>
                    <Input
                      type="number"
                      value={formData.shippingCostMedium}
                      onChange={(e) => setFormData({ ...formData, shippingCostMedium: parseInt(e.target.value) })}
                    />
                  </div>
                </div>

                <div className="bg-green-50 p-4 rounded-lg">
                  <p className="text-sm font-medium">
                    Commandes &gt; {formData.freeShippingThreshold} DA : <span className="text-green-600">GRATUIT</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* RETOURS */}
        {activeTab === 'returns' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold mb-6">Paramètres de Retours</h2>

            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
              <input
                type="checkbox"
                checked={formData.returnEnabled}
                onChange={(e) => setFormData({ ...formData, returnEnabled: e.target.checked })}
                className="w-5 h-5"
              />
              <div>
                <label className="font-medium">Activer les retours</label>
                <p className="text-sm text-gray-600">Permettre aux clients de retourner leurs produits</p>
              </div>
            </div>

            <Input
              label="Période de retour (heures)"
              type="number"
              value={formData.returnPeriodHours}
              onChange={(e) => setFormData({ ...formData, returnPeriodHours: parseInt(e.target.value) })}
              disabled={!formData.returnEnabled}
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Conditions de retour
              </label>
              <textarea
                value={formData.returnConditions}
                onChange={(e) => setFormData({ ...formData, returnConditions: e.target.value })}
                rows={4}
                disabled={!formData.returnEnabled}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black disabled:bg-gray-100"
                placeholder="Produit dans son état d'origine avec étiquettes..."
              />
            </div>
          </div>
        )}

        {/* MESSAGES */}
        {activeTab === 'messages' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold mb-6">Messages Personnalisés</h2>

            {/* Bannière */}
            <div className="border rounded-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <input
                  type="checkbox"
                  checked={formData.bannerEnabled}
                  onChange={(e) => setFormData({ ...formData, bannerEnabled: e.target.checked })}
                  className="w-5 h-5"
                />
                <label className="font-semibold text-lg">Bannière Header</label>
              </div>

              <Input
                label="Texte de la bannière"
                value={formData.bannerText}
                onChange={(e) => setFormData({ ...formData, bannerText: e.target.value })}
                disabled={!formData.bannerEnabled}
                placeholder="Livraison gratuite pour toute commande supérieure à 5000 DA"
              />
            </div>

            {/* Promotion */}
            <div className="border rounded-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <input
                  type="checkbox"
                  checked={formData.promotionEnabled}
                  onChange={(e) => setFormData({ ...formData, promotionEnabled: e.target.checked })}
                  className="w-5 h-5"
                />
                <label className="font-semibold text-lg">Message Promotion</label>
              </div>

              <Input
                label="Texte de promotion"
                value={formData.promotionText}
                onChange={(e) => setFormData({ ...formData, promotionText: e.target.value })}
                disabled={!formData.promotionEnabled}
                placeholder="-30% sur toute la collection été"
              />
            </div>

            {/* Maintenance */}
            <div className="border rounded-lg p-6 border-yellow-500 bg-yellow-50">
              <div className="flex items-center gap-3 mb-4">
                <input
                  type="checkbox"
                  checked={formData.maintenanceMode}
                  onChange={(e) => setFormData({ ...formData, maintenanceMode: e.target.checked })}
                  className="w-5 h-5"
                />
                <label className="font-semibold text-lg text-yellow-800">Mode Maintenance</label>
              </div>

              <div className="bg-white rounded-lg p-4">
                <Input
                  label="Message de maintenance"
                  value={formData.maintenanceMessage}
                  onChange={(e) => setFormData({ ...formData, maintenanceMessage: e.target.value })}
                  disabled={!formData.maintenanceMode}
                  placeholder="Site en maintenance. Nous revenons bientôt!"
                />
              </div>

              {formData.maintenanceMode && (
                <p className="text-sm text-yellow-800 mt-3 flex items-center gap-2">
                  <AlertCircle size={16} />
                  Attention: Le site sera inaccessible aux visiteurs en mode maintenance!
                </p>
              )}
            </div>
          </div>
        )}

        {/* RÉSEAUX SOCIAUX */}
        {activeTab === 'social' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold mb-6">Réseaux Sociaux</h2>

            <Input
              label="Facebook (URL complète)"
              value={formData.facebookUrl}
              onChange={(e) => setFormData({ ...formData, facebookUrl: e.target.value })}
              placeholder="https://facebook.com/lasuitechic"
            />

            <Input
              label="Instagram (URL complète)"
              value={formData.instagramUrl}
              onChange={(e) => setFormData({ ...formData, instagramUrl: e.target.value })}
              placeholder="https://instagram.com/lasuitechic"
            />

            <Input
              label="TikTok (URL complète)"
              value={formData.tiktokUrl}
              onChange={(e) => setFormData({ ...formData, tiktokUrl: e.target.value })}
              placeholder="https://tiktok.com/@lasuitechic"
            />

            <Input
              label="WhatsApp (Numéro avec indicatif)"
              value={formData.whatsappNumber}
              onChange={(e) => setFormData({ ...formData, whatsappNumber: e.target.value })}
              placeholder="+213 555 12 34 56"
            />
          </div>
        )}

        {/* SEO */}
        {activeTab === 'seo' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold mb-6">Référencement (SEO)</h2>

            <Input
              label="Meta Title"
              value={formData.metaTitle}
              onChange={(e) => setFormData({ ...formData, metaTitle: e.target.value })}
              placeholder="La Suite Chic - Boutique Mode Algérie"
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Meta Description
              </label>
              <textarea
                value={formData.metaDescription}
                onChange={(e) => setFormData({ ...formData, metaDescription: e.target.value })}
                rows={3}
                maxLength={160}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                placeholder="Boutique de mode en ligne en Algérie..."
              />
              <p className="text-xs text-gray-500 mt-1">{formData.metaDescription.length}/160 caractères</p>
            </div>

            <div className="border-t pt-6 mt-6">
              <h3 className="font-semibold mb-4">Tracking & Analytics</h3>

              <Input
                label="Google Analytics ID"
                value={formData.googleAnalyticsId}
                onChange={(e) => setFormData({ ...formData, googleAnalyticsId: e.target.value })}
                placeholder="G-XXXXXXXXXX"
              />

              <Input
                label="Facebook Pixel ID"
                value={formData.facebookPixelId}
                onChange={(e) => setFormData({ ...formData, facebookPixelId: e.target.value })}
                placeholder="123456789012345"
              />
            </div>
          </div>
        )}

        {/* PAIEMENT */}
        {activeTab === 'payment' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold mb-6">Paramètres de Paiement</h2>

            <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 mb-6">
              <p className="text-sm text-gray-700">
                <AlertCircle size={16} className="inline mr-2" />
                Fonctionnalité en développement. Le paiement en ligne sera disponible prochainement.
              </p>
            </div>

            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
              <input
                type="checkbox"
                checked={formData.onlinePaymentEnabled}
                onChange={(e) => setFormData({ ...formData, onlinePaymentEnabled: e.target.checked })}
                className="w-5 h-5"
                disabled
              />
              <div>
                <label className="font-medium text-gray-400">Activer le paiement en ligne</label>
                <p className="text-sm text-gray-500">Bientôt disponible</p>
              </div>
            </div>

            <Input
              label="CIB API Key"
              value={formData.cibApiKey}
              onChange={(e) => setFormData({ ...formData, cibApiKey: e.target.value })}
              placeholder="cib_live_xxxxxxxxxx"
              disabled
            />

            <Input
              label="Chargily API Key"
              value={formData.chargilyApiKey}
              onChange={(e) => setFormData({ ...formData, chargilyApiKey: e.target.value })}
              placeholder="test_xxxxxxxxxx"
              disabled
            />
          </div>
        )}
      </Card>

      {/* Save button bottom */}
      <div className="mt-6 flex justify-end">
        <Button onClick={handleSave} disabled={saving} size="lg">
          <Save size={20} className="mr-2" />
          {saving ? 'Enregistrement...' : 'Enregistrer les modifications'}
        </Button>
      </div>
    </div>
  );
}
