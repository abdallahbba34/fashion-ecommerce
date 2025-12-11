# 🚀 Guide de Déploiement sur LWS VPS

## Prérequis

1. **VPS LWS** avec accès SSH
2. **Domaine** configuré (ex: votresite.com)
3. **Accès MongoDB** (MongoDB Atlas recommandé ou installation locale)

---

## 📋 ÉTAPE 1 : Préparation du Projet

### 1.1 Préparer MongoDB Atlas (Base de données cloud)

1. Créez un compte gratuit sur [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Créez un nouveau cluster (M0 Free tier)
3. Créez un utilisateur database :
   - Username: `votre_user`
   - Password: `votre_password_securise`
4. Whitelist IP : Ajoutez `0.0.0.0/0` (ou IP de votre VPS)
5. Récupérez votre connection string :
   ```
   mongodb+srv://username:password@cluster.mongodb.net/fashion-ecommerce
   ```

### 1.2 Créer le fichier .env.production

Créez un fichier `.env.production` dans votre projet :

```env
# Database MongoDB Atlas
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/fashion-ecommerce

# JWT Secret - GÉNÉREZ UNE CLÉ SÉCURISÉE
JWT_SECRET=votre_cle_secrete_super_longue_et_complexe_32_caracteres_minimum

# App URL - Votre domaine
NEXT_PUBLIC_APP_URL=https://votresite.com

# Node Environment
NODE_ENV=production
```

**⚠️ IMPORTANT** : Générez une clé JWT sécurisée avec :
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### 1.3 Optimiser next.config.mjs pour la production

Vérifiez que votre `next.config.mjs` contient :

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  // Optimisations pour la production
  compress: true,
  poweredByHeader: false,
  reactStrictMode: true,
};

export default nextConfig;
```

### 1.4 Ajouter un fichier ecosystem.config.js (pour PM2)

Créez `ecosystem.config.js` à la racine :

```javascript
module.exports = {
  apps: [{
    name: 'fashion-ecommerce',
    script: 'node_modules/next/dist/bin/next',
    args: 'start -p 3000',
    cwd: '/home/votre_user/fashion-ecommerce',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    }
  }]
}
```

---

## 🖥️ ÉTAPE 2 : Configuration du VPS LWS

### 2.1 Connexion SSH au VPS

```bash
ssh root@votre-ip-vps
# ou
ssh votre_user@votre-ip-vps
```

### 2.2 Mise à jour du système

```bash
sudo apt update && sudo apt upgrade -y
```

### 2.3 Installation de Node.js (version 18+)

```bash
# Installer Node.js 20 LTS
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Vérifier l'installation
node -v  # devrait afficher v20.x.x
npm -v
```

### 2.4 Installation de MongoDB (Option locale - si pas Atlas)

**Option A : MongoDB Atlas (Recommandé - déjà fait à l'étape 1.1)**

**Option B : MongoDB Local sur VPS**

```bash
# Importer la clé GPG MongoDB
curl -fsSL https://www.mongodb.org/static/pgp/server-7.0.asc | sudo gpg --dearmor -o /usr/share/keyrings/mongodb-server-7.0.gpg

# Ajouter le repository
echo "deb [ signed-by=/usr/share/keyrings/mongodb-server-7.0.gpg ] https://repo.mongodb.org/apt/debian bookworm/mongodb-org/7.0 main" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list

# Installer MongoDB
sudo apt update
sudo apt install -y mongodb-org

# Démarrer MongoDB
sudo systemctl start mongod
sudo systemctl enable mongod

# Vérifier le statut
sudo systemctl status mongod
```

Si MongoDB local, modifiez `.env.production` :
```env
MONGODB_URI=mongodb://localhost:27017/fashion-ecommerce
```

### 2.5 Installation de PM2 (Gestionnaire de processus)

```bash
sudo npm install -g pm2
```

### 2.6 Installation de Nginx (Reverse proxy)

```bash
sudo apt install -y nginx
sudo systemctl start nginx
sudo systemctl enable nginx
```

---

## 📤 ÉTAPE 3 : Déploiement du Projet

### 3.1 Transférer le projet sur le VPS

**Option A : Via Git (Recommandé)**

Sur le VPS :
```bash
cd /home/votre_user
git clone https://github.com/votre-username/fashion-ecommerce.git
cd fashion-ecommerce
```

**Option B : Via FTP/SCP**

Depuis votre PC Windows :
```bash
# Depuis PowerShell ou utiliser WinSCP
scp -r D:\ecom votre_user@votre-ip-vps:/home/votre_user/fashion-ecommerce
```

### 3.2 Copier le fichier .env.production

Sur le VPS :
```bash
cd /home/votre_user/fashion-ecommerce

# Créer le fichier .env.production
nano .env.production
```

Collez votre configuration (CTRL+O pour sauver, CTRL+X pour quitter).

### 3.3 Installation des dépendances

```bash
npm install --production
```

### 3.4 Build de production

```bash
npm run build
```

Cette commande va créer le dossier `.next` optimisé.

### 3.5 Démarrer l'application avec PM2

```bash
# Démarrer l'application
pm2 start ecosystem.config.js

# Vérifier le statut
pm2 status

# Voir les logs
pm2 logs fashion-ecommerce

# Configurer PM2 pour démarrer au boot
pm2 startup
pm2 save
```

---

## 🌐 ÉTAPE 4 : Configuration Nginx

### 4.1 Créer la configuration Nginx

```bash
sudo nano /etc/nginx/sites-available/fashion-ecommerce
```

Collez cette configuration :

```nginx
server {
    listen 80;
    server_name votresite.com www.votresite.com;

    # Logs
    access_log /var/log/nginx/fashion-ecommerce-access.log;
    error_log /var/log/nginx/fashion-ecommerce-error.log;

    # Proxy vers Next.js
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_read_timeout 60s;
        proxy_connect_timeout 60s;
    }

    # Optimisation pour les fichiers statiques
    location /_next/static {
        proxy_cache STATIC;
        proxy_pass http://localhost:3000;
        add_header Cache-Control "public, max-age=31536000, immutable";
    }

    location /images {
        proxy_cache STATIC;
        proxy_pass http://localhost:3000;
        add_header Cache-Control "public, max-age=31536000, immutable";
    }
}
```

### 4.2 Activer le site

```bash
# Créer le lien symbolique
sudo ln -s /etc/nginx/sites-available/fashion-ecommerce /etc/nginx/sites-enabled/

# Tester la configuration
sudo nginx -t

# Redémarrer Nginx
sudo systemctl restart nginx
```

---

## 🔒 ÉTAPE 5 : Configuration SSL (HTTPS)

### 5.1 Installer Certbot

```bash
sudo apt install -y certbot python3-certbot-nginx
```

### 5.2 Obtenir un certificat SSL

```bash
sudo certbot --nginx -d votresite.com -d www.votresite.com
```

Suivez les instructions et acceptez les redirections HTTPS.

### 5.3 Vérifier le renouvellement automatique

```bash
sudo certbot renew --dry-run
```

---

## 🗃️ ÉTAPE 6 : Initialiser la Base de Données

### 6.1 Ajouter des produits de test

Si vous avez un script seed :

```bash
cd /home/votre_user/fashion-ecommerce
node scripts/seed-products.js
```

Ou utilisez l'interface admin :
```
https://votresite.com/admin/products
```

---

## 🔥 ÉTAPE 7 : Configuration du Pare-feu

```bash
# Permettre SSH, HTTP et HTTPS
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

# Activer le pare-feu
sudo ufw enable

# Vérifier le statut
sudo ufw status
```

---

## 📊 Commandes de Gestion

### Gérer l'application avec PM2

```bash
# Voir les logs en temps réel
pm2 logs fashion-ecommerce

# Redémarrer l'application
pm2 restart fashion-ecommerce

# Arrêter l'application
pm2 stop fashion-ecommerce

# Supprimer de PM2
pm2 delete fashion-ecommerce

# Voir l'utilisation des ressources
pm2 monit
```

### Mettre à jour l'application

```bash
cd /home/votre_user/fashion-ecommerce

# Récupérer les nouvelles modifications
git pull origin main

# Réinstaller les dépendances si nécessaire
npm install --production

# Rebuild
npm run build

# Redémarrer avec PM2
pm2 restart fashion-ecommerce
```

---

## ✅ Vérification Finale

1. **Tester le site** : https://votresite.com
2. **Tester l'admin** : https://votresite.com/admin
3. **Vérifier les logs** : `pm2 logs fashion-ecommerce`
4. **Tester une commande** : Passez une commande test
5. **Vérifier MongoDB** : Connectez-vous à MongoDB Atlas pour voir les données

---

## 🐛 Dépannage

### Le site ne s'affiche pas

```bash
# Vérifier PM2
pm2 status
pm2 logs fashion-ecommerce

# Vérifier Nginx
sudo systemctl status nginx
sudo nginx -t

# Vérifier les logs Nginx
sudo tail -f /var/log/nginx/fashion-ecommerce-error.log
```

### Erreur de connexion MongoDB

```bash
# Vérifier les variables d'environnement
cat .env.production

# Tester la connexion MongoDB Atlas
# Vérifiez l'IP whitelist et les credentials
```

### Port déjà utilisé

```bash
# Voir quel processus utilise le port 3000
sudo lsof -i :3000

# Tuer le processus si nécessaire
sudo kill -9 PID
```

---

## 📈 Optimisations Recommandées

### 1. Configuration du cache Nginx

Ajoutez dans `/etc/nginx/nginx.conf` :

```nginx
http {
    # Cache
    proxy_cache_path /var/cache/nginx levels=1:2 keys_zone=STATIC:10m inactive=7d use_temp_path=off;

    # ... reste de la config
}
```

### 2. Compression Gzip

Déjà activé dans Next.js, mais vérifiez dans Nginx :

```nginx
gzip on;
gzip_types text/plain text/css application/json application/javascript text/xml;
```

### 3. Monitoring

```bash
# Installer htop pour monitorer les ressources
sudo apt install htop

# Lancer htop
htop
```

---

## 💰 Coûts Estimés

- **VPS LWS** : À partir de 4,99€/mois (VPS-S)
- **MongoDB Atlas** : Gratuit (M0 - 512MB)
- **Domaine** : ~10€/an (si pas déjà inclus)

**Total : ~5€/mois** + domaine

---

## 📞 Support LWS

- Site : https://www.lws.fr
- Support : https://aide.lws.fr
- Ticket support : Via votre espace client LWS

---

## ⚠️ Checklist Avant Production

- [ ] Variables d'environnement configurées
- [ ] JWT_SECRET généré de manière sécurisée
- [ ] MongoDB configuré (Atlas ou local)
- [ ] Firewall configuré
- [ ] SSL/HTTPS activé
- [ ] PM2 configuré pour démarrer au boot
- [ ] Nginx configuré comme reverse proxy
- [ ] Tests de commandes effectués
- [ ] Backup MongoDB planifié
- [ ] Monitoring mis en place

---

**Bon déploiement ! 🚀**
