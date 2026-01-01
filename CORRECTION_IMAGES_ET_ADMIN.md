# 🔧 Correction : Images + Mot de passe Admin

Guide pour corriger les images et réinitialiser le mot de passe admin sur le serveur.

---

## 📦 MÉTHODE 1 : Transférer les corrections avec WinSCP (Recommandé)

C'est la méthode la plus simple car j'ai déjà corrigé les fichiers en local.

### Étape 1 : Dans WinSCP

**Panneau GAUCHE (votre PC)** : `D:\ecom`
**Panneau DROIT (serveur)** : `/var/www/lasuitechic`

#### 1.1 Transférer les fichiers corrigés

**Glissez-déposez ces fichiers du GAUCHE vers la DROITE :**

1. `components/ProductCard.tsx` (images corrigées)
2. `app/products/[slug]/page.tsx` (images corrigées)
3. `next.config.mjs` (configuration images)

**Une fenêtre de confirmation apparaît** :
- Cochez **"Remplacer"**
- Cliquez **"OK"**

### Étape 2 : Dans le terminal SSH

#### 2.1 Naviguer vers le dossier
```bash
cd /var/www/lasuitechic
```

#### 2.2 Rebuild l'application
```bash
npm run build
```

⏱️ Attendez 1-2 minutes

#### 2.3 Redémarrer l'application
```bash
pm2 restart lasuitechic
```

#### 2.4 Vérifier
```bash
pm2 logs lasuitechic --lines 20
```

### Étape 3 : Tester les images

Ouvrez votre navigateur : **http://lasuitechic.online**

Les images devraient maintenant s'afficher ! ✅

---

## 🔑 CORRECTION 2 : Réinitialiser le mot de passe admin

### Méthode A : Avec le script (Recommandé)

#### A.1 Transférer le script via WinSCP

**Dans WinSCP** :
1. Panneau GAUCHE : Naviguez vers `D:\ecom\scripts`
2. Trouvez le fichier : `reset-admin-password.js`
3. Glissez-déposez vers : `/var/www/lasuitechic/scripts/`

#### A.2 Exécuter le script dans le terminal SSH

```bash
cd /var/www/lasuitechic
node scripts/reset-admin-password.js
```

**Résultat attendu :**
```
✅ Mot de passe réinitialisé avec succès!

╔════════════════════════════════════════════════╗
║  IDENTIFIANTS DE CONNEXION                     ║
╠════════════════════════════════════════════════╣
║  📧 Email    : admin@lasuitechic.online        ║
║  🔑 Password : Admin2025                       ║
╚════════════════════════════════════════════════╝
```

### Méthode B : Script direct dans le terminal

Si le transfert du script ne fonctionne pas, créez-le directement :

```bash
cd /var/www/lasuitechic
nano reset-admin-production.js
```

**Copiez-collez ce script :**

```javascript
require('dotenv').config({ path: '.env.production' });
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const AdminSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['admin', 'super_admin'], default: 'admin' },
  createdAt: { type: Date, default: Date.now },
});

AdminSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

const Admin = mongoose.models.Admin || mongoose.model('Admin', AdminSchema);

async function resetAdminPassword() {
  try {
    console.log('\n🔄 Connexion à MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connecté à MongoDB\n');

    const admins = await Admin.find({});
    console.log(`📊 Admins trouvés: ${admins.length}\n`);

    if (admins.length === 0) {
      console.log('📝 Création d\'un nouveau compte admin...');
      const newAdmin = new Admin({
        username: 'admin',
        email: 'admin@lasuitechic.online',
        password: 'Admin2025',
        role: 'super_admin',
      });
      await newAdmin.save();
      console.log('✅ Admin créé !\n');
    } else {
      const admin = admins[0];
      console.log(`🔄 Réinitialisation pour: ${admin.email}\n`);
      admin.password = 'Admin2025';
      await admin.save();
      console.log('✅ Mot de passe réinitialisé !\n');
    }

    console.log('╔════════════════════════════════════════╗');
    console.log('║  IDENTIFIANTS DE CONNEXION             ║');
    console.log('╠════════════════════════════════════════╣');
    console.log('║  Email    : admin@lasuitechic.online   ║');
    console.log('║  Password : Admin2025                  ║');
    console.log('╚════════════════════════════════════════╝\n');

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur:', error.message);
    process.exit(1);
  }
}

resetAdminPassword();
```

**Sauvegarder :**
- `Ctrl + O` (enregistrer)
- `Entrée`
- `Ctrl + X` (quitter)

**Exécuter :**
```bash
node reset-admin-production.js
```

**Nettoyer après :**
```bash
rm reset-admin-production.js
```

---

## ✅ VÉRIFICATION FINALE

### 1. Vérifier les images

Ouvrez : **http://lasuitechic.online**

Les images des produits devraient s'afficher ✅

### 2. Vérifier la connexion admin

1. Allez sur : **http://lasuitechic.online/admin/login**
2. Connectez-vous avec :
   - **Email** : `admin@lasuitechic.online`
   - **Mot de passe** : `Admin2025`
3. Vous devriez accéder au dashboard ✅

---

## 🐛 Si les images ne s'affichent toujours pas

### Option 1 : Vérifier la configuration

```bash
cd /var/www/lasuitechic
cat next.config.mjs
```

Devrait contenir :
```javascript
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
};
```

### Option 2 : Vérifier que les fichiers ont été modifiés

```bash
grep -n "unoptimized" components/ProductCard.tsx
```

Devrait afficher une ligne avec `unoptimized` (ligne 54 environ)

### Option 3 : Rebuild complet

```bash
cd /var/www/lasuitechic
rm -rf .next
npm run build
pm2 restart lasuitechic
```

---

## 🐛 Si la connexion admin ne fonctionne pas

### Vérifier que le script a bien tourné

```bash
cd /var/www/lasuitechic
node -e "
require('dotenv').config({ path: '.env.production' });
const mongoose = require('mongoose');
mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    const Admin = mongoose.model('Admin', new mongoose.Schema({}, { strict: false }));
    const admins = await Admin.find({});
    console.log('Admins:', admins.map(a => ({ email: a.email, role: a.role })));
    process.exit(0);
  })
  .catch(e => { console.error(e); process.exit(1); });
"
```

---

## 📋 RÉCAPITULATIF - Commandes complètes

Si vous voulez tout faire d'un coup :

```bash
# 1. Naviguer vers le dossier
cd /var/www/lasuitechic

# 2. Rebuild l'application (après transfert WinSCP)
npm run build

# 3. Redémarrer PM2
pm2 restart lasuitechic

# 4. Réinitialiser le mot de passe admin
node scripts/reset-admin-password.js

# 5. Vérifier que tout tourne
pm2 status
pm2 logs lasuitechic --lines 20

# 6. Tester dans le navigateur
curl -I http://localhost:3000
```

---

## ✅ Checklist finale

- [ ] Fichiers transférés via WinSCP (ProductCard.tsx, page.tsx, next.config.mjs)
- [ ] `npm run build` réussi
- [ ] PM2 redémarré
- [ ] Mot de passe admin réinitialisé
- [ ] Images s'affichent sur http://lasuitechic.online
- [ ] Connexion admin fonctionne avec Admin2025
- [ ] Dashboard admin accessible

---

**Vous êtes prêt ! 🚀**
