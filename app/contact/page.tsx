'use client';

import { useState } from 'react';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import { Mail, MapPin, Phone, Send } from 'lucide-react';
import toast from 'react-hot-toast';
import { useLanguage } from '@/contexts/LanguageContext';

export default function ContactPage() {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulation - À implémenter avec une vraie API
    setTimeout(() => {
      toast.success(t('contact.form.success'));
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">{t('contact.title')}</h1>
            <p className="text-gray-600 text-lg">
              {t('contact.subtitle')}
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Formulaire de contact */}
            <Card className="p-8">
              <h2 className="text-2xl font-bold mb-6">{t('contact.form.title')}</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                  label={t('contact.form.name')}
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  placeholder={t('contact.form.namePlaceholder')}
                />

                <Input
                  label={t('contact.form.email')}
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  placeholder={t('contact.form.emailPlaceholder')}
                />

                <Input
                  label={t('contact.form.phone')}
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder={t('contact.form.phonePlaceholder')}
                />

                <Input
                  label={t('contact.form.subject')}
                  type="text"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  required
                  placeholder={t('contact.form.subjectPlaceholder')}
                />

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('contact.form.message')}
                  </label>
                  <textarea
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    required
                    rows={5}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                    placeholder={t('contact.form.messagePlaceholder')}
                  />
                </div>

                <Button type="submit" className="w-full" disabled={loading}>
                  <Send size={20} className="mr-2" />
                  {loading ? t('contact.form.sending') : t('contact.form.send')}
                </Button>
              </form>
            </Card>

            {/* Informations de contact */}
            <div className="space-y-6">
              <Card className="p-8">
                <h2 className="text-2xl font-bold mb-6">{t('contact.info.title')}</h2>
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-black text-white rounded-full flex items-center justify-center flex-shrink-0">
                      <MapPin size={24} />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">{t('contact.info.address.label')}</h3>
                      <p className="text-gray-600">
                        {t('contact.info.address.line1')}<br />
                        {t('contact.info.address.line2')}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-black text-white rounded-full flex items-center justify-center flex-shrink-0">
                      <Mail size={24} />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">{t('contact.info.email.label')}</h3>
                      <a
                        href="mailto:contact@lasuitechic.online"
                        className="text-gray-600 hover:text-black"
                      >
                        contact@lasuitechic.online
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-black text-white rounded-full flex items-center justify-center flex-shrink-0">
                      <Phone size={24} />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">{t('contact.info.phone.label')}</h3>
                      <p className="text-gray-600">
                        {t('contact.info.phone.availability')}
                      </p>
                    </div>
                  </div>
                </div>
              </Card>

              <Card className="p-8 bg-gradient-to-br from-black to-gray-800 text-white">
                <h3 className="text-xl font-bold mb-4">{t('contact.hours.title')}</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>{t('contact.hours.weekdays')}</span>
                    <span className="font-semibold">{t('contact.hours.weekdaysHours')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>{t('contact.hours.sunday')}</span>
                    <span className="font-semibold">{t('contact.hours.sundayHours')}</span>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
