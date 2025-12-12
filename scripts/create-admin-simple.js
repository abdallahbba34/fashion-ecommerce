// Simple script to create admin user with provided credentials
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Load environment variables
require('dotenv').config({ path: '.env.local' });

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/fashion-ecommerce';

// Get credentials from command line arguments
const username = process.argv[2] || 'admin';
const email = process.argv[3] || 'admin@lasuitechic.online';
const password = process.argv[4] || 'Admin123!';

// Admin schema
const AdminSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['admin', 'super_admin'], default: 'super_admin' },
  createdAt: { type: Date, default: Date.now },
});

const Admin = mongoose.models.Admin || mongoose.model('Admin', AdminSchema);

async function createAdmin() {
  try {
    console.log('\n=== Création d\'un administrateur ===\n');

    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI);
    console.log('✓ Connecté à MongoDB\n');

    // Validation
    if (password.length < 6) {
      console.error('✗ Le mot de passe doit contenir au moins 6 caractères');
      process.exit(1);
    }

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ $or: [{ email }, { username }] });
    if (existingAdmin) {
      console.error('✗ Un administrateur avec cet email ou nom d\'utilisateur existe déjà');
      console.log('\nIdentifiants existants:');
      console.log(`  Email: ${existingAdmin.email}`);
      console.log(`  Username: ${existingAdmin.username}`);
      console.log('\nSi vous avez oublié le mot de passe, supprimez cet admin d\'abord.');
      process.exit(1);
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create admin
    const admin = new Admin({
      username,
      email,
      password: hashedPassword,
      role: 'super_admin',
    });

    await admin.save();

    console.log('✓ Administrateur créé avec succès !\n');
    console.log('Identifiants de connexion:');
    console.log('─────────────────────────────');
    console.log(`  Email:        ${email}`);
    console.log(`  Mot de passe: ${password}`);
    console.log(`  Rôle:         super_admin`);
    console.log('─────────────────────────────');
    console.log('\nConnectez-vous sur: http://localhost:3000/admin/login\n');

  } catch (error) {
    console.error('\n✗ Erreur:', error.message);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

createAdmin();
