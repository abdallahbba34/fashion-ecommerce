import Link from 'next/link';
import { Facebook, Instagram, Twitter } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About */}
          <div>
            <h3 className="text-white text-lg font-bold mb-4">FASHION</h3>
            <p className="text-sm">
              Votre destination mode en Algérie. Découvrez les dernières tendances
              et styles pour hommes et femmes.
            </p>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="text-white font-semibold mb-4">Service Client</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/contact" className="hover:text-white transition-colors">Contact</Link></li>
              <li><Link href="/faq" className="hover:text-white transition-colors">FAQ</Link></li>
              <li><Link href="/shipping" className="hover:text-white transition-colors">Livraison</Link></li>
              <li><Link href="/returns" className="hover:text-white transition-colors">Retours</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-white font-semibold mb-4">Informations Légales</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/terms" className="hover:text-white transition-colors">Conditions Générales</Link></li>
              <li><Link href="/privacy" className="hover:text-white transition-colors">Politique de Confidentialité</Link></li>
              <li><Link href="/legal" className="hover:text-white transition-colors">Mentions Légales</Link></li>
            </ul>
          </div>

          {/* Newsletter & Social */}
          <div>
            <h4 className="text-white font-semibold mb-4">Restez Connecté</h4>
            <p className="text-sm mb-4">
              Inscrivez-vous à notre newsletter pour recevoir nos offres exclusives.
            </p>
            <div className="flex space-x-4 mb-4">
              <a href="#" className="hover:text-white transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" className="hover:text-white transition-colors">
                <Instagram size={20} />
              </a>
              <a href="#" className="hover:text-white transition-colors">
                <Twitter size={20} />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm">
          <p>&copy; {new Date().getFullYear()} FASHION. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  );
}
