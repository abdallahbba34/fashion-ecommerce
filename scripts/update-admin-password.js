// Script pour mettre à jour le mot de passe d'un admin
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Load environment variables
require('dotenv').config({ path: '.env.production' });

const MONGODB_URI = process.env.MONGODB_URI;

// Get credentials from command line arguments
const email = process.argv[2] || 'admin@lasuitechic.online';
const newPassword = process.argv[3] || 'Admin2025!';

// Admin schema
const AdminSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['admin', 'super_admin'], default: 'super_admin' },
  createdAt: { type: Date, default: Date.now },
});

const Admin = mongoose.models.Admin || mongoose.model('Admin', AdminSchema);

async function updatePassword() {
  try {
    console.log('\n=== Mise à jour du mot de passe administrateur ===\n');

    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI);
    console.log('✓ Connecté à MongoDB\n');

    // Validation
    if (newPassword.length < 6) {
      console.error('✗ Le mot de passe doit contenir au moins 6 caractères');
      process.exit(1);
    }

    // Find admin by email
    const admin = await Admin.findOne({ email });
    if (!admin) {
      console.error(`✗ Aucun administrateur trouvé avec l'email: ${email}`);
      console.log('\nVoulez-vous créer un nouvel admin ? Utilisez:');
      console.log(`  node scripts/create-admin-simple.js admin ${email} "${newPassword}"`);
      process.exit(1);
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update password
    admin.password = hashedPassword;
    await admin.save();

    console.log('✓ Mot de passe mis à jour avec succès !\n');
    console.log('Nouveaux identifiants de connexion:');
    console.log('─────────────────────────────');
    console.log(`  Email:        ${email}`);
    console.log(`  Mot de passe: ${newPassword}`);
    console.log(`  Rôle:         ${admin.role}`);
    console.log('─────────────────────────────');
    console.log('\nConnectez-vous sur: https://lasuitechic.online/admin/login\n');

  } catch (error) {
    console.error('\n✗ Erreur:', error.message);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

updatePassword();
