# 🔍 Vérification du site - Commandes SSH

Guide étape par étape pour vérifier votre site via le terminal SSH LWS.

---

## ✅ ÉTAPE 1 : Vérifier le répertoire du site

**Dans votre terminal SSH, copiez-collez cette commande :**

```bash
ls -la /var/www/lasuitechic
```

### Résultats possibles :

#### A) Le dossier existe et contient des fichiers
Vous voyez :
```
drwxr-xr-x  app/
drwxr-xr-x  components/
drwxr-xr-x  lib/
-rw-r--r--  package.json
...
```
✅ **PARFAIT !** → Passez à l'ÉTAPE 2

#### B) "No such file or directory"
❌ Le site n'est pas encore déployé → Passez à l'ÉTAPE 8 (Déploiement)

---

## ✅ ÉTAPE 2 : Naviguer vers le dossier

```bash
cd /var/www/lasuitechic
pwd
```

**Résultat attendu :**
```
/var/www/lasuitechic
```

---

## ✅ ÉTAPE 3 : Vérifier les fichiers importants

```bash
ls -la | grep -E "package.json|.env.production|next.config"
```

**Vous devriez voir :**
```
-rw-r--r--  package.json
-rw-r--r--  .env.production
-rw-r--r--  next.config.mjs
```

### Si .env.production est manquant :
**Créez-le maintenant** (voir ÉTAPE 9)

---

## ✅ ÉTAPE 4 : Vérifier node_modules

```bash
ls -d node_modules 2>/dev/null && echo "✅ node_modules existe" || echo "❌ node_modules manquant"
```

### Si "❌ node_modules manquant" :
```bash
npm install
```
⏱️ Attendez 2-3 minutes

---

## ✅ ÉTAPE 5 : Vérifier le build (.next)

```bash
ls -d .next 2>/dev/null && echo "✅ Build existe" || echo "❌ Build manquant"
```

### Si "❌ Build manquant" :
```bash
npm run build
```
⏱️ Attendez 1-2 minutes

---

## ✅ ÉTAPE 6 : Vérifier PM2

```bash
pm2 list
```

### Résultats possibles :

#### A) L'application tourne (status = online)
```
┌────┬──────┬──────────┬─────┬─────────┬──────┐
│ id │ name │ mode     │ ↺   │ status  │ cpu  │
├────┼──────┼──────────┼─────┼─────────┼──────┤
│ 0  │ ecom │ fork     │ 0   │ online  │ 0%   │
└────┴──────┴──────────┴─────┴─────────┴──────┘
```
✅ **EXCELLENT !** → Passez à l'ÉTAPE 7 (Test final)

#### B) L'application est stopped
```
│ 0  │ ecom │ fork     │ 5   │ stopped │ 0%   │
```
❌ Redémarrez :
```bash
pm2 restart ecom
pm2 logs ecom --lines 20
```

#### C) Liste vide (aucune application)
```
┌────┬──────┬──────────┬─────┬─────────┬──────┐
│ id │ name │ mode     │ ↺   │ status  │ cpu  │
└────┴──────┴──────────┴─────┴─────────┴──────┘
```
❌ L'app n'est pas démarrée → Passez à l'ÉTAPE 10 (Démarrer l'app)

---

## ✅ ÉTAPE 7 : Tester le site

### 7.1 Test local (sur le serveur)
```bash
curl -I http://localhost:3000
```

**Résultat attendu :**
```
HTTP/1.1 200 OK
...
```
✅ Si vous voyez "200 OK" → Le site fonctionne !

### 7.2 Test dans votre navigateur

Ouvrez :
- **http://lasuitechic.online**
- **http://180.149.198.89**

---

## 🎉 Si tout fonctionne !

Votre site est EN LIGNE ! ✅

**Vérifications finales :**
- [ ] La page d'accueil s'affiche
- [ ] Les images des produits apparaissent
- [ ] Le panier fonctionne
- [ ] L'admin est accessible : http://lasuitechic.online/admin/login

---

## ❌ ÉTAPE 8 : Si le dossier /var/www/lasuitechic n'existe pas

Le site n'a jamais été déployé. Vous avez 2 options :

### Option A : Créer le dossier et utiliser WinSCP

```bash
sudo mkdir -p /var/www/lasuitechic
sudo chown -R lwsuser:lwsuser /var/www/lasuitechic
```

Ensuite, dans **WinSCP** :
1. Naviguez vers `/var/www/lasuitechic` (panneau droit)
2. Transférez tous vos fichiers depuis `D:\ecom` (panneau gauche)

### Option B : Utiliser le dossier /home/lwsuser/ecom

```bash
# Vérifier si ce dossier existe
ls -la /home/lwsuser/ecom

# Si oui, l'utiliser à la place
cd /home/lwsuser/ecom
```

**Continuez avec les étapes 2-6 en utilisant ce chemin.**

---

## ❌ ÉTAPE 9 : Créer .env.production (si manquant)

```bash
cd /var/www/lasuitechic
nano .env.production
```

**Copiez-collez ce contenu :**

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

**Sauvegarder :**
- `Ctrl + O` (enregistrer)
- `Entrée`
- `Ctrl + X` (quitter)

**Vérifier :**
```bash
cat .env.production
```

---

## ❌ ÉTAPE 10 : Démarrer l'application avec PM2

### 10.1 Vérifier que PM2 est installé
```bash
pm2 --version
```

**Si "command not found" :**
```bash
npm install -g pm2
```

### 10.2 Démarrer l'application
```bash
cd /var/www/lasuitechic

# Arrêter toute ancienne version
pm2 stop ecom 2>/dev/null
pm2 delete ecom 2>/dev/null

# Démarrer la nouvelle version
pm2 start npm --name "ecom" -- start -- -p 3000

# Sauvegarder la configuration
pm2 save

# Configurer le démarrage automatique
pm2 startup
```

### 10.3 Vérifier le statut
```bash
pm2 status
```

Vous devriez voir `status: online` ✅

### 10.4 Voir les logs
```bash
pm2 logs ecom --lines 30
```

Cherchez les erreurs (texte en rouge).

---

## 🐛 Dépannage rapide

### Erreur : "Cannot find module..."
```bash
cd /var/www/lasuitechic
rm -rf node_modules package-lock.json
npm install
npm run build
pm2 restart ecom
```

### Erreur : "Port 3000 already in use"
```bash
pm2 delete all
lsof -i :3000  # Notez le PID
kill -9 <PID>  # Remplacez <PID>
pm2 start npm --name "ecom" -- start -- -p 3000
```

### Erreur : "Cannot connect to MongoDB"
```bash
cat .env.production | grep MONGODB_URI
# Vérifiez que l'URI est correcte
```

### Le site affiche "502 Bad Gateway"
```bash
# 1. Vérifier PM2
pm2 status

# 2. Redémarrer Nginx
sudo systemctl restart nginx

# 3. Vérifier les logs
pm2 logs ecom --lines 50
```

---

## 📊 Diagnostic complet (en cas de problème)

**Copiez-collez ce bloc entier :**

```bash
echo "======================================"
echo "DIAGNOSTIC COMPLET"
echo "======================================"
echo ""
echo "1. CHEMIN ACTUEL:"
pwd
echo ""
echo "2. FICHIERS DU PROJET:"
ls -la /var/www/lasuitechic | head -15
echo ""
echo "3. NODE & NPM:"
node --version
npm --version
echo ""
echo "4. PM2 STATUS:"
pm2 list
echo ""
echo "5. PORT 3000:"
netstat -tlnp | grep :3000
echo ""
echo "6. TEST LOCALHOST:"
curl -I http://localhost:3000 2>&1 | head -5
echo ""
echo "7. LOGS RECENTS (dernières 10 lignes):"
pm2 logs ecom --lines 10 --nostream 2>&1
echo ""
echo "======================================"
```

**Envoyez-moi le résultat !**

---

## ✅ Checklist finale

Une fois tout configuré :

- [ ] Dossier `/var/www/lasuitechic` existe
- [ ] Fichier `.env.production` configuré
- [ ] `node_modules/` installé
- [ ] Build `.next/` créé
- [ ] PM2 status = "online"
- [ ] `curl http://localhost:3000` retourne 200
- [ ] Site accessible : http://lasuitechic.online
- [ ] Images s'affichent
- [ ] Admin fonctionne

**Félicitations ! 🎉**
