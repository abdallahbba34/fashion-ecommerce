# 🚀 Guide de Déploiement - La Suite Chic

Guide complet pour déployer votre site e-commerce en production.

## 📋 Options de déploiement

Vous avez **2 options principales** :

### Option 1 : VPS (Serveur dédié) - Déjà configuré ✅
- **Avantages** : Contrôle total, performances, pas de limitations
- **Votre configuration actuelle** :
  - Domaine : `lasuitechic.online`
  - VPS IP : `180.149.198.89`
  - MongoDB Atlas (déjà configuré)
  - Yalidine API (configurée)

### Option 2 : Vercel/Netlify (Hébergement cloud)
- **Avantages** : Déploiement ultra simple, SSL gratuit, CDN mondial
- **Inconvénients** : Certaines limitations gratuites

---

## 🎯 Méthode 1 : Déploiement sur VPS (Recommandé pour vous)

Vous avez déjà un VPS configuré. Voici comment déployer.

### Pré-requis
- ✅ Accès SSH au VPS (`180.149.198.89`)
- ✅ Clé SSH (`~/.ssh/id_rsa_lws`)
- ✅ MongoDB Atlas configuré
- ✅ Node.js installé sur le VPS

### Étape 1 : Préparer le projet localement

```bash
# 1. Vérifier que tout fonctionne en local
npm run build

# 2. Vérifier .env.production
cat .env.production

# Assurez-vous que ces variables sont définies :
# - MONGODB_URI (MongoDB Atlas)
# - JWT_SECRET
# - NEXT_PUBLIC_APP_URL=http://lasuitechic.online
# - YALIDINE_API_ID et YALIDINE_API_TOKEN
```

### Étape 2 : Déploiement automatique

**Sur Windows (Git Bash)** :
```bash
cd D:\ecom
bash scripts/deploy-complete.sh
```

**Sur Windows (PowerShell)** :
```powershell
cd D:\ecom
wsl bash scripts/deploy-complete.sh
```

Le script automatique fait :
1. ✅ Test de connexion au VPS
2. ✅ Build du projet en local
3. ✅ Sauvegarde de la version actuelle sur VPS
4. ✅ Synchronisation des fichiers
5. ✅ Installation des dépendances sur VPS
6. ✅ Build sur le VPS
7. ✅ Redémarrage avec PM2
8. ✅ Vérification du statut

### Étape 3 : Vérification

Après le déploiement, vérifiez :

```bash
# 1. Ouvrir votre site
http://lasuitechic.online

# 2. Vérifier les logs (si nécessaire)
ssh -i ~/.ssh/id_rsa_lws lwsuser@180.149.198.89
pm2 logs ecom

# 3. Vérifier le statut
pm2 status
```

### ✅ Le site devrait être en ligne !

---

## 🎯 Méthode 2 : Déploiement sur Vercel (Alternative simple)

Si vous préférez une solution plus simple sans gérer de serveur.

### Étape 1 : Créer un compte Vercel

1. Allez sur [vercel.com](https://vercel.com)
2. Créez un compte (gratuit)
3. Connectez votre compte GitHub

### Étape 2 : Préparer le projet

```bash
# 1. Initialiser Git (si pas déjà fait)
git init
git add .
git commit -m "Initial commit"

# 2. Créer un repo GitHub
# Allez sur github.com et créez un nouveau repo

# 3. Pusher le code
git remote add origin https://github.com/votre-username/lasuitechic.git
git push -u origin main
```

### Étape 3 : Déployer sur Vercel

1. Sur Vercel, cliquez "New Project"
2. Importez votre repo GitHub
3. Configurez les variables d'environnement :
   - `MONGODB_URI` : Votre URI MongoDB Atlas
   - `JWT_SECRET` : Votre clé secrète JWT
   - `NEXT_PUBLIC_APP_URL` : https://votre-domaine.vercel.app
   - `YALIDINE_API_ID` : Votre ID Yalidine
   - `YALIDINE_API_TOKEN` : Votre token Yalidine

4. Cliquez "Deploy"

### Étape 4 : Configurer le domaine personnalisé

1. Dans Vercel, allez dans Settings > Domains
2. Ajoutez `lasuitechic.online`
3. Suivez les instructions pour configurer les DNS

---

## 🔧 Déploiement Manuel sur VPS (Si le script ne fonctionne pas)

### 1. Connexion au VPS

```bash
ssh -i ~/.ssh/id_rsa_lws lwsuser@180.149.198.89
```

### 2. Préparer le dossier

```bash
# Créer une sauvegarde
cd /home/lwsuser
cp -r ecom ecom-backup-$(date +%Y%m%d-%H%M%S)

# Ou créer le dossier si première fois
mkdir -p /home/lwsuser/ecom
cd /home/lwsuser/ecom
```

### 3. Transférer les fichiers (depuis votre PC)

**Option A : Avec rsync (recommandé)**
```bash
rsync -avz --delete \
    --exclude 'node_modules' \
    --exclude '.git' \
    --exclude '.next' \
    --exclude '.env.local' \
    -e "ssh -i ~/.ssh/id_rsa_lws" \
    D:/ecom/ lwsuser@180.149.198.89:/home/lwsuser/ecom/
```

**Option B : Avec WinSCP (interface graphique)**
1. Téléchargez WinSCP
2. Connectez-vous au VPS :
   - Host : `180.149.198.89`
   - User : `lwsuser`
   - Clé privée : `C:\Users\votre-user\.ssh\id_rsa_lws`
3. Glissez-déposez les fichiers

### 4. Copier .env.production

```bash
scp -i ~/.ssh/id_rsa_lws D:/ecom/.env.production lwsuser@180.149.198.89:/home/lwsuser/ecom/.env.production
```

### 5. Installer et build (sur le VPS)

```bash
ssh -i ~/.ssh/id_rsa_lws lwsuser@180.149.198.89

cd /home/lwsuser/ecom
npm install
npm run build
```

### 6. Démarrer avec PM2

```bash
# Arrêter l'ancienne version
pm2 stop ecom
pm2 delete ecom

# Démarrer la nouvelle
pm2 start npm --name "ecom" -- start -- -p 3000
pm2 save

# Vérifier
pm2 status
pm2 logs ecom
```

---

## 🌐 Configuration du domaine

### Si vous utilisez le VPS

Votre domaine `lasuitechic.online` doit pointer vers `180.149.198.89`

Vérifiez les DNS :
```bash
nslookup lasuitechic.online
```

Si ce n'est pas configuré, allez chez votre registrar (OVH, LWS, etc.) et configurez :
- **Type A** : `lasuitechic.online` → `180.149.198.89`
- **Type A** : `www.lasuitechic.online` → `180.149.198.89`

### Configuration Nginx (si nécessaire)

Si vous utilisez Nginx comme reverse proxy :

```nginx
server {
    listen 80;
    server_name lasuitechic.online www.lasuitechic.online;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

---

## 🔐 SSL/HTTPS (Recommandé)

### Sur VPS avec Certbot

```bash
# Installer Certbot
sudo apt-get update
sudo apt-get install certbot python3-certbot-nginx

# Obtenir un certificat SSL gratuit
sudo certbot --nginx -d lasuitechic.online -d www.lasuitechic.online

# Renouvellement automatique
sudo certbot renew --dry-run
```

### Sur Vercel

SSL automatique, rien à faire ! 🎉

---

## 📊 Vérification post-déploiement

### Checklist

- [ ] Le site s'affiche : `http://lasuitechic.online`
- [ ] Les images des produits s'affichent
- [ ] Le panier fonctionne
- [ ] Le checkout fonctionne
- [ ] La connexion admin fonctionne (`/admin/login`)
- [ ] Le formulaire Yalidine fonctionne
- [ ] Les logs PM2 ne montrent pas d'erreurs

### Tester une commande

1. Ajoutez un produit au panier
2. Allez au checkout
3. Remplissez le formulaire
4. Validez la commande
5. Vérifiez dans l'admin que la commande apparaît

### Surveiller les logs

```bash
# Logs en temps réel
pm2 logs ecom

# Dernières lignes
pm2 logs ecom --lines 50

# Erreurs seulement
pm2 logs ecom --err
```

---

## 🐛 Résolution de problèmes

### Problème : Le site ne démarre pas

**Solution** :
```bash
ssh -i ~/.ssh/id_rsa_lws lwsuser@180.149.198.89
pm2 logs ecom --lines 100
```
Cherchez les erreurs dans les logs.

### Problème : Erreur MongoDB

**Vérifier la connexion** :
```bash
# Sur le VPS
cat /home/lwsuser/ecom/.env.production | grep MONGODB_URI
```

Assurez-vous que :
1. L'URI est correcte
2. L'IP du VPS est autorisée dans MongoDB Atlas
3. Le mot de passe ne contient pas de caractères spéciaux non encodés

### Problème : Les images ne s'affichent pas

1. Vérifiez que le dossier `public/images` existe
2. Vérifiez les permissions : `chmod -R 755 public/images`
3. Videz le cache du navigateur (Ctrl+Shift+R)

### Problème : Page 404 ou 500

**Rebuild le projet** :
```bash
ssh -i ~/.ssh/id_rsa_lws lwsuser@180.149.198.89
cd /home/lwsuser/ecom
npm run build
pm2 restart ecom
```

### Problème : Port 3000 déjà utilisé

```bash
# Voir ce qui utilise le port
lsof -i :3000

# Tuer le processus
kill -9 <PID>

# Ou utiliser un autre port
pm2 start npm --name "ecom" -- start -- -p 3001
```

---

## 🔄 Mises à jour futures

Pour déployer une nouvelle version :

### Méthode rapide
```bash
# Depuis votre PC
cd D:\ecom
bash scripts/deploy-complete.sh
```

### Méthode manuelle
```bash
# 1. Build en local
npm run build

# 2. Synchroniser
rsync -avz --delete \
    --exclude 'node_modules' \
    --exclude '.git' \
    --exclude '.next' \
    -e "ssh -i ~/.ssh/id_rsa_lws" \
    ./ lwsuser@180.149.198.89:/home/lwsuser/ecom/

# 3. Rebuild et restart sur VPS
ssh -i ~/.ssh/id_rsa_lws lwsuser@180.149.198.89
cd /home/lwsuser/ecom
npm install
npm run build
pm2 restart ecom
```

---

## 🎯 Optimisations recommandées

### 1. Activer la compression Gzip

Dans `next.config.mjs` :
```javascript
const nextConfig = {
  compress: true,
  // ... reste de la config
};
```

### 2. Mettre en cache les images

Nginx peut gérer le cache des images statiques.

### 3. Monitoring

Installer un monitoring :
```bash
pm2 install pm2-logrotate
pm2 set pm2-logrotate:max_size 10M
pm2 set pm2-logrotate:retain 7
```

---

## 📞 Support

En cas de problème :

1. **Vérifiez les logs** : `pm2 logs ecom`
2. **Consultez ce guide**
3. **Testez en local** : `npm run dev`
4. **Vérifiez MongoDB Atlas** : Connexion et IP autorisée
5. **Vérifiez les variables d'environnement** : `.env.production`

---

## ✅ Checklist finale

Avant de considérer le déploiement comme terminé :

- [ ] Le site est accessible publiquement
- [ ] HTTPS configuré (recommandé)
- [ ] MongoDB Atlas fonctionne
- [ ] Yalidine API fonctionne
- [ ] Admin peut se connecter
- [ ] Les commandes fonctionnent
- [ ] Les images s'affichent
- [ ] PM2 configuré pour redémarrer automatiquement
- [ ] Logs sont propres (pas d'erreurs)
- [ ] Sauvegarde configurée

---

## 🎉 Félicitations !

Votre site e-commerce est maintenant en ligne !

**Prochaines étapes :**
1. Ajoutez vos produits
2. Testez le processus de commande complet
3. Configurez Facebook Pixel (optionnel)
4. Commencez à promouvoir votre site

**Bonne vente ! 🚀**
