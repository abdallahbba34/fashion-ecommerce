'use client';

import Card from '@/components/ui/Card';
import { Scale, Building2, Shield, FileText } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

export default function LegalPage() {
  const { t } = useLanguage();
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">{t('legal.title')}</h1>
            <p className="text-gray-600">
              Informations juridiques conformes à la législation algérienne
            </p>
          </div>

          {/* Éditeur du site */}
          <Card className="p-8 mb-6">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <Building2 size={28} />
              Éditeur du Site
            </h2>
            <div className="space-y-3 text-gray-700">
              <p><strong>Raison sociale :</strong> La Suite Chic</p>
              <p><strong>Forme juridique :</strong> Entreprise individuelle / SARL</p>
              <p><strong>Siège social :</strong> Bordj Bou Arreridj, Algérie</p>
              <p><strong>Email :</strong> <a href="mailto:contact@lasuitechic.online" className="text-blue-600 underline">contact@lasuitechic.online</a></p>
              <p><strong>Téléphone :</strong> Disponible 7j/7</p>
            </div>
          </Card>

          {/* Hébergement */}
          <Card className="p-8 mb-6">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <FileText size={28} />
              Hébergement du Site
            </h2>
            <div className="space-y-3 text-gray-700">
              <p><strong>Hébergeur :</strong> Vercel Inc.</p>
              <p><strong>Adresse :</strong> 340 S Lemon Ave #4133, Walnut, CA 91789, USA</p>
              <p><strong>Site web :</strong> <a href="https://vercel.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">vercel.com</a></p>
            </div>
          </Card>

          {/* Propriété intellectuelle */}
          <Card className="p-8 mb-6">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <Shield size={28} />
              Propriété Intellectuelle
            </h2>
            <div className="space-y-4 text-gray-700">
              <p>
                L'ensemble des éléments constituant le site web <strong>lasuitechic.online</strong> (structure,
                textes, graphismes, logo, images, vidéos, sons, bases de données, logiciels, etc.) sont la
                propriété exclusive de La Suite Chic.
              </p>
              <p>
                Toute reproduction, représentation, modification, publication ou adaptation de tout ou partie
                des éléments du site, quel que soit le moyen ou le procédé utilisé, est interdite sans
                l'autorisation écrite préalable de La Suite Chic.
              </p>
              <p>
                Toute exploitation non autorisée du site ou de l'un quelconque des éléments qu'il contient
                sera considérée comme constitutive d'une contrefaçon et poursuivie conformément aux
                dispositions du Code pénal algérien.
              </p>
            </div>
          </Card>

          {/* Protection des données */}
          <Card className="p-8 mb-6">
            <h2 className="text-2xl font-bold mb-6">Protection des Données Personnelles</h2>
            <div className="space-y-4 text-gray-700">
              <div>
                <h3 className="font-semibold mb-2">Collecte des données</h3>
                <p>
                  Conformément à la législation algérienne en matière de protection des données personnelles,
                  nous nous engageons à respecter la confidentialité des informations personnelles collectées
                  sur notre site.
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Données collectées</h3>
                <p className="mb-2">Nous collectons uniquement les données nécessaires au traitement de vos commandes :</p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Nom et prénom</li>
                  <li>Adresse de livraison</li>
                  <li>Email et numéro de téléphone</li>
                  <li>Informations de paiement (si paiement en ligne)</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Utilisation des données</h3>
                <p className="mb-2">Vos données personnelles sont utilisées uniquement pour :</p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Le traitement et le suivi de vos commandes</li>
                  <li>La communication concernant votre commande</li>
                  <li>L'amélioration de nos services</li>
                  <li>L'envoi d'offres promotionnelles (avec votre consentement)</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Droits des utilisateurs</h3>
                <p className="mb-2">Vous disposez des droits suivants concernant vos données personnelles :</p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li><strong>Droit d'accès :</strong> Vous pouvez consulter vos données personnelles</li>
                  <li><strong>Droit de rectification :</strong> Vous pouvez corriger vos données</li>
                  <li><strong>Droit à l'effacement :</strong> Vous pouvez demander la suppression de vos données</li>
                  <li><strong>Droit d'opposition :</strong> Vous pouvez vous opposer au traitement de vos données</li>
                </ul>
                <p className="mt-2">
                  Pour exercer ces droits, contactez-nous à <a href="mailto:contact@lasuitechic.online" className="text-blue-600 underline">contact@lasuitechic.online</a>
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Conservation des données</h3>
                <p>
                  Vos données personnelles sont conservées pendant la durée nécessaire aux finalités pour
                  lesquelles elles ont été collectées, conformément à la législation algérienne en vigueur.
                </p>
              </div>
            </div>
          </Card>

          {/* Cookies */}
          <Card className="p-8 mb-6">
            <h2 className="text-2xl font-bold mb-6">Politique de Cookies</h2>
            <div className="space-y-4 text-gray-700">
              <p>
                Notre site utilise des cookies pour améliorer votre expérience de navigation et analyser
                l'utilisation du site.
              </p>
              <div>
                <h3 className="font-semibold mb-2">Types de cookies utilisés :</h3>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li><strong>Cookies essentiels :</strong> Nécessaires au fonctionnement du site (panier, session)</li>
                  <li><strong>Cookies de performance :</strong> Pour analyser l'utilisation du site</li>
                  <li><strong>Cookies fonctionnels :</strong> Pour mémoriser vos préférences</li>
                </ul>
              </div>
              <p>
                Vous pouvez à tout moment désactiver les cookies dans les paramètres de votre navigateur.
              </p>
            </div>
          </Card>

          {/* Droit applicable */}
          <Card className="p-8 mb-6 border-2 border-black">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <Scale size={28} />
              Droit Applicable et Juridiction
            </h2>
            <div className="space-y-4 text-gray-700">
              <div>
                <h3 className="font-semibold mb-2">Législation applicable</h3>
                <p>
                  Les présentes mentions légales et l'utilisation du site <strong>lasuitechic.online</strong> sont
                  régies par le <strong>droit algérien</strong>, notamment :
                </p>
                <ul className="list-disc list-inside space-y-1 ml-4 mt-2">
                  <li>Le Code civil algérien</li>
                  <li>Le Code du commerce algérien</li>
                  <li>Le Code de protection du consommateur (Loi n° 09-03 du 25 février 2009)</li>
                  <li>Les lois relatives au commerce électronique</li>
                  <li>Les lois relatives à la protection des données personnelles</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Tribunaux compétents</h3>
                <p>
                  En cas de litige relatif à l'utilisation du site ou à l'exécution d'un contrat de vente,
                  une solution amiable sera recherchée en priorité.
                </p>
                <p className="mt-2">
                  À défaut de résolution amiable dans un délai de <strong>30 jours</strong>, le litige sera
                  porté devant les <strong>tribunaux compétents d'Algérie</strong>, conformément aux règles
                  de droit commun algérien.
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Médiation</h3>
                <p>
                  Conformément au Code de protection du consommateur algérien, le consommateur a la
                  possibilité de recourir à une procédure de médiation conventionnelle ou à tout autre
                  mode alternatif de règlement des litiges.
                </p>
              </div>
            </div>
          </Card>

          {/* Responsabilité */}
          <Card className="p-8 mb-6">
            <h2 className="text-2xl font-bold mb-6">Limitations de Responsabilité</h2>
            <div className="space-y-4 text-gray-700">
              <p>
                La Suite Chic s'efforce d'assurer l'exactitude et la mise à jour des informations diffusées
                sur le site. Toutefois, nous ne pouvons garantir l'exactitude, la précision ou l'exhaustivité
                des informations disponibles sur le site.
              </p>
              <p>
                La Suite Chic ne saurait être tenue responsable :
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Des interruptions du site pour des raisons de maintenance ou de mise à jour</li>
                <li>Des dommages résultant de l'intrusion d'un tiers ayant entraîné une modification des informations</li>
                <li>Des dommages directs ou indirects causés au matériel de l'utilisateur lors de l'accès au site</li>
                <li>En cas de force majeure ou d'événements hors de notre contrôle</li>
              </ul>
            </div>
          </Card>

          {/* Modifications */}
          <Card className="p-8 mb-6">
            <h2 className="text-2xl font-bold mb-6">Modifications des Mentions Légales</h2>
            <p className="text-gray-700">
              La Suite Chic se réserve le droit de modifier les présentes mentions légales à tout moment.
              Les modifications entrent en vigueur dès leur publication sur le site. Nous vous invitons
              à consulter régulièrement cette page.
            </p>
            <p className="text-gray-700 mt-3">
              <strong>Dernière mise à jour :</strong> Décembre 2025
            </p>
          </Card>

          {/* Contact */}
          <Card className="p-8 bg-black text-white">
            <h3 className="text-xl font-bold mb-4">Questions sur les Mentions Légales ?</h3>
            <p className="mb-4">
              Pour toute question concernant nos mentions légales ou vos droits, contactez-nous :
            </p>
            <div className="space-y-2">
              <p>Email : <a href="mailto:contact@lasuitechic.online" className="underline">contact@lasuitechic.online</a></p>
              <p>Adresse : Bordj Bou Arreridj, Algérie</p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
