# ✅ Checklist de Transfert WinSCP

## 📋 À faire dans l'ordre

### Avant de commencer
- [ ] WinSCP ouvert et connecté
- [ ] Panneau GAUCHE : `D:\ecom`
- [ ] Panneau DROITE : `/var/www/lasuitechic`
- [ ] Sauvegarde créée sur le serveur

---

## 📁 COMPOSANTS à transférer

### Dossier : `components/`

#### Nouveaux fichiers (glisser-déposer)
- [ ] `YalidineParcelForm.tsx` ⭐ NOUVEAU
- [ ] `ShareButtons.tsx` ⭐ NOUVEAU
- [ ] `FacebookPixel.tsx` ⭐ NOUVEAU

#### Fichiers modifiés
- [ ] `ProductCard.tsx` ✏️ MODIFIÉ

#### Sous-dossiers
- [ ] `layout/ClientHeader.tsx` ✏️ MODIFIÉ
- [ ] `admin/SourceStatistics.tsx` ⭐ NOUVEAU

---

## 📁 PAGES APP à transférer

### Dossier : `app/`

#### Pages principales
- [ ] `cart/page.tsx` ✏️ MODIFIÉ
- [ ] `checkout/page.tsx` ✏️ MODIFIÉ

#### Pages admin
- [ ] `admin/page.tsx` ✏️ MODIFIÉ
- [ ] `admin/orders/[id]/page.tsx` ✏️ MODIFIÉ

#### API
- [ ] `api/yalidine/create-parcel/route.ts` ✏️ MODIFIÉ
- [ ] `api/stats/by-source/route.ts` ⭐ NOUVEAU (tout le dossier `stats/`)

---

## 📁 MODÈLES ET TYPES à transférer

### Dossier : `models/`
- [ ] `Order.ts` ✏️ MODIFIÉ

### Dossier : `types/`
- [ ] `index.ts` ✏️ MODIFIÉ

---

## 📁 CONFIGURATION à transférer

### Racine du projet
- [ ] `.env.production` ⚠️ TRÈS IMPORTANT

---

## 🔨 APRÈS LE TRANSFERT

### Sur le serveur (SSH ou Console WinSCP)

```bash
# 1. Aller dans le dossier
cd /var/www/lasuitechic

# 2. Installer les dépendances
npm install

# 3. Build
npm run build

# 4. Redémarrer
pm2 stop lasuitechic
pm2 delete lasuitechic
pm2 start npm --name "lasuitechic" -- start -- -p 3000
pm2 save

# 5. Vérifier
pm2 logs lasuitechic --lines 20
```

#### Cochez quand fait :
- [ ] `npm install` terminé
- [ ] `npm run build` réussi
- [ ] PM2 redémarré
- [ ] Logs OK (pas d'erreurs)

---

## ✅ VÉRIFICATIONS FINALES

### Dans le navigateur

#### Site accessible
- [ ] http://lasuitechic.online fonctionne
- [ ] http://180.149.198.89:3000 fonctionne

#### Icônes visibles
- [ ] Navigation (✨👥👶⌚🏷️)
- [ ] Checkout (👤📞📍🏢)
- [ ] Panier (🛍️➖➕)
- [ ] Produits (🏷️✅❌)

#### Fonctionnalités
- [ ] Se connecter à l'admin
- [ ] Ouvrir une commande
- [ ] Cliquer "Remettre au livreur Yalidine"
- [ ] **Le formulaire modal s'affiche** ✅

#### Statistiques
- [ ] Dashboard Admin
- [ ] Section "Commandes par source" visible
- [ ] Icônes colorées (📘📸💬🌐)

#### Tracking Facebook
- [ ] Lien test : `http://lasuitechic.online/products?source=facebook`
- [ ] Aller au checkout
- [ ] "Facebook" pré-sélectionné dans le champ source

---

## 🎉 TOUT EST OK ?

Si toutes les cases sont cochées :

### ✅ Déploiement réussi !

Votre site a maintenant :
- ✨ Icônes intuitives partout
- 📦 Formulaire Yalidine complet
- 📊 Tracking Facebook/Instagram/WhatsApp
- 🎯 Interface accessible pour tous

### 🚀 Prochaines étapes

1. Créer votre Page Facebook Business
2. Publier votre premier produit avec lien tracké
3. Consulter `GUIDE_DEMARRAGE_FACEBOOK.md`

---

## 🐛 Problème ?

Si quelque chose ne fonctionne pas :

1. **Logs** : `pm2 logs lasuitechic --lines 50`
2. **Rebuild** : `npm run build && pm2 restart lasuitechic`
3. **Cache** : Ctrl+Shift+R dans le navigateur
4. **Permissions** : `sudo chown -R lwsuser:lwsuser /var/www/lasuitechic`

---

## 📊 Résumé

**Fichiers à transférer :** 15
- ⭐ Nouveaux : 4
- ✏️ Modifiés : 10
- ⚠️ Config : 1

**Temps estimé :**
- Transfert : 5-10 min
- Build : 2-5 min
- Vérifications : 5 min
- **TOTAL : ~20 min**

**Bon courage ! 💪**
