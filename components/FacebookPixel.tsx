'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

declare global {
  interface Window {
    fbq: any;
  }
}

export default function FacebookPixel() {
  const pathname = usePathname();

  useEffect(() => {
    // Récupérer l'ID du pixel depuis les variables d'environnement
    const pixelId = process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID;

    if (!pixelId) {
      console.log('Facebook Pixel non configuré. Ajoutez NEXT_PUBLIC_FACEBOOK_PIXEL_ID dans .env');
      return;
    }

    // Charger le script Facebook Pixel
    if (!window.fbq) {
      const script = document.createElement('script');
      script.innerHTML = `
        !function(f,b,e,v,n,t,s)
        {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
        n.callMethod.apply(n,arguments):n.queue.push(arguments)};
        if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
        n.queue=[];t=b.createElement(e);t.async=!0;
        t.src=v;s=b.getElementsByTagName(e)[0];
        s.parentNode.insertBefore(t,s)}(window, document,'script',
        'https://connect.facebook.net/en_US/fbevents.js');
        fbq('init', '${pixelId}');
        fbq('track', 'PageView');
      `;
      document.head.appendChild(script);

      // Ajouter le noscript
      const noscript = document.createElement('noscript');
      const img = document.createElement('img');
      img.height = 1;
      img.width = 1;
      img.style.display = 'none';
      img.src = `https://www.facebook.com/tr?id=${pixelId}&ev=PageView&noscript=1`;
      noscript.appendChild(img);
      document.body.appendChild(noscript);
    }
  }, []);

  useEffect(() => {
    if (window.fbq) {
      window.fbq('track', 'PageView');
    }
  }, [pathname]);

  return null;
}

// Fonctions utilitaires pour tracker des événements
export const trackEvent = (eventName: string, data?: any) => {
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('track', eventName, data);
  }
};

export const trackAddToCart = (productName: string, value: number, currency: string = 'DZD') => {
  trackEvent('AddToCart', {
    content_name: productName,
    value,
    currency,
  });
};

export const trackInitiateCheckout = (value: number, currency: string = 'DZD') => {
  trackEvent('InitiateCheckout', {
    value,
    currency,
  });
};

export const trackPurchase = (value: number, currency: string = 'DZD', orderNumber: string) => {
  trackEvent('Purchase', {
    value,
    currency,
    content_ids: [orderNumber],
  });
};

export const trackViewContent = (productName: string, value: number, currency: string = 'DZD') => {
  trackEvent('ViewContent', {
    content_name: productName,
    value,
    currency,
  });
};
