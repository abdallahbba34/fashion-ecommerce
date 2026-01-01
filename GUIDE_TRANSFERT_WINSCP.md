# 📤 Guide de Transfert WinSCP - Étape par Étape

## 📋 Informations importantes

**Chemin sur le VPS :** `/var/www/lasuitechic`

## 🎯 Fichiers à transférer

### ✅ Fichiers MODIFIÉS (à transférer obligatoirement)

#### Composants
- `components/layout/ClientHeader.tsx` - Navigation avec icônes
- `components/ProductCard.tsx` - Produits avec icônes
- `components/YalidineParcelForm.tsx` - **NOUVEAU** Formulaire Yalidine
- `components/ShareButtons.tsx` - **NOUVEAU** Partage social
- `components/FacebookPixel.tsx` - **NOUVEAU** Facebook Pixel
- `components/admin/SourceStatistics.tsx` - **NOUVEAU** Stats par source

#### Pages
- `app/cart/page.tsx` - Panier avec icônes
- `app/checkout/page.tsx` - Checkout avec icônes
- `app/admin/page.tsx` - Dashboard avec stats
- `app/admin/orders/[id]/page.tsx` - Modal Yalidine

#### API
- `app/api/yalidine/create-parcel/route.ts` - Support formulaire
- `app/api/stats/by-source/route.ts` - **NOUVEAU** Stats API

#### Modèles et Types
- `models/Order.ts` - Champs source/referralInfo
- `types/index.ts` - Type OrderSource

#### Configuration
- `.env.production` - Variables d'environnement
- `package.json` - Dépendances (si changées)

### ❌ Fichiers à NE PAS transférer

- `node_modules/` - Sera installé sur le serveur
- `.git/` - Pas nécessaire
- `.next/` - Sera rebuild sur le serveur
- `.env.local` - Uniquement local
- `public/uploads/*` - Photos déjà sur le serveur

## 📝 Étape 1 : Préparer les fichiers localement

### 1.1 Build local pour vérifier
```bash
cd D:\ecom
npm run build
```

✅ Si le build réussit, continuez.

## 🔌 Étape 2 : Se connecter avec WinSCP

### 2.1 Ouvrir WinSCP

1. Lancez **WinSCP**
2. Vous devriez voir votre session déjà configurée

### 2.2 Vérifier les paramètres de connexion

Vérifiez que vous avez :
- **Protocole :** SFTP ou SCP
- **Hôte :** 180.149.198.89
- **Port :** 22
- **Nom d'utilisateur :** lwsuser
- **Mot de passe :** [votre mot de passe]

### 2.3 Se connecter

1. Cliquez sur **"Connexion"** ou **"Login"**
2. Entrez le mot de passe si demandé
3. Acceptez la clé du serveur si c'est la première connexion

### 2.4 Naviguer vers le bon dossier

Une fois connecté :

**Panneau de GAUCHE (votre PC) :**
- Naviguez vers : `D:\ecom`

**Panneau de DROITE (le serveur) :**
- Naviguez vers : `/var/www/lasuitechic`

```
Gauche (PC)              Droite (Serveur)
D:\ecom            →     /var/www/lasuitechic
```

## 💾 Étape 3 : Créer une sauvegarde

**IMPORTANT :** Avant tout transfert, faites une sauvegarde !

### Option A : Via WinSCP (Console)

1. Dans WinSCP, appuyez sur **Ctrl+T** pour ouvrir la console
2. Tapez :
```bash
cd /var/www
cp -r lasuitechic lasuitechic-backup-20250127
ls -lh
```

### Option B : Via SSH séparé

Ouvrez un terminal SSH et tapez :
```bash
ssh lwsuser@180.149.198.89
cd /var/www
sudo cp -r lasuitechic lasuitechic-backup-20250127
ls -lh
```

✅ Vous devriez voir le dossier `lasuitechic-backup-20250127` créé.

## 📤 Étape 4 : Transférer les fichiers

### Méthode recommandée : Transférer UNIQUEMENT les fichiers modifiés

#### 4.1 Transférer les COMPOSANTS

**Sur votre PC (panneau gauche) :**
1. Naviguez vers `D:\ecom\components`

**Sur le serveur (panneau droit) :**
2. Naviguez vers `/var/www/lasuitechic/components`

**Transfert :**
3. Sélectionnez dans le panneau GAUCHE :
   - `YalidineParcelForm.tsx` (nouveau)
   - `ShareButtons.tsx` (nouveau)
   - `FacebookPixel.tsx` (nouveau)
   - `ProductCard.tsx` (modifié)
   - Dossier `layout/` (pour ClientHeader.tsx)
   - Dossier `admin/` (pour SourceStatistics.tsx)

4. **Glissez-déposez** ou cliquez sur **"Upload"** (F5)

5. Si demandé "Overwrite?", choisissez **"Yes"** ou **"Yes to All"**

#### 4.2 Transférer les PAGES APP

**PC :** `D:\ecom\app`
**Serveur :** `/var/www/lasuitechic/app`

Transférez ces dossiers/fichiers :
- `cart/page.tsx`
- `checkout/page.tsx`
- `admin/page.tsx`
- `admin/orders/[id]/page.tsx`
- `api/yalidine/create-parcel/route.ts`
- `api/stats/` (tout le dossier - nouveau)

#### 4.3 Transférer MODELS et TYPES

**PC :** `D:\ecom\models`
**Serveur :** `/var/www/lasuitechic/models`

Transférez :
- `Order.ts`

**PC :** `D:\ecom\types`
**Serveur :** `/var/www/lasuitechic/types`

Transférez :
- `index.ts`

#### 4.4 Transférer .env.production

**TRÈS IMPORTANT !**

**PC :** `D:\ecom\.env.production`
**Serveur :** `/var/www/lasuitechic/.env.production`

1. Sélectionnez `.env.production` dans le panneau gauche
2. Glissez vers le panneau droit
3. Confirmez l'écrasement si demandé

## 🔍 Étape 5 : Vérifier le transfert

Dans WinSCP, vérifiez que les fichiers sont bien sur le serveur :

```
/var/www/lasuitechic/
├── components/
│   ├── YalidineParcelForm.tsx      ← NOUVEAU
│   ├── ShareButtons.tsx            ← NOUVEAU
│   ├── FacebookPixel.tsx           ← NOUVEAU
│   ├── ProductCard.tsx             ← MODIFIÉ
│   ├── layout/
│   │   └── ClientHeader.tsx        ← MODIFIÉ
│   └── admin/
│       └── SourceStatistics.tsx    ← NOUVEAU
├── app/
│   ├── cart/page.tsx               ← MODIFIÉ
│   ├── checkout/page.tsx           ← MODIFIÉ
│   ├── admin/page.tsx              ← MODIFIÉ
│   ├── admin/orders/[id]/page.tsx  ← MODIFIÉ
│   └── api/
│       ├── stats/
│       │   └── by-source/
│       │       └── route.ts        ← NOUVEAU
│       └── yalidine/
│           └── create-parcel/
│               └── route.ts        ← MODIFIÉ
├── models/
│   └── Order.ts                    ← MODIFIÉ
├── types/
│   └── index.ts                    ← MODIFIÉ
└── .env.production                 ← MODIFIÉ
```

## 🔨 Étape 6 : Build sur le serveur

### 6.1 Ouvrir un terminal SSH

**Option A : Console WinSCP**
- Dans WinSCP, appuyez sur **Ctrl+T**

**Option B : Terminal séparé (PuTTY, Git Bash)**
```bash
ssh lwsuser@180.149.198.89
```

### 6.2 Naviguer vers le site
```bash
cd /var/www/lasuitechic
```

### 6.3 Installer les dépendances
```bash
npm install
```

Cela prendra 1-2 minutes.

### 6.4 Build l'application
```bash
npm run build
```

⏳ Attendez 2-5 minutes que le build se termine.

✅ Vous devriez voir : **"Compiled successfully"**

### 6.5 Redémarrer l'application

```bash
# Arrêter l'ancienne version
pm2 stop lasuitechic

# Supprimer de PM2
pm2 delete lasuitechic

# Démarrer la nouvelle version
pm2 start npm --name "lasuitechic" -- start -- -p 3000

# Sauvegarder la config PM2
pm2 save

# Vérifier le statut
pm2 status
```

Vous devriez voir :
```
┌────┬───────────────┬─────────┬─────────┬────────┐
│ id │ name          │ mode    │ ↺      │ status │
├────┼───────────────┼─────────┼─────────┼────────┤
│ 0  │ lasuitechic   │ fork    │ 0      │ online │
└────┴───────────────┴─────────┴─────────┴────────┘
```

### 6.6 Vérifier les logs
```bash
pm2 logs lasuitechic --lines 20
```

✅ Cherchez : "Server started" et "Connected to MongoDB"

## ✅ Étape 7 : Vérifications

### 7.1 Vérifier que le site fonctionne

Dans votre navigateur :
- http://lasuitechic.online
- http://180.149.198.89:3000

### 7.2 Vérifier les icônes

1. **Navigation** - Les icônes doivent être visibles :
   - ✨ Nouveautés
   - 👥 Femmes
   - 👶 Enfants

2. **Panier** - Icônes visibles :
   - ➖➕ Boutons +/-
   - 🛍️ Titre

3. **Checkout** - Icônes visibles :
   - 👤 Nom
   - 📞 Téléphone
   - 📍 Wilaya

### 7.3 Tester le formulaire Yalidine

1. Connectez-vous à l'admin : http://lasuitechic.online/admin
2. Allez dans **Commandes**
3. Cliquez sur une commande
4. Cliquez sur **"Remettre au livreur Yalidine"**
5. ✅ Le formulaire modal doit s'afficher avec tous les champs

### 7.4 Vérifier les statistiques

1. Dashboard Admin
2. Descendez jusqu'à **"Commandes par source"**
3. ✅ Vous devriez voir les statistiques avec icônes colorées

### 7.5 Tester le tracking Facebook

1. Créez un lien : `http://lasuitechic.online/products?source=facebook`
2. Ouvrez ce lien
3. Allez au checkout
4. ✅ "Comment nous avez-vous connu?" doit afficher **Facebook** pré-sélectionné

## 🐛 Résolution de problèmes

### Problème : "Cannot connect to MongoDB"

**Solution :**
```bash
cd /var/www/lasuitechic
cat .env.production
```

Vérifiez que `MONGODB_URI` est correct.

### Problème : Page blanche

**Solution :**
```bash
pm2 logs lasuitechic --lines 50
```

Cherchez les erreurs. Souvent :
- Rebuild nécessaire : `npm run build && pm2 restart lasuitechic`
- Permissions : `sudo chown -R lwsuser:lwsuser /var/www/lasuitechic`

### Problème : Icônes ne s'affichent pas

**Solution :**
1. Clearez le cache du navigateur (Ctrl+Shift+R)
2. Vérifiez que les fichiers sont bien transférés :
   ```bash
   ls -la /var/www/lasuitechic/components/
   ```

### Problème : Formulaire Yalidine ne s'ouvre pas

**Solution :**
1. Vérifiez que le fichier existe :
   ```bash
   ls -la /var/www/lasuitechic/components/YalidineParcelForm.tsx
   ```
2. Vérifiez les logs :
   ```bash
   pm2 logs lasuitechic
   ```
3. Rebuild :
   ```bash
   cd /var/www/lasuitechic
   npm run build
   pm2 restart lasuitechic
   ```

## 📊 Récapitulatif du transfert

### Fichiers transférés

| Type | Nombre | Statut |
|------|--------|--------|
| Composants nouveaux | 3 | ✅ |
| Composants modifiés | 3 | ✅ |
| Pages modifiées | 4 | ✅ |
| API nouvelles | 1 | ✅ |
| API modifiées | 1 | ✅ |
| Modèles | 1 | ✅ |
| Types | 1 | ✅ |
| Config | 1 | ✅ |
| **TOTAL** | **15** | **✅** |

## ✨ Ce qui est maintenant disponible

### Pour les clients
- ✅ Navigation avec icônes intuitives
- ✅ Formulaire checkout avec icônes
- ✅ Panier amélioré avec icônes
- ✅ Produits avec indicateurs visuels

### Pour vous (Admin)
- ✅ Formulaire Yalidine complet
- ✅ Statistiques par source (Facebook, Instagram, etc.)
- ✅ Tracking automatique des commandes

### Pour le marketing
- ✅ Liens trackables Facebook/Instagram
- ✅ Analyse des performances par canal
- ✅ Facebook Pixel (optionnel)

## 🎯 Prochaines étapes

1. ✅ Tout tester manuellement
2. 📱 Créer votre Page Facebook
3. 📝 Première publication avec lien tracké
4. 📊 Surveiller les statistiques

## 📞 Aide rapide

### Commandes utiles

**Voir les logs :**
```bash
pm2 logs lasuitechic
```

**Redémarrer :**
```bash
pm2 restart lasuitechic
```

**Rebuild :**
```bash
cd /var/www/lasuitechic
npm run build
pm2 restart lasuitechic
```

**Vérifier les permissions :**
```bash
sudo chown -R lwsuser:lwsuser /var/www/lasuitechic
```

## 🎉 Félicitations !

Si tout fonctionne, votre site est maintenant déployé avec :
- ✅ Icônes intuitives partout
- ✅ Formulaire Yalidine professionnel
- ✅ Tracking Facebook complet
- ✅ Interface accessible à tous

**Bon succès avec votre boutique ! 🚀**
