# 🚀 Guide de Déploiement VPS LWS - Fashion E-commerce

**VPS Référence** : VPS-116857
**Système** : Ubuntu 24.04 LTS
**Projet** : Fashion E-commerce (Next.js 14)
**MongoDB** : Atlas Cloud (Déjà configuré ✅)

---

## 📋 PRÉREQUIS (Déjà fait ✅)

- ✅ VPS LWS commandé et en cours d'installation
- ✅ MongoDB Atlas configuré
- ✅ Fichier `.env.production` créé
- ✅ Build de production testé avec succès

---

## 🎯 ÉTAPE 1 : Récupérer les Accès SSH

### Une fois le VPS installé (icône verte 🟢) :

1. Dans votre espace client LWS, onglet **"Serveurs"**
2. Cliquez sur **"VPS-116857"** (votre référence)
3. Vous verrez une page avec :
   ```
   IP du serveur : XXX.XXX.XXX.XXX
   Username SSH : root
   Password SSH : MotDePasse
   ```

4. **NOTEZ CES INFORMATIONS** dans un fichier sécurisé

---

## 🖥️ ÉTAPE 2 : Se Connecter au VPS via SSH

### Option A : Depuis Windows (PowerShell ou CMD)

```bash
ssh root@VOTRE_IP_VPS
# Remplacez VOTRE_IP_VPS par l'IP réelle
```

**Exemple** :
```bash
ssh root@51.178.42.123
```

Quand demandé, entrez le **mot de passe SSH** que vous avez noté.

### Option B : Utiliser PuTTY (si vous préférez une interface)

1. Téléchargez PuTTY : https://www.putty.org
2. Entrez l'IP du VPS
3. Port : 22
4. Cliquez "Open"
5. Login : root
6. Password : celui fourni par LWS

---

## 🔧 ÉTAPE 3 : Configuration Initiale du Serveur

Une fois connecté en SSH, exécutez ces commandes **UNE PAR UNE** :

### 3.1 Mise à jour du système

```bash
apt update && apt upgrade -y
```

⏱️ *Temps estimé : 2-5 minutes*

### 3.2 Installation de Node.js 20 LTS

```bash
# Ajouter le repository Node.js
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -

# Installer Node.js
apt install -y nodejs

# Vérifier l'installation
node -v
npm -v
```

✅ *Vous devriez voir : v20.x.x et npm version*

### 3.3 Installation de PM2 (Gestionnaire de processus)

```bash
npm install -g pm2
```

### 3.4 Installation de Nginx (Reverse proxy)

```bash
apt install -y nginx

# Démarrer Nginx
systemctl start nginx
systemctl enable nginx
```

### 3.5 Installation de Certbot (SSL gratuit)

```bash
apt install -y certbot python3-certbot-nginx
```

---

## 📤 ÉTAPE 4 : Transférer votre Projet sur le VPS

### Option A : Via Git (Recommandé)

**Si votre projet est sur GitHub/GitLab** :

```bash
cd /root
git clone https://github.com/VOTRE_USERNAME/fashion-ecommerce.git
cd fashion-ecommerce
```

### Option B : Via SCP (Depuis votre PC Windows)

**Depuis PowerShell sur Windows** :

```powershell
# Compresser d'abord votre projet
cd D:\
tar -czf ecom.tar.gz ecom

# Transférer vers le VPS
scp ecom.tar.gz root@VOTRE_IP_VPS:/root/

# Ensuite sur le VPS, décompresser :
```

**Sur le VPS (SSH)** :
```bash
cd /root
tar -xzf ecom.tar.gz
mv ecom fashion-ecommerce
cd fashion-ecommerce
```

---

## ⚙️ ÉTAPE 5 : Configuration du Projet sur le VPS

### 5.1 Copier le fichier .env.production

**Sur votre PC**, le fichier `.env.production` existe déjà.

**Option 1 : Copier manuellement**

Sur le VPS :
```bash
cd /root/fashion-ecommerce
nano .env.production
```

Copiez-collez le contenu de votre fichier local `D:\ecom\.env.production` :
```env
MONGODB_URI=mongodb+srv://ecomuser:HByy2RdJEHOQX96C@cluster0.bg0oh1n.mongodb.net/fashion-ecommerce?retryWrites=true&w=majority&appName=Cluster0
JWT_SECRET=985bedc061595e6782ed1ff924a4207630a977f1e52648ec821bbf2cdee7251e5dbf45d59b4c6f6acf477fd904105fd60268f67228aeabd7d4c47c951580caa4
NEXT_PUBLIC_APP_URL=http://VOTRE_IP_VPS
NODE_ENV=production
```

⚠️ **IMPORTANT** : Remplacez `VOTRE_IP_VPS` par la vraie IP !

Sauvegardez : `CTRL+O` puis `CTRL+X`

**Option 2 : Transférer via SCP**

Depuis Windows PowerShell :
```powershell
scp D:\ecom\.env.production root@VOTRE_IP_VPS:/root/fashion-ecommerce/
```

### 5.2 Mettre à jour ecosystem.config.js

```bash
nano ecosystem.config.js
```

Modifiez la ligne `cwd` :
```javascript
cwd: '/root/fashion-ecommerce',  // ← Changer ici
```

Sauvegardez : `CTRL+O` puis `CTRL+X`

### 5.3 Installer les dépendances

```bash
npm install --production
```

⏱️ *Temps estimé : 2-3 minutes*

### 5.4 Build de production

```bash
npm run build
```

⏱️ *Temps estimé : 1-2 minutes*

✅ *Si le build réussit, vous verrez "Compiled successfully"*

---

## 🚀 ÉTAPE 6 : Démarrer l'Application avec PM2

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

✅ *Votre application Next.js tourne maintenant sur le port 3000 !*

**Testez** : `curl http://localhost:3000`

---

## 🌐 ÉTAPE 7 : Configuration Nginx (Reverse Proxy)

### 7.1 Créer la configuration Nginx

```bash
nano /etc/nginx/sites-available/fashion-ecommerce
```

**Copiez cette configuration** :

```nginx
server {
    listen 80;
    server_name VOTRE_IP_VPS;

    # Logs
    access_log /var/log/nginx/fashion-ecommerce-access.log;
    error_log /var/log/nginx/fashion-ecommerce-error.log;

    # Limite de taille des uploads
    client_max_body_size 10M;

    # Proxy vers Next.js (Port 3000)
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
        proxy_pass http://localhost:3000;
        add_header Cache-Control "public, max-age=31536000, immutable";
    }
}
```

⚠️ **IMPORTANT** : Remplacez `VOTRE_IP_VPS` par votre vraie IP !

Sauvegardez : `CTRL+O` puis `CTRL+X`

### 7.2 Activer le site

```bash
# Créer le lien symbolique
ln -s /etc/nginx/sites-available/fashion-ecommerce /etc/nginx/sites-enabled/

# Tester la configuration
nginx -t

# Redémarrer Nginx
systemctl restart nginx
```

---

## 🔥 ÉTAPE 8 : Configuration du Pare-feu

```bash
# Installer UFW (si pas déjà installé)
apt install -y ufw

# Autoriser SSH (IMPORTANT !)
ufw allow 22/tcp

# Autoriser HTTP et HTTPS
ufw allow 80/tcp
ufw allow 443/tcp

# Activer le pare-feu
ufw enable

# Vérifier
ufw status
```

---

## ✅ ÉTAPE 9 : TESTER LE SITE

Ouvrez votre navigateur et allez sur :

```
http://VOTRE_IP_VPS
```

**Exemple** : `http://51.178.42.123`

✅ **Vous devriez voir votre site e-commerce ! 🎉**

### Tester les pages :
- Page d'accueil : `http://VOTRE_IP_VPS/`
- Admin : `http://VOTRE_IP_VPS/admin`
- Produits : `http://VOTRE_IP_VPS/products`

---

## 🔒 ÉTAPE 10 : Configuration SSL/HTTPS (Optionnel mais recommandé)

⚠️ **Pour SSL, vous avez besoin d'un nom de domaine** (ex: monsite.com)

### Si vous avez un domaine :

1. **Pointez votre domaine vers l'IP du VPS** (DNS A record)

2. **Attendez la propagation DNS** (1-24h, souvent 1-2h)

3. **Modifiez la config Nginx** :
```bash
nano /etc/nginx/sites-available/fashion-ecommerce
```

Changez `server_name VOTRE_IP_VPS;` en :
```nginx
server_name votredomaine.com www.votredomaine.com;
```

4. **Obtenez le certificat SSL** :
```bash
certbot --nginx -d votredomaine.com -d www.votredomaine.com
```

5. **Suivez les instructions** de Certbot

✅ **Votre site sera en HTTPS** : `https://votredomaine.com`

6. **Mettez à jour .env.production** :
```bash
nano /root/fashion-ecommerce/.env.production
```

Changez :
```env
NEXT_PUBLIC_APP_URL=https://votredomaine.com
```

7. **Redémarrez l'application** :
```bash
pm2 restart fashion-ecommerce
```

---

## 📊 Commandes de Gestion Quotidienne

### Gérer l'application

```bash
# Voir le statut
pm2 status

# Voir les logs en temps réel
pm2 logs fashion-ecommerce

# Redémarrer l'app
pm2 restart fashion-ecommerce

# Arrêter l'app
pm2 stop fashion-ecommerce

# Monitoring des ressources
pm2 monit
```

### Gérer Nginx

```bash
# Redémarrer Nginx
systemctl restart nginx

# Voir le statut
systemctl status nginx

# Voir les logs d'erreur
tail -f /var/log/nginx/fashion-ecommerce-error.log
```

### Vérifier les ressources serveur

```bash
# Espace disque
df -h

# Mémoire RAM
free -h

# Processus
htop  # (installer avec: apt install htop)
```

---

## 🔄 Mise à Jour du Site

Quand vous voulez déployer une nouvelle version :

```bash
cd /root/fashion-ecommerce

# Si via Git
git pull origin main

# Réinstaller les dépendances si besoin
npm install --production

# Rebuild
npm run build

# Redémarrer
pm2 restart fashion-ecommerce
```

---

## 🐛 Dépannage

### Le site ne s'affiche pas

```bash
# 1. Vérifier PM2
pm2 status
pm2 logs fashion-ecommerce

# 2. Vérifier Nginx
systemctl status nginx
nginx -t

# 3. Vérifier les ports
lsof -i :3000
lsof -i :80

# 4. Redémarrer tout
pm2 restart fashion-ecommerce
systemctl restart nginx
```

### Erreur MongoDB

```bash
# Vérifier .env.production
cat /root/fashion-ecommerce/.env.production

# Tester la connexion MongoDB
cd /root/fashion-ecommerce
node -e "require('mongoose').connect(process.env.MONGODB_URI).then(() => console.log('OK')).catch(e => console.error(e))"
```

### Port 3000 déjà utilisé

```bash
# Voir quel processus utilise le port
lsof -i :3000

# Tuer le processus
pm2 delete fashion-ecommerce
# Puis redémarrer
pm2 start ecosystem.config.js
```

---

## 📋 Checklist Finale

- [ ] VPS installé et accessible via SSH
- [ ] Node.js 20 installé
- [ ] PM2 installé
- [ ] Nginx installé
- [ ] Projet transféré sur le VPS
- [ ] .env.production configuré avec la bonne IP
- [ ] Build réussi (npm run build)
- [ ] Application démarrée avec PM2
- [ ] Nginx configuré et redémarré
- [ ] Pare-feu configuré
- [ ] Site accessible via http://IP_VPS
- [ ] Pages testées (/, /admin, /products)
- [ ] SSL configuré (si domaine disponible)

---

## 🎉 FÉLICITATIONS !

Votre site e-commerce est maintenant EN LIGNE ! 🚀

**URL d'accès** : http://VOTRE_IP_VPS
**Admin** : http://VOTRE_IP_VPS/admin

---

## 📞 Support

**En cas de problème :**
- LWS Support : https://aide.lws.fr
- Logs PM2 : `pm2 logs fashion-ecommerce`
- Logs Nginx : `tail /var/log/nginx/fashion-ecommerce-error.log`

---

**Guide créé le** : 10 Décembre 2025
**VPS** : LWS VPS M - Ubuntu 24.04 LTS
