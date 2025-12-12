// Script simplifié pour créer l'admin sur le VPS
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Load env
require('dotenv').config({ path: '.env.production' });

// Admin schema
const AdminSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
  role: { type: String, default: 'super_admin' },
  createdAt: { type: Date, default: Date.now }
});

const Admin = mongoose.model('Admin', AdminSchema);

async function createAdmin() {
  try {
    console.log('\n=== Création de l\'administrateur ===\n');

    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✓ Connecté à MongoDB\n');

    // Check if exists
    const exists = await Admin.findOne({ email: 'admin@lasuitechic.online' });
    if (exists) {
      console.log('✗ Admin déjà existant !');
      console.log('\nIdentifiants existants:');
      console.log('  Email: admin@lasuitechic.online');
      console.log('  Password: Admin@2025!');
      console.log('\nURL: https://lasuitechic.online/admin/login\n');
      process.exit(0);
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('Admin@2025!', salt);

    // Create admin
    await Admin.create({
      username: 'admin',
      email: 'admin@lasuitechic.online',
      password: hashedPassword,
      role: 'super_admin'
    });

    console.log('✅ Admin créé avec succès!\n');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('  IDENTIFIANTS DE CONNEXION');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('  Email:    admin@lasuitechic.online');
    console.log('  Password: Admin@2025!');
    console.log('  URL:      https://lasuitechic.online/admin/login');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  } catch (error) {
    console.error('\n✗ Erreur:', error.message);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

createAdmin();
