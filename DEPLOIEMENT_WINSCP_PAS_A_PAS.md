# 🚀 Déploiement avec WinSCP - Guide Pas à Pas

Guide complet pour déployer votre site e-commerce en utilisant WinSCP (interface graphique).

## 📋 Ce dont vous avez besoin

- ✅ WinSCP (on va l'installer ensemble)
- ✅ PuTTY (pour exécuter des commandes sur le serveur)
- ✅ Vos informations VPS :
  - IP : `180.149.198.89`
  - Utilisateur : `lwsuser`
  - Clé SSH : `C:\Users\votre-nom\.ssh\id_rsa_lws`

---

## 📥 ÉTAPE 1 : Installer WinSCP et PuTTY

### Télécharger WinSCP

1. Allez sur : https://winscp.net/eng/download.php
2. Cliquez sur **"Download WinSCP"** (version gratuite)
3. Choisissez **"Installation package"**
4. Téléchargez et installez (suivez l'assistant d'installation)

### Télécharger PuTTY

1. Allez sur : https://www.putty.org/
2. Téléchargez **"putty.exe"** et **"puttygen.exe"**
3. Enregistrez-les dans un dossier (ex: `C:\Program Files\PuTTY\`)

---

## 🔑 ÉTAPE 2 : Convertir votre clé SSH (si nécessaire)

WinSCP utilise le format `.ppk` pour les clés SSH. Si votre clé est au format OpenSSH, il faut la convertir.

### 2.1 Ouvrir PuTTYgen

1. Lancez **puttygen.exe**
2. Cliquez sur **"Load"** (Charger)
3. Naviguez vers `C:\Users\votre-nom\.ssh\`
4. Changez le filtre en bas à droite : **"All Files (*.*)"**
5. Sélectionnez **id_rsa_lws** (sans extension)
6. Cliquez **"Ouvrir"**

### 2.2 Sauvegarder au format PPK

1. Cliquez sur **"Save private key"**
2. Cliquez **"Oui"** (si demandé pour la passphrase)
3. Enregistrez comme : `C:\Users\votre-nom\.ssh\id_rsa_lws.ppk`
4. Fermez PuTTYgen

---

## 🔌 ÉTAPE 3 : Configurer la connexion WinSCP

### 3.1 Lancer WinSCP

1. Ouvrez **WinSCP**
2. La fenêtre **"Connexion"** s'ouvre automatiquement

### 3.2 Configurer la session

Dans la fenêtre de connexion, remplissez :

```
┌─────────────────────────────────────────┐
│ Protocole : SFTP                        │
│ Nom d'hôte : 180.149.198.89            │
│ Port : 22                               │
│ Nom d'utilisateur : lwsuser             │
│ Mot de passe : [Laisser vide]          │
└─────────────────────────────────────────┘
```

### 3.3 Configurer la clé SSH

1. Cliquez sur **"Avancé"** (ou "Advanced")
2. Dans le menu de gauche, allez à : **SSH > Authentification**
3. Dans **"Fichier de clé privée"**, cliquez sur **"..."**
4. Naviguez vers : `C:\Users\votre-nom\.ssh\id_rsa_lws.ppk`
5. Sélectionnez le fichier et cliquez **"OK"**
6. Cliquez **"OK"** pour fermer les paramètres avancés

### 3.4 Sauvegarder la session

1. Donnez un nom à la session : **"La Suite Chic VPS"**
2. Cliquez sur **"Enregistrer"**
3. Cliquez sur **"Connexion"**

### 3.5 Première connexion

1. Une alerte de sécurité apparaît (normal pour la première fois)
2. Cliquez **"Oui"** pour faire confiance au serveur
3. Vous êtes maintenant connecté ! 🎉

---

## 📦 ÉTAPE 4 : Préparer les fichiers en local

Avant de transférer, il faut préparer le projet.

### 4.1 Ouvrir PowerShell ou CMD

1. Appuyez sur **Windows + R**
2. Tapez **`cmd`** et appuyez sur Entrée
3. Naviguez vers votre projet :
   ```cmd
   cd D:\ecom
   ```

### 4.2 Build le projet

```cmd
npm run build
```

**Attendez** que le build se termine (cela peut prendre 1-2 minutes).

Vous devriez voir :
```
✓ Compiled successfully
```

⚠️ **Si vous avez des erreurs**, corrigez-les avant de continuer !

### 4.3 Créer le fichier .env.production (si pas fait)

Vérifiez que le fichier `.env.production` existe avec :
```cmd
type .env.production
```

Si le fichier n'existe pas ou est vide, créez-le (je vous aide dans l'étape suivante).

---

## 📤 ÉTAPE 5 : Transférer les fichiers avec WinSCP

### 5.1 Interface WinSCP

Vous avez maintenant 2 panneaux :
- **Gauche** : Votre PC (Windows)
- **Droite** : Le serveur VPS (Linux)

### 5.2 Naviguer vers le bon dossier

**Sur votre PC (panneau gauche)** :
1. Naviguez vers : `D:\ecom`

**Sur le serveur (panneau droite)** :
1. Naviguez vers : `/home/lwsuser/`
2. Si le dossier `ecom` existe déjà, ouvrez-le
3. Sinon, créez-le :
   - Clic droit dans le panneau de droite
   - **"Nouveau" > "Répertoire"**
   - Nom : `ecom`
   - Cliquez **"OK"**

### 5.3 Créer une sauvegarde (IMPORTANT)

Si vous avez déjà un site en ligne, faites une sauvegarde :

1. Dans le panneau de droite, sélectionnez le dossier `ecom`
2. Clic droit > **"Dupliquer"**
3. Renommez en : `ecom-backup-YYYYMMDD` (ex: `ecom-backup-20251227`)
4. Cliquez **"OK"**

### 5.4 Sélectionner les fichiers à transférer

**Dans le panneau GAUCHE (votre PC)** :

**Sélectionnez ces dossiers/fichiers** (utilisez Ctrl+Clic pour sélection multiple) :
- ✅ `app/` (dossier)
- ✅ `components/` (dossier)
- ✅ `contexts/` (dossier)
- ✅ `hooks/` (dossier)
- ✅ `lib/` (dossier)
- ✅ `models/` (dossier)
- ✅ `public/` (dossier)
- ✅ `store/` (dossier)
- ✅ `types/` (dossier)
- ✅ `middleware.ts` (fichier)
- ✅ `next.config.mjs` (fichier)
- ✅ `package.json` (fichier)
- ✅ `package-lock.json` (fichier)
- ✅ `postcss.config.js` (fichier)
- ✅ `tailwind.config.ts` (fichier)
- ✅ `tsconfig.json` (fichier)
- ✅ `.env.production` (fichier)

**❌ NE PAS transférer** :
- ❌ `node_modules/` (trop gros, on réinstallera)
- ❌ `.next/` (sera rebuild sur le serveur)
- ❌ `.git/` (pas nécessaire)
- ❌ `.env.local` (config locale uniquement)
- ❌ Fichiers `.md` (documentation, optionnel)

### 5.5 Transférer les fichiers

1. **Glissez-déposez** tous les fichiers sélectionnés du panneau gauche vers le panneau droite
2. Une fenêtre de confirmation apparaît
3. Cochez **"Remplacer"** si demandé
4. Cliquez **"OK"**
5. **Attendez** que le transfert se termine (barre de progression en bas)

⏱️ **Temps estimé** : 2-5 minutes selon votre connexion

### 5.6 Vérifier le transfert

Dans le panneau de droite, vous devriez voir :
```
/home/lwsuser/ecom/
├── app/
├── components/
├── lib/
├── models/
├── public/
├── package.json
├── .env.production
└── ... (autres fichiers)
```

✅ **Transfert terminé !**

---

## 🖥️ ÉTAPE 6 : Exécuter les commandes sur le serveur

Maintenant il faut installer les dépendances et démarrer le site.

### 6.1 Ouvrir le terminal SSH dans WinSCP

Dans WinSCP :
1. Cliquez sur **"Commandes"** dans le menu (ou "Commands")
2. Sélectionnez **"Ouvrir un terminal"** (ou "Open Terminal")
3. Ou utilisez le raccourci : **Ctrl + T**

Une fenêtre terminal s'ouvre (c'est PuTTY).

### 6.2 Naviguer vers le dossier

Dans le terminal, tapez :
```bash
cd /home/lwsuser/ecom
```

Appuyez sur **Entrée**.

### 6.3 Vérifier que les fichiers sont là

```bash
ls -la
```

Vous devriez voir tous vos fichiers listés.

### 6.4 Installer les dépendances

```bash
npm install
```

⏱️ **Temps estimé** : 2-3 minutes

Attendez que l'installation se termine. Vous verrez des messages défilant.

### 6.5 Build le projet sur le serveur

```bash
npm run build
```

⏱️ **Temps estimé** : 1-2 minutes

Attendez que le build se termine. Vous devriez voir :
```
✓ Compiled successfully
```

### 6.6 Vérifier PM2 (gestionnaire de processus)

```bash
pm2 list
```

Cela affiche les applications en cours d'exécution.

### 6.7 Arrêter l'ancienne version (si elle existe)

```bash
pm2 stop ecom
pm2 delete ecom
```

Si vous voyez "Process not found", c'est normal (première installation).

### 6.8 Démarrer la nouvelle version

```bash
pm2 start npm --name "ecom" -- start -- -p 3000
```

Vous devriez voir :
```
[PM2] Starting npm in fork_mode (1 instance)
[PM2] Done.
```

### 6.9 Sauvegarder la configuration PM2

```bash
pm2 save
```

Cela permet à PM2 de redémarrer automatiquement votre app.

### 6.10 Vérifier le statut

```bash
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

✅ **Status : online** = Tout fonctionne !

### 6.11 Voir les logs (optionnel)

```bash
pm2 logs ecom --lines 30
```

Cela affiche les 30 dernières lignes de logs.

Pour sortir, appuyez sur **Ctrl + C**.

---

## ✅ ÉTAPE 7 : Vérification finale

### 7.1 Tester le site

Ouvrez votre navigateur et allez sur :

1. **http://lasuitechic.online**
2. **http://180.149.198.89:3000**

Votre site devrait s'afficher ! 🎉

### 7.2 Vérifier la page d'accueil

- ✅ Les images des produits s'affichent
- ✅ Les produits sont listés
- ✅ Le menu fonctionne

### 7.3 Tester le panier

1. Ajoutez un produit au panier
2. Vérifiez que le panier fonctionne
3. Allez au checkout

### 7.4 Tester l'admin

1. Allez sur : **http://lasuitechic.online/admin/login**
2. Connectez-vous avec :
   - Email : `admin@lasuitechic.online`
   - Mot de passe : `Admin2025`
3. Vérifiez que le dashboard s'affiche

---

## 🎉 Félicitations !

Votre site est maintenant EN LIGNE ! 🚀

---

## 🔄 Pour les prochaines mises à jour

Quand vous voulez déployer des modifications :

### Méthode rapide (fichiers modifiés uniquement)

1. **Ouvrez WinSCP**
2. **Connectez-vous** (double-clic sur "La Suite Chic VPS")
3. **Naviguez** vers les fichiers modifiés
4. **Glissez-déposez** uniquement les fichiers changés
5. **Dans le terminal** :
   ```bash
   cd /home/lwsuser/ecom
   npm run build
   pm2 restart ecom
   ```

### Méthode complète (si beaucoup de changements)

Répétez les étapes 4 à 6 de ce guide.

---

## 🐛 Résolution de problèmes

### Problème : Le site affiche une erreur 502/503

**Solution** :
```bash
cd /home/lwsuser/ecom
pm2 logs ecom --lines 50
```
Cherchez l'erreur dans les logs.

### Problème : "Cannot connect to MongoDB"

**Vérifier .env.production** :
```bash
cat /home/lwsuser/ecom/.env.production
```

Assurez-vous que `MONGODB_URI` est correct.

### Problème : Le build échoue

**Nettoyer et rebuild** :
```bash
cd /home/lwsuser/ecom
rm -rf .next node_modules
npm install
npm run build
```

### Problème : PM2 ne démarre pas

**Vérifier les erreurs** :
```bash
pm2 logs ecom --err
```

**Redémarrer PM2** :
```bash
pm2 restart ecom
```

### Problème : Les images ne s'affichent pas

**Vérifier que le dossier existe** :
```bash
ls -la /home/lwsuser/ecom/public/images/
```

Si le dossier est vide, retransférez les images avec WinSCP.

---

## 📞 Commandes utiles

### Voir les logs en temps réel
```bash
pm2 logs ecom
```

### Redémarrer l'application
```bash
pm2 restart ecom
```

### Arrêter l'application
```bash
pm2 stop ecom
```

### Voir le statut
```bash
pm2 status
```

### Voir l'utilisation des ressources
```bash
pm2 monit
```

---

## 🔐 Sécurité

### Changer le mot de passe admin

1. Connectez-vous à l'admin
2. Allez dans **Paramètres** ou **Changer le mot de passe**
3. Changez `Admin2025` par un mot de passe sécurisé

### Sauvegarder régulièrement

Gardez une copie locale de votre site :
1. Dans WinSCP
2. Sélectionnez le dossier `ecom` (panneau droit)
3. Glissez-déposez vers votre PC (panneau gauche)

---

## 📚 Ressources

- **WinSCP Documentation** : https://winscp.net/eng/docs/
- **PM2 Documentation** : https://pm2.keymetrics.io/docs/
- **Guide complet** : Voir `GUIDE_DEPLOIEMENT_SIMPLE.md`

---

## ✅ Checklist finale

- [ ] WinSCP installé et configuré
- [ ] Connexion VPS fonctionne
- [ ] Fichiers transférés
- [ ] npm install réussi
- [ ] npm run build réussi
- [ ] PM2 status = online
- [ ] Site accessible sur http://lasuitechic.online
- [ ] Images s'affichent
- [ ] Admin fonctionne
- [ ] Mot de passe admin changé

---

## 🎯 Prochaines étapes

1. ✅ Ajoutez vos produits
2. ✅ Testez une commande complète
3. ✅ Configurez SSL/HTTPS (optionnel mais recommandé)
4. ✅ Partagez votre site sur les réseaux sociaux

**Bonne vente ! 🚀**
