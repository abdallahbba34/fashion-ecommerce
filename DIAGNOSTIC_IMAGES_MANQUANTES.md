# 🔍 Diagnostic des images qui ne s'affichent pas

Guide pour identifier et corriger les images manquantes.

---

## 🎯 ÉTAPE 1 : Identifier les images manquantes

### Où les images ne s'affichent-elles pas ?

Cochez les endroits où les images sont manquantes :

- [ ] **Page d'accueil** - Images des produits dans la vitrine
- [ ] **Page produits** - Liste des produits
- [ ] **Page détails produit** - Image principale et miniatures
- [ ] **Panier** - Images des produits dans le panier
- [ ] **Admin** - Images dans la liste des produits
- [ ] **Checkout** - Images dans le récapitulatif
- [ ] **Logo** - Logo du site
- [ ] **Catégories** - Images des catégories

---

## 🔍 ÉTAPE 2 : Diagnostic rapide dans le navigateur

### 2.1 Ouvrir la Console

1. Sur la page où les images manquent
2. Appuyez sur **F12** (ou clic droit > "Inspecter")
3. Allez dans l'onglet **"Console"**

### 2.2 Cherchez les erreurs d'images

Vous verrez des erreurs comme :
```
GET http://lasuitechic.online/images/produit.jpg 404 (Not Found)
```

**Notez le chemin de l'image qui ne charge pas.**

### 2.3 Vérifier l'onglet Network

1. Allez dans l'onglet **"Network"** (Réseau)
2. Filtrez par **"Img"**
3. Rechargez la page (F5)
4. Les images en rouge = erreurs

---

## 🔧 SOLUTIONS SELON LE PROBLÈME

### Problème A : Images de produits spécifiques manquantes

**Cause :** Les fichiers images n'existent pas sur le serveur

**Solution :**

#### Dans WinSCP :
1. **GAUCHE** (PC) : `D:\ecom\public\images`
2. **DROITE** (Serveur) : `/var/www/lasuitechic/public/images`
3. Transférez toutes les images manquantes

#### Dans le terminal SSH :
```bash
cd /var/www/lasuitechic/public/images
ls -la
```

Vérifiez que vos images sont bien présentes.

---

### Problème B : Toutes les images de produits ne s'affichent pas

**Cause possible :** Problème avec les composants Image de Next.js

**Solution 1 : Vérifier les autres composants**

Certains composants utilisent aussi des images. Vérifiez :

#### 1. Panier (`app/cart/page.tsx`)

```bash
grep -n "Image" app/cart/page.tsx
```

Si vous voyez un composant `<Image>` sans `unoptimized`, il faut l'ajouter.

#### 2. Checkout (`app/checkout/page.tsx`)

```bash
grep -n "Image" app/checkout/page.tsx
```

#### 3. Admin produits (`app/admin/products/page.tsx`)

```bash
grep -n "Image" app/admin/products/page.tsx
```

**Solution 2 : Ajouter `unoptimized` partout**

Je vais créer un script pour trouver tous les `<Image>` sans `unoptimized`.

---

### Problème C : Images des catégories (Page d'accueil)

**Cause :** Images placeholder pour les catégories

**Solution :**

Les images des catégories dans `app/page.tsx` utilisent des placeholders :

```javascript
const featuredCategories = [
  {
    name: 'Femmes',
    image: '/images/women-collection.jpg',  // ← Cette image n'existe pas
    href: '/products?category=femmes',
  },
  // ...
];
```

**Option 1 : Ajouter les vraies images**

1. Ajoutez des images dans `public/images/` :
   - `women-collection.jpg`
   - `men-collection.jpg`
   - `accessories.jpg`

**Option 2 : Utiliser des dégradés (solution temporaire)**

Le code utilise déjà un dégradé si l'image n'existe pas (ligne 207 de `app/page.tsx`)

---

### Problème D : Logo du site

**Vérifier le logo dans le header**

```bash
grep -n "logo" components/layout/ClientHeader.tsx
```

Si un logo est défini mais ne s'affiche pas, vérifiez qu'il existe dans `public/images/`

---

## 🔍 ÉTAPE 3 : Vérifier tous les composants Image

Exécutez cette commande dans le terminal SSH pour trouver tous les `<Image>` :

```bash
cd /var/www/lasuitechic
grep -r "import.*Image.*from.*next/image" --include="*.tsx" --include="*.ts"
```

Ensuite, pour chaque fichier, vérifiez s'il a `unoptimized`.

---

## 📝 ÉTAPE 4 : Liste des fichiers à vérifier

Voici tous les fichiers qui utilisent des images :

### Fichiers déjà corrigés ✅
- `components/ProductCard.tsx` ✅
- `app/products/[slug]/page.tsx` ✅

### Fichiers à vérifier ⚠️

1. **app/cart/page.tsx** - Images dans le panier
2. **app/checkout/page.tsx** - Images dans le checkout
3. **app/order-confirmation/page.tsx** - Images dans la confirmation
4. **app/admin/products/page.tsx** - Images dans l'admin
5. **app/admin/products/[id]/page.tsx** - Edition produit admin
6. **app/admin/orders/[id]/page.tsx** - Détails commande admin
7. **app/page.tsx** - Page d'accueil (catégories)
8. **components/layout/ClientHeader.tsx** - Logo si présent

---

## 🚀 SOLUTION RAPIDE : Ajouter unoptimized partout

Je vais créer les fichiers corrigés pour vous.

---

## 🧪 TESTS

Après les corrections, vérifiez :

### Test 1 : Page d'accueil
```
http://lasuitechic.online
```
- [ ] Images des produits en vitrine
- [ ] Images des catégories (ou dégradés)

### Test 2 : Liste produits
```
http://lasuitechic.online/products
```
- [ ] Toutes les images de produits

### Test 3 : Détails produit
```
http://lasuitechic.online/products/un-produit
```
- [ ] Image principale
- [ ] Miniatures

### Test 4 : Panier
```
http://lasuitechic.online/cart
```
- [ ] Images des produits dans le panier

### Test 5 : Admin
```
http://lasuitechic.online/admin/products
```
- [ ] Images dans la liste admin

---

## 📞 Informations à me fournir

Pour vous aider plus précisément, dites-moi :

1. **Où les images ne s'affichent-elles pas ?**
   - Page d'accueil ?
   - Liste des produits ?
   - Détails produit ?
   - Panier ?
   - Admin ?

2. **Quel message d'erreur voyez-vous dans la Console (F12) ?**

3. **Est-ce que TOUTES les images manquent ou seulement certaines ?**

4. **Les images manquantes sont-elles :**
   - Des produits ?
   - Le logo ?
   - Les catégories ?
   - Autre ?

---

## 🔧 Script de diagnostic automatique

Copiez-collez dans le terminal SSH :

```bash
cd /var/www/lasuitechic

echo "=== DIAGNOSTIC IMAGES ==="
echo ""
echo "1. Fichiers utilisant Image de Next.js:"
grep -r "from 'next/image'" --include="*.tsx" | cut -d: -f1 | sort -u
echo ""
echo "2. Fichiers AVEC unoptimized:"
grep -r "unoptimized" --include="*.tsx" | cut -d: -f1 | sort -u
echo ""
echo "3. Images dans public/images:"
ls -lh public/images/*.{jpg,png,jpeg,webp,gif} 2>/dev/null | wc -l
echo ""
echo "4. Sous-dossiers dans public/images:"
ls -d public/images/*/ 2>/dev/null
```

**Envoyez-moi le résultat dans log.txt !**
