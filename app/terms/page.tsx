import Card from '@/components/ui/Card';
import { Shield, CheckCircle, AlertCircle } from 'lucide-react';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">Conditions Générales de Vente</h1>
            <p className="text-gray-600">
              Dernière mise à jour : Décembre 2025
            </p>
          </div>

          <div className="space-y-6">
            {/* Garantie Satisfaction */}
            <Card className="p-8 border-2 border-green-500">
              <div className="flex items-start gap-4 mb-4">
                <Shield size={32} className="text-green-500 flex-shrink-0" />
                <div>
                  <h2 className="text-2xl font-bold mb-2 text-green-700">
                    Garantie Satisfaction 48h
                  </h2>
                  <p className="text-lg text-gray-700">
                    Votre satisfaction est notre priorité absolue
                  </p>
                </div>
              </div>
              <div className="space-y-3 ml-12">
                <div className="flex items-start gap-2">
                  <CheckCircle size={20} className="text-green-500 flex-shrink-0 mt-1" />
                  <p className="text-gray-700">
                    <strong>Retour possible dans les 48 heures</strong> en cas d'anomalie ou de non-satisfaction
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle size={20} className="text-green-500 flex-shrink-0 mt-1" />
                  <p className="text-gray-700">
                    Remboursement intégral ou échange sans frais supplémentaires
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle size={20} className="text-green-500 flex-shrink-0 mt-1" />
                  <p className="text-gray-700">
                    Produit retourné dans son emballage d'origine avec toutes les étiquettes
                  </p>
                </div>
              </div>
            </Card>

            {/* Article 1 */}
            <Card className="p-8">
              <h2 className="text-2xl font-bold mb-4">1. Objet</h2>
              <p className="text-gray-700 mb-4">
                Les présentes Conditions Générales de Vente (CGV) régissent les relations contractuelles
                entre La Suite Chic et ses clients dans le cadre de la vente en ligne de produits de mode.
              </p>
              <p className="text-gray-700">
                Toute commande passée sur notre site implique l'acceptation sans réserve des présentes CGV.
              </p>
            </Card>

            {/* Article 2 */}
            <Card className="p-8">
              <h2 className="text-2xl font-bold mb-4">2. Produits</h2>
              <p className="text-gray-700 mb-4">
                Nos produits sont conformes à la législation algérienne en vigueur. Les photographies
                illustrant les produits n'ont pas de valeur contractuelle et peuvent différer légèrement
                de la réalité.
              </p>
              <div className="bg-blue-50 border-l-4 border-blue-500 p-4">
                <div className="flex items-start gap-2">
                  <AlertCircle size={20} className="text-blue-500 flex-shrink-0 mt-1" />
                  <p className="text-sm text-gray-700">
                    <strong>Important :</strong> Nous nous efforçons de représenter fidèlement les couleurs
                    et textures. Toutefois, les variations d'affichage peuvent entraîner des différences
                    mineures.
                  </p>
                </div>
              </div>
            </Card>

            {/* Article 3 */}
            <Card className="p-8">
              <h2 className="text-2xl font-bold mb-4">3. Commandes</h2>
              <div className="space-y-4 text-gray-700">
                <div>
                  <h3 className="font-semibold mb-2">3.1 Processus de commande</h3>
                  <p>
                    Le client sélectionne les produits qu'il souhaite commander, vérifie sa commande
                    et confirme celle-ci en fournissant les informations requises.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">3.2 Confirmation</h3>
                  <p>
                    Une confirmation de commande est envoyée par email au client. Cette confirmation
                    récapitule les produits commandés, le montant total et les informations de livraison.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">3.3 Annulation</h3>
                  <p>
                    Le client peut annuler sa commande gratuitement tant que celle-ci n'a pas été expédiée.
                  </p>
                </div>
              </div>
            </Card>

            {/* Article 4 */}
            <Card className="p-8">
              <h2 className="text-2xl font-bold mb-4">4. Prix et Paiement</h2>
              <div className="space-y-4 text-gray-700">
                <p>
                  Tous les prix sont affichés en Dinars Algériens (DA) et comprennent toutes les taxes applicables.
                </p>
                <div>
                  <h3 className="font-semibold mb-2">Modes de paiement acceptés :</h3>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Paiement à la livraison (espèces)</li>
                    <li>Paiement sécurisé en ligne (si disponible)</li>
                  </ul>
                </div>
              </div>
            </Card>

            {/* Article 5 */}
            <Card className="p-8">
              <h2 className="text-2xl font-bold mb-4">5. Livraison</h2>
              <div className="space-y-4 text-gray-700">
                <p>
                  Les livraisons sont effectuées dans toute l'Algérie dans un délai de 48 à 72 heures
                  après confirmation de la commande.
                </p>
                <div className="bg-green-50 border-l-4 border-green-500 p-4">
                  <p className="font-semibold text-green-700">
                    Livraison gratuite pour toute commande supérieure à 5000 DA
                  </p>
                </div>
              </div>
            </Card>

            {/* Article 6 */}
            <Card className="p-8 bg-yellow-50 border-2 border-yellow-500">
              <h2 className="text-2xl font-bold mb-4 text-yellow-800">
                6. Droit de Rétractation et Garantie
              </h2>
              <div className="space-y-4 text-gray-700">
                <div>
                  <h3 className="font-semibold mb-2">6.1 Délai de rétractation</h3>
                  <p className="mb-2">
                    Conformément à notre engagement qualité, vous disposez d'un délai de <strong>48 heures</strong>
                    à compter de la réception de votre commande pour exercer votre droit de rétractation.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">6.2 Conditions de retour</h3>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Le produit doit être retourné dans son état d'origine</li>
                    <li>Emballage non endommagé et étiquettes intactes</li>
                    <li>Le produit ne doit pas avoir été porté (sauf essayage)</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">6.3 Motifs de retour acceptés</h3>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li><strong>Anomalie ou défaut</strong> : Produit défectueux ou endommagé</li>
                    <li><strong>Non-conformité</strong> : Produit différent de la commande</li>
                    <li><strong>Insatisfaction</strong> : Le produit ne correspond pas à vos attentes</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">6.4 Procédure de retour</h3>
                  <ol className="list-decimal list-inside space-y-2 ml-4">
                    <li>Contactez notre service client dans les 48h suivant la réception</li>
                    <li>Indiquez le motif du retour et votre numéro de commande</li>
                    <li>Nous organisons la récupération du produit</li>
                    <li>Remboursement ou échange sous 7 jours ouvrables</li>
                  </ol>
                </div>
              </div>
            </Card>

            {/* Article 7 */}
            <Card className="p-8">
              <h2 className="text-2xl font-bold mb-4">7. Responsabilité</h2>
              <p className="text-gray-700">
                La Suite Chic s'engage à fournir des produits de qualité. Notre responsabilité ne saurait
                être engagée en cas de force majeure ou de fait indépendant de notre volonté.
              </p>
            </Card>

            {/* Article 8 */}
            <Card className="p-8">
              <h2 className="text-2xl font-bold mb-4">8. Protection des Données</h2>
              <p className="text-gray-700 mb-4">
                Les informations collectées lors de votre commande sont nécessaires au traitement de celle-ci
                et sont strictement confidentielles.
              </p>
              <p className="text-gray-700">
                Conformément à la législation algérienne, vous disposez d'un droit d'accès et de rectification
                de vos données personnelles.
              </p>
            </Card>

            {/* Article 9 */}
            <Card className="p-8">
              <h2 className="text-2xl font-bold mb-4">9. Litiges et Juridiction</h2>
              <p className="text-gray-700 mb-4">
                Les présentes CGV sont soumises au droit algérien. En cas de litige, une solution amiable
                sera recherchée avant toute action judiciaire.
              </p>
              <p className="text-gray-700">
                À défaut d'accord amiable, le litige sera porté devant les tribunaux compétents
                d'Algérie selon les règles de droit commun.
              </p>
            </Card>

            {/* Contact */}
            <Card className="p-8 bg-black text-white">
              <h2 className="text-2xl font-bold mb-4">Questions ?</h2>
              <p className="mb-4">
                Pour toute question concernant nos conditions générales de vente, n'hésitez pas à nous contacter :
              </p>
              <div className="space-y-2">
                <p>Email : <a href="mailto:contact@lasuitechic.online" className="underline">contact@lasuitechic.online</a></p>
                <p>Adresse : Bordj Bou Arreridj, Algérie</p>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
