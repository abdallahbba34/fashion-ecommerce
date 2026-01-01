# Corrections des erreurs - echec.png et insuf.png

## 📸 Problèmes identifiés

### 1. echec.png - Erreur au checkout
**Symptôme**: Message "Une erreur est survenue. Veuillez réessayer" lors de la confirmation de commande

**Cause probable**:
- Erreur de connexion MongoDB
- Problème lors de la mise à jour du stock
- Erreur de validation des données

**Problème dans le code**:
```typescript
catch (error) {
  toast.error(t('checkout.errors.error')); // Message générique, pas utile
  setIsSubmitting(false);
}
```

### 2. insuf.png - Message "Stock insuffisant"
**Symptôme**: Message d'erreur rouge "Stock insuffisant" en haut de la page produit

**Cause probable**:
- Toast d'erreur qui persiste
- Message affiché alors que le stock est suffisant
- Problème de vérification de stock

## ✅ Corrections apportées

### Correction 1: Amélioration des messages d'erreur au checkout

**Avant**:
```typescript
catch (error) {
  toast.error(t('checkout.errors.error')); // "Une erreur est survenue"
}
```

**Après**:
```typescript
catch (error: any) {
  console.error('Erreur checkout:', error);
  const errorMessage = error.message || t('checkout.errors.error');
  toast.error(errorMessage); // Message d'erreur détaillé
  setIsSubmitting(false);
}
```

**Avantage**: L'utilisateur voit maintenant le vrai message d'erreur

### Correction 2: Amélioration de l'API orders

**Avant**:
```typescript
catch (error) {
  return NextResponse.json(
    { error: 'Failed to create order' }, // Message générique
    { status: 500 }
  );
}
```

**Après**:
```typescript
catch (error: any) {
  console.error('Error creating order:', error);
  const errorMessage = error.message || 'Failed to create order';
  return NextResponse.json(
    {
      error: errorMessage, // Message spécifique
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    },
    { status: 500 }
  );
}
```

**Avantage**: Le message d'erreur est maintenant informatif

## 🛠️ Comment déployer les corrections

### Étape 1: Supprimer le dossier /var/www/ecommerce (optionnel)

```bash
# Transférer le script vers le VPS
scp scripts/cleanup-vps.sh root@vps116857.serveur-vps.net:/tmp/

# Se connecter au VPS
ssh root@vps116857.serveur-vps.net

# Exécuter le script de nettoyage
bash /tmp/cleanup-vps.sh

# Ou avec confirmation automatique (-y)
bash /tmp/cleanup-vps.sh -y
```

### Étape 2: Déployer les corrections

```bash
# Sur votre machine locale
# 1. Créer le build
npm run build

# 2. Créer l'archive
tar -czf corrections.tar.gz \
    --exclude=node_modules \
    --exclude=.git \
    --exclude=.next \
    --exclude=.claude \
    app/checkout/page.tsx \
    app/api/orders/route.ts

# 3. Transférer vers le VPS
scp corrections.tar.gz root@vps116857.serveur-vps.net:/tmp/

# 4. Sur le VPS
ssh root@vps116857.serveur-vps.net
cd /var/www/lasuitechic
tar -xzf /tmp/corrections.tar.gz
rm -rf .next
npm run build
pm2 restart lasuitechic
pm2 logs lasuitechic --lines 20
```

### Étape 3: Commande unique (plus rapide)

Sur votre machine locale, créez un nouveau build et transférez:

```bash
# Build local
npm run build

# Créer archive complète
tar -czf deploy.tar.gz \
    --exclude=node_modules \
    --exclude=.git \
    --exclude=.env.local \
    .

# Transférer et déployer
scp deploy.tar.gz root@vps116857.serveur-vps.net:/tmp/

# Sur le VPS (commande unique)
ssh root@vps116857.serveur-vps.net << 'ENDSSH'
cd /var/www/lasuitechic
pm2 stop lasuitechic
tar -xzf /tmp/deploy.tar.gz
rm -rf /tmp/deploy.tar.gz
npm install --production=false
pm2 restart lasuitechic
pm2 logs lasuitechic --lines 30
ENDSSH
```

## 🔍 Diagnostiquer l'erreur au checkout

Si l'erreur persiste après le déploiement:

### 1. Vérifier les logs PM2

```bash
ssh root@vps116857.serveur-vps.net
pm2 logs lasuitechic --err --lines 50
```

Cherchez:
- Erreurs MongoDB: `MongoError`, `connection`, `ECONNREFUSED`
- Erreurs de validation: `ValidationError`
- Erreurs de stock: `variant`, `stock`

### 2. Tester l'API directement

```bash
# Test création de commande
curl -X POST http://localhost:3000/api/orders \
  -H "Content-Type: application/json" \
  -d '{
    "items": [{
      "productId": "69472eef85ada1136a3039b4",
      "name": "chaussure",
      "price": 16000,
      "size": "s",
      "color": "blanc",
      "quantity": 1,
      "image": "/api/images/test.jpg"
    }],
    "shippingAddress": {
      "fullName": "Test User",
      "phone": "0555123456",
      "address": "",
      "city": "",
      "wilaya": "Alger",
      "postalCode": ""
    },
    "subtotal": 16000,
    "shippingCost": 500,
    "total": 16500,
    "paymentMethod": "cash_on_delivery"
  }'
```

**Si erreur MongoDB**:
- Vérifiez MONGODB_URI dans .env.production
- Vérifiez que l'IP du VPS est dans la whitelist MongoDB Atlas

**Si erreur de stock**:
- Vérifiez que le produit existe
- Vérifiez que la variante (size + color) existe
- Vérifiez que le stock > 0

### 3. Vérifier MongoDB

```bash
# Test de connexion MongoDB
node -e "
const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.production' });
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✓ MongoDB OK'))
  .catch(err => console.log('✗ MongoDB Error:', err.message));
"
```

## 📋 Checklist de vérification

Après déploiement, vérifiez:

- [ ] Les logs PM2 ne montrent pas d'erreurs
- [ ] Le site charge correctement
- [ ] La page checkout s'affiche
- [ ] Les messages d'erreur sont plus détaillés
- [ ] L'API /api/orders répond
- [ ] MongoDB est accessible

## 🎯 Résolution du problème "Stock insuffisant"

Ce message peut apparaître dans 3 cas:

1. **Stock réellement insuffisant**: Normal, c'est la validation qui fonctionne
2. **Toast qui persiste**: Videz le cache du navigateur (Ctrl+Shift+R)
3. **Erreur de code**: Vérifiez les logs PM2

Pour tester:

```javascript
// Dans la console du navigateur
fetch('/api/products/chaussure')
  .then(r => r.json())
  .then(d => console.log('Variants:', d.variants));
```

Vérifiez que les variants ont du stock > 0.

## 📞 Si les problèmes persistent

Envoyez-moi:

1. **Logs d'erreur complets**:
   ```bash
   pm2 logs lasuitechic --err --lines 100 --nostream > error.log
   ```

2. **Résultat du test API orders**: Copie de la réponse du curl ci-dessus

3. **Capture d'écran**: Console du navigateur (F12 → Console) lors de l'erreur

4. **Variables d'environnement** (sans les secrets):
   ```bash
   cat .env.production | grep -v "MONGODB_URI"
   ```

---

**Les corrections sont maintenant prêtes à être déployées!**
