// Script to fix product images paths
const mongoose = require('mongoose');

// Load environment variables
require('dotenv').config({ path: '.env.local' });

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/fashion-ecommerce';

async function fixProductImages() {
  try {
    console.log('\n=== Correction des chemins d\'images ===\n');

    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI);
    console.log('✓ Connecté à MongoDB\n');

    const db = mongoose.connection.db;
    const products = await db.collection('products').find({}).toArray();

    console.log(`Produits à vérifier: ${products.length}\n`);

    for (const product of products) {
      let needsUpdate = false;
      let updatedImages = [...(product.images || [])];

      console.log(`Vérification: ${product.name}`);
      console.log(`  Images actuelles: ${JSON.stringify(product.images)}`);

      // Filter out invalid image paths
      updatedImages = updatedImages.filter(img => {
        // Remove Windows absolute paths
        if (img && img.match(/^[A-Z]:\\/)) {
          console.log(`  ❌ Suppression chemin Windows invalide: ${img}`);
          needsUpdate = true;
          return false;
        }
        return true;
      });

      // If no images remain, add a placeholder
      if (updatedImages.length === 0) {
        console.log(`  ⚠ Aucune image valide, ajout d'un placeholder`);
        updatedImages.push('https://via.placeholder.com/400');
        needsUpdate = true;
      }

      if (needsUpdate) {
        await db.collection('products').updateOne(
          { _id: product._id },
          { $set: { images: updatedImages } }
        );
        console.log(`  ✓ Images mises à jour: ${JSON.stringify(updatedImages)}`);
      } else {
        console.log(`  ✓ OK - Aucune modification nécessaire`);
      }

      console.log('');
    }

    console.log('\n✓ Correction terminée!\n');

  } catch (error) {
    console.error('\n✗ Erreur:', error.message);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

fixProductImages();
