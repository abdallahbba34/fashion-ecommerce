// Script pour vérifier si un admin existe
const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.production' });

const AdminSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
  role: String,
  createdAt: Date,
});

const Admin = mongoose.model('Admin', AdminSchema);

async function checkAdmin() {
  try {
    console.log('\n=== Vérification des administrateurs ===\n');
    console.log('MongoDB URI:', process.env.MONGODB_URI ? 'Configuré ✓' : 'Non configuré ✗');

    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✓ Connecté à MongoDB\n');

    const admins = await Admin.find({});

    if (admins.length === 0) {
      console.log('✗ Aucun administrateur trouvé dans la base de données\n');
    } else {
      console.log(`✓ ${admins.length} administrateur(s) trouvé(s):\n`);
      admins.forEach((admin, index) => {
        console.log(`Admin ${index + 1}:`);
        console.log(`  Username: ${admin.username}`);
        console.log(`  Email: ${admin.email}`);
        console.log(`  Rôle: ${admin.role}`);
        console.log(`  Créé le: ${admin.createdAt}`);
        console.log('');
      });
    }

  } catch (error) {
    console.error('\n✗ Erreur:', error.message);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

checkAdmin();
