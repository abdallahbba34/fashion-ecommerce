import Link from 'next/link';
import Button from '@/components/ui/Button';
import { CheckCircle } from 'lucide-react';

export default function OrderConfirmationPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-2xl mx-auto text-center">
        <CheckCircle size={64} className="mx-auto text-green-600 mb-4" />

        <h1 className="text-3xl font-bold mb-4">Commande confirmée !</h1>

        <p className="text-gray-600 mb-8">
          Merci pour votre commande. Nous avons bien reçu votre demande et nous
          vous contacterons bientôt pour confirmer les détails de livraison.
        </p>

        <div className="bg-gray-50 rounded-lg p-6 mb-8">
          <h2 className="font-semibold mb-2">Prochaines étapes</h2>
          <ul className="text-sm text-gray-600 space-y-2">
            <li>1. Notre équipe vérifie votre commande</li>
            <li>2. Nous vous contacterons par téléphone pour confirmation</li>
            <li>3. Votre commande sera préparée et expédiée</li>
            <li>4. Vous recevrez votre colis sous 48-72h</li>
          </ul>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/products">
            <Button variant="outline" size="lg">
              Continuer mes achats
            </Button>
          </Link>
          <Link href="/account/orders">
            <Button size="lg">
              Suivre ma commande
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
