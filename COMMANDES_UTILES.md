# 🛠️ Commandes Utiles - Référence Rapide

Guide de référence pour gérer votre application en production sur LWS VPS.

---

## 🚀 PM2 (Gestion de l'Application)

### Commandes de Base

```bash
# Démarrer l'application
pm2 start ecosystem.config.js

# Redémarrer l'application
pm2 restart fashion-ecommerce

# Arrêter l'application
pm2 stop fashion-ecommerce

# Supprimer de PM2
pm2 delete fashion-ecommerce

# Voir le statut
pm2 status

# Voir les logs en temps réel
pm2 logs fashion-ecommerce

# Voir les 100 dernières lignes
pm2 logs fashion-ecommerce --lines 100

# Effacer les logs
pm2 flush

# Monitoring des ressources (CPU, RAM)
pm2 monit

# Liste des applications
pm2 list

# Informations détaillées
pm2 show fashion-ecommerce

# Redémarrer au boot du serveur
pm2 startup
pm2 save
```

### Gestion Avancée

```bash
# Redémarrer en mode cluster (plusieurs instances)
pm2 restart fashion-ecommerce -i 2

# Recharger sans downtime
pm2 reload fashion-ecommerce

# Mettre à jour PM2
npm install -g pm2@latest
pm2 update
```

---

## 🌐 Nginx (Serveur Web)

### Commandes de Base

```bash
# Démarrer Nginx
sudo systemctl start nginx

# Arrêter Nginx
sudo systemctl stop nginx

# Redémarrer Nginx
sudo systemctl restart nginx

# Recharger la config (sans interruption)
sudo systemctl reload nginx

# Statut de Nginx
sudo systemctl status nginx

# Activer au démarrage
sudo systemctl enable nginx

# Tester la configuration
sudo nginx -t

# Voir la version
nginx -v
```

### Logs Nginx

```bash
# Logs d'erreur en temps réel
sudo tail -f /var/log/nginx/error.log

# Logs d'accès en temps réel
sudo tail -f /var/log/nginx/access.log

# Logs spécifiques au site
sudo tail -f /var/log/nginx/fashion-ecommerce-error.log
sudo tail -f /var/log/nginx/fashion-ecommerce-access.log

# Dernières 100 lignes
sudo tail -100 /var/log/nginx/error.log

# Rechercher une erreur spécifique
sudo grep "502" /var/log/nginx/error.log
```

### Configuration

```bash
# Éditer la config du site
sudo nano /etc/nginx/sites-available/fashion-ecommerce

# Tester après modification
sudo nginx -t

# Appliquer les changements
sudo systemctl reload nginx

# Lister les sites activés
ls -la /etc/nginx/sites-enabled/
```

---

## 🔒 SSL/HTTPS (Certbot)

### Gestion des Certificats

```bash
# Obtenir un nouveau certificat
sudo certbot --nginx -d votresite.com -d www.votresite.com

# Renouveler manuellement
sudo certbot renew

# Tester le renouvellement (dry-run)
sudo certbot renew --dry-run

# Lister les certificats
sudo certbot certificates

# Révoquer un certificat
sudo certbot revoke --cert-path /etc/letsencrypt/live/votresite.com/cert.pem

# Supprimer un certificat
sudo certbot delete --cert-name votresite.com
```

### Automatisation

```bash
# Vérifier le timer de renouvellement auto
sudo systemctl status certbot.timer

# Logs de certbot
sudo journalctl -u certbot
```

---

## 📦 Node.js & NPM

### Commandes NPM

```bash
# Installer les dépendances
npm install

# Installation production uniquement
npm install --production

# Mettre à jour les packages
npm update

# Voir les packages obsolètes
npm outdated

# Nettoyer le cache
npm cache clean --force

# Voir la version de Node
node -v

# Voir la version de NPM
npm -v
```

### Build Next.js

```bash
# Build de production
npm run build

# Démarrer en mode production
npm start

# Mode développement
npm run dev

# Linter
npm run lint
```

---

## 🗄️ MongoDB

### MongoDB Local

```bash
# Démarrer MongoDB
sudo systemctl start mongod

# Arrêter MongoDB
sudo systemctl stop mongod

# Statut
sudo systemctl status mongod

# Se connecter au shell
mongosh

# Backup d'une base
mongodump --db fashion-ecommerce --out /backup/

# Restaurer une base
mongorestore --db fashion-ecommerce /backup/fashion-ecommerce/
```

### MongoDB Atlas (Cloud)

```bash
# Tester la connexion depuis le VPS
mongosh "mongodb+srv://cluster.xxxxx.mongodb.net/" --username votre_user

# Ou avec Node.js
node -e "require('mongoose').connect('VOTRE_URI').then(() => console.log('Connecté!')).catch(e => console.error(e))"
```

---

## 🔥 Pare-feu (UFW)

### Gestion du Pare-feu

```bash
# Voir le statut
sudo ufw status

# Activer le pare-feu
sudo ufw enable

# Désactiver
sudo ufw disable

# Autoriser un port
sudo ufw allow 22/tcp    # SSH
sudo ufw allow 80/tcp    # HTTP
sudo ufw allow 443/tcp   # HTTPS

# Bloquer un port
sudo ufw deny 3000/tcp

# Supprimer une règle
sudo ufw delete allow 80/tcp

# Voir les règles numérotées
sudo ufw status numbered

# Supprimer par numéro
sudo ufw delete 3

# Réinitialiser toutes les règles
sudo ufw reset
```

---

## 💻 Système (VPS)

### Monitoring des Ressources

```bash
# Utilisation CPU et RAM
htop
# (Installer: sudo apt install htop)

# Espace disque
df -h

# Utilisation par dossier
du -sh /root/fashion-ecommerce

# Mémoire RAM
free -h

# Processus en cours
ps aux

# Processus utilisant le plus de CPU
ps aux --sort=-%cpu | head

# Processus utilisant le plus de RAM
ps aux --sort=-%mem | head

# Uptime du serveur
uptime

# Informations système
uname -a
lsb_release -a
```

### Ports et Connexions

```bash
# Voir quel processus écoute sur un port
sudo lsof -i :3000
sudo lsof -i :80

# Voir toutes les connexions actives
sudo netstat -tulpn

# Tuer un processus par PID
sudo kill -9 PID

# Tuer tous les processus Node
sudo pkill -f node
```

### Fichiers et Dossiers

```bash
# Taille d'un dossier
du -sh /root/fashion-ecommerce

# Trouver les gros fichiers (> 100MB)
find /root -type f -size +100M

# Nettoyer les logs anciens
sudo find /var/log -type f -name "*.log" -mtime +30 -delete

# Permissions
sudo chown -R www-data:www-data /root/fashion-ecommerce
sudo chmod -R 755 /root/fashion-ecommerce
```

---

## 🔄 Déploiement & Mise à Jour

### Workflow Complet

```bash
# 1. Aller dans le dossier
cd /root/fashion-ecommerce

# 2. Sauvegarder (optionnel)
cp -r /root/fashion-ecommerce /root/fashion-ecommerce-backup-$(date +%Y%m%d)

# 3. Récupérer les modifications
git pull origin main

# 4. Installer les nouvelles dépendances
npm install --production

# 5. Build
npm run build

# 6. Redémarrer l'app
pm2 restart fashion-ecommerce

# 7. Vérifier
pm2 logs fashion-ecommerce
```

### Script Automatique

```bash
# Rendre le script exécutable
chmod +x deploy.sh

# Exécuter le déploiement
bash deploy.sh
```

---

## 🐛 Debugging

### Vérifications Rapides

```bash
# L'app tourne ?
pm2 status

# Nginx tourne ?
sudo systemctl status nginx

# MongoDB accessible ?
mongosh "VOTRE_URI"

# Port 3000 occupé ?
sudo lsof -i :3000

# Test de l'API
curl http://localhost:3000/api/products

# Test HTTPS
curl -I https://votresite.com
```

### Logs Complets

```bash
# Tous les logs PM2
pm2 logs --lines 200

# Logs Nginx erreur
sudo tail -100 /var/log/nginx/error.log

# Logs système
sudo journalctl -xe

# Logs de l'application
tail -f /root/logs/fashion-ecommerce-error.log
```

---

## 📊 Performance

### Analyse

```bash
# Temps de chargement
curl -o /dev/null -s -w 'Total: %{time_total}s\n' https://votresite.com

# Tester la bande passante
speedtest-cli
# (Installer: sudo apt install speedtest-cli)

# Analyse des connexions
ss -s
```

---

## 🔐 Sécurité

### Mises à Jour Système

```bash
# Mettre à jour les packages
sudo apt update && sudo apt upgrade -y

# Nettoyer les anciens paquets
sudo apt autoremove -y

# Voir les mises à jour de sécurité
sudo apt list --upgradable
```

### Connexions SSH

```bash
# Voir les connexions actives
who

# Historique des connexions
last

# Tentatives de connexion échouées
sudo grep "Failed password" /var/log/auth.log
```

---

## 💾 Backup

### Backup Rapide

```bash
# Backup de l'application
tar -czf fashion-ecommerce-backup-$(date +%Y%m%d).tar.gz /root/fashion-ecommerce

# Backup MongoDB (si local)
mongodump --db fashion-ecommerce --out /root/backups/mongo-$(date +%Y%m%d)

# Télécharger le backup via SCP (depuis Windows)
scp root@VOTRE_IP:/root/fashion-ecommerce-backup-*.tar.gz D:\backups\
```

---

## 🆘 Urgences

### Redémarrage Complet

```bash
# Tout redémarrer
pm2 restart all
sudo systemctl restart nginx
sudo systemctl restart mongod  # si MongoDB local

# Redémarrer le VPS (dernier recours)
sudo reboot
```

### En Cas de Crash

```bash
# 1. Vérifier les logs
pm2 logs fashion-ecommerce --err

# 2. Redémarrer l'app
pm2 restart fashion-ecommerce

# 3. Si ça ne marche pas, rebuild
cd /root/fashion-ecommerce
npm run build
pm2 restart fashion-ecommerce
```

---

## 📋 Checklist Quotidienne

```bash
# Matin (2 minutes)
pm2 status              # App tourne ?
df -h                   # Espace disque OK ?
free -h                 # RAM OK ?

# Soir (optionnel)
pm2 logs --lines 50     # Pas d'erreurs ?
sudo tail -20 /var/log/nginx/error.log  # Nginx OK ?
```

---

## 🔖 Raccourcis Utiles

Ajoutez ces alias dans `~/.bashrc` :

```bash
# Éditer .bashrc
nano ~/.bashrc

# Ajouter à la fin :
alias app-status='pm2 status'
alias app-logs='pm2 logs fashion-ecommerce'
alias app-restart='pm2 restart fashion-ecommerce'
alias nginx-reload='sudo systemctl reload nginx'
alias nginx-test='sudo nginx -t'
alias goto-app='cd /root/fashion-ecommerce'

# Recharger
source ~/.bashrc
```

Maintenant vous pouvez taper `app-status` au lieu de `pm2 status` !

---

**Gardez ce fichier sous la main ! 📌**
