# 🚀 Déploiement Rapide sur LWS - Version Express

**Temps estimé : 30-45 minutes**

## 📦 Ce dont vous avez besoin

1. **VPS LWS** (à partir de 4,99€/mois)
2. **Nom de domaine** configuré
3. **Compte MongoDB Atlas** (gratuit)

---

## ⚡ Étapes Rapides

### 1️⃣ Préparez MongoDB Atlas (5 min)

1. Allez sur https://www.mongodb.com/cloud/atlas → Créer un compte gratuit
2. Créez un cluster M0 (gratuit)
3. Créez un user : `dbUser` / `VotreMotDePasse123`
4. Whitelist IP : `0.0.0.0/0`
5. Copiez votre connection string :
   ```
   mongodb+srv://dbUser:VotreMotDePasse123@cluster0.xxxxx.mongodb.net/fashion-ecommerce
   ```

### 2️⃣ Connectez-vous au VPS LWS (2 min)

```bash
ssh root@VOTRE_IP_VPS
# Entrez le mot de passe fourni par LWS
```

### 3️⃣ Installez les dépendances (10 min)

```bash
# Mise à jour
apt update && apt upgrade -y

# Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs

# PM2
npm install -g pm2

# Nginx
apt install -y nginx

# Certbot (SSL)
apt install -y certbot python3-certbot-nginx
```

### 4️⃣ Transférez votre projet (5 min)

**Option A - Via Git (Recommandé)**
```bash
cd /root
git clone https://github.com/VOTRE_USERNAME/fashion-ecommerce.git
cd fashion-ecommerce
```

**Option B - Via SCP (depuis Windows)**
```powershell
# Depuis PowerShell Windows
scp -r D:\ecom root@VOTRE_IP_VPS:/root/fashion-ecommerce
```

### 5️⃣ Configurez l'environnement (3 min)

```bash
cd /root/fashion-ecommerce

# Créez .env.production
nano .env.production
```

Copiez ceci (remplacez les valeurs) :
```env
MONGODB_URI=mongodb+srv://dbUser:VotreMotDePasse123@cluster0.xxxxx.mongodb.net/fashion-ecommerce
JWT_SECRET=GENEREZ_UNE_CLE_SECRETE_ICI
NEXT_PUBLIC_APP_URL=https://votresite.com
NODE_ENV=production
```

**Générer JWT_SECRET :**
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

Sauvegardez : `CTRL+O` puis `CTRL+X`

### 6️⃣ Buildez et démarrez (5 min)

```bash
# Installation
npm install --production

# Build
npm run build

# Modifiez ecosystem.config.js
nano ecosystem.config.js
# Changez le path : cwd: '/root/fashion-ecommerce'

# Démarrez avec PM2
pm2 start ecosystem.config.js
pm2 startup
pm2 save

# Vérifiez
pm2 logs fashion-ecommerce
```

### 7️⃣ Configurez Nginx (5 min)

```bash
nano /etc/nginx/sites-available/fashion-ecommerce
```

Copiez (changez `votresite.com`) :
```nginx
server {
    listen 80;
    server_name votresite.com www.votresite.com;

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

Activez :
```bash
ln -s /etc/nginx/sites-available/fashion-ecommerce /etc/nginx/sites-enabled/
nginx -t
systemctl restart nginx
```

### 8️⃣ Activez SSL/HTTPS (5 min)

```bash
certbot --nginx -d votresite.com -d www.votresite.com
# Suivez les instructions, acceptez les redirections HTTPS
```

### 9️⃣ Configurez le pare-feu (2 min)

```bash
ufw allow 22/tcp
ufw allow 80/tcp
ufw allow 443/tcp
ufw enable
```

---

## ✅ C'est Prêt !

Votre site est maintenant en ligne : **https://votresite.com**

### Accès Admin
https://votresite.com/admin

---

## 🔍 Vérifications

```bash
# Le site tourne ?
pm2 status

# Voir les logs
pm2 logs fashion-ecommerce

# Logs Nginx
tail /var/log/nginx/error.log
```

---

## 🔄 Pour Mettre à Jour

```bash
cd /root/fashion-ecommerce
git pull
npm install --production
npm run build
pm2 restart fashion-ecommerce
```

---

## ⚠️ Problèmes Courants

**502 Bad Gateway ?**
```bash
pm2 restart fashion-ecommerce
```

**Erreur MongoDB ?**
- Vérifiez `.env.production`
- Vérifiez l'IP whitelist dans MongoDB Atlas

**Site pas accessible ?**
```bash
# DNS propagé ?
ping votresite.com

# Nginx OK ?
systemctl status nginx
```

---

## 📚 Documentation Complète

Pour plus de détails : voir `DEPLOIEMENT_LWS.md`

---

## 🎉 Félicitations !

Votre site e-commerce est maintenant en production !

**Prochaines étapes :**
- Ajoutez des produits via `/admin/products`
- Testez une commande
- Configurez les backups MongoDB
- Ajoutez Google Analytics

**Besoin d'aide ?**
- Support LWS : https://aide.lws.fr
- Checklist : voir `CHECKLIST_DEPLOIEMENT.md`
