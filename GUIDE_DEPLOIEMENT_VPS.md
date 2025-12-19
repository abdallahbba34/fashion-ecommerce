# 🚀 Guide de Déploiement VPS - La Suite Chic

## 📋 Prérequis

### Sur votre machine locale
- ✅ Code prêt à déployer
- ✅ Build testé localement (`npm run build`)
- ✅ Git configuré

### Sur votre VPS
- Serveur Ubuntu/Debian
- Accès SSH (root ou sudo)
- Nom de domaine pointant vers votre VPS (lasuitechic.online)

---

## 🔧 ÉTAPE 1 : Configuration du Serveur VPS

### 1.1 - Connexion SSH
```bash
ssh root@votre-ip-vps
# OU
ssh utilisateur@lasuitechic.online
```

### 1.2 - Mise à jour du système
```bash
sudo apt update && sudo apt upgrade -y
```

### 1.3 - Installation de Node.js 20.x
```bash
# Installer Node.js 20.x LTS
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Vérifier l'installation
node --version  # Doit afficher v20.x.x
npm --version
```

### 1.4 - Installation de MongoDB
```bash
# Installer MongoDB 7.0
curl -fsSL https://www.mongodb.org/static/pgp/server-7.0.asc | sudo gpg --dearmor -o /etc/apt/trusted.gpg.d/mongodb-7.gpg
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/7.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list
sudo apt update
sudo apt install -y mongodb-org

# Démarrer MongoDB
sudo systemctl start mongod
sudo systemctl enable mongod

# Vérifier
sudo systemctl status mongod
```

### 1.5 - Installation de PM2
```bash
sudo npm install -g pm2
pm2 --version
```

### 1.6 - Installation de Nginx
```bash
sudo apt install -y nginx
sudo systemctl start nginx
sudo systemctl enable nginx
```

---

## 📁 ÉTAPE 2 : Préparation du Code Local

### 2.1 - Créer .env.production
Créez un fichier `.env.production` avec les variables de production :

```bash
# Base de données MongoDB
MONGODB_URI=mongodb://localhost:27017/fashion-ecommerce

# Secret JWT (CHANGEZ CETTE VALEUR!)
JWT_SECRET=votre-secret-jwt-super-securise-aleatoire-123456789

# URL de production
NEXT_PUBLIC_APP_URL=https://lasuitechic.online
```

### 2.2 - Ajouter .env.production au .gitignore
```bash
# Vérifier que .env.production est dans .gitignore
echo ".env.production" >> .gitignore
```

### 2.3 - Commit et Push vers Git
```bash
git add .
git commit -m "Préparation déploiement production"
git push origin main
```

---

## 🌐 ÉTAPE 3 : Déploiement sur le VPS

### 3.1 - Créer le répertoire de l'application
```bash
# Sur le VPS
sudo mkdir -p /var/www/lasuitechic
sudo chown -R $USER:$USER /var/www/lasuitechic
cd /var/www/lasuitechic
```

### 3.2 - Cloner le repository
```bash
# Cloner depuis GitHub
git clone https://github.com/votre-username/votre-repo.git .

# OU si vous utilisez un autre git
git clone https://your-git-url.git .
```

### 3.3 - Créer le fichier .env.production sur le VPS
```bash
nano .env.production
```

Collez le contenu :
```
MONGODB_URI=mongodb://localhost:27017/fashion-ecommerce
JWT_SECRET=votre-secret-jwt-super-securise-aleatoire-123456789
NEXT_PUBLIC_APP_URL=https://lasuitechic.online
```

Sauvegardez : `Ctrl + X`, puis `Y`, puis `Enter`

### 3.4 - Installer les dépendances
```bash
npm install
```

### 3.5 - Build de production
```bash
npm run build
```

### 3.6 - Créer le répertoire uploads
```bash
mkdir -p public/uploads
chmod 755 public/uploads
```

---

## 🔐 ÉTAPE 4 : Configuration de la Base de Données

### 4.1 - Créer l'admin
```bash
node scripts/create-admin-vps.js
```

### 4.2 - Optionnel : Importer des produits de test
```bash
# Si vous avez un dump MongoDB
mongorestore --db fashion-ecommerce dump/fashion-ecommerce/
```

---

## 🚀 ÉTAPE 5 : Démarrage avec PM2

### 5.1 - Démarrer l'application avec PM2
```bash
pm2 start npm --name "lasuitechic" -- start
```

### 5.2 - Configuration PM2
```bash
# Sauvegarder la configuration PM2
pm2 save

# Activer le démarrage automatique
pm2 startup
# Suivez les instructions affichées (copier/coller la commande sudo)
```

### 5.3 - Vérifier que l'application tourne
```bash
pm2 status
pm2 logs lasuitechic
```

L'application devrait tourner sur `http://localhost:3000`

---

## 🌍 ÉTAPE 6 : Configuration Nginx (Reverse Proxy)

### 6.1 - Créer la configuration Nginx
```bash
sudo nano /etc/nginx/sites-available/lasuitechic
```

Collez cette configuration :
```nginx
server {
    listen 80;
    server_name lasuitechic.online www.lasuitechic.online;

    # Redirection HTTP -> HTTPS (après installation SSL)
    # return 301 https://$server_name$request_uri;

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

        # Timeouts
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }

    # Logs
    access_log /var/log/nginx/lasuitechic_access.log;
    error_log /var/log/nginx/lasuitechic_error.log;
}
```

### 6.2 - Activer le site
```bash
sudo ln -s /etc/nginx/sites-available/lasuitechic /etc/nginx/sites-enabled/
sudo rm /etc/nginx/sites-enabled/default  # Supprimer le site par défaut
```

### 6.3 - Tester et redémarrer Nginx
```bash
sudo nginx -t
sudo systemctl restart nginx
```

### 6.4 - Vérifier
Ouvrez votre navigateur : `http://lasuitechic.online`
Votre site devrait être accessible ! 🎉

---

## 🔒 ÉTAPE 7 : Installation SSL avec Let's Encrypt (HTTPS)

### 7.1 - Installer Certbot
```bash
sudo apt install -y certbot python3-certbot-nginx
```

### 7.2 - Obtenir le certificat SSL
```bash
sudo certbot --nginx -d lasuitechic.online -d www.lasuitechic.online
```

Suivez les instructions :
- Entrez votre email
- Acceptez les termes
- Choisissez de rediriger HTTP vers HTTPS (option 2)

### 7.3 - Vérifier le renouvellement automatique
```bash
sudo certbot renew --dry-run
```

Le certificat se renouvellera automatiquement tous les 90 jours.

### 7.4 - Tester HTTPS
Ouvrez `https://lasuitechic.online` - Vous devriez voir le cadenas vert ! 🔒

---

## 🔄 ÉTAPE 8 : Mise à Jour Future

### Pour mettre à jour votre site après des modifications :

```bash
# Sur le VPS
cd /var/www/lasuitechic

# Récupérer les dernières modifications
git pull origin main

# Installer les nouvelles dépendances (si nécessaire)
npm install

# Rebuild
npm run build

# Redémarrer l'application
pm2 restart lasuitechic

# Voir les logs
pm2 logs lasuitechic
```

---

## 📊 Commandes Utiles

### PM2
```bash
pm2 status                    # Statut de toutes les apps
pm2 logs lasuitechic          # Voir les logs en temps réel
pm2 restart lasuitechic       # Redémarrer l'app
pm2 stop lasuitechic          # Arrêter l'app
pm2 start lasuitechic         # Démarrer l'app
pm2 monit                     # Moniteur en temps réel
```

### MongoDB
```bash
mongosh                       # Connexion MongoDB
use fashion-ecommerce         # Changer de DB
db.products.countDocuments()  # Compter les produits
db.orders.find().limit(5)     # Voir les 5 dernières commandes
```

### Nginx
```bash
sudo nginx -t                 # Tester la config
sudo systemctl restart nginx  # Redémarrer Nginx
sudo tail -f /var/log/nginx/lasuitechic_error.log  # Voir les erreurs
```

### Système
```bash
df -h                         # Espace disque
free -h                       # Mémoire RAM
htop                          # Moniteur système (installer : sudo apt install htop)
```

---

## 🛡️ Sécurité Supplémentaire (Recommandé)

### 1. Configurer le Firewall
```bash
sudo ufw allow 22/tcp      # SSH
sudo ufw allow 80/tcp      # HTTP
sudo ufw allow 443/tcp     # HTTPS
sudo ufw enable
sudo ufw status
```

### 2. Sécuriser MongoDB
```bash
# Éditer la config MongoDB
sudo nano /etc/mongod.conf

# Décommenter et modifier :
# security:
#   authorization: enabled

# Créer un utilisateur admin MongoDB
mongosh
use admin
db.createUser({
  user: "admin",
  pwd: "mot-de-passe-securise",
  roles: [ { role: "userAdminAnyDatabase", db: "admin" } ]
})
exit

# Redémarrer MongoDB
sudo systemctl restart mongod
```

### 3. Changer le secret JWT
Dans `.env.production`, générez un nouveau secret :
```bash
# Générer un secret aléatoire
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

Copiez le résultat dans `JWT_SECRET` dans `.env.production`

---

## 🐛 Résolution de Problèmes

### Le site ne se charge pas
```bash
# Vérifier que l'app tourne
pm2 status

# Vérifier les logs
pm2 logs lasuitechic

# Vérifier Nginx
sudo systemctl status nginx
sudo tail -f /var/log/nginx/lasuitechic_error.log
```

### Erreur de connexion MongoDB
```bash
# Vérifier que MongoDB tourne
sudo systemctl status mongod

# Démarrer MongoDB si arrêté
sudo systemctl start mongod
```

### Erreur 502 Bad Gateway
```bash
# L'app Next.js ne tourne pas
pm2 restart lasuitechic
pm2 logs lasuitechic
```

### Problème d'upload d'images
```bash
# Vérifier les permissions
ls -la public/uploads
chmod 755 public/uploads
```

---

## ✅ Checklist de Déploiement

- [ ] Serveur VPS configuré (Node.js, MongoDB, PM2, Nginx)
- [ ] Code pushé sur Git
- [ ] Code cloné sur le VPS
- [ ] Fichier `.env.production` créé avec les bonnes valeurs
- [ ] Dépendances installées (`npm install`)
- [ ] Build réussi (`npm run build`)
- [ ] Admin créé (script `create-admin-vps.js`)
- [ ] App démarrée avec PM2
- [ ] PM2 configuré pour démarrage automatique
- [ ] Nginx configuré et redémarré
- [ ] Site accessible sur HTTP
- [ ] SSL installé avec Certbot
- [ ] Site accessible sur HTTPS
- [ ] Firewall configuré
- [ ] MongoDB sécurisé (optionnel mais recommandé)

---

## 🎉 Votre site est en ligne !

**URL de production :** https://lasuitechic.online
**URL admin :** https://lasuitechic.online/admin

**Login admin par défaut :**
- Email : `admin@lasuitechic.online`
- Mot de passe : `Admin123!`

⚠️ **N'oubliez pas de changer le mot de passe admin après la première connexion !**

---

## 📞 Support

En cas de problème, vérifiez :
1. Les logs PM2 : `pm2 logs lasuitechic`
2. Les logs Nginx : `sudo tail -f /var/log/nginx/lasuitechic_error.log`
3. Le statut MongoDB : `sudo systemctl status mongod`
4. L'espace disque : `df -h`

Bonne chance ! 🚀
