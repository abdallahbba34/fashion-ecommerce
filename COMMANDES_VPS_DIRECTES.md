# Commandes de diagnostic directes pour le VPS

## ⚠️ IMPORTANT
Vous êtes **déjà connecté au VPS**. Ne faites PAS de `scp` depuis le VPS.

Le fichier 1019.txt montre que vous essayez de faire:
```bash
scp scripts/fix-vps-produits.sh root@vps116857.serveur-vps.net:/tmp/
```

**Ceci ne fonctionnera pas** car vous êtes déjà SUR le VPS!

## ✅ Solution: Commandes directes

### Commande rapide tout-en-un

Copiez-collez cette commande sur le VPS:

```bash
cd /var/www/ecommerce && echo "=== API TEST ===" && curl -s http://localhost:3000/api/products?limit=1 | head -c 500 && echo "" && echo "" && echo "=== PM2 STATUS ===" && pm2 status && echo "" && echo "=== ENV CHECK ===" && ls -la .env.production && echo "" && echo "=== RECENT LOGS ===" && pm2 logs fashion-ecommerce --lines 20 --nostream
```

### Ou étape par étape:

#### 1. Aller dans le bon dossier
```bash
cd /var/www/ecommerce
pwd
```

#### 2. Tester l'API
```bash
curl http://localhost:3000/api/products?limit=1
```

**Résultat attendu**: JSON avec des produits
**Si erreur**: Passez à l'étape 3

#### 3. Vérifier les logs
```bash
pm2 logs fashion-ecommerce --lines 50 --nostream
```

**Cherchez**: Erreurs MongoDB, erreurs de connexion

#### 4. Vérifier .env.production
```bash
cat .env.production
```

**Vérifiez**: Que MONGODB_URI est présent et correct

#### 5. Tester MongoDB directement
```bash
node -e "
const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.production' });
console.log('Test de connexion MongoDB...');
mongoose.connect(process.env.MONGODB_URI, { serverSelectionTimeoutMS: 5000 })
  .then(() => {
    console.log('✓ MongoDB connecté avec succès!');
    return mongoose.connection.db.admin().listDatabases();
  })
  .then(result => {
    console.log('Bases disponibles:', result.databases.map(d => d.name).join(', '));
    process.exit(0);
  })
  .catch(err => {
    console.log('✗ Erreur MongoDB:', err.message);
    process.exit(1);
  });
"
```

## 🔍 Interprétation des résultats

### Si l'API retourne une erreur 500:
```
{"error":"Failed to fetch products"}
```
→ Problème de connexion MongoDB

**Solution**:
```bash
# Vérifier l'URI MongoDB
cat .env.production | grep MONGODB

# Redémarrer avec --update-env
pm2 restart fashion-ecommerce --update-env
pm2 logs fashion-ecommerce --lines 20
```

### Si l'API retourne `{"products":[]}`
→ Base de données vide, pas de produits

**Solution**:
```bash
# Vérifier s'il y a des produits dans MongoDB
# (Commande à ajouter après confirmation de la connexion)
```

### Si l'API retourne des produits
→ Le problème est ailleurs (cache, nginx, etc.)

**Solution**:
```bash
# Vider le cache et rebuild
rm -rf .next
npm run build
pm2 restart fashion-ecommerce
```

## 📋 Checklist

Après avoir exécuté les commandes, vérifiez:

- [ ] L'API répond sur http://localhost:3000/api/products
- [ ] MongoDB est accessible (pas d'erreur de connexion)
- [ ] .env.production contient MONGODB_URI
- [ ] PM2 est en ligne (pas de restart continu)
- [ ] Les logs ne montrent pas d'erreurs critiques

## 🚀 Après le diagnostic

Une fois que vous avez identifié le problème:

1. **Si MongoDB**: Ajoutez l'IP du VPS dans MongoDB Atlas whitelist
2. **Si .env**: Corrigez MONGODB_URI
3. **Si autre**: Envoyez-moi les logs et je vous aide

## 💡 Astuce

Pour voir les logs en temps réel pendant que vous testez le site:

```bash
# Terminal 1: Logs en direct
pm2 logs fashion-ecommerce

# Terminal 2: Testez l'API
curl http://localhost:3000/api/products?limit=1
```

Vous verrez immédiatement les erreurs s'afficher!
