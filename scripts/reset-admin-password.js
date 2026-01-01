/**
 * Script pour réinitialiser le mot de passe admin
 * Usage: node scripts/reset-admin-password.js
 */

require('dotenv').config({ path: '.env.production' });
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Modèle User simplifié
const UserSchema = new mongoose.Schema({
  email: String,
  password: String,
  firstName: String,
  lastName: String,
  role: String,
});

const User = mongoose.models.User || mongoose.model('User', UserSchema);

async function resetAdminPassword() {
  try {
    console.log('🔄 Connexion à MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connecté à MongoDB\n');

    // Chercher l'admin
    const admin = await User.findOne({ role: 'admin' });

    if (!admin) {
      console.log('❌ Aucun compte admin trouvé!');
      console.log('📝 Création d\'un nouveau compte admin...\n');

      const newPassword = 'Admin@2025';
      const hashedPassword = await bcrypt.hash(newPassword, 10);

      const newAdmin = new User({
        email: 'admin@lasuitechic.com',
        password: hashedPassword,
        firstName: 'Admin',
        lastName: 'La Suite Chic',
        role: 'admin',
      });

      await newAdmin.save();

      console.log('✅ Nouveau compte admin créé avec succès!\n');
      console.log('═══════════════════════════════════════');
      console.log('📧 Email    : admin@lasuitechic.com');
      console.log('🔑 Password : Admin@2025');
      console.log('═══════════════════════════════════════\n');
      console.log('⚠️  IMPORTANT : Changez ce mot de passe après connexion!\n');
    } else {
      console.log('👤 Admin trouvé:', admin.email);
      console.log('🔄 Réinitialisation du mot de passe...\n');

      // Nouveau mot de passe
      const newPassword = 'Admin@2025';
      const hashedPassword = await bcrypt.hash(newPassword, 10);

      // Mettre à jour
      admin.password = hashedPassword;
      await admin.save();

      console.log('✅ Mot de passe réinitialisé avec succès!\n');
      console.log('═══════════════════════════════════════');
      console.log('📧 Email    :', admin.email);
      console.log('🔑 Password : Admin@2025');
      console.log('═══════════════════════════════════════\n');
      console.log('⚠️  IMPORTANT : Changez ce mot de passe après connexion!\n');
    }

    await mongoose.disconnect();
    console.log('✅ Déconnexion de MongoDB');
    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur:', error.message);
    process.exit(1);
  }
}

resetAdminPassword();
