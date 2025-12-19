'use client';

import Card from '@/components/ui/Card';
import { RotateCcw, CheckCircle, AlertCircle, Clock, Shield } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

export default function ReturnsPage() {
  const { t } = useLanguage();
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">{t('returns.title')}</h1>
            <p className="text-gray-600 text-lg">
              Votre satisfaction est notre priorité
            </p>
          </div>

          {/* Garantie 48h */}
          <Card className="p-8 mb-8 bg-gradient-to-br from-green-500 to-blue-500 text-white">
            <div className="flex items-center gap-4 mb-4">
              <Shield size={48} />
              <div>
                <h2 className="text-3xl font-bold">{t('returns.guarantee.title')}</h2>
                <p className="text-xl">Retour gratuit en cas de problème</p>
              </div>
            </div>
            <p className="text-lg">
              Si vous n'êtes pas satisfait de votre achat, vous pouvez retourner votre produit
              dans les <strong>48 heures</strong> suivant la réception.
            </p>
          </Card>

          {/* Conditions de retour */}
          <Card className="p-8 mb-8">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <CheckCircle size={28} className="text-green-600" />
              Conditions de Retour
            </h2>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <CheckCircle size={20} className="text-green-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold mb-1">Délai de 48 heures</h3>
                  <p className="text-gray-600">
                    Vous disposez de 48 heures à compter de la réception pour nous contacter
                    et initier un retour.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CheckCircle size={20} className="text-green-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold mb-1">Produit en parfait état</h3>
                  <p className="text-gray-600">
                    Le produit doit être retourné dans son état d'origine, non porté (essayage uniquement)
                    et avec toutes ses étiquettes.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CheckCircle size={20} className="text-green-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold mb-1">Emballage d'origine</h3>
                  <p className="text-gray-600">
                    Le produit doit être retourné dans son emballage d'origine, non endommagé.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CheckCircle size={20} className="text-green-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold mb-1">Preuve d'achat</h3>
                  <p className="text-gray-600">
                    Conservez votre confirmation de commande ou votre facture.
                  </p>
                </div>
              </div>
            </div>
          </Card>

          {/* Motifs de retour */}
          <Card className="p-8 mb-8">
            <h2 className="text-2xl font-bold mb-6">Motifs de Retour Acceptés</h2>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="bg-red-50 border-2 border-red-500 p-4 rounded-lg">
                <AlertCircle size={28} className="text-red-600 mb-3" />
                <h3 className="font-bold mb-2">Défaut ou Anomalie</h3>
                <p className="text-sm text-gray-600">
                  Le produit présente un défaut de fabrication ou est endommagé
                </p>
              </div>

              <div className="bg-orange-50 border-2 border-orange-500 p-4 rounded-lg">
                <AlertCircle size={28} className="text-orange-600 mb-3" />
                <h3 className="font-bold mb-2">Non-conformité</h3>
                <p className="text-sm text-gray-600">
                  Le produit reçu ne correspond pas à la description ou à la commande
                </p>
              </div>

              <div className="bg-yellow-50 border-2 border-yellow-500 p-4 rounded-lg">
                <RotateCcw size={28} className="text-yellow-600 mb-3" />
                <h3 className="font-bold mb-2">Insatisfaction</h3>
                <p className="text-sm text-gray-600">
                  Le produit ne correspond pas à vos attentes (taille, couleur, style)
                </p>
              </div>
            </div>
          </Card>

          {/* Procédure de retour */}
          <Card className="p-8 mb-8">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <Clock size={28} />
              Comment Effectuer un Retour ?
            </h2>
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="w-12 h-12 bg-black text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">
                  1
                </div>
                <div>
                  <h3 className="font-bold mb-2">Contactez notre service client</h3>
                  <p className="text-gray-600">
                    Dans les 48h suivant la réception, contactez-nous par email à{' '}
                    <a href="mailto:contact@lasuitechic.online" className="text-blue-600 underline">
                      contact@lasuitechic.online
                    </a>
                    {' '}en indiquant :
                  </p>
                  <ul className="list-disc list-inside text-gray-600 ml-4 mt-2 space-y-1">
                    <li>Votre numéro de commande</li>
                    <li>Le motif du retour</li>
                    <li>Des photos si le produit est défectueux</li>
                  </ul>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-12 h-12 bg-black text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">
                  2
                </div>
                <div>
                  <h3 className="font-bold mb-2">Recevez les instructions</h3>
                  <p className="text-gray-600">
                    Notre équipe vous contactera sous 24h pour valider votre demande et organiser
                    la récupération du produit.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-12 h-12 bg-black text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">
                  3
                </div>
                <div>
                  <h3 className="font-bold mb-2">Préparez le colis</h3>
                  <p className="text-gray-600">
                    Remettez le produit dans son emballage d'origine avec toutes les étiquettes
                    et accessoires fournis.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-12 h-12 bg-black text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">
                  4
                </div>
                <div>
                  <h3 className="font-bold mb-2">Récupération du colis</h3>
                  <p className="text-gray-600">
                    Nous organisons la récupération de votre colis à votre domicile, sans frais
                    supplémentaires.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-12 h-12 bg-green-600 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">
                  5
                </div>
                <div>
                  <h3 className="font-bold mb-2">Remboursement ou échange</h3>
                  <p className="text-gray-600">
                    Après réception et vérification du produit, nous procédons au remboursement
                    intégral ou à l'échange sous <strong>7 jours ouvrables</strong>.
                  </p>
                </div>
              </div>
            </div>
          </Card>

          {/* Options de retour */}
          <Card className="p-8 mb-8">
            <h2 className="text-2xl font-bold mb-6">Options de Retour</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="border-2 border-green-500 p-6 rounded-lg">
                <h3 className="font-bold text-xl mb-3 text-green-700">Remboursement</h3>
                <p className="text-gray-600 mb-4">
                  Remboursement intégral du montant de l'article retourné, y compris les frais de livraison
                  initiaux si le retour est dû à un défaut ou une erreur de notre part.
                </p>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center gap-2">
                    <CheckCircle size={16} className="text-green-600" />
                    Remboursement sous 7 jours ouvrables
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle size={16} className="text-green-600" />
                    Même moyen de paiement que la commande
                  </li>
                </ul>
              </div>

              <div className="border-2 border-blue-500 p-6 rounded-lg">
                <h3 className="font-bold text-xl mb-3 text-blue-700">Échange</h3>
                <p className="text-gray-600 mb-4">
                  Échange contre un autre produit de même valeur ou de taille/couleur différente,
                  sans frais supplémentaires.
                </p>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center gap-2">
                    <CheckCircle size={16} className="text-blue-600" />
                    Envoi du nouvel article immédiat
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle size={16} className="text-blue-600" />
                    Pas de frais de livraison
                  </li>
                </ul>
              </div>
            </div>
          </Card>

          {/* Exceptions */}
          <Card className="p-8 mb-8 bg-yellow-50 border-2 border-yellow-500">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <AlertCircle size={28} className="text-yellow-600" />
              Articles Non Retournables
            </h2>
            <p className="text-gray-700 mb-4">
              Pour des raisons d'hygiène et de sécurité, certains articles ne peuvent pas être retournés :
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li>Sous-vêtements et maillots de bain (sauf défaut de fabrication)</li>
              <li>Articles personnalisés ou sur mesure</li>
              <li>Articles en promotion ou soldés (sauf défaut)</li>
              <li>Articles portés ou endommagés par le client</li>
            </ul>
          </Card>

          {/* Contact */}
          <Card className="p-8 bg-black text-white">
            <h3 className="text-xl font-bold mb-4">Besoin d'aide pour un retour ?</h3>
            <p className="mb-4">
              Notre équipe est là pour vous accompagner dans votre démarche de retour.
            </p>
            <div className="space-y-2">
              <p>Email : <a href="mailto:contact@lasuitechic.online" className="underline">contact@lasuitechic.online</a></p>
              <p>Disponible 7j/7 de 9h à 20h</p>
              <p className="text-sm text-gray-300 mt-4">
                Réponse garantie sous 24h
              </p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
