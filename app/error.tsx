'use client';

import { useEffect } from 'react';
import Button from '@/components/ui/Button';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full text-center">
        <h1 className="text-6xl font-bold text-gray-900 mb-4">Oups!</h1>
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">
          Une erreur s'est produite
        </h2>
        <p className="text-gray-600 mb-8">
          Nous nous excusons pour le désagrément. Veuillez réessayer.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button onClick={reset} size="lg">
            Réessayer
          </Button>
          <Button
            variant="outline"
            size="lg"
            onClick={() => window.location.href = '/'}
          >
            Retour à l'accueil
          </Button>
        </div>
      </div>
    </div>
  );
}
