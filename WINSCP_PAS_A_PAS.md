# 🖼️ WinSCP - Guide Visuel Pas à Pas

## 🎯 Vue d'ensemble

```
┌─────────────────────────────────────────────────────────────┐
│                         WinSCP                               │
├──────────────────────┬──────────────────────────────────────┤
│   VOTRE PC (Gauche)  │    SERVEUR (Droite)                  │
│   D:\ecom            │    /var/www/lasuitechic              │
│                      │                                       │
│   📁 components      │    📁 components                      │
│   📁 app             │    📁 app                             │
│   📁 models          │    📁 models                          │
│   📄 .env.production │    📄 .env.production                 │
│                      │                                       │
│       ←────────────────→  Glisser-déposer                   │
└──────────────────────┴──────────────────────────────────────┘
```

## 📝 Étape 1 : Connexion

### 1.1 Ouvrir WinSCP

Double-cliquez sur l'icône **WinSCP** sur votre bureau.

### 1.2 Session enregistrée

Vous devriez voir votre session :

```
┌────────────────────────────────┐
│  Sessions enregistrées         │
├────────────────────────────────┤
│  📡 180.149.198.89 (lwsuser)   │ ← Sélectionner
└────────────────────────────────┘
```

### 1.3 Se connecter

1. Cliquez sur votre session
2. Cliquez sur **"Connexion"** / **"Login"**
3. Entrez votre mot de passe si demandé

✅ Vous êtes connecté !

---

## 📂 Étape 2 : Navigation

### 2.1 Interface WinSCP

```
┌────────────────────────────────────────────────────────────┐
│ WinSCP - lwsuser@180.149.198.89                            │
├──────────────────────┬─────────────────────────────────────┤
│  📁 Ordinateur Local │  📁 Serveur Distant                 │
│  (Votre PC)          │  (VPS)                              │
├──────────────────────┼─────────────────────────────────────┤
│  Chemin: ▼           │  Chemin: ▼                          │
│  D:\ecom             │  /var/www/lasuitechic               │
├──────────────────────┼─────────────────────────────────────┤
│                      │                                      │
│  📁 components       │  📁 components                       │
│  📁 app              │  📁 app                              │
│  📁 models           │  📁 models                           │
│  📁 types            │  📁 types                            │
│  📁 public           │  📁 public                           │
│  📄 package.json     │  📄 package.json                     │
│  📄 .env.production  │  📄 .env.production                  │
│                      │                                      │
└──────────────────────┴─────────────────────────────────────┘
```

### 2.2 Naviguer dans le panneau de GAUCHE

1. Cliquez sur la **barre d'adresse** en haut à gauche
2. Tapez : `D:\ecom`
3. Appuyez sur **Entrée**

✅ Vous êtes dans votre dossier local !

### 2.3 Naviguer dans le panneau de DROITE

1. Cliquez sur la **barre d'adresse** en haut à droite
2. Tapez : `/var/www/lasuitechic`
3. Appuyez sur **Entrée**

✅ Vous êtes dans le dossier du serveur !

---

## 💾 Étape 3 : Sauvegarde (IMPORTANT)

### 3.1 Ouvrir la console

Appuyez sur **Ctrl + T** pour ouvrir la console en bas.

```
┌────────────────────────────────────────────────┐
│ Console                                        │
├────────────────────────────────────────────────┤
│ $ _                                            │
│                                                │
└────────────────────────────────────────────────┘
```

### 3.2 Créer la sauvegarde

Tapez ces commandes une par une :

```bash
cd /var/www
sudo cp -r lasuitechic lasuitechic-backup-20250127
ls -lh
```

✅ Vous devriez voir `lasuitechic-backup-20250127` dans la liste.

---

## 📤 Étape 4 : Transférer les COMPOSANTS

### 4.1 Ouvrir le dossier components

**GAUCHE (votre PC) :**
1. Double-cliquez sur `📁 components`

**DROITE (serveur) :**
2. Double-cliquez sur `📁 components`

### 4.2 Transférer les nouveaux fichiers

Dans le panneau de **GAUCHE**, sélectionnez (Ctrl+Clic) :
- `YalidineParcelForm.tsx`
- `ShareButtons.tsx`
- `FacebookPixel.tsx`

**Méthode A : Glisser-déposer**
1. Maintenez le bouton gauche de la souris
2. Glissez vers le panneau de DROITE
3. Relâchez

**Méthode B : Bouton Upload**
1. Cliquez sur **F5** ou bouton **"Upload"**
2. Confirmez

```
Transfert en cours...
━━━━━━━━━━━━━━━━━━━ 100%
YalidineParcelForm.tsx ✅
ShareButtons.tsx ✅
FacebookPixel.tsx ✅
```

### 4.3 Transférer les fichiers modifiés

Sélectionnez :
- `ProductCard.tsx`

Glissez vers la droite ou appuyez sur F5.

Si demandé **"Overwrite?"** (Écraser ?) :
- Cliquez sur **"Yes"** ou **"Yes to All"**

### 4.4 Transférer les sous-dossiers

**Dossier layout/ :**
1. Dans GAUCHE, double-cliquez sur `📁 layout`
2. Dans DROITE, double-cliquez sur `📁 layout`
3. Transférez `ClientHeader.tsx`

**Dossier admin/ :**
1. Retournez au dossier `components`
2. Dans GAUCHE, double-cliquez sur `📁 admin`
3. Dans DROITE, double-cliquez sur `📁 admin`
4. Transférez `SourceStatistics.tsx`

---

## 📤 Étape 5 : Transférer les PAGES

### 5.1 Retour à la racine

Dans les deux panneaux, remontez à :
- GAUCHE : `D:\ecom`
- DROITE : `/var/www/lasuitechic`

### 5.2 Dossier app/

**GAUCHE :** Double-cliquez sur `📁 app`
**DROITE :** Double-cliquez sur `📁 app`

### 5.3 Transférer cart/page.tsx

1. GAUCHE : Double-cliquez sur `📁 cart`
2. DROITE : Double-cliquez sur `📁 cart`
3. Transférez `page.tsx`

### 5.4 Transférer checkout/page.tsx

1. Remontez au dossier `app`
2. GAUCHE : Double-cliquez sur `📁 checkout`
3. DROITE : Double-cliquez sur `📁 checkout`
4. Transférez `page.tsx`

### 5.5 Transférer admin/

1. Remontez au dossier `app`
2. GAUCHE : Double-cliquez sur `📁 admin`
3. DROITE : Double-cliquez sur `📁 admin`
4. Transférez `page.tsx`

5. Ensuite, allez dans `📁 orders`
6. Puis dans `📁 [id]`
7. Transférez `page.tsx`

### 5.6 Transférer API

Remontez au dossier `app`.

**API yalidine :**
1. GAUCHE : `app/api/yalidine/create-parcel/`
2. DROITE : `app/api/yalidine/create-parcel/`
3. Transférez `route.ts`

**API stats (NOUVEAU dossier) :**
1. GAUCHE : `app/api/`
2. DROITE : `app/api/`
3. Sélectionnez tout le dossier `📁 stats`
4. Glissez vers la droite

---

## 📤 Étape 6 : Transférer MODELS et TYPES

### 6.1 Retour à la racine

GAUCHE : `D:\ecom`
DROITE : `/var/www/lasuitechic`

### 6.2 Models

1. GAUCHE : Double-cliquez sur `📁 models`
2. DROITE : Double-cliquez sur `📁 models`
3. Transférez `Order.ts` (Confirmez l'écrasement)

### 6.3 Types

1. Remontez à la racine
2. GAUCHE : Double-cliquez sur `📁 types`
3. DROITE : Double-cliquez sur `📁 types`
4. Transférez `index.ts` (Confirmez l'écrasement)

---

## 📤 Étape 7 : Transférer .env.production

**TRÈS IMPORTANT !**

### 7.1 Retour à la racine

GAUCHE : `D:\ecom`
DROITE : `/var/www/lasuitechic`

### 7.2 Transférer le fichier

1. Dans GAUCHE, cherchez `.env.production`
2. Glissez-le vers le panneau de DROITE
3. **Confirmez l'écrasement** si demandé

```
⚠️ Overwrite confirmation
━━━━━━━━━━━━━━━━━━━━━━━━
Overwrite .env.production?

[Yes]  [Yes to All]  [No]  [Cancel]
```

Cliquez sur **"Yes"**.

---

## ✅ Étape 8 : Vérification

### 8.1 Vérifier les fichiers transférés

Dans le panneau de DROITE, vérifiez :

```
/var/www/lasuitechic/
├── components/
│   ├── YalidineParcelForm.tsx      ✅
│   ├── ShareButtons.tsx            ✅
│   ├── FacebookPixel.tsx           ✅
│   ├── ProductCard.tsx             ✅
│   ├── layout/
│   │   └── ClientHeader.tsx        ✅
│   └── admin/
│       └── SourceStatistics.tsx    ✅
├── app/
│   ├── cart/page.tsx               ✅
│   ├── checkout/page.tsx           ✅
│   ├── admin/
│   │   ├── page.tsx                ✅
│   │   └── orders/[id]/page.tsx    ✅
│   └── api/
│       ├── stats/                  ✅
│       └── yalidine/
│           └── create-parcel/
│               └── route.ts        ✅
├── models/
│   └── Order.ts                    ✅
├── types/
│   └── index.ts                    ✅
└── .env.production                 ✅
```

### 8.2 Compter les fichiers

Vous devriez avoir transféré **15 fichiers/dossiers**.

---

## 🔨 Étape 9 : Build sur le serveur

### 9.1 Ouvrir la console

Appuyez sur **Ctrl + T** (si la console est fermée).

### 9.2 Commandes à exécuter

Tapez ces commandes **UNE PAR UNE** :

```bash
# 1. Aller dans le dossier
cd /var/www/lasuitechic
```

```bash
# 2. Installer les dépendances
npm install
```

⏳ Attendez 1-2 minutes...

```bash
# 3. Build
npm run build
```

⏳ Attendez 2-5 minutes...

✅ Vous devriez voir : **"✓ Compiled successfully"**

```bash
# 4. Arrêter l'ancienne version
pm2 stop lasuitechic
pm2 delete lasuitechic
```

```bash
# 5. Démarrer la nouvelle version
pm2 start npm --name "lasuitechic" -- start -- -p 3000
```

```bash
# 6. Sauvegarder
pm2 save
```

```bash
# 7. Vérifier
pm2 status
```

Vous devriez voir :
```
┌────┬───────────────┬─────────┬──────┬────────┐
│ id │ name          │ mode    │ ↺    │ status │
├────┼───────────────┼─────────┼──────┼────────┤
│ 0  │ lasuitechic   │ fork    │ 0    │ online │ ✅
└────┴───────────────┴─────────┴──────┴────────┘
```

```bash
# 8. Voir les logs
pm2 logs lasuitechic --lines 20
```

✅ Cherchez : "Server started" et "Connected to MongoDB"

---

## 🌐 Étape 10 : Test dans le navigateur

### 10.1 Ouvrir le site

Dans votre navigateur, ouvrez :
- http://lasuitechic.online

### 10.2 Vérifier les icônes

**Navigation :**
```
FASHION
✨ Nouveautés  👥 Femmes  👶 Enfants  ⌚ Accessoires  🏷️ Soldes
```

✅ Les icônes sont visibles ?

**Panier :**
```
🛍️ Mon panier (0)
```

✅ L'icône du sac est visible ?

**Checkout :**

Allez sur un produit, ajoutez au panier, puis Checkout.

```
📦 Informations de livraison
👤 Nom et Prénom *
📞 Téléphone *
📍 Wilaya *
🏢 Stop Desktop *
❓ Comment nous avez-vous connu? *
  └─ 🌐 Site web
     📘 Facebook
     📸 Instagram
     💬 WhatsApp
```

✅ Toutes les icônes sont visibles ?

### 10.3 Tester le formulaire Yalidine

1. Allez sur http://lasuitechic.online/admin
2. Connectez-vous
3. Cliquez sur **"Commandes"**
4. Cliquez sur une commande
5. Cliquez sur **"Remettre au livreur Yalidine"**

```
┌─────────────────────────────────────┐
│  Créer un colis Yalidine         [X]│
├─────────────────────────────────────┤
│  Informations client                │
│  👤 Prénom *                        │
│  👤 Nom de famille *                │
│  📞 Téléphone *                     │
│  📍 Adresse *                       │
│                                     │
│  Localisation                       │
│  📍 Wilaya *                        │
│  📍 Commune *                       │
│                                     │
│  [Annuler]  [Créer le colis]       │
└─────────────────────────────────────┘
```

✅ Le formulaire s'affiche ?

### 10.4 Vérifier les statistiques

1. Dashboard Admin
2. Descendez

```
📊 Commandes par source
━━━━━━━━━━━━━━━━━━━━━
📘 Facebook    0 commandes  |  0 DZD
📸 Instagram   0 commandes  |  0 DZD
💬 WhatsApp    0 commandes  |  0 DZD
🌐 Site Web    X commandes  |  X DZD
```

✅ La section est visible ?

---

## 🎉 TOUT FONCTIONNE ?

### ✅ Si OUI :

**FÉLICITATIONS ! 🎊**

Votre site est déployé avec :
- ✨ Icônes intuitives partout
- 📦 Formulaire Yalidine complet
- 📊 Tracking Facebook/Instagram/WhatsApp

### Prochaines étapes :

1. Créer votre Page Facebook Business
2. Lire `GUIDE_DEMARRAGE_FACEBOOK.md`
3. Publier votre premier produit

---

### ❌ Si NON :

#### Problème : Icônes ne s'affichent pas

1. Appuyez sur **Ctrl+Shift+R** dans le navigateur (vider le cache)
2. Dans WinSCP, vérifiez que les fichiers sont bien transférés
3. Dans la console :
   ```bash
   cd /var/www/lasuitechic
   npm run build
   pm2 restart lasuitechic
   ```

#### Problème : Page blanche

Console :
```bash
pm2 logs lasuitechic --lines 50
```

Cherchez les erreurs en rouge.

#### Problème : "Cannot connect"

Vérifiez .env.production :
```bash
cat /var/www/lasuitechic/.env.production
```

---

## 📞 Aide rapide

| Problème | Solution |
|----------|----------|
| Fichier non trouvé | Vérifiez le chemin dans WinSCP |
| Permission denied | `sudo chown -R lwsuser:lwsuser /var/www/lasuitechic` |
| Build échoue | `npm install` puis `npm run build` |
| Page blanche | `pm2 logs lasuitechic` |
| Cache | Ctrl+Shift+R |

---

## 🎯 Résumé

✅ **Vous avez transféré :** 15 fichiers
✅ **Temps total :** ~20 minutes
✅ **Résultat :** Site amélioré et prêt !

**Bon succès ! 🚀**
