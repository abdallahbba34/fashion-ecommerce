'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { User } from 'lucide-react';
import Button from '@/components/ui/Button';

export default function AccountPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
            {/* Header */}
            <div className="flex items-center gap-4 mb-8">
              <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
                <User size={32} className="text-gray-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Mon Compte</h1>
                <p className="text-gray-600">Gérez vos informations personnelles</p>
              </div>
            </div>

            {/* Info Message */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <p className="text-blue-800">
                La gestion de compte client sera bientôt disponible. Pour le moment, vous pouvez:
              </p>
              <ul className="mt-2 ml-4 list-disc text-blue-700">
                <li>Commander en tant qu'invité au checkout</li>
                <li>Accéder au panneau admin si vous êtes administrateur</li>
              </ul>
            </div>

            {/* Actions */}
            <div className="space-y-4">
              <Button
                onClick={() => router.push('/products')}
                variant="outline"
                className="w-full justify-center"
              >
                Continuer mes achats
              </Button>

              <Button
                onClick={() => router.push('/admin/login')}
                variant="outline"
                className="w-full justify-center"
              >
                Accès Admin
              </Button>

              <Button
                onClick={() => router.push('/')}
                className="w-full justify-center"
              >
                Retour à l'accueil
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
