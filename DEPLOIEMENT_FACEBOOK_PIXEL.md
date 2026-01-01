# 📱 DÉPLOIEMENT FACEBOOK PIXEL SUR LE VPS

## ✅ CODE PRÉPARÉ ET COMMITTÉ

Le code Facebook Pixel a été :
- ✅ Commit créé : `f0b10dd`
- ✅ Poussé vers GitHub : `https://github.com/abdallahbba34/fashion-ecommerce.git`
- ✅ Prêt à déployer

---

## 🚀 COMMANDES À EXÉCUTER SUR LE VPS

### MÉTHODE 1 : Commande unique (Recommandée)

Connectez-vous à votre VPS et copiez-collez cette commande :

```bash
cd /var/www/lasuitechic && \
git pull origin main && \
npm install && \
npm run build && \
pm2 restart ecom
```

---

### MÉTHODE 2 : Étape par étape

Si la méthode 1 ne fonctionne pas, suivez ces étapes :

#### Étape 1 : Se connecter au VPS
```bash
ssh root@vps116857.serveur-vps.net
```
OU
```bash
ssh lwsuser@180.149.198.89
```

#### Étape 2 : Aller dans le répertoire
```bash
cd /var/www/lasuitechic
```

#### Étape 3 : Récupérer les dernières modifications
```bash
git pull origin main
```

#### Étape 4 : Installer les dépendances
```bash
npm install
```

#### Étape 5 : Builder l'application
```bash
npm run build
```

#### Étape 6 : Redémarrer le serveur
```bash
pm2 restart ecom
```

---

## 🔍 VÉRIFICATION

### 1. Vérifier que le serveur fonctionne
```bash
pm2 status
```

### 2. Vérifier les logs
```bash
pm2 logs ecom --lines 50
```

### 3. Tester le site
Ouvrez dans votre navigateur :
```
http://lasuitechic.online
```
JE N'ARRIVE PAS A EXECUTER LE Pixel FACEBOOK
### 4. Vérifier le Pixel Facebook
1. Installez l'extension Chrome : **Meta Pixel Helper**
2. Visitez votre site : `http://lasuitechic.online`
3. Cliquez sur l'extension - vous devriez voir le Pixel ID : `4656400744579514`

---

## 📊 ÉVÉNEMENTS TRACKÉS

Une fois déployé, le Facebook Pixel trackera automatiquement :

| Événement | Quand | Page |
|-----------|-------|------|
| **PageView** | À chaque page visitée | Toutes les pages |
| **ViewContent** | Consultation d'un produit | `/products/[slug]` |
| **AddToCart** | Ajout au panier | `/products/[slug]` |
| **InitiateCheckout** | Page de commande | `/checkout` |
| **Purchase** | Commande confirmée | `/checkout` → `/order-confirmation` |

---

## 🎯 VÉRIFICATION DANS FACEBOOK

1. Allez sur : https://business.facebook.com/events_manager/
2. Sélectionnez votre Pixel : **4656400744579514**
3. Attendez **15-30 minutes** après le déploiement
4. Vous devriez voir les événements apparaître dans la section "Overview"

---

## ⚠️ EN CAS D'ERREUR

### Erreur : "git pull failed"
```bash
# Vérifier l'état du repo
git status

# Si des fichiers sont modifiés, les stash
git stash

# Puis pull
git pull origin main
```

### Erreur : "npm run build failed"
```bash
# Nettoyer le cache
rm -rf .next
rm -rf node_modules
npm install
npm run build
```

### Erreur : "pm2 restart failed"
```bash
# Voir les processus PM2
pm2 list

# Si "ecom" n'existe pas, le démarrer
pm2 start npm --name "ecom" -- start

# Si ça ne marche pas
pm2 delete ecom
pm2 start npm --name "ecom" -- start
pm2 save
```

---

## 📝 FICHIERS MODIFIÉS

Les fichiers suivants ont été mis à jour pour le Facebook Pixel :

1. **.env.production** - Ajout du Pixel ID
2. **components/FacebookPixel.tsx** - Nouveau composant
3. **app/products/[slug]/page.tsx** - Tracking ViewContent + AddToCart
4. **app/checkout/page.tsx** - Tracking InitiateCheckout + Purchase

---

## ✅ CHECKLIST FINALE

- [ ] Connexion SSH au VPS réussie
- [ ] Code mis à jour avec `git pull`
- [ ] Dépendances installées
- [ ] Build réussi
- [ ] Serveur redémarré
- [ ] Site accessible sur http://lasuitechic.online
- [ ] Extension Meta Pixel Helper détecte le Pixel
- [ ] Événements visibles dans Facebook Events Manager (après 15-30 min)

---

## 🆘 BESOIN D'AIDE ?

Si vous rencontrez des problèmes :
1. Partagez les logs : `pm2 logs ecom --lines 100`
2. Vérifiez l'état : `pm2 status`
3. Testez l'API : `curl http://localhost:3000/api/products?limit=1`
