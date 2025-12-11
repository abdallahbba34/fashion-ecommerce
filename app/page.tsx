import Link from 'next/link';
import Image from 'next/image';
import Button from '@/components/ui/Button';
import { ArrowRight, TruckIcon, ShieldCheck, HeadphonesIcon } from 'lucide-react';

export default function HomePage() {
  const featuredCategories = [
    {
      name: 'Nouveautés Femmes',
      image: '/images/women-collection.jpg',
      href: '/products?category=femmes&filter=new',
    },
    {
      name: 'Collection Hommes',
      image: '/images/men-collection.jpg',
      href: '/products?category=hommes',
    },
    {
      name: 'Accessoires',
      image: '/images/accessories.jpg',
      href: '/products?category=accessoires',
    },
  ];

  const features = [
    {
      icon: TruckIcon,
      title: 'Livraison Rapide',
      description: 'Livraison dans toute l\'Algérie sous 48-72h',
    },
    {
      icon: ShieldCheck,
      title: 'Paiement Sécurisé',
      description: 'Paiement à la livraison disponible',
    },
    {
      icon: HeadphonesIcon,
      title: 'Service Client',
      description: 'Disponible 7j/7 pour vous assister',
    },
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-gray-900 to-gray-700 text-white">
        <div className="container mx-auto px-4 py-24 md:py-32">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-fade-in">
              Nouvelle Collection
              <br />
              Printemps/Été 2025
            </h1>
            <p className="text-lg md:text-xl mb-8 text-gray-300 animate-slide-up">
              Découvrez les dernières tendances mode avec des pièces uniques
              et élégantes pour toutes les occasions.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/products?filter=new">
                <Button size="lg" className="w-full sm:w-auto">
                  Découvrir
                  <ArrowRight className="ml-2" size={20} />
                </Button>
              </Link>
              <Link href="/products?filter=sale">
                <Button variant="outline" size="lg" className="w-full sm:w-auto bg-white">
                  Voir les Soldes
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Catégories Populaires</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredCategories.map((category) => (
              <Link
                key={category.name}
                href={category.href}
                className="group relative overflow-hidden rounded-lg aspect-[3/4] bg-gray-200"
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
                <div className="absolute bottom-0 left-0 right-0 p-6 z-20">
                  <h3 className="text-2xl font-bold text-white mb-2">
                    {category.name}
                  </h3>
                  <span className="text-white underline group-hover:translate-x-2 transition-transform inline-block">
                    Explorer
                  </span>
                </div>
                {/* Placeholder for image - replace with actual images */}
                <div className="w-full h-full bg-gradient-to-br from-gray-300 to-gray-400 group-hover:scale-110 transition-transform duration-300" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-gray-100">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature) => (
              <div key={feature.title} className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-black text-white rounded-full flex items-center justify-center mb-4">
                  <feature.icon size={32} />
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-black text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Rejoignez Notre Newsletter</h2>
          <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
            Inscrivez-vous pour recevoir les dernières tendances, offres exclusives
            et réductions spéciales directement dans votre boîte mail.
          </p>
          <div className="max-w-md mx-auto flex gap-4">
            <input
              type="email"
              placeholder="Votre adresse email"
              className="flex-1 px-4 py-3 rounded-lg text-black"
            />
            <Button variant="outline" className="bg-white text-black hover:bg-gray-100">
              S'inscrire
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
