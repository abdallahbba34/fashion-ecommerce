// Script ultra-simple pour réinitialiser le mot de passe admin
// À copier et exécuter sur le VPS

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config({ path: '.env.production' });

// CHANGEZ CES VALEURS ICI:
const EMAIL = 'admin@lasuitechic.online';
const NEW_PASSWORD = 'Admin2025!';  // <-- CHANGEZ CE MOT DE PASSE

const AdminSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
  role: String,
});

const Admin = mongoose.model('Admin', AdminSchema);

async function resetPassword() {
  try {
    console.log('\n========================================');
    console.log('REINITIALISATION MOT DE PASSE ADMIN');
    console.log('========================================\n');

    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✓ Connecte a MongoDB\n');

    const admin = await Admin.findOne({ email: EMAIL });

    if (!admin) {
      console.log('X Admin non trouve avec email:', EMAIL);
      console.log('\nCreation d un nouvel admin...\n');

      const hashedPassword = await bcrypt.hash(NEW_PASSWORD, 10);
      const newAdmin = new Admin({
        username: 'admin',
        email: EMAIL,
        password: hashedPassword,
        role: 'super_admin',
      });

      await newAdmin.save();
      console.log('✓ Nouvel admin cree avec succes!\n');
    } else {
      const hashedPassword = await bcrypt.hash(NEW_PASSWORD, 10);
      admin.password = hashedPassword;
      await admin.save();
      console.log('✓ Mot de passe mis a jour!\n');
    }

    console.log('========================================');
    console.log('IDENTIFIANTS DE CONNEXION:');
    console.log('========================================');
    console.log('Email:        ' + EMAIL);
    console.log('Mot de passe: ' + NEW_PASSWORD);
    console.log('URL:          https://lasuitechic.online/admin/login');
    console.log('========================================\n');

  } catch (error) {
    console.log('\nERREUR:', error.message);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

resetPassword();
