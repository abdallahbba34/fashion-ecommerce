// Script to replace placeholder images with real images
const mongoose = require('mongoose');
const path = require('path');

// Load environment variables
require('dotenv').config({ path: '.env.local' });

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/fashion-ecommerce';

async function fixPlaceholderImages() {
  try {
    console.log('\n=== Remplacement des images placeholder ===\n');

    await mongoose.connect(MONGODB_URI);
    console.log('✓ Connecté à MongoDB\n');

    const db = mongoose.connection.db;
    const products = await db.collection('products').find({}).toArray();

    for (const product of products) {
      let needsUpdate = false;
      let updatedImages = [...(product.images || [])];

      // Replace placeholder images
      updatedImages = updatedImages.map(img => {
        if (img && img.includes('placeholder')) {
          console.log(`${product.name}: Remplacement de ${img}`);
          needsUpdate = true;

          // Use a default image based on category
          if (product.category === 'femmes') {
            return '/images/products/default-femmes.png';
          } else if (product.category === 'hommes') {
            return '/images/products/default-hommes.png';
          } else {
            return '/images/products/default-product.png';
          }
        }
        return img;
      });

      if (needsUpdate) {
        await db.collection('products').updateOne(
          { _id: product._id },
          { $set: { images: updatedImages } }
        );
        console.log(`  ✓ Images mises à jour pour ${product.name}`);
      }
    }

    console.log('\n✓ Terminé!\n');

  } catch (error) {
    console.error('\n✗ Erreur:', error.message);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

fixPlaceholderImages();
