// Script pour vérifier les uploads et permissions
const fs = require('fs');
const path = require('path');

console.log('\n=== Vérification des uploads ===\n');

const uploadsDir = path.join(__dirname, '..', 'public', 'uploads');

// Check if uploads directory exists
if (fs.existsSync(uploadsDir)) {
  console.log('✓ Dossier /public/uploads/ existe\n');

  // List files in uploads
  const files = fs.readdirSync(uploadsDir);
  console.log(`Fichiers trouvés: ${files.length}\n`);

  if (files.length > 0) {
    console.log('Liste des fichiers:');
    files.forEach(file => {
      const filePath = path.join(uploadsDir, file);
      const stats = fs.statSync(filePath);
      console.log(`  - ${file} (${Math.round(stats.size / 1024)}KB)`);
    });
    console.log('');
  } else {
    console.log('✗ Aucun fichier dans /public/uploads/\n');
  }

  // Check permissions
  try {
    fs.accessSync(uploadsDir, fs.constants.R_OK | fs.constants.W_OK);
    console.log('✓ Permissions lecture/écriture OK\n');
  } catch (err) {
    console.log('✗ Problème de permissions\n');
  }
} else {
  console.log('✗ Dossier /public/uploads/ n\'existe pas\n');
}

// Check products with images
const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.production' });

const ProductSchema = new mongoose.Schema({
  name: String,
  image: String,
  images: [String],
  createdAt: Date
});

const Product = mongoose.model('Product', ProductSchema);

mongoose.connect(process.env.MONGODB_URI).then(async () => {
  console.log('✓ Connecté à MongoDB\n');

  const products = await Product.find({}).select('name image images').limit(10);

  console.log(`Produits trouvés: ${products.length}\n`);

  if (products.length > 0) {
    console.log('Images des produits:');
    products.forEach(p => {
      console.log(`  ${p.name}:`);
      console.log(`    - Image principale: ${p.image || 'Aucune'}`);
      if (p.images && p.images.length > 0) {
        console.log(`    - Images multiples: ${p.images.join(', ')}`);
      }
    });
  }

  await mongoose.disconnect();
  process.exit(0);
}).catch(err => {
  console.error('Erreur MongoDB:', err.message);
  process.exit(1);
});
