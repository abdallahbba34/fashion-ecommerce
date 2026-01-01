# 🔍 Vérification du site sur le serveur

Guide pour vérifier l'état de votre site dans `/var/www/lasuitechic`

## 🔐 Étape 1 : Se connecter au serveur

Vous avez plusieurs options pour accéder au serveur :

### Option A : SSH avec mot de passe

Si vous avez le mot de passe du serveur :

```bash
ssh lwsuser@180.149.198.89
```

Entrez votre mot de passe quand demandé.

### Option B : Panneau de contrôle LWS

1. Connectez-vous à votre panneau LWS : https://panel.lws.fr/
2. Allez dans "VPS" > "Gestion"
3. Cliquez sur "Console Web" ou "Terminal"

### Option C : PuTTY (Windows)

1. Téléchargez PuTTY : https://www.putty.org/
2. Ouvrez PuTTY
3. Configurez :
   - Host Name : `180.149.198.89`
   - Port : `22`
   - Connection type : `SSH`
4. Cliquez "Open"
5. Login : `lwsuser`
6. Entrez votre mot de passe

---

## 📂 Étape 2 : Vérifier le répertoire du site

Une fois connecté au serveur, exécutez ces commandes :

### 2.1 Vérifier si le dossier existe

```bash
ls -la /var/www/lasuitechic
```

**Résultat attendu** : Liste des fichiers du projet

**Si "No such file or directory"** :
```bash
# Vérifier d'autres emplacements possibles
ls -la /var/www/
ls -la /home/lwsuser/
ls -la /home/lwsuser/ecom/
```

### 2.2 Naviguer vers le dossier

```bash
cd /var/www/lasuitechic
pwd  # Affiche le chemin actuel
```

### 2.3 Lister le contenu

```bash
ls -la
```

**Vous devriez voir** :
- `app/` - dossier
- `components/` - dossier
- `lib/` - dossier
- `models/` - dossier
- `public/` - dossier
- `package.json` - fichier
- `.env.production` - fichier
- `next.config.mjs` - fichier
- etc.

---

## 🔍 Étape 3 : Vérifier les fichiers importants

### 3.1 Vérifier package.json

```bash
cat package.json
```

Vérifiez que c'est bien votre projet "fashion-ecommerce".

### 3.2 Vérifier .env.production

```bash
cat .env.production
```

**Vérifiez que ces variables existent** :
- ✅ `MONGODB_URI=...`
- ✅ `JWT_SECRET=...`
- ✅ `NEXT_PUBLIC_APP_URL=...`
- ✅ `YALIDINE_API_ID=...`
- ✅ `YALIDINE_API_TOKEN=...`

⚠️ **Si le fichier n'existe pas**, créez-le (voir section 7).

### 3.3 Vérifier node_modules

```bash
ls -la node_modules/ | head -20
```

**Si le dossier n'existe pas ou est vide** :
```bash
npm install
```

### 3.4 Vérifier le dossier .next (build)

```bash
ls -la .next/
```

**Si le dossier n'existe pas** :
```bash
npm run build
```

---

## 🔄 Étape 4 : Vérifier PM2 (gestionnaire de processus)

### 4.1 Vérifier si PM2 est installé

```bash
pm2 --version
```

**Si "command not found"**, installez PM2 :
```bash
npm install -g pm2
```

### 4.2 Lister les applications PM2

```bash
pm2 list
```

**Résultats possibles** :

**A) L'application tourne** :
```
┌────┬──────────┬─────────────┬─────────┬─────────┬──────────┐
│ id │ name     │ mode        │ ↺       │ status  │ cpu      │
├────┼──────────┼─────────────┼─────────┼─────────┼──────────┤
│ 0  │ ecom     │ fork        │ 0       │ online  │ 0%       │
└────┴──────────┴─────────────┴─────────┴─────────┴──────────┘
```
✅ **Status = "online"** → Tout va bien !

**B) L'application est arrêtée** :
```
│ 0  │ ecom     │ fork        │ 5       │ stopped │ 0%       │
```
❌ **Status = "stopped"** → Il faut la redémarrer (voir section 5)

**C) Aucune application** :
```
┌────┬──────┬─────────────┬─────────┬─────────┬──────────┐
│ id │ name │ mode        │ ↺       │ status  │ cpu      │
└────┴──────┴─────────────┴─────────┴─────────┴──────────┘
```
❌ **Liste vide** → Il faut démarrer l'application (voir section 5)

### 4.3 Voir les logs

```bash
pm2 logs ecom --lines 50
```

Cherchez les erreurs (lignes en rouge).

---

## 🚀 Étape 5 : Démarrer/Redémarrer l'application

### Si l'application n'existe pas dans PM2

```bash
cd /var/www/lasuitechic
pm2 start npm --name "ecom" -- start -- -p 3000
pm2 save
```

### Si l'application est arrêtée

```bash
pm2 restart ecom
```

### Si l'application a des erreurs

```bash
pm2 stop ecom
pm2 delete ecom
cd /var/www/lasuitechic
npm install
npm run build
pm2 start npm --name "ecom" -- start -- -p 3000
pm2 save
```

---

## 🌐 Étape 6 : Vérifier Nginx (serveur web)

### 6.1 Vérifier si Nginx est installé

```bash
sudo nginx -v
```

### 6.2 Vérifier la configuration Nginx

```bash
sudo cat /etc/nginx/sites-available/lasuitechic
```

**Configuration attendue** :
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

### 6.3 Vérifier que Nginx tourne

```bash
sudo systemctl status nginx
```

**Status attendu** : `active (running)`

### 6.4 Redémarrer Nginx (si nécessaire)

```bash
sudo systemctl restart nginx
```

---

## 📝 Étape 7 : Créer/Vérifier .env.production

Si le fichier `.env.production` n'existe pas, créez-le :

```bash
cd /var/www/lasuitechic
nano .env.production
```

**Collez ce contenu** (adaptez les valeurs) :

```env
# Database MongoDB Atlas
MONGODB_URI=mongodb+srv://ecomuser:HByy2RdJEHOQX96C@cluster0.bg0oh1n.mongodb.net/fashion-ecommerce?retryWrites=true&w=majority&appName=Cluster0

# JWT Secret
JWT_SECRET=985bedc061595e6782ed1ff924a4207630a977f1e52648ec821bbf2cdee7251e5dbf45d59b4c6f6acf477fd904105fd60268f67228aeabd7d4c47c951580caa4

# App URL
NEXT_PUBLIC_APP_URL=http://lasuitechic.online

# Node Environment
NODE_ENV=production

# Yalidine API
YALIDINE_API_ID=99569450964952578887
YALIDINE_API_TOKEN=b9XQrNSJ5ukLytnIHBcmjsd03TeaCxigwvRP6DAO82Wo1Vlpfh4M7EqGYUKZzF
```

**Sauvegarder** :
- Appuyez sur `Ctrl + O` (pour enregistrer)
- Appuyez sur `Entrée`
- Appuyez sur `Ctrl + X` (pour quitter)

---

## ✅ Étape 8 : Vérification finale

### 8.1 Vérifier l'état complet

```bash
# 1. Vérifier PM2
pm2 status

# 2. Vérifier les logs (pas d'erreurs)
pm2 logs ecom --lines 20 --nostream

# 3. Vérifier que le port 3000 écoute
sudo netstat -tlnp | grep :3000

# 4. Vérifier Nginx
sudo systemctl status nginx
```

### 8.2 Tester depuis le serveur

```bash
curl http://localhost:3000
```

**Résultat attendu** : HTML du site (code source de la page d'accueil)

### 8.3 Tester depuis votre navigateur

Ouvrez :
- **http://lasuitechic.online**
- **http://180.149.198.89**

---

## 🐛 Problèmes courants

### Problème 1 : "Cannot find module..."

**Solution** :
```bash
cd /var/www/lasuitechic
rm -rf node_modules package-lock.json
npm install
npm run build
pm2 restart ecom
```

### Problème 2 : "EADDRINUSE: Port 3000 already in use"

**Solution** :
```bash
# Trouver le processus
sudo lsof -i :3000

# Tuer le processus (remplacez PID)
kill -9 <PID>

# Ou simplement
pm2 delete all
pm2 start npm --name "ecom" -- start -- -p 3000
```

### Problème 3 : "Error: Cannot connect to MongoDB"

**Solution** :
```bash
# Vérifier .env.production
cat /var/www/lasuitechic/.env.production | grep MONGODB_URI

# Tester la connexion MongoDB
node -e "const mongoose = require('mongoose'); mongoose.connect(process.env.MONGODB_URI).then(() => console.log('OK')).catch(e => console.log('Error:', e.message))"
```

### Problème 4 : Nginx retourne 502 Bad Gateway

**Solution** :
```bash
# Vérifier que l'app tourne
pm2 status

# Vérifier que le port 3000 écoute
sudo netstat -tlnp | grep :3000

# Redémarrer tout
pm2 restart ecom
sudo systemctl restart nginx
```

---

## 📊 Commandes de diagnostic complètes

Copiez-collez ce bloc pour obtenir un diagnostic complet :

```bash
echo "=== DIAGNOSTIC COMPLET ==="
echo ""
echo "1. Répertoire actuel:"
pwd
echo ""
echo "2. Fichiers du projet:"
ls -la /var/www/lasuitechic | head -20
echo ""
echo "3. PM2 Status:"
pm2 status
echo ""
echo "4. Processus Node.js:"
ps aux | grep node
echo ""
echo "5. Port 3000:"
sudo netstat -tlnp | grep :3000
echo ""
echo "6. Nginx status:"
sudo systemctl status nginx | head -10
echo ""
echo "7. Variables d'environnement:"
cat /var/www/lasuitechic/.env.production | grep -v "PASSWORD\|SECRET\|TOKEN"
echo ""
echo "8. Logs récents:"
pm2 logs ecom --lines 10 --nostream
```

Envoyez-moi le résultat pour que je puisse vous aider davantage.

---

## 📞 Besoin d'aide ?

Si vous rencontrez des problèmes, notez :
1. Le message d'erreur exact
2. La commande qui a échoué
3. Le résultat de `pm2 logs ecom --lines 50`

---

## ✅ Checklist de vérification

- [ ] Connexion SSH fonctionne
- [ ] Dossier `/var/www/lasuitechic` existe
- [ ] Fichier `.env.production` existe et est correct
- [ ] `node_modules/` existe et est rempli
- [ ] `.next/` existe (build fait)
- [ ] PM2 installé
- [ ] Application dans PM2 avec status "online"
- [ ] Port 3000 écoute
- [ ] Nginx installé et en marche
- [ ] Configuration Nginx correcte
- [ ] Site accessible sur http://lasuitechic.online

---

**Bonne chance ! 🚀**
