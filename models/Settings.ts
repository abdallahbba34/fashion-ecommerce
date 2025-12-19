import mongoose, { Schema, Model, Document } from 'mongoose';

export interface ISettings extends Document {
  // Paramètres Généraux
  siteName: string;
  contactEmail: string;
  contactPhone: string;
  address: string;
  city: string;
  country: string;
  description: string;
  logo?: string;

  // Livraison
  freeShippingThreshold: number;
  shippingCostLow: number; // < 2000 DA
  shippingCostMedium: number; // 2000-4999 DA
  shippingCostThresholdLow: number; // 2000
  shippingCostThresholdHigh: number; // 5000
  deliveryTime: string; // "48-72h"

  // Retours
  returnEnabled: boolean;
  returnPeriodHours: number; // 48
  returnConditions: string;

  // Messages personnalisés
  bannerText: string;
  bannerEnabled: boolean;
  maintenanceMode: boolean;
  maintenanceMessage: string;
  promotionText?: string;
  promotionEnabled: boolean;

  // Réseaux sociaux
  facebookUrl?: string;
  instagramUrl?: string;
  tiktokUrl?: string;
  whatsappNumber?: string;

  // SEO
  metaTitle: string;
  metaDescription: string;
  googleAnalyticsId?: string;
  facebookPixelId?: string;

  // Paiement (futur)
  onlinePaymentEnabled: boolean;
  cibApiKey?: string;
  chargilyApiKey?: string;

  // Système
  createdAt: Date;
  updatedAt: Date;
}

const SettingsSchema = new Schema<ISettings>(
  {
    // Paramètres Généraux
    siteName: { type: String, required: true, default: 'La Suite Chic' },
    contactEmail: { type: String, required: true, default: 'contact@lasuitechic.online' },
    contactPhone: { type: String, default: '' },
    address: { type: String, default: 'Bordj Bou Arreridj' },
    city: { type: String, default: 'Bordj Bou Arreridj' },
    country: { type: String, default: 'Algérie' },
    description: { type: String, default: 'Boutique de mode en ligne' },
    logo: { type: String },

    // Livraison
    freeShippingThreshold: { type: Number, default: 5000 },
    shippingCostLow: { type: Number, default: 400 },
    shippingCostMedium: { type: Number, default: 300 },
    shippingCostThresholdLow: { type: Number, default: 2000 },
    shippingCostThresholdHigh: { type: Number, default: 5000 },
    deliveryTime: { type: String, default: '48-72h' },

    // Retours
    returnEnabled: { type: Boolean, default: true },
    returnPeriodHours: { type: Number, default: 48 },
    returnConditions: { type: String, default: 'Produit dans son état d\'origine avec étiquettes' },

    // Messages personnalisés
    bannerText: { type: String, default: 'Livraison gratuite pour toute commande supérieure à 5000 DA' },
    bannerEnabled: { type: Boolean, default: true },
    maintenanceMode: { type: Boolean, default: false },
    maintenanceMessage: { type: String, default: 'Site en maintenance. Nous revenons bientôt!' },
    promotionText: { type: String },
    promotionEnabled: { type: Boolean, default: false },

    // Réseaux sociaux
    facebookUrl: { type: String },
    instagramUrl: { type: String },
    tiktokUrl: { type: String },
    whatsappNumber: { type: String },

    // SEO
    metaTitle: { type: String, default: 'La Suite Chic - Boutique Mode Algérie' },
    metaDescription: { type: String, default: 'Boutique de mode en ligne en Algérie. Livraison rapide dans les 58 wilayas.' },
    googleAnalyticsId: { type: String },
    facebookPixelId: { type: String },

    // Paiement
    onlinePaymentEnabled: { type: Boolean, default: false },
    cibApiKey: { type: String },
    chargilyApiKey: { type: String },
  },
  {
    timestamps: true,
    collection: 'settings'
  }
);

const SettingsModel: Model<ISettings> =
  mongoose.models.Settings || mongoose.model<ISettings>('Settings', SettingsSchema);

export default SettingsModel;
