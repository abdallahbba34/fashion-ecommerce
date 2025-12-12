// Script to show product categories
const mongoose = require('mongoose');

// Load environment variables
require('dotenv').config({ path: '.env.local' });

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/fashion-ecommerce';

async function showCategories() {
  try {
    await mongoose.connect(MONGODB_URI);

    const db = mongoose.connection.db;
    const products = await db.collection('products').find({}).toArray();

    console.log('\n=== Catégories des produits ===\n');
    products.forEach((p) => {
      console.log(`${p.name}: category="${p.category}" (type: ${typeof p.category})`);
    });

  } catch (error) {
    console.error('Erreur:', error.message);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

showCategories();
