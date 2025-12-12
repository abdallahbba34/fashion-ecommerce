// Script to create the first admin user
// Run with: node scripts/create-admin.js

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const readline = require('readline');

// Load environment variables
require('dotenv').config({ path: '.env.local' });

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/fashion-ecommerce';

// Admin schema (simplified for script)
const AdminSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['admin', 'super_admin'], default: 'super_admin' },
  createdAt: { type: Date, default: Date.now },
});

const Admin = mongoose.models.Admin || mongoose.model('Admin', AdminSchema);

// Create readline interface for user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(query) {
  return new Promise(resolve => rl.question(query, resolve));
}

async function createAdmin() {
  try {
    console.log('\n=== Création d\'un administrateur ===\n');

    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI);
    console.log('✓ Connecté à MongoDB\n');

    // Get admin details from user
    const username = await question('Nom d\'utilisateur: ');
    const email = await question('Email: ');
    const password = await question('Mot de passe (min 6 caractères): ');

    // Validation
    if (!username || !email || !password) {
      console.error('\n✗ Tous les champs sont requis');
      process.exit(1);
    }

    if (password.length < 6) {
      console.error('\n✗ Le mot de passe doit contenir au moins 6 caractères');
      process.exit(1);
    }

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ $or: [{ email }, { username }] });
    if (existingAdmin) {
      console.error('\n✗ Un administrateur avec cet email ou nom d\'utilisateur existe déjà');
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

    console.log('\n✓ Administrateur créé avec succès !');
    console.log('\nDétails:');
    console.log(`  Nom d'utilisateur: ${username}`);
    console.log(`  Email: ${email}`);
    console.log(`  Rôle: super_admin`);
    console.log('\nVous pouvez maintenant vous connecter sur /admin/login\n');

  } catch (error) {
    console.error('\n✗ Erreur:', error.message);
  } finally {
    rl.close();
    await mongoose.disconnect();
    process.exit(0);
  }
}

createAdmin();
