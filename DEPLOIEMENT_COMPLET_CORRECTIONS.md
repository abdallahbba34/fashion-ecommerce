# 🚀 Déploiement Complet - Corrections Images + Facebook + Yalidine

Guide pour déployer toutes les corrections manquantes.

---

## 📋 Problèmes identifiés

1. ❌ **Certaines images ne s'affichent pas**
2. ❌ **Modifications Facebook non déployées**
3. ❌ **Modifications Yalidine non déployées**

---

## ✅ SOLUTION COMPLÈTE : Transfert avec WinSCP

### 🎯 ÉTAPE 1 : Préparer le transfert

Ouvrez **WinSCP** et connectez-vous au serveur.

**GAUCHE (PC)** : `D:\ecom`
**DROITE (Serveur)** : `/var/www/lasuitechic`

---

### 📦 ÉTAPE 2 : Transférer TOUS les fichiers corrigés

#### A. Composants corrigés (Images)

Glissez-déposez ces fichiers :

**Dossier : `components/`**
1. ✅ `ProductCard.tsx` (déjà fait)
2. ✅ `FacebookPixel.tsx` ⭐ NOUVEAU
3. ✅ `YalidineParcelForm.tsx` ⭐ NOUVEAU

**Vérifiez que ces 3 fichiers sont bien transférés dans** `/var/www/lasuitechic/components/`

#### B. Pages corrigées

**Dossier : `app/`**
1. ✅ `app/products/[slug]/page.tsx` (déjà fait)
2. ✅ `app/cart/page.tsx` - Images dans le panier
3. ✅ `app/checkout/page.tsx` - Images + Facebook tracking
4. ✅ `app/admin/orders/[id]/page.tsx` - Yalidine form
5. ✅ `app/page.tsx` - Facebook Pixel

**Transférez ces 5 fichiers**

#### C. Routes API

**Dossier : `app/api/`**

Transférez ces dossiers COMPLETS :
- `app/api/stats/` → `/var/www/lasuitechic/app/api/stats/`
- `app/api/stats/by-source/` → `/var/www/lasuitechic/app/api/stats/by-source/`

#### D. Bibliothèques (Lib)

**Dossier : `lib/`**
- `lib/yalidine-stop-desks.ts` ⭐ NOUVEAU
- `lib/yalidine-wilayas.ts` ⭐ NOUVEAU

**Transférez ces 2 fichiers**

#### E. Types

**Dossier : `types/`**
- `types/index.ts` (contient OrderSource)

**Transférez ce fichier**

#### F. Images (si manquantes)

**Dossier : `public/images/`**

Transférez **TOUTES** les images de votre dossier `D:\ecom\public\images\` vers `/var/www/lasuitechic/public/images/`

**Conseil :** Sélectionnez tout le contenu de `public/images/` et glissez-déposez.

---

### 🔧 ÉTAPE 3 : Vérifier les fichiers transférés

Dans le **terminal SSH**, vérifiez :

```bash
cd /var/www/lasuitechic

# Vérifier les composants
ls -la components/ | grep -E "FacebookPixel|YalidineParcelForm"

# Vérifier les lib
ls -la lib/ | grep yalidine

# Vérifier les API stats
ls -la app/api/stats/
ls -la app/api/stats/by-source/

# Vérifier les images
ls -la public/images/ | wc -l
```

**Résultat attendu :**
- FacebookPixel.tsx présent
- YalidineParcelForm.tsx présent
- yalidine-stop-desks.ts présent
- yalidine-wilayas.ts présent
- Dossiers stats/ présents
- Plusieurs images (>10)

---

### 🏗️ ÉTAPE 4 : Rebuild et redémarrer

Dans le **terminal SSH** :

```bash
cd /var/www/lasuitechic

# Rebuild l'application
npm run build

# Redémarrer PM2
pm2 restart lasuitechic

# Vérifier les logs
pm2 logs lasuitechic --lines 30
```

**Attendez 1-2 minutes** pour que le build se termine.

---

### ✅ ÉTAPE 5 : Vérifications finales

#### Test 1 : Facebook Pixel

Ouvrez la **Console du navigateur (F12)** sur votre site.

Tapez :
```javascript
window.fbq
```

**Si vous voyez une fonction** = Facebook Pixel chargé ✅

#### Test 2 : Yalidine Form

1. Allez dans **Admin > Commandes**
2. Cliquez sur une commande
3. Cherchez le bouton **"Remettre au livreur Yalidine"**
4. Cliquez dessus
5. **Un formulaire modal devrait s'ouvrir** ✅

#### Test 3 : Images

1. Allez sur **http://lasuitechic.online**
2. **Toutes les images de produits devraient s'afficher** ✅
3. Vérifiez aussi :
   - Page produits
   - Détails produit
   - Panier
   - Admin

#### Test 4 : Stats par source

1. Allez dans **Admin > Dashboard**
2. Cherchez la section **"Commandes par source"**
3. Vous devriez voir des statistiques par canal (Facebook, Instagram, etc.) ✅

---

## 📝 LISTE COMPLÈTE DES FICHIERS À TRANSFÉRER

Cochez au fur et à mesure :

### Composants
- [ ] `components/ProductCard.tsx`
- [ ] `components/FacebookPixel.tsx`
- [ ] `components/YalidineParcelForm.tsx`

### Pages App
- [ ] `app/page.tsx`
- [ ] `app/products/[slug]/page.tsx`
- [ ] `app/cart/page.tsx`
- [ ] `app/checkout/page.tsx`
- [ ] `app/admin/orders/[id]/page.tsx`

### API Routes
- [ ] `app/api/stats/route.ts`
- [ ] `app/api/stats/by-source/route.ts`

### Lib
- [ ] `lib/yalidine-stop-desks.ts`
- [ ] `lib/yalidine-wilayas.ts`

### Types
- [ ] `types/index.ts`

### Images
- [ ] Tout le dossier `public/images/`

### Configuration
- [ ] `next.config.mjs` (déjà fait)

---

## 🔍 DIAGNOSTIC - Si ça ne fonctionne pas

### Problème : "Module not found"

```bash
cd /var/www/lasuitechic
npm install
npm run build
pm2 restart lasuitechic
```

### Problème : Images toujours manquantes

Vérifiez les permissions :
```bash
cd /var/www/lasuitechic
sudo chown -R root:root public/images/
sudo chmod -R 755 public/images/
```

### Problème : Erreur au build

Voir les logs :
```bash
pm2 logs lasuitechic --lines 50
```

---

## 🚀 MÉTHODE ALTERNATIVE : Transfert complet

Si vous avez des doutes, transférez TOUT :

### Dans WinSCP :

**Sélectionnez ces dossiers COMPLETS :**
- `app/` (tout)
- `components/` (tout)
- `lib/` (tout)
- `types/` (tout)
- `public/` (tout)

**Glissez-déposez vers le serveur**

⚠️ **Remplacez tout quand demandé**

**Puis dans le terminal SSH :**
```bash
cd /var/www/lasuitechic
npm install
npm run build
pm2 restart lasuitechic
```

---

## ✅ VÉRIFICATION COMPLÈTE

### Checklist de validation :

- [ ] Site accessible : http://lasuitechic.online
- [ ] Toutes les images s'affichent
- [ ] Facebook Pixel chargé (F12 > Console > `window.fbq`)
- [ ] Yalidine form accessible dans Admin
- [ ] Stats par source visibles dans Dashboard
- [ ] Panier affiche les images
- [ ] Checkout affiche les images
- [ ] Admin produits affiche les images
- [ ] PM2 status = online
- [ ] Pas d'erreurs dans `pm2 logs`

---

## 💡 ASTUCE : Éviter les oublis

Pour être sûr de tout transférer, utilisez cette méthode :

1. **Dans WinSCP** :
   - GAUCHE : Sélectionnez `D:\ecom`
   - DROITE : Ouvrez `/var/www/lasuitechic`

2. **Clic droit sur le dossier ecom (à gauche)**
   - Choisir **"Synchroniser"**
   - Options :
     - Direction : **Local → Remote**
     - Mode : **Synchroniser les fichiers**
     - Exclure : `node_modules, .git, .next`
   - Cliquez **"OK"**

3. WinSCP compare et transfère **seulement les fichiers modifiés** ✅

---

## 📞 Après le transfert

**Copiez ce diagnostic dans le terminal SSH et envoyez-moi le résultat :**

```bash
cd /var/www/lasuitechic

echo "=== DIAGNOSTIC POST-DEPLOIEMENT ==="
echo ""
echo "1. Fichiers Facebook/Yalidine:"
ls -la components/ | grep -E "Facebook|Yalidine"
ls -la lib/ | grep yalidine
echo ""
echo "2. API Stats:"
ls -la app/api/stats/ 2>/dev/null && echo "✅ Stats OK" || echo "❌ Stats manquant"
echo ""
echo "3. Images:"
ls public/images/*.{jpg,jpeg,png} 2>/dev/null | wc -l
echo ""
echo "4. PM2 Status:"
pm2 list
echo ""
echo "5. Logs récents:"
pm2 logs lasuitechic --lines 10 --nostream
```

**Mettez le résultat dans log.txt !**

---

**Bon courage ! 🚀**
