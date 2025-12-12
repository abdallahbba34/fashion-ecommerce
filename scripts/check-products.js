// Script to check products in the database
const mongoose = require('mongoose');

// Load environment variables
require('dotenv').config({ path: '.env.local' });

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/fashion-ecommerce';

async function checkProducts() {
  try {
    console.log('\n=== Vérification des produits ===\n');

    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI);
    console.log('✓ Connecté à MongoDB\n');

    // Get products collection
    const db = mongoose.connection.db;
    const products = await db.collection('products').find({}).toArray();

    console.log(`Nombre total de produits: ${products.length}\n`);

    if (products.length === 0) {
      console.log('❌ Aucun produit trouvé dans la base de données!\n');
    } else {
      console.log('Liste des produits:');
      console.log('─────────────────────────────────────────────────────────');

      products.forEach((product, index) => {
        console.log(`${index + 1}. ${product.name}`);
        console.log(`   ID: ${product._id}`);
        console.log(`   Slug: ${product.slug || 'N/A'}`);
        console.log(`   Catégorie: ${product.category || 'N/A'}`);
        console.log(`   Prix: ${product.price || 'N/A'} DA`);
        console.log(`   Images: ${product.images?.length || 0} image(s)`);
        console.log(`   Stock: ${product.stock !== undefined ? product.stock : 'N/A'}`);
        console.log(`   Variants: ${product.variants?.length || 0}`);
        console.log('');
      });
    }

  } catch (error) {
    console.error('\n✗ Erreur:', error.message);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

checkProducts();
