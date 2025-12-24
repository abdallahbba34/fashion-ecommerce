# 🚀 Guide de Déploiement - Fashion E-commerce

Ce guide explique comment déployer automatiquement votre site sur le VPS.

## 📋 Prérequis

1. **Accès SSH au VPS** avec clé SSH configurée (sans mot de passe)
2. **Git** installé sur le VPS
3. **Node.js et npm** installés sur le VPS
4. **PM2** ou **systemd** pour gérer l'application
5. Le projet cloné sur le VPS dans `/var/www/lasuitechic`

## 🔧 Configuration du Script

### 1. Modifier le fichier `deploy.sh`

Ouvrez le fichier et modifiez ces lignes selon votre configuration:

```bash
VPS_USER="root"                          # Votre utilisateur SSH
VPS_HOST="votre-ip-vps"                  # L'IP de votre VPS (ex: 123.45.67.89)
VPS_PROJECT_PATH="/var/www/lasuitechic"  # Chemin du projet sur le VPS
VPS_PORT="22"                            # Port SSH (généralement 22)
```

### 2. Rendre le script exécutable

```bash
chmod +x deploy.sh
```

## 🚀 Utilisation

### Déploiement simple

```bash
./deploy.sh
```

Le script va automatiquement:
1. ✅ Vérifier vos modifications locales
2. 📦 Afficher le dernier commit
3. 🔄 Se connecter au VPS via SSH
4. 📥 Faire un `git pull` pour récupérer les modifications
5. 📦 Installer les dépendances (`npm install`)
6. 🏗️  Builder le projet (`npm run build`)
7. 🔄 Redémarrer l'application (PM2 ou systemd)

## 📝 Workflow Complet

### 1. Développement local

```bash
# Faire vos modifications
# Tester localement
npm run dev
```

### 2. Commit et Push

```bash
git add .
git commit -m "Description des modifications"
git push origin main
```

### 3. Déploiement

```bash
./deploy.sh
```

## ⚙️ Configuration VPS

### Option A: Avec PM2 (Recommandé)

```bash
# Sur le VPS
npm install -g pm2

# Démarrer l'application
cd /var/www/lasuitechic
pm2 start npm --name "fashion-ecommerce" -- start
pm2 save
pm2 startup
```

### Option B: Avec systemd

Créer le fichier `/etc/systemd/system/fashion-ecommerce.service`:

```ini
[Unit]
Description=Fashion E-commerce
After=network.target

[Service]
Type=simple
User=root
WorkingDirectory=/var/www/lasuitechic
ExecStart=/usr/bin/npm start
Restart=always
Environment=NODE_ENV=production

[Install]
WantedBy=multi-user.target
```

Puis:

```bash
sudo systemctl daemon-reload
sudo systemctl enable fashion-ecommerce
sudo systemctl start fashion-ecommerce
```

## 🔍 Vérification

Après le déploiement, vérifiez:

1. **État de l'application**
```bash
# Avec PM2
pm2 status
pm2 logs fashion-ecommerce

# Avec systemd
sudo systemctl status fashion-ecommerce
journalctl -u fashion-ecommerce -f
```

2. **Accès au site**
Ouvrez votre navigateur sur: `http://votre-ip-vps`

## 🐛 Dépannage

### Erreur SSH

```bash
# Tester la connexion SSH
ssh root@votre-ip-vps

# Si erreur de clé, ajouter votre clé SSH
ssh-copy-id root@votre-ip-vps
```

### Erreur Git Pull

```bash
# Sur le VPS, vérifier l'état de Git
cd /var/www/lasuitechic
git status
git remote -v

# Reset si nécessaire
git reset --hard origin/main
```

### Erreur Build

```bash
# Sur le VPS, nettoyer et rebuilder
cd /var/www/lasuitechic
rm -rf .next node_modules
npm install
npm run build
```

### Port déjà utilisé

```bash
# Trouver quel processus utilise le port 3000
lsof -i :3000

# Ou tuer tous les processus Node
pkill -f node
pm2 restart all
```

## 📊 Monitoring

### Logs en temps réel

```bash
# Avec PM2
pm2 logs fashion-ecommerce --lines 100

# Avec systemd
journalctl -u fashion-ecommerce -f
```

### Métriques

```bash
# Avec PM2
pm2 monit
```

## 🔐 Sécurité

### Variables d'environnement

Assurez-vous que votre fichier `.env.production` est bien configuré sur le VPS:

```bash
# Sur le VPS
cd /var/www/lasuitechic
nano .env.production
```

Vérifiez:
- `MONGODB_URI`
- `JWT_SECRET`
- `YALIDINE_API_ID`
- `YALIDINE_API_TOKEN`
- `NEXT_PUBLIC_API_URL`

### Permissions

```bash
# Sur le VPS, vérifier les permissions
cd /root
ls -la fashion-ecommerce
```

## 🎯 Conseils

1. **Toujours tester localement** avant de déployer
2. **Vérifier les logs** après chaque déploiement
3. **Faire des sauvegardes** de la base de données régulièrement
4. **Utiliser PM2** pour le monitoring et les redémarrages automatiques
5. **Configurer un reverse proxy** (Nginx) pour la production

## 📞 Support

En cas de problème, vérifiez:
1. Les logs du serveur
2. La connexion à MongoDB
3. Les variables d'environnement
4. L'état du firewall et des ports

