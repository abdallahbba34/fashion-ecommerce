'use client';

import { useState } from 'react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { ChevronDown, ChevronUp, MessageCircle, Send } from 'lucide-react';
import toast from 'react-hot-toast';
import { useLanguage } from '@/contexts/LanguageContext';

interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

export default function FAQPage() {
  const { t } = useLanguage();
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [comment, setComment] = useState('');
  const [email, setEmail] = useState('');

  const faqs: FAQItem[] = [
    {
      category: t('faq.categories.commandes'),
      question: t('faq.questions.orderHow.question'),
      answer: t('faq.questions.orderHow.answer'),
    },
    {
      category: t('faq.categories.commandes'),
      question: t('faq.questions.orderModify.question'),
      answer: t('faq.questions.orderModify.answer'),
    },
    {
      category: t('faq.categories.livraison'),
      question: t('faq.questions.deliveryTime.question'),
      answer: t('faq.questions.deliveryTime.answer'),
    },
    {
      category: t('faq.categories.livraison'),
      question: t('faq.questions.deliveryArea.question'),
      answer: t('faq.questions.deliveryArea.answer'),
    },
    {
      category: t('faq.categories.livraison'),
      question: t('faq.questions.deliveryCost.question'),
      answer: t('faq.questions.deliveryCost.answer'),
    },
    {
      category: t('faq.categories.paiement'),
      question: t('faq.questions.paymentMethods.question'),
      answer: t('faq.questions.paymentMethods.answer'),
    },
    {
      category: t('faq.categories.paiement'),
      question: t('faq.questions.paymentSecurity.question'),
      answer: t('faq.questions.paymentSecurity.answer'),
    },
    {
      category: t('faq.categories.retours'),
      question: t('faq.questions.returnAllowed.question'),
      answer: t('faq.questions.returnAllowed.answer'),
    },
    {
      category: t('faq.categories.retours'),
      question: t('faq.questions.returnHow.question'),
      answer: t('faq.questions.returnHow.answer'),
    },
    {
      category: t('faq.categories.produits'),
      question: t('faq.questions.sizeGuide.question'),
      answer: t('faq.questions.sizeGuide.answer'),
    },
    {
      category: t('faq.categories.produits'),
      question: t('faq.questions.warranty.question'),
      answer: t('faq.questions.warranty.answer'),
    },
    {
      category: t('faq.categories.compte'),
      question: t('faq.questions.accountRequired.question'),
      answer: t('faq.questions.accountRequired.answer'),
    },
  ];

  const categories = Array.from(new Set(faqs.map(faq => faq.category)));

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulation - À implémenter avec une vraie API
    toast.success(t('faq.comment.success'));
    setComment('');
    setEmail('');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">{t('faq.title')}</h1>
            <p className="text-gray-600 text-lg">
              {t('faq.subtitle')}
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
                <h2 className="text-2xl font-bold">{t('faq.comment.title')}</h2>
                <p className="text-gray-600">
                  {t('faq.comment.subtitle')}
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmitComment} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('faq.comment.email')}
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder={t('faq.comment.emailPlaceholder')}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('faq.comment.question')}
                </label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  required
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder={t('faq.comment.questionPlaceholder')}
                />
              </div>

              <Button type="submit" className="w-full">
                <Send size={20} className="mr-2" />
                {t('faq.comment.submit')}
              </Button>

              <p className="text-sm text-gray-500 text-center">
                {t('faq.comment.disclaimer')}
              </p>
            </form>
          </Card>

          {/* Contact rapide */}
          <Card className="p-8 mt-6 bg-black text-white">
            <h3 className="text-xl font-bold mb-4">{t('faq.help.title')}</h3>
            <p className="mb-4">
              {t('faq.help.description')}
            </p>
            <div className="space-y-2">
              <p>{t('faq.help.email')} <a href="mailto:contact@lasuitechic.online" className="underline">contact@lasuitechic.online</a></p>
              <p>{t('faq.help.address')}</p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
