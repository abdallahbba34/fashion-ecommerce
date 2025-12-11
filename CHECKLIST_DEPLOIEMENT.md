# ✅ Checklist de Déploiement LWS

## Avant le Déploiement

### 1. Préparation Locale
- [ ] Projet fonctionne en local (`npm run dev`)
- [ ] Build réussit sans erreur (`npm run build`)
- [ ] Fichier `.env.production.example` copié en `.env.production`
- [ ] Variables d'environnement configurées dans `.env.production`
- [ ] JWT_SECRET généré de manière sécurisée
- [ ] Code poussé sur Git (si utilisation de Git)

### 2. MongoDB
- [ ] Compte MongoDB Atlas créé (ou MongoDB local)
- [ ] Cluster MongoDB créé
- [ ] Utilisateur database créé
- [ ] IP whitelist configurée (0.0.0.0/0 ou IP du VPS)
- [ ] Connection string récupérée et testée

### 3. LWS - Commande VPS
- [ ] VPS LWS commandé (minimum VPS-S)
- [ ] Accès SSH reçu (IP, user, password)
- [ ] Domaine configuré et pointant vers l'IP du VPS
- [ ] DNS configurés (A record vers IP du VPS)

---

## Sur le VPS LWS

### 4. Configuration Initiale du Serveur
- [ ] Connexion SSH réussie
- [ ] Système mis à jour (`sudo apt update && sudo apt upgrade`)
- [ ] Node.js 20 installé et vérifié (`node -v`)
- [ ] PM2 installé globalement (`sudo npm install -g pm2`)
- [ ] Nginx installé (`sudo apt install nginx`)

### 5. Déploiement du Projet
- [ ] Projet transféré sur le VPS (Git ou SCP)
- [ ] Fichier `.env.production` créé avec les bonnes valeurs
- [ ] Dépendances installées (`npm install --production`)
- [ ] Build réussi (`npm run build`)
- [ ] Fichier `ecosystem.config.js` configuré avec le bon path

### 6. Configuration PM2
- [ ] Application démarrée avec PM2 (`pm2 start ecosystem.config.js`)
- [ ] Application visible dans `pm2 status`
- [ ] Logs OK (`pm2 logs fashion-ecommerce`)
- [ ] PM2 startup configuré (`pm2 startup` + `pm2 save`)

### 7. Configuration Nginx
- [ ] Fichier de config Nginx créé (`/etc/nginx/sites-available/fashion-ecommerce`)
- [ ] Lien symbolique créé (`/etc/nginx/sites-enabled/`)
- [ ] Nom de domaine configuré dans le fichier
- [ ] Test Nginx réussi (`sudo nginx -t`)
- [ ] Nginx redémarré (`sudo systemctl restart nginx`)

### 8. SSL/HTTPS
- [ ] Certbot installé
- [ ] Certificat SSL obtenu (`sudo certbot --nginx -d votresite.com`)
- [ ] HTTPS fonctionne
- [ ] Redirection HTTP → HTTPS active
- [ ] Renouvellement automatique testé (`sudo certbot renew --dry-run`)

### 9. Sécurité
- [ ] Pare-feu configuré (UFW)
- [ ] Ports autorisés : 22 (SSH), 80 (HTTP), 443 (HTTPS)
- [ ] JWT_SECRET différent de la version locale
- [ ] MongoDB accessible uniquement depuis le VPS (si local)
- [ ] Mots de passe forts utilisés partout

---

## Tests Post-Déploiement

### 10. Vérifications Fonctionnelles
- [ ] Site accessible via https://votresite.com
- [ ] Page d'accueil s'affiche correctement
- [ ] Catalogue produits fonctionne
- [ ] Panier fonctionne
- [ ] Processus de commande fonctionne
- [ ] Admin accessible (`/admin`)
- [ ] Création de produit fonctionne
- [ ] Gestion des commandes fonctionne
- [ ] Images s'affichent correctement
- [ ] Version mobile responsive

### 11. Tests Techniques
- [ ] PM2 redémarre l'app en cas de crash (`pm2 monit`)
- [ ] Logs PM2 accessibles et sans erreurs
- [ ] Logs Nginx sans erreurs critiques
- [ ] Connexion MongoDB stable
- [ ] Performance acceptable (temps de chargement < 3s)
- [ ] Certificat SSL valide (cadenas vert)

### 12. Base de Données
- [ ] Connexion MongoDB Atlas/Local fonctionne
- [ ] Collections créées automatiquement
- [ ] Données de test ajoutées (produits, catégories)
- [ ] Backup MongoDB configuré

---

## Maintenance Continue

### 13. Monitoring
- [ ] PM2 monit vérifié régulièrement
- [ ] Logs vérifiés quotidiennement
- [ ] Espace disque surveillé (`df -h`)
- [ ] Utilisation RAM surveillée (`free -h`)
- [ ] MongoDB Atlas metrics vérifiés

### 14. Mises à Jour
- [ ] Process de déploiement documenté
- [ ] Script `deploy.sh` testé
- [ ] Git configuré pour les mises à jour
- [ ] Backup avant chaque mise à jour

### 15. Backup
- [ ] Backup MongoDB planifié (Atlas auto ou script)
- [ ] Backup fichiers statiques/uploads
- [ ] Plan de restauration testé

---

## Commandes Utiles à Garder

```bash
# Voir les logs
pm2 logs fashion-ecommerce

# Redémarrer l'app
pm2 restart fashion-ecommerce

# Voir les ressources
pm2 monit

# Logs Nginx
sudo tail -f /var/log/nginx/fashion-ecommerce-error.log

# Tester Nginx
sudo nginx -t

# Redémarrer Nginx
sudo systemctl restart nginx

# Voir l'espace disque
df -h

# Voir la RAM
free -h

# Processus écoutant sur le port 3000
sudo lsof -i :3000
```

---

## En Cas de Problème

### Site inaccessible
1. Vérifier PM2 : `pm2 status`
2. Vérifier Nginx : `sudo systemctl status nginx`
3. Vérifier les logs : `pm2 logs` et `sudo tail /var/log/nginx/error.log`

### Erreur 502 Bad Gateway
1. L'application Next.js ne tourne pas → `pm2 restart fashion-ecommerce`
2. Port incorrect dans Nginx → vérifier `proxy_pass http://localhost:3000`

### Erreur de connexion MongoDB
1. Vérifier `.env.production`
2. Vérifier IP whitelist dans MongoDB Atlas
3. Vérifier les credentials

---

## Support

- **LWS Support** : https://aide.lws.fr
- **Documentation Next.js** : https://nextjs.org/docs
- **MongoDB Atlas** : https://docs.atlas.mongodb.com
- **PM2** : https://pm2.keymetrics.io/docs

---

**Bon déploiement ! 🚀**
