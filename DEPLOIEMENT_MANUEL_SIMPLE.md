# Déploiement Manuel Simple (sans clé SSH)

## 🚀 Guide de déploiement pas à pas

Puisque vous n'avez pas encore configuré de clé SSH, voici comment déployer manuellement.

## Étape 1 : Build local

Sur votre PC Windows :

```bash
cd D:\ecom
npm run build
```

Attendez que le build se termine (environ 1-2 minutes).

## Étape 2 : Connexion au VPS

Utilisez PuTTY, MobaXterm ou Git Bash pour vous connecter :

**Avec Git Bash :**
```bash
ssh lwsuser@180.149.198.89
```

Entrez le mot de passe lorsque demandé.

## Étape 3 : Sauvegarde sur le VPS

Une fois connecté au VPS, créez une sauvegarde :

```bash
cd /home/lwsuser
cp -r ecom ecom-backup-$(date +%Y%m%d-%H%M%S)
ls -lht ecom-backup-*
```

## Étape 4 : Transférer les fichiers

### Option A : Avec WinSCP (Recommandé pour Windows)

1. Téléchargez et installez [WinSCP](https://winscp.net/)
2. Créez une nouvelle connexion :
   - Host: `180.149.198.89`
   - User: `lwsuser`
   - Password: [votre mot de passe]
3. Connectez-vous
4. Naviguez vers `/home/lwsuser/ecom`
5. Depuis votre PC, sélectionnez tous les fichiers SAUF :
   - `node_modules/`
   - `.git/`
   - `.next/`
   - `.env.local`
   - `public/uploads/*`
6. Uploadez les fichiers (cela prendra quelques minutes)
7. Uploadez aussi le fichier `.env.production` et renommez-le en `.env.production` sur le serveur

### Option B : Avec rsync (Git Bash)

```bash
rsync -avz --delete \
    --exclude 'node_modules' \
    --exclude '.git' \
    --exclude '.next' \
    --exclude '.env.local' \
    --exclude 'public/uploads/*' \
    lwsuser@180.149.198.89:/home/lwsuser/ecom/
```

Entrez le mot de passe quand demandé.

### Option C : Avec SCP (Git Bash - Fichier par fichier)

Pour les fichiers importants uniquement :

```bash
scp -r components/ lwsuser@180.149.198.89:/home/lwsuser/ecom/
scp -r app/ lwsuser@180.149.198.89:/home/lwsuser/ecom/
scp -r models/ lwsuser@180.149.198.89:/home/lwsuser/ecom/
scp -r types/ lwsuser@180.149.198.89:/home/lwsuser/ecom/
scp -r lib/ lwsuser@180.149.198.89:/home/lwsuser/ecom/
scp -r hooks/ lwsuser@180.149.198.89:/home/lwsuser/ecom/
scp package.json lwsuser@180.149.198.89:/home/lwsuser/ecom/
scp .env.production lwsuser@180.149.198.89:/home/lwsuser/ecom/
```

## Étape 5 : Build sur le VPS

De retour dans votre session SSH sur le VPS :

```bash
cd /home/lwsuser/ecom

# Installer les dépendances
npm install

# Build
npm run build
```

Attendez que le build se termine (peut prendre 2-5 minutes).

## Étape 6 : Redémarrer l'application

```bash
# Arrêter l'ancienne version
pm2 stop ecom
pm2 delete ecom

# Démarrer la nouvelle version
pm2 start npm --name "ecom" -- start -- -p 3000

# Sauvegarder la configuration PM2
pm2 save

# Vérifier le statut
pm2 status
```

Vous devriez voir :
```
┌────┬────────┬─────────────┬───────┬────────┬──────────┐
│ id │ name   │ mode        │ ↺     │ status │ cpu      │
├────┼────────┼─────────────┼───────┼────────┼──────────┤
│ 0  │ ecom   │ fork        │ 0     │ online │ 0%       │
└────┴────────┴─────────────┴───────┴────────┴──────────┘
```

## Étape 7 : Vérifier les logs

```bash
pm2 logs ecom --lines 20
```

Vérifiez qu'il n'y a pas d'erreurs. Vous devriez voir :
```
Server started on http://localhost:3000
Connected to MongoDB
```

## Étape 8 : Tester le site

Ouvrez votre navigateur et allez sur :
- http://lasuitechic.online
- http://180.149.198.89:3000

## ✅ Vérifications post-déploiement

### 1. Tester le formulaire Yalidine

1. Allez sur http://lasuitechic.online/admin
2. Connectez-vous
3. Allez dans "Commandes"
4. Cliquez sur une commande
5. Cliquez sur "Remettre au livreur Yalidine"
6. **Le nouveau formulaire modal devrait s'afficher !**

### 2. Tester le tracking Facebook

1. Créez un lien de test : `http://lasuitechic.online/products/votre-produit?source=facebook`
2. Ouvrez ce lien
3. Ajoutez un produit au panier
4. Allez au checkout
5. **Le champ "Comment nous avez-vous connu?" devrait afficher "Facebook" pré-sélectionné**

### 3. Voir les statistiques

1. Allez dans le Dashboard Admin
2. **Vous devriez voir une nouvelle section "Commandes par source"**

## 🐛 Résolution de problèmes

### Problème : Le site ne s'affiche pas

**Solution :**
```bash
pm2 logs ecom --lines 50
```

Cherchez les erreurs. Problèmes courants :
- MongoDB non connecté → Vérifiez `.env.production`
- Port déjà utilisé → `pm2 delete ecom` puis relancez
- Erreur de build → Re-buildez avec `npm run build`

### Problème : Erreur "MODULE_NOT_FOUND"

**Solution :**
```bash
cd /home/lwsuser/ecom
rm -rf node_modules
npm install
npm run build
pm2 restart ecom
```

### Problème : Le formulaire Yalidine ne s'affiche pas

**Solutions :**
1. Vérifiez que le fichier existe :
   ```bash
   ls -la /home/lwsuser/ecom/components/YalidineParcelForm.tsx
   ```

2. Clearez le cache du navigateur (Ctrl+Shift+R)

3. Vérifiez la console du navigateur (F12)

### Problème : Les statistiques par source ne s'affichent pas

**Solutions :**
1. Vérifiez les logs :
   ```bash
   pm2 logs ecom
   ```

2. Vérifiez que le fichier API existe :
   ```bash
   ls -la /home/lwsuser/ecom/app/api/stats/by-source/route.ts
   ```

## 📊 Commandes utiles

### Voir les logs en temps réel
```bash
pm2 logs ecom
```

### Redémarrer l'application
```bash
pm2 restart ecom
```

### Voir l'utilisation des ressources
```bash
pm2 monit
```

### Arrêter l'application
```bash
pm2 stop ecom
```

### Démarrer l'application
```bash
pm2 start ecom
```

## 🔑 Configuration SSH pour le futur (Optionnel)

Pour faciliter les futurs déploiements, créez une clé SSH :

### Sur Windows (Git Bash) :

```bash
# Générer une clé SSH
ssh-keygen -t rsa -b 4096 -f ~/.ssh/id_rsa_lws

# Copier la clé sur le VPS
ssh-copy-id -i ~/.ssh/id_rsa_lws.pub lwsuser@180.149.198.89
```

Après cela, vous pourrez utiliser le script automatique `deploy-complete.sh`.

## 🎉 Félicitations !

Si tout fonctionne, votre site est maintenant déployé avec :
- ✅ Formulaire Yalidine complet
- ✅ Tracking Facebook/Instagram/WhatsApp
- ✅ Statistiques par source
- ✅ Système de partage social

## 📚 Documentation disponible

- `GUIDE_DEMARRAGE_FACEBOOK.md` - Comment utiliser Facebook
- `INTEGRATION_FACEBOOK.md` - Guide complet Facebook
- `AMELIORATION_YALIDINE.md` - Utilisation du formulaire Yalidine
- `DEPLOIEMENT_COMPLET.md` - Guide complet de déploiement

**Bonne vente ! 🚀**
