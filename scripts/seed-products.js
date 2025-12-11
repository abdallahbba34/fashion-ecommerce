const mongoose = require('mongoose');

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/fashion-ecommerce';

// Product Schema (simplified)
const ProductSchema = new mongoose.Schema({
  name: String,
  slug: String,
  description: String,
  price: Number,
  compareAtPrice: Number,
  category: String,
  images: [String],
  variants: [{
    size: String,
    color: String,
    stock: Number,
  }],
  sizes: [String],
  colors: [String],
  material: String,
  care: String,
  featured: Boolean,
  newArrival: Boolean,
  bestseller: Boolean,
}, { timestamps: true });

const Product = mongoose.models.Product || mongoose.model('Product', ProductSchema);

// Sample products for Algeria
const sampleProducts = [
  {
    name: 'Robe Élégante Fleurie',
    slug: 'robe-elegante-fleurie',
    description: 'Magnifique robe avec motifs floraux, parfaite pour les occasions spéciales. Coupe élégante et confortable.',
    price: 4500,
    compareAtPrice: 6000,
    category: 'femmes',
    images: [],
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Rouge', 'Bleu', 'Rose'],
    variants: [
      { size: 'S', color: 'Rouge', stock: 8 },
      { size: 'M', color: 'Rouge', stock: 15 },
      { size: 'L', color: 'Rouge', stock: 10 },
      { size: 'M', color: 'Bleu', stock: 12 },
      { size: 'L', color: 'Bleu', stock: 7 },
    ],
    material: '100% Coton',
    care: 'Lavage en machine à 30°C',
    featured: true,
    newArrival: true,
    bestseller: false,
  },
  {
    name: 'Chemise Casual Homme',
    slug: 'chemise-casual-homme',
    description: 'Chemise casual élégante pour homme. Idéale pour un look décontracté et moderne.',
    price: 3200,
    category: 'hommes',
    images: [],
    sizes: ['M', 'L', 'XL', 'XXL'],
    colors: ['Blanc', 'Bleu', 'Noir'],
    variants: [
      { size: 'M', color: 'Blanc', stock: 20 },
      { size: 'L', color: 'Blanc', stock: 18 },
      { size: 'XL', color: 'Blanc', stock: 12 },
      { size: 'L', color: 'Bleu', stock: 15 },
      { size: 'XL', color: 'Noir', stock: 10 },
    ],
    material: 'Coton mélangé',
    care: 'Repassage à température moyenne',
    featured: false,
    newArrival: true,
    bestseller: true,
  },
  {
    name: 'Jean Slim Femme',
    slug: 'jean-slim-femme',
    description: 'Jean slim stretch confortable. Coupe moderne et flatteuse qui s\'adapte parfaitement.',
    price: 5500,
    compareAtPrice: 7000,
    category: 'femmes',
    images: [],
    sizes: ['36', '38', '40', '42', '44'],
    colors: ['Bleu foncé', 'Noir', 'Bleu clair'],
    variants: [
      { size: '38', color: 'Bleu foncé', stock: 25 },
      { size: '40', color: 'Bleu foncé', stock: 20 },
      { size: '42', color: 'Bleu foncé', stock: 15 },
      { size: '38', color: 'Noir', stock: 18 },
      { size: '40', color: 'Noir', stock: 22 },
    ],
    material: '98% Coton, 2% Élasthanne',
    care: 'Lavage en machine à 40°C',
    featured: true,
    newArrival: false,
    bestseller: true,
  },
  {
    name: 'Veste en Cuir Homme',
    slug: 'veste-cuir-homme',
    description: 'Veste en cuir synthétique de haute qualité. Style intemporel et masculin.',
    price: 12000,
    compareAtPrice: 15000,
    category: 'hommes',
    images: [],
    sizes: ['M', 'L', 'XL'],
    colors: ['Noir', 'Marron'],
    variants: [
      { size: 'M', color: 'Noir', stock: 5 },
      { size: 'L', color: 'Noir', stock: 8 },
      { size: 'XL', color: 'Noir', stock: 4 },
      { size: 'L', color: 'Marron', stock: 6 },
    ],
    material: 'Cuir synthétique premium',
    care: 'Nettoyage professionnel recommandé',
    featured: true,
    newArrival: true,
    bestseller: false,
  },
  {
    name: 'Sac à Main Élégant',
    slug: 'sac-main-elegant',
    description: 'Sac à main élégant et pratique. Parfait pour compléter votre tenue quotidienne.',
    price: 3800,
    category: 'accessoires',
    images: [],
    sizes: ['Unique'],
    colors: ['Noir', 'Beige', 'Rouge'],
    variants: [
      { size: 'Unique', color: 'Noir', stock: 30 },
      { size: 'Unique', color: 'Beige', stock: 25 },
      { size: 'Unique', color: 'Rouge', stock: 15 },
    ],
    material: 'Similicuir',
    care: 'Nettoyer avec un chiffon humide',
    featured: false,
    newArrival: false,
    bestseller: true,
  },
  {
    name: 'Sneakers Sport',
    slug: 'sneakers-sport',
    description: 'Baskets sportswear confortables. Idéales pour le sport ou un look décontracté.',
    price: 6500,
    compareAtPrice: 8000,
    category: 'accessoires',
    images: [],
    sizes: ['39', '40', '41', '42', '43', '44'],
    colors: ['Blanc', 'Noir', 'Gris'],
    variants: [
      { size: '40', color: 'Blanc', stock: 15 },
      { size: '41', color: 'Blanc', stock: 20 },
      { size: '42', color: 'Blanc', stock: 18 },
      { size: '41', color: 'Noir', stock: 12 },
      { size: '42', color: 'Noir', stock: 14 },
    ],
    material: 'Textile et synthétique',
    care: 'Lavage à la main',
    featured: true,
    newArrival: true,
    bestseller: true,
  },
  {
    name: 'Tunique Traditionnelle',
    slug: 'tunique-traditionnelle',
    description: 'Tunique traditionnelle algérienne moderne. Élégance et confort réunis.',
    price: 7500,
    category: 'femmes',
    images: [],
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Blanc', 'Beige', 'Bleu'],
    variants: [
      { size: 'M', color: 'Blanc', stock: 10 },
      { size: 'L', color: 'Blanc', stock: 8 },
      { size: 'M', color: 'Beige', stock: 12 },
      { size: 'L', color: 'Beige', stock: 9 },
    ],
    material: 'Coton et dentelle',
    care: 'Lavage délicat à 30°C',
    featured: true,
    newArrival: true,
    bestseller: false,
  },
  {
    name: 'Polo Classique Homme',
    slug: 'polo-classique-homme',
    description: 'Polo classique en coton. Indispensable pour un look casual chic.',
    price: 2800,
    category: 'hommes',
    images: [],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: ['Blanc', 'Noir', 'Marine', 'Rouge'],
    variants: [
      { size: 'M', color: 'Blanc', stock: 25 },
      { size: 'L', color: 'Blanc', stock: 30 },
      { size: 'XL', color: 'Blanc', stock: 20 },
      { size: 'M', color: 'Marine', stock: 22 },
      { size: 'L', color: 'Marine', stock: 28 },
    ],
    material: '100% Coton piqué',
    care: 'Lavage en machine à 40°C',
    featured: false,
    newArrival: false,
    bestseller: true,
  },
];

async function seedProducts() {
  try {
    console.log('🔗 Connexion à MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connecté à MongoDB');

    console.log('🗑️  Suppression des anciens produits...');
    await Product.deleteMany({});
    console.log('✅ Anciens produits supprimés');

    console.log('📦 Insertion des nouveaux produits...');
    await Product.insertMany(sampleProducts);
    console.log(`✅ ${sampleProducts.length} produits ajoutés avec succès!`);

    console.log('\n📊 Résumé:');
    const stats = await Product.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } }
    ]);
    stats.forEach(stat => {
      console.log(`   - ${stat._id}: ${stat.count} produits`);
    });

    console.log('\n🎉 Base de données initialisée avec succès!');
    console.log('👉 Vous pouvez maintenant démarrer le serveur avec: npm run dev');

  } catch (error) {
    console.error('❌ Erreur:', error);
  } finally {
    await mongoose.connection.close();
    console.log('\n🔌 Déconnecté de MongoDB');
  }
}

// Run the seed function
seedProducts();
