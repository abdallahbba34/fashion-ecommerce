'use client';

import { useState } from 'react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { ChevronDown, ChevronUp, MessageCircle, Send } from 'lucide-react';
import toast from 'react-hot-toast';

interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [comment, setComment] = useState('');
  const [email, setEmail] = useState('');

  const faqs: FAQItem[] = [
    {
      category: 'Commandes',
      question: 'Comment passer une commande ?',
      answer: 'Parcourez notre catalogue, ajoutez les produits à votre panier, puis suivez les étapes de commande. Vous recevrez une confirmation par email.',
    },
    {
      category: 'Commandes',
      question: 'Puis-je modifier ma commande ?',
      answer: 'Oui, vous pouvez modifier votre commande tant qu\'elle n\'a pas été expédiée. Contactez notre service client dans les plus brefs délais.',
    },
    {
      category: 'Livraison',
      question: 'Quels sont les délais de livraison ?',
      answer: 'Nous livrons dans toute l\'Algérie sous 48 à 72 heures après confirmation de votre commande.',
    },
    {
      category: 'Livraison',
      question: 'Livrez-vous dans toute l\'Algérie ?',
      answer: 'Oui, nous livrons dans les 58 wilayas d\'Algérie grâce à nos partenaires de livraison comme Yalidine.',
    },
    {
      category: 'Livraison',
      question: 'Quels sont les frais de livraison ?',
      answer: 'La livraison est gratuite pour toute commande supérieure à 5000 DA. Pour les commandes inférieures, des frais de livraison s\'appliquent selon votre wilaya.',
    },
    {
      category: 'Paiement',
      question: 'Quels modes de paiement acceptez-vous ?',
      answer: 'Nous acceptons le paiement à la livraison (espèces) et le paiement en ligne sécurisé.',
    },
    {
      category: 'Paiement',
      question: 'Le paiement en ligne est-il sécurisé ?',
      answer: 'Oui, toutes les transactions en ligne sont sécurisées et cryptées pour protéger vos informations.',
    },
    {
      category: 'Retours',
      question: 'Puis-je retourner un produit ?',
      answer: 'Oui, vous disposez de 48 heures pour retourner un produit en cas d\'anomalie ou de non-satisfaction.',
    },
    {
      category: 'Retours',
      question: 'Comment faire un retour ?',
      answer: 'Contactez notre service client dans les 48h suivant la réception. Nous organiserons la récupération du produit et procéderons au remboursement ou à l\'échange.',
    },
    {
      category: 'Produits',
      question: 'Comment choisir la bonne taille ?',
      answer: 'Consultez notre guide des tailles disponible sur chaque fiche produit. En cas de doute, n\'hésitez pas à nous contacter.',
    },
    {
      category: 'Produits',
      question: 'Les produits sont-ils garantis ?',
      answer: 'Oui, tous nos produits sont garantis contre les défauts de fabrication. Voir nos conditions générales pour plus de détails.',
    },
    {
      category: 'Compte',
      question: 'Dois-je créer un compte pour commander ?',
      answer: 'Non, vous pouvez commander sans créer de compte. Toutefois, un compte vous permet de suivre vos commandes et d\'accéder plus rapidement à vos informations.',
    },
  ];

  const categories = Array.from(new Set(faqs.map(faq => faq.category)));

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulation - À implémenter avec une vraie API
    toast.success('Merci pour votre commentaire ! Il sera examiné prochainement.');
    setComment('');
    setEmail('');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">Foire Aux Questions</h1>
            <p className="text-gray-600 text-lg">
              Trouvez rapidement des réponses à vos questions
            </p>
          </div>

          {/* FAQ par catégorie */}
          {categories.map((category) => (
            <div key={category} className="mb-8">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <span className="w-2 h-8 bg-black rounded"></span>
                {category}
              </h2>
              <div className="space-y-3">
                {faqs
                  .filter((faq) => faq.category === category)
                  .map((faq, index) => {
                    const globalIndex = faqs.indexOf(faq);
                    const isOpen = openIndex === globalIndex;

                    return (
                      <Card key={globalIndex} className="overflow-hidden">
                        <button
                          onClick={() => setOpenIndex(isOpen ? null : globalIndex)}
                          className="w-full p-6 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                        >
                          <span className="font-semibold pr-4">{faq.question}</span>
                          {isOpen ? (
                            <ChevronUp size={20} className="flex-shrink-0" />
                          ) : (
                            <ChevronDown size={20} className="flex-shrink-0" />
                          )}
                        </button>
                        {isOpen && (
                          <div className="px-6 pb-6 text-gray-700 border-t pt-4">
                            {faq.answer}
                          </div>
                        )}
                      </Card>
                    );
                  })}
              </div>
            </div>
          ))}

          {/* Section commentaires */}
          <Card className="p-8 mt-12 bg-gradient-to-br from-blue-50 to-purple-50">
            <div className="flex items-center gap-3 mb-6">
              <MessageCircle size={32} className="text-blue-600" />
              <div>
                <h2 className="text-2xl font-bold">Vous n'avez pas trouvé votre réponse ?</h2>
                <p className="text-gray-600">
                  Laissez-nous un commentaire, nous enrichirons cette FAQ
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmitComment} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Votre email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="votre.email@exemple.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Votre question ou commentaire
                </label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  required
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Posez votre question ici..."
                />
              </div>

              <Button type="submit" className="w-full">
                <Send size={20} className="mr-2" />
                Envoyer ma question
              </Button>

              <p className="text-sm text-gray-500 text-center">
                Nous examinerons votre question et l'ajouterons à notre FAQ si elle peut aider d'autres clients.
              </p>
            </form>
          </Card>

          {/* Contact rapide */}
          <Card className="p-8 mt-6 bg-black text-white">
            <h3 className="text-xl font-bold mb-4">Besoin d'aide immédiate ?</h3>
            <p className="mb-4">
              Notre service client est disponible 7j/7 pour répondre à toutes vos questions.
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
