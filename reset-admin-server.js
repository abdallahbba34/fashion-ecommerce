require('dotenv').config({ path: '.env.production' });
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const AdminSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
  role: String,
  createdAt: Date,
});

AdminSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

const Admin = mongoose.models.Admin || mongoose.model('Admin', AdminSchema);

async function resetAdmin() {
  try {
    console.log('\n🔄 Connexion à MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connecté\n');

    const admins = await Admin.find({});
    console.log(`📊 Admins trouvés: ${admins.length}\n`);

    if (admins.length === 0) {
      console.log('📝 Création admin...');
      await Admin.create({
        username: 'admin',
        email: 'admin@lasuitechic.online',
        password: 'Admin2025',
        role: 'super_admin',
      });
      console.log('✅ Admin créé!\n');
    } else {
      console.log(`🔄 Réinitialisation: ${admins[0].email}\n`);
      admins[0].password = 'Admin2025';
      await admins[0].save();
      console.log('✅ Mot de passe réinitialisé!\n');
    }

    console.log('╔════════════════════════════════════════╗');
    console.log('║  IDENTIFIANTS DE CONNEXION             ║');
    console.log('╠════════════════════════════════════════╣');
    console.log('║  📧 Email    : admin@lasuitechic.online ║');
    console.log('║  🔑 Password : Admin2025                ║');
    console.log('╚════════════════════════════════════════╝\n');

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur:', error.message);
    process.exit(1);
  }
}

resetAdmin();
