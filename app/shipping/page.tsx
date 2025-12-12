import Card from '@/components/ui/Card';
import { Truck, Package, MapPin, Clock, CheckCircle, Shield } from 'lucide-react';

export default function ShippingPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">Livraison et Expédition</h1>
            <p className="text-gray-600 text-lg">
              Recevez vos articles dans les meilleures conditions
            </p>
          </div>

          {/* Mise en avant */}
          <Card className="p-8 mb-8 bg-gradient-to-r from-green-500 to-blue-500 text-white">
            <div className="flex items-center gap-4 mb-4">
              <Truck size={48} />
              <div>
                <h2 className="text-3xl font-bold">Livraison Rapide 48-72h</h2>
                <p className="text-xl">Dans toute l'Algérie</p>
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-4 mt-6">
              <div className="flex items-center gap-2">
                <CheckCircle size={24} />
                <span>Livraison gratuite dès 5000 DA</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle size={24} />
                <span>Suivi de commande en temps réel</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle size={24} />
                <span>Emballage soigné et sécurisé</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle size={24} />
                <span>Partenaires de confiance</span>
              </div>
            </div>
          </Card>

          {/* Nos partenaires de livraison */}
          <Card className="p-8 mb-8">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <Package size={28} />
              Nos Partenaires de Livraison
            </h2>
            <div className="space-y-6">
              <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xl flex-shrink-0">
                  Y
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-lg mb-2">Yalidine</h3>
                  <p className="text-gray-600 mb-2">
                    Leader de la livraison en Algérie, Yalidine assure la livraison de vos colis
                    dans les 58 wilayas avec un service professionnel et rapide.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <span className="bg-blue-100 text-blue-800 text-xs px-3 py-1 rounded-full">
                      Couverture nationale
                    </span>
                    <span className="bg-green-100 text-green-800 text-xs px-3 py-1 rounded-full">
                      Suivi en temps réel
                    </span>
                    <span className="bg-purple-100 text-purple-800 text-xs px-3 py-1 rounded-full">
                      Livraison à domicile
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 border-l-4 border-blue-500 p-4">
                <p className="text-sm text-gray-700">
                  <strong>Note :</strong> D'autres partenaires de livraison peuvent être utilisés selon
                  votre localisation pour garantir le meilleur service possible.
                </p>
              </div>
            </div>
          </Card>

          {/* Délais de livraison */}
          <Card className="p-8 mb-8">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <Clock size={28} />
              Délais de Livraison
            </h2>
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-green-500 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">
                  48h
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Grandes villes</h3>
                  <p className="text-gray-600">
                    Alger, Oran, Constantine, Annaba, Blida, Sétif, Batna...
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">
                  72h
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Autres wilayas</h3>
                  <p className="text-gray-600">
                    Livraison garantie dans les 72 heures pour l'ensemble du territoire national
                  </p>
                </div>
              </div>

              <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 mt-4">
                <p className="text-sm text-gray-700">
                  <strong>Important :</strong> Les délais sont donnés à titre indicatif et peuvent varier
                  selon les conditions météorologiques, les jours fériés ou d'éventuels imprévus.
                </p>
              </div>
            </div>
          </Card>

          {/* Zones de livraison */}
          <Card className="p-8 mb-8">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <MapPin size={28} />
              Zones de Livraison
            </h2>
            <div className="space-y-4">
              <p className="text-gray-700">
                Nous livrons dans <strong>toutes les 58 wilayas d'Algérie</strong>, des grandes
                métropoles aux zones les plus reculées.
              </p>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-green-50 p-4 rounded-lg">
                  <h3 className="font-semibold mb-2 flex items-center gap-2">
                    <CheckCircle size={20} className="text-green-600" />
                    Livraison à domicile
                  </h3>
                  <p className="text-sm text-gray-600">
                    Votre colis est livré directement à votre adresse
                  </p>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="font-semibold mb-2 flex items-center gap-2">
                    <CheckCircle size={20} className="text-blue-600" />
                    Point relais
                  </h3>
                  <p className="text-sm text-gray-600">
                    Récupération dans un point relais près de chez vous
                  </p>
                </div>
              </div>
            </div>
          </Card>

          {/* Frais de livraison */}
          <Card className="p-8 mb-8">
            <h2 className="text-2xl font-bold mb-6">Frais de Livraison</h2>
            <div className="space-y-4">
              <div className="bg-gradient-to-r from-green-50 to-blue-50 border-2 border-green-500 p-6 rounded-lg">
                <div className="flex items-center gap-3 mb-2">
                  <CheckCircle size={28} className="text-green-600" />
                  <h3 className="font-bold text-xl">Livraison GRATUITE</h3>
                </div>
                <p className="text-lg">
                  Pour toute commande <strong>supérieure à 5000 DA</strong>
                </p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="border-b-2">
                    <tr className="text-left">
                      <th className="py-3">Montant de la commande</th>
                      <th className="py-3">Frais de livraison</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b">
                      <td className="py-3">Moins de 2000 DA</td>
                      <td className="py-3 font-semibold">400 DA</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-3">De 2000 DA à 4999 DA</td>
                      <td className="py-3 font-semibold">300 DA</td>
                    </tr>
                    <tr className="border-b bg-green-50">
                      <td className="py-3">Plus de 5000 DA</td>
                      <td className="py-3 font-bold text-green-600">GRATUIT</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </Card>

          {/* Conditions de livraison */}
          <Card className="p-8 mb-8">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <Shield size={28} />
              Conditions de Livraison Optimales
            </h2>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <CheckCircle size={20} className="text-green-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold mb-1">Emballage sécurisé</h3>
                  <p className="text-gray-600">
                    Tous nos produits sont soigneusement emballés pour garantir leur protection durant le transport.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CheckCircle size={20} className="text-green-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold mb-1">Suivi de commande</h3>
                  <p className="text-gray-600">
                    Vous recevez un numéro de suivi pour suivre votre colis en temps réel jusqu'à la livraison.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CheckCircle size={20} className="text-green-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold mb-1">Vérification à la livraison</h3>
                  <p className="text-gray-600">
                    Vous pouvez vérifier votre colis avant de l'accepter. En cas de problème, refusez la livraison.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CheckCircle size={20} className="text-green-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold mb-1">Service client disponible</h3>
                  <p className="text-gray-600">
                    Notre équipe est joignable 7j/7 pour répondre à vos questions sur votre livraison.
                  </p>
                </div>
              </div>
            </div>
          </Card>

          {/* Contact */}
          <Card className="p-8 bg-black text-white">
            <h3 className="text-xl font-bold mb-4">Questions sur votre livraison ?</h3>
            <p className="mb-4">
              Contactez notre service client pour plus d'informations.
            </p>
            <div className="space-y-2">
              <p>Email : <a href="mailto:contact@lasuitechic.online" className="underline">contact@lasuitechic.online</a></p>
              <p>Disponible 7j/7 de 9h à 20h</p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
