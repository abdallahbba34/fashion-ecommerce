'use client';

import { Facebook, Instagram, Share2 } from 'lucide-react';

interface ShareButtonsProps {
  url: string;
  title: string;
  description?: string;
  image?: string;
}

export default function ShareButtons({ url, title, description, image }: ShareButtonsProps) {
  const shareOnFacebook = () => {
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
    window.open(facebookUrl, '_blank', 'width=600,height=400');
  };

  const shareOnWhatsApp = () => {
    const text = `${title}\n\n${description || ''}\n\n${url}`;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(whatsappUrl, '_blank');
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      alert('Lien copié dans le presse-papier!');
    } catch (error) {
      console.error('Erreur lors de la copie:', error);
    }
  };

  return (
    <div className="flex items-center gap-3">
      <span className="text-sm font-medium text-gray-700">Partager :</span>

      <button
        onClick={shareOnFacebook}
        className="p-2 rounded-full hover:bg-blue-50 text-blue-600 transition-colors"
        title="Partager sur Facebook"
      >
        <Facebook size={20} />
      </button>

      <button
        onClick={shareOnWhatsApp}
        className="p-2 rounded-full hover:bg-green-50 text-green-600 transition-colors"
        title="Partager sur WhatsApp"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
        </svg>
      </button>

      <button
        onClick={copyLink}
        className="p-2 rounded-full hover:bg-gray-100 text-gray-600 transition-colors"
        title="Copier le lien"
      >
        <Share2 size={20} />
      </button>
    </div>
  );
}

// Composant pour générer un lien trackable pour Facebook
interface TrackedLinkProps {
  productSlug: string;
  source: 'facebook' | 'instagram' | 'whatsapp';
  campaignName?: string;
}

export function generateTrackedLink({ productSlug, source, campaignName }: TrackedLinkProps): string {
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
  const params = new URLSearchParams({
    source,
    ...(campaignName && { ref: campaignName }),
  });

  return `${baseUrl}/products/${productSlug}?${params.toString()}`;
}

// Composant pour afficher un lien trackable pour les admins
export function TrackedLinkGenerator({ productSlug }: { productSlug: string }) {
  const [source, setSource] = useState<'facebook' | 'instagram' | 'whatsapp'>('facebook');
  const [campaignName, setCampaignName] = useState('');
  const [generatedLink, setGeneratedLink] = useState('');

  const generateLink = () => {
    const link = generateTrackedLink({ productSlug, source, campaignName });
    setGeneratedLink(link);
  };

  const copyGeneratedLink = async () => {
    try {
      await navigator.clipboard.writeText(generatedLink);
      alert('Lien trackable copié!');
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  return (
    <div className="bg-gray-50 p-4 rounded-lg space-y-3">
      <h3 className="font-semibold text-sm">Générer un lien trackable</h3>

      <div className="space-y-2">
        <label className="block text-xs font-medium">Source</label>
        <select
          value={source}
          onChange={(e) => setSource(e.target.value as any)}
          className="w-full px-3 py-2 border rounded-lg text-sm"
        >
          <option value="facebook">Facebook</option>
          <option value="instagram">Instagram</option>
          <option value="whatsapp">WhatsApp</option>
        </select>
      </div>

      <div className="space-y-2">
        <label className="block text-xs font-medium">Nom de campagne (optionnel)</label>
        <input
          type="text"
          value={campaignName}
          onChange={(e) => setCampaignName(e.target.value)}
          placeholder="Ex: promo-ramadan"
          className="w-full px-3 py-2 border rounded-lg text-sm"
        />
      </div>

      <button
        onClick={generateLink}
        className="w-full px-4 py-2 bg-black text-white rounded-lg text-sm hover:bg-gray-800"
      >
        Générer le lien
      </button>

      {generatedLink && (
        <div className="space-y-2">
          <div className="flex items-center justify-between bg-white p-2 rounded border">
            <span className="text-xs truncate flex-1">{generatedLink}</span>
            <button
              onClick={copyGeneratedLink}
              className="ml-2 px-2 py-1 text-xs bg-gray-100 rounded hover:bg-gray-200"
            >
              Copier
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// Import useState pour TrackedLinkGenerator
import { useState } from 'react';
