# Guide de déploiement complet

## 🚀 Déploiement des nouveautés Facebook & Yalidine

Ce guide vous aide à déployer toutes les nouvelles fonctionnalités sur votre VPS.

## 📦 Nouveautés incluses

### 1. Formulaire Yalidine amélioré
- Formulaire modal avec tous les champs requis
- Vérification avant envoi à l'API Yalidine
- Moins d'erreurs lors de la création de colis

### 2. Tracking Facebook
- Tracking automatique des sources (Facebook, Instagram, WhatsApp, etc.)
- Statistiques détaillées par canal dans le Dashboard Admin
- Champ "Comment nous avez-vous connu?" dans le checkout

### 3. Améliorations générales
- Meilleure gestion des erreurs
- Interface admin enrichie
- Documentation complète

## 🔧 Pré-requis

Avant de déployer, assurez-vous d'avoir :

- [x] Accès SSH à votre VPS (180.149.198.89)
- [x] Clé SSH configurée (`~/.ssh/id_rsa_lws`)
- [x] Rsync installé (pour Windows, via Git Bash ou WSL)
- [x] Node.js et npm installés localement

## 📋 Étapes de déploiement

### Option 1 : Déploiement automatique (Recommandé)

#### Sur Windows (Git Bash ou WSL)
```bash
cd D:\ecom
bash scripts/deploy-complete.sh
```

#### Sur Windows (CMD)
```batch
cd D:\ecom
scripts\deploy-complete.bat
```

Le script effectue automatiquement :
1. ✅ Vérification de la connexion VPS
2. ✅ Build local du projet
3. ✅ Sauvegarde du code actuel sur le VPS
4. ✅ Synchronisation des fichiers
5. ✅ Copie des variables d'environnement
6. ✅ Installation des dépendances sur le VPS
7. ✅ Build sur le VPS
8. ✅ Redémarrage de l'application

### Option 2 : Déploiement manuel

Si vous préférez faire étape par étape :

#### 1. Build local
```bash
cd D:\ecom
npm run build
```

#### 2. Connexion au VPS
```bash
ssh -i ~/.ssh/id_rsa_lws lwsuser@180.149.198.89
```

#### 3. Sauvegarde (sur le VPS)
```bash
cd /home/lwsuser
cp -r ecom ecom-backup-$(date +%Y%m%d-%H%M%S)
```

#### 4. Synchronisation (depuis votre PC)
```bash
rsync -avz --delete \
    --exclude 'node_modules' \
    --exclude '.git' \
    --exclude '.next' \
    --exclude '.env.local' \
    -e "ssh -i ~/.ssh/id_rsa_lws" \
    ./ lwsuser@180.149.198.89:/home/lwsuser/ecom/
```

#### 5. Copie .env.production
```bash
scp -i ~/.ssh/id_rsa_lws .env.production lwsuser@180.149.198.89:/home/lwsuser/ecom/.env.production
```

#### 6. Build sur le VPS (connecté en SSH)
```bash
cd /home/lwsuser/ecom
npm install
npm run build
```

#### 7. Redémarrage
```bash
pm2 stop ecom
pm2 delete ecom
pm2 start npm --name "ecom" -- start -- -p 3000
pm2 save
```

## ✅ Vérification post-déploiement

### 1. Vérifier que le site fonctionne
```bash
# Depuis votre navigateur
http://lasuitechic.online
http://180.149.198.89:3000
```

### 2. Vérifier les logs
```bash
ssh -i ~/.ssh/id_rsa_lws lwsuser@180.149.198.89
pm2 logs ecom
```

### 3. Vérifier le statut
```bash
ssh -i ~/.ssh/id_rsa_lws lwsuser@180.149.198.89
pm2 status
```

Le statut doit afficher :
```
┌────┬────────┬─────────────┬───────┬────────┬──────────┐
│ id │ name   │ mode        │ ↺     │ status │ cpu      │
├────┼────────┼─────────────┼───────┼────────┼──────────┤
│ 0  │ ecom   │ fork        │ 0     │ online │ 0%       │
└────┴────────┴─────────────┴───────┴────────┴──────────┘
```

### 4. Tester le formulaire Yalidine

1. Connectez-vous à l'admin : `http://lasuitechic.online/admin`
2. Allez dans une commande
3. Cliquez sur "Remettre au livreur Yalidine"
4. Le formulaire modal doit s'afficher avec tous les champs

### 5. Tester le tracking Facebook

1. Créez un lien tracké : `http://lasuitechic.online/products/un-produit?source=facebook`
2. Ouvrez ce lien dans un nouvel onglet
3. Ajoutez au panier et passez une commande test
4. Dans le checkout, vérifiez que "Facebook" est pré-sélectionné dans "Comment nous avez-vous connu?"
5. Complétez la commande
6. Dans l'admin, Dashboard, vérifiez la section "Commandes par source"

## 🐛 Résolution de problèmes

### Problème : Le site ne démarre pas

**Solution :**
```bash
ssh -i ~/.ssh/id_rsa_lws lwsuser@180.149.198.89
cd /home/lwsuser/ecom
pm2 logs ecom --lines 50
```

Cherchez les erreurs dans les logs.

### Problème : Erreur MongoDB

**Solution :**
Vérifiez que la variable `MONGODB_URI` est correcte dans `.env.production` :
```bash
ssh -i ~/.ssh/id_rsa_lws lwsuser@180.149.198.89
cat /home/lwsuser/ecom/.env.production
```

### Problème : Page blanche ou erreur 500

**Solution :**
1. Vérifiez les logs : `pm2 logs ecom`
2. Vérifiez que le build s'est bien passé :
   ```bash
   cd /home/lwsuser/ecom
   ls -la .next/
   ```
3. Rebuild si nécessaire :
   ```bash
   npm run build
   pm2 restart ecom
   ```

### Problème : "Cannot connect to MongoDB"

**Solution :**
Vérifiez la connexion internet du VPS et que MongoDB Atlas autorise l'IP du VPS.

### Problème : Formulaire Yalidine ne s'affiche pas

**Solution :**
1. Vérifiez que le fichier `components/YalidineParcelForm.tsx` existe
2. Vérifiez les logs du navigateur (F12 > Console)
3. Clearez le cache du navigateur (Ctrl+Shift+R)

## 📊 Monitoring

### Surveiller l'application en temps réel
```bash
ssh -i ~/.ssh/id_rsa_lws lwsuser@180.149.198.89
pm2 monit
```

### Voir les statistiques
```bash
pm2 status
```

### Redémarrer l'application
```bash
ssh -i ~/.ssh/id_rsa_lws lwsuser@180.149.198.89
pm2 restart ecom
```

## 🔄 Rollback (Revenir en arrière)

Si le déploiement pose problème, vous pouvez revenir à la version précédente :

```bash
ssh -i ~/.ssh/id_rsa_lws lwsuser@180.149.198.89
cd /home/lwsuser

# Voir les sauvegardes disponibles
ls -lht ecom-backup-*

# Restaurer une sauvegarde (remplacez la date)
pm2 stop ecom
rm -rf ecom
cp -r ecom-backup-20250127-143000 ecom
cd ecom
pm2 start npm --name "ecom" -- start -- -p 3000
pm2 save
```

## 📝 Checklist finale

Après le déploiement, vérifiez :

- [ ] Le site est accessible sur http://lasuitechic.online
- [ ] Le Dashboard Admin fonctionne
- [ ] Le formulaire Yalidine s'affiche correctement
- [ ] Les statistiques par source apparaissent dans le Dashboard
- [ ] Le checkout affiche le champ "Comment nous avez-vous connu?"
- [ ] Les logs PM2 ne montrent pas d'erreurs
- [ ] Une commande test peut être créée

## 🎯 Prochaines étapes

Une fois le déploiement réussi :

1. **Testez le formulaire Yalidine** avec une vraie commande
2. **Créez votre Page Facebook** et commencez à diffuser
3. **Consultez les guides** :
   - `GUIDE_DEMARRAGE_FACEBOOK.md` - Démarrage rapide Facebook
   - `INTEGRATION_FACEBOOK.md` - Guide complet Facebook
   - `AMELIORATION_YALIDINE.md` - Utilisation du formulaire Yalidine

## 📞 Support

En cas de problème :
1. Consultez les logs : `pm2 logs ecom`
2. Vérifiez les fichiers de documentation
3. Testez en local d'abord avec `npm run dev`

## 🎉 Félicitations !

Votre site e-commerce est maintenant déployé avec :
- ✅ Formulaire Yalidine complet
- ✅ Tracking Facebook/Instagram/WhatsApp
- ✅ Statistiques par source
- ✅ Système de partage social

**Bonne vente ! 🚀**
